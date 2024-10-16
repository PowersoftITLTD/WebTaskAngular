import { NgModule } from '@angular/core';
import { PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardModule } from '../dashboard/dashboard.module';

const routes: Routes = [

  // { path: '', redirectTo: '/login-page', pathMatch: 'full' },
  {path:'login-page', component:LoginPageComponent},
  {path:'reset-password', component:ResetPasswordComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  // imports: [RouterModule.forRoot(routes, { preloadingStrategy: LoginCredentialModule}), RouterModule.forRoot(routes, { useHash: true })],

  exports: [RouterModule]
})
export class LoginCredentialRoutingModule { }
