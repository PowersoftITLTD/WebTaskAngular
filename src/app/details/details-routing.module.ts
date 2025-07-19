import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectViewDetailsComponent } from '../project-view/project-view-details/project-view-details.component';
import { ProjectViewComponent } from './project-view/project-view.component';
// import { ProjectFileUploaderComponent } from './project-file-uploader/project-file-uploader.component';
// import { ProjectViewDetailsComponent } from './project-view-details/project-view-details.component';

const routes: Routes = [
    // { path: 'upload-file', component: ProjectFileUploaderComponent },
    { path: 'project-view', component: ProjectViewComponent }
    
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule { }
