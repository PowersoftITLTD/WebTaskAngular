import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  selectedTab: string = '';

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
    // console.log('this.loggedInUser from panel', this.loggedInUser)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab();
      }
    });
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
    this.router.navigate(['approval-tempelate/add-approval-tempelate']);
    this.selectedTab = 'approval-tempelate'
  }

  navigateToDocumentTempelate() {
    this.router.navigate(['approvals/document-tempelate']);
    this.selectedTab = 'document-tempelate'
  }

  navigateToApprovedTempelate() {
    this.router.navigate(['approvals/approved-tempelate']);
    this.selectedTab = 'approved-tempelate'
  }

  navigateToProjectDefination() {
    this.router.navigate(['approvals/project-defination']);
    this.selectedTab = 'project-defination'
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

    if (currentRoute.includes('dashboard')) {
      this.selectedTab = 'dashboard';
    } else if (currentRoute.includes('task-management') || currentRoute.includes('add-task') || currentRoute.includes('selected-task-info')) {
      this.selectedTab = 'task-management';
    } else if(currentRoute.includes('project-uploader')){
      this.selectedTab = 'project-uploader';
    } else if(currentRoute.includes('recursive-task')){
      this.selectedTab = 'recursive-task';
    }
  }


}





