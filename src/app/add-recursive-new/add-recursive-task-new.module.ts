import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRecursiveTaskNewRoutingModule } from './add-recursive-task-new-routing.module';
import { AddRecursiveTaskNewComponent } from './add-recursive-task-new/add-recursive-task-new/add-recursive-task-new.component';
import { MultiSelectDropdownNewComponent } from './add-recursive-task-new/multi-select-dropdown-new/multi-select-dropdown-new.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TagInputModule } from 'ngx-chips';
import { AddRecursiveTaskRoutingModule } from '../add-recursive-task/add-recursive-task-routing.module';
import { HeaderBarModule } from '../header-bar/header-bar.module';


@NgModule({
  declarations: [
    AddRecursiveTaskNewComponent,
    MultiSelectDropdownNewComponent
  ],
  imports: [
    CommonModule,
    AddRecursiveTaskNewRoutingModule,
    HeaderBarModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatDatepickerModule,
    AddRecursiveTaskRoutingModule,
    TagInputModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ]
})
export class AddRecursiveTaskNewModule { }
