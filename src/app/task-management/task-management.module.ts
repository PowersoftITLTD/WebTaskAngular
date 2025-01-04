import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskManagementComponent } from './task-management/task-management.component';
import { FormsModule } from '@angular/forms';
import { SelectedTaskInfoComponent } from '../task-details/add-task/selected-task-info/selected-task-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { TaskDuePipe } from '../pipes/task-date-filter/task-due.pipe';
import { SidePanelModule } from '../side-panel/SidePanelModule';
import { PipeContentModule } from '../pipes/pipe-content.module';
import { RecursiveTaskManagementComponent } from './recursive-task-management/recursive-task-management.component';
import { ApprovalScreenComponent } from './approval-screen/approval-screen.component';
// import { FilterCategoryPipePipe } from '../pipes/filter-category-pipe/filter-category-pipe.pipe';



@NgModule({
  declarations: [
    TaskManagementComponent,
    RecursiveTaskManagementComponent,
    ApprovalScreenComponent,
    // FilterCategoryPipePipe,
    TaskDuePipe,
  ],
  exports:[
    TaskManagementComponent,    
  ],
  imports: [
    FormsModule,
    CommonModule, 
    MatDialogModule,
    HeaderBarModule,
    TaskManagementRoutingModule,
    SidePanelModule,
    PipeContentModule,
  ],
  entryComponents: [
    SelectedTaskInfoComponent
],
})
export class TaskManagementModule { }
