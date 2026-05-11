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
        <button
          type="button"
          class="formlens-tree__node"
          [ngClass]="{
            'is-selected': selectedPath() === node.path,
            'is-invalid': node.invalid
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

        @if (node.children?.length) {
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
}