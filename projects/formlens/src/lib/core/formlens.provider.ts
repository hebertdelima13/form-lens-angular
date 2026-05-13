import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { FORM_LENS_CONFIG } from './formlens.tokens';
import {
  DEFAULT_FORM_LENS_CONFIG,
  FormLensConfig,
} from './formlens.types';
import { initFormLensFab } from '../overlay/formlens-fab.initializer';

export function provideFormLens(
  config: FormLensConfig = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FORM_LENS_CONFIG,
      useValue: {
        ...DEFAULT_FORM_LENS_CONFIG,
        ...config,
      } satisfies FormLensConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initFormLensFab,
      multi: true,
    },
  ]);
}