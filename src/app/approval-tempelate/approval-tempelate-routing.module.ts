import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
// import { AddApprovalTempelateComponent } from './add-approval-tempelate/add-approval-tempelate.component';

const routes: Routes = [
  // {path:'add-approval-tempelate', component:AddApprovalTempelateComponent}
=======
import { AddApprovalTempelateComponent } from './add-approval-tempelate/add-approval-tempelate.component';

const routes: Routes = [
  {path:'add-approval-tempelate', component:AddApprovalTempelateComponent}
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalTempelateRoutingModule { }
