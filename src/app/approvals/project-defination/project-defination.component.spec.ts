import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDefinationComponent } from './project-defination.component';

describe('ProjectDefinationComponent', () => {
  let component: ProjectDefinationComponent;
  let fixture: ComponentFixture<ProjectDefinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDefinationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
