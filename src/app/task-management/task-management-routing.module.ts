import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementComponent } from './task-management/task-management.component';
import { SelectedTaskInfoComponent } from '../task-details/add-task/selected-task-info/selected-task-info.component';
import { RecursiveTaskManagementComponent } from './recursive-task-management/recursive-task-management.component';
<<<<<<< HEAD
import { ApprovalScreenComponent } from './approval-screen/approval-screen.component';
=======
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
// import { AddTaskComponent } from '../task-details/add-task/add-task.component';

const routes: Routes = [
  // { path: 'add-task', component: AddTaskComponent },
  // { path: 'add-task/:TASK_NO', component: AddTaskComponent },
  // { path: 'task-details/add-task', component: AddTaskComponent }, 
  { path:'task-management', component:TaskManagementComponent},
  { path:'recursive-task', component:RecursiveTaskManagementComponent},
<<<<<<< HEAD
  { path:'approval-screen', component:ApprovalScreenComponent},
=======
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  { path:'selected-task-info', component:SelectedTaskInfoComponent},
  { path:'selected-task-info/:task', component:SelectedTaskInfoComponent},
  { path:'task/selected-task-info/:task', component:SelectedTaskInfoComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementRoutingModule { }
