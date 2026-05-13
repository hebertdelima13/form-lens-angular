import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { ControlSnapshot } from '../core/formlens.types';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'formlens-control-details',
  standalone: true,
  imports: [JsonPipe, StatusBadgeComponent],
  template: `
    @if (snapshot(); as node) {
      <section class="formlens-details">
        <header class="formlens-details__header">
          <div>
            <p class="formlens-details__eyebrow">Selected control</p>
            <h3 class="formlens-details__title">{{ node.name }}</h3>
          </div>

          <formlens-status-badge [status]="node.status" />
        </header>

        <div class="formlens-details__grid">
          <div><strong>Path:</strong> {{ node.path }}</div>
          <div><strong>Kind:</strong> {{ node.kind }}</div>
          <div><strong>Dirty:</strong> {{ node.dirty }}</div>
          <div><strong>Touched:</strong> {{ node.touched }}</div>
          <div><strong>Pending:</strong> {{ node.pending }}</div>
          <div><strong>Disabled:</strong> {{ node.disabled }}</div>
        </div>

        @if (node.validators.length) {
          <div class="formlens-details__block">
            <p class="formlens-details__label">Validators</p>
            <div class="formlens-details__tags">
              @for (v of node.validators; track v) {
                <span class="formlens-details__tag">{{ v }}</span>
              }
            </div>
          </div>
        }

        <div class="formlens-details__block">
          <p class="formlens-details__label">Errors</p>
          <pre>{{ node.errors | json }}</pre>
        </div>

        <div class="formlens-details__block">
          <p class="formlens-details__label">Value</p>
          <pre>{{ node.value | json }}</pre>
        </div>
      </section>
    } @else {
      <section class="formlens-details formlens-details--empty">
        <p>Select a control to inspect its details.</p>
      </section>
    }
  `,
  styleUrl: './control-details.component.scss',
})
export class ControlDetailsComponent {
  readonly snapshot = input<ControlSnapshot | null>(null);
}