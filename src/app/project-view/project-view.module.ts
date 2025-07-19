import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectViewRoutingModule } from './project-view-routing.module';
import { ProjectViewDetailsComponent } from './project-view-details/project-view-details.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { InsertUpdateMasterComponent } from './insert-update-master/insert-update-master.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';
import { ProjectUploadComponent } from './upload-excel/project-upload/project-upload.component';
import { ProjectModifyComponent } from './upload-excel/project-modify/project-modify.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PipeContentModule } from '../pipes/pipe-content.module';
// import { MspSearchPipePipe } from '../pipes/msp-search-pipe/msp-search-pipe.pipe';


@NgModule({
  declarations: [
    ProjectViewDetailsComponent,
    InsertUpdateMasterComponent,
    UploadExcelComponent,
    ProjectUploadComponent,
    ProjectModifyComponent,
    // MspSearchPipePipe
    
  ],exports:[
    ProjectViewDetailsComponent
  ],
  imports: [
    CommonModule,
    HeaderBarModule,
    ProjectViewRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    PipeContentModule
  ]
})
export class ProjectViewModule { }
