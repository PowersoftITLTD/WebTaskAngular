import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedTempelateComponent } from './approved-tempelate.component';

describe('ApprovedTempelateComponent', () => {
  let component: ApprovedTempelateComponent;
  let fixture: ComponentFixture<ApprovedTempelateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedTempelateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedTempelateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
