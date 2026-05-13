import { FormGroupDirective } from '@angular/forms';

export type FormLensPanelPosition = 'left' | 'right' | 'bottom';
export type FormLensDetailLevel = 'compact' | 'detailed';
export type ControlSnapshotKind = 'control' | 'group' | 'array';

export interface FormLensConfig {
  /**
   * Whether FormLens is active. Defaults to true.
   * When false, no FAB is injected and no forms are tracked.
   * @reserved — not yet implemented
   */
  enabled?: boolean;

  /**
   * Side of the screen where the inspector panel appears.
   * @reserved — not yet implemented, panel is always on the right
   */
  panelPosition?: FormLensPanelPosition;

  /**
   * When true, invalid form controls are highlighted with an outline in the DOM.
   * Defaults to true.
   */
  overlayInvalidControls?: boolean;

  /**
   * Keyboard shortcut to toggle the inspector panel.
   * @reserved — not yet implemented
   */
  hotkey?: string;

  /**
   * Controls how much detail is shown per node in the inspector.
   * @reserved — not yet implemented
   */
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
  validators: string[];
  children?: ControlSnapshot[];
}

export const DEFAULT_FORM_LENS_CONFIG: Required<FormLensConfig> = {
  enabled: true,
  panelPosition: 'right',
  overlayInvalidControls: true,
  hotkey: 'ctrl+shift+f',
  detailLevel: 'detailed',
};