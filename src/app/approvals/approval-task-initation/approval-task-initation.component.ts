import { Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
import { CITIES, ICity } from './../add-approval-tempelate/cities';
import { ApiService } from 'src/app/services/api/api.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-approval-task-initation',
  templateUrl: './approval-task-initation.component.html',
  styleUrls: ['./approval-task-initation.component.css']
})
export class ApprovalTaskInitationComponent implements OnInit, OnDestroy {

  @Input() recursiveLogginUser: any = {};

  receivedUser: string | any;

  taskData: any;

  allTags: any[] = [];
  selectedTags: string[] = []; 


  taskDetails: any;
  loading: boolean = false;

  employees: any[] = [];
  appeInitForm: FormGroup | any;
  subTaskForm: FormGroup | any;

  createdOrUpdatedUserName: any
  isFieldDisabled = true; 

  updatedDetails: boolean = false;

  currentDate: string = new Date().toISOString().split('T')[0];
  formVisibleMap: { [key: number]: boolean } = {};
  @Input() loggedInUser: any;


  project: any = [];
  sub_proj: any = [];

  selectedAssignTo: string = ''; 

  public activeIndices: number[] = []; // Change here
  subTasks: any[] = [];
  noSubParentTasks: any[] = [];
  filteredEmployees: any[] = [];
  filteredInitiator: any[] = [];
  subListFilteredEmp: any[] = [];
  inputHasValue: boolean = false;


  buildingList: any[] = [];
  standardList: any[] = [];
  statutoryAuthList: any[] = [];
  jobRoleList: any[] = [];
  docTypeList: any[] = [];
  selectedSeqArr: any[] = [];
  departmentList: any[] = [];
  SanctoningAuthList: any[] = [];
  SanctoningDeptList: any[] = [];

  abbreviation: string = '';
  startDate: string = '';
  shortDescription: string = '';
  endDate: string = '';
  longDescription: string = '';
  responsiblePerson: string = '';
  department: string = '';
  jobRole: string = '';
  outputDocument: string = '';
  tags: string[] = [];
  completionDate: string = '';

  loginName: string = '';
  loginPassword: string = '';


  public accordionItems = [
    { title: 'Sub Task', content: 'Some placeholder content for the second accordion panel.' },
  ];



  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    private credentialService: CredentialService,
    private router: Router,
    private tostar: ToastrService
  ) {


    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';

    if (navigation?.extras.state) {
      const RecursiveTaskData: any = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;
      console.log('RecursiveTaskData', RecursiveTaskData)

      if (RecursiveTaskData.mkey) {
        this.updatedDetails = !isNewTemp; // Don't update if adding a new task
      } else {
        this.updatedDetails = false;
      }

      sessionStorage.setItem('task', JSON.stringify(RecursiveTaskData));
      sessionStorage.removeItem('add_new_task'); // Clear the marker after using it
    } else {
      const RecursiveTaskData = sessionStorage.getItem('task');
      if (RecursiveTaskData) {
        try {
          this.taskData = JSON.parse(RecursiveTaskData);
          console.log('Check task data', this.taskData)
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
    this.onLogin();
    this.fetchEmployeeName();
    this.activeIndices = this.accordionItems.map((_, index) => index); // Set all indices to open
    this.initilizeApprInitiationForm();
    this.subListForm();
    this.fetchProjectData();
  }


  onSubmitSubListchek() {
    const formData = {
      abbreviation: this.abbreviation,
      startDate: this.startDate,
      shortDescription: this.shortDescription,
      endDate: this.endDate,
      longDescription: this.longDescription,
      responsiblePerson: this.responsiblePerson,
      department: this.department,
      jobRole: this.jobRole,
      outputDocument: this.outputDocument,
      tags: this.tags,
      completionDate: this.completionDate
    };

    console.log('formData', formData)

  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index);
    } else {
      this.activeIndices.splice(idx, 1);
    }
  }


  initilizeApprInitiationForm() {
    this.appeInitForm = this.formBuilder.group({
      property: [''],
      building: [''],
      initiator: ['', Validators.required],
      abbrivation: ['', ],
      // sanctioningAuth: [this.taskData.SANCTION_AUTHORITY_NAME ],
      // sanctioningDepartment: ['', ],
      shortDescription: ['', Validators.required],
      longDescriotion: ['', Validators.required],
      responsiblePerson: ['', Validators.required],
      jobRole: ['', ],
      daysRequired: [''],
      tags:[''],
      startDate:['', Validators.required],
      endDate: ['', Validators.required],
      complitionDate:['',Validators.required],
      ProjectApprovalSrNo: [''],
      editRow: this.formBuilder.array([]),
      rows_new: this.formBuilder.array([])
    })
  }


  subListForm(){
    this.subTaskForm = this.formBuilder.group({ 
      SubListAbbrivation: [''],
      SubListShortDescription: [''],
      SubListlongDescriotion: [''],
      SubListDepartment: [''],
      SubListresponsiblePerson: [''],
      SubListJobRole: [''],
      SubListTags:[''],
      SubListStartDate:[''],
      SubListEndDate: [''],
      SubListComplitionDatee:[''],
      subListDoc: [''],   
    })
  }



  addApprovalInitiation() {

    // console.log(this.project)
    // console.log(this.sub_proj)

    this.recursiveLogginUser = this.apiService.getRecursiveUser();


    const PROJECT = this.appeInitForm.get('property')?.value || (this.appeInitForm.get('property')?.value === '' ? this.taskData?.PROPERTY : this.appeInitForm.get('property')?.value);
    const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);

    const SUB_PROJ = this.appeInitForm.get('building')?.value || (this.appeInitForm.get('building')?.value === '' ? this.taskData?.BUILDING_MKEY : this.appeInitForm.get('building')?.value);
    const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJ);

    // console.log('property', PROJECT);
    // console.log('building', SUB_PROJ);

    const assignedToValue = this.appeInitForm.get('responsiblePerson')?.value.trim();
    const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);

    const assignedToValueIni = this.appeInitForm.get('initiator')?.value.trim();
    const assignedInitiator = this.employees.find(employee => employee.Assign_to === assignedToValueIni);

    const USER_CRED = this.credentialService.getUser();

    const property = this.appeInitForm.get('property')?.value;
    const building = this.appeInitForm.get('building')?.value;


    // console.log('this.taskData?.PROPERTY', this.taskData?.PROPERTY);
    // console.log('this.taskData?.BUILDING_MKEY', this.taskData?.BUILDING_MKEY);

    let PROPERTY, BUILDING;

    if (this.taskData?.PROPERTY === property?.MASTER_MKEY || this.taskData?.BUILDING_MKEY === building?.MASTER_MKEY) {

      PROPERTY = { MASTER_MKEY: this.taskData.PROPERTY };
      BUILDING = { MASTER_MKEY: this.taskData.BUILDING_MKEY };
    } else {

      PROPERTY = (property?.MASTER_MKEY === null || property?.MASTER_MKEY === undefined) ? this.taskData?.PROPERTY : property?.MASTER_MKEY;
      BUILDING = (building?.MASTER_MKEY === null || building?.MASTER_MKEY === undefined) ? this.taskData?.BUILDING_MKEY : building?.MASTER_MKEY;
    }


    // console.log('PROPERTY', PROPERTY);
    // console.log('BUILDING', BUILDING);

    const tagsValue = this.appeInitForm.get('tags')?.value;

    let tagsString = '';

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

    console.log('tagsString', tagsString)

    const addApprovalInitiation:any = {

      MKEY:this.taskData.MKEY,
      HEADER_MKEY:this.taskData.HEADER_MKEY,
      CAREGORY: 64,
      TAGS: tagsString,
      INITIATOR: assignedInitiator?.MKEY,
      TASK_NO:this.taskData.TASK_NO,
      MAIN_ABBR: `${this.appeInitForm.get('abbrivation')?.value} / ${this.taskData.TASK_NO}`,
      SHORT_DESCRIPTION: this.appeInitForm.get('shortDescription')?.value,
      LONG_DESCRIPTION: this.appeInitForm.get('longDescriotion')?.value,
      AUTHORITY_DEPARTMENT: this.taskData.AUTHORITY_DEPARTMENT,
      RESPOSIBLE_EMP_MKEY: assignedEmployee?.MKEY,
      JOB_ROLE: this.taskData.JOB_ROLE,
      SANCTION_AUTHORITY: this.taskData.SANCTION_AUTHORITY,
      SANCTION_DEPARTMENT: this.taskData.SANCTION_DEPARTMENT,
      TENTATIVE_START_DATE: this.appeInitForm.get('startDate')?.value,
      TENTATIVE_END_DATE: this.appeInitForm.get('endDate')?.value,
      COMPLITION_DATE: this.appeInitForm.get('complitionDate')?.value,
      PROPERTY: PROJECT,
      BUILDING_MKEY: SUB_PROJ,
      CREATED_BY: USER_CRED[0].MKEY,
      STATUS: 'Ready to Initiated',
      SUBTASK_LIST: this.breakToLinear(this.subTasks)    
    };

    console.log('addApprovalInitiation: ', addApprovalInitiation);
    // console.log('recursiveLogginUser', this.recursiveLogginUser)

    this.apiService.postApprovalInitiation(addApprovalInitiation, this.recursiveLogginUser ).subscribe({
      next:(response)=>{
        console.log(response.message)
        // if(response.status === 'Error'){
        //   this.tostar.error(response.message)
        //   return
        // }

        this.tostar.success('Success', 'Template added successfuly');

        console.log('Project task initiation',response)
      },error:(error)=>{
        console.error('Login failed:', error);
      }
    })
  }


  getTags() {
    this.loggedInUser = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    console.log('getTagDetailss1', token);

    this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => { 
        this.allTags = response[0].data.map((item: { name: string }) => item.name);
    
    });
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
  }

  private fetchData(): void {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();


    this.apiService.getBuildingClassificationDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.buildingList = list;
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
        // console.log('Standard List:', this.standardList);      
      },
      error: (error: any) => {
        console.error('Unable to fetch Standard List', error);
      }
    });

    // 3. Statutory Authority DP
    this.apiService.getStatutoryAuthorityDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.statutoryAuthList = list;
        // console.log('Statutory Authority List:', this.statutoryAuthList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Statutory Authority List', error);
      }
    });

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

    // 5. Document Type DP
    this.apiService.getDocTypeDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.docTypeList = list
        // console.log('Document Type List:', this.docTypeList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });


    this.apiService.getDepartmentDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.departmentList = list
        this.setDepartmentName();

      }, error: (error: ErrorHandler) => {

      }
    })


    this.apiService.getSanctoningAuthDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.SanctoningAuthList = list
        this.setSenctoningAuthorityName();

         console.log('Document Type List SanctoningAuthList:', this.SanctoningAuthList);
      }, error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);

      }
    })


    if (this.taskData.MKEY && this.buildingList && this.standardList) {
      this.getSubProj();
      // this.checkValueForNewRow_1();
    }

    this.getTree();


  }


  onProjectSelect(selectElement: HTMLSelectElement) {

    const selectedIndex = selectElement.selectedIndex - 1;

    console.log('selectElement', selectElement.selectedIndex)
    const selectedOption: any = this.project[selectedIndex] || 0;
    console.log('selectedOption', selectedOption)
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : 0;
    const token = this.apiService.getRecursiveUser();


    console.log('selectedProjectMkey', selectedProjectMkey)

    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
        (response: any) => {

          this.sub_proj = response[0]?.data;

          // console.log("Sub-Project", this.sub_proj);

        },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching sub-projects');
        }
      );
    }
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


  getSubProj() {

    const token = this.apiService.getRecursiveUser();

    this.apiService.getSubProjectDetailsNew(this.taskData.PROPERTY.toString(), token).subscribe(
      (response: any) => {
        this.sub_proj = response[0].data;
        this.setProjectNameToTaskData();

      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching sub-projects');
      }
    );
  }


  setProjectNameToTaskData(): void {

    if (this.taskData && this.taskData.MKEY) {

      const matchedProject = this.project.find((property: any) => property.MASTER_MKEY === Number(this.taskData.PROPERTY));

      const matchedSubProject = this.sub_proj.find((building: any) => building.MASTER_MKEY === Number(this.taskData.BUILDING_MKEY));

      const matchedEmployee = this.employees.find((emp: any) => emp.MKEY === Number(this.taskData.RESPOSIBLE_EMP_MKEY))

      // console.log(this.employees)

      // console.log('matchedEmployee', matchedEmployee)
      // console.log('this.taskData.RESPOSIBLE_EMP_MKEY', this.taskData.RESPOSIBLE_EMP_MKEY)
      if (matchedProject) {
        this.taskData.project_Name = matchedProject.TYPE_DESC;
      }

      if (matchedSubProject) {
        this.taskData.sub_proj_name = matchedSubProject.TYPE_DESC;
      }


      if (matchedEmployee) {
        this.taskData.employee_name = matchedEmployee.Assign_to
      }
    }
  }



  setSenctoningAuthorityName(): void {
    if (this.taskData && this.taskData.MKEY) {
      // console.log('SANCTION_AUTHORITY', this.taskData.SANCTION_AUTHORITY);

      // console.log('this.SanctoningAuthList', this.SanctoningAuthList)

      // Find the matching subproject
      const matchedAuth = this.SanctoningAuthList.find((auth: any) =>
        auth.mkey === Number(this.taskData.SANCTION_AUTHORITY)
      );

      if (matchedAuth) {
        this.taskData.SANCTION_AUTHORITY_NAME = matchedAuth.typE_DESC;
      }
    }
  }



    setDepartmentName(): void {
    if (this.taskData && this.taskData.MKEY) {

      // console.log('this.departmentList', this.departmentList)
      const matchedDept = this.departmentList.find((department: any) =>
        department.mkey === Number(this.taskData.AUTHORITY_DEPARTMENT)
      );

      if (matchedDept) {
        this.taskData.AUTHORITY_DEPARTMENT_NAME = matchedDept.typE_DESC;
      }
    }
  }


  setJobName(): void {
    if (this.taskData && this.taskData.MKEY) {

      // console.log('this.departmentList', this.jobRoleList)
      const matchedJobRole = this.jobRoleList.find((role: any) =>
        role.mkey === Number(this.taskData.JOB_ROLE)
      );

      if (matchedJobRole) {
        this.taskData.JOB_ROLE_NAME = matchedJobRole.typE_DESC;
      }
    }
  }


  fetchEmployeeName(): void {
    const token = this.apiService.getRecursiveUser();;

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
        });
        // console.log('this.employees', this.employees);    
      },
      (error: ErrorHandler) => {
        console.error('Error fetching employee details:', error);
      }
    );
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

  }


  filterEmployeesInitiator(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    if (!value) {
      this.filteredInitiator = [];
      return;
    }

    const filterValue = value.toLowerCase();

    this.filteredInitiator = this.employees.filter(emp => {
      const fullName = emp.Assign_to.toLowerCase();
      return fullName.includes(filterValue);
    });

    this.inputHasValue = value.trim().length > 0;

  }

  SubfilterEmployeesInitiator(event: Event, task_no:any): void {
    console.log('task_no', task_no)
    console.log('event',event)
    const value = (event.target as HTMLInputElement).value.trim();
    console.log('value', value)

    if (!value) {
      this.subListFilteredEmp = [];
      return;
    }

    const filterValue = value.toLowerCase();

    this.subListFilteredEmp = this.employees.filter(emp => {
      const fullName = emp.Assign_to.toLowerCase();
      return fullName.includes(filterValue);
    });

    this.inputHasValue = value.trim().length > 0;

  }


  selectEmployee(employee: any): void {

    const assignedTo = employee.Assign_to;

    this.appeInitForm.get('responsiblePerson').setValue(assignedTo);

    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
  }

  selectInitiatoe(employee: any): void {

    const assignedTo = employee.Assign_to;

    this.appeInitForm.get('initiator').setValue(assignedTo);

    if (assignedTo) {
      this.filteredInitiator = [];
      return
    }
  }

  selectEmpSubList(employee: any): void {


    const assignedTo = employee.Assign_to;

    this.selectedAssignTo = assignedTo; // This will set the value to the input field

    if (assignedTo) {
      this.subListFilteredEmp = []; // Clear the list (or do any other actions you need)
    }
  }


  selectEmployeeSubList(employee: any): void {

    const assignedTo = employee.Assign_to;

    this.appeInitForm.get('responsiblePerson').setValue(assignedTo);

    if (assignedTo) {
      this.subListFilteredEmp = [];
      return
    }
  }


  toggleFormVisibility(index: number) {
    this.formVisibleMap[index] = !this.formVisibleMap[index];
  }

  toggleFormVisibility_main(index: number, task:any) {
    this.onSubmitSubList(task.TASK_NO)

    console.log('task', task.TASK_NO);
    if (this.formVisibleMap[index]) {
      this.formVisibleMap[index] = false;
    } else {
      for (let key in this.formVisibleMap) {
        this.formVisibleMap[key] = false;
      }

      this.formVisibleMap[index] = true;
    }

  }


  setEmpName(): void {
    if (this.taskData && this.taskData.MKEY) {
  
      // console.log('setEmpName',this.employees)
      // console.log('this.departmentList', this.departmentList)
      const matchedEmp = this.employees.find((employee: any) =>
        employee.MKEY === Number(this.taskData.RESPOSIBLE_EMP_MKEY)
      );
  
      console.log('matchedEmp', matchedEmp)
  
      if (matchedEmp) {
        this.taskData.emp_name = matchedEmp.Assign_to;
      }
    }
  }


  updatedTaskCheck(task: any, assignTo: any) {
    console.log('assignTo', assignTo);
  
    const matchedEmp = this.employees.find((employee: any) =>
      employee.Assign_to === assignTo
    );
  
    console.log('matchedEmp from update subtask', matchedEmp?.MKEY);
  
    const data = this.credentialService.getUser();
    const headerMkey = this.taskData.HEADER_MKEY;
    const token = this.apiService.getRecursiveUser();
  
    const tagsValue:any = this.selectedTags;
    console.log('tagsValue',tagsValue)
    let tagsString = '';
  
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
  
    const responsibleEmpMKey = (assignTo === null || assignTo === undefined || assignTo === '' || !matchedEmp) 
      ? task.resposiblE_EMP_MKEY
      : matchedEmp.MKEY;
  
    const updateInitiationSubTask = {
      MKEY: this.taskData.HEADER_MKEY,
      approvaL_MKEY: task.approvaL_MKEY,
      maiN_ABB: task.maiN_ABBR,
      SHORT_DESCRIPTION: task.abbr_short_DESC,
      LONG_DESCRIPTION: task.abbR_SHORT_DESC,
      TAGS: tagsString,
      resposiblE_EMP_MKEY: responsibleEmpMKey,
      createD_BY: data[0].MKEY,
      lasT_UPDATED_BY: data[0].MKEY,
      TENTATIVE_START_DATE: task.start_date,
      TENTATIVE_END_DATE: task.end_date,
      DELETE_FLAG: 'N'
    };

    
  
    console.log('updateInitiationSubTask', updateInitiationSubTask);
  
    this.apiService.subTaskPutApprovalInitiation(headerMkey, updateInitiationSubTask, token).subscribe({
      next: (responseData) => {
        console.log('API Response:', responseData);
  
        // Update the local subtask list
        const subTaskIndex = this.taskData.SUBTASK_LIST.findIndex(
          (subtask: any) => subtask.approvaL_MKEY === task.approvaL_MKEY
        );
  
        if (subTaskIndex > -1) {
          // Merge updated data into the local subtask
          this.taskData.SUBTASK_LIST[subTaskIndex] = {
            ...this.taskData.SUBTASK_LIST[subTaskIndex],
            ...updateInitiationSubTask
          };
  
          console.log('Updated subtask list:', this.taskData.SUBTASK_LIST);
  
          // Update session storage
          sessionStorage.setItem('task', JSON.stringify(this.taskData));
          console.log('Session storage updated');

          console.log(responseData)
          // window.location.reload();
        } else {
          console.warn('Subtask not found for update!');
        }
      },
      error: (error) => {
        console.error('Error updating subtask:', error);
      }
    });
  }
  




  breakToLinear(selectedSeq: any) {


    console.log('breakToLinear selectedSeq',selectedSeq)

    const result: any[] = [];
    const USER_CRED = this.credentialService.getUser();


    const flatten = (task: any) => {

      // console.log('task from breakToLinear',task)

      result.push({
        TASK_NO: task.TASK_NO.TASK_NO.trim(),
        MKEY:this.taskData.HEADER_MKEY,
        DAYS_REQUIRED: Number(task.TASK_NO.dayS_REQUIERD),
        APPROVAL_ABBRIVATION: task.TASK_NO.maiN_ABBR,
        LONG_DESCRIPTION: task.TASK_NO.abbR_SHORT_DESC,
        SHORT_DESCRIPTION:task.TASK_NO.abbr_short_DESC, 
        RESPOSIBLE_EMP_MKEY: Number(task.TASK_NO.resposiblE_EMP_MKEY),
        TENTATIVE_START_DATE: task.TASK_NO.start_date,
        TENTATIVE_END_DATE: task.TASK_NO.end_date,
        DEPARTMENT: task.TASK_NO.department_mkey,
        JOB_ROLE: task.TASK_NO.joB_ROLE_mkey,
        COMPLITION_DATE:this.taskData.COMPLITION_DATE,
        approvaL_MKEY:task.TASK_NO.approvaL_MKEY,
        TAGS:'asjas,sakjld',
        // approvaL_MKEY: task.TASK_NO.approvaL_MKEY,
        OUTPUT_DOCUMENT: task.TASK_NO.enD_RESULT_DOC,
        STATUS: 'Created',
      });

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach(flatten);
      }
    };

    selectedSeq.forEach(flatten);



    return result;
  }

 get rows_new() {
    return (this.appeInitForm.get('rows_new') as FormArray);
  }

   addRowNew() {
      const rows = this.rows_new.controls;
  
  
      if (rows.length === 0) {
  
        this.rows_new.push(
          this.formBuilder.group({
            level: [1, [Validators.required, Validators.min(1)]],
            sanctioningDept: ['', Validators.required],
            sanctioningAuth: ['', Validators.required],
            startDate_newRow: ['', Validators.required],
            endDate_newRow: ['']
          })
        );
        return;
      }
  
      console.log('check group', this.appeInitForm.get('rows_new').controls)
  
      const lastRow = rows[rows.length - 1];
      const prevRow = rows[rows.length - 2];
  
      const lastLevel = lastRow.value?.level;
      const previousLevel = prevRow ? prevRow.value?.level : null;
  
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
  
        if (rows[0].value.level !== 1 && !this.taskData && !this.taskData?.mkey) {
          this.tostar.error('Level should start from 1')
          return
        }
  
        const requiredFields = ['level', 'sanctioningDept', 'sanctioningAuth', 'startDate_newRow'];
        const rowEmpty = requiredFields.some(field => !row.value[field]);
        if (rowEmpty) {
          this.tostar.error('Please fill in all fields in all rows before adding a new row');
          return;
        }
  
      }
  
      if (lastLevel === previousLevel) {
        const startDate = new Date(lastRow.value?.startDate_newRow);
        const endDate = new Date(prevRow.value?.endDate_newRow);
  
        console.log('endDate', endDate)
  
        if (!isNaN(endDate.getTime())) {
          if (startDate > endDate) {
            console.log('Start date is greater than end date');
          } else {
            console.log('Start date is NOT greater than end date');
            this.tostar.error('Start date of same level should greater then end date of same level');
            return;
          }
        }
      }
  
      const start_date_new = new Date(lastRow.value?.startDate_newRow)
      const end_date_new = new Date(lastRow.value?.endDate_newRow)
  
  
      if (start_date_new > end_date_new) {
        this.tostar.error('End date should be greater then start date');
        return
      }
  
  
      const valuesArray = rows.map(row => row.value);
  
      // console.log('valuesArray',valuesArray)
  
      if (lastLevel !== null && (previousLevel === null || lastLevel == previousLevel + 1 || lastLevel == previousLevel)) {
  
        const rowGroup = this.formBuilder.group({
          level: ['', Validators.required],
          sanctioningAuth: ['', Validators.required],
          sanctioningDept: ['', Validators.required],
          startDate_newRow: ['', Validators.required],
          endDate_newRow: ['']
        });
  
        (this.appeInitForm.get('rows_new') as FormArray).push(rowGroup);
        // this.checkValueForNewRow_1(rowGroup)
  
      } else {
        this.tostar.error(`Last row level should be ${previousLevel} or ${previousLevel + 1} from its previous row`);
      }
    }


    checkValueForNewRow_1() {
      const formArray_new_1 = this.appeInitForm.get('rows_new') as FormArray;
      console.log('formArray_new_1', formArray_new_1);
      console.log('this.taskData.sanctioninG_DEPARTMENT_LIST', this.taskData.sanctioninG_DEPARTMENT_LIST);
  
      formArray_new_1.clear();
  
      this.taskData.sanctioninG_DEPARTMENT_LIST.forEach((department: any) => {
        const rowGroup = this.formBuilder.group({
          level: [Number(department.LEVEL), [Validators.required, Validators.min(1)]],
          sanctioningDept: [department.SANCTIONING_DEPARTMENT, Validators.required],
          sanctioningAuth: [department.SANCTIONING_AUTHORITY, Validators.required],
          startDate_newRow: [this.formatDate(department.START_DATE), Validators.required],
          endDate_newRow: [department.END_DATE ? this.formatDate(department.END_DATE) : '', '']
        });
        formArray_new_1.push(rowGroup);
      });
    }

  async getTree() {

    let department_new: any;
    let jobRole_new: any;

    try {
      department_new = await this.apiService.getDepartmentDP(this.recursiveLogginUser).toPromise();
      jobRole_new = await this.apiService.getJobRoleDP(this.recursiveLogginUser).toPromise();

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    const jobRoleList = this.jobRoleList;
    const departmentList = this.departmentList;
    console.log('this.taskData.SUBTASK_LIST', this.taskData.SUBTASK_LIST)


    const optionListArr = this.taskData.SUBTASK_LIST
      .filter((item: any) => item.TASK_NO !== null)
      .map((item: any) => {


        const jobRole = jobRoleList.find((role: any) => role.mkey === item.JOB_ROLE);
        const departmentRole = departmentList.find((department: any) => department.mkey === item.DEPARTMENT);

        return {
          TASK_NO: item.TASK_NO,
          maiN_ABBR: item.APPROVAL_ABBRIVATION,
          abbR_SHORT_DESC: item.LONG_DESCRIPTION,
          abbr_short_DESC: item.SHORT_DESCRIPTION,
          dayS_REQUIERD: item.DAYS_REQUIRED,
          enD_RESULT_DOC: item.OUTPUT_DOCUMENT,
          approvaL_MKEY: item.approvaL_MKEY,
          joB_ROLE: jobRole ? jobRole.typE_DESC : "Not found",
          joB_ROLE_mkey: jobRole ? jobRole.mkey : 0,
          department: departmentRole ? departmentRole.typE_DESC : "Not found",
          department_mkey: departmentRole ? departmentRole.mkey : 0,
          start_date: item.TENTATIVE_START_DATE,
          end_date: item.TENTATIVE_END_DATE,
          resposiblE_EMP_MKEY: item.RESPOSIBLE_EMP_MKEY,
          status: item.STATUS
        };

      });

    this.loading = true;


    console.log('optionListArr', optionListArr)


    const same_data = optionListArr;

    const buildHierarchy = (tasks: any, rootTaskNo: any) => {
      const rootTask = tasks.find((task: any) => task.TASK_NO === rootTaskNo);
      if (!rootTask) return null;

      const buildSubtasks = (taskNo: any, depth: any) => {
        const subtasks = tasks.filter((task: any) => {
          const taskDepth = task.TASK_NO.split('.').length - 1;
          return task.TASK_NO.startsWith(taskNo + '.') && taskDepth === depth + 1;
        });
        if (subtasks.length === 0) return [];

        return subtasks.map((subtask: any) => {
          const subtaskWithNestedTaskNo: any = {
            TASK_NO: subtask,
            visible: true,
            subtask: buildSubtasks(subtask.TASK_NO, depth + 1)
          };

          const spaces = '  '.repeat(depth + 1);

          const indentedSubtask = Object.keys(subtaskWithNestedTaskNo).reduce((acc: any, key) => {
            if (key === 'TASK_NO') {
              acc[key] = {
                ...subtaskWithNestedTaskNo[key],
                TASK_NO: spaces + subtaskWithNestedTaskNo[key].TASK_NO
              };
            } else {
              acc[key] = subtaskWithNestedTaskNo[key];
            }
            return acc;
          }, {});

          return indentedSubtask;
        });
      };

      const rootDepth = rootTask.TASK_NO.split('.').length - 1;
      const rootHierarchy = {
        TASK_NO: {
          ...rootTask,
          TASK_NO: rootTask.TASK_NO,
        },
        visible: true,
        subtask: buildSubtasks(rootTask.TASK_NO, rootDepth)
      };

      return rootHierarchy;
    };

    const taskNumbers = [...new Set(same_data.map((task: any) => task.TASK_NO.split('.')[0]))]; // Get unique root TASK_NO
    taskNumbers.forEach(taskNo => {
      const hierarchy = buildHierarchy(same_data, taskNo);
      if (hierarchy) {
        this.subTasks.push(hierarchy);
      }
    });

    const noSubParentTasks: any = []

    const allRootTaskNumbersInHierarchy = this.subTasks.map((subtask: any) => subtask.TASK_NO.TASK_NO.split('.')[0]);


    same_data.forEach((task: any) => {

      const taskRootNo = task.TASK_NO.split('.')[0];
      if (!allRootTaskNumbersInHierarchy.includes(taskRootNo)) {
        noSubParentTasks.push(task);
      }
    });

    // console.log('subtask from parent', this.subTasks)
    this.loading = false;
    this.noParentTree(noSubParentTasks)
  }


  noParentTree(noParentTree: any = []) {

    const no_parent_arr = noParentTree.map((item: any) => ({
      TASK_NO: item,
      subtask: [],
      visible: true
    }));


    no_parent_arr.forEach((task: any) => {

      const taskNoParts = task.TASK_NO.TASK_NO.split('.');
      const parentTaskNo = taskNoParts.slice(0, taskNoParts.length - 1).join('.');
      const parentTaskPrefix = parentTaskNo ? parentTaskNo : taskNoParts[0];

      if (parentTaskPrefix !== task.TASK_NO.TASK_NO) {
        let parentTask = no_parent_arr.find((t: any) => t.TASK_NO.TASK_NO === parentTaskPrefix);

        if (!parentTask) {

          parentTask = {
            TASK_NO: { TASK_NO: parentTaskPrefix },
            subtask: [task],
            visible: true
          };
          no_parent_arr.push(parentTask);
        } else {
          parentTask.subtask.push(task);
        }
      }
    });

    const tasks = no_parent_arr.filter((task: any) => {
      return task.TASK_NO.maiN_ABBR !== undefined;
    });

    const subtasks = tasks.flatMap((task: any) => task.subtask.map((sub: any) => sub.TASK_NO.TASK_NO));
    const filteredTasks = tasks.filter((task: any) => !subtasks.includes(task.TASK_NO.TASK_NO));
    this.subTasks = [...this.subTasks, ...filteredTasks];

    this.selectedSeqArr = [...filteredTasks, ...this.subTasks];
  }


  calculateIndentation(taskNo: string, baseIndent: number): number {
    return (taskNo.split('.').length - 1) * baseIndent;
  }

  toggleVisibility(task: any) {
    task.visible = !task.visible;
  }


  onSubmit() {
    const requiredControls: string[] = [];
    const requiredFields: string[] = [];
    const valid = this.appeInitForm.valid;
  
    const addControlError = (message: string) => requiredControls.push(message);
  
    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };
  
    Object.keys(this.appeInitForm.controls).forEach(controlName => {
      const control = this.appeInitForm.get(controlName);
  
      if (control?.errors?.required) {
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });
  
    if (requiredControls.length > 0) {
      const errorMessage = `${requiredControls.join(' , ')}`;
      this.tostar.error(errorMessage);
      return false; // Return false when there are validation errors
    }
  
    return valid; // Return the actual validity of the form
  }
  

  onAddInitiation(){
    const isValid =  this.onSubmit();

    if(isValid){
      this.addApprovalInitiation();
    }else {
      console.log('Form is invalid, cannot add template');
    }
  }



  onSubmitSubList(form:any, task:any = []){
    console.log('Coming to sublist submit form',form.value)
    console.log('Coming to form', task)


  }

  formatDate(date: Date): string {
    console.log('date', date);
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');  // Ensure the day is two digits
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Ensure the month is two digits
    const year = dateObj.getFullYear();  // Get the full year
    return `${year}-${month}-${day}`;  // Return in YYYY-MM-DD format
  }

  ngOnDestroy(): void {
    console.log('Component is being destroyed');

    sessionStorage.removeItem('task');
  }

}
