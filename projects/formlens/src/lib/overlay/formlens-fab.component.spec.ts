import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { FormLensFabComponent } from './formlens-fab.component';
import { FormLensOverlayService } from './formlens-overlay.service';

function makeOverlayServiceMock(isOpenValue = false) {
  return {
    isOpen: signal(isOpenValue),
    toggle: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
  };
}

describe('FormLensFabComponent', () => {
  let fixture: ComponentFixture<FormLensFabComponent>;
  let overlayMock: ReturnType<typeof makeOverlayServiceMock>;

  function setup(isOpen = false) {
    overlayMock = makeOverlayServiceMock(isOpen);

    TestBed.configureTestingModule({
      imports: [FormLensFabComponent],
      providers: [
        { provide: FormLensOverlayService, useValue: overlayMock },
      ],
    });

    fixture = TestBed.createComponent(FormLensFabComponent);
    fixture.detectChanges();
  }

  // ── ícones ────────────────────────────────────────────────────────────────

  it('should render the magnifier icon when overlay is closed', () => {
    setup(false);
    const svg = fixture.nativeElement.querySelector('svg');
    // Magnifier tem <circle> — X não tem
    expect(svg.querySelector('circle')).not.toBeNull();
  });

  it('should render the X icon when overlay is open', () => {
    setup(true);
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.querySelector('circle')).toBeNull();
  });

  // ── classe CSS ────────────────────────────────────────────────────────────

  it('should not have .is-open class when overlay is closed', () => {
    setup(false);
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('is-open')).toBe(false);
  });

  it('should have .is-open class when overlay is open', () => {
    setup(true);
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('is-open')).toBe(true);
  });

  // ── interação ─────────────────────────────────────────────────────────────

  it('should call overlayService.toggle() when button is clicked', () => {
    setup(false);
    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(overlayMock.toggle).toHaveBeenCalledTimes(1);
  });

  // ── acessibilidade ────────────────────────────────────────────────────────

  it('should have aria-label on the button', () => {
    setup(false);
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });

  // ── reatividade ───────────────────────────────────────────────────────────

  it('should update icon reactively when isOpen signal changes', () => {
    setup(false);

    // Fechado → magnifier
    let svg = fixture.nativeElement.querySelector('svg');
    expect(svg.querySelector('circle')).not.toBeNull();

    // Abre
    overlayMock.isOpen.set(true);
    fixture.detectChanges();

    svg = fixture.nativeElement.querySelector('svg');
    expect(svg.querySelector('circle')).toBeNull();
  });
});