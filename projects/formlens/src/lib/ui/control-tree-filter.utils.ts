import { ControlSnapshot } from '../core/formlens.types';

export function filterSnapshotTree(
  snapshot: ControlSnapshot | null,
  query: string
): ControlSnapshot | null {
  if (!snapshot) {
    return null;
  }

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return snapshot;
  }

  const matches =
    snapshot.name.toLowerCase().includes(normalizedQuery) ||
    snapshot.path.toLowerCase().includes(normalizedQuery);

  const children = snapshot.children
    ?.map((child) => filterSnapshotTree(child, normalizedQuery))
    .filter((child): child is ControlSnapshot => child !== null);

  if (matches || (children && children.length > 0)) {
    return {
      ...snapshot,
      children,
    };
  }

  return null;
}