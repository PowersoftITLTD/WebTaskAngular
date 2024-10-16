import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanelComponent } from './side-panel-details/side-panel.component';
import { SideBarDirective } from '../directives/side-bar-directive/side-bar.directive';


@NgModule({
  declarations: [
    SidePanelComponent, 
    SideBarDirective,
  ],
  exports: [
    SidePanelComponent,
    SideBarDirective,  
  ],
  imports: [
    CommonModule,
    // DashboardModule      

  ]
})
export class SidePanelModule {
}
