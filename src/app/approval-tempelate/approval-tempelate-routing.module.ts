import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddApprovalTempelateComponent } from './add-approval-tempelate/add-approval-tempelate.component';

const routes: Routes = [
  {path:'add-approval-tempelate', component:AddApprovalTempelateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalTempelateRoutingModule { }
