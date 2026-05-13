import { filterSnapshotTree } from './control-tree-filter.utils';
import { ControlSnapshot } from '../core/formlens.types';

function makeSnapshot(name: string, path: string, children: ControlSnapshot[] = []): ControlSnapshot {
  return {
    id: `control:${path}`,
    kind: children.length ? 'group' : 'control',
    name,
    path,
    status: 'VALID',
    valid: true,
    invalid: false,
    touched: false,
    dirty: false,
    pending: false,
    disabled: false,
    value: null,
    errors: null,
    validators: [],
    children,
  };
}

describe('filterSnapshotTree', () => {
  const tree = makeSnapshot('root', 'root', [
    makeSnapshot('customer', 'root.customer', [
      makeSnapshot('email', 'root.customer.email'),
      makeSnapshot('phone', 'root.customer.phone'),
    ]),
    makeSnapshot('address', 'root.address', [
      makeSnapshot('city', 'root.address.city'),
    ]),
  ]);

  it('should return null when snapshot is null', () => {
    expect(filterSnapshotTree(null, 'email')).toBeNull();
  });

  it('should return full tree when query is empty', () => {
    const result = filterSnapshotTree(tree, '');
    expect(result).toBe(tree);
  });

  it('should return full tree when query is only whitespace', () => {
    const result = filterSnapshotTree(tree, '   ');
    expect(result).toBe(tree);
  });

  it('should match by name', () => {
    const result = filterSnapshotTree(tree, 'email');
    expect(result).not.toBeNull();

    const customer = result!.children?.find((c) => c.name === 'customer');
    expect(customer).toBeDefined();
    expect(customer!.children?.length).toBe(1);
    expect(customer!.children?.[0].name).toBe('email');
  });

  it('should match by path', () => {
    const result = filterSnapshotTree(tree, 'address.city');
    expect(result).not.toBeNull();

    const address = result!.children?.find((c) => c.name === 'address');
    expect(address?.children?.[0].name).toBe('city');
  });

  it('should return null when query matches nothing', () => {
    const result = filterSnapshotTree(tree, 'zzz_nonexistent');
    expect(result).toBeNull();
  });

  it('should be case-insensitive', () => {
    const result = filterSnapshotTree(tree, 'EMAIL');
    expect(result).not.toBeNull();
    const customer = result!.children?.find((c) => c.name === 'customer');
    expect(customer?.children?.[0].name).toBe('email');
  });

  it('should keep parent when parent name matches even if children do not', () => {
    const result = filterSnapshotTree(tree, 'customer');
    expect(result).not.toBeNull();
    const customer = result!.children?.find((c) => c.name === 'customer');
    expect(customer).toBeDefined();
  });

  it('should return root node when root name matches', () => {
    const result = filterSnapshotTree(tree, 'root');
    expect(result?.name).toBe('root');
  });
});