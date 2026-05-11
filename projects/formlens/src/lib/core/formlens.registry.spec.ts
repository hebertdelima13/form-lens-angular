import { TestBed } from '@angular/core/testing';
import { FormLensRegistry } from './formlens.registry';
import { FormLensRegisteredForm } from './formlens.types';

describe('FormLensRegistry', () => {
  let registry: FormLensRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    registry = TestBed.inject(FormLensRegistry);
  });

  function createMockForm(
    id: string,
    name: string
  ): FormLensRegisteredForm {
    return {
      id,
      name,
      source: {} as any,
      createdAt: Date.now(),
    };
  }

  it('should register a form', () => {
    const form = createMockForm('form-1', 'Profile form');

    registry.register(form);

    expect(registry.forms().length).toBe(1);
    expect(registry.forms()[0].id).toBe('form-1');
  });

  it('should replace an existing form with the same id', () => {
    registry.register(createMockForm('form-1', 'Old name'));
    registry.register(createMockForm('form-1', 'New name'));

    expect(registry.forms().length).toBe(1);
    expect(registry.forms()[0].name).toBe('New name');
  });

  it('should unregister a form by id', () => {
    registry.register(createMockForm('form-1', 'Profile form'));

    registry.unregister('form-1');

    expect(registry.forms().length).toBe(0);
  });

  it('should clear all forms', () => {
    registry.register(createMockForm('form-1', 'Form A'));
    registry.register(createMockForm('form-2', 'Form B'));

    registry.clear();

    expect(registry.forms().length).toBe(0);
  });

  it('should return a form by id', () => {
    const form = createMockForm('form-1', 'Profile form');
    registry.register(form);

    const found = registry.getById('form-1');

    expect(found).toEqual(form);
  });
});