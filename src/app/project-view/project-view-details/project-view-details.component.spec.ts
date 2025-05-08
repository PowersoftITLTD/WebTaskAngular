import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewDetailsComponent } from './project-view-details.component';

describe('ProjectViewDetailsComponent', () => {
  let component: ProjectViewDetailsComponent;
  let fixture: ComponentFixture<ProjectViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectViewDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
