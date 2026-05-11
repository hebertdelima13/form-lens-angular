import { TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ControlSnapshotFactory } from './control-snapshot.factory';

describe('ControlSnapshotFactory', () => {
  let factory: ControlSnapshotFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    factory = TestBed.inject(ControlSnapshotFactory);
  });

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

    const nameNode = snapshot.children?.find((child) => child.name === 'name');
    const addressNode = snapshot.children?.find((child) => child.name === 'address');
    const aliasesNode = snapshot.children?.find((child) => child.name === 'aliases');

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
    const emailNode = snapshot.children?.find((child) => child.name === 'email');

    expect(emailNode?.errors).toEqual({ required: true });
    expect(emailNode?.status).toBe('INVALID');
  });
});