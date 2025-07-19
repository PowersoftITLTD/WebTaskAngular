import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertUpdateMasterComponent } from './insert-update-master.component';

describe('InsertUpdateMasterComponent', () => {
  let component: InsertUpdateMasterComponent;
  let fixture: ComponentFixture<InsertUpdateMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertUpdateMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertUpdateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
