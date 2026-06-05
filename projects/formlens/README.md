# FormLens

FormLens is an open source debugging tool for Angular Reactive Forms.

It helps you inspect form structure, control state, validation errors, and nested form trees directly inside your running app during development — without browser extensions or extra tooling.

## Why FormLens

Debugging Angular forms often means manually checking `value`, `status`, `errors`, `dirty`, `touched`, and deeply nested controls.

FormLens makes that visual by giving you:
- a side inspection panel with live state updates
- form tree visualization with expand/collapse
- error and validator visibility per control
- optional invalid field highlight in your app

## Requirements

- Angular **17 or higher**
- `@angular/cdk` **17 or higher**
- `rxjs` **7.4 or higher**

## Installation

```bash
npm install form-lens-angular
```

## Quick setup

Register the provider in your app config:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormLens } from 'form-lens-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormLens(),
  ],
};
```

Add the directive to any reactive form:

```ts
import { FormLensDirective } from 'form-lens-angular';

@Component({
  imports: [ReactiveFormsModule, FormLensDirective],
})
export class MyComponent {
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}
```

```html
<form [formGroup]="form" formLens formLensName="My form">
  <input formControlName="name" />
  <input formControlName="email" />
</form>
```

> `formLensName` sets the label shown in the panel for this form. Optional but recommended when multiple forms are registered.

A FAB will appear in the bottom-right corner. Click it to open the inspector.

## Configuration

```ts
provideFormLens({
  overlayInvalidControls: true, // highlight invalid fields in the DOM (default: true)
})
```

> `enabled`, `panelPosition`, `hotkey`, and `detailLevel` are declared but not yet implemented. Reserved for upcoming releases.

## Status

Version `0.1.0-alpha.3` — alpha stage. Expect breaking changes between alpha releases.

## Feedback

Open an issue or start a discussion on [GitHub](https://github.com/hebertdelima13/form-lens-angular).

## License

MIT