import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task/add-task.component';
import { SidePanelModule } from '../side-panel/SidePanelModule';
import { TaskDetailsRoutingModule } from './task-details-routing.module';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { ActionableComponent } from './add-task/actionable/actionable.component';
import { ProgressDetailsComponent } from './add-task/actionable/progress-tab/sub-task/progress-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedTaskInfoComponent } from './add-task/selected-task-info/selected-task-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AlphabeticOnlyDirective } from '../directives/alphabet-only/alphabetic-only.directive';
import { ProgressTabComponent } from './add-task/actionable/progress-tab/progress-tab.component';
import { ComplianceManagementComponent } from '../task-management/compliance-management/compliance-management.component';
import { TaskManagementModule } from '../task-management/task-management.module';
import { ComplianceComponent } from './add-task/actionable/progress-tab/compliance/compliance.component';
import { SancAuthComponent } from './add-task/actionable/progress-tab/sanc-auth/sanc-auth.component';
import { OutputComponent } from './add-task/actionable/progress-tab/output/output.component';
import { CheckListComponent } from './add-task/actionable/progress-tab/check-list/check-list.component';
import { PipeContentModule } from '../pipes/pipe-content.module';
import { HistoryComponent } from './add-task/actionable/progress-tab/history/history.component';

@NgModule({
  providers: [],
  declarations: [
    AddTaskComponent,
    ActionableComponent,
    ProgressDetailsComponent,
    SelectedTaskInfoComponent,
    AlphabeticOnlyDirective,
    ProgressTabComponent,
    ComplianceComponent,
    SancAuthComponent,
    OutputComponent,
    CheckListComponent,
    HistoryComponent
  ],
  exports: [
    AddTaskComponent,
    ActionableComponent,
    ProgressDetailsComponent,
    SelectedTaskInfoComponent

  ],
  imports: [
    CommonModule,
    SidePanelModule,
    HeaderBarModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    TaskDetailsRoutingModule,
    TaskManagementModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    TagInputModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
    PipeContentModule
  ]
})
export class TaskDetailsModule { }
