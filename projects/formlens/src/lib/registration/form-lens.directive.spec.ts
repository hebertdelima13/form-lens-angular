import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormLensDirective } from './form-lens.directive';
import { FormLensRegistry } from '../core/formlens.registry';
import { provideFormLens } from '../core/formlens.provider';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormLensDirective],
  template: `
    <form [formGroup]="form" formLens formLensName="Profile form">
      <input formControlName="name" />
    </form>
  `,
})
class TestHostComponent {
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
  });
}

describe('FormLensDirective', () => {
  let registry: FormLensRegistry;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideFormLens()],
    }).compileComponents();

    registry = TestBed.inject(FormLensRegistry);
  });

  it('should register the form on init', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const forms = registry.forms();

    expect(forms.length).toBe(1);
    expect(forms[0].name).toBe('Profile form');
    expect(forms[0].source.control).toBeTruthy();
  });

  it('should unregister the form on destroy', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(registry.forms().length).toBe(1);

    fixture.destroy();

    expect(registry.forms().length).toBe(0);
  });
});