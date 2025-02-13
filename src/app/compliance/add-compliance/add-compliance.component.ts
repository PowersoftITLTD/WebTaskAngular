import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { SideBarService } from 'src/app/services/side-panel/side-bar.service';

@Component({
  selector: 'app-add-compliance',
  templateUrl: './add-compliance.component.html',
  styleUrls: ['./add-compliance.component.css']
})
export class AddComplianceComponent implements OnInit, OnDestroy {

  complianceForm: FormGroup | any

  createdOrUpdatedUserName: any

  isFieldDisabled = true; 


  loginName: string = '';
  loginPassword: string = '';

  source:any;

  receivedUser: any;

    @Input() loggedInUser: any;
    @Input() recursiveLogginUser: any = {};

  tags: any[] = [];
  suggestions: any[] = [];
  allTags: any[] = [];
  selectedTags: any[] = [];
  selectedCategory: any;
  initiate:string | any;
  jobRoleList: any[] = [];
  departmentList: any[] = [];
  raisedAtList:any[] = [];
  raisedBefore:any[] = [];
  complianceStatus:any[]=[];

  selectedProperty:string | any;
  selectedBuilding:string | any;


  taskData: any;


  category: any = [];
  project: any = [];
  sub_proj: any = [];
  status: any = [];
  empName: any = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];
  taskCompliance: string | any;


  inputHasValue: boolean = false;
  updatedDetails: boolean = false;


  constructor(
    private apiService: ApiService,
        private formBuilder: FormBuilder,
        private tostar: ToastrService,
        private credentialService: CredentialService,
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        // private sidebarService: SideBarService
  ) { 

    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';
    console.log(isNewTemp)
    if (navigation?.extras.state) {

      const RecursiveTaskData: any = navigation.extras.state.taskData;
      const initiate_mode: any = navigation.extras.state.initiate;
      const taskComplianceMode: any = navigation.extras.state.taskCompliance;

      this.taskData = RecursiveTaskData;
      this.initiate = initiate_mode;
      this.taskCompliance = taskComplianceMode

      
      console.log('task data', this.taskData)
      console.log('initiate', this.initiate)
      console.log('taskCompliance', this.taskCompliance)


      if (RecursiveTaskData.mkey) {
        this.updatedDetails = !isNewTemp;
      } else {
        this.updatedDetails = false;
      }

      sessionStorage.setItem('task', JSON.stringify(RecursiveTaskData));
      sessionStorage.setItem('initiate', initiate_mode);

      sessionStorage.removeItem('add_new_task');
    } else {
      const RecursiveTaskData = sessionStorage.getItem('task');
      if (RecursiveTaskData) {
        try {
          this.taskData = JSON.parse(RecursiveTaskData);
          if (!isNewTemp) {
            this.updatedDetails = this.taskData.mkey ? true : false;
          }
        } catch (error) {
          console.error('Failed to parse task data', error);
        }
      }
    }  
  }

  ngOnInit(): void {

    this.fetchProjectData();

 
    this.initiate = this.activatedRoute.snapshot.paramMap.get('initiate');
    console.log('Initiate mode:', this.initiate);

    this.taskCompliance = this.activatedRoute.snapshot.paramMap.get('taskCompliance');
    console.log('taskCompliance', this.taskCompliance)    


    this.onLogin();
    this.complianceFormInitlize();
    // this.fetchCategoryData();
    this.fetchEmployeeName();
    this.getTagsnew();

    if(this.taskData && this.taskData?.MKEY){
      this.fetchProjectData();  
      this.raisedAtListUpdate();    
      this.getSubProj();

      const tagsArray = this.taskData.TAGS.split(',');
      this.selectedTags = tagsArray;

   }

  }


  complianceFormInitlize(){
    this.complianceForm = this.formBuilder.group({
        property: [{ value: '', disabled: this.taskCompliance ? this.isFieldDisabled : !this.isFieldDisabled }, Validators.required],
        building: [{ value: '', disabled: this.taskCompliance ? this.isFieldDisabled : !this.isFieldDisabled }, Validators.required],
        shortDescription:[''],
        longDescription:[''],
        raisedAt:['', Validators.required],
        raisedBefore:[''],
        responsibleDepartment:['', Validators.required],
        jobRole:['', Validators.required],
        responsiblePerson:[''],
        toBeCompletedBy:[''],
        noOfDays:[''],
        status:[''],
        tags:['']
    })

    if(this.taskData && this.taskData.MKEY ){
 
      this.complianceForm.patchValue({responsibleDepartment:this.taskData.RESPONSIBLE_DEPARTMENT});
      this.complianceForm.patchValue({jobRole:this.taskData.JOB_ROLE});
      this.complianceForm.patchValue({raisedAt: this.taskData.RAISED_AT}); 
      this.complianceForm.patchValue({raisedBefore: this.taskData.RAISED_AT_BEFORE});          
      this.complianceForm.patchValue({toBeCompletedBy:this.formatDate(this.taskData.TO_BE_COMPLETED_BY)});  
    }
   
  }


  onLogin() {

    this.credentialService.validateUser(this.loginName, this.loginPassword);

    const data = this.credentialService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,

      console.log('onLogin data')

    const USER_CRED = {
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };

    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if (response.jwtToken) {
          this.fetchData();
          // this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });



    //;
  }

  private fetchData(): void {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();



    // 4. Job Role DP
    this.apiService.getJobRoleDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.jobRoleList = list;
        this.setJobName();
        // console.log('Job Role List:', this.jobRoleList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Job Role List', error);
      }
    });


    //getComplianceStatus
    this.apiService.getComplianceStatus(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.complianceStatus = list[0].Data

        // console.log('Status', this.complianceStatus)

        // console.log('check Initiate mode form:', this.initiate)
        if (this.initiate === null && this.taskCompliance === null) {
          const defaultStatus = this.complianceStatus.find(c => c.TYPE_DESC === "New");

          // console.log('defaultStatus', defaultStatus)
          if (defaultStatus) {
            this.complianceForm.patchValue({ status: defaultStatus.TYPE_DESC });
          }
        } else if (this.initiate === 'initiate_mode') {
          const defaultStatus = this.complianceStatus.find(c => c.TYPE_DESC === "Initiated");

          // console.log('defaultStatus', defaultStatus)
          if (defaultStatus) {
            this.complianceForm.patchValue({ status: defaultStatus.TYPE_DESC });
          }
        } else if (this.taskCompliance === 'taskCompliainceMode') {

          const defaultStatus = this.complianceStatus.find(c => c.TYPE_DESC === "New");

          console.log('defaultStatus', defaultStatus)
          if (defaultStatus) {
            this.complianceForm.patchValue({ status: defaultStatus.TYPE_DESC });
          }
        }

      }, error: (error: ErrorHandler) => {
        this.tostar.error('Error occured while fetching Raised At')

        console.log(error)
      }
    });



    this.apiService.getDepartmentDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.departmentList = list
        this.setDepartmentName();

      }, error: (error: ErrorHandler) => {
        this.tostar.error('Error occured while fetching Responsible Department')
      }
    })

    if (this.taskData && this.taskData.MKEY) {
      // this.checkValueForNewRow_1();
    }




  }

  

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  selectEmployee(employee: any): void {

    // console.log('selectEmployee',employee)
    const assignedTo = employee.Assign_to;

    // console.log('assignedTo', assignedTo)
    this.complianceForm.get('responsiblePerson').setValue(assignedTo);

    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
  }


  getTagsnew() {
    this.loggedInUser = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => { 
        this.allTags = response[0].data.map((item: { name: string }) => item.name);
    
    });
}


setJobName(): void {
  if (this.taskData && this.taskData.MKEY) {

    const matchedJobRole = this.jobRoleList.find((role: any) =>
      role.mkey === Number(this.taskData.JOB_ROLE)
    );

    if (matchedJobRole) {
      this.taskData.JOB_ROLE_NAME = matchedJobRole.typE_DESC;
    }
  }
}


setDepartmentName(): void {
  if (this.taskData && this.taskData.MKEY) {

    const matchedDept = this.departmentList.find((department: any) =>
      department.mkey === Number(this.taskData.RESPONSIBLE_DEPARTMENT)
    );

    if (matchedDept) {
      this.taskData.AUTHORITY_DEPARTMENT_NAME = matchedDept.typE_DESC;

      // console.log(this.taskData)
    }
  }
}

  fetchEmployeeName(): void {
    const token = this.apiService.getRecursiveUser();


    this.apiService.getEmpDetailsNew(token).subscribe(
      (response: any) => {
        // console.log("Employee data:", data);
        // const _data = data;

        response[0]?.data.forEach((emp: any) => {
          const fullName = emp.EMP_FULL_NAME;
          const MKEY = emp.MKEY;
          let capitalizedFullName = '';
          const nameParts = fullName.split(' ');

          // console.log('nameParts', nameParts)

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
          this.setEmpName();

        });
        // console.log('this.employees', this.employees);    
      },
      (error: ErrorHandler) => {
        console.error('Error fetching employee details:', error);
      }
    );
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


    taskNameMaxLength() {
      // return this.taskForm.get('taskName').value.length >= 150;
    }

    descriptionMaxLength() {
      // return this.taskForm.get('taskDescription').value.length >= 1000;
    }
  
    onProjectSelect(selectElement: HTMLSelectElement) {
      const selectedIndex = selectElement.selectedIndex - 1;
      const selectedOption: any = this.project[selectedIndex];
      const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : null;
      const token = this.apiService.getRecursiveUser();
  
  
      console.log('selectedProjectMkey',selectedProjectMkey)
  
      if (selectedProjectMkey) {
        this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
          (response: any) => {
            console.log(response)
            this.sub_proj = response[0]?.data;
            console.log("Sub-Project", this.sub_proj);
            // this.raisedAtListCheck()

          },
          (error: ErrorHandler) => {
            console.log(error, 'Error Occurred while fetching sub-projects');
          }
        );
      }
    }
  



    raisedAtListCheck() {
      const propertyMKey = this.complianceForm.get('property')?.value?.MASTER_MKEY;
      const buildingMKey = this.complianceForm.get('building')?.value?.MASTER_MKEY;
    
      const user = this.credentialService.getUser();
      const token = this.apiService.getRecursiveUser();

    
      if (!propertyMKey || !buildingMKey || !user?.[0]?.MKEY || !token) {
        this.tostar.error('Missing required inputs for fetching Raised At data');
        return;
      }
    
    
    
      // const handleError = (error: any, type: string) => {
      //   this.tostar.error(`Error occurred while fetching ${type} data`);
      //   console.error(`${type} Error:`, error);
      // };
    
      // Fetch "Raised At" data
      this.apiService.getRaisedAt(buildingMKey, propertyMKey, user[0].MKEY, token).subscribe({
        next: (list: any) => {
          if (list?.[0]?.data) {
            this.raisedAtList = list[0].data;

            console.log('Raised At Data:', this.raisedAtList);
            console.log('this.taskData.list', this.raisedAtList[0].TYPE_DESC)
          
            // this.complianceForm.patchValue({raisedAt: 'General'});
          }
          const message = list?.[0]?.Message || 'No message provided';
          this.tostar.warning(message);
        },
        error: (error: any) => {
          this.tostar.error('Error occurec while fetching data', error)
        },
      });
    
      // Fetch "Raised Before" data - Use this.raisedBefore
      this.apiService.getRaisedBedore(buildingMKey, propertyMKey, user[0].MKEY, token).subscribe({
        next: (list: any) => {
          if (list?.[0]?.data) {
            this.raisedBefore = list[0].data;
            console.log('Raised Before Data:', this.raisedBefore);
          }
          const message = list?.[0]?.Message || 'No message provided';
          this.tostar.warning(message);
        },
        error: (error: any) =>{
          this.tostar.error('Error occurec while fetching data', error)

        },
      });
    }

    raisedAtListUpdate() {
      console.log('raisedAtListUpdate: ',this.taskData)

    
      const propertyMKey = this.taskData.PROPERTY_MKEY;
      const buildingMKey = this.taskData.BUILDING_MKEY;
    
      const user = this.credentialService.getUser();
      const token = this.apiService.getRecursiveUser();

      console.log(propertyMKey);
      console.log(buildingMKey);
      console.log(user?.[0]?.MKEY);
      console.log(token);

      console.log(this.taskData)
      if (!propertyMKey || !buildingMKey || !user?.[0]?.MKEY || !token) {
        this.tostar.error('Missing required inputs for fetching Raised At data');
        return;
      }
    
    
    
      // const handleError = (error: any, type: string) => {
      //   this.tostar.error(`Error occurred while fetching ${type} data`);
      //   console.error(`${type} Error:`, error);
      // };
    
      // Fetch "Raised At" data
      this.apiService.getRaisedAt(buildingMKey, propertyMKey, user[0].MKEY, token).subscribe({
        next: (list: any) => {
          if (list?.[0]?.data) {
            this.raisedAtList = list[0].data;
           
            console.log('this.taskData.list', this.taskData.list[0])


            console.log('Raised At Data:', this.raisedAtList);
          }
          const message = list?.[0]?.Message || 'No message provided';
          // this.tostar.warning(message);
        },
        error: (error: any) => {
          this.tostar.error('Error occurec while fetching data', error)
        },
      });
    
      // Fetch "Raised Before" data - Use this.raisedBefore
      this.apiService.getRaisedBedore(buildingMKey, propertyMKey, user[0].MKEY, token).subscribe({
        next: (list: any) => {
          if (list?.[0]?.data) {
            this.raisedBefore = list[0].data;
            console.log('Raised Before Data:', this.raisedBefore);
          }
          const message = list?.[0]?.Message || 'No message provided';
          // this.tostar.warning(message);
        },
        error: (error: any) =>{
          this.tostar.error('Error occurec while fetching data', error)

        },
      });
    }
    
    


    //getRaisedBedore

    onAddAndUpdateCompliance(){

      const token = this.apiService.getRecursiveUser();
      const user_data = this.credentialService.getUser();

      const assignedToValue = this.complianceForm.get('responsiblePerson')?.value;
      const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);
      const  assignedEmployeeMKey = assignedEmployee ? assignedEmployee.MKEY : null;


      const tagsValue = this.complianceForm.get('tags')?.value;

      let tagsString = '';
      // console.log('tagsValue', tagsValue)
  
      if (Array.isArray(tagsValue)) {
        tagsString = tagsValue.map(tag => {
          if (typeof tag === 'string') {
            return tag;
          } else if (tag.display) {
            return tag.display;
          } else {
            return '';
          }
        }).join(',');
      }           

      const raised_at_mkey = this.complianceForm.get('raisedAt')?.value;
      const raised_before_mkey = this.complianceForm.get('raisedBefore')?.value;
      
      console.log('Raised At mkey', raised_at_mkey)

      const check_building = this.complianceForm.get('building')?.value;
      const check_property = this.complianceForm.get('property')?.value;

      console.log('check_building: ',check_building)
      if(this.taskData && this.taskData.MKEY){
        if(this.complianceForm.get('property')?.value?.MASTER_MKEY !== undefined){
          this.taskData.PROPERTY_MKEY = null
          // this.taskData.BUILDING_MKEY = null        
        }
      }

      // console.log('this.taskData.PROPERTY_MKEY', this.taskData.PROPERTY_MKEY)
      // console.log('this.taskData.BUILDING_MKEY', this.taskData.BUILDING_MKEY)

      if(this.taskData && this.taskData?.MKEY){
        if(this.taskData.PROPERTY_MKEY === undefined && this.taskData.BUILDING_MKEY === null || check_building === '0' || check_property === '0'){
          if(this.complianceForm.get('building')?.value?.MASTER_MKEY === undefined){
            this.tostar.error('Please select property and building')
            return;
          }
        }
      }
    
        
      const compliance_data = {

        CAREGORY:64,
        TASK_TYPE:360,
        MKEY: this.taskData && this.taskData.MKEY ? this.taskData.MKEY : 0,
        PROPERTY_MKEY: this.complianceForm.get('property')?.value?.MASTER_MKEY || this.taskData.PROPERTY_MKEY,
        BUILDING_MKEY: this.complianceForm.get('building')?.value?.MASTER_MKEY || this.taskData.BUILDING_MKEY,
        SHORT_DESCRIPTION:this.complianceForm.get('shortDescription')?.value,
        LONG_DESCRIPTION:this.complianceForm.get('longDescription')?.value,
        RAISED_AT:raised_at_mkey,
        RAISED_AT_BEFORE:raised_before_mkey?raised_before_mkey:null,
        RESPONSIBLE_DEPARTMENT:this.complianceForm.get('responsibleDepartment')?.value,
        JOB_ROLE:this.complianceForm.get('jobRole')?.value,
        RESPONSIBLE_PERSON:assignedEmployeeMKey,
        TO_BE_COMPLETED_BY:this.complianceForm.get('toBeCompletedBy')?.value,
        NO_DAYS:this.complianceForm.get('noOfDays')?.value,
        STATUS:this.complianceForm.get('status')?.value.charAt(0),
        TAGS:tagsString,
        DELETE_FLAG:'N',
        CREATED_BY:user_data[0].MKEY
      }

  
      console.log('form property', this.complianceForm.get('property')?.value?.MASTER_MKEY)
      console.log('form building', this.complianceForm.get('building')?.value?.MASTER_MKEY)

      this.apiService.postComplianceDetails(compliance_data, token).subscribe({
        next:(data)=>{

          if(data[0].MESSAGE === 'Already exist'){
            this.tostar.error(`Property and building of this compliance ${data[0].MESSAGE}`)

          }else{
            this.tostar.success(data[0].MESSAGE)
            console.log('Data updated successfully',data)
            this.router.navigate(['task/compliance-management']);

          }
        },   error: (error: any) => {
          console.error('Error response:', error);
      
          const errorDetails = error.error?.errors;

          console.log('errorDetails', errorDetails)
      
          if (errorDetails) {
            // Check if RESPONSIBLE_DEPARTMENT exists in the errors
            const responsibleDepartmentErrors = errorDetails["$.RESPONSIBLE_DEPARTMENT"];
            const miss_building = errorDetails["$.BUILDING_MKEY"];
            const miss_raised_at = errorDetails["$.RAISED_AT"]
            const miss_complition_date = errorDetails["$.TO_BE_COMPLETED_BY"]

            console.log('responsibleDepartmentErrors: ',responsibleDepartmentErrors)
            
            if (responsibleDepartmentErrors) {
              this.tostar.error('Required Field', 'Responsible field is required'); 

            } else if(miss_building){
              this.tostar.error('Please select building.');
            }else if(miss_raised_at){
              this.tostar.error('Please select Raised At');
            }else if(miss_complition_date){
              this.tostar.error('Complition data is missing');
            }
          } else {
            this.tostar.error('Unable to send Request', 'Error occurred');
          }
        }
      });
      console.log('compliance_data: ',compliance_data)
    }


  filterEmployees(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    if (!value) {
      this.filteredEmployees = [];
      return;
    }

    const filterValue = value.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => {
      const fullName = emp.Assign_to.toLowerCase();
      return fullName.includes(filterValue);
    });

    this.inputHasValue = value.trim().length > 0;

    // console.log('filteredEmployees', this.filteredEmployees);
  }

  setEmpName(): void {
    if (this.taskData && this.taskData.MKEY) {
  
      // console.log('setEmpName',this.employees)
      // console.log('this.departmentList', this.departmentList)
      const matchedEmp = this.employees.find((employee: any) =>
        employee.MKEY === Number(this.taskData.RESPONSIBLE_PERSON)
      );
  
      // console.log('matchedEmp', matchedEmp)
  
      if (matchedEmp) {
        this.taskData.emp_name = matchedEmp.Assign_to;
      }
    }
  }

  getSubProj() {

    const token = this.apiService.getRecursiveUser();

    console.log('this.taskData.PROPERTY ', this.taskData.PROPERTY_MKEY)

    this.apiService.getSubProjectDetailsNew(this.taskData.PROPERTY_MKEY.toString(), token).subscribe(
      (response: any) => {
        this.sub_proj = response[0].data;

        console.log('Sub Project',this.sub_proj)
        this.setProjectNameToTaskData();

      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching sub-projects');
      }
    );
  }




  formatDate(date: Date): string {
    console.log('date', date);
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');  // Ensure the day is two digits
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Ensure the month is two digits
    const year = dateObj.getFullYear();  // Get the full year
    return `${year}-${month}-${day}`;  // Return in YYYY-MM-DD format
  }

  setProjectNameToTaskData(): void {
    if (this.taskData && this.taskData.MKEY) {
      const token = this.apiService.getRecursiveUser();
  
      this.apiService.getProjectDetailsNew(token).subscribe(
        (response: any) => {
          const project = response[0].data;  
          const matchedProject = project.find((property: any) =>         
            property.MASTER_MKEY === this.taskData.PROPERTY_MKEY
          );
          
          const matchedSubProject = this.sub_proj.find((building: any) => 
            building.MASTER_MKEY === Number(this.taskData.BUILDING_MKEY)
          );
  
          if (matchedProject) {
            this.taskData.PROPERTY_NAME = matchedProject.TYPE_DESC;

          } else {
            console.log('No matching project found for MASTER_MKEY:', this.taskData.PROPERTY_MKEY);
          }
  
          if (matchedSubProject) {
            this.taskData.BUILDING_NAME = matchedSubProject.TYPE_DESC;
          } else {
            console.log('No matching sub-project found for MASTER_MKEY:', this.taskData.BUILDING_NAME);
          }
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error occurred while fetching projects');
        }
      );
    }
  }


  onSubmit() {
    if (!this.taskData || !this.taskData.MKEY) {
      const requiredControls: string[] = [];
      const valid = this.complianceForm.valid;
  
      console.log('this.taskData.STATUS:', this.taskData?.STATUS);
  
      const addControlError = (message: string) => requiredControls.push(message);
  
      // Helper function to convert camelCase to Title Case
      const convertToTitleCase = (input: string): string => {
        return input
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim() + ' is required';
      };
  
      Object.keys(this.complianceForm.controls).forEach(controlName => {
        const control = this.complianceForm.get(controlName);
        if (control?.errors?.required) {
          const formattedControlName = convertToTitleCase(controlName);
          console.log('Missing required field:', formattedControlName);
          addControlError(formattedControlName);
        }
      });
  
      if (requiredControls.length > 0) {
        const errorMessage = requiredControls.join(', ');
        this.tostar.error(errorMessage);
        return;
      }
    }
  
    this.onAddAndUpdateCompliance();
    return true;
  }
  

  createData(){
    this.onAddAndUpdateCompliance();
    // const values = this.complianceForm.value
    // console.log('Values', values)
  }

  ngOnDestroy(): void {
    console.log('Component is being destroyed');

    sessionStorage.removeItem('task');
    sessionStorage.removeItem('initiate');

  }



}
