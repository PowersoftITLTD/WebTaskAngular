import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectFileUploaderComponent } from './project-file-uploader/project-file-uploader.component';

const routes: Routes = [
  { path: 'upload-file', component: ProjectFileUploaderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectUploaderRoutingModule {}
