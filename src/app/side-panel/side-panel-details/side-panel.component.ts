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
  createdOrUpdatedUserName:any


  isTaskDropdownOpen: boolean = true;
  isApprovalDropdown:boolean = true;
  isComplianceDropdown: boolean = true;

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
    private apiService: ApiService
  ) {


    this.sidebarService.sidebarWidth$.subscribe(width => {
      this.sidebarWidth = width;
    });
  }

  ngOnInit(): void {
    // this.selectedTab = 'dashboard';

    this.loggedInUser = this.dataService.getUser();
   
    this.setActiveTab(); // Set the initial active tab

    // Listen for route changes and update active tab dynamically
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveTab();
    });

    // Initialize active tab on component load
    // this.updateActiveTab();
    this.onLogin()
    // this.setActiveTab();


  }

  onLogin() {   

    this.dataService.validateUser(this.loginName, this.loginPassword);

    const data = this.dataService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,    

    console.log('onLogin data')

    const USER_CRED = {    
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL, 
      PASSWORD:atob(data[0]?.LOGIN_PASSWORD)
    }; 


    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if(response.jwtToken){
          // console.log('response.jwtToken', response.jwtToken)
          // this.selectedOption = 'Over-due';
          // const option = 'DEFAULT';
          // this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }


  private updateActiveTab() {
    const queryParams = this.router.routerState.snapshot.root.queryParams;
    const source = queryParams['source'];

    console.log('check source', source)

    // Set the selectedTab based on the 'source' query parameter
    if (source) {
      this.selectedTab = source;
    } else {
      this.selectedTab = ''; // Default value if 'source' is not present in queryParams
    }
  }


selectedUserAccess(): boolean{
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


  toggleComplianceDropdown(){
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
  navigateToCompliance(){
    this.selectedTab = 'add-compliance'
    this.router.navigate(['task/compliance-management'])
    // this.router.navigate(['compliance/add-compliance']);
  }

  navigateToApprovlTempelate() {
    this.selectedTab = 'authority-tempelate';
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'authority-tempelate' }});
  }

  navigateToDocumentTempelate() {
    this.selectedTab = 'document-tempelate';
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'document-tempelate' }});
  }

  navigateToProjectDefination() {
    this.selectedTab = 'project-defination';
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'project-defination' }});
  }


  navigateToProjectDocDepository() {
    this.selectedTab = 'project-document-depository';;
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'project-document-depository' }});
  }

  navigateToCategoryMaster(){
    //this.router.navigate(['approvals/category-master']);
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'category-master' }});
    this.selectedTab = 'category-master'

  }

  navigateToInstructionMaster(){
    //this.router.navigate(['approvals/category-master']);
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'instruction-master' }});
    this.selectedTab = 'instruction-master'

  }


 // this.router.navigate(['approvals/project-defination']);
 // this.router.navigate(['approvals/document-tempelate']);


  navigateToApprovedTempelate() {
    this.router.navigate(['approvals/approved-tempelate'],{queryParams:{ source: 'approval_tempelate' }});
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
    let currentRoute = this.router.url.split('?')[0]; // Remove query parameters
  
    // Using an array of mappings to allow duplicates and enforce order
    const tabMappings = [
      { key: 'recursive-task', value: 'recursive-task' },
      { key: 'task-management', value: 'task-management' },
      { key: 'add-task', value: 'task-management' },
      { key: 'approval-screen', value: 'project-document-depository' },
      { key: 'approval-screen', value: 'project-defination' }, // Both versions retained
      { key: 'selected-task-info', value: 'task-management' },
      { key: 'project-uploader', value: 'project-uploader' },
      { key: 'document-tempelate', value: 'document-tempelate' },
      { key: 'authority-tempelate', value: 'authority-tempelate' },
      { key: 'project-document-depository', value: 'project-document-depository' },
      { key: 'project-document-search', value: 'project-document-search' },
      { key: 'approval-task-initiation', value: 'approval-task-initiation' }
    ];
  
    // Find the first matching entry in the ordered array
    const match:any = tabMappings.find(mapping => currentRoute.includes(mapping.key));
  
    // Set the selected tab based on the first match found
    this.selectedTab = match.value ;
  }
  

  
  


}





