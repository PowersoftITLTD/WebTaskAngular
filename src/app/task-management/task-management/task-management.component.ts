import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  source:any;


  myAction: number | any;
  AllocatedToMee: number | any;
  AllocatedByMee: number | any;
  completedByMee: number | any;
  completedForMee: number | any;
  cancelleed: number | any;


  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private dataService: CredentialService,
    // private taskDuePipe: TaskDuePipe
  ) {
    this.loggedInUser = this.dataService.getUser();
    this.selectedOption = 'All';
  }

  ngOnInit(): void {

    this._getCount();

    this.source = this.activatedRoute.queryParams.subscribe(params => {
      const source = params['source'];

      if(!source){
        const option = 'DEFAULT';
        this.selectedTab = 'actionable';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      }else if (source === 'overdue') {
        this.selectedOption = 'Over-due';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      } else if (source === 'today') {
        this.selectedOption = 'To-day';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      } else if (source === 'future') {
        this.selectedOption = 'Future';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      } else if (source === 'allocatedButNotStarted') {        
        this.selectedTab = 'allocatedToMe';
        const option = 'ALLOCATEDTOME';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      } else if (source === 'review') {
        this.selectedOption = 'Review';
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      } else if (source === 'actionable'){
        this.myActionable();
        const option = 'DEFAULT';
        this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
      } else if (source === 'allocatedByMe'){
        this.AllocatedByMe();
      } else if(source === 'completedByMe'){
        this.completedByMe();
      } else if(source === 'completedForMe'){
        this.completedForMe();
      } else if(source === 'cancelled'){
        this.cancelled();
      }
      
     
    });
   
  }

  _getCount() {
    this.loggedInUser = this.dataService.getUser();
    const token = this.apiService.getRecursiveUser();

    const option = 'DEFAULT';
    this.apiService.getTaskManagementDetailsNew(this.loggedInUser[0]?.MKEY.toString(), option, token).subscribe(
      (response: any) => {

        this.count = response[0].data1;

      },
      (error: ErrorHandler) => {
        console.error('Error fetching count:', error);
      }
    );
  }


  fetchTaskDetails(mkey: string, option: string) {

    this.loggedInUser = this.dataService.getUser();
    const token = this.apiService.getRecursiveUser();

    this.apiService.getTaskManagementDetailsNew(mkey.toString(), option, token).subscribe(
      (response: any) => {

        console.log(response)
        this.taskList = response[0]?.data;        
      },
      (error: ErrorHandler) => {
        console.error('Error fetching task details:', error);
      }
    );
  }


  onFilterTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();

    

    // this.filterType = value;
   if(value === 'creationDate' ){
      // this.taskList
      this.taskList.sort((a, b) => {
        const dateA = new Date(b.CREATION_DATE.split('/').reverse().join('-')); 
        const dateB = new Date(a.CREATION_DATE.split('/').reverse().join('-')); 
        return dateA.getTime() - dateB.getTime();
      }); 

      // console.log('creationDate', creationDate)

    }else if(value === 'completionDate'){

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
    this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
    this.resetSource()
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { source: 'cancelled' },
      queryParamsHandling: 'merge' 
    });
  }


  resetSource() {
    this.activatedRoute.queryParams.subscribe(params => {const source = params['source']
    if(source !== 'All'){ this.selectedOption = 'All'}});
  }


  completionDate(){
    const option = 'All';
    console.log(this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option))
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



