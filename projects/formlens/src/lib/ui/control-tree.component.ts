import { Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { ControlSnapshot } from '../core/formlens.types';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'formlens-control-tree',
  standalone: true,
  imports: [NgClass, StatusBadgeComponent],
  template: `
    @if (snapshot(); as node) {
      <div class="formlens-tree">
        <div class="formlens-tree__row">
          @if (node.children?.length) {
            <button
              type="button"
              class="formlens-tree__toggle"
              [ngClass]="{ 'is-open': expanded() }"
              (click)="toggleExpand($event)"
              [attr.aria-label]="expanded() ? 'Collapse' : 'Expand'"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M2 3l3 4 3-4H2z"/>
              </svg>
            </button>
          } @else {
            <span class="formlens-tree__toggle-spacer"></span>
          }

          <button
            type="button"
            class="formlens-tree__node"
            [ngClass]="{
              'is-selected': selectedPath() === node.path,
              'is-invalid': node.invalid,
              'is-pending': node.pending,
              'is-disabled': node.disabled
            }"
            (click)="selectNode.emit(node)"
          >
            <div class="formlens-tree__main">
              <span class="formlens-tree__name">{{ node.name }}</span>
              <span class="formlens-tree__kind">{{ node.kind }}</span>
            </div>

            <div class="formlens-tree__meta">
              <formlens-status-badge [status]="node.status" />
            </div>
          </button>
        </div>

        @if (node.children?.length && expanded()) {
          <div class="formlens-tree__children">
            @for (child of node.children; track child.id) {
              <formlens-control-tree
                [snapshot]="child"
                [selectedPath]="selectedPath()"
                (selectNode)="selectNode.emit($event)"
              />
            }
          </div>
        }
      </div>
    }
  `,
  styleUrl: './control-tree.component.scss',
})
export class ControlTreeComponent {
  readonly snapshot = input<ControlSnapshot | null>(null);
  readonly selectedPath = input<string | null>(null);
  readonly selectNode = output<ControlSnapshot>();

  // Começa expandido por padrão para o root; nós filhos começam colapsados
  readonly expanded = signal(true);

  toggleExpand(event: Event): void {
    event.stopPropagation();
    this.expanded.update((v) => !v);
  }
}