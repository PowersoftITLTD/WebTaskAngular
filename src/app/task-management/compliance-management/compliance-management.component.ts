import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-compliance-management',
  templateUrl: './compliance-management.component.html',
  styleUrls: ['./compliance-management.component.css']
})
export class ComplianceManagementComponent implements OnInit {

  filterType: string = '';

  selectedOption: any;

  // selected: any;
  ascendingOrder: boolean = true;
  // iconVisible: any = null;
  status: string = '';
  _SearchText: string = '';
  selectedTab: string = 'actionable';

  filteredTaskList: any[] = [];
  complianceList: any[] = [];

  loading: boolean = true;  // Track if data is loading

  blurBackground: boolean = false;
  loadedActionableData: boolean = false;


  options: any[] = [];
  employees: any[] = [];
  filteredTasks: any[] = [];
  searchFields: string[] = [];

  @Input() recursiveLogginUser: any = {};
  @Input() loggedInUser: any;


  NewTaskOrSubTask: string = '';

  selectedMKey: number | undefined;

  mkey: number | any
  isSidebarOpen: boolean = false;

  project: any;
  sub_proj: any;

  isAscending: boolean = true;

  source: any;

  createdOrUpdatedUserName: any


  myAction: number | any;
  AllocatedToMee: number | any;
  AllocatedByMee: number | any;
  completedByMee: number | any;
  completedForMee: number | any;
  cancelleed: number | any;


  loginName: string = '';
  loginPassword: string = '';

  jwtToken: string | any = '';
  taskDetails: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private dataService: CredentialService,
    private tostar: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.onLogin();
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
          this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.tostar.error('Network error')

      }
    });
  }

  onFilterTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    // this.filterType = value;
    if (value === 'creationDate') {
      // this.taskList
      this.complianceList.sort((a, b) => {
        const dateA = new Date(b.CREATION_DATE.split('/').reverse().join('-'));
        const dateB = new Date(a.CREATION_DATE.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
      // console.log('creationDate', creationDate)

    } else if (value === 'completionDate') {

      this.complianceList.sort((a, b) => {
        const dateA = new Date(b.COMPLETION_DATE.split('/').reverse().join('-'));
        const dateB = new Date(a.COMPLETION_DATE.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
      // console.log('completionDate', completionDate)
    }

  }


  fetchTaskDetails() {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    this.loggedInUser = this.dataService.getUser();

    // console.log(user)

    this.apiService.getComplianceDetails(this.loggedInUser[0].MKEY, this.recursiveLogginUser).subscribe(response => {
      if (response) {
        // Filter the data based on matching MKEY with assigneD_TO or createD_BY
        response.filter((selectedUserRes: any) => {
          const mkey = this.loggedInUser[0].MKEY;
          // Check if either assigneD_TO or createD_BY matches MKEY
          return selectedUserRes.assigneD_TO === mkey || selectedUserRes.createD_BY === mkey;
        });


        this.complianceList = response[0].DATA.reverse();
        this.loading = false;

        // console.log('Compliance List', this.complianceList)
        // console.log('Filtered Dashboard response:', filteredData);
      }
      // this.taskList = response;
      // this.mergeEmployeeNamesWithTasks();
      this.mergingProjAndSubProjName();
    }, error => {
      console.error('Failed to fetch task details:', error);
      this.tostar.error('Network error')

    });
  }


  mergingProjAndSubProjName() {

    if (!this.project || !Array.isArray(this.project)) {
      return;
    }

    const projectMap = new Map(this.project.map((proj: any) => [proj.MASTER_MKEY, proj.TYPE_DESC]));
    // console.log('projectMap', projectMap)

    const token = this.apiService.getRecursiveUser();


    this.project.forEach((proj: any) => {
      this.apiService.getSubProjectDetailsNew(proj.MASTER_MKEY.toString(), token).subscribe(
        (response: any) => {
          this.sub_proj = response[0].data;

          const subProjectMap = new Map(this.sub_proj.map((sub: any) => [sub.MASTER_MKEY, sub.TYPE_DESC]));

          if (this.complianceList && this.complianceList.length > 0) {
            this.complianceList.forEach((task: any) => {

              task.project_Name = projectMap.get(task.projecT_ID) || '0';
              task.sub_project_Name = subProjectMap.get(task.suB_PROJECT_ID) || '0';
            });
          }
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching sub-projects');
          this.tostar.error('Network error')

        }
      );
    });

  }

  addTaskDetails() {
    this.router.navigate(['/task-details/add-task']);
  }

  addCompliance(add_new_compliance: any) {
    this.router.navigate(['compliance', 'add-compliance', { compliance_state: add_new_compliance }]);
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.complianceList.sort((a, b) => {
      const dateA = new Date(a.TO_BE_COMPLETED_BY).getTime();
      const dateB = new Date(b.TO_BE_COMPLETED_BY).getTime();
      return this.isAscending ? dateA - dateB : dateB - dateA;
    });
  }

  onFilterSelectionChange(option: string) {
    this.selectedOption = option;
  }

  openSelectedTask(data: any) {
    this.router.navigate(['compliance', 'add-compliance', { compliance_state: data.MKEY }], { state: { taskData: data } });
  }

  initiateCompliance(data: any, initiate: string) {
    this.router.navigate(['compliance', 'add-compliance', { compliance_state: data.MKEY, initiate: initiate }], { state: { taskData: data } });
  }


  resetSource() {
    this.activatedRoute.queryParams.subscribe(params => {
      const source = params['source']
      if (source !== 'All') { this.selectedOption = 'All' }
    });
  }

  toggleOrder() {
    this.ascendingOrder = !this.ascendingOrder;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('.page-sidebar');
    const content = document.querySelector('.page-content-wrapper');

    if (sidebar && content) {
      if (this.isSidebarOpen) {
        sidebar.classList.add('open');
        content.classList.add('sidebar-open');
      } else {
        sidebar.classList.remove('open');
        content.classList.remove('sidebar-open');
      }
    }
  }

}
