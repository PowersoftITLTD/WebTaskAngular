import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalTempelateRoutingModule } from './approval-tempelate-routing.module';
<<<<<<< HEAD
import { HeaderBarModule } from '../header-bar/header-bar.module';

=======
import { AddApprovalTempelateComponent } from './add-approval-tempelate/add-approval-tempelate.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxButtonModule, IgxCardModule, IgxComboModule } from 'igniteui-angular';
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
<<<<<<< HEAD
=======
    AddApprovalTempelateComponent
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  ],
  imports: [
    CommonModule,
    ApprovalTempelateRoutingModule,
    // BrowserAnimationsModule,
    HeaderBarModule,
    // IgxComboModule,
    // IgxComboModule,
    // IgxButtonModule,
    // IgxCardModule,
    FormsModule,
  ]
})
export class ApprovalTempelateModule { }
