import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectUploaderRoutingModule } from './project-uploader-routing.module';
import { ProjectFileUploaderComponent } from './project-file-uploader/project-file-uploader.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    ProjectFileUploaderComponent
  ],
  exports:[
    ProjectFileUploaderComponent
  ],
  imports: [
    CommonModule,
    ProjectUploaderRoutingModule,
    // InfiniteScrollModule,
    VirtualScrollerModule,
    HeaderBarModule
  ]
})
export class ProjectUploaderModule { }
