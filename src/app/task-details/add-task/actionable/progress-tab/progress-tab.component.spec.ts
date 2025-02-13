import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTabComponent } from './progress-tab.component';

describe('ProgressTabComponent', () => {
  let component: ProgressTabComponent;
  let fixture: ComponentFixture<ProgressTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
