import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';


@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit {

  @Input() taskData: any;
  @Input() recursiveLogginUser: any = {};



  task: any[] = [];
  taskList: any[] = [];
  count: any[] = [];
  _FilterSelection: string[] = [
    'All',
    'To-day',
    'Over-due',
    'Next 3 days',
    'Next 7 days',
    'Next 2 weeks',
    'Next month',
    'Future',
    'Review'
  ];

  filterType: string = '';
  loginName: string = '';
  loginPassword: string = '';

  selectedOption: any;

  // selected: any;
  ascendingOrder: boolean = true;
  // iconVisible: any = null;
  status: string = '';
  _SearchText: string = '';
  selectedTab: string = 'actionable';

  filteredTaskList: any[] = [];


  blurBackground: boolean = false;
  loadedActionableData: boolean = false;

  options: any[] = [];
  employees: any[] = [];
  filteredTasks: any[] = [];

  @Input() loggedInUser: any = {};

  NewTaskOrSubTask: string = '';

  selectedMKey: number | undefined;

  mkey: number | any
  isSidebarOpen: boolean = false;

  isAscending: boolean = true;

  source: any;

  createdOrUpdatedUserName: any

  myAction: number | any;
  AllocatedToMee: number | any;
  AllocatedByMee: number | any;
  completedByMee: number | any;
  completedForMee: number | any;
  cancelleed: number | any;

  loading: boolean = true;  // Track if data is loading
  pageNumber = 1;  // Start with the first page
  pageSize = 10;   // Number of items per chunk

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private dataService: CredentialService,
    private tostar: ToastrService
    // private taskDuePipe: TaskDuePipe
  ) {
    this.loggedInUser = this.dataService.getUser();
    this.selectedOption = 'All';
  }

  ngOnInit(): void {

    this._getCount();

    this.source = this.activatedRoute.queryParams.subscribe(params => {
      const source = params['source'];

      // console.log('from ngOnInit',this.loggedInUser[0].MKEY)

      if (!source) {
        const option = 'DEFAULT';
        this.selectedTab = 'actionable';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'overdue') {
        this.taskList = [];
        this.selectedOption = 'Over-due';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'today') {
        this.taskList = [];
        this.selectedOption = 'To-day';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'future') {
        this.taskList = [];
        this.selectedOption = 'Future';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'allocatedButNotStarted') {
        this.taskList = [];
        this.selectedTab = 'allocatedToMe';
        const option = 'ALLOCATEDTOME';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'review') {
        this.taskList = [];
        this.selectedOption = 'Review';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'actionable') {
        this.taskList = [];
        this.myActionable();
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0].MKEY, option);
      } else if (source === 'allocatedByMe') {
        this.taskList = [];
        this.AllocatedByMe();
      } else if (source === 'completedByMe') {
        this.taskList = [];
        this.completedByMe();
      } else if (source === 'completedForMe') {
        this.taskList = [];
        this.completedForMe();
      } else if (source === 'cancelled') {
        this.taskList = [];
        this.cancelled();
      }


    });

    //  this.onLogin();
  }


  onLogin() {

    this.dataService.validateUser(this.loginName, this.loginPassword);

    const data = this.dataService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,

      console.log('onLogin data')

    const USER_CRED = {
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: data[0]?.ATTRIBUTE1
    };



    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if (response.jwtToken) {

          this.selectedOption = 'Over-due';
          const option = 'DEFAULT';
          this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.tostar.error('Network error')

      }
    });
  }


  _getCount() {
    this.loggedInUser = this.dataService.getUser();
    const token = this.apiService.getRecursiveUser();
    const option = 'DEFAULT';

    // console.log('this.loggedInUser[0]?.MKEY.toString()', this.loggedInUser[0]?.MKEY.toString())
    this.apiService.getTaskManagementDetailsNew(this.loggedInUser[0]?.MKEY.toString(), option, token).subscribe(
      (response: any) => {

        this.count = response[0].data1;

      },
      (error: ErrorHandler) => {
        console.error('Error fetching count:', error);
        this.tostar.error('Network error')

      }
    );
  }


  fetchTaskDetails(mkey: string, option: string) {

    this.loggedInUser = this.dataService.getUser();

    // console.log(this.loggedInUser)
    const token = this.apiService.getRecursiveUser();

    this.apiService.getTaskManagementDetailsNew(mkey.toString(), option, token).subscribe(
      (response: any) => {


        this.taskList = response[0]?.data;

        this.loading = false
      },
      (error: ErrorHandler) => {

        if (error) {
          this.tostar.error('Response failed', 'Error occured while fetching data');
          this.tostar.error('Network error');
        }
      });
  }



  onFilterTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();



    // this.filterType = value;
    if (value === 'creationDate') {
      // this.taskList
      this.taskList.sort((a, b) => {
        const dateA = new Date(b.CREATION_DATE.split('/').reverse().join('-'));
        const dateB = new Date(a.CREATION_DATE.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

      // console.log('creationDate', creationDate)

    } else if (value === 'completionDate') {

      this.taskList.sort((a, b) => {
        const dateA = new Date(b.COMPLETION_DATE.split('/').reverse().join('-'));
        const dateB = new Date(a.COMPLETION_DATE.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

      // console.log('completionDate', completionDate)
    }

  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
  }


  addTaskDetails() {
    this.router.navigate(['/task-details/add-task']);
  }


  onFilterSelectionChange(option: string) {
    this.selectedOption = option;
  }

  openSelectedTask(mkey: any) {
    this.router.navigate(['task', 'selected-task-info', { Task_Num: (mkey.MKEY) }]);
  }


  getIcon(status: string): string {
    switch (status.toUpperCase()) {
      case 'CREATED':
        return '../../../assets/Content/icons/Created.png';
      case 'SUB TASK CREATED':
        return '../../../assets/Content/icons/SubTask1.png';
      case 'CANCEL':
        return '../../../assets/Content/icons/Cancell.png';
      case 'CANCELLED':
        return '../../../assets/Content/icons/Cancell.png';
      case 'CANCEL INITIATED':
        return '../../../assets/Content/icons/Cancell.png';
      case 'CLOSE':
        return '../../../assets/Content/icons/Cancelled.png';
      case 'CLOSE INITIATED':
        return '../../../assets/Content/icons/Completed.png';
      case 'WORK IN PROGRESS':
      case 'RE-WORK':
        return '../../../assets/Content/icons/WIP.jpg';
      case 'COMPLETED':
        return '../../../assets/Content/icons/completed.jpg';
      default:
        return '';
    }
  }


  myActionable() {
    this.selectedTab = 'actionable';
    const option = 'DEFAULT';
    this.loading = true
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'actionable' },
      queryParamsHandling: 'merge'
    });
    this.resetSource();
  }

  AllocatedToMe() {
    this.selectedTab = 'allocatedToMe';
    const option = 'ALLOCATEDTOME';
    this.loading = true
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'allocatedButNotStarted' },
      queryParamsHandling: 'merge'
    });

    this.resetSource();
  }

  AllocatedByMe() {
    this.selectedTab = 'allocatedByMe';
    const option = 'ALLOCATEDBYME';
    this.loading = true
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'allocatedByMe' },
      queryParamsHandling: 'merge'
    });
    this.resetSource()
  }

  completedByMe() {
    this.selectedTab = 'completedByMe';
    const option = 'COMPLETEDBYME';
    this.loading = true
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'completedByMe' },
      queryParamsHandling: 'merge'
    });
    this.resetSource()
  }

  completedForMe() {
    this.selectedTab = 'completedForMe';
    const option = 'COMPLETEDFORME';
    this.loading = true
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'completedForMe' },
      queryParamsHandling: 'merge'
    });
    this.resetSource()

  }

  cancelled() {
    this.selectedTab = 'cancelled';
    const option = 'CANCELCLOSE';
    this.loading = true
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.resetSource()
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'cancelled' },
      queryParamsHandling: 'merge'
    });
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



