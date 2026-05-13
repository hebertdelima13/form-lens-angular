import { Injectable, Injector, inject } from '@angular/core';
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

  open(): void {
    if (this.overlayRef) {
      return;
    }

    this.overlayRef = this.overlay.create(this.buildConfig());
    this.overlayRef.attach(
      new ComponentPortal(FormLensPanelComponent, null, this.injector)
    );
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
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
      positionStrategy: this.overlay
        .position()
        .global()
        .top('0')
        .right('0')
        .bottom('0'),
      // Sem width fixo aqui — o componente controla via CSS
      // height: 100% garante que o pane do CDK ocupa a viewport inteira
      height: '100%',
      disposeOnNavigation: true,
    };
  }
}