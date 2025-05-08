import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SessionModule } from './session/session.module';
import { SidePanelModule } from './side-panel/SidePanelModule';
// import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { TagInputModule } from 'ngx-chips';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatButtonModule } from '@angular/material/button';
// import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTreeModule } from '@angular/material/tree';
// import { TaskManagementModule } from './task-management/task-management.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { IgxComboModule, IgxButtonModule, IgxCardModule } from 'igniteui-angular';



@NgModule({
  declarations: [
    
    //App module
    AppComponent,
  ],
  imports: [

    //Login
    // LoginCredentialModule,

    //All Forms Module
    FormsModule,
    ReactiveFormsModule,

    //Http Module
    HttpClientModule,
        
    //Browser 
    BrowserModule,

    //Browser Animation Module
    BrowserAnimationsModule,

    //App
    AppRoutingModule,

    //Side-panel
    SidePanelModule,

    //ngx-toastr
    ToastrModule.forRoot({ positionClass:"toast-top-right" }),

    //Browser mpdule
    BrowserModule,

    //Mat module
    MatDialogModule,
    // MatAutocompleteModule,
    // MatButtonModule,  
    // MatDatepickerModule,
    // MatDialogModule,
    // MatDividerModule,  
    // MatIconModule,
    // MatInputModule,
    // MatMenuModule,
    // MatNativeDateModule,
    // MatRippleModule,
    // TaskManagementModule,
    // MatTreeModule,


    //DashboardModule,
    // DashboardModule,
    // TaskManagementModule,

    //Tag
    TagInputModule,

    // IgxComboModule,
    // IgxComboModule,
    // IgxButtonModule,
    // IgxCardModule,

    // SessionModule,

    // AgGridModule
     
  ],
  providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy} ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {

  constructor(){
    console.log('App module initilize...')
  }

 }
