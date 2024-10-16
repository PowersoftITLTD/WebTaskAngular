import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveTaskManagementComponent } from './recursive-task-management.component';

describe('RecursiveTaskManagementComponent', () => {
  let component: RecursiveTaskManagementComponent;
  let fixture: ComponentFixture<RecursiveTaskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursiveTaskManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursiveTaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
