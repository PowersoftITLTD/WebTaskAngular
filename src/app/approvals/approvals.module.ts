import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalsRoutingModule } from './approvals-routing.module';
import { DocumentTempelateComponent } from './document-tempelate/document-tempelate.component';
import { ProjectDefinationComponent } from './project-defination/project-defination.component';
import { ProjectDocumentDepositoryComponent } from './project-document-depository/project-document-depository.component';
import { ProjectDocumentSearchComponent } from './project-document-search/project-document-search.component';
import { ApprovalTaskInitationComponent } from './approval-task-initation/approval-task-initation.component';
import { ApprovedTempelateComponent } from './approved-tempelate/approved-tempelate.component';
import { HeaderBarModule } from '../header-bar/header-bar.module';
<<<<<<< HEAD
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AddApprovalTempelateComponent } from './add-approval-tempelate/add-approval-tempelate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
=======
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)


@NgModule({
  declarations: [
    DocumentTempelateComponent,
    ProjectDefinationComponent,
    ProjectDocumentDepositoryComponent,
    ProjectDocumentSearchComponent,
    ApprovalTaskInitationComponent,
<<<<<<< HEAD
    AddApprovalTempelateComponent,
=======
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
    ApprovedTempelateComponent
  ],
  imports: [
    CommonModule,
    ApprovalsRoutingModule,
<<<<<<< HEAD
    HeaderBarModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
=======
    HeaderBarModule
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  ]
})
export class ApprovalsModule { }
