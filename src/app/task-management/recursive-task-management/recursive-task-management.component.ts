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
  @Input() loggedInUser: any;


  NewTaskOrSubTask: string = '';

  selectedMKey: number | undefined;

  mkey: number | any
  isSidebarOpen: boolean = false;

  project:any;
  sub_proj:any;

  isAscending: boolean = true;

  source:any;

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
    this.fetchProjectData();    

  }
 


  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getProjectDetailsNew(token).subscribe(
      (response: any) => {
        this.project = response[0].data;
        // console.log("Project", this.project);
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }


  // fetchSubProj(){

  //   this.apiService.getSubProjectDetails(proj.MASTER_MKEY).subscribe(
  //     (data: any) => {
  //       this.sub_proj = data;
  //       // console.log('this.sub_proj',this.sub_proj)                                  
  //     },
  //     (error: ErrorHandler) => {
  //       console.log(error, 'Error Occurred while fetching sub-projects');
  //     }
  //   );
  
  // }
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
    const token = this.apiService.getRecursiveUser();;

    this.apiService.getEmpDetailsNew(token).subscribe(
      (response: any) => {
        response[0].data.forEach((emp: any) => {
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
    this.loggedInUser = this.dataService.getUser();

    this.apiService.getRecursiveTaskManagement(this.recursiveLogginUser).subscribe(response => {
      if (response) {
        // Filter the data based on matching MKEY with assigneD_TO or createD_BY
        const filteredData = response.filter((selectedUserRes: any) => {
          const mkey = this.loggedInUser[0].MKEY;
          // Check if either assigneD_TO or createD_BY matches MKEY
          return selectedUserRes.assigneD_TO === mkey || selectedUserRes.createD_BY === mkey;
        });

        this.taskList = filteredData
    
        // console.log('Filtered Dashboard response:', filteredData);
      }
      // this.taskList = response;
      this.mergeEmployeeNamesWithTasks();
      this.mergingProjAndSubProjName();
    }, error => {
      console.error('Failed to fetch task details:', error);
    });
}


mergingProjAndSubProjName() {

  if (!this.project || !Array.isArray(this.project)) {
    console.error('Project list is undefined or not an array');
    return;
  }

  const projectMap = new Map(this.project.map((proj: any) => [proj.MASTER_MKEY, proj.TYPE_DESC]));

  const token = this.apiService.getRecursiveUser();


  this.project.forEach((proj: any) => {
    this.apiService.getSubProjectDetailsNew(proj.MASTER_MKEY.toString(), token).subscribe(
      (data: any) => {
        this.sub_proj = data;

        const subProjectMap = new Map(this.sub_proj.map((sub: any) => [sub.MASTER_MKEY, sub.TYPE_DESC]));
        
        if (this.taskList && this.taskList.length > 0) { 
          this.taskList.forEach((task: any) => {

              task.project_Name = projectMap.get(task.projecT_ID) || '0';
              task.sub_project_Name = subProjectMap.get(task.suB_PROJECT_ID) || '0'; // Adjust key as needed
          });
        } else {
            console.error('taskList is undefined or empty');
        }
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching sub-projects');
      }
    );
  });

}


mergeEmployeeNamesWithTasks() {
    const employeeMap = new Map(this.employees.map(emp => [emp.MKEY, emp.Assign_to]));

    this.taskList.forEach(task => {
      task.createD_BY_Name = employeeMap.get(task.createD_BY) || 'Unknown';
      task.lasT_UPDATED_BY_name = employeeMap.get(task.lasT_UPDATED_BY) || 'Unknown';
      task.assign_To_Name = employeeMap.get(task.assigneD_TO) || 'NA'
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
