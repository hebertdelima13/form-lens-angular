import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { FormLensDirective } from 'formlens';

// Validator customizado para demonstrar visibilidade de validators
function noSpaces(control: AbstractControl): ValidationErrors | null {
  return control.value?.includes(' ') ? { noSpaces: true } : null;
}

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormLensDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  // ── 1. Checkout form ──────────────────────────────────────────────────────
  // FormGroup aninhado com endereço + FormArray de produtos
  readonly checkoutForm = new FormGroup({
    customer: new FormGroup({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)],
      }),
    }),
    shipping: new FormGroup({
      street: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d+[A-Za-z]?$/)],
      }),
      city: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      state: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      zipCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)],
      }),
    }),
    items: new FormArray([
      new FormGroup({
        product: new FormControl('Angular Course', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        qty: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1), Validators.max(99)],
        }),
        price: new FormControl(149.9, { nonNullable: true }),
      }),
    ]),
    paymentMethod: new FormControl<'credit' | 'pix' | 'boleto'>('credit', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  // ── 2. Registration form ──────────────────────────────────────────────────
  // Validators cruzados (passwordMismatch) + custom validator
  readonly registrationForm = new FormGroup(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          noSpaces,
        ],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      role: new FormControl<'admin' | 'editor' | 'viewer'>('viewer', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bio: new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(160)],
      }),
    },
    { validators: matchPasswords }
  );

  // ── 3. Survey form ────────────────────────────────────────────────────────
  // FormArray de perguntas dinâmicas com sub-grupos
  readonly surveyForm = new FormGroup({
    title: new FormControl('Developer Experience Survey', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    questions: new FormArray([
      this.createQuestion('How would you rate Angular?', 'rating'),
      this.createQuestion('What is your biggest challenge?', 'text'),
      this.createQuestion('Which features do you use most?', 'text'),
    ]),
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  get checkoutItems(): FormArray {
    return this.checkoutForm.get('items') as FormArray;
  }

  get surveyQuestions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  addItem(): void {
    this.checkoutItems.push(
      new FormGroup({
        product: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        qty: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1), Validators.max(99)],
        }),
        price: new FormControl(0, { nonNullable: true }),
      })
    );
  }

  removeItem(index: number): void {
    this.checkoutItems.removeAt(index);
  }

  addQuestion(): void {
    this.surveyQuestions.push(this.createQuestion('', 'text'));
  }

  removeQuestion(index: number): void {
    this.surveyQuestions.removeAt(index);
  }

  private createQuestion(text: string, type: string): FormGroup {
    return new FormGroup({
      text: new FormControl(text, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
      }),
      type: new FormControl(type, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      required: new FormControl(true, { nonNullable: true }),
    });
  }
}