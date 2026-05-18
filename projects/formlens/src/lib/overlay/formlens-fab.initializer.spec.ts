import { TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { initFormLensFab } from './formlens-fab.initializer';
import { FormLensOverlayService } from './formlens-overlay.service';
import { ApplicationRef } from '@angular/core';

describe('initFormLensFab', () => {
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [FormLensOverlayService],
    });
    appRef = TestBed.inject(ApplicationRef);
    vi.spyOn(appRef, 'attachView');
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.createElement('div'));
  });

  it('should inject the FAB into the DOM on invocation', () => {
    TestBed.runInInjectionContext(() => {
      const init = initFormLensFab();
      init();
    });

    expect(document.body.appendChild).toHaveBeenCalledTimes(1);
  });

  it('should attach the component view to ApplicationRef', () => {
    TestBed.runInInjectionContext(() => {
      const init = initFormLensFab();
      init();
    });

    expect(appRef.attachView).toHaveBeenCalledTimes(1);
  });
});
