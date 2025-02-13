import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { SelectedTaskInfoComponent } from './add-task/selected-task-info/selected-task-info.component';

const routes: Routes = [
  { path: 'add-task', component: AddTaskComponent },
  { path: 'add-task/:TASK_NO', component: AddTaskComponent },
  { path: 'add-task/:TASK_NO/:SUB_TASK_NO', component: AddTaskComponent },
  // { path: 'add-task/:TASK_NO/:SUB_TASK_NO/:SUB_OFSUB_TASK_NO', component: AddTaskComponent },
  { path: 'task-details/add-task', component: AddTaskComponent }, 
  { path: 'selected-task-info', component: SelectedTaskInfoComponent }, 
  { path: 'task-details/selected-task-info', component: SelectedTaskInfoComponent }, 
  // { path: 'task-details/selected-task-info/:taskData', component: SelectedTaskInfoComponent },


  { path: 'task-item', component: SelectedTaskInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskDetailsRoutingModule { }
