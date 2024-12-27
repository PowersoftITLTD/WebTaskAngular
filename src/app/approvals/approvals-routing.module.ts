import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentTempelateComponent } from './document-tempelate/document-tempelate.component';
import { ProjectDefinationComponent } from './project-defination/project-defination.component';
import { ProjectDocumentDepositoryComponent } from './project-document-depository/project-document-depository.component';
import { ProjectDocumentSearchComponent } from './project-document-search/project-document-search.component';
import { ApprovalTaskInitationComponent } from './approval-task-initation/approval-task-initation.component';
import { AddApprovalTempelateComponent } from './add-approval-tempelate/add-approval-tempelate.component';
// import { ApprovedTempelateComponent } from './approved-tempelate/approved-tempelate.component';

const routes: Routes = [
  {path:'approved-tempelate', component:AddApprovalTempelateComponent},
  {path:'document-tempelate', component:DocumentTempelateComponent},
  {path:'project-defination', component:ProjectDefinationComponent},
  {path:'project-document-depository', component:ProjectDocumentDepositoryComponent},
  {path:'project-document-search', component:ProjectDocumentSearchComponent},
  {path:'approval-task-initiation', component:ApprovalTaskInitationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalsRoutingModule { }
