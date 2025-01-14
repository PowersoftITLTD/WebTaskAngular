import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './guards/login-authentication/auth-guard.guard';
import { LoginCredentialModule } from '../app/login-credential/login-credential.module';


const routes: Routes = [

  //Redirect to login page
  { path: '', redirectTo: '/login/login-page', pathMatch: 'full' },

  // Login
  { path: 'login', loadChildren: () => import('../app/login-credential/login-credential.module').then(m => m.LoginCredentialModule) },

  // Header-bar
  { path: 'header', loadChildren: () => import('../app/header-bar/header-bar.module').then(m => m.HeaderBarModule), canActivate: [AuthGuardGuard] },

  // Dashboard
  { path: 'dashboard', loadChildren: () => import('../app/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuardGuard] },

  // Side-panel
  { path: 'side-panel', loadChildren: () => import('../app/side-panel/SidePanelModule').then(m => m.SidePanelModule), canActivate: [AuthGuardGuard] },

  // add-task and save-task
  { path: 'task-details', loadChildren: () => import('../app/task-details/task-details.module').then(m => m.TaskDetailsModule), canActivate: [AuthGuardGuard] },

  // Task Management
  { path: 'task', loadChildren: () => import('../app/task-management/task-management.module').then(m => m.TaskManagementModule), canActivate: [AuthGuardGuard] },

  // add recursive task
  { path: 'recursive-task', loadChildren: () => import('../app/add-recursive-new/add-recursive-task-new.module').then(m => m.AddRecursiveTaskNewModule), canActivate: [AuthGuardGuard] },

  //add approval tempelate
  { path: 'approval-tempelate', loadChildren:() => import('../app/approval-tempelate/approval-tempelate.module').then(m => m.ApprovalTempelateModule), canActivate:[AuthGuardGuard] },

  // Project-uploader
  { path: 'project-uploader', loadChildren: () => import('../app/project-uploader/project-uploader.module').then(m => m.ProjectUploaderModule), canActivate: [AuthGuardGuard] },

  //approvals
  { path:'approvals', loadChildren:()=> import('../app/approvals/approvals.module').then(m => m.ApprovalsModule), canActivate:[AuthGuardGuard]},

  //Compliance
  { path:'compliance', loadChildren:()=> import('../app/compliance/compliance.module').then(m => m.ComplianceModule), canActivate:[AuthGuardGuard] }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: LoginCredentialModule }),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    RouterModule.forRoot(routes, { useHash: true })
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
