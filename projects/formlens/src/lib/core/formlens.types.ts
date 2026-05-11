import { FormGroupDirective } from '@angular/forms';

export type FormLensPanelPosition = 'left' | 'right' | 'bottom';
export type FormLensDetailLevel = 'compact' | 'detailed';
export type ControlSnapshotKind = 'control' | 'group' | 'array';

export interface FormLensConfig {
  enabled?: boolean;
  panelPosition?: FormLensPanelPosition;
  overlayInvalidControls?: boolean;
  hotkey?: string;
  detailLevel?: FormLensDetailLevel;
}

export interface FormLensRegisteredForm {
  id: string;
  name: string;
  source: FormGroupDirective;
  createdAt: number;
}

export interface ControlSnapshot {
  id: string;
  kind: ControlSnapshotKind;
  name: string;
  path: string;
  status: string;
  valid: boolean;
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
  pending: boolean;
  disabled: boolean;
  value: unknown;
  errors: Record<string, unknown> | null;
  children?: ControlSnapshot[];
}

export const DEFAULT_FORM_LENS_CONFIG: Required<FormLensConfig> = {
  enabled: true,
  panelPosition: 'right',
  overlayInvalidControls: true,
  hotkey: 'ctrl+shift+f',
  detailLevel: 'detailed',
};