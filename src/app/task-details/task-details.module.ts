import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task/add-task.component';
import { SidePanelModule } from '../side-panel/SidePanelModule';
import { TaskDetailsRoutingModule } from './task-details-routing.module';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { ActionableComponent } from './add-task/actionable/actionable.component';
import { ProgressDetailsComponent } from './add-task/progress-details/progress-details.component';
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

@NgModule({
  providers: [],
  declarations: [
    AddTaskComponent,
    ActionableComponent,
    ProgressDetailsComponent,
    SelectedTaskInfoComponent,
    AlphabeticOnlyDirective
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
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    TagInputModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
  ]
})
export class TaskDetailsModule { }
