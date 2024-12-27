import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRecursiveTaskNewComponent } from './add-recursive-task-new/add-recursive-task-new/add-recursive-task-new.component';

const routes: Routes = [
    {path:'add-recursive-task', component:AddRecursiveTaskNewComponent},
  {path:'recursive-task/add-recursive-task', component: AddRecursiveTaskNewComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRecursiveTaskNewRoutingModule { }
