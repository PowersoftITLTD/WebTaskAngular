import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { SideBarService } from 'src/app/services/side-panel/side-bar.service';


@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})



export class SidePanelComponent implements OnInit {



  //Dashboard
  dashboardDrop: boolean = true;

  @Input() isOpen: boolean = false;

  @Input() loggedInUser: any = {};


  //Construction
  boqDrop: boolean = true;
  thumbRuleDrop: boolean = true;
  ssrDrop: boolean = true;
  constructionDrop: boolean = true;

  //Rehab Management
  rehabManagementDrop: boolean = true;
  masterDrop: boolean = true;
  openSurveyDrop: boolean = true;
  confirmationDrop: boolean = true;
  changeManagementDrop: boolean = true;
  invoicingDrop: boolean = true;

  //Task Management
  taskManagementDrop: boolean = true;


  isTaskDropdownOpen: boolean = false;
  isApprovalDropdown:boolean = false;

  //selectedTab
  selectedTab: string | any;

  //selectedUsers
  selectedUser:string | any;

  showDashboard: boolean = false;
  showTaskManagement: boolean = false;

  //sidebar hover
  sidebarWidth: string = '100%';

  constructor(
    private router: Router,
    private sidebarService: SideBarService,
    private dataService: CredentialService,
  ) {


    this.sidebarService.sidebarWidth$.subscribe(width => {
      this.sidebarWidth = width;
    });
  }

  ngOnInit(): void {
    this.selectedTab = 'dashboard';

    this.loggedInUser = this.dataService.getUser();
   
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(() => {
    //   this.updateActiveTab();
    // });

    // // Initialize active tab on component load
    // this.updateActiveTab();

    this.setActiveTab();


  }


  private updateActiveTab() {
    const queryParams = this.router.routerState.snapshot.root.queryParams;
    const source = queryParams['source'];

    // Set the selectedTab based on the 'source' query parameter
    if (source) {
      this.selectedTab = source;
    } else {
      this.selectedTab = ''; // Default value if 'source' is not present in queryParams
    }
  }


selectedUserAccess(): boolean{
  const selectedUser = this.loggedInUser 
  return selectedUser[0].EMP_CODE === "9211" || selectedUser[0].EMP_CODE === "9201" || selectedUser[0].EMP_CODE === "9222" || selectedUser[0].EMP_CODE === "9222" || selectedUser[0].EMP_CODE === "9002"  
}

  navigateToDashboardProject() {
    this.router.navigate(['dashboard/dashboard-page']);
    this.selectedTab = 'dashboard';
  }


  navigateToUploadProject() {
    this.router.navigate(['project-uploader/upload-file'])
    this.selectedTab = 'project-uploader'
  }


  toggleTaskDropdown() {
    this.isTaskDropdownOpen = !this.isTaskDropdownOpen;
  }

  toggleApprovalDropdown() {
    this.isApprovalDropdown = !this.isApprovalDropdown;
  }

  navigateToTask() {
    this.router.navigate(['task/task-management']);
    this.selectedTab = 'task-management'
  }

  navigateToRecursiveTask() {
    this.router.navigate(['task/recursive-task']);
    this.selectedTab = 'recursive-task'
  }

  navigateToApprovlTempelate() {
    this.selectedTab = 'authority-tempelate'
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'authority-tempelate' }});
  }

  navigateToDocumentTempelate() {
    this.selectedTab = 'document-tempelate'
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'document-tempelate' }});
  }

  navigateToProjectDefination() {
    this.selectedTab = 'project-defination'
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'project-defination' }});
  }


  navigateToProjectDocDepository() {
    this.selectedTab = 'project-document-depository'
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'project-document-depository' }});
  }


 // this.router.navigate(['approvals/project-defination']);
 // this.router.navigate(['approvals/document-tempelate']);


  navigateToApprovedTempelate() {
    this.router.navigate(['approvals/approved-tempelate'],{queryParams:{ source: 'approval_tempelate' }});
    this.selectedTab = 'approved-tempelate'
  }



  navigateToProjectDD() {
    this.router.navigate(['approvals/project-document-depository']);
    this.selectedTab = 'project-document-depository'
  }

  navigateToProjectDS() {
    this.router.navigate(['approvals/project-document-search']);
    this.selectedTab = 'project-document-search'
  }

  navigateToApprovalTaskInitiation() {
    this.router.navigate(['approvals/approval-task-initiation']);
    this.selectedTab = 'approval-task-initiation'
  }

  setActiveTab() {
    const currentRoute = this.router.url;
  
    // Explicit route matching order (more specific routes first)
    const tabMapping = {
      'recursive-task': 'recursive-task',
      'task-management': 'task-management',
      'add-task': 'task-management',
      'approval-screen': 'approval-screen',
      'selected-task-info': 'task-management',
      'project-uploader': 'project-uploader',
      'document-tempelate': 'document-tempelate',
      'authority-tempelate': 'authority-tempelate',
      'project-defination': 'project-defination',
      'project-document-depository': 'project-document-depository',
      'project-document-search': 'project-document-search',
      'approval-task-initiation': 'approval-task-initiation'
    };
  
    // Check each route and set the active tab based on the URL
    this.selectedTab = Object.keys(tabMapping).find(route => currentRoute.includes(route)) || null;
  }
  
  


}





