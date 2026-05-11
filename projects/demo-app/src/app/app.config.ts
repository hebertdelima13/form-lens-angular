import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFormLens } from 'formlens';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFormLens({
      enabled: isDevMode(),
      panelPosition: 'right',
      overlayInvalidControls: true,
      detailLevel: 'detailed',
    }),
  ],
};