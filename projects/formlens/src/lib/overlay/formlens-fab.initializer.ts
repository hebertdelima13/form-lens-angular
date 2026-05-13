import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { FormLensFabComponent } from './formlens-fab.component';

export function initFormLensFab(): () => void {
  const appRef = inject(ApplicationRef);
  const envInjector = inject(EnvironmentInjector);

  return () => {
    const fabRef: ComponentRef<FormLensFabComponent> = createComponent(
      FormLensFabComponent,
      { environmentInjector: envInjector }
    );

    appRef.attachView(fabRef.hostView);

    const domElement = fabRef.location.nativeElement as HTMLElement;
    document.body.appendChild(domElement);
  };
}