<<<<<<< HEAD
import { AfterViewInit, Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { CITIES, ICity } from '../add-approval-tempelate/cities';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)

@Component({
  selector: 'app-project-defination',
  templateUrl: './project-defination.component.html',
  styleUrls: ['./project-defination.component.css']
})
<<<<<<< HEAD
export class ProjectDefinationComponent implements OnInit, OnDestroy {


  public cities: ICity[] = CITIES;

  receivedUser: string | any;
  taskDetails: any;
  loading: boolean = false;
  public filteredDocs: ICity[] = [];
  public searchTerm: string = '';
  selectedTask: string = '';
  uniqueSubTask: any[] = []
  unFlatternArr: any[] = [];
  existingTaskA: any;

  formVisibleMap: boolean[] = [];

  @Input() recursiveLogginUser: any = {};
  projectDefForm: FormGroup | any;

  selectedDocsMap: { [key: string]: any[] } = { endResult: [], checklist: [] };

  selectedTasksId: Set<any> = new Set();
  selectedTasksId_new: Set<any> = new Set();
  selectedTasks: Set<any> = new Set();
  selectedTaskTable: Set<any> = new Set();
  tableData: Set<any> = new Set();

  buildingList: any[] = [];
  standardList: any[] = [];
  statutoryAuthList: any[] = [];
  jobRoleList: any[] = [];
  departmentList: any[] = [];
  jobRoleList_new: any[] = [];
  departmentList_new: any[] = [];
  docTypeList: any[] = [];
  SanctoningAuthList: any[] = [];
  SanctoningDeptList: any[] = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];
  project: any = [];
  sub_proj: any = [];
  selectedSeqArr: any[] = [];
  new_list_of_selectedSeqArr: any[] = [];
  projDefinationTable: any[] = []
  uniqList: any[] = [];

  end_list: object = {};
  check_list: object = {};

  taskData: any;

  updatedDetails: boolean = false;

  createdOrUpdatedUserName: any
  loginName: string = '';
  loginPassword: string = '';
  ValueList: any[] = [];

  public activeIndices: number[] = []; // Change here
  subTasks: any[] = [];

  public accordionItems = [
    { title: 'Applicable approvals', content: 'Some placeholder content for the first accordion panel.' },

  ];


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tostar: ToastrService,
    private router: Router,
    private credentialService: CredentialService
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
    // this.getSubProj();

    // const same_data_new = this.taskData.approvalS_ABBR_LIST

    // console.log('same_data_new', same_data_new)
    // this.toggleTasksOnInit();
    this.activeIndices = this.accordionItems.map((_, index) => index);
    this.onLogin();
    this.fetchProjectData();
    if (this.taskData && this.taskData.mkey) {
      // this.toggleTasksOnInit()
      // this.toggleSelection(this.taskData.approvalS_ABBR_LIST)
      // this.getTree_new();
      this.getSubProj();      
    }
    this.initilizeProjDefForm();
    this.fetchEmployeeName();
    // this.selectedOptionList();

    // this.isSelected(2);
    

  }


  

  // ngAfterViewInit() {
  //   // Make sure DOM is fully initialized before triggering click if needed
  //   this.checkAndClick();
  // }



  initilizeProjDefForm() {
    this.projectDefForm = this.formBuilder.group({
      projectAbbr: ['', Validators.required],
      property: ['', Validators.required],
      subProject: ['', Validators.required],
      legalEntity: ['', Validators.required],
      projAddress: ['', Validators.required],
      bldCla: ['', Validators.required],
      blsStandard: ['', Validators.required],
      statutoryAuth: ['', Validators.required],
      tasks: this.formBuilder.array([])

    })
  }


  

  
  toggleFormVisibility(index: number) {
    this.formVisibleMap[index] = !this.formVisibleMap[index];
  }

  toggleFormVisibility_main(index: number) {
    this.formVisibleMap[index] = !this.formVisibleMap[index];
  }

  toggleSelection(task: any = []): void {
    console.log('toggleSelection', task)
    const taskId = task.TASK_NO.TASK_NO;
    // const toggle = this.taskData.approvalS_ABBR_LIST[0].tasK_NO
    // console.log('this.taskData.approvalS_ABBR_LIST',toggle)

    console.log('Selected task id', taskId)

    if (this.selectedTasksId.has(taskId)) {
      this.selectedTasksId.delete(taskId);
      this.selectedTasks.delete(task);
    } else {
      this.selectedTasksId.add(taskId);
      this.selectedTasks.add(task);
    }

    const selectedTasksArray = [...this.selectedTasks];

    console.log('selectedTaskArr',selectedTasksArray)

    this.selectedSeqArr = this.sortTasksBySequence(selectedTasksArray);


    const flattenedTasks = this.breakToLinear(this.selectedSeqArr);

    // console.log('flattenedTasks',flattenedTasks)

    const seen = new Set();

    const uniqueTasks = flattenedTasks.filter(task => {
      if (seen.has(task.TASK_NO)) {
        return false;
      }
      seen.add(task.TASK_NO);
      return true;
    });
    // console.log('unFlatternArr', this.unFlatternArr);

    // console.log('uniqueTasks', uniqueTasks);




    this.uniqueSubTask = uniqueTasks

  }

//   toggleTasksOnInit(): void {
//     // Get the task ID of the first task in approvalS_ABBR_LIST
//     const taskData = this.taskData.approvalS_ABBR_LIST[0];
//     console.log('taskData', taskData)
//     const taskId = taskData.tasK_NO;  // Assuming taskData has TASK_NO

//     console.log('Toggling task with TASK_NO', taskId);

//     // Check if the task is already selected
//     if (this.selectedTasksId.has(taskId)) {
//         // If already selected, remove it
//         this.selectedTasksId.delete(taskId);
//         this.selectedTasks.delete(taskData);  // Remove the task from selected tasks
//     } else {
//         // If not selected, add it
//         this.selectedTasksId.add(taskId);
//         this.selectedTasks.add(taskData);  // Add the task to selected tasks
//     }

//     // Process the selected tasks after toggling
//     const selectedTasksArray = [...this.selectedTasks];

//     console.log('selectedTaskArr', selectedTasksArray);

//     // Sort the selected tasks (replace with your actual sorting function)
//     this.selectedSeqArr = this.sortTasksBySequence(selectedTasksArray);

//     // Flatten the tasks (replace with your actual flattening function)
//     const flattenedTasks = this.breakToLinear(this.selectedSeqArr);

//     // Ensure tasks are unique by removing duplicates
//     const seen = new Set();
//     const uniqueTasks = flattenedTasks.filter(task => {
//         if (seen.has(task.TASK_NO)) {
//             return false;
//         }
//         seen.add(task.TASK_NO);
//         return true;
//     });

//     // Update unique subtask list
//     this.uniqueSubTask = uniqueTasks;
// }




  // // Dummy sorting function, replace with your actual implementation
  // sortTasksBySequence(tasks: any[]): any[] {
  //   return tasks.sort((a, b) => a.TASK_NO - b.TASK_NO);  // Example sorting by TASK_NO
  // }

  // // Dummy flattening function, replace with your actual implementation
  //   breakToLinear(tasks: any[]): any[] {
  //   // Example flattening logic (adjust based on your actual data structure)
  //   return tasks.flat();  // Assuming tasks can be flattened
  



  newToggltSel(taskArray: any) {

    const input_table_id = taskArray.TASK_NO.TASK_NO;

    if (this.selectedTasksId_new.has(input_table_id)) {
      this.selectedTasksId_new.delete(input_table_id);
      this.tableData.delete(taskArray);
    } else {
      this.selectedTasksId_new.add(input_table_id);
      this.tableData.add(taskArray);
    }

    const selectedTasksArray = [...this.tableData];

    if (selectedTasksArray.length > 0) {
      const lastTask = selectedTasksArray[selectedTasksArray.length - 1];


      if (lastTask.TASK_NO.start_date && lastTask.TASK_NO.end_date) {

        const taskExists = this.ValueList.some(task => task.TASK_NO === lastTask.TASK_NO && task.maiN_ABBR === lastTask.maiN_ABBR);

        if (!taskExists) {
          console.log('taskExists', taskExists)
          this.ValueList.push(lastTask);

        }
      }
    }

    const flatternDataTable = this.breakToLinear(this.ValueList)

    this.uniqList = flatternDataTable;

  }



  breakToLinear(selectedSeq: any) {

    const result: any[] = [];
    const USER_CRED = this.credentialService.getUser();


    const flatten = (task: any) => {

      result.push({
        tasK_NO: task.TASK_NO.TASK_NO.trim(),
        maiN_ABBR: task.TASK_NO.maiN_ABBR,
        abbR_SHORT_DESC: task.TASK_NO.abbR_SHORT_DESC,
        dayS_REQUIRED: Number(task.TASK_NO.dayS_REQUIERD),
        approvaL_ABBRIVATION: task.TASK_NO.maiN_ABBR,
        approvaL_DESCRIPTION: task.TASK_NO.abbR_SHORT_DESC,
        resposiblE_EMP_MKEY: Number(task.TASK_NO.resposiblE_EMP_MKEY),
        tentativE_START_DATE: task.TASK_NO.start_date,
        tentativE_END_DATE: task.TASK_NO.end_date,
        department: task.TASK_NO.department_mkey,
        joB_ROLE: task.TASK_NO.joB_ROLE_mkey,
        outpuT_DOCUMENT: task.TASK_NO.enD_RESULT_DOC,
        // projecT_NAME: 'Project name',
        status: 'Created',
      });

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach(flatten);
      }
    };

    selectedSeq.forEach(flatten);



    return result;
  }


  addProjectDef() {
    const USER_CRED = this.credentialService.getUser();
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    const PROJECT = this.projectDefForm.get('property')?.value;
    const SUB_PROJECT = this.projectDefForm.get('subProject')?.value;

    const subTaskList = this.uniqList

    console.log('PROJECT', PROJECT)
    console.log('SUB_PROJECT', SUB_PROJECT)
    const addProjectDefination = {
      projecT_NAME: SUB_PROJECT.MASTER_MKEY.toString(),
      projecT_ABBR: this.projectDefForm.get('projectAbbr')?.value,
      property: PROJECT.MASTER_MKEY,
      legaL_ENTITY: this.projectDefForm.get('legalEntity')?.value,
      projecT_ADDRESS: this.projectDefForm.get('projAddress')?.value,
      buildinG_CLASSIFICATION: Number(this.projectDefForm.get('bldCla')?.value),
      buildinG_STANDARD: Number(this.projectDefForm.get('blsStandard')?.value),
      statutorY_AUTHORITY: Number(this.projectDefForm.get('statutoryAuth')?.value),
      attributE1: "",
      attributE2: "",
      attributE3: "",
      createD_BY: USER_CRED[0].MKEY,
      lasT_UPDATED_BY: USER_CRED[0].MKEY,
      approvalS_ABBR_LIST: subTaskList
    }

    console.log(addProjectDefination)
    // this.apiService.postProjectDefination(addProjectDefination, this.recursiveLogginUser).subscribe({
    //   next: (addData: any) => {
    //     console.log('Data added successfully', addData)
    //   }, error: (error: ErrorHandler) => {
    //     console.log('Unable to get data', error)
    //   }
    // })
  }

  onLogin() {

    this.credentialService.validateUser(this.loginName, this.loginPassword);

    const data = this.credentialService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,

      console.log('onLogin data');

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

  fetchData(): void {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    // Make all the API calls in parallel using forkJoin
    forkJoin({
      buildingList: this.apiService.getBuildingClassificationDP(this.recursiveLogginUser),
      standardList: this.apiService.getStandardDP(this.recursiveLogginUser),
      statutoryAuthList: this.apiService.getStatutoryAuthorityDP(this.recursiveLogginUser),
      jobRoleList: this.apiService.getJobRoleDP(this.recursiveLogginUser),
      departmentList: this.apiService.getDepartmentDP(this.recursiveLogginUser),
      sanctoningAuthList: this.apiService.getSanctoningAuthDP(this.recursiveLogginUser),
      docTypeList: this.apiService.getDocTypeDP(this.recursiveLogginUser)
    }).subscribe({
      next: (response: any) => {
        // Now that all API calls have completed, bind the data
        this.buildingList = response.buildingList;
        this.standardList = response.standardList;
        this.statutoryAuthList = response.statutoryAuthList;
        this.jobRoleList = response.jobRoleList;
        this.departmentList = response.departmentList;
        this.SanctoningAuthList = response.sanctoningAuthList;
        this.docTypeList = response.docTypeList;

        // Bind the combo classification once all data is available
      

        this.bindComboClassification();

      

      },
      error: (error: any) => {
        // Handle error centrally for all API calls
        console.error('Error fetching data', error);
      }
    });
  }

  bindComboClassification() {
    // Mapping the fields directly to their corresponding matched descriptions
    if (this.taskData && this.taskData.mkey) {
      const fieldMappings: any = {
        buildingName: this.buildingList.find((building: any) => building.mkey === this.taskData.buildinG_CLASSIFICATION)?.typE_DESC,
        standardName: this.standardList.find((standard: any) => standard.mkey === this.taskData.buildinG_STANDARD)?.typE_DESC,
        authorityName: this.statutoryAuthList.find((authority: any) => authority.mkey === this.taskData.statutorY_AUTHORITY)?.typE_DESC
      };

      // Assign the values to taskData directly
      Object.keys(fieldMappings).forEach(field => {
        if (fieldMappings[field]) {
          this.taskData[field] = fieldMappings[field];
        }
      });
    }

  }



  onProjectSelect(selectElement: HTMLSelectElement) {
    // Get the selected project index (adjusting by -1 to get the correct option index)
    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex] || 0;

    // Get the MASTER_MKEY of the selected project
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : 0;

    if (selectedProjectMkey) {
      // Fetch sub-projects for the selected project
      this.apiService.getSubProjectDetails(selectedProjectMkey).subscribe(
        (data: any) => {
          // Set the fetched sub-projects to sub_proj
          this.sub_proj = data;

          // After fetching the sub-projects, set project and sub-project names in taskData
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
        console.log('fetchProjectData', this.project)
        this.setProjectNameToTaskData();

      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }





  getSubProj() {
    this.apiService.getSubProjectDetails(this.taskData.property).subscribe(
      (data: any) => {
        this.sub_proj = data;
        console.log('this.sub_proj', this.sub_proj)
        this.setProjectNameToTaskData();

      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching sub-projects');
      }
    );
  }


  setProjectNameToTaskData(): void {

    if (this.taskData && this.taskData.mkey) {
      // Find the project in the project array
      const matchedProject = this.project.find((property: any) => property.MASTER_MKEY === this.taskData.property);

      // Find the sub-project in the sub_proj array
      const matchedSubProject = this.sub_proj.find((building: any) => building.MASTER_MKEY === Number(this.taskData.projecT_NAME));

      if (matchedProject) {
        this.taskData.project_Name = matchedProject.TYPE_DESC;
      } else {
        console.log('No matching project found for MASTER_MKEY:', this.taskData.property);
      }

      if (matchedSubProject) {
        this.taskData.sub_proj_name = matchedSubProject.TYPE_DESC;
      }
    }
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


  getOptionList() {
    const token = this.apiService.getRecursiveUser();
    const USER_CRED = this.credentialService.getUser();

      const buildingCla = this.projectDefForm.get('bldCla')?.value;
      const buildingStd = this.projectDefForm.get('blsStandard')?.value;
      const statutoryAuth = this.projectDefForm.get('statutoryAuth')?.value;

      console.log(typeof buildingCla)

  
      console.log(`buildingCla: ${buildingCla} buildingStd: ${buildingStd} statutoryAuth: ${statutoryAuth}`)
  
      if (buildingCla && buildingStd && statutoryAuth) {
        this.recursiveLogginUser = this.apiService.getRecursiveUser();
        this.apiService.projectDefinationOption(USER_CRED[0]?.MKEY, token, buildingCla, buildingStd, statutoryAuth).subscribe({
          next: (gerAbbrRelData) => {
            // console.log('Get list: ', gerAbbrRelData)
            this.projDefinationTable = gerAbbrRelData
            this.getTree(gerAbbrRelData);
          },
          error: (err) => {
            console.error('API Error:', err);
          }
        });
      } else {
        this.tostar.error('Please select all classification');
        return;
      }       
  }

  // checkAndClick() {
  //   if (this.taskData.mkey) {
  //     // Trigger click event programmatically
  //     this.getOptionList();
  //   }
  // }

  // selectedOptionList(){

  //     console.log('selectedOptionList come here')
  //     const token = this.apiService.getRecursiveUser();
  //     const USER_CRED = this.credentialService.getUser();

  //     const buildingCla = this.taskData.buildinG_CLASSIFICATION;
  //     const buildingStd = this.taskData.buildinG_STANDARD;
  //     const statutoryAuth = this.taskData.statutorY_AUTHORITY;

  //     console.log(typeof this.taskData.buildinG_CLASSIFICATION)

  //     console.log(`buildingCla:  ${buildingCla} buildingStd: ${buildingStd} statutoryAuth: ${statutoryAuth}`)
  //     console.log('USER_CRED[0]?.MKEY', USER_CRED[0]?.MKEY)
  //     if (buildingCla && buildingStd && statutoryAuth) {
  //       this.recursiveLogginUser = this.apiService.getRecursiveUser();
  //       this.apiService.projectDefinationOption(USER_CRED[0]?.MKEY, token, buildingCla, buildingStd, statutoryAuth).subscribe({
  //         next: (gerAbbrRelData) => {
  //           console.log('Get list: ', gerAbbrRelData)
  //           this.projDefinationTable = gerAbbrRelData
  //           this.getTree(gerAbbrRelData);
  //         },
  //         error: (err) => {
  //           console.error('API Error:', err);
  //         }
  //       });
  //     } else {
  //       this.tostar.error('Please select all classification');
  //       return;
  //     }
    
  // }
  

  sortTasksBySequence(tasks: any[]): any[] {

    // console.log('sortTasksBySequence', tasks)
    return tasks.sort((a, b) => {
      const taskA = a.TASK_NO.TASK_NO.trim();
      const taskB = b.TASK_NO.TASK_NO.trim();

      // console.log(`TaskA ${taskA} & TaskB ${taskB}`)

      const taskSeqA = taskA.split('.').map((num: string) => parseInt(num, 10));
      const taskSeqB = taskB.split('.').map((num: string) => parseInt(num, 10));

      // Compare the task sequences
      for (let i = 0; i < Math.max(taskSeqA.length, taskSeqB.length); i++) {
        const valA = taskSeqA[i] || 0;
        const valB = taskSeqB[i] || 0;

        if (valA < valB) return -1;
        if (valA > valB) return 1;
      }
      return 0;
    });
  }





  calculateIndentation(taskNo: string, baseIndent: number, sd: any, ed: any): number {

    const task = this.selectedSeqArr.find(task => task.TASK_NO.TASK_NO === taskNo);

    if (task && Object.values(task).every(value => value !== undefined)) {
      this.unFlatternArr = [task]; // Assign to the class property only if no undefined values
      this.newToggltSel(task)

    }
    return (taskNo.split('.').length - 1) * baseIndent / 1.2;
  }






  isSelected(task: any): any {
    return this.selectedTasksId.has(task.TASK_NO.TASK_NO);     
  }


  filterCities() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDocs = this.cities.filter(city =>
      city.name.toLowerCase().includes(term)
    );

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


  convertTaskNo(tasks: Task[]): Task[] {
    const parentTaskCount = new Map<number, number>();
    const taskNumbers = new Map<number, string>();


    return tasks.map((task: any) => {
      let newTaskNo = '';

      if (task.SUBTASK_PARENT_ID === 0) {
        const count = parentTaskCount.get(0) || 0;
        newTaskNo = (count + 1).toString();
        parentTaskCount.set(0, count + 1);
      } else {
        const parentTaskNo = taskNumbers.get(task.SUBTASK_PARENT_ID);
        if (parentTaskNo) {
          const count = parentTaskCount.get(task.SUBTASK_PARENT_ID) || 0;
          newTaskNo = `${parentTaskNo}.${count + 1}`;
          parentTaskCount.set(task.SUBTASK_PARENT_ID, count + 1);
        }
      }

      task.TASK_NO = newTaskNo;

      taskNumbers.set(task.HEADER_MKEY, newTaskNo);

      return task;
    });
  }




  getTree(optionList: any[] = [], _jobRoleList: any[] = [], _departmentList: any[] = []) {
    
   

    // console.log('optionList', optionList)
    // console.log('this.jobRoleList_new', this.jobRoleList_new)
    // console.log('this.departmentList_new', this.departmentList_new)

    const check = this.convertTaskNo(optionList);

    console.log(optionList);
    const jobRoleList = this.jobRoleList;
    const departmentList = this.departmentList

    // this.taskData.approvalS_ABBR_LIST
       const optionListArr = optionList
      .filter((item: any) => item.tasK_NO !== null)
      .map((item: any) => {
        const jobRole = jobRoleList.find(role => role.mkey === parseInt(item.JOB_ROLE));
        const departmentRole = departmentList.find(department => department.mkey === parseInt(item.AUTHORITY_DEPARTMENT))
        const assignedEmployee = this.employees.find(employee => employee.MKEY === parseInt(item.RESPOSIBLE_EMP_MKEY));

        return {
          TASK_NO: item.TASK_NO,
          maiN_ABBR: item.MAIN_ABBR,
          abbR_SHORT_DESC: item.ABBR_SHORT_DESC,
          dayS_REQUIERD: item.DAYS_REQUIERD,
          enD_RESULT_DOC: item.END_RESULT_DOC,
          joB_ROLE: jobRole ? jobRole.typE_DESC : "Not found",
          joB_ROLE_mkey: jobRole.mkey || 0,
          department: departmentRole ? departmentRole.typE_DESC : "Not found",
          department_mkey: departmentRole.mkey,
          resposiblE_EMP: assignedEmployee.Assign_to,
          resposiblE_EMP_MKEY: assignedEmployee.MKEY
        }
      });

    // console.log('Updated optionListArr with typE_DESC:', optionListArr);



    this.loading = true;

   
    // console.log(same_data_new)  
    // const same_data_new = this.taskData.approvalS_ABBR_LIST
    // console.log('same_data_new',same_data_new);
    // console.log('optionList',optionList);

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

          // Add spaces based on depth
          const spaces = '  '.repeat(depth + 1);

          // Create new object with spaced TASK_NO
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

    const taskNumbers = [...new Set(same_data.map((task: any) => task.TASK_NO.split('.')[0]))];
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
    console.log('Subtasks:', this.subTasks);
    this.noParentTree(noSubParentTasks)
  }


  noParentTree(noParentTree: any) {

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
          console.log(`Found Parent Task: ${parentTask.TASK_NO.TASK_NO}`);
          parentTask.subtask.push(task);
        }
      }
    });


    // Step 3: Log the final organized tasks
    const tasks = no_parent_arr.filter((task: any) => {
      // console.log('task',task)
      return task.TASK_NO.maiN_ABBR != undefined || task.TASK_NO.maiN_ABBR != null;
    });


    const subtasks = tasks.flatMap((task: any) => task.subtask.map((sub: any) => sub.TASK_NO.TASK_NO));

    // Step 2: Filter out tasks whose TASK_NO is in the subtasks list
    const filteredTasks = tasks.filter((task: any) => !subtasks.includes(task.TASK_NO.TASK_NO));

    this.subTasks = [...this.subTasks, ...filteredTasks];

    console.log('subTasks', this.subTasks)

  }


  toggleVisibility(task: any) {
    task.visible = !task.visible;
  }

  onSubmit() {
    const requiredControls: string[] = [];
    const requiredFields: string[] = [];
    const valid = this.projectDefForm.valid;

    const addControlError = (message: string) => requiredControls.push(message);

    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };

    // Check for required form controls
    Object.keys(this.projectDefForm.controls).forEach(controlName => {
      const control = this.projectDefForm.get(controlName);

      if (control?.errors?.required) {
        // Convert camelCase to Title Case
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });

    // If there are any required fields missing, show the error message
    if (requiredControls.length > 0) {
      const errorMessage = `${requiredControls.join(' , ')}`;
      this.tostar.error(errorMessage);
      return;  // Stop further processing
    }

    // Check subtask list for missing dates
    const subTaskList = this.uniqList;

    if (subTaskList && subTaskList.length > 0) {
      const invalidSubTask = subTaskList.find((subTask) => {
        return !subTask.tentativE_START_DATE || !subTask.tentativE_END_DATE;
      });

      if (invalidSubTask) {
        // If any subtask is missing dates, show an error
        this.tostar.error('Missing tentative start or end date for a subtask');
        return;  // Stop further processing
      }
    }

    // If all checks pass, return true to indicate successful validation
    return true;
  }


  onAddProjDef() {
    const isValid = this.onSubmit();

    if (isValid) {

      this.addProjectDef();
      this.tostar.success('Success', 'Template added successfuly')
    } else {
      console.log('Form is invalid, cannot add template');
    }
  }



  getTree_new() {
    


    this.convertTaskNo(this.taskData.approvalS_ABBR_LIST);


    const jobRoleList = this.jobRoleList;
    const departmentList = this.departmentList

    this.taskData.approvalS_ABBR_LIST
       const optionListArr = this.taskData.approvalS_ABBR_LIST
      .filter((item: any) => item.tasK_NO !== null)
      .map((item: any) => {
        const jobRole = jobRoleList.find(role => role.mkey === parseInt(item.JOB_ROLE));
        const departmentRole = departmentList.find(department => department.mkey === parseInt(item.AUTHORITY_DEPARTMENT))
        const assignedEmployee = this.employees.find(employee => employee.MKEY === parseInt(item.RESPOSIBLE_EMP_MKEY));

        return {
          TASK_NO: item.tasK_NO,
          maiN_ABBR: item.approvaL_ABBRIVATION,
          abbR_SHORT_DESC: item.approvaL_DESCRIPTION,
          dayS_REQUIERD: item.dayS_REQUIRED,
          enD_RESULT_DOC: item.outpuT_DOCUMENT,
          // joB_ROLE: jobRole ? jobRole.typE_DESC : "Not found",
          // joB_ROLE_mkey: jobRole.mkey || 0,
          // department: departmentRole ? departmentRole.typE_DESC : "Not found",
          // department_mkey: departmentRole.mkey,
          // resposiblE_EMP: assignedEmployee.Assign_to,
          // resposiblE_EMP_MKEY: assignedEmployee.MKEY
        }
      });

    console.log('Updated optionListArr with typE_DESC getTree_new:', optionListArr);



    this.loading = true;

   
    // console.log(same_data_new)  
    // const same_data_new = this.taskData.approvalS_ABBR_LIST
    // console.log('same_data_new',same_data_new);
    // console.log('optionList',optionList);

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

          // Add spaces based on depth
          const spaces = '  '.repeat(depth + 1);

          // Create new object with spaced TASK_NO
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

    const taskNumbers = [...new Set(same_data.map((task: any) => task.TASK_NO.split('.')[0]))];
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

    // this.new_list_of_selectedSeqArr = [...this.subTasks]
    console.log('new_list_of_selectedSeqArr:', this.new_list_of_selectedSeqArr);
    this.noParentTree(noSubParentTasks)
  }


  noParentTree_new(noParentTree: any) {

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
          console.log(`Found Parent Task: ${parentTask.TASK_NO.TASK_NO}`);
          parentTask.subtask.push(task);
        }
      }
    });


    const tasks = no_parent_arr.filter((task: any) => {
      // console.log('task',task)
      return task.TASK_NO.maiN_ABBR != undefined || task.TASK_NO.maiN_ABBR != null;
    });


    const subtasks = tasks.flatMap((task: any) => task.subtask.map((sub: any) => sub.TASK_NO.TASK_NO));

    const filteredTasks = tasks.filter((task: any) => !subtasks.includes(task.TASK_NO.TASK_NO));

    this.subTasks = [...this.subTasks, ...filteredTasks];

    // this.new_list_of_selectedSeqArr = [...this.subTasks]

    console.log('subTasks', this.subTasks)

  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }
=======
export class ProjectDefinationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
}
