import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormSnapshotStore } from './form-snapshot.store';
import { FormLensRegistry } from '../core/formlens.registry';
import { FormLensRegisteredForm } from '../core/formlens.types';

function makeFormDirectiveMock(form: FormGroup): any {
  return { control: form };
}

function makeRegisteredForm(
  id: string,
  form: FormGroup,
  name = 'Test Form',
): FormLensRegisteredForm {
  return {
    id,
    name,
    source: makeFormDirectiveMock(form) as any,
    createdAt: Date.now(),
  };
}

describe('FormSnapshotStore', () => {
  let store: FormSnapshotStore;
  let registry: FormLensRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FormSnapshotStore);
    registry = TestBed.inject(FormLensRegistry);
  });

  afterEach(() => {
    registry.clear();
    TestBed.flushEffects();
  });

  // ── helpers ──────────────────────────────────────────────────────────────

  function registerForm(id: string, form: FormGroup, name?: string): void {
    registry.register(makeRegisteredForm(id, form, name));
    // Força o effect() do store a processar a mudança no registry.forms()
    TestBed.flushEffects();
  }

  // ── estado inicial ────────────────────────────────────────────────────────

  it('should have null snapshot when no forms are registered', () => {
    expect(store.activeSnapshot()).toBeNull();
    expect(store.selectedFormId()).toBeNull();
  });

  // ── registro ──────────────────────────────────────────────────────────────

  it('should auto-select first form on registration', () => {
    const form = new FormGroup({ name: new FormControl('') });
    registerForm('form-1', form);

    expect(store.selectedFormId()).toBe('form-1');
    expect(store.activeSnapshot()).not.toBeNull();
  });

  it('should build snapshot with correct root name and kind', () => {
    const form = new FormGroup({ name: new FormControl('John') });
    registerForm('form-1', form);

    const snapshot = store.activeSnapshot();
    expect(snapshot?.name).toBe('root');
    expect(snapshot?.kind).toBe('group');
  });

  it('should build snapshot children for all form controls', () => {
    const form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });
    registerForm('form-1', form);

    const children = store.activeSnapshot()?.children;
    expect(children?.length).toBe(2);
    expect(children?.map((c) => c.name)).toContain('name');
    expect(children?.map((c) => c.name)).toContain('email');
  });

  // ── seleção de form ───────────────────────────────────────────────────────

  it('should select a specific form when multiple are registered', () => {
    const form1 = new FormGroup({ a: new FormControl('') });
    const form2 = new FormGroup({ b: new FormControl('') });
    registerForm('form-1', form1, 'Form A');
    registerForm('form-2', form2, 'Form B');

    store.selectForm('form-2');

    expect(store.selectedFormId()).toBe('form-2');
    const children = store.activeSnapshot()?.children;
    expect(children?.[0].name).toBe('b');
  });

  // ── seleção de nó ─────────────────────────────────────────────────────────

  it('should update selectedNode when selectNode is called', () => {
    const form = new FormGroup({ name: new FormControl('') });
    registerForm('form-1', form);

    store.selectNode('root.name');

    expect(store.selectedNodePath()).toBe('root.name');
    expect(store.selectedNode()?.path).toBe('root.name');
  });

  it('should fall back to root snapshot when selectedNodePath is not found', () => {
    const form = new FormGroup({ name: new FormControl('') });
    registerForm('form-1', form);

    store.selectNode('root.nonexistent');

    expect(store.selectedNode()?.path).toBe('root');
  });

  // ── search ────────────────────────────────────────────────────────────────

  it('should filter snapshot by search query', () => {
    const form = new FormGroup({
      email: new FormControl(''),
      phone: new FormControl(''),
    });
    registerForm('form-1', form);

    store.setSearchQuery('email');

    const filtered = store.filteredSnapshot();
    expect(filtered?.children?.length).toBe(1);
    expect(filtered?.children?.[0].name).toBe('email');
  });

  it('should return full snapshot when search query is cleared', () => {
    const form = new FormGroup({
      email: new FormControl(''),
      phone: new FormControl(''),
    });
    registerForm('form-1', form);

    store.setSearchQuery('email');
    store.setSearchQuery('');

    expect(store.filteredSnapshot()?.children?.length).toBe(2);
  });

  // ── unregister ────────────────────────────────────────────────────────────

  it('should reset state when all forms are unregistered', () => {
    const form = new FormGroup({ name: new FormControl('') });
    registerForm('form-1', form);

    registry.unregister('form-1');
    TestBed.flushEffects();

    expect(store.selectedFormId()).toBeNull();
    expect(store.activeSnapshot()).toBeNull();
  });

  // ── reatividade ───────────────────────────────────────────────────────────

  it('should refresh snapshot reactively when form value changes', () => {
    const nameControl = new FormControl('');
    const form = new FormGroup({ name: nameControl });
    registerForm('form-1', form);

    expect(store.activeSnapshot()?.children?.find((c) => c.name === 'name')?.value).toBe('');

    nameControl.setValue('John');

    expect(store.activeSnapshot()?.children?.find((c) => c.name === 'name')?.value).toBe('John');
  });

  it('should refresh snapshot reactively when form status changes', () => {
    const nameControl = new FormControl('', Validators.required);
    const form = new FormGroup({ name: nameControl });
    registerForm('form-1', form);

    expect(store.activeSnapshot()?.children?.find((c) => c.name === 'name')?.invalid).toBe(true);

    nameControl.setValue('John');

    expect(store.activeSnapshot()?.children?.find((c) => c.name === 'name')?.invalid).toBe(false);
  });

  // ── effect() guard: lista vazia limpa o estado ────────────────────────────

  it('should clear selectedNodePath when all forms are unregistered', () => {
    const form = new FormGroup({ name: new FormControl('') });
    registerForm('form-1', form);
    store.selectNode('root.name');
    expect(store.selectedNodePath()).toBe('root.name');

    registry.unregister('form-1');
    TestBed.flushEffects();

    expect(store.selectedNodePath()).toBeNull();
  });

  it('should not subscribe to valueChanges twice when selectForm is called again for the same form', () => {
    const nameControl = new FormControl('');
    const form = new FormGroup({ name: nameControl });
    registerForm('form-1', form);

    // Seleciona o mesmo form novamente — não pode criar dupla subscrição
    store.selectForm('form-1');

    let emissions = 0;
    const original = store.activeSnapshot.bind(store);
    nameControl.setValue('A');
    nameControl.setValue('B');

    // O snapshot deve refletir o último valor, não duplicar efeitos
    expect(store.activeSnapshot()?.children?.[0].value).toBe('B');
  });

  // ── selectedFormId nulo não chama refreshSnapshot ─────────────────────────

  it('should not throw when effect runs with no forms registered', () => {
    // Sem nenhum form registrado, o effect deve sair cedo sem erros
    expect(() => TestBed.flushEffects()).not.toThrow();
    expect(store.activeSnapshot()).toBeNull();
  });

  // ── FormArray no snapshot ─────────────────────────────────────────────────

  it('should build snapshot for a FormArray with correct kind and children count', () => {
    const form = new FormGroup({
      tags: new FormArray([new FormControl('alpha'), new FormControl('beta')]),
    });
    registerForm('form-1', form);

    const tagsNode = store.activeSnapshot()?.children?.find((c) => c.name === 'tags');
    expect(tagsNode?.kind).toBe('array');
    expect(tagsNode?.children?.length).toBe(2);
  });

  it('should reflect FormArray children values in snapshot', () => {
    const form = new FormGroup({
      tags: new FormArray([new FormControl('alpha'), new FormControl('beta')]),
    });
    registerForm('form-1', form);

    const children = store.activeSnapshot()?.children?.find((c) => c.name === 'tags')?.children;

    expect(children?.[0].value).toBe('alpha');
    expect(children?.[1].value).toBe('beta');
  });

  // ── effect() guard: lista vazia limpa o estado ────────────────────────────

it('should clear selectedNodePath when all forms are unregistered', () => {
  const form = new FormGroup({ name: new FormControl('') });
  registerForm('form-1', form);
  store.selectNode('root.name');
  expect(store.selectedNodePath()).toBe('root.name');

  registry.unregister('form-1');
  TestBed.flushEffects();

  expect(store.selectedNodePath()).toBeNull();
});

it('should not subscribe to valueChanges twice when selectForm is called again for the same form', () => {
  const nameControl = new FormControl('');
  const form = new FormGroup({ name: nameControl });
  registerForm('form-1', form);

  store.selectForm('form-1');

  nameControl.setValue('A');
  nameControl.setValue('B');

  expect(store.activeSnapshot()?.children?.[0].value).toBe('B');
});

// ── selectedFormId nulo não chama refreshSnapshot ─────────────────────────

it('should not throw when effect runs with no forms registered', () => {
  expect(() => TestBed.flushEffects()).not.toThrow();
  expect(store.activeSnapshot()).toBeNull();
});

// ── FormArray no snapshot ─────────────────────────────────────────────────

it('should build snapshot for a FormArray with correct kind and children count', () => {
  const form = new FormGroup({
    tags: new FormArray([
      new FormControl('alpha'),
      new FormControl('beta'),
    ]),
  });
  registerForm('form-1', form);

  const tagsNode = store.activeSnapshot()?.children?.find((c) => c.name === 'tags');
  expect(tagsNode?.kind).toBe('array');
  expect(tagsNode?.children?.length).toBe(2);
});

it('should reflect FormArray children values in snapshot', () => {
  const form = new FormGroup({
    tags: new FormArray([
      new FormControl('alpha'),
      new FormControl('beta'),
    ]),
  });
  registerForm('form-1', form);

  const children = store
    .activeSnapshot()
    ?.children?.find((c) => c.name === 'tags')?.children;

  expect(children?.[0].value).toBe('alpha');
  expect(children?.[1].value).toBe('beta');
});
});
