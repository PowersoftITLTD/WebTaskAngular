import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectViewDetailsComponent } from './project-view-details/project-view-details.component';
import { InsertUpdateMasterComponent } from './insert-update-master/insert-update-master.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';

const routes: Routes = [
    { path: 'project-view', component: ProjectViewDetailsComponent },
    { path: 'upload-excel-file', component:UploadExcelComponent},
    { path: 'insert-update-master', component:InsertUpdateMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectViewRoutingModule { }
