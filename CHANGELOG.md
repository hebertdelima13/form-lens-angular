# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

_Nothing pending yet._

---

## 0.1.0-alpha.2 — 2026-05-18

### Added
- Floating action button (FAB) auto-injected via `APP_INITIALIZER` — no manual setup required.
- Close button (X) in the panel header, synchronized with the FAB via `isOpen` signal.
- Validator names now visible in the control snapshot (`validators` field).
- Tree expand/collapse per node.
- Demo app rewritten with three complex forms: Checkout (nested groups + FormArray), Registration (cross-field validators), and Survey (dynamic FormArray of FormGroups).
- Unit tests for `StatusBadgeComponent`, `ControlDetailsComponent`, `ControlTreeComponent`, `control-tree-filter.utils`, `FormSnapshotStore`, and `ControlSnapshotFactory` — 59 test cases total.

### Changed
- Minimum supported Angular version lowered from 21 to **17** (`peerDependencies` updated to `>=17.0.0`).
- `provideAppInitializer` replaced with `APP_INITIALIZER` for Angular 17+ compatibility.
- `FormLensFabComponent` removed from public API — it is an internal implementation detail.
- `FormLensConfig` fields not yet implemented (`enabled`, `panelPosition`, `hotkey`, `detailLevel`) marked with `@reserved` JSDoc.
- `highlightGroup` and `highlightArray` rewritten to use exact `[formControlName="name"]` queries and DOM position for array items — fixes incorrect element targeting in nested groups and FormArrays.
- Initial highlight sync deferred with `setTimeout(0)` to ensure DOM is ready before scanning.

### Fixed
- Highlight not disappearing when a required field became valid.
- Wrong element being highlighted when multiple controls existed inside a FormGroup.
- FormArray items not being highlighted due to Angular rendering `[formGroupName]` as a dynamic binding not queryable by attribute value.
- `NG0600` error on Angular 17 caused by signal writes inside a reactive context — fixed by using `effect()` with `allowSignalWrites: true` in `FormSnapshotStore`.
- Double `refreshSnapshot()` call when `_selectedFormId` was unset — fixed by adding an early `return` after setting the initial form id.
- FAB icon stuck on X after navigating away from a form — fixed by subscribing to `overlayRef.detachments()` to sync `isOpen` when the CDK disposes the overlay externally.

### Known limitations
- `enabled`, `panelPosition`, `hotkey`, and `detailLevel` config options are declared but not yet implemented.
- Highlight toggle from inside the panel is not available yet.
- Panel position is fixed to the right side.
- Current support is focused on Angular Reactive Forms only.

---

## 0.1.0-alpha.1 — 2026-05-11

### Added
- Initial Angular Reactive Forms inspection MVP.
- Support for `FormControl`, `FormGroup`, and `FormArray`.
- Form registration through the `formLens` directive.
- Overlay-based inspection panel.
- Form tree visualization with path-based snapshots.
- Control details view with value, status, flags, and errors.
- Search by control name or path.
- Optional invalid control highlight in the host application UI.
- Demo app with multiple forms and nested structures.
- Initial test coverage for provider, registry, snapshot factory, and directive.
- Initial documentation with README and quick start guide.

### Changed
- Overlay behavior updated to remain persistent during form interaction.
- Panel scrolling improved for long technical content.
- Public API reduced to a smaller, more stable surface for early adopters.

### Notes
- This is an alpha release intended for internal validation and early feedback.
- The main goal of this version is to validate usefulness and developer experience in real Angular projects.
