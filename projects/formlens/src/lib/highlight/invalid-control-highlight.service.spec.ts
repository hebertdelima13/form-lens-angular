import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  FormGroupDirective,
} from '@angular/forms';

import { InvalidControlHighlightService } from './invalid-control-highlight.service';
import { FORM_LENS_CONFIG } from '../core/formlens.tokens';
import { DEFAULT_FORM_LENS_CONFIG } from '../core/formlens.types';
import { FORMLENS_INVALID_CONTROL_CLASS } from './invalid-control-highlight.styles';

// Helper: cria um FormGroupDirective mockado apontando para o FormGroup
function makeDirectiveMock(form: FormGroup): FormGroupDirective {
  return { control: form } as unknown as FormGroupDirective;
}

// Helper: cria um elemento DOM simulando a estrutura do template
function makeFormElement(innerHTML: string): HTMLElement {
  const el = document.createElement('form');
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  return el;
}

function cleanup(el: HTMLElement): void {
  document.body.removeChild(el);
}

describe('InvalidControlHighlightService', () => {
  let service: InvalidControlHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FORM_LENS_CONFIG,
          useValue: { ...DEFAULT_FORM_LENS_CONFIG, overlayInvalidControls: true },
        },
      ],
    });
    service = TestBed.inject(InvalidControlHighlightService);
  });

  // ── sync desabilitado ─────────────────────────────────────────────────────

  it('should not highlight when overlayInvalidControls is false', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FORM_LENS_CONFIG,
          useValue: { ...DEFAULT_FORM_LENS_CONFIG, overlayInvalidControls: false },
        },
      ],
    });
    service = TestBed.inject(InvalidControlHighlightService);

    const form = new FormGroup({ name: new FormControl('', Validators.required) });
    const formEl = makeFormElement(`<input formcontrolname="name" />`);

    service.sync(makeDirectiveMock(form), formEl);

    const highlighted = formEl.querySelectorAll(`.${FORMLENS_INVALID_CONTROL_CLASS}`);
    expect(highlighted.length).toBe(0);

    cleanup(formEl);
  });

  // ── FormControl raiz ──────────────────────────────────────────────────────

  it('should highlight an invalid FormControl in the root group', () => {
    const form = new FormGroup({ name: new FormControl('', Validators.required) });
    const formEl = makeFormElement(`<input formcontrolname="name" />`);

    service.sync(makeDirectiveMock(form), formEl);

    const input = formEl.querySelector<HTMLElement>('[formcontrolname="name"]')!;
    expect(input.classList).toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  it('should not highlight a valid FormControl', () => {
    const form = new FormGroup({ name: new FormControl('John', Validators.required) });
    const formEl = makeFormElement(`<input formcontrolname="name" />`);

    service.sync(makeDirectiveMock(form), formEl);

    const input = formEl.querySelector<HTMLElement>('[formcontrolname="name"]')!;
    expect(input.classList).not.toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  it('should highlight only invalid controls — not all controls', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),   // inválido
      email: new FormControl('john@test.com', Validators.required), // válido
    });
    const formEl = makeFormElement(`
      <input formcontrolname="name" />
      <input formcontrolname="email" />
    `);

    service.sync(makeDirectiveMock(form), formEl);

    expect(
      formEl.querySelector('[formcontrolname="name"]')!.classList
    ).toContain(FORMLENS_INVALID_CONTROL_CLASS);

    expect(
      formEl.querySelector('[formcontrolname="email"]')!.classList
    ).not.toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  // ── clear ────────────────────────────────────────────────────────────────

  it('should remove highlight class on clear()', () => {
    const form = new FormGroup({ name: new FormControl('', Validators.required) });
    const formEl = makeFormElement(`<input formcontrolname="name" />`);

    service.sync(makeDirectiveMock(form), formEl);
    service.clear(formEl);

    const input = formEl.querySelector<HTMLElement>('[formcontrolname="name"]')!;
    expect(input.classList).not.toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  it('should remove previous highlight and re-apply on second sync', () => {
    const nameControl = new FormControl('', Validators.required);
    const form = new FormGroup({ name: nameControl });
    const formEl = makeFormElement(`<input formcontrolname="name" />`);

    service.sync(makeDirectiveMock(form), formEl);
    expect(
      formEl.querySelector('[formcontrolname="name"]')!.classList
    ).toContain(FORMLENS_INVALID_CONTROL_CLASS);

    nameControl.setValue('John');
    service.sync(makeDirectiveMock(form), formEl);

    expect(
      formEl.querySelector('[formcontrolname="name"]')!.classList
    ).not.toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  // ── FormGroup aninhado ────────────────────────────────────────────────────

  it('should highlight invalid control inside a nested FormGroup', () => {
    const form = new FormGroup({
      address: new FormGroup({
        city: new FormControl('', Validators.required),
      }),
    });
    const formEl = makeFormElement(`
      <fieldset formgroupname="address">
        <input formcontrolname="city" />
      </fieldset>
    `);

    service.sync(makeDirectiveMock(form), formEl);

    expect(
      formEl.querySelector('[formcontrolname="city"]')!.classList
    ).toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  it('should not highlight sibling controls in a different nested group', () => {
    const form = new FormGroup({
      billing: new FormGroup({
        city: new FormControl('', Validators.required),
      }),
      shipping: new FormGroup({
        city: new FormControl('São Paulo', Validators.required),
      }),
    });
    const formEl = makeFormElement(`
      <fieldset formgroupname="billing">
        <input formcontrolname="city" id="billing-city" />
      </fieldset>
      <fieldset formgroupname="shipping">
        <input formcontrolname="city" id="shipping-city" />
      </fieldset>
    `);

    service.sync(makeDirectiveMock(form), formEl);

    expect(formEl.querySelector('#billing-city')!.classList).toContain(FORMLENS_INVALID_CONTROL_CLASS);
    expect(formEl.querySelector('#shipping-city')!.classList).not.toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  // ── FormArray ─────────────────────────────────────────────────────────────

  it('should highlight invalid FormControl inside a FormArray item', () => {
    const form = new FormGroup({
      items: new FormArray([
        new FormGroup({
          product: new FormControl('', Validators.required),
        }),
      ]),
    });
    const formEl = makeFormElement(`
      <div formArrayName="items">
        <div>
          <input formcontrolname="product" />
        </div>
      </div>
    `);

    service.sync(makeDirectiveMock(form), formEl);

    expect(
      formEl.querySelector('[formcontrolname="product"]')!.classList
    ).toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });

  it('should not highlight valid items in a FormArray', () => {
    const form = new FormGroup({
      items: new FormArray([
        new FormGroup({
          product: new FormControl('Angular Course', Validators.required),
        }),
      ]),
    });
    const formEl = makeFormElement(`
      <div formArrayName="items">
        <div>
          <input formcontrolname="product" />
        </div>
      </div>
    `);

    service.sync(makeDirectiveMock(form), formEl);

    expect(
      formEl.querySelector('[formcontrolname="product"]')!.classList
    ).not.toContain(FORMLENS_INVALID_CONTROL_CLASS);

    cleanup(formEl);
  });
});