import { Component, effect, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  FormLensDirective,
  FormLensOverlayService,
} from 'formlens';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormLensDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  
  readonly overlayService = inject(FormLensOverlayService);

  readonly profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    address: new FormGroup({
      city: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      zipCode: new FormControl('', { nonNullable: true }),
    }),
    aliases: new FormArray([
      new FormControl('home', { nonNullable: true }),
      new FormControl('', { nonNullable: true }),
    ]),
  });

  readonly settingsForm = new FormGroup({
    notifications: new FormControl(true, { nonNullable: true }),
    theme: new FormControl('light', { nonNullable: true }),
  });

  addAlias(): void {
    this.aliases.push(new FormControl('', { nonNullable: true }));
  }

  openInspector(): void {
    this.overlayService.toggle();
  }

  get aliases(): FormArray<FormControl<string>> {
    return this.profileForm.get('aliases') as FormArray<FormControl<string>>;
  }
}