import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResetPasswordComponent } from 'src/app/login-credential/reset-password/reset-password.component';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { OverLayService } from 'src/app/services/overlay/over-lay.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  isMenuOpen: boolean = false;
  isSidePanelOpen:boolean = false;
  @Input() loggedInUser: any = {};
  @Output() loggedInUserEmitter: EventEmitter<any> = new EventEmitter<any>();


  selectedTab:string = '';
  isDialogOpen: boolean = false;
  isDialogClosing: boolean = false;


  user:any = []


constructor(private loginService:CredentialService, 
            private overlayService: OverLayService, 
            private router: Router,
            private elementRef: ElementRef,
            public dialog: MatDialog,
            private apiService:ApiService
           ){}

  ngOnInit(): void {
    this.userData();
  }

  

//   openSidePanel() {
//     this.dialog.open(TimeAndWeatherComponent);
// }


  openPanel(): void {
    this.overlayService.openSidePanel();
  }
  
  toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Clicked outside the menu
      this.isMenuOpen = false;
      this.isSidePanelOpen = false;
    }
  }

  logout(): void {
    this.loginService.logout();
    this.apiService.recursiveTasklogout();
    this.router.navigate(['/login/login-page']);
    // window.location.reload();

  }

  userData() {

    const data = this.loginService.getUser();

    this.loggedInUser = { 
        MKEY: data[0]?.MKEY,
        EMP_FULL_NAME: data[0]?.EMP_FULL_NAME,  
        EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
        FIRST_NAME: data[0]?.FIRST_NAME,
        LAST_NAME: data[0]?.LAST_NAME,
        ROLE_ID: data[0]?.ROLE_ID,
      }; 

      // console.log('data',data[0]?.MKEY)
      // console.log('this.loggedInUser from header', this.loggedInUser)

    this.emitLoggedInUser();

    // console.log('user ', this.loggedInUser)

  }


  openChangePasswordDialog() {
      
      this.router.navigate(['/login/reset-password'], { queryParams:{ source: 'set_password' }})

  }

  closeDialog() {
      this.isDialogClosing = true;
      setTimeout(() => {
          this.isDialogOpen = false;
          this.isDialogClosing = false;
      }, 300); 
  }

  // openChangePasswordDialog() {
  // }
  


  toggleSidePanel() {
    // console.log('toggleSidePanel')
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  navigateToDashboardProject() {    
    this.router.navigate(['dashboard/dashboard-page']);   
    this.selectedTab = 'dashboard';
  }

  navigateToTaskManagement(){
    this.router.navigate(['task/task-management'])
    this.selectedTab = 'task-management'
  }

  navigateToUploadProject() {
    this.router.navigate(['project-uploader/upload-file'])
    this.selectedTab = 'project-uploader'
  }


  emitLoggedInUser(): void {
    this.loggedInUserEmitter.emit(this.loggedInUser);
  }

}
