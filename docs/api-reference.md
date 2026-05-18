# API Reference

This document describes the complete public API of `form-lens-angular`.

> **Alpha notice:** FormLens is currently in alpha. The public API is intentionally small and may change between alpha releases.

---

## `provideFormLens(config?)`

Registers all FormLens services and initializers in the Angular DI tree.

Call this once in your `app.config.ts` providers array.

```ts
import { provideFormLens } from 'form-lens-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormLens(),
    // or with config:
    provideFormLens({ overlayInvalidControls: true }),
  ],
};
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `FormLensConfig` | No | Optional configuration object. All fields are optional. |

### Returns

`EnvironmentProviders` — pass directly into the `providers` array.

---

## `FormLensConfig`

Configuration object passed to `provideFormLens()`.

```ts
interface FormLensConfig {
  overlayInvalidControls?: boolean;
  enabled?: boolean;
  panelPosition?: 'left' | 'right';
  hotkey?: string;
  detailLevel?: 'minimal' | 'detailed';
}
```

### Fields

| Field | Type | Default | Status | Description |
|-------|------|---------|--------|-------------|
| `overlayInvalidControls` | `boolean` | `true` | ✅ Implemented | Highlights invalid controls in the DOM with an outline. |
| `enabled` | `boolean` | `true` | 🔜 Reserved | Reserved for future use. Not yet active. |
| `panelPosition` | `'left' \| 'right'` | `'right'` | 🔜 Reserved | Reserved for future use. Not yet active. |
| `hotkey` | `string` | `'ctrl+shift+f'` | 🔜 Reserved | Reserved for future use. Not yet active. |
| `detailLevel` | `'minimal' \| 'detailed'` | `'detailed'` | 🔜 Reserved | Reserved for future use. Not yet active. |

---

## `FormLensDirective`

Selector: `[formLens]`

A structural directive that registers a `FormGroup` with the FormLens inspector. Must be applied to an element that also has `[formGroup]`.

### Import

```ts
import { FormLensDirective } from 'form-lens-angular';

@Component({
  imports: [ReactiveFormsModule, FormLensDirective],
})
```

### Usage

```html
<form [formGroup]="myForm" formLens formLensName="My Form">
  <!-- controls -->
</form>
```

### Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `formLensName` | `string` | No | `'Untitled form'` | Display name shown in the inspector panel. |

### Lifecycle

- **`ngOnInit`** — registers the form in `FormLensRegistry` and begins live state observation.
- **`ngOnChanges`** — updates the registered name when `formLensName` changes.
- **`ngOnDestroy`** — unregisters the form and clears any active highlight.

---

## `FormLensOverlayService`

Controls the visibility of the inspector panel overlay.

### Import

```ts
import { FormLensOverlayService } from 'form-lens-angular';
```

### Injection

```ts
@Component({ ... })
export class MyComponent {
  private readonly overlay = inject(FormLensOverlayService);
}
```

### Methods

#### `open()`

Opens the inspector panel. Has no effect if the panel is already open.

```ts
this.overlay.open();
```

#### `close()`

Closes the inspector panel. Has no effect if the panel is already closed.

```ts
this.overlay.close();
```

#### `toggle()`

Toggles the panel between open and closed.

```ts
this.overlay.toggle();
```

### Properties

#### `isOpen`

`Signal<boolean>` — reflects the current open/closed state of the panel. Reactive.

```ts
const open = this.overlay.isOpen; // Signal<boolean>
```

---

## Public exports summary

The following symbols are exported from `form-lens-angular`:

```ts
// Provider
export { provideFormLens } from './lib/core/formlens.provider';

// Directive
export { FormLensDirective } from './lib/registration/form-lens.directive';

// Overlay service
export { FormLensOverlayService } from './lib/overlay/formlens-overlay.service';

// Config type
export type { FormLensConfig } from './lib/core/formlens.config';
```

Everything else is internal. Do not rely on internal symbols — they are not part of the public contract and may change without notice.
