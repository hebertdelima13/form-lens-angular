import { TestBed } from '@angular/core/testing';
import { FORM_LENS_CONFIG } from './formlens.tokens';
import { provideFormLens } from './formlens.provider';

describe('provideFormLens', () => {
  it('should provide default config values', () => {
    TestBed.configureTestingModule({
      providers: [provideFormLens()],
    });

    const config = TestBed.inject(FORM_LENS_CONFIG);

    expect(config.enabled).toBe(true);
    expect(config.panelPosition).toBe('right');
    expect(config.overlayInvalidControls).toBe(true);
    expect(config.hotkey).toBe('ctrl+shift+f');
    expect(config.detailLevel).toBe('detailed');
  });

  it('should merge custom config with defaults', () => {
    TestBed.configureTestingModule({
      providers: [
        provideFormLens({
          enabled: false,
          panelPosition: 'left',
          detailLevel: 'compact',
        }),
      ],
    });

    const config = TestBed.inject(FORM_LENS_CONFIG);

    expect(config.enabled).toBe(false);
    expect(config.panelPosition).toBe('left');
    expect(config.detailLevel).toBe('compact');
    expect(config.overlayInvalidControls).toBe(true);
    expect(config.hotkey).toBe('ctrl+shift+f');
  });
});