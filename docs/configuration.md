# Configuration

FormLens is designed to work with zero configuration. This page documents all available options and their current implementation status.

---

## Zero-config setup

The minimal setup requires no configuration at all:

```ts
import { provideFormLens } from 'form-lens-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideFormLens()],
};
```

With no config, FormLens will:
- auto-inject the FAB button in the bottom-right corner of the page
- open the inspector panel when the FAB is clicked
- highlight invalid controls in the DOM

---

## Full config reference

```ts
provideFormLens({
  overlayInvalidControls: true,
});
```

### `overlayInvalidControls`

**Type:** `boolean`  
**Default:** `true`  
**Status:** ✅ Implemented

When `true`, FormLens applies a visible outline to any invalid control registered via `formLens` while the inspector is open. The highlight is automatically cleared when the panel is closed or the directive is destroyed.

```ts
provideFormLens({ overlayInvalidControls: false }); // disables highlight
```

---

## Reserved options (not yet active)

The following options are declared in the config type but are **not yet implemented**. They are reserved for upcoming releases and have no effect if set.

### `enabled`

**Type:** `boolean`  
**Default:** `true`  
**Status:** 🔜 Reserved

Intended to allow disabling FormLens entirely from config (for example, using an environment variable to prevent it from loading in staging environments).

```ts
// Future use — no effect today
provideFormLens({ enabled: false });
```

### `panelPosition`

**Type:** `'left' | 'right'`  
**Default:** `'right'`  
**Status:** 🔜 Reserved

Intended to control which side of the viewport the inspector panel appears on.

### `hotkey`

**Type:** `string`  
**Default:** `'ctrl+shift+f'`  
**Status:** 🔜 Reserved

Intended to configure a keyboard shortcut to open and close the panel.

### `detailLevel`

**Type:** `'minimal' | 'detailed'`  
**Default:** `'detailed'`  
**Status:** 🔜 Reserved

Intended to toggle between a compact view (status and value only) and the full detailed view (all state flags, validators, errors).

---

## Environment-based enabling

A common pattern for dev-only tools is to conditionally register the provider:

```ts
import { provideFormLens } from 'form-lens-angular';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    ...(isDevMode() ? [provideFormLens()] : []),
  ],
};
```

This ensures FormLens is never bundled or initialized in production builds.

---

## Naming registered forms

Use `formLensName` on each directive instance to give forms readable names in the panel:

```html
<form [formGroup]="checkoutForm" formLens formLensName="Checkout">
  <!-- ... -->
</form>

<form [formGroup]="addressForm" formLens formLensName="Shipping address">
  <!-- ... -->
</form>
```

When `formLensName` is omitted or set to an empty string, the form appears as **"Untitled form"** in the inspector.
