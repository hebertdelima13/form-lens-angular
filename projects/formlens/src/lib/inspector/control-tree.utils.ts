import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlSnapshotKind } from '../core/formlens.types';

export function getControlKind(control: AbstractControl): ControlSnapshotKind {
  if (control instanceof FormControl) {
    return 'control';
  }

  if (control instanceof FormGroup) {
    return 'group';
  }

  return 'array';
}

export function createControlSnapshotId(path: string, kind: ControlSnapshotKind): string {
  return `${kind}:${path || '$root'}`;
}

export function joinControlPath(parentPath: string, segment: string): string {
  if (!parentPath) {
    return segment;
  }

  if (!segment) {
    return parentPath;
  }

  return `${parentPath}.${segment}`;
}

export function getFormGroupChildrenEntries(
  formGroup: FormGroup
): Array<[string, AbstractControl]> {
  return Object.entries(formGroup.controls);
}

export function getFormArrayChildrenEntries(
  formArray: FormArray
): Array<[string, AbstractControl]> {
  return formArray.controls.map((control, index) => [String(index), control]);
}