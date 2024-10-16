import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFileUploaderComponent } from './project-file-uploader.component';

describe('ProjectFileUploaderComponent', () => {
  let component: ProjectFileUploaderComponent;
  let fixture: ComponentFixture<ProjectFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectFileUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
