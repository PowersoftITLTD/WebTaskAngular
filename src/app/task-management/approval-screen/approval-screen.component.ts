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

  // @Input() taskData: any;


  task: any[] = [];
  taskList: any[] = [];
  docCatList:any[] = [];
  searchFields: string[] = [];


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
        this.getDocumentDepository();
        this.buttonText = 'ADD Depository'
      }
    })


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

    // console.log('Task List',this.taskList)

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

  console.log('onFilterTypeChange: ',value)
  

  // this.filterType = value;
 if(value === 'creationDate' ){
    // this.taskList
    this.taskList.sort((a, b) => {
      const dateA = new Date(b.CREATION_DATE.split('/').reverse().join('-')); 
      const dateB = new Date(a.CREATION_DATE.split('/').reverse().join('-')); 
      return dateA.getTime() - dateB.getTime();
    }); 
   

  }else if(value === 'completionDate'){

    this.taskList.sort((a, b) => {
      const dateA = new Date(b.COMPLETION_DATE.split('/').reverse().join('-')); 
      const dateB = new Date(a.COMPLETION_DATE.split('/').reverse().join('-')); 
      return dateA.getTime() - dateB.getTime();
    });          
   
  }

}



openSelectedTask(data: any) {
  console.log('Data passed:', data); 

 
  
  const button = this.buttonText;
  if (button === 'ADD Template') {
    this.router.navigate(['approvals', 'document-tempelate', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }else if(button === 'ADD Abbrevation'){
    this.router.navigate(['approvals', 'approved-tempelate', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }else if (button === 'ADD Project') {
    this.router.navigate(['approvals', 'project-defination', { Temp_Id: data.mkey }], {state: { taskData: data }});
  }else if(button === 'ADD Depository'){
    this.router.navigate(['approvals', 'project-document-depository', { Temp_Id: data.MKEY }], {state: { taskData: data }});
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
  
  this.taskList.sort((a, b) => {
    if (this.isAscending) {
      return a.mkey - b.mkey; 
    } else {
      return b.mkey - a.mkey;
    }
  });
}

fetchDocCategory(){
  this.recursiveLogginUser = this.apiService.getRecursiveUser();

  this.apiService.getDocCategory(this.recursiveLogginUser).subscribe({
    next: (list: any) => {
      this.docCatList = list
      this.setCategoryData();

    },
    error: (error: any) => {
      console.error('Unable to fetch Document Type List', error);
    }
  });
}


fetchComboDetails(){
  this.apiService.getBuildingClassificationDP(this.recursiveLogginUser).subscribe({
    next: (list: any) => {
      this.buildingList = list;
      this.setComboData()

      console.log('Building Classification List:', this.buildingList);       
    },
    error: (error: any) => {
      console.error('Unable to fetch Building Classification List', error);
    }
  });

  // 2. Standard DP
  this.apiService.getStandardDP(this.recursiveLogginUser).subscribe({
    next: (list: any) => {
      this.standardList = list;
      console.log('Standard List:', this.standardList);      
    },
    error: (error: any) => {
      console.error('Unable to fetch Standard List', error);
    }
  });

  // 3. Statutory Authority DP
  this.apiService.getStatutoryAuthorityDP(this.recursiveLogginUser).subscribe({
    next: (list: any) => {
      this.statutoryAuthList = list;
      console.log('statutoryAuthList List:', this.statutoryAuthList);      

    },
    error: (error: any) => {
      console.error('Unable to fetch Statutory Authority List', error);
    }
  });
}

setCategoryData(): void {
  if (this.taskList) {
 
    this.taskList.forEach((task: any) => {
      const matchedCategory = this.docCatList.find((doc_type: any) => doc_type.mkey === task.doC_CATEGORY);

      if (matchedCategory) {
        task.category_Name = matchedCategory.typE_DESC; 
      } else {
        console.log('No matching category found for doC_CATEGORY:', task.doC_CATEGORY);
      }
    });

    console.log('Updated taskList with category names:', this.taskList);
  }
}


setComboData(): void {
  if (this.taskList) {

    this.taskList.forEach((task: any) => {
      const matchedBuilding = this.buildingList.find((building: any) => building.mkey === task.buildinG_TYPE);
      const matchedStandard = this.standardList.find((standard: any) => standard.mkey === task.buildinG_STANDARD);
      const matchedAuthority = this.statutoryAuthList.find((authority: any) => authority.mkey === task.statutorY_AUTHORITY);

      if (matchedBuilding && matchedStandard ) {
        task.building_Name = matchedBuilding.typE_DESC; 
        task.standard_Name = matchedStandard.typE_DESC
        task.authority_Name = matchedAuthority.typE_DESC
      } else {
        // console.log('No matching category found for doC_CATEGORY:', task.doC_CATEGORY);
      }
    });
    // console.log('Updated taskList with category names:', this.taskList);
  }
}




getApprovalTempList(){
  this.recursiveLogginUser = this.apiService.getRecursiveUser();

  this.apiService.getApprovalTemp(this.recursiveLogginUser).subscribe({
    next:(approval_temp_data) =>{
      
      this.taskList = approval_temp_data.reverse();
      this.fetchComboDetails()
      // console.log('approval_temp_data', approval_temp_data)

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

    this.apiService.getProjectDefination(this.recursiveLogginUser, USER_CRED.MKEY).subscribe({
      next:(proj_def) => {
        this.taskList = proj_def.reverse();
        // console.log('proj_def',proj_def)
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

    this.apiService.getDocumentTempelate( USER_CRED.MKEY, this.recursiveLogginUser).subscribe({
      next: (doc_temp_list) => {
        this.fetchDocCategory();


        this.taskList = doc_temp_list.reverse();
      }, error: (error) => {
        if (error) {
          console.log('error', error)
        }
      }
    })
  }


  getDocumentDepository(){
    const data = this.dataService.getUser();
    console.log('onLogin data')

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };

    this.recursiveLogginUser = this.apiService.getRecursiveUser();


    this.apiService.getDocumentryList( this.recursiveLogginUser, USER_CRED.MKEY).subscribe({
      next: (depositoryList) => {
        console.log('depositoryList', depositoryList)

        this.taskList = depositoryList.reverse();
      }, error: (error) => {
        if (error) {
          console.log('error', error)
        }
      }
    })
  }
  

}

 