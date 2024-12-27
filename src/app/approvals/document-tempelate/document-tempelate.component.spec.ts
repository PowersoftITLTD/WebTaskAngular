import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTempelateComponent } from './document-tempelate.component';

describe('DocumentTempelateComponent', () => {
  let component: DocumentTempelateComponent;
  let fixture: ComponentFixture<DocumentTempelateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTempelateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTempelateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
