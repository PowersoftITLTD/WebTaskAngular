import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { CITIES, ICity } from './../add-approval-tempelate/cities';
import { ApiService } from 'src/app/services/api/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-approval-task-initation',
  templateUrl: './approval-task-initation.component.html',
  styleUrls: ['./approval-task-initation.component.css']
})
export class ApprovalTaskInitationComponent implements OnInit {

  @Input() recursiveLogginUser: any = {};

  receivedUser: string | any;

  taskData: any;

  taskDetails: any;
  loading: boolean = false;

  employees: any[] = [];
  appeInitForm: FormGroup | any;

  createdOrUpdatedUserName: any

  updatedDetails: boolean = false;


  formVisibleMap: { [key: number]: boolean } = {};

  project: any = [];
  sub_proj: any = [];

  public activeIndices: number[] = []; // Change here
  subTasks: any[] = [];
  noSubParentTasks: any[] = [];
  filteredEmployees: any[] = [];
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


  loginName: string = '';
  loginPassword: string = '';


  public accordionItems = [
    { title: 'Sub Task', content: 'Some placeholder content for the second accordion panel.' },
  ];



  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    private credentialService: CredentialService,
    private router: Router,
    private tostar:ToastrService
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

   

    this.fetchProjectData();


    
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
      // property: ['', Validators.required],
      // buiildingClass:['', Validators.required],
      // buildingStandard:['', Validators.required],
      property:[''],
      building:[''],
      projectManager:['', Validators.required],
      abbrivation: ['', Validators.required],
      sanctioningAuth: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescriotion: ['', Validators.required],
      sanctioningDepartment: ['', Validators.required],
      responsiblePerson: ['', Validators.required],
      jobRole: ['', Validators.required],
      daysRequired: [''],
      complitionDate: ['', Validators.required],
      ProjectApprovalSrNo: ['', ],
      editRow: this.formBuilder.array([])
    })
  }



 addApprovalInitiation() {

  console.log(this.project)
  console.log(this.sub_proj)

  const PROJECT = this.appeInitForm.get('property')?.value || (this.appeInitForm.get('property')?.value === '' ? this.taskData?.PROPERTY : this.appeInitForm.get('property')?.value);
  const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);

  const SUB_PROJ = this.appeInitForm.get('building')?.value || (this.appeInitForm.get('building')?.value === '' ? this.taskData?.BUILDING_MKEY : this.appeInitForm.get('building')?.value);
  const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJ);

  console.log('property', PROJECT);
  console.log('building', SUB_PROJ);

  const assignedToValue = this.appeInitForm.get('responsiblePerson')?.value.trim();
  const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);

  const USER_CRED = this.credentialService.getUser();

  // Checking the taskData for PROPERTY and BUILDING_MKEY, if not available fallback to form values
  const property = this.appeInitForm.get('property')?.value;
  const building = this.appeInitForm.get('building')?.value;




  
  console.log('this.taskData?.PROPERTY', this.taskData?.PROPERTY);
  console.log('this.taskData?.BUILDING_MKEY', this.taskData?.BUILDING_MKEY);
  
  let PROPERTY, BUILDING;
  
  if (this.taskData?.PROPERTY === property?.MASTER_MKEY || this.taskData?.BUILDING_MKEY === building?.MASTER_MKEY) {
    
    // Use task data if available
    PROPERTY = { MASTER_MKEY: this.taskData.PROPERTY };
    BUILDING = { MASTER_MKEY: this.taskData.BUILDING_MKEY };
} else {
 
    // Otherwise, use the form values, falling back to task data if the value is null or undefined (but not 0)
    PROPERTY = (property?.MASTER_MKEY === null || property?.MASTER_MKEY === undefined) ? this.taskData?.PROPERTY : property?.MASTER_MKEY;
    BUILDING = (building?.MASTER_MKEY === null || building?.MASTER_MKEY === undefined) ? this.taskData?.BUILDING_MKEY : building?.MASTER_MKEY;
}

  
  console.log('PROPERTY',PROPERTY);
  console.log('BUILDING',BUILDING);

  const addApprovalInitiation = {
    CAREGORY: 64,
    TAGS: null,
    MAIN_ABBR: this.appeInitForm.get('abbrivation')?.value,
    SHORT_DESCRIPTION: this.appeInitForm.get('shortDescription')?.value,
    LONG_DESCRIPTION: this.appeInitForm.get('longDescriotion')?.value,
    AUTHORITY_DEPARTMENT: this.appeInitForm.get('sanctioningAuth')?.value,
    RESPOSIBLE_EMP_MKEY: assignedEmployee?.MKEY,
    JOB_ROLE: this.appeInitForm.get('jobRole')?.value,
    SANCTION_AUTHORITY: this.appeInitForm.get('jobRole')?.value,
    SANCTION_DEPARTMENT: this.appeInitForm.get('sanctioningDepartment')?.value,
    COMPLITION_DATE: this.appeInitForm.get('complitionDate')?.value,
    PROPERTY:PROJECT,
    BUILDING_MKEY:SUB_PROJ,
    CREATED_BY: USER_CRED[0].MKEY,
    STATUS: 'Ready to Initiated',
    TENTATIVE_START_DATE: '2024-12-25',
    TENTATIVE_END_DATE: '2024-12-25',
    SUBTASK_LIST: this.breakToLinear(this.subTasks)
  };

  console.log('addApprovalInitiation: ', addApprovalInitiation);

  
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
        // console.log('Building Classification List:', this.buildingList);       
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

        //  console.log('Document Type List SanctoningAuthList:', this.SanctoningAuthList);
      }, error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);

      }
    })


    if (this.taskData.MKEY && this.buildingList && this.standardList) {
      this.getSubProj();
    }

    this.getTree();


  }


  onProjectSelect(selectElement: HTMLSelectElement) {
    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex] || 0;

    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : 0;

    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetails(selectedProjectMkey).subscribe(
        (data: any) => {
          this.sub_proj = data;
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching sub-projects');
        }
      );
    }
  }




  fetchProjectData(): void {
    this.apiService.getProjectDetails().subscribe(
      (data: any) => {
        this.project = data;
        // console.log(this.project)
        this.setProjectNameToTaskData();

      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }


  getSubProj() {
    this.apiService.getSubProjectDetails(this.taskData.PROPERTY).subscribe(
      (data: any) => {
        this.sub_proj = data;
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

      const matchedEmployee = this.employees.find((emp: any)=> emp.MKEY === Number(this.taskData.RESPOSIBLE_EMP_MKEY))

      // console.log(this.employees)

      // console.log('matchedEmployee', matchedEmployee)
      // console.log('this.taskData.RESPOSIBLE_EMP_MKEY', this.taskData.RESPOSIBLE_EMP_MKEY)
      if (matchedProject) {
        this.taskData.project_Name = matchedProject.TYPE_DESC;
      } 

      if (matchedSubProject) {
        this.taskData.sub_proj_name = matchedSubProject.TYPE_DESC;
      }


      if(matchedEmployee){
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

  selectEmployee(employee: any): void {

    const assignedTo = employee.Assign_to;

    this.appeInitForm.get('responsiblePerson').setValue(assignedTo);

    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
  }

  toggleFormVisibility(index: number) {
    this.formVisibleMap[index] = !this.formVisibleMap[index];
  }

  toggleFormVisibility_main(index: number) {
    // Check if the clicked task form is already visible
    if (this.formVisibleMap[index]) {
      // If it is, close it (set to false)
      this.formVisibleMap[index] = false;
    } else {
      // Otherwise, close all forms first
      for (let key in this.formVisibleMap) {
        this.formVisibleMap[key] = false;
      }
  
      // Open the clicked form
      this.formVisibleMap[index] = true;
    }
  }
  
  
  


  breakToLinear(selectedSeq: any) {


    // console.log('breakToLinear selectedSeq',selectedSeq)

    const result: any[] = [];
    const USER_CRED = this.credentialService.getUser();


    const flatten = (task: any) => {

      // console.log('task from breakToLinear',task)

      result.push({
        tasK_NO: task.TASK_NO.TASK_NO.trim(),        
        dayS_REQUIRED: Number(task.TASK_NO.dayS_REQUIERD),
        approvaL_ABBRIVATION: task.TASK_NO.maiN_ABBR,
        approvaL_DESCRIPTION: task.TASK_NO.abbR_SHORT_DESC,
        resposiblE_EMP_MKEY: Number(task.TASK_NO.resposiblE_EMP_MKEY),
        tentativE_START_DATE: task.TASK_NO.start_date,
        tentativE_END_DATE: task.TASK_NO.end_date,
        department: task.TASK_NO.department_mkey,
        joB_ROLE: task.TASK_NO.joB_ROLE_mkey,
        approvaL_MKEY:task.TASK_NO.approvaL_MKEY,
        outpuT_DOCUMENT: task.TASK_NO.enD_RESULT_DOC,
        status: 'Created',
      });

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach(flatten);
      }
    };

    selectedSeq.forEach(flatten);



    return result;
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


        const jobRole = jobRoleList.find((role:any) => role.mkey === item.JOB_ROLE);
        const departmentRole = departmentList.find((department:any) => department.mkey === item.DEPARTMENT);

        return {
          TASK_NO: item.TASK_NO,
          maiN_ABBR: item.APPROVAL_ABBRIVATION,
          abbR_SHORT_DESC: item.LONG_DESCRIPTION,
          dayS_REQUIERD: item.DAYS_REQUIRED,
          enD_RESULT_DOC: item.OUTPUT_DOCUMENT,
          approvaL_MKEY:item.approvaL_MKEY,
          joB_ROLE: jobRole ? jobRole.typE_DESC  : "Not found",
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
      return; 
    } 


    // return true;

    if (this.appeInitForm.valid) {
      console.log('Form is valid. Proceeding to submit.');
      this.addApprovalInitiation();
    } else {
      console.log('Form is invalid. Cannot submit.');
    }


  }

  formatDate(date: Date): string {
    console.log('date', date);
    const dateObj = new Date(date); 
    const day = String(dateObj.getDate()).padStart(2, '0');  // Ensure the day is two digits
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Ensure the month is two digits
    const year = dateObj.getFullYear();  // Get the full year
    return `${year}-${month}-${day}`;  // Return in YYYY-MM-DD format
  }
 

}
