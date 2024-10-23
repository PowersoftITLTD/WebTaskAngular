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


@NgModule({
  declarations: [
    DocumentTempelateComponent,
    ProjectDefinationComponent,
    ProjectDocumentDepositoryComponent,
    ProjectDocumentSearchComponent,
    ApprovalTaskInitationComponent,
    ApprovedTempelateComponent
  ],
  imports: [
    CommonModule,
    ApprovalsRoutingModule,
    HeaderBarModule
  ]
})
export class ApprovalsModule { }
