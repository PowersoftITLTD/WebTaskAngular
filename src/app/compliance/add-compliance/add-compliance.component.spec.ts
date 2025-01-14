import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComplianceComponent } from './add-compliance.component';

describe('AddComplianceComponent', () => {
  let component: AddComplianceComponent;
  let fixture: ComponentFixture<AddComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComplianceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
