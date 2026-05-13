import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormLensOverlayService } from './formlens-overlay.service';

@Component({
  selector: 'formlens-fab',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      type="button"
      class="formlens-fab"
      [ngClass]="{ 'is-open': overlayService.isOpen() }"
      (click)="overlayService.toggle()"
      aria-label="Toggle FormLens inspector"
      title="Toggle FormLens"
    >
      <span class="formlens-fab__icon" aria-hidden="true">
        @if (overlayService.isOpen()) {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        } @else {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
          </svg>
        }
      </span>
      <span class="formlens-fab__label">FormLens</span>
    </button>
  `,
  styles: [`
    .formlens-fab {
      all: unset;
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #1e293b;
      color: #f8fafc;
      border-radius: 99px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.3);
      font-family: Inter, system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
      user-select: none;
    }

    .formlens-fab:hover {
      background: #334155;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.35);
    }

    .formlens-fab:active {
      transform: translateY(0);
    }

    .formlens-fab.is-open {
      background: #2563eb;
    }

    .formlens-fab.is-open:hover {
      background: #1d4ed8;
    }

    .formlens-fab__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }

    .formlens-fab__label {
      line-height: 1;
    }
  `],
})
export class FormLensFabComponent {
  readonly overlayService = inject(FormLensOverlayService);
}