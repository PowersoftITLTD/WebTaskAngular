import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentSearchComponent } from './project-document-search.component';

describe('ProjectDocumentSearchComponent', () => {
  let component: ProjectDocumentSearchComponent;
  let fixture: ComponentFixture<ProjectDocumentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocumentSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDocumentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
