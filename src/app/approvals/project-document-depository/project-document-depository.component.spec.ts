import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentDepositoryComponent } from './project-document-depository.component';

describe('ProjectDocumentDepositoryComponent', () => {
  let component: ProjectDocumentDepositoryComponent;
  let fixture: ComponentFixture<ProjectDocumentDepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocumentDepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDocumentDepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
