import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { TeamStatusComponent } from './project-dashboard/team-progress-page/task-due/team-status.component';
import { AuthGuardGuard } from '../guards/login-authentication/auth-guard.guard';

const routes: Routes = [
  {path:'dashboard-page', component:ProjectDashboardComponent, canActivate: [AuthGuardGuard]},
  {path:'task-due-status', component:TeamStatusComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
