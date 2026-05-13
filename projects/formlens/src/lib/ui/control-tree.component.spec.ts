import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlTreeComponent } from './control-tree.component';
import { ControlSnapshot } from '../core/formlens.types';

function makeSnapshot(overrides: Partial<ControlSnapshot> = {}): ControlSnapshot {
  return {
    id: 'group:root',
    kind: 'group',
    name: 'root',
    path: 'root',
    status: 'VALID',
    valid: true,
    invalid: false,
    touched: false,
    dirty: false,
    pending: false,
    disabled: false,
    value: {},
    errors: null,
    validators: [],
    children: [],
    ...overrides,
  };
}

function makeChildSnapshot(name: string, overrides: Partial<ControlSnapshot> = {}): ControlSnapshot {
  return {
    id: `control:root.${name}`,
    kind: 'control',
    name,
    path: `root.${name}`,
    status: 'VALID',
    valid: true,
    invalid: false,
    touched: false,
    dirty: false,
    pending: false,
    disabled: false,
    value: '',
    errors: null,
    validators: [],
    ...overrides,
  };
}

describe('ControlTreeComponent', () => {
  let fixture: ComponentFixture<ControlTreeComponent>;
  let component: ControlTreeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ControlTreeComponent],
    });

    fixture = TestBed.createComponent(ControlTreeComponent);
    component = fixture.componentInstance;
  });

  it('should render nothing when snapshot is null', () => {
    fixture.componentRef.setInput('snapshot', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.formlens-tree')).toBeNull();
  });

  it('should render the node name and kind', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot());
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.formlens-tree__name')?.textContent?.trim()).toBe('root');
    expect(el.querySelector('.formlens-tree__kind')?.textContent?.trim()).toBe('group');
  });

  it('should apply is-selected class when path matches selectedPath', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot());
    fixture.componentRef.setInput('selectedPath', 'root');
    fixture.detectChanges();

    const node = fixture.nativeElement.querySelector('.formlens-tree__node');
    expect(node.classList).toContain('is-selected');
  });

  it('should not apply is-selected when path does not match', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot());
    fixture.componentRef.setInput('selectedPath', 'root.other');
    fixture.detectChanges();

    const node = fixture.nativeElement.querySelector('.formlens-tree__node');
    expect(node.classList).not.toContain('is-selected');
  });

  it('should apply is-invalid class when node is invalid', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ invalid: true, status: 'INVALID' }));
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    const node = fixture.nativeElement.querySelector('.formlens-tree__node');
    expect(node.classList).toContain('is-invalid');
  });

  it('should apply is-disabled class when node is disabled', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ disabled: true, status: 'DISABLED' }));
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    const node = fixture.nativeElement.querySelector('.formlens-tree__node');
    expect(node.classList).toContain('is-disabled');
  });

  it('should emit selectNode when node button is clicked', () => {
    const snapshot = makeSnapshot();
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    const emitted: ControlSnapshot[] = [];
    component.selectNode.subscribe((n) => emitted.push(n));

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.formlens-tree__node');
    btn.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0].path).toBe('root');
  });

  it('should not render children when node has no children', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ children: [] }));
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.formlens-tree__children')).toBeNull();
    expect(fixture.nativeElement.querySelector('.formlens-tree__toggle')).toBeNull();
  });

  it('should render toggle button when node has children', () => {
    const snapshot = makeSnapshot({
      children: [makeChildSnapshot('name')],
    });
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.formlens-tree__toggle')).not.toBeNull();
  });

  it('should start expanded and collapse on toggle click', () => {
    const snapshot = makeSnapshot({
      children: [makeChildSnapshot('email')],
    });
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    // Começa expandido
    expect(fixture.nativeElement.querySelector('.formlens-tree__children')).not.toBeNull();

    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.formlens-tree__toggle');
    toggle.click();
    fixture.detectChanges();

    // Após clique: colapsado
    expect(fixture.nativeElement.querySelector('.formlens-tree__children')).toBeNull();
  });

  it('should re-expand after two toggle clicks', () => {
    const snapshot = makeSnapshot({
      children: [makeChildSnapshot('email')],
    });
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.formlens-tree__toggle');
    toggle.click();
    fixture.detectChanges();
    toggle.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.formlens-tree__children')).not.toBeNull();
  });

  it('should render spacer when node is a leaf (no children)', () => {
    const leaf = makeChildSnapshot('name');
    fixture.componentRef.setInput('snapshot', leaf);
    fixture.componentRef.setInput('selectedPath', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.formlens-tree__toggle-spacer')).not.toBeNull();
  });
});