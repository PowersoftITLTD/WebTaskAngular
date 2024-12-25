import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-team-status',
  templateUrl: './team-status.component.html',
  styleUrls: ['./team-status.component.css']
})
export class TeamStatusComponent implements OnInit {

  @Input() taskData: any;
  @Input() loggedInUser: any = {};

  selectedDetails:any[] = [];

  filterOptions: string[] = [
    'Department To-day',
    'Department Over-due',
    'Department Future',
    'Inter-Department To-day',
    'Inter-Department Over-due',
    'Inter-Department Future'
  ];


  FilterSelection: any;
  iconVisible: any = null;
  _SearchText: string = '';
  filteredTaskList: any[] = [];
  employees: any[] = [];

  ascendingOrder: boolean = true;
  isAscending: boolean = true;


  memberName:any;
  filterType: string = '';



  constructor(
    private apiService: ApiService,
    private dataService: CredentialService,
    private route: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void { 

    this.fetchEmployeeName();


    this.route.queryParams.subscribe(params => {
      this.memberName = params['Member_Name'];
      this.getDeptTypeDetails(this.memberName, '');
  
      const source = params['source'];
  
      switch (source) {
        case 'todayDepartment':
          this.FilterSelection = 'Department To-day';
          break;
        case 'overdueDepartment':
          this.FilterSelection = 'Department Over-due';
          break;
        case 'futureDepartment':
          this.FilterSelection = 'Department Future';
          break;
        case 'todayInterDepartment':
          this.FilterSelection = 'Inter-Department To-day';
          break;
        case 'overdueInterDepartment':
          this.FilterSelection = 'Inter-Department Over-due';
          break;
        case 'futureInterDepartment':
          this.FilterSelection = 'Inter-Department Future';
          break;
        default:
          break;
      }
    });
  
  }


 


  fetchEmployeeName(): void {
    const token = this.apiService.getRecursiveUser();;


    this.apiService.getEmpDetailsNew(token).subscribe(
      (response: any) => {


        response[0]?.data.forEach((emp: any) => {
          const fullName: string = emp.EMP_FULL_NAME.toUpperCase();
          const MKEY: any = emp.MKEY;
          let firstName: string = fullName.split(' ')[0];
          firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          this.employees.push({ Assign_to: fullName, MKEY: MKEY });
        });
  
        this.route.queryParams.subscribe(params => {
          const memberName = params['Member_Name'];
  
          const member = this.employees.find(emp => emp.Assign_to === memberName);
  
          if (member) {
            this.getDeptTypeDetails(memberName,'');
          } else {
            // console.log('No employee found with the name', memberName);
          }
        });
      },
      (error: ErrorHandler) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    if(this.isAscending){
      this.selectedDetails.sort((a, b) => {
        const dateA = new Date(b.COMPLETION_DATE.split('/').reverse().join('-')); 
        const dateB = new Date(a.COMPLETION_DATE.split('/').reverse().join('-')); 
        return dateA.getTime() - dateB.getTime();
      });    
    }else if(!this.isAscending){
      this.selectedDetails.sort((a, b) => {
        const dateA = new Date(a.COMPLETION_DATE.split('/').reverse().join('-')); 
        const dateB = new Date(b.COMPLETION_DATE.split('/').reverse().join('-')); 
        return dateA.getTime() - dateB.getTime();
      });    
    }
  }
  
  

  onFilterSelectionChange(option: string) {
    this.FilterSelection = option; 
    const token = this.apiService.getRecursiveUser();

    console.log('onFilterSelectionChange', token)

    const employee = this.employees.find(emp => emp.Assign_to === this.memberName);
    if (!employee) {
        return;
    }
  
    const MKEY = employee.MKEY;
    this.loggedInUser = this.dataService.getUser();
    if (!this.loggedInUser || !this.loggedInUser[0]?.MKEY) {
        return;
    }
  
    const CURRENT_EMP_MKEY = this.loggedInUser[0]?.MKEY;
  
  
    switch (option) {
      case 'Department To-day':
          this.apiService.departmentTodayDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {
            this.selectedDetails = this.filterDetails(response[0].data1, option)
          });
          break;
      case 'Department Over-due':
          this.apiService.departmentOverdueDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, option)});
          break;
      case 'Department Future':
          this.apiService.departmentFutureDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].response[0].data1, option)});
          break;
      case 'Inter-Department To-day':
          this.apiService.interDepartmentTodayDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, option)});
          break;
      case 'Inter-Department Over-due':
          this.apiService.interDepartmentOverdueDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, option)});
          break;
      case 'Inter-Department Future':
          this.apiService.interDepartmentFutureDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, option)});
          break;
      default:
    }
  }
  
  
  getDeptTypeDetails(memberName: string, filterOption: string): void {
    const employee = this.employees.find(emp => emp.Assign_to === memberName);

    const token = this.apiService.getRecursiveUser();

    
    if (!employee) {      
        return;
    }

    const MKEY = employee.MKEY;
    this.loggedInUser = this.dataService.getUser();
    if (!this.loggedInUser || !this.loggedInUser[0]?.MKEY) {
        console.error("Logged-in user or MKEY is undefined.");
        return;
    }

    const CURRENT_EMP_MKEY = this.loggedInUser[0]?.MKEY;


    this.route.queryParams.subscribe(params => {
        const source = params['source'];

        switch (source) {
            case 'todayDepartment':
                this.apiService.departmentTodayDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {
                  console.log('todayDepartment', response[0].data)
                  this.selectedDetails = this.filterDetails(response[0].data1, filterOption)
                });
                break;
            case 'overdueDepartment':
                this.apiService.departmentOverdueDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {
                  console.log('overdueDepartment', response[0].data)
                  this.selectedDetails = this.filterDetails(response[0].data1, filterOption)
                });
                break;
            case 'futureDepartment':
                this.apiService.departmentFutureDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, filterOption)});
                break;
            case 'todayInterDepartment':
                this.apiService.interDepartmentTodayDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, filterOption)});
                break;
            case 'overdueInterDepartment':
                this.apiService.interDepartmentOverdueDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, filterOption)});
                break;
            case 'futureInterDepartment':
                this.apiService.interDepartmentFutureDetailsNew(CURRENT_EMP_MKEY.toString(), MKEY.toString(), token).subscribe((response) => {this.selectedDetails = this.filterDetails(response[0].data1, filterOption)});
                break;
            default:
                console.error(`Invalid source: ${source}`);
         }
      });
  }


  onFilterTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();

    

    // this.filterType = value;
   if(value === 'creationDate'){
      this.selectedDetails.sort((a, b) => {
        const dateA = new Date(b.CREATION_DATE.split('/').reverse().join('-')); 
        const dateB = new Date(a.CREATION_DATE.split('/').reverse().join('-')); 
        return dateA.getTime() - dateB.getTime();
      }); 


    }else if(value === 'completionDate'){

    this.selectedDetails.sort((a, b) => {
        const dateA = new Date(b.COMPLETION_DATE.split('/').reverse().join('-')); 
        const dateB = new Date(a.COMPLETION_DATE.split('/').reverse().join('-')); 
        return dateA.getTime() - dateB.getTime();
      });    
      
    }
  
  }


openSelectedTask(mkey: any) {
  this.router.navigate(['task', 'selected-task-info', { Task_Num: (mkey.MKEY) }]);      
}

  filterDetails(data: any[], filterOption: string): any[] {
    switch (filterOption) {
        case 'Department To-day':
            return data.filter(item => item);
        case 'Department Over-due':
            return data.filter(item => item);
        case 'Department Future':
            return data.filter(item => item);
        case 'Inter-Department To-day':
            return data.filter(item => item);
        case 'Inter-Department Over-due':
            return data.filter(item => item);
        case 'Inter-Department Future':
            return data.filter(item => item);
        default:
            return data;
     }
  }


  getIcon(status: string): string {
    switch (status.toUpperCase()) {
      case 'CREATED':
        return '../../../assets/Content/icons/Created.png';
      case 'SUB TASK CREATED':
        return '../../../assets/Content/icons/SubTask1.png';
      case 'CANCEL':
        return '../../../assets/Content/icons/Cancell.png';
      case 'CANCEL INITIATED':
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
}
