import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRecursiveTaskComponent } from './add-recursive-task/add-recursive-task.component';

const routes: Routes = [
  {path:'add-recursive-task', component:AddRecursiveTaskComponent},
  {path:'recursive-task/add-recursive-task', component: AddRecursiveTaskComponent}, 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AddRecursiveTaskRoutingModule { }
