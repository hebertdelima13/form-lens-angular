import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

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
      validators: extractValidatorNames(control),
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

/**
 * Tenta extrair nomes legíveis de validators de um AbstractControl.
 *
 * Angular não expõe a lista de validators diretamente na API pública.
 * A estratégia aqui é inspecionar a função composta internamente.
 * Funciona para Validators built-in e para validators nomeados customizados.
 */
function extractValidatorNames(control: AbstractControl): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (control as any)._rawValidators;

  if (!raw) {
    return [];
  }

  const list: ValidatorFn[] = Array.isArray(raw) ? raw : [raw];

  return list
    .map((fn) => resolveValidatorName(fn))
    .filter((name): name is string => name !== null);
}

function resolveValidatorName(fn: ValidatorFn): string | null {
  if (!fn) {
    return null;
  }

  // Validators built-in retornam funções com .name preenchido
  if (fn.name && fn.name !== 'bound ' && fn.name !== 'anonymous') {
    return normalizeName(fn.name);
  }

  // Validators de fábrica (ex: Validators.min(5)) têm nome vazio
  // Tentamos extrair pelo toString da função
  const src = fn.toString();
  const match = src.match(/function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/);
  if (match?.[1]) {
    return normalizeName(match[1]);
  }

  return 'custom';
}

function normalizeName(raw: string): string {
  // Remove prefixo "bound " do bind
  return raw.replace(/^bound\s+/, '').trim();
}