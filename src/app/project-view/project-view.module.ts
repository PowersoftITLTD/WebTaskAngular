import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectViewRoutingModule } from './project-view-routing.module';
import { ProjectViewDetailsComponent } from './project-view-details/project-view-details.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { InsertUpdateMasterComponent } from './insert-update-master/insert-update-master.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';


@NgModule({
  declarations: [
    ProjectViewDetailsComponent,
    InsertUpdateMasterComponent,
    UploadExcelComponent
  ],exports:[
    ProjectViewDetailsComponent
  ],
  imports: [
    CommonModule,
    HeaderBarModule,
    ProjectViewRoutingModule
  ]
})
export class ProjectViewModule { }
