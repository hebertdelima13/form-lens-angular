import { TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ControlSnapshotFactory } from './control-snapshot.factory';

function noSpaces(control: AbstractControl): ValidationErrors | null {
  return control.value?.includes(' ') ? { noSpaces: true } : null;
}

describe('ControlSnapshotFactory', () => {
  let factory: ControlSnapshotFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    factory = TestBed.inject(ControlSnapshotFactory);
  });

  // ── Estrutura ──────────────────────────────────────────────────────────────

  it('should create a snapshot for a nested form tree', () => {
    const form = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      address: new FormGroup({
        city: new FormControl('Curitiba', { nonNullable: true }),
      }),
      aliases: new FormArray([
        new FormControl('home', { nonNullable: true }),
        new FormControl('', { nonNullable: true }),
      ]),
    });

    const snapshot = factory.create(form, 'root');

    expect(snapshot.kind).toBe('group');
    expect(snapshot.path).toBe('root');
    expect(snapshot.children?.length).toBe(3);

    const nameNode = snapshot.children?.find((c) => c.name === 'name');
    const addressNode = snapshot.children?.find((c) => c.name === 'address');
    const aliasesNode = snapshot.children?.find((c) => c.name === 'aliases');

    expect(nameNode?.kind).toBe('control');
    expect(nameNode?.path).toBe('root.name');
    expect(nameNode?.invalid).toBe(true);

    expect(addressNode?.kind).toBe('group');
    expect(addressNode?.children?.[0].path).toBe('root.address.city');

    expect(aliasesNode?.kind).toBe('array');
    expect(aliasesNode?.children?.[0].path).toBe('root.aliases.0');
  });

  it('should include errors when a control is invalid', () => {
    const form = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    const snapshot = factory.create(form, 'root');
    const emailNode = snapshot.children?.find((c) => c.name === 'email');

    expect(emailNode?.errors).toEqual({ required: true });
    expect(emailNode?.status).toBe('INVALID');
  });

  it('should have no children for a FormControl leaf', () => {
    const control = new FormControl('value');
    const snapshot = factory.create(control, 'field');

    expect(snapshot.kind).toBe('control');
    expect(snapshot.children).toBeUndefined();
  });

  it('should map FormArray children by index as string', () => {
    const array = new FormArray([
      new FormControl('a'),
      new FormControl('b'),
    ]);
    const snapshot = factory.create(array, 'tags');

    expect(snapshot.children?.[0].name).toBe('0');
    expect(snapshot.children?.[1].name).toBe('1');
    expect(snapshot.children?.[0].path).toBe('tags.0');
  });

  // ── Estado ─────────────────────────────────────────────────────────────────

  it('should capture touched, dirty, pending and disabled flags', () => {
    const control = new FormControl('');
    control.markAsTouched();
    control.markAsDirty();

    const snapshot = factory.create(control, 'field');

    expect(snapshot.touched).toBe(true);
    expect(snapshot.dirty).toBe(true);
    expect(snapshot.pending).toBe(false);
    expect(snapshot.disabled).toBe(false);
  });

  it('should capture disabled state', () => {
    const control = new FormControl({ value: '', disabled: true });
    const snapshot = factory.create(control, 'field');

    expect(snapshot.disabled).toBe(true);
    expect(snapshot.status).toBe('DISABLED');
  });

  it('should capture raw value including disabled controls', () => {
    const form = new FormGroup({
      active: new FormControl({ value: 'locked', disabled: true }),
      name: new FormControl('John'),
    });

    const snapshot = factory.create(form, 'root');
    // getRawValue() inclui campos disabled
    expect(snapshot.value).toEqual({ active: 'locked', name: 'John' });
  });

  // ── Validators ─────────────────────────────────────────────────────────────

  it('should list built-in validator names', () => {
    const control = new FormControl('', {
      validators: [Validators.required, Validators.email],
    });
    const snapshot = factory.create(control, 'field');

    expect(snapshot.validators).toContain('required');
    expect(snapshot.validators).toContain('email');
  });

  it('should list minLength and maxLength validators', () => {
    const control = new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(20)],
    });
    const snapshot = factory.create(control, 'field');

    expect(snapshot.validators.length).toBeGreaterThan(0);
  });

  it('should list custom named validator', () => {
    const control = new FormControl('hello world', {
      validators: [noSpaces],
    });
    const snapshot = factory.create(control, 'field');

    expect(snapshot.validators).toContain('noSpaces');
  });

  it('should return empty validators array when no validators are set', () => {
    const control = new FormControl('');
    const snapshot = factory.create(control, 'field');

    expect(snapshot.validators).toEqual([]);
  });

  it('should not include validators in children of FormControl (leaf)', () => {
    const control = new FormControl('', Validators.required);
    const snapshot = factory.create(control, 'field');

    expect(snapshot.children).toBeUndefined();
    expect(snapshot.validators).toContain('required');
  });
});