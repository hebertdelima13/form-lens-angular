import { TestBed } from '@angular/core/testing';
import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { FormLensOverlayService } from './formlens-overlay.service';

function makeOverlayRefStub() {
  const detachments$ = new Subject<void>();
  return {
    attach: vi.fn(),
    dispose: vi.fn(),
    detachments: vi.fn().mockReturnValue(detachments$.asObservable()),
    _detachments$: detachments$,
  };
}

describe('FormLensOverlayService', () => {
  let service: FormLensOverlayService;
  let overlayRefStub: ReturnType<typeof makeOverlayRefStub>;

  beforeEach(() => {
    overlayRefStub = makeOverlayRefStub();

    TestBed.configureTestingModule({
      imports: [OverlayModule],
    });

    service = TestBed.inject(FormLensOverlayService);

    const overlay = (service as any).overlay;
    vi.spyOn(overlay, 'create').mockReturnValue(overlayRefStub as unknown as OverlayRef);
  });

  // ── estado inicial ─────────────────────────────────────────────────────────

  it('should start with isOpen as false', () => {
    expect(service.isOpen()).toBe(false);
  });

  // ── open() ─────────────────────────────────────────────────────────────────

  it('open() should set isOpen to true', () => {
    service.open();
    expect(service.isOpen()).toBe(true);
  });

  it('open() should attach a ComponentPortal to the overlay', () => {
    service.open();
    expect(overlayRefStub.attach).toHaveBeenCalledTimes(1);
  });

  it('open() called twice should not create a second overlay', () => {
    const overlay = (service as any).overlay;
    service.open();
    service.open();
    expect(overlay.create).toHaveBeenCalledTimes(1);
    expect(overlayRefStub.attach).toHaveBeenCalledTimes(1);
  });

  it('open() called twice should not change isOpen', () => {
    service.open();
    service.open();
    expect(service.isOpen()).toBe(true);
  });

  // ── close() ────────────────────────────────────────────────────────────────

  it('close() should set isOpen to false', () => {
    service.open();
    service.close();
    expect(service.isOpen()).toBe(false);
  });

  it('close() should call dispose() on the overlayRef', () => {
    service.open();
    service.close();
    expect(overlayRefStub.dispose).toHaveBeenCalledTimes(1);
  });

  it('close() without prior open() should not throw', () => {
    expect(() => service.close()).not.toThrow();
    expect(service.isOpen()).toBe(false);
  });

  // ── toggle() ───────────────────────────────────────────────────────────────

  it('toggle() should open when closed', () => {
    service.toggle();
    expect(service.isOpen()).toBe(true);
  });

  it('toggle() should close when open', () => {
    service.open();
    service.toggle();
    expect(service.isOpen()).toBe(false);
  });

  it('toggle() open → close should call dispose()', () => {
    service.open();
    service.toggle();
    expect(overlayRefStub.dispose).toHaveBeenCalledTimes(1);
  });

  // ── detachments() — sync externo (disposeOnNavigation) ────────────────────

  it('should set isOpen to false when CDK disposes the overlay externally', () => {
    service.open();
    expect(service.isOpen()).toBe(true);

    overlayRefStub._detachments$.next();

    expect(service.isOpen()).toBe(false);
  });

  it('should clear internal overlayRef when CDK disposes externally', () => {
    service.open();
    overlayRefStub._detachments$.next();

    const overlay = (service as any).overlay;
    vi.mocked(overlay.create).mockClear();
    overlayRefStub.attach.mockClear();

    service.open();
    expect(overlay.create).toHaveBeenCalledTimes(1);
  });

  it('should not leave isOpen stuck on true after navigation-triggered close', () => {
    service.open();
    overlayRefStub._detachments$.next();

    expect(service.isOpen()).toBe(false);
  });
});