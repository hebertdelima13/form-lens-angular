import { Injectable, Injector, inject, signal } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormLensPanelComponent } from './formlens-panel.component';

@Injectable({
  providedIn: 'root',
})
export class FormLensOverlayService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  private overlayRef: OverlayRef | null = null;

  readonly isOpen = signal(false);

  open(): void {
    if (this.overlayRef) {
      return;
    }

    this.overlayRef = this.overlay.create(this.buildConfig());
    this.overlayRef.attach(new ComponentPortal(FormLensPanelComponent, null, this.injector));
    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.isOpen.set(false);
    });
    this.isOpen.set(true);
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.overlayRef) {
      this.close();
      return;
    }

    this.open();
  }

  private buildConfig(): OverlayConfig {
    return {
      hasBackdrop: false,
      panelClass: ['formlens-overlay-pane'],
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.overlay.position().global().top('0').right('0').bottom('0'),
      height: '100%',
      disposeOnNavigation: true,
    };
  }
}
