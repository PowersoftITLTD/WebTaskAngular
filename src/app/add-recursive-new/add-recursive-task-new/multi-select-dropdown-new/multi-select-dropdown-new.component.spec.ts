import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectDropdownNewComponent } from './multi-select-dropdown-new.component';

describe('MultiSelectDropdownNewComponent', () => {
  let component: MultiSelectDropdownNewComponent;
  let fixture: ComponentFixture<MultiSelectDropdownNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectDropdownNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectDropdownNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
