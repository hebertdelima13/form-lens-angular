import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FormSnapshotStore } from '../inspector/form-snapshot.store';
import { ControlSnapshot } from '../core/formlens.types';
import { StatusBadgeComponent } from '../ui/status-badge.component';
import { ControlTreeComponent } from '../ui/control-tree.component';
import { ControlDetailsComponent } from '../ui/control-details.component';
import { FormLensOverlayService } from './formlens-overlay.service';

@Component({
  selector: 'formlens-panel',
  standalone: true,
  imports: [
    CommonModule,
    StatusBadgeComponent,
    ControlTreeComponent,
    ControlDetailsComponent,
  ],
  template: `
    <aside class="formlens-panel">
      <header class="formlens-panel__header">
        <div>
          <p class="formlens-panel__eyebrow">FormLens</p>
          <h2 class="formlens-panel__title">Reactive Forms Inspector</h2>
        </div>

        <button
          type="button"
          class="formlens-panel__close"
          (click)="close()"
          aria-label="Close FormLens"
          title="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </header>

      <section class="formlens-panel__section">
        <label class="formlens-panel__label" for="formlens-form-select">
          Registered forms
        </label>

        <select
          id="formlens-form-select"
          class="formlens-panel__select"
          [value]="selectedFormId() ?? ''"
          (change)="onSelectForm($event)"
        >
          @for (form of forms(); track form.id) {
            <option [value]="form.id">{{ form.name }}</option>
          }
        </select>

        @if (!forms().length) {
          <p class="formlens-panel__empty">No forms registered.</p>
        }
      </section>

      <section class="formlens-panel__section">
        <label class="formlens-panel__label" for="formlens-search">
          Search by name or path
        </label>

        <input
          id="formlens-search"
          class="formlens-panel__input"
          type="text"
          [value]="searchQuery()"
          (input)="onSearch($event)"
          placeholder="Ex: address.city"
        />
      </section>

      <section class="formlens-panel__section">
        <div class="formlens-panel__meta">
          <formlens-status-badge [status]="selectedNode()?.status ?? 'NO_FORM'" />
          <span class="formlens-panel__path">
            {{ selectedNode()?.path ?? 'No active form' }}
          </span>
        </div>
      </section>

      <section class="formlens-panel__content">
        <div class="formlens-panel__split">
          <div class="formlens-panel__column">
            <p class="formlens-panel__section-title">Control tree</p>

            @if (filteredSnapshot(); as snapshot) {
              <formlens-control-tree
                [snapshot]="snapshot"
                [selectedPath]="selectedNodePath()"
                (selectNode)="onSelectNode($event)"
              />
            } @else {
              <p class="formlens-panel__empty">No controls found.</p>
            }
          </div>

          <div class="formlens-panel__column">
            <p class="formlens-panel__section-title">Details</p>
            <formlens-control-details [snapshot]="selectedNode()" />
          </div>
        </div>
      </section>
    </aside>
  `,
  styleUrl: './formlens-panel.component.scss',
})
export class FormLensPanelComponent {
  readonly snapshotStore = inject(FormSnapshotStore);
  private readonly overlayService = inject(FormLensOverlayService);

  readonly forms = this.snapshotStore.forms;
  readonly selectedFormId = this.snapshotStore.selectedFormId;
  readonly selectedNodePath = this.snapshotStore.selectedNodePath;
  readonly searchQuery = this.snapshotStore.searchQuery;
  readonly filteredSnapshot = this.snapshotStore.filteredSnapshot;
  readonly selectedNode = this.snapshotStore.selectedNode;

  close(): void {
    this.overlayService.close();
  }

  onSelectForm(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.snapshotStore.selectForm(target.value);
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.snapshotStore.setSearchQuery(target.value);
  }

  onSelectNode(node: ControlSnapshot): void {
    this.snapshotStore.selectNode(node.path);
  }
}