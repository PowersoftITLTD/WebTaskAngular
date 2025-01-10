import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstructionDialogComponent } from './add-instruction-dialog.component';

describe('AddInstructionDialogComponent', () => {
  let component: AddInstructionDialogComponent;
  let fixture: ComponentFixture<AddInstructionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInstructionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInstructionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
