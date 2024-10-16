import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderBarComponent } from './header-bar/header-bar.component';

const routes: Routes = [
  {path:'header-bar', component:HeaderBarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeaderBarRoutingModule { }
