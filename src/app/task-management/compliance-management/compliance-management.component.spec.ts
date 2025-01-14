import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceManagementComponent } from './compliance-management.component';

describe('ComplianceManagementComponent', () => {
  let component: ComplianceManagementComponent;
  let fixture: ComponentFixture<ComplianceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
