import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTaskInitationComponent } from './approval-task-initation.component';

describe('ApprovalTaskInitationComponent', () => {
  let component: ApprovalTaskInitationComponent;
  let fixture: ComponentFixture<ApprovalTaskInitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalTaskInitationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalTaskInitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
