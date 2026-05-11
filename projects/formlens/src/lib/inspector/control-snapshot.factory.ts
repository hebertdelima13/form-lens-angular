import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

import { ControlSnapshot } from '../core/formlens.types';
import {
  createControlSnapshotId,
  getControlKind,
  getFormArrayChildrenEntries,
  getFormGroupChildrenEntries,
  joinControlPath,
} from './control-tree.utils';

@Injectable({
  providedIn: 'root',
})
export class ControlSnapshotFactory {
  create(control: AbstractControl, name = 'root', parentPath = ''): ControlSnapshot {
    const kind = getControlKind(control);
    const path = parentPath ? joinControlPath(parentPath, name) : name;

    const snapshot: ControlSnapshot = {
      id: createControlSnapshotId(path, kind),
      kind,
      name,
      path,
      status: control.status,
      valid: control.valid,
      invalid: control.invalid,
      touched: control.touched,
      dirty: control.dirty,
      pending: control.pending,
      disabled: control.disabled,
      value: control.getRawValue(),
      errors: control.errors ?? null,
    };

    if (control instanceof FormGroup) {
      snapshot.children = getFormGroupChildrenEntries(control).map(
        ([childName, childControl]) =>
          this.create(childControl, childName, path)
      );
    }

    if (control instanceof FormArray) {
      snapshot.children = getFormArrayChildrenEntries(control).map(
        ([childIndex, childControl]) =>
          this.create(childControl, childIndex, path)
      );
    }

    if (control instanceof FormControl) {
      snapshot.children = undefined;
    }

    return snapshot;
  }
}