export function createFormLensId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `formlens-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function normalizeFormLensName(name: string | null | undefined): string {
  const value = name?.trim();

  if (!value) {
    return 'Untitled form';
  }

  return value;
}