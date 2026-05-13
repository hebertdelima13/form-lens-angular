import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlDetailsComponent } from './control-details.component';
import { ControlSnapshot } from '../core/formlens.types';

function makeSnapshot(overrides: Partial<ControlSnapshot> = {}): ControlSnapshot {
  return {
    id: 'control:root.name',
    kind: 'control',
    name: 'name',
    path: 'root.name',
    status: 'INVALID',
    valid: false,
    invalid: true,
    touched: true,
    dirty: false,
    pending: false,
    disabled: false,
    value: '',
    errors: { required: true },
    validators: ['required', 'minLength'],
    ...overrides,
  };
}

describe('ControlDetailsComponent', () => {
  let fixture: ComponentFixture<ControlDetailsComponent>;
  let component: ControlDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ControlDetailsComponent],
    });

    fixture = TestBed.createComponent(ControlDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should show empty state when snapshot is null', () => {
    fixture.componentRef.setInput('snapshot', null);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Select a control to inspect');
    expect(el.querySelector('.formlens-details__title')).toBeNull();
  });

  it('should render control name and path', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot());
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.formlens-details__title')?.textContent?.trim()).toBe('name');
    expect(el.textContent).toContain('root.name');
  });

  it('should render state flags correctly', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ dirty: true, touched: true }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('true');
  });

  it('should render errors as JSON', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ errors: { required: true } }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('required');
  });

  it('should render null when errors are null', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ errors: null }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('null');
  });

  it('should render validator tags', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ validators: ['required', 'minLength'] }));
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('.formlens-details__tag');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent?.trim()).toBe('required');
    expect(tags[1].textContent?.trim()).toBe('minLength');
  });

  it('should not render validators section when validators array is empty', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ validators: [] }));
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('.formlens-details__tag');
    expect(tags.length).toBe(0);
  });

  it('should render value as JSON', () => {
    fixture.componentRef.setInput('snapshot', makeSnapshot({ value: { name: 'John' } }));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('John');
  });
});