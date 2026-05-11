# FormLens

FormLens is an open source debugging tool for Angular Reactive Forms.

It helps you inspect form structure, control state, validation errors, and nested form trees directly inside your app during development.

## Why FormLens

Debugging Angular forms often means checking `value`, `status`, `errors`, `dirty`, `touched`, and nested controls manually.

FormLens makes that visual by giving you:
- a side inspection panel
- form tree visualization
- live control state updates
- error visibility
- optional invalid field highlight

## Current MVP

The current MVP includes:
- Reactive Forms support
- FormControl, FormGroup, and FormArray inspection
- live panel with form tree and control details
- search by control name or path
- optional invalid control highlight
- demo app for local exploration

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

## Quick start

See the full setup guide in [docs/quick-start.md](./docs/quick-start.md).

## Status

FormLens is currently in MVP stage.
The focus is validating value quickly with Angular Reactive Forms before expanding scope.

## Roadmap

Planned next improvements include:
- tree expand and collapse
- richer validator visibility
- better highlight support for complex nested structures
- keyboard shortcut improvements
- API hardening before first public release

## Demo

Use the demo app in this repository to test:
- multiple forms on the same screen
- nested groups and arrays
- invalid field highlighting
- live state inspection

## License

MIT