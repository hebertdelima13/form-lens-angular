import { describe, it, expect, vi } from 'vitest';
import { createFormLensId, normalizeFormLensName } from './form-lens-registration.utils';

describe('createFormLensId', () => {
  it('should return a non-empty string', () => {
    expect(createFormLensId().length).toBeGreaterThan(0);
  });

  it('should return unique ids on consecutive calls', () => {
    const a = createFormLensId();
    const b = createFormLensId();
    expect(a).not.toBe(b);
  });

  it('should use fallback format when crypto.randomUUID is unavailable', () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      value: {},
      configurable: true,
      writable: true,
    });

    const id = createFormLensId();
    expect(id).toMatch(/^formlens-\d+-[a-z0-9]+$/);

    Object.defineProperty(globalThis, 'crypto', {
      value: original,
      configurable: true,
      writable: true,
    });
  });
});

describe('normalizeFormLensName', () => {
  it('should return the trimmed name when provided', () => {
    expect(normalizeFormLensName('  My Form  ')).toBe('My Form');
  });

  it('should return "Untitled form" for empty string', () => {
    expect(normalizeFormLensName('')).toBe('Untitled form');
  });

  it('should return "Untitled form" for null', () => {
    expect(normalizeFormLensName(null)).toBe('Untitled form');
  });

  it('should return "Untitled form" for undefined', () => {
    expect(normalizeFormLensName(undefined)).toBe('Untitled form');
  });

  it('should return "Untitled form" for whitespace-only string', () => {
    expect(normalizeFormLensName('   ')).toBe('Untitled form');
  });
});
