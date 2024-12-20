import { AfterViewInit, Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { CITIES, ICity } from '../add-approval-tempelate/cities';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-defination',
  templateUrl: './project-defination.component.html',
  styleUrls: ['./project-defination.component.css']
})
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

  flatList:any

  formVisibleMap: boolean[] = [];

  @Input() recursiveLogginUser: any = {};
  projectDefForm: FormGroup | any;

  selectedDocsMap: { [key: string]: any[] } = { endResult: [], checklist: [] };
  private hasDataBeenPassed = false; 

  disableClear = false

  isCleared = false;
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
  new_emps: any[] = [];
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

  currentDate: string = new Date().toISOString().split('T')[0];


  updatedDetails: boolean = false;

  createdOrUpdatedUserName: any
  loginName: string = '';
  loginPassword: string = '';
  ValueList: any[] = [];
  validValueList: any[]=[];

  public activeIndices: number[] = []; // Change here
  subTasks: any[] = [];
  optionSubTASk:any[] = [];

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

      if (RecursiveTaskData.mkey) {
        this.updatedDetails = !isNewTemp;
      } else {
        this.updatedDetails = false;
      }

      sessionStorage.setItem('task', JSON.stringify(RecursiveTaskData));
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
 
    this.activeIndices = this.accordionItems.map((_, index) => index);
    this.onLogin();
    this.fetchProjectData();
    // console.log('this.taskData.approvalS_ABBR_LIST[0].status', this.taskData.approvalS_ABBR_LIST[0].status)
    if (this.taskData && this.taskData.mkey) {
      // console.log('Saved Tasks:', this.taskData?.approvalS_ABBR_LIST[0].tasK_NO);
      // console.log('Task Data:', this.subTasks);    


      this.selectedOptionList();
      this.getTree_new();
      this.getSubProj();           
    }
    this.initilizeProjDefForm();
    this.fetchEmployeeName();
  }


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


  disableInitiatedCombo(): boolean {
    if (this.taskData.approvalS_ABBR_LIST[0].status === 'Initiated') {
      this.disableClear = true;
      return true;
    }
    this.disableClear = false;
    return false;
  }
  
  toggleFormVisibility(index: number) {
    this.formVisibleMap[index] = !this.formVisibleMap[index];
  }

  toggleFormVisibility_main(index: number) {
    this.formVisibleMap[index] = !this.formVisibleMap[index];
  }

  // toggleSelection(task: any = []): void {

  //   // console.log('check the approval mkey',task)
  //   const taskId = task.TASK_NO.TASK_NO;
   
  //   if (this.selectedTasksId.has(taskId)) {
  //     this.selectedTasksId.delete(taskId);
  //     this.selectedTasks.delete(task);
  //   } else {
  //     this.selectedTasksId.add(taskId);
  //     this.selectedTasks.add(task);
  //   }

  //   // console.log('selectedTasks: ',[task])
  //   console.log('new_list_of_selectedSeqArr: ',this.new_list_of_selectedSeqArr)

  //   // console.log('taskId check', )


  //   console.log('selectedSeqArr: ',this.selectedSeqArr)

  
    
  //   let selectedTasksArray;

  //   console.log(this.selectedTasks)
  //   console.log(this.selectedSeqArr)
  //   const getUniqueTasks = (tasksArray:any) => {
  //     const abbrCount = new Map();
    
  //     // Function to traverse tasks and count maiN_ABBR occurrences
  //     const countAbbr = (tasks:any) => {
  //       console.log('countAbbr', tasks)
  //       tasks.forEach((task:any) => {
  //         const abbr = task.TASK_NO.maiN_ABBR;
  //         abbrCount.set(abbr, (abbrCount.get(abbr) || 0) + 1);
    
  //         if (task.subtask && task.subtask.length > 0) {
  //           countAbbr(task.subtask); // Recursive call for subtasks
  //         }
  //       });
  //     };
    
  //     // Function to filter tasks with unique maiN_ABBR
  //     const filterUniqueTasks = (tasks:any) => {
  //       return tasks
  //         .filter((task:any) => abbrCount.get(task.TASK_NO.maiN_ABBR) === 1) // Keep unique tasks
  //         .map((task:any) => ({
  //           ...task,
  //           subtask: filterUniqueTasks(task.subtask || []), // Recursive filtering for subtasks
  //         }));
  //     };
    
  //     // Step 1: Count maiN_ABBR occurrences
  //     countAbbr(tasksArray);
    
  //     // Step 2: Filter tasks with unique maiN_ABBR
  //     return filterUniqueTasks(tasksArray);
  //   };

  //   console.log('selectedSeqArr',this.selectedSeqArr)
  //   if (this.taskData && this.taskData.mkey) {
  //     // Check if the combinations are equal
  //     if (this.taskData.approvalS_ABBR_LIST[0].status === 'Initiated' || this.taskData.approvalS_ABBR_LIST[0].status === 'Ready to Initiate') {
  //       console.log('coming to combine data', this.new_list_of_selectedSeqArr)
    
  //       // }
  //       selectedTasksArray = [...this.selectedTasks, ...this.new_list_of_selectedSeqArr];
  //       const uniqueTasksArray = getUniqueTasks(selectedTasksArray);

  //       console.log('uniqueTasksArray', uniqueTasksArray)
  //       selectedTasksArray = [...uniqueTasksArray, ...this.new_list_of_selectedSeqArr ];
  //     } else {


  //       // Pass only the existing selected tasks
  //       selectedTasksArray = [...this.selectedTasks];
  //     }
  //   } else {
  //     // If taskData or mkey is not present, pass only the existing selected tasks
  //     selectedTasksArray = [...this.selectedTasks];
  //   }
  //   // selectedTasksArray = [...this.selectedTasks, ...this.new_list_of_selectedSeqArr];

  //   console.log('selectedTasksArray', selectedTasksArray)

  //   console.log('this.new_list_of_selectedSeqArr',this.new_list_of_selectedSeqArr)

  //   const hasMatchingSubtask = (task: any, tasks: any[]): boolean => {
  //     for (let parentTask of tasks) {
  //         for (let subtask of parentTask.subtask) {
  //             if (subtask.TASK_NO.TASK_NO.trim() === task.TASK_NO.TASK_NO.trim()) {
  //                 return true;
  //             }
  //             if (subtask.subtask && subtask.subtask.length > 0) {
  //                 if (hasMatchingSubtask(task, [subtask])) {
  //                     return true;
  //                 }
  //             }
  //         }
  //     }
  //     return false;
  // };
  
  // const removeParentTaskIfInSubtasks = (tasks: any[]) => {
  //     return tasks.filter((task: any) => {
  //         const isSubtask = hasMatchingSubtask(task, tasks);
  //         // console.log('isSubtask:', isSubtask);
  //         return !isSubtask;
  //     });
  // };


  // const updatedTasksArray = removeParentTaskIfInSubtasks(selectedTasksArray);




  //   this.selectedSeqArr = this.sortTasksBySequence(updatedTasksArray);

  //   console.log('Selected Array', this.selectedSeqArr)
  //   const flattenedTasks = this.breakToLinear(this.selectedSeqArr);

  //   // console.log('flattenedTasks',flattenedTasks)

  //   const seen = new Set();

  //   const uniqueTasks = flattenedTasks.filter(task => {
  //     if (seen.has(task.TASK_NO)) {
  //       return false;
  //     }
  //     seen.add(task.TASK_NO);
  //     return true;
  //   });
  //   // console.log('unFlatternArr', this.unFlatternArr);

  //   console.log('uniqueSubTask', this.uniqueSubTask);

  //   this.uniqueSubTask = uniqueTasks

  // }




  // isTaskDisabled(task: any): boolean {
  //   // Check if the status is 'Initiated' before applying the disabling logic
  //   if (this.taskData?.approvalS_ABBR_LIST[0].status === 'Initiated') {
  //     // Get the selected task numbers from approvalS_ABBR_LIST
  //     const savedTaskNos = this.taskData?.approvalS_ABBR_LIST.map((item: any) => item.tasK_NO.trim());
  //     console.log("Saved Task Numbers (Trimmed):", savedTaskNos); // Log the saved task numbers to verify
  
  //     // Check if the current task number matches one of the selected task numbers
  //     if (savedTaskNos.includes(task.TASK_NO?.TASK_NO.trim())) {
  //       console.log("Disabling Task:", task.TASK_NO?.TASK_NO.trim()); // Debugging task disable
  //       return true; // Disable this task if it matches any selected task number
  //     }
  
  //     // Function to check if any subtask or nested subtask matches the selected task numbers
  //     const checkSubtask = (parentTask: any): boolean => {
  //       if (parentTask.subtask && parentTask.subtask.length > 0) {
  //         for (let subtask of parentTask.subtask) {
  //           console.log("Checking Subtask:", subtask.TASK_NO?.TASK_NO.trim()); // Log the subtask being checked
  //           if (savedTaskNos.includes(subtask.TASK_NO?.TASK_NO.trim())) {
  //             console.log("Disabling Subtask:", subtask.TASK_NO?.TASK_NO.trim()); // Debugging subtask disable
  //             return true; // Match found in subtask, disable it
  //           }
  
  //           // If the subtask has further nested subtasks, recursively check them
  //           if (subtask.subtask && subtask.subtask.length > 0) {
  //             if (checkSubtask(subtask)) {
  //               return true; // Recursively check nested subtasks
  //             }
  //           }
  //         }
  //       }
  //       return false; // No match found in subtasks
  //     };
  
  //     // Only disable if any subtask matches a selected task number, but don't disable the parent
  //     if (checkSubtask(task)) {
  //       console.log("Disabling Task because of Subtask Match:", task.TASK_NO?.TASK_NO.trim()); // Debugging
  //       return true; // Disable the task if any of its subtasks match a selected task number
  //     }
  
  //     return false; // No match found, task is not disabled
  //   }
  
  //   // If the status is not 'Initiated', don't apply any disabling logic
  //   return false;
  // }
  

//  isTaskDisabled(task: any): boolean {
//   const savedTaskNos = this.taskData?.approvalS_ABBR_LIST.map((item: any) => item.tasK_NO.trim());
//   // console.log("Saved Task Numbers (Trimmed):", savedTaskNos); // Log the saved task numbers to verify

//   if (savedTaskNos.includes(task.TASK_NO?.TASK_NO.trim())) {
//     // console.log("Disabling Task:", task.TASK_NO?.TASK_NO.trim()); // Debugging task disable
//     return true;
//   }

//   const checkSubtask = (parentTask: any): boolean => {
//     if (parentTask.subtask && parentTask.subtask.length > 0) {
//       for (let subtask of parentTask.subtask) {
//         // console.log("Checking Subtask:", subtask.TASK_NO?.TASK_NO.trim()); 
//         if (savedTaskNos.includes(subtask.TASK_NO?.TASK_NO.trim())) {
//           // console.log("Disabling Subtask:", subtask.TASK_NO?.TASK_NO.trim()); 
//           return true; 
//         }

//         if (subtask.subtask && subtask.subtask.length > 0) {
//           if (checkSubtask(subtask)) {
//             return true; 
//           }
//         }
//       }
//     }
//     return false; 
//   };

//   if (checkSubtask(task)) {
//     return true;
//   }

//   return false; 
// }

toggleSelection(task: any = []): void {
  const taskId = task?.TASK_NO?.TASK_NO;

  // Safely check and toggle selection state
  if (this.selectedTasksId.has(taskId)) {
    this.selectedTasksId.delete(taskId);
    this.selectedTasks.delete(task);
  } else {
    this.selectedTasksId.add(taskId);
    this.selectedTasks.add(task);
  }

  console.log('new_list_of_selectedSeqArr: ', this.new_list_of_selectedSeqArr);
  console.log('selectedSeqArr before updates: ', this.selectedSeqArr);

  // Combine and deduplicate tasks
  let selectedTasksArray: any[];

  // Utility function to count maiN_ABBR occurrences
  const getUniqueTasks = (tasksArray: any[]): any[] => {
    const abbrCount = new Map();

    const countAbbr = (tasks: any[]) => {
      tasks.forEach((task: any) => {
        const abbr = task?.TASK_NO?.maiN_ABBR;
        if (abbr) abbrCount.set(abbr, (abbrCount.get(abbr) || 0) + 1);

        if (task.subtask?.length) countAbbr(task.subtask); // Recursive call
      });
    };

    const filterUniqueTasks = (tasks: any[]): any[] => {
      return tasks
        .filter((task: any) => abbrCount.get(task?.TASK_NO?.maiN_ABBR) === 1)
        .map((task: any) => ({
          ...task,
          subtask: filterUniqueTasks(task.subtask || []), // Recursive filtering
        }));
    };

    countAbbr(tasksArray); // Step 1: Count
    return filterUniqueTasks(tasksArray); // Step 2: Filter
  };

  if (this.taskData?.mkey && !this.isCleared) {
    const status = this.taskData.approvalS_ABBR_LIST?.[0]?.status;

    if (status === 'Initiated' || status === 'Ready to Initiate') {
      console.log('Combining data', this.new_list_of_selectedSeqArr);

      // Merge, deduplicate, and filter for unique tasks
      selectedTasksArray = [...this.selectedTasks, ...this.new_list_of_selectedSeqArr];
      const uniqueTasksArray = getUniqueTasks(selectedTasksArray);

      console.log('uniqueTasksArray', uniqueTasksArray);
      selectedTasksArray = [...uniqueTasksArray,...this.new_list_of_selectedSeqArr];
    } else {
      // Only existing tasks
      selectedTasksArray = [...this.selectedTasks];
    }
  } else {
    selectedTasksArray = [...this.selectedTasks];
  }

  console.log('selectedTasksArray before subtask check:', selectedTasksArray);

  console.log(this.selectedSeqArr)

  // Function to check if task exists as a subtask
  const hasMatchingSubtask = (task: any, tasks: any[]): boolean => {
    return tasks.some((parentTask) =>
      parentTask.subtask?.some((subtask: any) => {
        if (subtask?.TASK_NO?.TASK_NO.trim() === task?.TASK_NO?.TASK_NO.trim()) {
          return true;
        }
        return subtask.subtask?.length > 0 && hasMatchingSubtask(task, [subtask]);
      })
    );
  };

  // Remove parent tasks that exist in subtasks
  const removeParentTaskIfInSubtasks = (tasks: any[]): any[] => {
    return tasks.filter((task: any) => !hasMatchingSubtask(task, tasks));
  };

  // Filter tasks to exclude duplicates in subtasks
  const updatedTasksArray = removeParentTaskIfInSubtasks(selectedTasksArray);

  // Sort tasks by sequence
  this.selectedSeqArr = this.sortTasksBySequence(updatedTasksArray);
  console.log('Selected Array after sorting:', this.selectedSeqArr);



  // Flatten tasks into a linear structure
  const flattenedTasks = this.breakToLinear(this.selectedSeqArr);

  const removeDup = this.removeDuplicates(this.selectedSeqArr)
  console.log('removeDup', removeDup)

  this.selectedSeqArr = removeDup;

  // Ensure uniqueness in the flattened tasks
  const seen = new Set();
  const uniqueTasks = flattenedTasks.filter((task) => {
    const taskNo = task?.TASK_NO?.TASK_NO;
    if (seen.has(taskNo)) return false;
    seen.add(taskNo);
    return true;
  });

  // Update the uniqueSubTask property
  this.uniqueSubTask = uniqueTasks;
  console.log('uniqueSubTask:', this.uniqueSubTask);
}

  
  
  isTaskDisabled(task: any): boolean {

    if (this.isCleared) {
      return false;
    }

    if (this.taskData?.approvalS_ABBR_LIST[0].status === 'Initiated' || this.taskData?.approvalS_ABBR_LIST[0].status === 'Ready to Initiate') {
      const savedTaskNos = this.taskData?.approvalS_ABBR_LIST.map((item: any) => item.approvaL_ABBRIVATION.trim());
      // console.log("Saved Task Numbers (Trimmed):", savedTaskNos);
    
      if (savedTaskNos.includes(task.TASK_NO?.maiN_ABBR.trim())) {
        // console.log("Disabling Task:", task.TASK_NO?.TASK_NO.trim());
        return true; 
      }
    
      return false; 
    }
    
    return false;
  }
  
  
  
  newToggltSel(taskArray: any) {

    const input_table_id = taskArray.TASK_NO.TASK_NO;

    if (this.selectedTasksId_new.has(input_table_id)) {
      this.selectedTasksId_new.delete(input_table_id);
      this.tableData.delete(taskArray);
    } else {
      this.selectedTasksId_new.add(input_table_id);
      this.tableData.add(taskArray);
    }

    // console.log('selectedSeqArr newToggltSel',this.selectedSeqArr)
    const selectedTasksArray = [...this.tableData ]; //...this.selectedSeqArr

    if (selectedTasksArray.length > 0) {

      // console.log('selectedTasksArray',selectedTasksArray)


      const lastTask = selectedTasksArray[selectedTasksArray.length - 1];

      if (lastTask.TASK_NO.start_date && lastTask.TASK_NO.end_date) {
        // console.log('this.ValueList',this.ValueList)

        const taskExists = this.ValueList.some(task => task.TASK_NO === lastTask.TASK_NO && task.maiN_ABBR === lastTask.maiN_ABBR);

        if (!taskExists) {
          this.ValueList.push(lastTask);
        }
      }
    }

    const flatternDataTable = this.breakToLinear(this.ValueList)

    this.uniqList = flatternDataTable;

    // console.log(this.uniqList)


  }


  disableInitiatedTask(task: any): boolean {
    // console.log('Task:', task);
    // console.log('Approval List:', this.taskData.approvalS_ABBR_LIST);
      return (
      this.taskData.approvalS_ABBR_LIST.some(
        (item:any) =>
          item.approvaL_ABBRIVATION === task.TASK_NO?.approvaL_ABBRIVATION &&
          item.status === 'Initiated'
          
      )
    );
  }


  


  breakToLinear(selectedSeq: any) {


    // console.log('breakToLinear selectedSeq',selectedSeq)

    const result: any[] = [];
    const USER_CRED = this.credentialService.getUser();


    const flatten = (task: any) => {

      // console.log('task from breakToLinear',task)

      if(this.taskData && this.taskData.mkey){
        result.push({
          headeR_MKEY:this.taskData.mkey,
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
          status: task.TASK_NO.status || 'created',
        });
      }else{
        result.push({
          // headeR_MKEY:this.taskData.mkey,
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
          status: task.TASK_NO.status || 'created',
        });
      }

      // result.push({
      //   headeR_MKEY:this.taskData.mkey,
      //   tasK_NO: task.TASK_NO.TASK_NO.trim(),        
      //   dayS_REQUIRED: Number(task.TASK_NO.dayS_REQUIERD),
      //   approvaL_ABBRIVATION: task.TASK_NO.maiN_ABBR,
      //   approvaL_DESCRIPTION: task.TASK_NO.abbR_SHORT_DESC,
      //   resposiblE_EMP_MKEY: Number(task.TASK_NO.resposiblE_EMP_MKEY),
      //   tentativE_START_DATE: task.TASK_NO.start_date,
      //   tentativE_END_DATE: task.TASK_NO.end_date,
      //   department: task.TASK_NO.department_mkey,
      //   joB_ROLE: task.TASK_NO.joB_ROLE_mkey,
      //   approvaL_MKEY:task.TASK_NO.approvaL_MKEY,
      //   outpuT_DOCUMENT: task.TASK_NO.enD_RESULT_DOC,
      //   status: task.TASK_NO.status || 'created',
      // });

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach(flatten);
      }
    };

    selectedSeq.forEach(flatten);



    return result;
  }


  addProjectDef() {
    console.log()
    const USER_CRED = this.credentialService.getUser();
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    const PROJECT = this.projectDefForm.get('property')?.value;
    const SUB_PROJECT = this.projectDefForm.get('subProject')?.value;

    const subTaskList = this.uniqList

    console.log('PROJECT', PROJECT)
    console.log('SUB_PROJECT', SUB_PROJECT)
    const addProjectDefination = {
      projecT_NAME: SUB_PROJECT.MASTER_MKEY,
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
    this.apiService.postProjectDefination(addProjectDefination, this.recursiveLogginUser).subscribe({
      next: (addData: any) => {
        console.log('Data added successfully', addData)
      }, error: (error: ErrorHandler) => {

        console.log('Unable to get data', error)
      }
    })
  }


  updateProjectDef() {
    const USER_CRED = this.credentialService.getUser();
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const headerMkey = this.taskData.mkey

    console.log('from update',this.sub_proj)
  
    console.log('sub_project',this.taskData.projecT_NAME)
    console.log('Project', this.taskData.property)

    const PROJECT = this.projectDefForm.get('property')?.value;
    console.log('PROJECT.MASTER_MKEY', PROJECT.MASTER_MKEY)
    const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);
    // console.log('matchedProject',matchedProject)

    const SUB_PROJECT = this.projectDefForm.get('subProject')?.value;
    console.log(SUB_PROJECT)

    const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJECT);
    // console.log('SUB_PROJECT.MASTER_MKEY', SELECTED_PROJ.MASTER_MKEY)

    const projectName = PROJECT?.MASTER_MKEY ? PROJECT.MASTER_MKEY : this.taskData?.property;
    const subProjectName = SELECTED_PROJ?.MASTER_MKEY ? SELECTED_PROJ.MASTER_MKEY : this.taskData?.projecT_NAME;

  
    let subTaskList = this.uniqList;
  
   
      if (!this.isCleared) {
        subTaskList = subTaskList.filter((task, index, self) => {
            // Check if task is not "Ready to Initiate" and is not a duplicate task with status "created"
            const isDuplicate = self.findIndex(t => t.tasK_NO === task.tasK_NO) !== index;

            // Keep tasks that are either "Ready to Initiate" or "created" and if it is the first occurrence (or not a duplicate with status "created")
            return (task.status === "Ready to Initiate" || task.status === "created" || task.status === "Initiated") &&
                  (!isDuplicate || task.status === "Ready to Initiate") || (!isDuplicate || task.status === "Initiated");                                
        });
    } else {

      subTaskList = this.flatList
      console.log('subTaskList', subTaskList )
        // Otherwise, remove "Ready to Initiate" tasks
        // subTaskList = subTaskList.filter(task => task.status !== "Ready to Initiate");
        
    }
  
  
    console.log('Filtered Sub Task List:', subTaskList);
  
    const addProjectDefination = {
      mkey:this.taskData.mkey,
      projecT_NAME: projectName,
      projecT_ABBR: this.projectDefForm.get('projectAbbr')?.value,
      property: subProjectName,
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
      approvalS_ABBR_LIST: this.removeDuplicates(subTaskList)
    };
  
    console.log(addProjectDefination);
    this.apiService.putProjectDefination(addProjectDefination, headerMkey, this.recursiveLogginUser).subscribe({
      next: (addData: any) => {
        console.log('Data added successfully', addData)
      }, error: (error: ErrorHandler) => {
        console.log('Unable to get data', error)
      }
    });
  }
  

  

  initiateToApprovalInitiation(approvalKey:any) {
    console.log('taskData Check', this.taskData)
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const project_mkey = this.taskData.mkey
    const approval_mkey = this.taskData.approvalS_ABBR_LIST[0].approvaL_MKEY

    console.log(`project_mkey: ${project_mkey}, approval_mkey ${approvalKey}`)

    this.apiService.getApprovalInitiation(this.recursiveLogginUser,project_mkey, approvalKey).subscribe({
      next:(response)=>{
        if(response){
          console.log('initiateToApprovalInitiation',response.data)
          this.navigateToApprovalInitiation(response.data);
        } 
      },
      error: (error) => {

        console.error('Login failed:', error);
      }
    })
  }


  navigateToApprovalInitiation(apprInitData:any){
    this.router.navigate(['approvals', 'approval-task-initiation', { Task_Num: apprInitData.MKEY }], {state: { taskData: apprInitData }});
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
        this.buildingList = response.buildingList;
        this.standardList = response.standardList;
        this.statutoryAuthList = response.statutoryAuthList;
        this.jobRoleList = response.jobRoleList;
        this.departmentList = response.departmentList;
        this.SanctoningAuthList = response.sanctoningAuthList;
        this.docTypeList = response.docTypeList;

    
        this.bindComboClassification();
    
      },
      error: (error: any) => {
        console.error('Error fetching data', error);
      }
    });
  }

  bindComboClassification() {
    if (this.taskData && this.taskData.mkey) {
      const fieldMappings: any = {
        buildingName: this.buildingList.find((building: any) => building.mkey === this.taskData.buildinG_CLASSIFICATION)?.typE_DESC,
        standardName: this.standardList.find((standard: any) => standard.mkey === this.taskData.buildinG_STANDARD)?.typE_DESC,
        authorityName: this.statutoryAuthList.find((authority: any) => authority.mkey === this.taskData.statutorY_AUTHORITY)?.typE_DESC
      };

      Object.keys(fieldMappings).forEach(field => {
        if (fieldMappings[field]) {
          this.taskData[field] = fieldMappings[field];
        }
      });
    }

  }



  onProjectSelect(selectElement: HTMLSelectElement) {
    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex] || 0;

    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : 0;
    const token = this.apiService.getRecursiveUser();


    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
        (response: any) => {
          this.sub_proj = response[0].data;

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

    this.apiService.getSubProjectDetailsNew(this.taskData.property.toString(), token).subscribe(
      (response: any) => {
        this.sub_proj = response[0]?.data;
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

    // if (this.hasDataBeenPassed) {
    //   return; 
    // }
    const token = this.apiService.getRecursiveUser();
    const USER_CRED = this.credentialService.getUser();
    let gerAbbrRelDataArr = []

      const buildingCla = this.projectDefForm.get('bldCla')?.value;
      const buildingStd = this.projectDefForm.get('blsStandard')?.value;
      const statutoryAuth = this.projectDefForm.get('statutoryAuth')?.value;

      console.log(typeof buildingCla)

  
      console.log(`buildingCla: ${buildingCla} buildingStd: ${buildingStd} statutoryAuth: ${statutoryAuth}`)
      // this.hasDataBeenPassed = true; 
  
      if (buildingCla && buildingStd && statutoryAuth) {
        this.recursiveLogginUser = this.apiService.getRecursiveUser();
        this.apiService.projectDefinationOption(USER_CRED[0]?.MKEY, token, buildingCla, buildingStd, statutoryAuth).subscribe({
          next: (gerAbbrRelData) => {
            console.log('Get list: ', gerAbbrRelData)
            // this.projDefinationTable = gerAbbrRelData
            console.log('gerAbbrRelData', gerAbbrRelData)

            const check = gerAbbrRelDataArr.push(gerAbbrRelData)
            console.log('check', gerAbbrRelDataArr.push(gerAbbrRelData))
            this.getTree(gerAbbrRelData);
          },
          error: (error) => {
            // console.log('error.status',error.error.status)
            if(error.error && error.error.status === 404){
              this.tostar.error('Classification of this combo is not available')
            }
            console.error('API Error:', error);
          }
        });
      } else {
        this.tostar.error('Please select all classification');
        return;
      }       
  }



  selectedOptionList(){

      console.log('selectedOptionList come here')
      const token = this.apiService.getRecursiveUser();
      const USER_CRED = this.credentialService.getUser();

      const buildingCla = this.taskData.buildinG_CLASSIFICATION;
      const buildingStd = this.taskData.buildinG_STANDARD;
      const statutoryAuth = this.taskData.statutorY_AUTHORITY;

      if (buildingCla && buildingStd && statutoryAuth) {
        this.recursiveLogginUser = this.apiService.getRecursiveUser();
        this.apiService.projectDefinationOption(USER_CRED[0]?.MKEY, token, buildingCla, buildingStd, statutoryAuth).subscribe({
          next: (gerAbbrRelData) => {

            console.log('this.taskData.buildinG_CLASSIFICATION', this.taskData.buildinG_CLASSIFICATION)
            

            if (!this.isCleared) { // Only call getTree if not cleared
              this.projDefinationTable = gerAbbrRelData

              this.getTree(gerAbbrRelData);
            }
          
          },
          error: (error:any) => {
            console.log('error.status',error.error.status)
            if(error.status === 404){
              error.tostar('Classification of this combo is not available')
            }
            console.error('API Error:', error);
          }
        });
      } else {
        this.tostar.error('Please select all classification');
        return;
      }    
  }


  confirmClear() {
    const confirmAction = window.confirm("Are you sure you want to clear all data?");
    if (confirmAction) {
      // window.location.reload();
      this.clear();
    } else {
      console.log('Clear action was canceled.');
    }
  }

  clear() {
  
      this.taskData.buildinG_CLASSIFICATION =  null,
      this.taskData.buildinG_STANDARD = null,
      this.taskData.statutorY_AUTHORITY = null
    
    this.subTasks = [];
    this.ValueList = [];
    this.selectedSeqArr = [];
    this.flatList = [];
    this.selectedTasksId = new Set();
    this.isCleared = true; // Set clear flag
    console.log('Clear action executed.');
    this.tostar.success('Cleared successfully');
  }

  reset(){
    window.location.reload();
  }
  
  

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
      this.unFlatternArr = [task]; 
      this.newToggltSel(task)

    }
    return (taskNo.split('.').length - 1) * baseIndent / 1.2;
  }


  isSelectedNew(task:any):boolean{
    return this.selectedTasksId.has(task.TASK_NO.TASK_NO);
  }



  isSelected(task: any): boolean {
    return this.selectedTasksId.has(task.TASK_NO.TASK_NO);
  }

  isTaskInSavedList(task: any): boolean {
    // Return false immediately if the data is cleared
    if (this.isCleared) {
      return false;
    }
  
    // Check if the status is 'Initiated' before applying the logic
    if (this.taskData?.approvalS_ABBR_LIST[0].status === 'Initiated' || this.taskData?.approvalS_ABBR_LIST[0].status === 'Ready to Initiate') {
      // Get the selected task numbers from approvalS_ABBR_LIST
      const savedTaskNos = this.taskData?.approvalS_ABBR_LIST.map((item: any) => item.maiN_ABBR);
      // console.log("Saved Task Numbers (Trimmed):", savedTaskNos); // Log the saved task numbers to verify
  
      // Check if the current task number matches one of the saved task numbers
      return savedTaskNos.includes(task.TASK_NO?.maiN_ABBR);
    }
  
    // Return false if status is not 'Initiated' or other cases
    return false;
  }
  
  
  

  // isSelected(task: any): any {
  //   return this.selectedTasksId.has(task.TASK_NO.TASK_NO);     
  // }


  filterCities() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDocs = this.cities.filter(city =>
      city.name.toLowerCase().includes(term)
    );

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


  removeDuplicates(array: any[]): any[] {
    // Remove duplicates using a Set or custom logic
    return Array.from(new Set(array.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
}

 async getTree(optionList: any[] = [], _jobRoleList: any[] = [], _departmentList: any[] = []) {
    
   
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    let department_new: any;
    let jobRole_new: any;

    try {
        // First fetch department data
        department_new = await this.apiService.getDepartmentDP(this.recursiveLogginUser).toPromise();

        // Then fetch job role data
        jobRole_new = await this.apiService.getJobRoleDP(this.recursiveLogginUser).toPromise();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
    this.convertTaskNo(optionList);

    const jobRoleList = jobRole_new;
    const departmentList = department_new

    // const combinedList = [...optionList];


    optionList;

    // console.log('uniqueList', uniqueList)


    // this.taskData.approvalS_ABBR_LIST
       const optionListArr = optionList
      .filter((item: any) => item.tasK_NO !== null)
      .map((item: any) => {
        
        const jobRole = jobRoleList.find((role:any) => role.mkey === parseInt(item.JOB_ROLE));
        const departmentRole = departmentList.find((department:any) => department.mkey === parseInt(item.AUTHORITY_DEPARTMENT))
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
          approvaL_MKEY:item.HEADER_MKEY,
          // resposiblE_EMP: assignedEmployee.Assign_to,
          resposiblE_EMP_MKEY: item.RESPOSIBLE_EMP_MKEY
        }
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
        this.optionSubTASk.push(hierarchy);
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

    

    // this.selectedSeqArr = [...this.subTasks]

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

        console.log('formattedControlName', formattedControlName)
        addControlError(formattedControlName);
      }
    });
  
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

  
      console.log('subTaskList', subTaskList)
  
      if (invalidSubTask) {
        this.tostar.error('Missing tentative start or end date for a subtask');
        return;
      }
  
      const invalidDateSubTask = this.validateTaskDates(subTaskList);
  
      if (invalidDateSubTask) {
        return;  
      }
    }
  
    console.log('subTaskList', subTaskList)
  
    const selectedSeqArr = this.selectedSeqArr;
    const uniqList = this.uniqList;
    const flatList = this.breakToLinear(selectedSeqArr);
  
    this.flatList = flatList
    console.log('uniqList', uniqList);
    console.log('flatList', flatList);
  
    if (uniqList.length === 0 && flatList.length > 0) {
      this.tostar.error('Missing tentative start or end date for a subtask');
      return;
    }

    const invalidDateSubTask = subTaskList.some((task) => {
      const startDate = new Date(task.tentativE_START_DATE);
      const endDate = new Date(task.tentativE_END_DATE);

      if (startDate > endDate) {
        this.tostar.error(`Task ${task.tasK_NO}: Start date cannot be greater than end date.`);
        return true;
      }
      return false;
    });

    if (invalidDateSubTask) {
      return;  
    }
    return true;
  }
  
  // New function to validate task dates and parent-child relationships
  validateTaskDates(subTaskList: any[]): boolean {
    // Sort tasks by task number to ensure the parent-child order
    subTaskList.sort((a, b) => a.tasK_NO.localeCompare(b.tasK_NO));
  
    // Loop through all tasks and validate parent-child relationships
    for (let i = 0; i < subTaskList.length; i++) {
      const task = subTaskList[i];
      const startDate = new Date(task.tentativE_START_DATE);
      const endDate = new Date(task.tentativE_END_DATE);
  
      // Validate the end date of parent tasks against child tasks
      const isParent = !task.tasK_NO.includes('.');
      if (isParent) {
        // Check if this parent task's end date is greater than any child task
        const childTask = subTaskList.find(child => child.tasK_NO.startsWith(task.tasK_NO + '.') && new Date(child.tentativE_END_DATE) > endDate);
  
        if (childTask) {
          this.tostar.error(`End date of parent task (${task.tasK_NO}) should be greater than child task (${childTask.tasK_NO})`);
          return true;  // Exit on first error
        }
      }
      
      if (i === 0) {
        const position1EndDate = new Date(task.tentativE_END_DATE);
  
        for (let j = 1; j < subTaskList.length; j++) {
          const otherTask = subTaskList[j];
          const otherEndDate = new Date(otherTask.tentativE_END_DATE);
          if (otherEndDate > position1EndDate) {
            this.tostar.error(`End date of task (${task.tasK_NO}) should be greater than ${otherTask.tasK_NO}`);
            return true; // Exit on first error
          }
        }
      }
    }
  
    return false;  // All checks passed
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


  onUpdateProjDef() {
    const isValid = this.onSubmit();

    if (isValid) {

      this.updateProjectDef();
      this.tostar.success('Success', 'Template added successfuly')
    } else {
      console.log('Form is invalid, cannot add template');
    }
  }


  deleteTask() {
    const lastUpdatedBy = this.taskData.lasT_UPDATED_BY;
    const headerMkey = this.taskData.mkey;    
    const jwtToken = 'your_jwt_token_here';
  
    this.apiService.deleteProjectDefinationTask(lastUpdatedBy, headerMkey, jwtToken)
      .subscribe({
        next: (response) => {
          console.log('Task deleted successfully:', response);
        },
        error: (error) => {
          console.error('Error occurred while deleting task:', error);
        },
        complete: () => {
          console.log('Delete task request completed.');
        }
      });
  }



  newEmps(){
    let employeesList:any
    const token = this.apiService.getRecursiveUser();;

    employeesList =  this.apiService.getEmpDetailsNew(token).toPromise();

    console.log('employeesList', employeesList)

        employeesList.forEach((emp: any) => {
            const fullName = emp.EMP_FULL_NAME;
            const MKEY = emp.MKEY;
            let capitalizedFullName = '';
            const nameParts = fullName.split(' ');

            // Format the employee name with initials
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

            this.new_emps.push({ Assign_to: capitalizedFullName, MKEY: MKEY });
        });

  }



 async getTree_new() { 

    this.convertTaskNo(this.taskData.approvalS_ABBR_LIST);


    let department_new: any;
    let jobRole_new: any; 

    try {
        department_new = await this.apiService.getDepartmentDP(this.recursiveLogginUser).toPromise();
        jobRole_new = await this.apiService.getJobRoleDP(this.recursiveLogginUser).toPromise();
       
    } catch (error) {
        console.error('Error fetching data:', error);
    } 

    const jobRoleList = jobRole_new;
    const departmentList = department_new


    this.taskData.approvalS_ABBR_LIST
       const optionListArr = this.taskData.approvalS_ABBR_LIST
      .filter((item: any) => item.tasK_NO !== null)
      .map((item: any) => {

        // console.log("item.resposiblE_EMP_MKEY:", item.resposiblE_EMP_MKEY);
        const jobRole = jobRoleList.find((role:any) => role.mkey === parseInt(item.joB_ROLE));
        const departmentRole = departmentList.find((department:any) => department.mkey === parseInt(item.department));

        // console.log('Item', item)
        return {
          TASK_NO: item.tasK_NO,
          maiN_ABBR: item.approvaL_ABBRIVATION,
          abbR_SHORT_DESC: item.approvaL_DESCRIPTION,
          dayS_REQUIERD: item.dayS_REQUIRED,
          enD_RESULT_DOC: item.outpuT_DOCUMENT,
          joB_ROLE: jobRole ? jobRole.typE_DESC : "Not found",
          joB_ROLE_mkey: jobRole.mkey || 0,
          department: departmentRole ? departmentRole.typE_DESC : "Not found",
          department_mkey: departmentRole.mkey,
          start_date:item.tentativE_START_DATE,
          end_date:item.tentativE_END_DATE,
          approvaL_MKEY:item.approvaL_MKEY,
          status:item.status,
          // resposiblE_EMP: assignedEmployee.Assign_to,
          resposiblE_EMP_MKEY: item.resposiblE_EMP_MKEY
        }
      });

    // console.log('Updated optionListArr with typE_DESC getTree_new:', optionListArr);



    this.loading = true;

   
    // console.log(same_data_new)  
    // const same_data_new = this.taskData.approvalS_ABBR_LIST
    // console.log('same_data_new',same_data_new);
    // console.log('optionListArr',optionListArr);

    const same_data = optionListArr;

    // const buildHierarchy = (tasks: any, rootTaskNo: any) => {
    //   const rootTask = tasks.find((task: any) => task.TASK_NO === rootTaskNo);
    //   if (!rootTask) return null;

    //   const buildSubtasks = (taskNo: any, depth: any) => {
    //     const subtasks = tasks.filter((task: any) => {
    //       const taskDepth = task.TASK_NO.split('.').length - 1;
    //       return task.TASK_NO.startsWith(taskNo + '.') && taskDepth === depth + 1;
    //     });
    //     if (subtasks.length === 0) return [];

    //     return subtasks.map((subtask: any) => {
    //       const subtaskWithNestedTaskNo: any = {
    //         TASK_NO: subtask,
    //         visible: true,
    //         subtask: buildSubtasks(subtask.TASK_NO, depth + 1)
    //       };

    //       // Add spaces based on depth
    //       const spaces = '  '.repeat(depth + 1);

    //       // Create new object with spaced TASK_NO
    //       const indentedSubtask = Object.keys(subtaskWithNestedTaskNo).reduce((acc: any, key) => {
    //         if (key === 'TASK_NO') {
    //           acc[key] = {
    //             ...subtaskWithNestedTaskNo[key],
    //             TASK_NO: spaces + subtaskWithNestedTaskNo[key].TASK_NO
    //           };
    //         } else {
    //           acc[key] = subtaskWithNestedTaskNo[key];
    //         }
    //         return acc;
    //       }, {});

    //       return indentedSubtask;
    //     });
    //   };

    //   const rootDepth = rootTask.TASK_NO.split('.').length - 1;
    //   const rootHierarchy = {
    //     TASK_NO: {
    //       ...rootTask,
    //       TASK_NO: rootTask.TASK_NO,
    //     },
    //     visible: true,
    //     subtask: buildSubtasks(rootTask.TASK_NO, rootDepth)
    //   };

    //   return rootHierarchy;
    // };

    // const taskNumbers = [...new Set(same_data.map((task: any) => task.TASK_NO.split('.')[0]))];
    // taskNumbers.forEach(taskNo => {
    //   const hierarchy = buildHierarchy(same_data, taskNo);
    //   // if (hierarchy) {
    //   //   // this.subTasks.push(hierarchy);
    //   //   // this.optionSubTASk.push(hierarchy);

    //   // }
    // });

    const noSubParentTasks: any = []

    const allRootTaskNumbersInHierarchy = this.subTasks.map((subtask: any) => subtask.TASK_NO.TASK_NO.split('.')[0]);

    same_data.forEach((task: any) => {

      const taskRootNo = task.TASK_NO.split('.')[0];
      if (!allRootTaskNumbersInHierarchy.includes(taskRootNo)) {
        noSubParentTasks.push(task);
      }
    });

    // console.log('check noSubParentTasks', noSubParentTasks)
    this.loading = false;
    // const filteredTasks = this.removeTasksWithoutDates(this.subTasks);

    // console.log('filteredTasks', filteredTasks)

    this.new_list_of_selectedSeqArr = this.subTasks

    // this.selectedSeqArr = [...this.optionSubTASk]

    this.noParentTree_new(noSubParentTasks)
  }





  noParentTree_new(noParentTree?: any) {


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
      // console.log('task',task)
      return task.TASK_NO.maiN_ABBR != undefined || task.TASK_NO.maiN_ABBR != null;
    });


    const subtasks = tasks.flatMap((task: any) => task.subtask.map((sub: any) => sub.TASK_NO.TASK_NO));

    const filteredTasks = tasks.filter((task: any) => !subtasks.includes(task.TASK_NO.TASK_NO));




    // this.subTasks = [...this.subTasks];
    



    this.selectedSeqArr = [...filteredTasks, ...this.subTasks];

    // console.log('selectedSeqArr noParentTree_new', this.selectedSeqArr)
    // this.selectedSeqArr = [...this.subTasks]

    this.new_list_of_selectedSeqArr = this.selectedSeqArr

  }


  
  


 
  

  ngOnDestroy(): void {
    console.log('Component is being destroyed');

    sessionStorage.removeItem('task');
  }
}
