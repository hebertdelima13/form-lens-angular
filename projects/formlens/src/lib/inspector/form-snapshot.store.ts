import { Injectable, computed, effect, inject, signal, DestroyRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormLensRegistry } from '../core/formlens.registry';
import { ControlSnapshot } from '../core/formlens.types';
import { ControlSnapshotFactory } from './control-snapshot.factory';
import { filterSnapshotTree } from '../ui/control-tree-filter.utils';

@Injectable({
  providedIn: 'root',
})
export class FormSnapshotStore {
  private readonly registry = inject(FormLensRegistry);
  private readonly snapshotFactory = inject(ControlSnapshotFactory);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _selectedFormId = signal<string | null>(null);
  private readonly _activeSnapshot = signal<ControlSnapshot | null>(null);
  private readonly _selectedNodePath = signal<string | null>(null);
  private readonly _searchQuery = signal('');

  readonly selectedFormId = this._selectedFormId.asReadonly();
  readonly activeSnapshot = this._activeSnapshot.asReadonly();
  readonly selectedNodePath = this._selectedNodePath.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly forms = this.registry.forms;

  readonly selectedForm = computed(() => {
    const formId = this._selectedFormId();
    if (!formId) {
      return null;
    }

    return this.registry.getById(formId) ?? null;
  });

  readonly filteredSnapshot = computed(() =>
    filterSnapshotTree(this._activeSnapshot(), this._searchQuery())
  );

  readonly selectedNode = computed(() => {
    const snapshot = this._activeSnapshot();
    const path = this._selectedNodePath();

    if (!snapshot || !path) {
      return snapshot;
    }

    return this.findNodeByPath(snapshot, path) ?? snapshot;
  });

  constructor() {
    effect(() => {
      const forms = this.registry.forms();
      const selectedFormId = this._selectedFormId();

      if (!forms.length) {
        this._selectedFormId.set(null);
        this._activeSnapshot.set(null);
        this._selectedNodePath.set(null);
        return;
      }

      if (!selectedFormId || !forms.some((form) => form.id === selectedFormId)) {
        this._selectedFormId.set(forms[0].id);
      }

      this.refreshSnapshot();
    });
  }

  selectForm(formId: string): void {
    this._selectedFormId.set(formId);
    this.refreshSnapshot();
  }

  selectNode(path: string): void {
    this._selectedNodePath.set(path);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  refreshSnapshot(): void {
    const selected = this.selectedForm();

    if (!selected) {
      this._activeSnapshot.set(null);
      this._selectedNodePath.set(null);
      return;
    }

    const rootControl = selected.source.control;
    const snapshot = this.snapshotFactory.create(rootControl, 'root');

    this._activeSnapshot.set(snapshot);

    if (!this._selectedNodePath()) {
      this._selectedNodePath.set(snapshot.path);
    }
  }

  watch(control: AbstractControl): void {
    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshSnapshot());

    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshSnapshot());
  }

  private findNodeByPath(
    snapshot: ControlSnapshot,
    path: string
  ): ControlSnapshot | null {
    if (snapshot.path === path) {
      return snapshot;
    }

    for (const child of snapshot.children ?? []) {
      const match = this.findNodeByPath(child, path);
      if (match) {
        return match;
      }
    }

    return null;
  }
}