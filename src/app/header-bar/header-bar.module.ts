import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { HeaderBarRoutingModule } from './header-bar-routing.module';
import { HeaderBarComponent } from './header-bar/header-bar.component';
// import { SaveCancelTitleComponent } from './save-cancel-title/save-cancel-title.component';
import { SidePanelModule } from '../side-panel/SidePanelModule';
import { SidePanelComponent } from '../side-panel/side-panel-details/side-panel.component';
import { LoginCredentialModule } from '../login-credential/login-credential.module';



@NgModule({
  entryComponents:[SidePanelComponent],
  declarations: [
    HeaderBarComponent,
    // SaveCancelTitleComponent,
  ],

  exports:[
    HeaderBarComponent,  
    // SaveCancelTitleComponent,

  ],

  imports: [
    CommonModule,
    // MatMenuModule,
    // MatIconModule,
    // MatButtonModule,
    // MatDividerModule,
    LoginCredentialModule,
    SidePanelModule,
    HeaderBarRoutingModule
  ]

})
export class HeaderBarModule { }
