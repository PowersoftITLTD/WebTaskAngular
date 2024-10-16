import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-recursive-task-management',
  templateUrl: './recursive-task-management.component.html',
  styleUrls: ['./recursive-task-management.component.css']
})
export class RecursiveTaskManagementComponent implements OnInit {

  @Input() taskData: any;


  task: any[] = [];
  taskList: any[] = [];

  selectedDetails:any[] = [];

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

  @Input() recursiveLogginUser: any = {};

  NewTaskOrSubTask: string = '';

  selectedMKey: number | undefined;

  mkey: number | any
  isSidebarOpen: boolean = false;

  isAscending: boolean = true;

  source:any;
  loggedInUser:any;

  createdOrUpdatedUserName:any


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
    private http:HttpClient
  ) { }

  ngOnInit(): void {
 
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    if(this.recursiveLogginUser){
      this.fetchTaskDetails()
    }
    this.selectedOption = 'All';

    this.onLogin();
    this.fetchEmployeeName();
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
          this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

 
  fetchEmployeeName(): void {
    this.apiService.getEmpDetails().subscribe(
      (data: any) => {
        data.forEach((emp: any) => {
          const fullName = emp.EMP_FULL_NAME;
          const MKEY = emp.MKEY;
          let capitalizedFullName = '';
          const nameParts = fullName.split(' ');

          for (let i = 0; i < nameParts.length; i++) {
            if (nameParts[i].length === 1 && i < nameParts.length - 1) {
              capitalizedFullName += nameParts[i].toUpperCase() + '.' + nameParts[i + 1].charAt(0).toUpperCase() + nameParts[i + 1].slice(1).toLowerCase();
              i++;
            } else {
              capitalizedFullName += nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1).toLowerCase();
            }
            if (i !== nameParts.length - 1) {
              capitalizedFullName += ' ';
            }
          }

          this.employees.push({ Assign_to: capitalizedFullName, MKEY: MKEY });
        });
        // console.log('this.employees', this.employees);
        
        // Now merge employee names into taskList
        this.mergeEmployeeNamesWithTasks();
      },
      (error: ErrorHandler) => {
        console.error('Error fetching employee details:', error);
      }
    );
}

fetchTaskDetails() {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    this.apiService.getRecursiveTaskManagement(this.recursiveLogginUser).subscribe(response => {
      this.taskList = response;
      
      // After fetching task details, we can merge employee names
      this.mergeEmployeeNamesWithTasks();
    }, error => {
      console.error('Failed to fetch task details:', error);
    });
}

mergeEmployeeNamesWithTasks() {
    const employeeMap = new Map(this.employees.map(emp => [emp.MKEY, emp.Assign_to]));

    this.taskList.forEach(task => {
      task.createD_BY_Name = employeeMap.get(task.createD_BY) || 'Unknown';
      task.lasT_UPDATED_BY_name = employeeMap.get(task.lasT_UPDATED_BY) || 'Unknown';
    });

    // console.log('Merged Task List:', this.taskList);
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

  addRecursiveTaskDetails(add_new_Task:any){
    this.router.navigate(['recursive-task', 'add-recursive-task', { Task_Num: add_new_Task }]);

    // this.router.navigate(['/recursive-task/add-recursive-task']);
  }


  onFilterSelectionChange(option: string) {
    this.selectedOption = option;
  }

  openSelectedTask(data: any) {
    this.router.navigate(['recursive-task', 'add-recursive-task', { Task_Num: data.mkey }], {state: { taskData: data }});
  }


  // getIcon(status: string): string {
  //   switch (status.toUpperCase()) {
  //     case 'CREATED':
  //       return '../../../assets/Content/icons/Created.png';
  //     case 'SUB TASK CREATED':
  //       return '../../../assets/Content/icons/SubTask1.png';
  //     case 'CANCEL':
  //       return '../../../assets/Content/icons/Cancell.png';
  //     case 'CANCELLED':
  //       return '../../../assets/Content/icons/Cancell.png';
  //     case 'CANCEL INITIATED':
  //       return '../../../assets/Content/icons/Cancell.png';
  //     case 'CLOSE':
  //       return '../../../assets/Content/icons/Cancelled.png';
  //     case 'CLOSE INITIATED':
  //       return '../../../assets/Content/icons/Completed.png';
  //     case 'WORK IN PROGRESS':
  //     case 'RE-WORK':
  //       return '../../../assets/Content/icons/WIP.jpg';
  //     case 'COMPLETED':
  //       return '../../../assets/Content/icons/completed.jpg';
  //     default:
  //       return '';
  //   }
  // }


  // myActionable() {
  //   this.selectedTab = 'actionable';
  //   const option = 'DEFAULT';
  //   this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: { source: 'actionable' },
  //     queryParamsHandling: 'merge' 
  //   });
  //   this.resetSource();
  // }

  // AllocatedToMe() {
  //   this.selectedTab = 'allocatedToMe';
  //   const option = 'ALLOCATEDTOME';
  //   this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: { source: 'allocatedButNotStarted' },
  //     queryParamsHandling: 'merge' 
  //   });
    
  //   this.resetSource();
  // }

  // AllocatedByMe() {
  //   this.selectedTab = 'allocatedByMe';
  //   const option = 'ALLOCATEDBYME';
  //   this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: { source: 'allocatedByMe' },
  //     queryParamsHandling: 'merge' 
  //   });
  //   this.resetSource()
  // }

  // completedByMe() {
  //   this.selectedTab = 'completedByMe';
  //   const option = 'COMPLETEDBYME';
  //   this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: { source: 'completedByMe' },
  //     queryParamsHandling: 'merge' 
  //   });
  //   this.resetSource()
  // }

  // completedForMe() {
  //   this.selectedTab = 'completedForMe';
  //   const option = 'COMPLETEDFORME';
  //   this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: { source: 'completedForMe' },
  //     queryParamsHandling: 'merge' 
  //   });
  //   this.resetSource()

  // }

  // cancelled() {
  //   this.selectedTab = 'cancelled';
  //   const option = 'CANCELCLOSE';   
  //   this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
  //   this.resetSource()
  //   this.router.navigate([], {
  //     relativeTo: this.activatedRoute,
  //     queryParams: { source: 'cancelled' },
  //     queryParamsHandling: 'merge' 
  //   });
  // }


  resetSource() {
    this.activatedRoute.queryParams.subscribe(params => {const source = params['source']
    if(source !== 'All'){ this.selectedOption = 'All'}});
  }


  completionDate(){
    const option = 'All';
    // console.log(this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option))
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
