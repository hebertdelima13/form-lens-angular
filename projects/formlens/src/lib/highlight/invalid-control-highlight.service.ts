import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

import { FORM_LENS_CONFIG } from '../core/formlens.tokens';
import {
  FORMLENS_HIGHLIGHT_GLOBAL_STYLES,
  FORMLENS_INVALID_CONTROL_CLASS,
} from './invalid-control-highlight.styles';

@Injectable({
  providedIn: 'root',
})
export class InvalidControlHighlightService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly config = inject(FORM_LENS_CONFIG);

  private readonly renderer: Renderer2 =
    this.rendererFactory.createRenderer(null, null);

  constructor() {
    this.ensureGlobalStyles();
  }

  sync(formGroupDirective: FormGroupDirective, formElement: HTMLElement): void {
    if (!this.config.overlayInvalidControls) {
      this.clear(formElement);
      return;
    }

    this.clear(formElement);

    for (const controlDir of formGroupDirective.directives) {
      const control = controlDir.control;
      const controlName = controlDir.name?.toString() ?? '';

      const nativeElement =
        this.findElementByControlName(formElement, controlName);

      if (!nativeElement || !control) {
        continue;
      }

      if (control.invalid) {
        this.renderer.addClass(
          nativeElement,
          FORMLENS_INVALID_CONTROL_CLASS
        );
      }
    }
  }

  clear(formElement: HTMLElement): void {
    const highlighted = formElement.querySelectorAll(
      `.${FORMLENS_INVALID_CONTROL_CLASS}`
    );

    highlighted.forEach((element) => {
      this.renderer.removeClass(
        element,
        FORMLENS_INVALID_CONTROL_CLASS
      );
    });
  }

  private findElementByControlName(
    formElement: HTMLElement,
    controlName: string
  ): HTMLElement | null {
    if (!controlName) {
      return null;
    }

    return formElement.querySelector(
      `[formControlName="${controlName}"]`
    ) as HTMLElement | null;
  }

  private ensureGlobalStyles(): void {
    const existing = this.document.getElementById(
      'formlens-highlight-styles'
    ) as HTMLStyleElement | null;

    if (existing) {
      return;
    }

    const styleElement = this.renderer.createElement('style') as HTMLStyleElement;
    styleElement.id = 'formlens-highlight-styles';
    styleElement.textContent = FORMLENS_HIGHLIGHT_GLOBAL_STYLES;
    this.renderer.appendChild(this.document.head, styleElement);
  }
}