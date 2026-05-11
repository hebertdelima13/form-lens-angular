import { Component, input } from '@angular/core';

@Component({
  selector: 'formlens-status-badge',
  standalone: true,
  template: `
    <span class="formlens-status-badge" [class]="statusClass()">
      {{ status() || 'UNKNOWN' }}
    </span>
  `,
  styles: [`
    .formlens-status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.02em;
      border: 1px solid transparent;
    }

    .status-valid {
      background: #dcfce7;
      color: #166534;
      border-color: #bbf7d0;
    }

    .status-invalid {
      background: #fee2e2;
      color: #991b1b;
      border-color: #fecaca;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
      border-color: #fde68a;
    }

    .status-disabled {
      background: #e2e8f0;
      color: #475569;
      border-color: #cbd5e1;
    }

    .status-unknown {
      background: #e0f2fe;
      color: #0c4a6e;
      border-color: #bae6fd;
    }
  `],
})
export class StatusBadgeComponent {
  readonly status = input<string>('');

  statusClass(): string {
    switch ((this.status() || '').toUpperCase()) {
      case 'VALID':
        return 'status-valid';
      case 'INVALID':
        return 'status-invalid';
      case 'PENDING':
        return 'status-pending';
      case 'DISABLED':
        return 'status-disabled';
      default:
        return 'status-unknown';
    }
  }
}