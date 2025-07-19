import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';

// import { HeaderBarModule } from '../header-bar/header-bar.module';
import { InsertUpdateMasterComponent } from './insert-update-master/insert-update-master.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';


@NgModule({
  declarations: [
   
  
    InsertUpdateMasterComponent,
    ProjectViewComponent,
    // HeaderBarComponent
  ],
  imports: [
    HeaderBarModule,
    CommonModule,
    DetailsRoutingModule,    
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DetailsModule { }
