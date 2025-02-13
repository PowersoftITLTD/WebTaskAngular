import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionableComponent } from './actionable.component';

describe('ActionableComponent', () => {
  let component: ActionableComponent;
  let fixture: ComponentFixture<ActionableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
