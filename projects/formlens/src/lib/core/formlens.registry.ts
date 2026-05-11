import { Injectable, signal } from '@angular/core';
import { FormLensRegisteredForm } from './formlens.types';

@Injectable({
  providedIn: 'root',
})
export class FormLensRegistry {
  private readonly _forms = signal<FormLensRegisteredForm[]>([]);

  readonly forms = this._forms.asReadonly();

  register(form: FormLensRegisteredForm): void {
    const forms = this._forms();
    const exists = forms.some((item) => item.id === form.id);

    if (exists) {
      this._forms.set(
        forms.map((item) => (item.id === form.id ? form : item))
      );
      return;
    }

    this._forms.set([...forms, form]);
  }

  unregister(formId: string): void {
    this._forms.set(this._forms().filter((item) => item.id !== formId));
  }

  getById(formId: string): FormLensRegisteredForm | undefined {
    return this._forms().find((item) => item.id === formId);
  }

  clear(): void {
    this._forms.set([]);
  }
}