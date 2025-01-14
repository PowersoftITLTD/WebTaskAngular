import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceRoutingModule } from './compliance-routing.module';
import { AddComplianceComponent } from './add-compliance/add-compliance.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddComplianceComponent
  ],
  imports: [
    CommonModule,
    ComplianceRoutingModule,
    HeaderBarModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    AddComplianceComponent
  ]      
})
export class ComplianceModule { }
