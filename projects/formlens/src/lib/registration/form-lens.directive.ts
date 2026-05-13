import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';

import { FormLensRegistry } from '../core/formlens.registry';
import { FormLensRegisteredForm } from '../core/formlens.types';
import {
  createFormLensId,
  normalizeFormLensName,
} from './form-lens-registration.utils';
import { InvalidControlHighlightService } from '../highlight/invalid-control-highlight.service';

@Directive({
  selector: 'form[formGroup][formLens]',
  standalone: true,
})
export class FormLensDirective implements OnInit {
  readonly formLensName = input<string>('');

  private readonly registry = inject(FormLensRegistry);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElement = inject<ElementRef<HTMLFormElement>>(ElementRef);
  private readonly formGroupDirective = inject(FormGroupDirective, {
    self: true,
    optional: true,
  });
  private readonly highlightService = inject(InvalidControlHighlightService);

  private readonly formId = createFormLensId();

  ngOnInit(): void {
    if (!this.formGroupDirective) {
      throw new Error(
        '[FormLens] The formLens directive requires a host element with [formGroup].'
      );
    }

    this.registerForm();

    const formElement = this.hostElement.nativeElement;

    // setTimeout garante que o DOM dos [formControlName] já foi renderizado
    // antes do primeiro sync de highlight
    setTimeout(() => {
      this.highlightService.sync(this.formGroupDirective!, formElement);
    }, 0);

    this.formGroupDirective.statusChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.highlightService.sync(this.formGroupDirective!, formElement);
      });

    this.formGroupDirective.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.highlightService.sync(this.formGroupDirective!, formElement);
      });

    this.destroyRef.onDestroy(() => {
      this.highlightService.clear(formElement);
      this.registry.unregister(this.formId);
    });
  }

  private registerForm(): void {
    const registration: FormLensRegisteredForm = {
      id: this.formId,
      name: normalizeFormLensName(this.formLensName()),
      source: this.formGroupDirective!,
      createdAt: Date.now(),
    };

    this.registry.register(registration);
  }
}