# Architecture

This document describes the internal structure of FormLens for contributors and maintainers.

> This document covers internals. If you want to use FormLens, see [Quick Start](./quick-start.md) or the [API Reference](./api-reference.md).

---

## Overview

FormLens is a single Angular library (`form-lens-angular`) organized into six internal areas. Each area has a clear boundary and a focused responsibility.

```
form-lens-angular/
├── core/          — config, tokens, DI provider, registry
├── registration/  — directive and form lifecycle integration
├── inspector/     — snapshots, selected state, search derivation
├── overlay/       — FAB button and panel open/close
├── highlight/     — DOM outline for invalid controls
└── ui/            — panel, tree, details, and status components
```

---

## Core

**Path:** `src/lib/core/`

Owns the foundational pieces that everything else depends on.

| File | Responsibility |
|------|----------------|
| `formlens.config.ts` | `FormLensConfig` interface definition |
| `formlens.tokens.ts` | Angular injection tokens (`FORMLENS_CONFIG`) |
| `formlens.provider.ts` | `provideFormLens()` — composes all providers and initializers |
| `formlens.registry.ts` | `FormLensRegistry` — stores registered `FormGroup` references |
| `formlens.types.ts` | Shared internal types |

The registry is the central state for which forms are currently active on the page. It is a simple signal-based map of `{ id, name, formGroup }` entries. The inspector reads from the registry; the directive writes to it.

---

## Registration

**Path:** `src/lib/registration/`

Bridges Angular's Reactive Forms API with FormLens.

| File | Responsibility |
|------|----------------|
| `form-lens.directive.ts` | `FormLensDirective` — attaches to `[formGroup]` elements |
| `form-lens-registration.utils.ts` | ID generation and name resolution utilities |

The directive runs `ngOnInit` to register the form, `ngOnChanges` to keep the name in sync, and `ngOnDestroy` to clean up the registry entry and highlight state. It does not hold state itself — it delegates everything to the registry and highlight service.

---

## Inspector

**Path:** `src/lib/inspector/`

Produces a reactive snapshot of form state for display in the panel.

| File | Responsibility |
|------|----------------|
| `form-snapshot.store.ts` | Reactive store: selected form, active snapshot, search |
| `control-snapshot.factory.ts` | Builds `ControlSnapshot` trees from a `AbstractControl` |
| `control-snapshot.model.ts` | `ControlSnapshot` type definition |
| `control-tree.utils.ts` | Tree traversal and path lookup utilities |
| `control-tree-filter.utils.ts` | Search filtering logic over snapshot trees |

### Snapshot model

A `ControlSnapshot` is a plain serializable object representing the state of a single control at a point in time:

```ts
interface ControlSnapshot {
  name: string;
  path: string;
  kind: 'control' | 'group' | 'array';
  value: unknown;
  status: string;
  valid: boolean;
  invalid: boolean;
  dirty: boolean;
  pristine: boolean;
  touched: boolean;
  untouched: boolean;
  pending: boolean;
  disabled: boolean;
  enabled: boolean;
  errors: Record<string, unknown> | null;
  validators: string[];
  children: ControlSnapshot[];
}
```

Snapshots are rebuilt reactively whenever `valueChanges` or `statusChanges` emits on the selected form. The store subscribes to these observables and triggers a full snapshot rebuild.

### Store flow

```
FormLensRegistry (signal)
       │
       ▼
FormSnapshotStore (effect)
  ├── auto-selects first form when registry changes
  ├── subscribes to valueChanges + statusChanges of selected form
  ├── rebuilds ControlSnapshot tree on each emission
  └── derives filteredSnapshot from search query (computed)
```

---

## Overlay

**Path:** `src/lib/overlay/`

Controls the lifecycle of the inspector panel using Angular CDK.

| File | Responsibility |
|------|----------------|
| `formlens-overlay.service.ts` | Opens, closes, and toggles the CDK overlay |
| `formlens-fab.component.ts` | Floating action button — icon synced to `isOpen` signal |
| `formlens-fab.initializer.ts` | `APP_INITIALIZER` that injects the FAB into the DOM at startup |

The overlay service creates a CDK `OverlayRef` on `open()` and destroys it on `close()`. It subscribes to `overlayRef.detachments()` to handle cases where the CDK disposes the overlay externally (e.g., on route navigation), keeping `isOpen` in sync.

The FAB is injected once at app startup via `APP_INITIALIZER`. It is not part of any component tree — it is appended directly to `document.body` via `createComponent`.

---

## Highlight

**Path:** `src/lib/highlight/`

Maps invalid `AbstractControl` instances to their DOM elements and applies an outline.

| File | Responsibility |
|------|----------------|
| `invalid-control-highlight.service.ts` | Queries DOM elements and manages outline styles |

The highlight service receives the root `nativeElement` of the registered form and searches for `[formControlName]` elements whose corresponding control is `INVALID`. It applies a CSS class or inline style outline and clears it on demand.

Known limitation: deep `FormArray` with dynamically-added controls can produce stale highlight state in the current alpha.

---

## UI

**Path:** `src/lib/ui/`

Standalone Angular components that render the inspector panel content.

| Component | Responsibility |
|-----------|----------------|
| `formlens-panel.component.ts` | Root panel layout — form selector, search, tree, details |
| `control-tree.component.ts` | Recursive tree node — expand/collapse, selection, state classes |
| `control-details.component.ts` | Detail view for the selected `ControlSnapshot` |
| `status-badge.component.ts` | Renders a colored badge for `VALID`, `INVALID`, `PENDING`, `DISABLED` |

All components are standalone and use signal inputs (`input()`). The panel reads from `FormSnapshotStore` signals directly — no `@Input()` binding needed at the panel level.

---

## Data flow

```
User interacts with form
        │
        ▼
AbstractControl emits valueChanges / statusChanges
        │
        ▼
FormSnapshotStore rebuilds ControlSnapshot tree
        │
        ▼
Panel components read signals (filteredSnapshot, selectedNode)
        │
        ▼
DOM updates via Angular's signal-based change detection
```

---

## Key design decisions

**Snapshot-based, not live binding.** The inspector works with immutable snapshots rebuilt on each change rather than binding directly to the live `AbstractControl`. This makes the UI predictable and keeps the inspector isolated from accidental mutations.

**Signal-first.** Internal state (registry, selected form, snapshot, search) uses Angular signals and computed values. Effects are used only for side effects that require subscriptions (RxJS observables from the forms API).

**Standalone components only.** No NgModules. All components and the directive are standalone. This keeps the import surface clean and compatible with modern Angular library publishing.

**Small public API.** Only three symbols are exported as the public API: `provideFormLens`, `FormLensDirective`, and `FormLensOverlayService`. Everything else is internal. This keeps the library evolvable without breaking consumers.

---

## Running locally

```bash
# Install dependencies
npm install

# Build the library
ng build formlens --configuration production

# Run the demo app
ng serve demo

# Run tests
ng test formlens
```

To test the built package locally before publishing:

```bash
cd dist/formlens
npm pack
# then in another project:
npm install /path/to/form-lens-angular-x.x.x.tgz
```
