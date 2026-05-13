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

    // Caminha recursivamente pela árvore de controles e faz highlight
    this.highlightTree(formGroupDirective.control, formElement, '');
  }

  clear(formElement: HTMLElement): void {
    const highlighted = formElement.querySelectorAll(
      `.${FORMLENS_INVALID_CONTROL_CLASS}`
    );

    highlighted.forEach((element) => {
      this.renderer.removeClass(element, FORMLENS_INVALID_CONTROL_CLASS);
    });
  }

  /**
   * Percorre recursivamente a árvore de AbstractControl e aplica highlight
   * nos elementos DOM correspondentes quando o controle é inválido.
   *
   * Estratégia de busca DOM:
   *   1. [formControlName="name"]         — controle direto em FormGroup
   *   2. [formGroupName="name"]            — FormGroup aninhado
   *   3. [formArrayName="name"]            — FormArray
   *   4. Para itens de FormArray: busca pelo índice de posição relativa
   *      dentro do elemento pai marcado com [formArrayName]
   */
  private highlightTree(
    control: AbstractControl,
    formElement: HTMLElement,
    path: string
  ): void {
    if (control instanceof FormGroup) {
      for (const [name, child] of Object.entries(control.controls)) {
        this.highlightTree(child, formElement, name);
      }
    } else if (control instanceof FormArray) {
      // FormArray em si não tem elemento DOM direto — só os filhos
      control.controls.forEach((child, index) => {
        this.highlightArrayItem(child, formElement, path, index);
      });
    } else {
      // FormControl folha
      if (!control.invalid) {
        return;
      }

      const el = this.findElementByAttr(formElement, 'formControlName', path);
      if (el) {
        this.renderer.addClass(el, FORMLENS_INVALID_CONTROL_CLASS);
      }
    }
  }

  /**
   * Para itens de FormArray, encontra o container [formArrayName]
   * e depois localiza o n-ésimo filho interativo.
   */
  private highlightArrayItem(
    control: AbstractControl,
    formElement: HTMLElement,
    arrayName: string,
    index: number
  ): void {
    if (!control.invalid) {
      return;
    }

    // Tenta encontrar o container do array
    const arrayContainer = arrayName
      ? this.findElementByAttr(formElement, 'formArrayName', arrayName)
      : formElement;

    if (!arrayContainer) {
      return;
    }

    if (control instanceof FormGroup) {
      // Grupos dentro de array: busca pelo formGroupName="index" ou nth-child
      const groupEl =
        this.findElementByAttr(arrayContainer as HTMLElement, 'formGroupName', String(index)) ??
        this.findNthFormGroupInArray(arrayContainer as HTMLElement, index);

      if (groupEl) {
        this.renderer.addClass(groupEl, FORMLENS_INVALID_CONTROL_CLASS);
      }
    } else {
      // Control direto dentro do array
      const el = this.findNthFormControlInArray(arrayContainer as HTMLElement, index);
      if (el) {
        this.renderer.addClass(el, FORMLENS_INVALID_CONTROL_CLASS);
      }
    }
  }

  private findElementByAttr(
    container: HTMLElement,
    attr: string,
    value: string
  ): HTMLElement | null {
    if (!value && value !== '0') {
      return null;
    }
    return container.querySelector(`[${attr}="${value}"]`) as HTMLElement | null;
  }

  private findNthFormGroupInArray(
    arrayContainer: HTMLElement,
    index: number
  ): HTMLElement | null {
    const groups = arrayContainer.querySelectorAll('[formGroupName]');
    return (groups[index] as HTMLElement) ?? null;
  }

  private findNthFormControlInArray(
    arrayContainer: HTMLElement,
    index: number
  ): HTMLElement | null {
    const controls = arrayContainer.querySelectorAll(
      'input, select, textarea, [formControlName]'
    );
    return (controls[index] as HTMLElement) ?? null;
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