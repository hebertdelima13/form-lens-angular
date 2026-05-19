import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { FormLensPanelComponent } from './formlens-panel.component';
import { FormSnapshotStore } from '../inspector/form-snapshot.store';
import { FormLensOverlayService } from './formlens-overlay.service';
import { ControlSnapshot } from '../core/formlens.types';

interface FormOption {
  id: string;
  name: string;
}

// ── helpers ────────────────────────────────────────────────────────────────

function makeSnapshot(overrides: Partial<ControlSnapshot> = {}): ControlSnapshot {
  return {
    id: 'snap-root',
    name: 'root',
    path: 'root',
    kind: 'group',
    value: {},
    status: 'VALID',
    valid: true,
    invalid: false,
    dirty: false,
    touched: false,
    pending: false,
    disabled: false,
    errors: null,
    validators: [],
    children: [],
    ...overrides,
  };
}

function makeForm(id: string, name: string): FormOption {
  return { id, name };
}

// ── stub factories ─────────────────────────────────────────────────────────

function makeSnapshotStoreStub() {
  return {
    forms: signal<FormOption[]>([]),
    selectedFormId: signal<string | null>(null),
    selectedNodePath: signal<string | null>(null),
    searchQuery: signal(''),
    filteredSnapshot: signal<ControlSnapshot | null>(null),
    selectedNode: signal<ControlSnapshot | null>(null),
    selectForm: vi.fn(),
    selectNode: vi.fn(),
    setSearchQuery: vi.fn(),
    refreshSnapshot: vi.fn(),
  };
}

function makeOverlayServiceStub() {
  return {
    close: vi.fn(),
    open: vi.fn(),
    toggle: vi.fn(),
    isOpen: signal(false),
  };
}

// ── suite ──────────────────────────────────────────────────────────────────

describe('FormLensPanelComponent', () => {
  let storeStub: ReturnType<typeof makeSnapshotStoreStub>;
  let overlayStub: ReturnType<typeof makeOverlayServiceStub>;

  beforeEach(async () => {
    storeStub = makeSnapshotStoreStub();
    overlayStub = makeOverlayServiceStub();

    await TestBed.configureTestingModule({
      imports: [FormLensPanelComponent],
      providers: [
        { provide: FormSnapshotStore, useValue: storeStub },
        { provide: FormLensOverlayService, useValue: overlayStub },
      ],
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(FormLensPanelComponent);
    fixture.detectChanges();
    return fixture;
  }

  // ── renderização inicial ──────────────────────────────────────────────────

  describe('initial render', () => {
    it('should create the component', () => {
      const fixture = createComponent();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render the panel header with FormLens title', () => {
      const fixture = createComponent();
      const title = fixture.nativeElement.querySelector('.formlens-panel__title');
      expect(title?.textContent).toContain('Reactive Forms Inspector');
    });

    it('should render the close button', () => {
      const fixture = createComponent();
      const btn = fixture.nativeElement.querySelector('.formlens-panel__close');
      expect(btn).toBeTruthy();
    });

    it('should show "No forms registered." when forms list is empty', () => {
      const fixture = createComponent();
      const empty = fixture.nativeElement.querySelector('.formlens-panel__empty');
      expect(empty?.textContent).toContain('No forms registered.');
    });

    it('should not show the select when there are no forms', () => {
      const fixture = createComponent();
      const select = fixture.nativeElement.querySelector('#formlens-form-select');
      const options = select?.querySelectorAll('option');
      expect(options?.length ?? 0).toBe(0);
    });
  });

  // ── lista de forms ────────────────────────────────────────────────────────

  describe('forms list', () => {
    it('should render one <option> per registered form', () => {
      storeStub.forms.set([makeForm('f1', 'Checkout'), makeForm('f2', 'Registration')]);
      const fixture = createComponent();
      const options = fixture.nativeElement.querySelectorAll('#formlens-form-select option');
      expect(options.length).toBe(2);
    });

    it('should display the form name in each option', () => {
      storeStub.forms.set([makeForm('f1', 'Checkout')]);
      const fixture = createComponent();
      const option = fixture.nativeElement.querySelector('#formlens-form-select option');
      expect(option?.textContent?.trim()).toBe('Checkout');
    });

    it('should not render "No forms registered." when forms exist', () => {
      storeStub.forms.set([makeForm('f1', 'My Form')]);
      const fixture = createComponent();
      const empties = fixture.nativeElement.querySelectorAll('.formlens-panel__empty');
      const texts = Array.from(empties).map((el: any) => el.textContent?.trim());
      expect(texts).not.toContain('No forms registered.');
    });
  });

  // ── seleção de form ───────────────────────────────────────────────────────

  describe('form selection', () => {
    it('should call store.selectForm() with the selected value on change', () => {
      storeStub.forms.set([makeForm('f1', 'Form 1'), makeForm('f2', 'Form 2')]);
      const fixture = createComponent();
      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector('#formlens-form-select');

      select.value = 'f2';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(storeStub.selectForm).toHaveBeenCalledWith('f2');
    });
  });

  // ── busca ─────────────────────────────────────────────────────────────────

  describe('search', () => {
    it('should render the search input', () => {
      const fixture = createComponent();
      const input = fixture.nativeElement.querySelector('#formlens-search');
      expect(input).toBeTruthy();
    });

    it('should call store.setSearchQuery() on input event', () => {
      const fixture = createComponent();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#formlens-search');

      input.value = 'address';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(storeStub.setSearchQuery).toHaveBeenCalledWith('address');
    });

    it('should reflect the searchQuery signal value in the input', () => {
      storeStub.searchQuery.set('email');
      const fixture = createComponent();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#formlens-search');
      expect(input.value).toBe('email');
    });
  });

  // ── meta bar (status + path) ───────────────────────────────────────────────

  describe('meta bar', () => {
    it('should show "No active form" when selectedNode is null', () => {
      storeStub.selectedNode.set(null);
      const fixture = createComponent();
      const path = fixture.nativeElement.querySelector('.formlens-panel__path');
      expect(path?.textContent?.trim()).toBe('No active form');
    });

    it('should show the selected node path when a node is selected', () => {
      storeStub.selectedNode.set(makeSnapshot({ path: 'address.city' }));
      const fixture = createComponent();
      const path = fixture.nativeElement.querySelector('.formlens-panel__path');
      expect(path?.textContent?.trim()).toBe('address.city');
    });
  });

  // ── árvore de controles ───────────────────────────────────────────────────

  describe('control tree', () => {
    it('should render formlens-control-tree when filteredSnapshot is set', () => {
      storeStub.filteredSnapshot.set(makeSnapshot());
      const fixture = createComponent();
      const tree = fixture.nativeElement.querySelector('formlens-control-tree');
      expect(tree).toBeTruthy();
    });

    it('should render "No controls found." when filteredSnapshot is null', () => {
      storeStub.filteredSnapshot.set(null);
      const fixture = createComponent();
      const empties = fixture.nativeElement.querySelectorAll('.formlens-panel__empty');
      const texts = Array.from(empties).map((el: any) => el.textContent?.trim());
      expect(texts).toContain('No controls found.');
    });

    it('should call store.selectNode() with the node path when selectNode event fires', () => {
      const snapshot = makeSnapshot({ path: 'address' });
      storeStub.filteredSnapshot.set(snapshot);
      const fixture = createComponent();

      const treeDebug = fixture.debugElement.query(By.css('formlens-control-tree'));
      treeDebug?.triggerEventHandler('selectNode', snapshot);
      fixture.detectChanges();

      expect(storeStub.selectNode).toHaveBeenCalledWith('address');
    });
  });

  // ── painel de detalhes ─────────────────────────────────────────────────────

  describe('details panel', () => {
    it('should render formlens-control-details', () => {
      const fixture = createComponent();
      const details = fixture.nativeElement.querySelector('formlens-control-details');
      expect(details).toBeTruthy();
    });
  });

  // ── fechar painel ─────────────────────────────────────────────────────────

  describe('close', () => {
    it('should call overlayService.close() when the close button is clicked', () => {
      const fixture = createComponent();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.formlens-panel__close');
      btn.click();
      expect(overlayStub.close).toHaveBeenCalledTimes(1);
    });
  });
});
