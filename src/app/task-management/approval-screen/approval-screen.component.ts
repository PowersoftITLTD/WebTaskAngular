import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-approval-screen',
  templateUrl: './approval-screen.component.html',
  styleUrls: ['./approval-screen.component.css']
})
export class ApprovalScreenComponent implements OnInit {

  @Input() taskData: any;


  task: any[] = [];
  taskList: any[] = [];


  filterType: string = '';


  // selected: any;
  // iconVisible: any = null;
  status: string = '';
  _SearchText: string = '';
  selectedTab: string = 'actionable';


  buildingList:any [] = [];
  standardList:any[] = [];
  statutoryAuthList:any[] = [];
  jobRoleList:any[] = [];
  departmentList:any[] = [];
  docTypeList:any[] = [];
  SanctoningAuthList:any[]=[];
  SanctoningDeptList:any[]=[];

  options: any[] = [];
  employees: any[] = [];
  filteredTasks: any[] = [];

  @Input() recursiveLogginUser: any = {};
  @Input() loggedInUser: any;



  selectedMKey: number | undefined;

  mkey: number | any
  isSidebarOpen: boolean = false;

  project:any;
  sub_proj:any;

  isAscending: boolean = true;

  source:any;

  createdOrUpdatedUserName:any

  loginName: string = '';
  loginPassword: string = '';

  jwtToken: string | any = '';
  taskDetails: any;

  buttonText = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private dataService: CredentialService,
    private http:HttpClient
  ) { }

  ngOnInit(): void {


    this.source = this.activatedRoute.queryParams.subscribe(params => {
      const source = params['source'];
      console.log('check source',source)
      if (source === 'document-tempelate') {
        console.log('In document template')
        this.buttonText = 'ADD Template';
        this.getDocumentTempList();
      } else if (source === 'authority-tempelate') {
        this.buttonText = 'ADD Abbrevation';
        this.getApprovalTempList();
      } else if (source === 'project-defination') {
        this.getProjDefinationList();
        this.buttonText = 'ADD Project';
      } else if(source === 'project-document-depository'){
        this.buttonText = 'ADD Depository'
      }
    })

  }

  private fetchData(): void {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
  
    // 1. Building Classification DP
    this.apiService.getBuildingClassificationDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.buildingList = list;
        console.log('Building Classification List:', this.buildingList);       
      },
      error: (error: ErrorHandler) => {
        console.error('Unable to fetch Building Classification List', error);
      }
    });
  
    // 2. Standard DP
    this.apiService.getStandardDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.standardList = list;
        console.log('Standard List:', this.standardList);      
      },
      error: (error: ErrorHandler) => {
        console.error('Unable to fetch Standard List', error);
      }
    });
  
    // 3. Statutory Authority DP
    this.apiService.getStatutoryAuthorityDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.statutoryAuthList = list;
        console.log('Statutory Authority List:', this.statutoryAuthList);      
      },
      error: (error: ErrorHandler) => {
        console.error('Unable to fetch Statutory Authority List', error);
      }
    });
  

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
          this.fetchApprovalTempelate();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }


  fetchApprovalTempelate() {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    this.loggedInUser = this.dataService.getUser();

    this.apiService.getDocumentTempelate(this.loggedInUser[0].MKEY, this.recursiveLogginUser).subscribe(response => {
      if (response) {
        // Filter the data based on matching MKEY with assigneD_TO or createD_BY
        const filteredData = response.filter((selectedUserRes: any) => {
          const mkey = this.loggedInUser[0].MKEY;
          // Check if either assigneD_TO or createD_BY matches MKEY
          return selectedUserRes.assigneD_TO === mkey || selectedUserRes.createD_BY === mkey;
        });

        this.taskList = filteredData
    
        console.log('Filtered Dashboard response:', filteredData);
      }
      // this.taskList = response;
     
    }, error => {
      console.error('Failed to fetch task details:', error);
    });
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



openSelectedTask(data: any) {
  console.log('Data passed:', data); // Log the data to see its content

 
  
  const button = this.buttonText;
  if (button === 'ADD Template') {
    this.router.navigate(['approvals', 'document-tempelate', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }else if(button === 'ADD Abbrevation'){
    this.router.navigate(['approvals', 'approved-tempelate', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }else if (button === 'ADD Project') {
    this.router.navigate(['approvals', 'project-defination', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }else if(button === 'ADD Depository'){
    this.router.navigate(['approvals', 'project-document-depository', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }
}


addApprovalTemp(add_new_data:any){

  const button = this.buttonText
  if(button === 'ADD Abbrevation'){
    this.router.navigate(['approvals', 'approved-tempelate', { Temp_Id: add_new_data }]);
  }else if(button === 'ADD Template'){
    this.router.navigate(['approvals', 'document-tempelate', { Temp_Id: add_new_data }]);
  }else if(button === 'ADD Project'){
    this.router.navigate(['approvals', 'project-defination', { Temp_Id: add_new_data }]);
  }else if(button === 'ADD Depository'){
    this.router.navigate(['approvals', 'project-document-depository', { Temp_Id: add_new_data }]);
  }

}

toggleSortOrder(): void {
  this.isAscending = !this.isAscending;
}



getApprovalTempList(){
  this.recursiveLogginUser = this.apiService.getRecursiveUser();

  this.apiService.getApprovalTemp(this.recursiveLogginUser).subscribe({
    next:(approval_temp_data) =>{
      
      this.taskList = approval_temp_data;
      console.log('approval_temp_data', approval_temp_data.data)

    },error:(error) =>{
      console.log('Error occured', error)
    }
  })
}

  getProjDefinationList(){
    const data = this.dataService.getUser();
      console.log('onLogin data')

      const USER_CRED = {    
        MKEY:data[0]?.MKEY,
        EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL, 
        PASSWORD:atob(data[0]?.LOGIN_PASSWORD)
      }; 

    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    console.log('USER_CRED.MKEY', USER_CRED.MKEY)

    this.apiService.getProjectDefination(this.recursiveLogginUser, USER_CRED.MKEY).subscribe({
      next:(proj_def) => {
        this.taskList = proj_def;
        console.log('proj_def',proj_def)
      },error:(error)=>{
        if(error){
          console.log('error', error)
        }
      }
    })
  }


  getDocumentTempList() {
    const data = this.dataService.getUser();
    console.log('onLogin data')

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };

    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    console.log('USER_CRED.MKEY',USER_CRED.MKEY)
    console.log('recursiveLogginUser', this.recursiveLogginUser)

    this.apiService.getDocumentTempelate( USER_CRED.MKEY, this.recursiveLogginUser).subscribe({
      next: (doc_temp_list) => {
        console.log('doc_temp_list', doc_temp_list)

        this.taskList = doc_temp_list;
      }, error: (error) => {
        if (error) {
          console.log('error', error)
        }
      }
    })
  }
  


}

  // this.router.navigate(['approvals', 'approved-tempelate', { Task_Num: add_new_appr_tempelate }]);

  // this.router.navigate(['/recursive-task/add-recursive-task']);

   // this.router.navigate(['approvals/project-defination']);
 // this.router.navigate(['approvals/document-tempelate']);
 

    // this.router.navigate(['approvals/approved-tempelate']);
    // this.selectedTab = 'approved-tempelate'