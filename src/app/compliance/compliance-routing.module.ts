import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComplianceComponent } from './add-compliance/add-compliance.component';

const routes: Routes = [
  {path:'add-compliance', component:AddComplianceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianceRoutingModule { }
