# Quick Start

This guide helps you get FormLens running in a minimal Angular app with Reactive Forms.

## 1. Install

```bash
npm install formlens
```

## 2. Register the provider

Add `provideFormLens()` to your application providers.

### Standalone app

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFormLens } from 'formlens';

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

Attach `formLens` to the form element.

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

## 5. Open the panel

Inject `FormLensOverlayService` and call `toggle()`.

```ts
import { Component, inject } from '@angular/core';
import { FormLensOverlayService } from 'formlens';

@Component({
  selector: 'app-root',
  template: `
    <button type="button" (click)="openInspector()">
      Open FormLens
    </button>
  `,
})
export class AppComponent {
  private readonly formLensOverlay = inject(FormLensOverlayService);

  openInspector(): void {
    this.formLensOverlay.toggle();
  }
}
```

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
  enabled: true,
  panelPosition: 'right',
  overlayInvalidControls: true,
  hotkey: 'ctrl+shift+f',
  detailLevel: 'detailed',
})
```

## Current limitations

The MVP currently focuses on Angular Reactive Forms.

Known limitations:
- tree expand and collapse is still pending
- highlight for deeply nested dynamic structures can be improved
- validator introspection is still limited
- panel preferences are not persisted yet

## Troubleshooting

### The panel opens but no forms appear
Check that:
- the form uses Reactive Forms
- the host element has `[formGroup]`
- the form also has `formLens`

### Invalid fields are not highlighted
Check that:
- `overlayInvalidControls` is enabled
- the control is actually invalid
- the field uses `formControlName`

### The panel does not update
Check that:
- the form is registered correctly
- the demo or integration is using the current library build

## Next steps

After the first successful setup, test the demo app in this repository to explore more complete form structures.