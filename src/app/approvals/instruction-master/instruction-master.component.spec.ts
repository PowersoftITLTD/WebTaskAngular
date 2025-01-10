import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionMasterComponent } from './instruction-master.component';

describe('InstructionMasterComponent', () => {
  let component: InstructionMasterComponent;
  let fixture: ComponentFixture<InstructionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
