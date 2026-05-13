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
    this.highlightTree(formGroupDirective.control, formElement, formElement);
  }

  clear(formElement: HTMLElement): void {
    formElement
      .querySelectorAll(`.${FORMLENS_INVALID_CONTROL_CLASS}`)
      .forEach((el) => this.renderer.removeClass(el, FORMLENS_INVALID_CONTROL_CLASS));
  }

  /**
   * Percorre recursivamente a árvore de AbstractControl.
   *
   * @param control  — controle atual
   * @param formRoot — elemento raiz do <form> (usado para busca de fallback)
   * @param container — elemento DOM de escopo atual (afunila a cada FormGroup aninhado)
   */
  private highlightTree(
    control: AbstractControl,
    formRoot: HTMLElement,
    container: HTMLElement,
  ): void {
    if (control instanceof FormGroup) {
      for (const [name, child] of Object.entries(control.controls)) {
        // Tenta encontrar o elemento [formGroupName] para afunilar o escopo
        const groupEl = container.querySelector<HTMLElement>(`[formGroupName="${name}"]`);
        // Se achou o sub-container, desce com ele; senão usa o container atual
        const nextContainer = groupEl ?? container;
        this.highlightTree(child, formRoot, nextContainer);
      }
    } else if (control instanceof FormArray) {
      const arrayEl = container.querySelector<HTMLElement>(`[formArrayName]`) ?? container;
      control.controls.forEach((child, index) => {
        this.highlightArrayItem(child, arrayEl, index);
      });
    } else {
      // FormControl folha — só age se inválido
      if (!control.invalid) return;

      // Busca primeiro dentro do container atual (escopo estreito)
      // e só depois faz fallback para a raiz do form
      const el =
        container.querySelector<HTMLElement>(`[formControlName]`) !== null
          ? this.findControlInContainer(container, formRoot)
          : null;

      if (el) {
        this.renderer.addClass(el, FORMLENS_INVALID_CONTROL_CLASS);
      }
    }
  }

  /**
   * Para FormControl dentro de FormGroup, encontra o input/select/textarea
   * mais próximo dentro do container de escopo.
   */
  private findControlInContainer(
    container: HTMLElement,
    formRoot: HTMLElement,
  ): HTMLElement | null {
    // Prefere o [formControlName] dentro do container estreito
    const byAttr = container.querySelector<HTMLElement>('[formControlName]');
    if (byAttr) return byAttr;

    // Fallback: primeiro campo interativo no container
    return container.querySelector<HTMLElement>('input, select, textarea');
  }

  /**
   * Para itens de FormArray, encontra e destaca o n-ésimo filho.
   */
  private highlightArrayItem(
    control: AbstractControl,
    arrayContainer: HTMLElement,
    index: number,
  ): void {
    if (!control.invalid) return;

    if (control instanceof FormGroup) {
      // Item do array é um FormGroup — busca pelo [formGroupName="index"] ou nth dentro do array
      const groupEl =
        arrayContainer.querySelector<HTMLElement>(`[formGroupName="${index}"]`) ??
        this.findNthFormGroupInArray(arrayContainer, index);

      if (groupEl) {
        this.renderer.addClass(groupEl, FORMLENS_INVALID_CONTROL_CLASS);
      }
    } else {
      // Item do array é um FormControl direto
      const el = this.findNthFormControlInArray(arrayContainer, index);
      if (el) {
        this.renderer.addClass(el, FORMLENS_INVALID_CONTROL_CLASS);
      }
    }
  }

  private findNthFormGroupInArray(container: HTMLElement, index: number): HTMLElement | null {
    const groups = container.querySelectorAll('[formGroupName]');
    return (groups[index] as HTMLElement) ?? null;
  }

  private findNthFormControlInArray(container: HTMLElement, index: number): HTMLElement | null {
    const controls = container.querySelectorAll('input, select, textarea, [formControlName]');
    return (controls[index] as HTMLElement) ?? null;
  }

  private ensureGlobalStyles(): void {
    if (this.document.getElementById('formlens-highlight-styles')) return;

    const styleEl = this.renderer.createElement('style') as HTMLStyleElement;
    styleEl.id = 'formlens-highlight-styles';
    styleEl.textContent = FORMLENS_HIGHLIGHT_GLOBAL_STYLES;
    this.renderer.appendChild(this.document.head, styleEl);
  }
}