import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalTempelateComponent } from './add-approval-tempelate.component';

describe('AddApprovalTempelateComponent', () => {
  let component: AddApprovalTempelateComponent;
  let fixture: ComponentFixture<AddApprovalTempelateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApprovalTempelateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApprovalTempelateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
