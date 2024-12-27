import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecursiveTaskNewComponent } from './add-recursive-task-new.component';

describe('AddRecursiveTaskNewComponent', () => {
  let component: AddRecursiveTaskNewComponent;
  let fixture: ComponentFixture<AddRecursiveTaskNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecursiveTaskNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecursiveTaskNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
