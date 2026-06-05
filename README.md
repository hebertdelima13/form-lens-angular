# FormLens

FormLens is an open source debugging tool for Angular Reactive Forms.

It helps you inspect form structure, control state, validation errors, and nested form trees directly inside your app during development.

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
- `rxjs` **7.8 or higher**

## Current alpha

Version: `0.1.0-alpha.2`

The current alpha includes:
- Reactive Forms support (`FormControl`, `FormGroup`, `FormArray`)
- live panel with form tree and control details
- expand/collapse tree navigation
- search by control name or path
- validator names visible per control
- optional invalid control highlight — works with nested groups and FormArrays
- floating action button (FAB) auto-injected, no manual setup needed
- demo app for local exploration
- 162 unit tests covering core flows

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

> `formLensName` sets the label shown in the panel for this form. It is optional but recommended when multiple forms are registered.

A FAB will appear in the bottom-right corner. Click it to open the inspector.

## Configuration

```ts
provideFormLens({
  overlayInvalidControls: true, // highlight invalid fields in the DOM (default: true)
})
```

> `enabled`, `panelPosition`, `hotkey`, and `detailLevel` are declared in the config type but not yet implemented. They are reserved for upcoming releases.

- [Quick start](./docs/quick-start.md)
- [Configuration](./docs/configuration.md)
- [API reference](./docs/api-reference.md)
- [Architecture](./docs/architecture.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Roadmap](./ROADMAP.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## Status

FormLens is currently in **alpha** stage. Expect breaking changes between alpha releases.

The current focus is validating real-world usefulness for Angular Reactive Forms debugging before expanding scope or hardening the public API.

## Feedback

The most valuable feedback at this stage:
- real usage in Angular projects
- DX friction during setup
- bugs in nested or dynamic forms
- confusing inspection behavior
- missing information in the panel

Open an issue or start a discussion on GitHub.

## License

MIT
