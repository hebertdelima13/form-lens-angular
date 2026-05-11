import { InjectionToken } from '@angular/core';
import {
  DEFAULT_FORM_LENS_CONFIG,
  FormLensConfig,
} from './formlens.types';

export const FORM_LENS_CONFIG = new InjectionToken<FormLensConfig>(
  'FORM_LENS_CONFIG',
  {
    factory: () => DEFAULT_FORM_LENS_CONFIG,
  }
);