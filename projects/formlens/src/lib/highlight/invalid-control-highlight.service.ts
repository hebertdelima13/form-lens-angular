import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormGroupDirective } from '@angular/forms';

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
    this.highlightGroup(formGroupDirective.control, formElement);
  }

  clear(formElement: HTMLElement): void {
    formElement
      .querySelectorAll(`.${FORMLENS_INVALID_CONTROL_CLASS}`)
      .forEach((el) => this.renderer.removeClass(el, FORMLENS_INVALID_CONTROL_CLASS));
  }

  /**
   * Itera os filhos de um FormGroup.
   * Para cada filho, resolve o container DOM correto e delega.
   *
   * @param group      — FormGroup a iterar
   * @param container  — elemento DOM de escopo atual ([formGroupName] ou o <form> raiz)
   */
  private highlightGroup(group: FormGroup, container: HTMLElement): void {
    for (const [name, control] of Object.entries(group.controls)) {
      if (control instanceof FormGroup) {
        // Afunila o container para o [formGroupName="name"] se existir no DOM
        const groupEl =
          container.querySelector<HTMLElement>(`[formGroupName="${name}"]`) ?? container;
        this.highlightGroup(control, groupEl);

      } else if (control instanceof FormArray) {
        const arrayEl =
          container.querySelector<HTMLElement>(`[formArrayName="${name}"]`) ?? container;
        this.highlightArray(control, arrayEl);

      } else {
        // FormControl folha — busca pelo [formControlName="name"] exato
        if (!control.invalid) continue;

        const el = container.querySelector<HTMLElement>(`[formControlName="${name}"]`);
        if (el) {
          this.renderer.addClass(el, FORMLENS_INVALID_CONTROL_CLASS);
        }
      }
    }
  }

  /**
   * Itera os filhos de um FormArray.
   * Cada filho pode ser FormControl, FormGroup ou FormArray aninhado.
   */
  private highlightArray(array: FormArray, arrayContainer: HTMLElement): void {
    array.controls.forEach((control, index) => {
      if (!control.invalid) return;

      if (control instanceof FormGroup) {
        // Grupo dentro de array — busca [formGroupName="index"] ou nth filho
        const groupEl =
          arrayContainer.querySelector<HTMLElement>(`[formGroupName="${index}"]`) ??
          this.findNthChild(arrayContainer, '[formGroupName]', index);

        if (groupEl) {
          // Descende para marcar os filhos inválidos dentro do grupo
          this.highlightGroup(control, groupEl);
        }

      } else if (control instanceof FormArray) {
        const nestedArrayEl =
          arrayContainer.querySelector<HTMLElement>(`[formArrayName="${index}"]`) ??
          arrayContainer;
        this.highlightArray(control, nestedArrayEl);

      } else {
        // FormControl direto dentro do array — busca pelo nth input/select/textarea
        const el = this.findNthChild(
          arrayContainer,
          'input, select, textarea, [formControlName]',
          index
        );
        if (el) {
          this.renderer.addClass(el, FORMLENS_INVALID_CONTROL_CLASS);
        }
      }
    });
  }

  private findNthChild(
    container: HTMLElement,
    selector: string,
    index: number
  ): HTMLElement | null {
    const nodes = container.querySelectorAll(selector);
    return (nodes[index] as HTMLElement) ?? null;
  }

  private ensureGlobalStyles(): void {
    if (this.document.getElementById('formlens-highlight-styles')) return;

    const styleEl = this.renderer.createElement('style') as HTMLStyleElement;
    styleEl.id = 'formlens-highlight-styles';
    styleEl.textContent = FORMLENS_HIGHLIGHT_GLOBAL_STYLES;
    this.renderer.appendChild(this.document.head, styleEl);
  }
}