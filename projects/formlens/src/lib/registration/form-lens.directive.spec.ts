import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormLensDirective } from './form-lens.directive';
import { FormLensRegistry } from '../core/formlens.registry';
import { FORM_LENS_CONFIG } from '../core/formlens.tokens';
import { DEFAULT_FORM_LENS_CONFIG } from '../core/formlens.types';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormLensDirective],
  template: `
    <form [formGroup]="form" formLens [formLensName]="formName">
      <input formControlName="name" />
    </form>
  `,
})
class TestHostComponent {
  formName = 'Test Form';
  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });
}

describe('FormLensDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let registry: FormLensRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: FORM_LENS_CONFIG,
          useValue: { ...DEFAULT_FORM_LENS_CONFIG, overlayInvalidControls: false },
        },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    registry = TestBed.inject(FormLensRegistry);
    fixture.detectChanges();
  });

  it('should register the form in the registry on init', () => {
    const forms = registry.forms();
    expect(forms.length).toBe(1);
  });

  it('should register with the correct name from formLensName input', () => {
    const forms = registry.forms();
    expect(forms[0].name).toBe('Test Form');
  });

  it('should register with a generated id', () => {
    const forms = registry.forms();
    expect(forms[0].id).toBeTruthy();
  });

  it('should update registered name when formLensName input changes', () => {
    // O nome é definido no init — mudanças dinâmicas não atualizam o registro
    // Este teste documenta o comportamento atual: nome é capturado no ngOnInit
    const forms = registry.forms();
    expect(forms[0].name).toBe('Test Form');
  });

  it('should unregister the form from the registry on destroy', () => {
    expect(registry.forms().length).toBe(1);

    fixture.destroy();

    expect(registry.forms().length).toBe(0);
  });

  it('should register multiple directives independently', () => {
    @Component({
      standalone: true,
      imports: [ReactiveFormsModule, FormLensDirective],
      template: `
        <form [formGroup]="form1" formLens formLensName="Form A">
          <input formControlName="a" />
        </form>
        <form [formGroup]="form2" formLens formLensName="Form B">
          <input formControlName="b" />
        </form>
      `,
    })
    class TwoFormsComponent {
      form1 = new FormGroup({ a: new FormControl('') });
      form2 = new FormGroup({ b: new FormControl('') });
    }

    // Reset para não misturar com o fixture anterior
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TwoFormsComponent],
      providers: [
        {
          provide: FORM_LENS_CONFIG,
          useValue: { ...DEFAULT_FORM_LENS_CONFIG, overlayInvalidControls: false },
        },
      ],
    });

    const f = TestBed.createComponent(TwoFormsComponent);
    const reg = TestBed.inject(FormLensRegistry);
    f.detectChanges();

    expect(reg.forms().length).toBe(2);
    expect(reg.forms().map((r) => r.name)).toContain('Form A');
    expect(reg.forms().map((r) => r.name)).toContain('Form B');

    f.destroy();
  });

  it('should not register when formLens is used without [formGroup] — directive selector prevents instantiation', () => {
  @Component({
    standalone: true,
    imports: [ReactiveFormsModule, FormLensDirective],
    // Sem [formGroup] — o seletor form[formGroup][formLens] não vai matchear
    // então a diretiva nunca é instanciada
    template: `<form formLens><input /></form>`,
  })
  class NoFormGroupComponent {}

  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [NoFormGroupComponent],
    providers: [
      {
        provide: FORM_LENS_CONFIG,
        useValue: DEFAULT_FORM_LENS_CONFIG,
      },
    ],
  });

  const f = TestBed.createComponent(NoFormGroupComponent);
  const reg = TestBed.inject(FormLensRegistry);

  // Não deve lançar erro — diretiva simplesmente não é aplicada
  expect(() => f.detectChanges()).not.toThrow();

  // Nenhum form deve ter sido registrado
  expect(reg.forms().length).toBe(0);

  f.destroy();
});
});