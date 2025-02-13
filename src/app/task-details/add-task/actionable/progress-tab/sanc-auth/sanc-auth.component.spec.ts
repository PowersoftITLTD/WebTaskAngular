import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SancAuthComponent } from './sanc-auth.component';

describe('SancAuthComponent', () => {
  let component: SancAuthComponent;
  let fixture: ComponentFixture<SancAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SancAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SancAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
