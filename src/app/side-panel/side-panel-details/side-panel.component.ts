import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
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

  loginName: string = '';
  loginPassword: string = '';


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
  createdOrUpdatedUserName: any


  isTaskDropdownOpen: boolean = true;
  isApprovalDropdown: boolean = true;
  isComplianceDropdown: boolean = true;

  //selectedTab
  selectedTab: string | any = '';

  //selectedUsers
  selectedUser: string | any;

  showDashboard: boolean = false;
  showTaskManagement: boolean = false;

  //sidebar hover
  sidebarWidth: string = '100%';

  constructor(
    private router: Router,
    private sidebarService: SideBarService,
    private dataService: CredentialService,
    private apiService: ApiService,
    private changeDetector: ChangeDetectorRef, // ✅ Inject ChangeDetectorRef
  ) {

    // this.setActiveTab(); // Set the initial active tab

    this.sidebarService.sidebarWidth$.subscribe(width => {
      this.sidebarWidth = width;
    });
  }

  ngOnInit(): void {
    // this.selectedTab = 'dashboard';

    this.loggedInUser = this.dataService.getUser();

    const currentURL = window.location.href;
    console.log('Current URL:', currentURL);

    // Extract the route after the hash (#) symbol
    const baseIndex = currentURL.indexOf('#');
    let route = baseIndex !== -1 ? currentURL.substring(baseIndex + 1) : '';

    route = route.split('?')[0];
    route = route.split(';')[0];

    //this.setActiveTab(); // ✅ Set the initial active tab

    this.setActiveTab();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveTab(); // ✅ Update tab on every route change
      this.changeDetector.detectChanges(); // ✅ Force UI update to avoid clicking twice
    });


    this.onLogin()


  }

  onLogin() {

    this.dataService.validateUser(this.loginName, this.loginPassword);

    const data = this.dataService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,

      console.log('onLogin data')

    const USER_CRED = {
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };


    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if (response.jwtToken) {
          ;
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }


  selectedUserAccess(): boolean {
    const selectedUser = this.loggedInUser
    return selectedUser[0].EMP_CODE === "9211" || selectedUser[0].EMP_CODE === "9201" || selectedUser[0].EMP_CODE === "9222" || selectedUser[0].EMP_CODE === "9011" || selectedUser[0].EMP_CODE === "9002"
  }

  navigateToDashboardProject() {
    this.router.navigate(['dashboard/dashboard-page']);
    this.selectedTab = 'dashboard';
  }


  navigateToUploadProject() {
    this.router.navigate(['project-uploader/upload-file'])
    this.selectedTab = 'project-uploader';
  }


  toggleTaskDropdown() {
    this.isTaskDropdownOpen = !this.isTaskDropdownOpen;
  }

  toggleApprovalDropdown() {
    this.isApprovalDropdown = !this.isApprovalDropdown;
  }


  toggleComplianceDropdown() {
    this.isComplianceDropdown = !this.isComplianceDropdown;
  }


  //Task-management
  navigateToTask() {
    this.selectedTab = 'task-management';
    this.router.navigate(['task/task-management']);
  }

  //Recursive task-management
  navigateToRecursiveTask() {
    this.selectedTab = 'recursive-task'
    this.router.navigate(['task/recursive-task']);
  }

  //Compliance management
  navigateToCompliance() {
    this.selectedTab = 'add-compliance'
    this.router.navigate(['task/compliance-management'])
  }

  navigateToApprovlTempelate() {
    this.selectedTab = 'authority-tempelate';
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'authority-tempelate' } });
  }

  navigateToDocumentTempelate() {
    this.selectedTab = 'document-tempelate';
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'document-tempelate' } });
  }

  navigateToProjectDefination() {
    this.selectedTab = 'project-defination';
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'project-defination' } });
  }


  navigateToProjectDocDepository() {
    this.selectedTab = 'project-document-depository';;
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'project-document-depository' } });
  }

  navigateToCategoryMaster() {
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'category-master' } });
    this.selectedTab = 'category-master'

  }

  navigateToInstructionMaster() {
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'instruction-master' } });
    this.selectedTab = 'instruction-master'

  }

  navigateToApprovedTempelate() {
    this.router.navigate(['approvals/approved-tempelate'], { queryParams: { source: 'approval_tempelate' } });
    this.selectedTab = 'approved-tempelate';
  }



  navigateToProjectDD() {
    this.router.navigate(['approvals/project-document-depository']);
    this.selectedTab = 'project-document-depository';
  }

  navigateToProjectDS() {
    this.router.navigate(['approvals/project-document-search']);
    this.selectedTab = 'project-document-search';
  }

  navigateToApprovalTaskInitiation() {
    this.router.navigate(['approvals/approval-task-initiation']);
    this.selectedTab = 'approval-task-initiation';
  }


  setActiveTab() {
    let route = this.router.url.split('?')[0].split(';')[0]; // Remove query & matrix params
    console.log('Extracted Route:', route);

    console.log('this.router.url', this.router.url)

    if (route !== '/task/approval-screen') {
      let routeMap: { [key: string]: string } = {
        '/dashboard/dashboard-page': 'dashboard',
        '/dashboard/task-due-status': 'dashboard',
        '/task/task-management': 'task-management',
        '/task/selected-task-info': 'task-management',
        '/task/recursive-task': 'recursive-task',
        '/task/compliance-management': 'add-compliance',
        '/compliance/add-compliance': 'add-compliance',
        '/project-uploader/upload-file': 'project-uploader',
        '/approvals/category-master': 'category-master',
        '/approvals/instruction-master': 'instruction-master',
        '/approvals/document-tempelate': 'document-tempelate',
        '/approvals/approved-tempelate': 'authority-tempelate',
        '/approvals/project-defination': 'project-defination',
        '/approvals/project-document-depository': 'project-document-depository',
        '/recursive-task/add-recursive-task': 'recursive-task',
        '/task-details/add-task': 'task-management',
        '/approvals/approval-task-initiation': 'project-defination'
      };

      this.selectedTab = routeMap[route] || '';

    } else {

      let route = this.router.url
      let routeMap: { [key: string]: string } = {
        '/task/approval-screen?source=category-master': 'category-master',
        '/task/approval-screen?source=instruction-master': 'instruction-master',
        '/task/approval-screen?source=document-tempelate': 'document-tempelate',
        '/task/approval-screen?source=authority-tempelate': 'authority-tempelate',
        '/task/approval-screen?source=project-defination': 'project-defination',
        '/task/approval-screen?source=project-document-depository': 'project-document-depository'
      };
      this.selectedTab = routeMap[route] || '';
    }
  }
}





