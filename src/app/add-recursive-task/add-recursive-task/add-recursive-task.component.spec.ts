import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecursiveTaskComponent } from './add-recursive-task.component';

describe('AddRecursiveTaskComponent', () => {
  let component: AddRecursiveTaskComponent;
  let fixture: ComponentFixture<AddRecursiveTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecursiveTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecursiveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
