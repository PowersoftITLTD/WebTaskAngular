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


  formVisibleMap: boolean[] = [];

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
  departmentList: any[] = [];
  SanctoningAuthList: any[] = [];
  SanctoningDeptList: any[] = [];


  loginName: string = '';
  loginPassword: string = '';


  public accordionItems = [
    // { title: 'Checklist', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Sub Task', content: 'Some placeholder content for the second accordion panel.' },
  ];


  // projDefinationTable = [
  //   { TASK_NO: '1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.3', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.1.1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.1.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.1.3', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.2.1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.2.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '1.3.1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '4.1.1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '4.1.1.1', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '4.1.1.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '3.2.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '3.2.23.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },
  //   { TASK_NO: '3.2', Abbrivation: 'Abbrivation 1', Approved_Description: 'Approved_Description 1', Days_Required: '6', Department: 'Department 1', Job_Role: 'Job Role 1', Responsible_Person: 'Responsible_Person 1', Output_Document: 'Output Document 1', Tentative_Start_Date: '24-10-2024', Tentative_End_Date: '24-10-2024', status: 'Status' },

  // ]

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

      // if(RecursiveTaskData){
      //   this._getSelectedTaskDetails();
      // }
      // console.log('Selected data', this.taskData)
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
      property:['',Validators.required],
      building:['', Validators.required],
      projectManager:['', Validators.required],
      abbrivation: ['', Validators.required],
      sanctioningAuth: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescriotion: ['', Validators.required],
      sanctioningDepartment: ['', Validators.required],
      responsiblePerson: ['', Validators.required],
      jobRole: ['', Validators.required],
      daysRequired: ['', Validators.required],
      complitionDate: ['', Validators.required],
      ProjectApprovalSrNo: ['', ],
      editRow: this.formBuilder.array([])
    })
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

    // if (!this.recursiveLogginUser) {
    //   console.error('Recursive login user is not defined');
    //   return;
    // }

    // 1. Building Classification DP
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

      console.log(this.employees)

      console.log('matchedEmployee', matchedEmployee)
      console.log('this.taskData.RESPOSIBLE_EMP_MKEY', this.taskData.RESPOSIBLE_EMP_MKEY)
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
    this.formVisibleMap[index] = !this.formVisibleMap[index];
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
    return true;
  }

}
