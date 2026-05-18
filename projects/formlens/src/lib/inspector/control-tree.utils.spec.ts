import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect } from 'vitest';

import {
  getControlKind,
  createControlSnapshotId,
  joinControlPath,
  getFormGroupChildrenEntries,
  getFormArrayChildrenEntries,
} from './control-tree.utils';

describe('getControlKind', () => {
  it('should return "control" for FormControl', () => {
    expect(getControlKind(new FormControl(''))).toBe('control');
  });

  it('should return "group" for FormGroup', () => {
    expect(getControlKind(new FormGroup({}))).toBe('group');
  });

  it('should return "array" for FormArray', () => {
    expect(getControlKind(new FormArray<AbstractControl>([]))).toBe('array');
  });
});

describe('createControlSnapshotId', () => {
  it('should return "kind:path" when path is provided', () => {
    expect(createControlSnapshotId('root.name', 'control')).toBe('control:root.name');
  });

  it('should fallback to "$root" when path is empty', () => {
    expect(createControlSnapshotId('', 'group')).toBe('group:$root');
  });
});

describe('joinControlPath', () => {
  it('should join parent and segment with dot', () => {
    expect(joinControlPath('root', 'name')).toBe('root.name');
  });

  it('should return segment alone when parentPath is empty', () => {
    expect(joinControlPath('', 'name')).toBe('name');
  });

  it('should return parentPath alone when segment is empty', () => {
    expect(joinControlPath('root', '')).toBe('root');
  });
});

describe('getFormGroupChildrenEntries', () => {
  it('should return all controls as [key, control] tuples', () => {
    const form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });
    const entries = getFormGroupChildrenEntries(form);
    expect(entries.length).toBe(2);
    expect(entries.map(([k]) => k)).toContain('name');
    expect(entries.map(([k]) => k)).toContain('email');
  });

  it('should return empty array for empty FormGroup', () => {
    expect(getFormGroupChildrenEntries(new FormGroup({}))).toEqual([]);
  });
});

describe('getFormArrayChildrenEntries', () => {
  it('should return controls indexed as string keys', () => {
    const arr = new FormArray([new FormControl('a'), new FormControl('b')]);
    const entries = getFormArrayChildrenEntries(arr);
    expect(entries.length).toBe(2);
    expect(entries[0][0]).toBe('0');
    expect(entries[1][0]).toBe('1');
  });

  it('should return empty array for empty FormArray', () => {
    expect(getFormArrayChildrenEntries(new FormArray<AbstractControl>([])))
      .toEqual([]);
  });
});