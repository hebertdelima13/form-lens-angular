# Quick Start

This guide helps you get FormLens running in a minimal Angular app with Reactive Forms.

## 1. Install

```bash
npm install form-lens-angular
```

## 2. Register the provider

Add `provideFormLens()` to your application providers.

### Standalone app

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormLens } from 'form-lens-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormLens(),
  ],
};
```

## 3. Create a reactive form

```ts
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
})
export class App {
  readonly profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
}
```

## 4. Add the FormLens directive

Import `FormLensDirective` in your component and attach `formLens` to the form element.

```ts
import { FormLensDirective } from 'form-lens-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormLensDirective],
  templateUrl: './app.html',
})
export class App { ... }
```

```html
<form [formGroup]="profileForm" formLens formLensName="Profile form">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>

  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
</form>
```

> `formLensName` sets the label shown in the panel for this form. It is optional but recommended when multiple forms are registered on the same page.

## 5. Open the panel

A floating action button (FAB) is auto-injected into the page when `provideFormLens()` is registered — no manual setup required. Click it to open the inspector.

## 6. What you should see

When the panel opens, you should be able to:
- see registered forms on the page
- inspect the selected form tree
- select controls and view details
- search controls by name or path
- see invalid fields highlighted in the UI

## Example config

You can override defaults when registering the provider.

```ts
provideFormLens({
  overlayInvalidControls: true,
})
```

> `enabled`, `panelPosition`, `hotkey`, and `detailLevel` are declared in the config type but **not yet implemented**. They are reserved for upcoming releases and have no effect if set. See [Configuration](./configuration.md) for the full reference.

## Current limitations

The MVP currently focuses on Angular Reactive Forms.

Known limitations:
- highlight for deeply nested dynamic structures can be improved
- validator introspection is still limited
- panel preferences are not persisted yet

## Troubleshooting

### The panel opens but no forms appear
Check that:
- the form uses Reactive Forms
- the host element has `[formGroup]`
- the form also has `formLens`
- `FormLensDirective` is imported in the component

### Invalid fields are not highlighted
Check that:
- `overlayInvalidControls` is not set to `false`
- the control is actually invalid
- the field uses `formControlName`

### The panel does not update
Check that:
- the form is registered correctly
- the demo or integration is using the current library build

## Next steps

After the first successful setup, test the demo app in this repository to explore more complete form structures.
