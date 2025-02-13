import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { SidePanelModule } from '../side-panel/SidePanelModule';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HeaderBarModule } from '../header-bar/header-bar.module';
import { HomeComponent } from './project-dashboard/home-page/home/home.component';
import { TeamProgressComponent } from './project-dashboard/team-progress-page/team-progress/team-progress.component';
// import { TeamMembersComponent } from './project-dashboard/home-page/team-members/team-members.component';
// import { TimeAndWeatherComponent } from './project-dashboard/home-page/time-and-weather/time-and-weather.component';
// import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamStatusComponent } from './project-dashboard/team-progress-page/task-due/team-status.component';
import { MemberSearchPipe } from '../pipes/member-search/member-search.pipe';
import { PipeContentModule } from '../pipes/pipe-content.module';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  providers:[
    DatePipe,
    
  ],
  declarations: [  
      ProjectDashboardComponent,
      HomeComponent,
      TeamProgressComponent, 
      TeamStatusComponent,
      MemberSearchPipe, 
  ],
  exports:[
      ProjectDashboardComponent,
  ],
  imports: [
      CommonModule,
      HeaderBarModule,
      DashboardRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      PipeContentModule,
      MatIconModule
  ]
})
export class DashboardModule { }
