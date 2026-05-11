# FormLens

FormLens is an open source debugging tool for Angular Reactive Forms.

It helps you inspect form structure, control state, validation errors, and nested form trees directly inside your app during development.

## Why FormLens

Debugging Angular forms often means manually checking `value`, `status`, `errors`, `dirty`, `touched`, and deeply nested controls.

FormLens makes that visual by giving you:
- a side inspection panel
- form tree visualization
- live control state updates
- error visibility
- optional invalid field highlight

## Current alpha

The current alpha includes:
- Reactive Forms support
- `FormControl`, `FormGroup`, and `FormArray` inspection
- live panel with form tree and control details
- search by control name or path
- optional invalid control highlight
- demo app for local exploration
- quick start documentation
- initial test coverage for core flows

## Installation

```bash
npm install formlens
```

## Quick setup

Register the provider in your app config:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormLens } from 'formlens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormLens(),
  ],
};
```

Add the directive to a reactive form:

```html
<form [formGroup]="profileForm" formLens formLensName="Profile form">
  <input formControlName="name" />
</form>
```

Open the inspector from your app using the overlay service:

```ts
import { Component, inject } from '@angular/core';
import { FormLensOverlayService } from 'formlens';

@Component({
  selector: 'app-root',
  template: `<button (click)="openInspector()">Open FormLens</button>`,
})
export class AppComponent {
  private readonly formLensOverlay = inject(FormLensOverlayService);

  openInspector(): void {
    this.formLensOverlay.toggle();
  }
}
```

## Documentation

- [Quick Start](./docs/quick-start.md)
- [Roadmap](./ROADMAP.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## Status

FormLens is currently in **alpha** stage.

The current focus is validating real-world usefulness for Angular Reactive Forms debugging before expanding scope or hardening the public API further.

## Roadmap highlights

Planned next improvements include:
- tree expand and collapse
- richer validator visibility
- better highlight support for complex nested structures
- more API hardening before a broader public release

## Demo

Use the demo app in this repository to test:
- multiple forms on the same screen
- nested groups and arrays
- invalid field highlighting
- live state inspection

## Feedback

At this stage, the most valuable feedback is:
- real usage in Angular projects
- DX friction during setup
- bugs in nested or dynamic forms
- confusing inspection behavior
- missing information in the panel

## License

MIT