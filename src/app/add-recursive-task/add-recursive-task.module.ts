import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRecursiveTaskRoutingModule } from './add-recursive-task-routing.module';
import { AddRecursiveTaskComponent } from './add-recursive-task/add-recursive-task.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { TagInputModule } from 'ngx-chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PipeContentModule } from '../pipes/pipe-content.module';
import { NumericOnlyDirective } from '../directives/numeric-only/numeric-only.directive';
import { YearFormatDirective } from '../directives/year-format/year-format.directive';
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';


@NgModule({
  declarations: [
    AddRecursiveTaskComponent,
    NumericOnlyDirective,
    YearFormatDirective,
    MultiSelectDropdownComponent,
  ],
  exports:[
    AddRecursiveTaskComponent,
  ],
  imports: [
    CommonModule,
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
    PipeContentModule,
  ]
})
export class AddRecursiveTaskModule { }
