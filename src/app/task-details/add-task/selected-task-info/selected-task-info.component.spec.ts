import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedTaskInfoComponent } from './selected-task-info.component';

describe('SelectedTaskInfoComponent', () => {
  let component: SelectedTaskInfoComponent;
  let fixture: ComponentFixture<SelectedTaskInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedTaskInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedTaskInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
