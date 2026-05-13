import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;
  let component: StatusBadgeComponent;

  function createComponent(status: string): void {
    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    });
  });

  it('should render VALID status with correct class and text', () => {
    createComponent('VALID');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.classList).toContain('status-valid');
    expect(el.textContent?.trim()).toBe('VALID');
  });

  it('should render INVALID status with correct class', () => {
    createComponent('INVALID');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.classList).toContain('status-invalid');
  });

  it('should render PENDING status with correct class', () => {
    createComponent('PENDING');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.classList).toContain('status-pending');
  });

  it('should render DISABLED status with correct class', () => {
    createComponent('DISABLED');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.classList).toContain('status-disabled');
  });

  it('should render unknown status with fallback class', () => {
    createComponent('NO_FORM');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.classList).toContain('status-unknown');
  });

  it('should render UNKNOWN when status is empty string', () => {
    createComponent('');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.textContent?.trim()).toBe('UNKNOWN');
    expect(el.classList).toContain('status-unknown');
  });

  it('should be case-insensitive for status input', () => {
    createComponent('valid');

    const el: HTMLElement = fixture.nativeElement.querySelector('.formlens-status-badge');
    expect(el.classList).toContain('status-valid');
  });
});