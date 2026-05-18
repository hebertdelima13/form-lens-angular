# Troubleshooting

Common issues and solutions when using FormLens.

---

## Setup issues

### The FAB button does not appear

**Symptoms:** The page loads but the floating action button is not visible anywhere.

**Check:**
1. Confirm `provideFormLens()` is registered in your `app.config.ts` providers array.
2. Confirm the app is running in development mode (`isDevMode()` returns `true` if you wrapped the provider conditionally).
3. Check the browser console for Angular DI errors on startup.
4. Make sure `@angular/cdk` is installed — FormLens uses the CDK overlay.

```ts
// app.config.ts — required
providers: [provideFormLens()]
```

---

### The panel opens but no forms appear

**Symptoms:** The FAB works and the panel opens, but the form list is empty.

**Check:**
1. Confirm the form element has **both** `[formGroup]` and `formLens` on the same element.
2. Confirm `FormLensDirective` is imported in the component that owns the form.
3. Confirm the form is a Reactive Form — template-driven forms are not supported in the current alpha.

```ts
// Component — import required
imports: [ReactiveFormsModule, FormLensDirective]
```

```html
<!-- Template — both attributes required on the same element -->
<form [formGroup]="myForm" formLens formLensName="My form">
```

---

### Multiple instances of FormLens panel appear

**Symptoms:** Two or more panels stack on top of each other.

**Cause:** `provideFormLens()` was called more than once — once in the root config and again in a lazy-loaded module or child injector.

**Fix:** Call `provideFormLens()` **once**, only in the root `app.config.ts`.

---

## Highlighting issues

### Invalid fields are not highlighted

**Symptoms:** Controls are invalid (red border from your app's CSS), but the FormLens outline does not appear.

**Check:**
1. Confirm `overlayInvalidControls` is not explicitly set to `false`.
2. Confirm the control uses `formControlName` — controls bound via template-driven `ngModel` are not tracked.
3. Confirm the field is actually `INVALID` (not `PENDING`). Check the status in the inspector panel.
4. For nested `FormGroup` or `FormArray`, check that the parent form is registered with `formLens`.

---

### Highlight stays visible after the form becomes valid

**Symptoms:** The outline does not disappear after fixing a validation error.

**Cause:** This is a known limitation in the current alpha for some edge cases with dynamic form structures.

**Workaround:** Toggle the panel closed and open again to force a highlight refresh.

---

### Highlight does not appear on deeply nested controls

**Symptoms:** Top-level controls highlight correctly, but controls inside nested `FormGroup` or `FormArray` do not.

**Status:** This is a known gap in the current alpha. Improved highlight mapping for deep structures is planned for a near-term release. See `ROADMAP.md`.

---

## Inspector panel issues

### The panel does not update when I change form values

**Symptoms:** The tree or details section shows stale data that does not reflect current control values.

**Check:**
1. Make sure the form control is connected — `formControlName` must match an existing key in the parent `FormGroup`.
2. Check the browser console for `Cannot find control with name` errors.
3. If using a dynamically-built form, make sure controls are added to the `FormGroup` **before** the component mounts and the directive initializes.

---

### The selected control in the panel does not match what I clicked

**Symptoms:** Clicking a node in the tree selects a different node.

**Cause:** This can happen with deep nested paths that share a prefix (e.g., `address` and `address.street`).

**Workaround:** Use the search box to locate the specific path and click from the filtered result.

---

### Panel scroll does not work

**Symptoms:** The panel is open but the content is cut off and cannot be scrolled.

**Check:**
1. Confirm no global CSS in your app sets `overflow: hidden` on `body` or a high-level container.
2. Check if your app's CDK overlay configuration overrides scroll strategy.

---

## Build and packaging issues

### `Cannot find module 'form-lens-angular'`

**Symptoms:** TypeScript compilation fails with a module resolution error after installation.

**Check:**
1. Run `npm install` to ensure the package is installed.
2. Check your `tsconfig.json` for `paths` aliases that might intercept the import.
3. If testing locally with `npm pack`, make sure you ran `ng build formlens --configuration production` first and linked the dist folder correctly.

---

### Tree-shakeable warnings in build output

**Symptoms:** The Angular build emits warnings about non-tree-shakeable providers.

**Cause:** The FAB initializer uses `APP_INITIALIZER`, which is not tree-shakeable by default.

**Status:** This is a known constraint in the current alpha architecture. The warning is harmless for a dev-only tool.

---

## Getting more help

If none of the above resolves your issue:

1. Check the [GitHub Issues](https://github.com/hebertdelima13/form-lens-angular/issues) to see if it has been reported.
2. Open a new issue with:
   - Angular version and FormLens version
   - Minimal reproduction (component + template)
   - Browser console errors
   - Description of expected vs. actual behavior
