import { AfterViewInit, ChangeDetectorRef, Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
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

  isLoading: boolean = true; // Hide the button when clicked
  disableChilCheckBox: boolean = false;
  isAllSelectedCheck: boolean = false;
  selectAllChecked: boolean = false;
  lodingTrue: boolean = false;

  receivedUser: string | any;
  taskDetails: any;
  loading: boolean = false;
  public filteredDocs: ICity[] = [];
  public searchTerm: string = '';
  selectedTask: string = '';
  searchText: string = '';

  uniqueSubTask: any[] = []
  unFlatternArr: any[] = [];
  existingTaskA: any;
  flatList: any
  subtask_len: any = [];
  real_len: any = [];

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
  // selectedTaskTable: Set<any> = new Set();
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
  projDefinationTable: any[] = [];
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
  validValueList: any[] = [];

  public activeIndices: number[] = []; // Change here
  subTasks: any[] = [];
  optionSubTASk: any[] = [];

  public accordionItems = [
    { title: 'Applicable approvals', content: 'Some placeholder content for the first accordion panel.' },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tostar: ToastrService,
    private router: Router,
    private credentialService: CredentialService,
    private cdRef: ChangeDetectorRef
  ) {

    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';
    if (navigation?.extras.state) {
      const RecursiveTaskData: any = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;


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
            console.log('this.taskData: ', this.taskData);
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

    if (this.taskData && this.taskData.mkey) {
      this.loading = true
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
      projAddress: [''],
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

  toggleAll(task: any = []) {

    if (this.selectAllChecked) {
      // Select all tasks when selectAllChecked is true
      this.selectedTasks.clear();
      this.selectedTasksId.clear();

      this.subTasks.forEach((task: any) => {
        this.selectedTasks.add(task);
        this.selectedTasksId.add(task?.TASK_NO?.TASK_NO);
      });
    } else if (!this.selectAllChecked) {

      this.selectedTasks.clear();
      this.selectedTasksId.clear();

      this.subTasks.forEach((task: any) => {
        this.selectedTasks.delete(task);
        this.selectedTasksId.delete(task?.TASK_NO?.TASK_NO);
      });
    }

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

        selectedTasksArray = [...this.selectedTasks, ...this.new_list_of_selectedSeqArr];
        const uniqueTasksArray = getUniqueTasks(selectedTasksArray);

        selectedTasksArray = [...uniqueTasksArray, ...this.new_list_of_selectedSeqArr];
      } else {
        selectedTasksArray = [...this.selectedTasks];
      }
    } else {
      selectedTasksArray = [...this.selectedTasks];
    }


    // console.log('selectedTasksArray: ', selectedTasksArray)

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

    const subtask_len = this.subTasks.length;
    const seq_len = this.selectedSeqArr.length;
    const remaining = subtask_len - seq_len
    const real_len = subtask_len - remaining


    this.subtask_len = subtask_len;
    this.real_len = real_len;

    // if(subtask_len === real_len){
    //   this.isAllSelectedCheck = true;
    //   // this.isAllSelectedCheck = this.selectAllChecked
    //   console.log("Checkbox should be unchecked:", this.isAllSelectedCheck);

    //   setTimeout(() => {
    //     this.cdRef.detectChanges();
    //   });
    // }else{

    //   this.isAllSelectedCheck = false;
    //   // this.isAllSelectedCheck = this.selectAllChecked
    //   console.log("Checkbox should be unchecked:", this.isAllSelectedCheck);
    //   setTimeout(() => {
    //     this.cdRef.detectChanges();
    //   });
    // }



    // Flatten tasks into a linear structure
    const flattenedTasks = this.breakToLinear(this.selectedSeqArr);

    const removeDup = this.removeDuplicates(this.selectedSeqArr)

    this.selectedSeqArr = removeDup;

    // console.log('this.selectedSeqArr', this.selectedSeqArr)

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
  }


  toggleSelection(task: any = []): void {


    const taskId = task?.TASK_NO?.TASK_NO;
    const selectedTask = task;


    // Toggle individual selection
    if (this.selectedTasksId.has(taskId)) {
      this.selectedTasksId.delete(taskId);
      this.selectedTasks.delete(task);
    } else {
      this.selectedTasksId.add(taskId);
      this.selectedTasks.add(task);
    }

    // Combine and deduplicate tasks
    let selectedTasksArray: any[];

    const updateTaskSelection = (task: any, isChecked: boolean) => {
      task.checked = isChecked;
      //console.log(`Updated task ${task.TASK_NO?.TASK_NO || 'subtask'} to ${isChecked}`);

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach((innerTask: any) => {
          updateTaskSelection(innerTask, isChecked);
        });
      }
    };

    // Utility function to count maiN_ABBR occurrences
    const getUniqueTasks = (tasksArray: any[]): any[] => {

      console.log('tasksArray unique list: ', tasksArray)
      const abbrCount = new Map();

      const countAbbr = (tasks: any[]) => {
        tasks.forEach((task: any) => {
          //console.log('task', task.TASK_NO)
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
            subtask: filterUniqueTasks(task.subtask), // Recursive filtering
          }));
      };

      countAbbr(tasksArray); // Step 1: Count
      return filterUniqueTasks(tasksArray); // Step 2: Filter
    };

    if (this.taskData?.mkey && !this.isCleared) {
      const status = this.taskData.approvalS_ABBR_LIST?.[0]?.status;

      //console.log('this.taskData.approvalS_ABBR_LIST: ', this.taskData.approvalS_ABBR_LIST)

      if (status === 'Initiated' || status === 'Ready to Initiate') {
        // console.log('Combining data', this.new_list_of_selectedSeqArr);

        // Merge, deduplicate, and filter for unique tasks
        selectedTasksArray = [...this.selectedTasks, ...this.new_list_of_selectedSeqArr];

        console.log('selectedTasksArray first', selectedTasksArray)

        for (let i = 0; i < selectedTasksArray.length; i++) {
          const task = selectedTasksArray[i];

          // Check if task.TASK_NO.TASK_NO exactly matches taskId
          if (task.TASK_NO.TASK_NO === taskId) {
            //task.checked = true; // Set checked to true if taskId matches
            console.log('Yes, task is checked!', selectedTask);
            updateTaskSelection(task, true);
            break; // Exit the loop once the task is found and processed
          } else {
            //task.checked = false; // Set unchecked for all other tasks
            console.log('No, task is unchecked!', selectedTask);
            updateTaskSelection(selectedTask, false);
          }
        }

        //console.log('selectedTasksArray: ',selectedTasksArray);
        const uniqueTasksArray = getUniqueTasks(selectedTasksArray);
        //console.log('uniqueTasksArray: ',uniqueTasksArray);

        console.log('new_list_of_selectedSeqArr: ', this.new_list_of_selectedSeqArr);
        console.log('uniqueTasksArray: ', uniqueTasksArray);
        console.log('selectedTasks: ', this.selectedTasks)

        
        selectedTasksArray = [...uniqueTasksArray, ...this.new_list_of_selectedSeqArr];

        console.log('final selectedTasksArray: ', selectedTasksArray);
      } else {
        // Only existing tasks
        selectedTasksArray = [...this.selectedTasks];
      }
    } else {
      selectedTasksArray = [...this.selectedTasks];
      if (selectedTasksArray.length > 0) {
        for (let i = 0; i < selectedTasksArray.length; i++) {
          const task = selectedTasksArray[i];
          // console.log(task)
          // console.log('task.TASK_NO.TASK_NO: ', task);
          // console.log('taskId : ', taskId);
          // console.log('this.selectedTasks ', this.selectedTasks);
          if (task.TASK_NO.TASK_NO === taskId) {
            // selectedTasksArray = []
            //console.log('selectedTasksArray if: ', selectedTasksArray);
            updateTaskSelection(task, true); // Use current task
          } else if (selectedTasksArray.length === 0 || task.TASK_NO.TASK_NO !== taskId) {
            // selectedTasksArray = []
            //console.log('selectedTasksArray else: ', selectedTasksArray);
            updateTaskSelection(selectedTask, false); // Use current task
          }
        }
      } else if (selectedTasksArray.length === 0) {
        console.log('coming to 0 selectedTaskArr: ', selectedTasksArray)
        updateTaskSelection(selectedTask, false); // Use current task
      }
    }

    // if(selectedTasksArray.length === 0){
    //     console.log('coming to 0 selectedTaskArr: ', selectedTasksArray)        
    //     updateTaskSelection(selectedTask, false); // Use current task
    // }

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

    // const subtask_len = this.subTasks.length;
    // const seq_len = this.selectedSeqArr.length;
    // const remaining = subtask_len - seq_len
    // const real_len = subtask_len - remaining


    // this.subtask_len = subtask_len;
    // this.real_len = real_len;

    // // if(subtask_len === real_len){
    // //   this.isAllSelectedCheck = true;
    // //   // this.isAllSelectedCheck = this.selectAllChecked
    // //   console.log("Checkbox should be unchecked:", this.isAllSelectedCheck);

    // //   setTimeout(() => {
    // //     this.cdRef.detectChanges();
    // //   });
    // // }else{

    // //   this.isAllSelectedCheck = false;
    // //   // this.isAllSelectedCheck = this.selectAllChecked
    // //   console.log("Checkbox should be unchecked:", this.isAllSelectedCheck);
    // //   setTimeout(() => {
    // //     this.cdRef.detectChanges();
    // //   });
    // // }



    // Flatten tasks into a linear structure
    const flattenedTasks = this.breakToLinear(this.selectedSeqArr);

    const removeDup = this.removeDuplicates(this.selectedSeqArr)

    this.selectedSeqArr = removeDup;

    // console.log('this.selectedSeqArr', this.selectedSeqArr)

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
    // this.updateSelectAllState();



  }


  toggleSelectedAndUnSelectedTask() { }

  updateSelectAllState() {
    this.selectAllChecked = !this.selectAllChecked;

    console.log('selectAll checkbox', this.selectAllChecked)

    const updateTaskSelection = (task: any, isChecked: boolean) => {
      task.checked = isChecked;

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach((innerTask: any) => {
          updateTaskSelection(innerTask, isChecked);
        });
      }
    };

    this.subTasks.forEach(task => {
      updateTaskSelection(task, this.selectAllChecked);
      // this.toggleSelection(task);
    });
  }


  isTaskDisabled(task: any): boolean {

    if (this.isCleared) {
      return false;
    }

    // console.log('approvalS_ABBR_LIST: ',this.taskData?.approvalS_ABBR_LIST[0]);
    // console.log('task: ', task)

    if (this.taskData?.approvalS_ABBR_LIST[0].status === 'Initiated' || this.taskData?.approvalS_ABBR_LIST[0].status === 'Ready to Initiate') {
      
      const savedTaskNos = this.taskData?.approvalS_ABBR_LIST.map((item: any) => item.approvaL_ABBRIVATION.trim());
      // console.log("Saved Task Numbers (Trimmed):", savedTaskNos);
      if (savedTaskNos.includes(task.TASK_NO?.maiN_ABBR.trim())) {
        return true;
      }
      return false;
    }
    return false;
  }

  isAllSelected(): boolean {
    return this.subTasks.every(task => task.selected);
  }

  toggleSelectAll(task: any): void {
    // Force `selected` to be a boolean (true or false)
    task.selected = task.selected !== undefined ? !task.selected : true;

    // Call the function to update selection state
    this.toggleSelection(task);
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

    const selectedTasksArray = [...this.tableData];

    if (selectedTasksArray.length > 0) {



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


  }


  disableInitiatedTask(task: any): boolean {
    // console.log('Task:', task);
    // console.log('Approval List:', this.taskData.approvalS_ABBR_LIST);
    return (
      this.taskData.approvalS_ABBR_LIST.some(
        (item: any) =>
          item.approvaL_ABBRIVATION === task.TASK_NO?.approvaL_ABBRIVATION &&
          item.status === 'Initiated'
      )
    );
  }


  hasInitiatedTasks(): boolean {
    return this.taskData?.approvalS_ABBR_LIST?.some((task: any) =>
      task.status?.toLowerCase() === 'initiated' || task.status?.toLowerCase() === 'ready to initiate'
    );
  }


  hasDisabledClear(): boolean {
    return this.taskData?.approvalS_ABBR_LIST?.some((task: any) =>
      task.status?.toLowerCase() === 'initiated'
    );
  }


  breakToLinear(selectedSeq: any) {

    const result: any[] = [];
    const flatten = (task: any) => {

      // console.log('task from breakToLinear',task)

      if (this.taskData && this.taskData.mkey) {
        result.push({
          headeR_MKEY: this.taskData.mkey,
          tasK_NO: task.TASK_NO.TASK_NO.trim(),
          dayS_REQUIRED: Number(task.TASK_NO.dayS_REQUIERD),
          approvaL_ABBRIVATION: task.TASK_NO.maiN_ABBR,
          approvaL_DESCRIPTION: task.TASK_NO.abbR_SHORT_DESC,
          resposiblE_EMP_MKEY: Number(task.TASK_NO.resposiblE_EMP_MKEY),
          tentativE_START_DATE: task.TASK_NO.start_date,
          tentativE_END_DATE: task.TASK_NO.end_date,
          department: task.TASK_NO.department_mkey,
          joB_ROLE: task.TASK_NO.joB_ROLE_mkey,
          approvaL_MKEY: task.TASK_NO.approvaL_MKEY,
          outpuT_DOCUMENT: task.TASK_NO.enD_RESULT_DOC,
          status: task.TASK_NO.status || 'created',
        });
      } else {
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
          approvaL_MKEY: task.TASK_NO.approvaL_MKEY,
          outpuT_DOCUMENT: task.TASK_NO.enD_RESULT_DOC,
          status: task.TASK_NO.status || 'created',
        });
      }

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach(flatten);
      }
    };

    selectedSeq.forEach(flatten);



    return result;
  }


  addProjectDef() {

    this.lodingTrue = true;

    // setTimeout(() => {
    //   this.lodingTrue = false;
    //   this.tostar.error('Something went wrong.');
    // }, 10000);

    const USER_CRED = this.credentialService.getUser();
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    const PROJECT = this.projectDefForm.get('property')?.value;
    const SUB_PROJECT = this.projectDefForm.get('subProject')?.value;

    const subTaskList = this.flatList;

    // console.log('uniq list', this.uniqList)
    // console.log('flatList list from add', this.flatList)

    // console.log('PROJECT', PROJECT)
    // console.log('SUB_PROJECT', SUB_PROJECT)

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

        if (addData.status === 'Error') {
          this.tostar.error('This project is already exist for same property and building');
          this.lodingTrue = false;

          return;
        }
        this.tostar.success('Success', 'Template added successfuly')
        this.router.navigate(['task/approval-screen'], { queryParams: { source: 'project-defination' } });

        this.lodingTrue = false;

      }, error: (error: ErrorHandler | any) => {

        this.lodingTrue = false;
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server')

      }
    });
  }


  updateProjectDef() {
    const USER_CRED = this.credentialService.getUser();
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const headerMkey = this.taskData.mkey

    // console.log('from update', this.sub_proj)

    // console.log('sub_project', this.taskData.projecT_NAME)
    // console.log('Project', this.taskData.property)

    const PROJECT = this.projectDefForm.get('property')?.value;
    // console.log('PROJECT.MASTER_MKEY', PROJECT.MASTER_MKEY)
    const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);

    const SUB_PROJECT = this.projectDefForm.get('subProject')?.value;
    //  console.log(SUB_PROJECT)

    const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJECT);

    const projectName = PROJECT?.MASTER_MKEY ? PROJECT.MASTER_MKEY : this.taskData?.property;
    const subProjectName = SELECTED_PROJ?.MASTER_MKEY ? SELECTED_PROJ.MASTER_MKEY : this.taskData?.projecT_NAME;


    let subTaskList = this.uniqList;
    subTaskList = this.breakToLinear(this.selectedSeqArr);

    const updateProjectDefination = {
      mkey: this.taskData.mkey,
      projecT_NAME: subProjectName,
      projecT_ABBR: this.projectDefForm.get('projectAbbr')?.value,
      property: projectName,
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

    console.log(updateProjectDefination);
    this.apiService.putProjectDefination(updateProjectDefination, headerMkey, this.recursiveLogginUser).subscribe({
      next: (addData: any) => {
        console.log('Data added successfully', addData)
        if (addData.status === 'Error') {
          this.tostar.error('Unable to update data');
          return;
        }
        this.tostar.success('Success', 'Template added successfuly')
        this.router.navigate(['task/approval-screen'], { queryParams: { source: 'project-defination' } });
      }, error: (error: ErrorHandler | any) => {
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server')
      }
    });
  }




  initiateToApprovalInitiation(approvalKey: any) {
    // console.log('approvalKey', approvalKey)
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const project_mkey = this.taskData.mkey
    const approval_mkey = this.taskData.approvalS_ABBR_LIST[0].approvaL_MKEY


    this.apiService.getApprovalInitiation(this.recursiveLogginUser, project_mkey, approvalKey).subscribe({
      next: (response) => {
        if (response) {
          this.navigateToApprovalInitiation(response.data);
        }
      },
      error: (error: ErrorHandler | any) => {
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server')
      }
    })
  }


  navigateToApprovalInitiation(apprInitData: any) {
    this.router.navigate(['approvals', 'approval-task-initiation', { Task_Num: apprInitData.MKEY }], { state: { taskData: apprInitData } });
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



  //   selectAll() {
  //     this.selectAllChecked = !this.selectAllChecked; 

  //     if (this.selectAllChecked) {
  //         console.log('Check the sub task from if');

  //         this.subTasks.forEach(task => {
  //             task.checked = true;
  //             this.toggleSelection(task);        
  //         });

  //     } else {
  //         console.log('Check the sub task from else');

  //         // Reset the arrays immediately
  //         this.ValueList = [];
  //         this.selectedSeqArr = [];
  //         this.flatList = [];

  //         // Uncheck all subTasks immediately
  //         this.subTasks.forEach(task => {
  //           console.log('Check the check box',task)
  //             task.checked = false; // Ensure each subtask is explicitly unchecked

  //             this.toggleSelection(task);
  //         });

  //         // Ensure selectAllChecked is false after updating all tasks
  //         // this.selectAllChecked = false;
  //     }
  // }


  // selectAll() {
  //   this.selectAllChecked = !this.selectAllChecked;

  //   if (this.selectAllChecked) {
  //     console.log('Checking all subtasks...');

  //     this.subTasks.forEach(task => {
  //       task.checked = true;
  //       if (task.subtask && task.subtask.length > 0) {
  //         task.subtask.forEach((innerTask: any) => {  
  //           innerTask.checked = true;
  //         });
  //       }
  //       this.toggleSelection(task);
  //     });

  //   } else {
  //     console.log('Unchecking all subtasks...');

  //     // Clear selection lists
  //     this.ValueList = [];
  //     this.selectedSeqArr = [];
  //     this.flatList = [];

  //     this.subTasks.forEach(task => {
  //       task.checked = false;
  //       if (task.subtask && task.subtask.length > 0) {
  //         task.subtask.forEach((innerTask: any) => {
  //           innerTask.checked = false;
  //         });
  //       }
  //       this.toggleSelection(task);
  //     });
  //   }

  //   // Force Angular to detect changes
  //   // this.cdr.detectChanges();
  // }







  selectAll() {
    this.selectAllChecked = !this.selectAllChecked;

    const updateTaskSelection = (task: any, isChecked: boolean) => {
      task.checked = isChecked;

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach((innerTask: any) => {
          updateTaskSelection(innerTask, isChecked);
        });
      }
    };
    if (this.selectAllChecked) {
      const newTasks = this.selectedSeqArr.filter(task =>
        !this.subTasks.some(subTask => {
          return subTask.TASK_NO.TASK_NO === task.TASK_NO.TASK_NO; // Add explicit return
        })
      );

      this.selectedSeqArr = [...this.subTasks, ...newTasks];
    }

    this.subTasks.forEach(task => {
      updateTaskSelection(task, this.selectAllChecked);
      this.toggleAll(task);
    });

    this.cdRef.detectChanges();
  }

  // selectAll() {
  //   this.selectAllChecked = !this.selectAllChecked;

  // //   if (!this.selectAllChecked) {
  // //     this.selectedSeqArr = [];
  // // }


  //   const updateTaskSelection = (task: any, isChecked: boolean) => {
  //       task.checked = isChecked;

  //       if (task.subtask && task.subtask.length > 0) {
  //           task.subtask = task.subtask.filter((innerTask:any) =>
  //               !this.selectedSeqArr.some(sel => sel.TASK_NO === innerTask.TASK_NO)
  //           );

  //           task.subtask.forEach((innerTask: any) => {
  //               updateTaskSelection(innerTask, isChecked);
  //           });
  //       }
  //   };

  //   // Filter top-level tasks
  //   const check = this.subTasks.filter(task =>
  //     //console.log('Check task m',task)
  //      !this.selectedSeqArr.some(sel => {
  //         console.log('Check task m',sel)
  //         sel.TASK_NO === task.TASK_NO
  //       }
  //     )
  //   );

  //   console.log('check', check)
  //   console.log('Subtask: ', this.subTasks);
  //   console.log('Check the selected task: ', this.selectedSeqArr);

  //   this.subTasks.forEach(task => {
  //       updateTaskSelection(task, this.selectAllChecked);
  //       this.toggleSelection(task);
  //   });

  //   this.cdRef.detectChanges();
  // }


  clearAllProjects() {
    const updateTaskSelection = (task: any, isChecked: boolean) => {
      task.checked = isChecked;

      if (task.subtask && task.subtask.length > 0) {
        task.subtask.forEach((innerTask: any) => {
          updateTaskSelection(innerTask, isChecked);
        });
      }
    };

    this.subTasks.forEach(task => {
      updateTaskSelection(task, false);
      this.toggleSelection(task);
    });
    // this.selectAllChecked = false;
    this.cdRef.detectChanges();
    // this.selectedSeqArr = [];
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
      const token = this.apiService.getRecursiveUser();

      this.apiService.getProjectDetailsNew(token).subscribe(
        (response: any) => {
          const project = response[0].data;

          const matchedProject = project.find((property: any) =>

            property.MASTER_MKEY === this.taskData.property
          );

          const matchedSubProject = this.sub_proj.find((building: any) =>
            building.MASTER_MKEY === Number(this.taskData.projecT_NAME)
          );

          if (matchedProject) {
            this.taskData.project_Name = matchedProject.TYPE_DESC;
          } else {
            console.log('No matching project found for MASTER_MKEY:', this.taskData.property);
          }

          if (matchedSubProject) {
            this.taskData.sub_proj_name = matchedSubProject.TYPE_DESC;
          } else {
            console.log('No matching sub-project found for MASTER_MKEY:', this.taskData.projecT_NAME);
          }
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error occurred while fetching projects');
        }
      );
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


  openSelectedTask(mkey: any) {
    this.router.navigate(['task', 'selected-task-info', { Task_Num: (mkey) }]);
  }

  getOptionList() {

    const token = this.apiService.getRecursiveUser();
    const USER_CRED = this.credentialService.getUser();

    const buildingCla = this.projectDefForm.get('bldCla')?.value;
    const buildingStd = this.projectDefForm.get('blsStandard')?.value;
    const statutoryAuth = this.projectDefForm.get('statutoryAuth')?.value;

    if (buildingCla && buildingStd && statutoryAuth) {
      this.recursiveLogginUser = this.apiService.getRecursiveUser();
      this.apiService.projectDefinationOption(USER_CRED[0]?.MKEY, token, buildingCla, buildingStd, statutoryAuth).subscribe({
        next: (gerAbbrRelData) => {
          this.getTree(gerAbbrRelData);
           console.log('gerAbbrRelData', gerAbbrRelData)
          this.isLoading = false;
        },
        error: (error) => {
          // console.log('error.status',error.error.status)
          if (error.error && error.error.status === 404) {
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



  selectedOptionList() {

    // console.log('selectedOptionList come here')
    const token = this.apiService.getRecursiveUser();
    const USER_CRED = this.credentialService.getUser();

    const buildingCla = this.taskData.buildinG_CLASSIFICATION;
    const buildingStd = this.taskData.buildinG_STANDARD;
    const statutoryAuth = this.taskData.statutorY_AUTHORITY;

    if (buildingCla && buildingStd && statutoryAuth) {
      this.recursiveLogginUser = this.apiService.getRecursiveUser();
      this.apiService.projectDefinationOption(USER_CRED[0]?.MKEY, token, buildingCla, buildingStd, statutoryAuth).subscribe({
        next: (gerAbbrRelData) => {

          //console.log('Selected Project def data',gerAbbrRelData)
          const newTasks = gerAbbrRelData.map((task: any) => {
            const newTask = {
              HEADER_MKEY: task.HEADER_MKEY,
              SEQ_NO: task.TASK_NO,
              TASK_NO: task.TASK_NO,
              MAIN_ABBR: task.MAIN_ABBR,
              ABBR_SHORT_DESC: task.ABBR_SHORT_DESC,
              DAYS_REQUIERD: task.DAYS_REQUIERD,
              AUTHORITY_DEPARTMENT: task.AUTHORITY_DEPARTMENT,
              END_RESULT_DOC: task.END_RESULT_DOC,
              JOB_ROLE: task.JOB_ROLE,
              SUBTASK_PARENT_ID: task.SUBTASK_PARENT_ID,
              RESPOSIBLE_EMP_MKEY: task.RESPOSIBLE_EMP_MKEY,
              LONG_DESCRIPTION: task.LONG_DESCRIPTION,
              Status: task.Status,
              Message: task.Message
            };
            return newTask;
          });

          this.isLoading = false;

          //console.log('Selected Project def data',gerAbbrRelData)

          // console.log('After looping of Proj Def',newTasks);
          if (!this.isCleared) { // Only call getTree if not cleared
            this.projDefinationTable = gerAbbrRelData

            // console.log('selectedOptionList', gerAbbrRelData)
            this.getTree(gerAbbrRelData);
          }

        },
        error: (error: any) => {
          console.log('error.status', error.error.status)
          if (error.status === 404) {
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

    // this.taskData.buildinG_CLASSIFICATION =  null,
    // this.taskData.buildinG_STANDARD = null,
    // this.taskData.statutorY_AUTHORITY = null

    this.subTasks = [];
    this.ValueList = [];
    this.selectedSeqArr = [];
    this.flatList = [];
    this.selectedTasksId = new Set();
    this.isCleared = true; // Set clear flag
    console.log('Clear action executed.');
    this.tostar.success('Cleared successfully');
    this.isLoading = true
  }

  reset() {
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


  isSelectedNew(task: any): boolean {
    return this.selectedTasksId.has(task.TASK_NO.TASK_NO);
  }



  isSelected(task: any): boolean {
    return this.selectedTasksId.has(task.TASK_NO.TASK_NO);
  }

  isTaskInSavedList(task: any): boolean {
    if (this.isCleared) {
      return false;
    }

    if (this.taskData?.approvalS_ABBR_LIST[0].status === 'Initiated' || this.taskData?.approvalS_ABBR_LIST[0].status === 'Ready to Initiate') {
      const savedTaskNos = this.taskData?.approvalS_ABBR_LIST.map((item: any) => item.maiN_ABBR);

      return savedTaskNos.includes(task.TASK_NO?.maiN_ABBR);
    }

    return false;
  }



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

        response[0]?.data.forEach((emp: any) => {
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
      (error: ErrorHandler | any) => {
        console.error('Error fetching employee details:', error);
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server')
      }
    );
  }

  // convertTaskNo(tasks: any[], selectedTask?:any[]): any[] {
    
  //   const parentTaskCount = new Map<number, number>();
  //   const taskNumbers = new Map<number, string>();

  //   // Step 1: Organize tasks by parent ID
  //   const taskMap = new Map<number, any[]>();
  //   tasks.forEach((task) => {
  //     if (!taskMap.has(task.SUBTASK_PARENT_ID)) {
  //       taskMap.set(task.SUBTASK_PARENT_ID, []);
  //     }
  //     taskMap.get(task.SUBTASK_PARENT_ID)?.push(task);
  //     //console.log('Check Map',taskMap)
  //   });

  //   let task_list = this.taskData.approvalS_ABBR_LIST;
  //   // Step 2: Recursive function to assign TASK_NO, In this it will assign the 
  //   function assignTaskNumbers(parentId: number, prefix = "") {

  //     if (!taskMap.has(parentId)) return;

  //     let count = 1;
  //     for (const task of taskMap.get(parentId)!) {
  //                 console.log('task_list: ', task_list)
  //       const taskNo = prefix ? `${prefix}.${count}` : `${count}`;
  //       task.TASK_NO = taskNo;
  //        console.log('taskNo: ', taskNo)
  //       taskNumbers.set(task.HEADER_MKEY, taskNo);
  //       parentTaskCount.set(task.HEADER_MKEY, 0);
  //       count++;

  //       // Recursively process subtasks
  //       assignTaskNumbers(task.HEADER_MKEY, taskNo);
  //     }
      
  //   }


  //   // Step 3: Assign numbers starting from top-level parents (SUBTASK_PARENT_ID = 0)
  //   assignTaskNumbers(0);

  //   // console.log("Check the task from convertTaskNo", tasks);
  //   return tasks;
  // }


  // convertTaskNo(tasks: any[]): any[] {

  //   const parentTaskCount = new Map<number, number>();
  //   const taskNumbers = new Map<number, string>();


  //   return tasks.map((task: any) => {


  //     // console.log('task', task)
  //     let newTaskNo = '';

  //     if (task.SUBTASK_PARENT_ID === 0) {
  //       const count = parentTaskCount.get(0) || 0;
  //       newTaskNo = (count + 1).toString();
  //       parentTaskCount.set(0, count + 1);
  //     } else {
  //       const parentTaskNo = taskNumbers.get(task.SUBTASK_PARENT_ID);

  //       if (parentTaskNo) {

  //         const count = parentTaskCount.get(task.SUBTASK_PARENT_ID) || 0;

  //         newTaskNo = `${parentTaskNo}.${count + 1}`;
  //         parentTaskCount.set(task.SUBTASK_PARENT_ID, count + 1);
  //       }else{
  //         newTaskNo = `${parentTaskNo}`;

  //       }
  //     }

  //     task.TASK_NO = newTaskNo;

  //     taskNumbers.set(task.HEADER_MKEY, newTaskNo);


  //     return task;
  //   });
  // }

  //   convertTaskNo(tasks: any[]): any[] {
  //     const parentTaskCount = new Map<number, number>(); 
  //     const taskNumbers = new Map<number, string>(); 
  //     const processedTasks = new Set<number>(); 

  //     tasks.sort((a, b) => a.SUBTASK_PARENT_ID - b.SUBTASK_PARENT_ID);

  //     return tasks.map((task: any) => {
  //         let newTaskNo = '';

  //         // If task has no parent (parent task)
  //         if (task.SUBTASK_PARENT_ID === 0) {
  //             const count = parentTaskCount.get(0) || 0;
  //             newTaskNo = (count + 1).toString();
  //             parentTaskCount.set(0, count + 1);
  //         } else {
  //             // Ensure the parent task is processed before its children
  //             let parentTaskNo = taskNumbers.get(task.SUBTASK_PARENT_ID);

  //             console.log('parentTaskNo: ', parentTaskNo)
  //             // If the parent task is not processed yet, return an empty task number for now
  //             // In this if parent is not 0 then it will take the new parent_id instead of 0 or natural number
  //             if (parentTaskNo) {
  //                 const count = parentTaskCount.get(task.SUBTASK_PARENT_ID) || 0;
  //                 newTaskNo = `${parentTaskNo}.${count + 1}`;
  //                 parentTaskCount.set(task.SUBTASK_PARENT_ID, count + 1);
  //             } else {
  //                 // If parent task is not found, this could be an invalid or circular reference
  //                 console.warn(`Parent task with ID ${task.SUBTASK_PARENT_ID} not found for task ${task.HEADER_MKEY}`);
  //                 newTaskNo = `${parentTaskNo}`;
  //             }
  //         }

  //         task.TASK_NO = newTaskNo;
  //         taskNumbers.set(task.HEADER_MKEY, newTaskNo);
  //         processedTasks.add(task.HEADER_MKEY);

  //         return task;
  //     });
  // }


convertTaskNo(tasks: any[], selectedTask?:any[]): any[] {
    
    const parentTaskCount = new Map<number, number>();
    const taskNumbers = new Map<number, string>();

    // Step 1: Organize tasks by parent ID
    const taskMap = new Map<number, any[]>();
    tasks.forEach((task) => {
      if (!taskMap.has(task.SUBTASK_PARENT_ID)) {
        taskMap.set(task.SUBTASK_PARENT_ID, []);
      }
      taskMap.get(task.SUBTASK_PARENT_ID)?.push(task);
      //console.log('Check Map',taskMap)
    });

    let task_list = this.taskData.approvalS_ABBR_LIST;
    // Step 2: Recursive function to assign TASK_NO, In this it will assign the 
    // function assignTaskNumbers(parentId: number, prefix = "") {

    //   if (!taskMap.has(parentId)) return;

    //   let count = 1;
    //   for (const task of taskMap.get(parentId)!) {
    //               console.log('task_list: ', task_list)
    //                console.log('task: ', task)
    //     const taskNo = prefix ? `${prefix}.${count}` : `${count}`;
    //     task.TASK_NO = taskNo;
        
    //     taskNumbers.set(task.HEADER_MKEY, taskNo);
    //     parentTaskCount.set(task.HEADER_MKEY, 0);
    //     count++;

    //     // Recursively process subtasks
    //     assignTaskNumbers(task.HEADER_MKEY, taskNo);
    //   }
      
    // }

      function assignTaskNumbers(parentId: number, prefix = "") {
  if (!taskMap.has(parentId)) return;

  let count = 1;
  for (const task of taskMap.get(parentId)!) {
    const taskNo = prefix ? `${prefix}.${count}` : `${count}`;
    task.TASK_NO = taskNo;

    taskNumbers.set(task.HEADER_MKEY, taskNo);
    parentTaskCount.set(task.HEADER_MKEY, 0);

    console.log('task_list: ', task_list)
    // ✅ Match approvaL_MKEY from task_list with SUBTASK_PARENT_ID and update task.TASK_NO
    const matchingAbbrTask = task_list.find((t:any) => t.approvaL_MKEY === task.SUBTASK_PARENT_ID);
    console.log('Check matchingAbbrTask: ', matchingAbbrTask)
    if (matchingAbbrTask && matchingAbbrTask.tasK_NO) {
      console.log(`Replacing TASK_NO for HEADER_MKEY ${task.HEADER_MKEY} with ${matchingAbbrTask.tasK_NO}`);
      task.TASK_NO = `${matchingAbbrTask.tasK_NO}.${count}`;
    }

    count++;
    assignTaskNumbers(task.HEADER_MKEY, task.TASK_NO);
  }
}



    // Step 3: Assign numbers starting from top-level parents (SUBTASK_PARENT_ID = 0)
    assignTaskNumbers(0);

    // console.log("Check the task from convertTaskNo", tasks);
    return tasks;
  }




  removeDuplicates(array: any[]): any[] {
    // Remove duplicates using a Set or custom logic
    return Array.from(new Set(array.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
  }

  async getTree(optionList: any[] = [], _jobRoleList: any[] = [], _departmentList: any[] = []) {

    // console.log('optionList', optionList)


    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    let department_new: any;
    let jobRole_new: any;

    try {
      // First fetch department data
      department_new = await this.apiService.getDepartmentDP(this.recursiveLogginUser).toPromise();

      // Then fetch job role data
      jobRole_new = await this.apiService.getJobRoleDP(this.recursiveLogginUser).toPromise();

      //console.log('jobRole_new tree: ', jobRole_new)
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    const check_convert_task = this.convertTaskNo(optionList);

    // console.log('check_convert_task', check_convert_task)

    const jobRoleList = jobRole_new;
    const departmentList = department_new

    // const combinedList = [...optionList];


    //optionList;

    // console.log('uniqueList', uniqueList)


    // this.taskData.approvalS_ABBR_LIST
    const optionListArr = optionList
      .filter((item: any) => item.tasK_NO !== null)
      .map((item: any) => {

         //console.log('Item', item.JOB_ROLE)
         //console.log('jobRoleList: ', jobRoleList)

        const jobRole = jobRoleList.find((role: any) => role.mkey === parseInt(item.JOB_ROLE));
        const departmentRole = departmentList.find((department: any) => department.mkey === parseInt(item.AUTHORITY_DEPARTMENT))

        //console.log('jobRole: ', jobRole)

        if(!jobRole || !departmentRole){
          this.tostar.error('Unable to find job role or department ID')
        }
        const assignedEmployee = this.employees.find(employee => employee.MKEY === parseInt(item.RESPOSIBLE_EMP_MKEY));

        return {
          TASK_NO: item.TASK_NO,
          seQ_NO: item.seQ_NO,
          maiN_ABBR: item.MAIN_ABBR,
          abbR_SHORT_DESC: item.ABBR_SHORT_DESC,
          dayS_REQUIERD: item.DAYS_REQUIERD,
          enD_RESULT_DOC: item.END_RESULT_DOC,
          joB_ROLE: jobRole ? jobRole.typE_DESC : "Not found",
          joB_ROLE_mkey: jobRole.mkey || 0,
          department: departmentRole ? departmentRole.typE_DESC : "Not found",
          department_mkey: departmentRole.mkey,
          approvaL_MKEY: item.HEADER_MKEY,
          // tasK_STATUS:item.tasK_STATUS,
          task_MKEY: item.task_MKEY,
          // resposiblE_EMP: assignedEmployee.Assign_to,
          resposiblE_EMP_MKEY: item.RESPOSIBLE_EMP_MKEY
        }
      });

    this.loading = true;

    const same_data = optionListArr;

    //  console.log('optionListArr', optionListArr)

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
            visible: false,
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
        visible: false,
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

    // console.log('subTasks from parents: ',this.subTasks)

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
          // console.log(`Found Parent Task: ${parentTask.TASK_NO.TASK_NO}`);
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
    // console.log('filteredTasks', filteredTasks)

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

        addControlError(formattedControlName);
      }
    });

    if (requiredControls.length > 0) {
      const errorMessage = `${requiredControls.join(' , ')}`;
      console.log('errorMessage: ', errorMessage)
      this.tostar.error(errorMessage);
      return;  // Stop further processing
    }

    // Check subtask list for missing dates
    const subTaskList = this.uniqList;

    if (subTaskList && subTaskList.length > 0) {
      const invalidSubTask = subTaskList.find((subTask) => {
        return !subTask.tentativE_START_DATE || !subTask.tentativE_END_DATE;
      });



      // if (invalidSubTask) {
      //   this.tostar.error('Missing tentative start or end date for a subtask');
      //   return;
      // }

      // const invalidDateSubTask = this.validateTaskDates(subTaskList);

      // if (invalidDateSubTask) {
      //   return;  
      // }
    }

    // console.log('subTaskList', subTaskList)

    const selectedSeqArr = this.selectedSeqArr;
    const uniqList = this.uniqList;
    const flatList = this.breakToLinear(selectedSeqArr);

    this.flatList = flatList
    // console.log('uniqList', uniqList);
    // console.log('flatList', flatList);

    // if (uniqList.length === 0 && flatList.length > 0) {
    //   this.tostar.error('Missing tentative start or end date for a subtask');
    //   return;
    // }

    const invalidDateSubTask = subTaskList.some((task) => {
      const startDate = new Date(task.tentativE_START_DATE);
      const endDate = new Date(task.tentativE_END_DATE);

      // if (startDate > endDate) {
      //   this.tostar.error(`Task ${task.tasK_NO}: Start date cannot be greater than end date.`);
      //   return true;
      // }
      return false;
    });

    if (invalidDateSubTask) {
      return;
    }
    return true;
  }

  // validateTaskDates(subTaskList: any[]): boolean {
  //   console.log('subTaskList', subTaskList)
  //   subTaskList.sort((a, b) => a.tasK_NO.localeCompare(b.tasK_NO));

  //   for (let i = 0; i < subTaskList.length; i++) {
  //     const task = subTaskList[i];
  //     const startDate = new Date(task.tentativE_START_DATE);
  //     const endDate = new Date(task.tentativE_END_DATE);

  //     const isParent = !task.tasK_NO.includes('.');
  //     if (isParent) {
  //       const childTask = subTaskList.find(child => child.tasK_NO.startsWith(task.tasK_NO + '.') && new Date(child.tentativE_END_DATE) > endDate);

  //       if (childTask) {
  //         this.tostar.error(`End date of parent task (${task.tasK_NO}) should be greater than child task (${childTask.tasK_NO})`);
  //         return true;  // Exit on first error
  //       }
  //     }

  //     if (i === 0) {
  //       const position1EndDate = new Date(task.tentativE_END_DATE);

  //       for (let j = 1; j < subTaskList.length; j++) {
  //         const otherTask = subTaskList[j];
  //         const otherEndDate = new Date(otherTask.tentativE_END_DATE);
  //         if (otherEndDate > position1EndDate) {
  //           this.tostar.error(`End date of task (${task.tasK_NO}) should be greater than ${otherTask.tasK_NO}`);
  //           return true;
  //         }
  //       }
  //     }
  //   }

  //   return false;  // All checks passed
  // }

  // validateTaskDates(subTaskList: any[]): boolean {
  //   console.log('subTaskList', subTaskList);

  //   // Sort task list by task number using a numeric comparison (split by dots).
  //   subTaskList.sort((a, b) => {
  //     const taskNoA = a.tasK_NO.split('.').map(Number);
  //     const taskNoB = b.tasK_NO.split('.').map(Number);

  //     for (let i = 0; i < Math.max(taskNoA.length, taskNoB.length); i++) {
  //       if ((taskNoA[i] || 0) < (taskNoB[i] || 0)) return -1;
  //       if ((taskNoA[i] || 0) > (taskNoB[i] || 0)) return 1;
  //     }
  //     return 0;
  //   });

  //   // Iterate over each task
  //   for (let i = 0; i < subTaskList.length; i++) {
  //     const task = subTaskList[i];
  //     const startDate = new Date(task.tentativE_START_DATE);
  //     const endDate = new Date(task.tentativE_END_DATE);

  //     const isParent = !task.tasK_NO.includes('.'); // Check if the task is a parent task.

  //     if (isParent) {
  //       // Check for child task with a later end date than the parent task's end date
  //       const childTask = subTaskList.find(child =>
  //         child.tasK_NO.startsWith(task.tasK_NO + '.') && new Date(child.tentativE_END_DATE) > endDate
  //       );

  //       if (childTask) {
  //         this.tostar.error(`End date of parent task (${task.tasK_NO}) should be greater than child task (${childTask.tasK_NO})`);
  //         return true;  // Exit on first error
  //       }
  //     }

  //     // Additional validation for task date relationships (first task comparison)
  //     if (i === 0) {
  //       const position1EndDate = new Date(task.tentativE_END_DATE);

  //       for (let j = 1; j < subTaskList.length; j++) {
  //         const otherTask = subTaskList[j];
  //         const otherEndDate = new Date(otherTask.tentativE_END_DATE);

  //         if (otherEndDate > position1EndDate) {
  //           this.tostar.error(`End date of task (${task.tasK_NO}) should be greater than ${otherTask.tasK_NO}`);
  //           return true;  // Exit on first error
  //         }
  //       }
  //     }
  //   }

  //   return false;  // All checks passed
  // }


  onAddProjDef() {
    const isValid = this.onSubmit();

    if (isValid) {

      this.addProjectDef();
      // this.tostar.success('Success', 'Template added successfuly')
    } else {
      console.log('Form is invalid, cannot add template');
    }
  }


  onUpdateProjDef() {
    const isValid = this.onSubmit();

    if (isValid) {

      this.updateProjectDef();
      // this.tostar.success('Success', 'Template added successfuly')
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



  newEmps() {
    let employeesList: any
    const token = this.apiService.getRecursiveUser();;

    employeesList = this.apiService.getEmpDetailsNew(token).toPromise();

    // console.log('employeesList', employeesList)

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

    this.convertTaskNo(this.taskData.approvalS_ABBR_LIST, this.taskData.approvalS_ABBR_LIST);


    let department_new: any;
    let jobRole_new: any;

    try {
      department_new = await this.apiService.getDepartmentDP(this.recursiveLogginUser).toPromise();
      jobRole_new = await this.apiService.getJobRoleDP(this.recursiveLogginUser).toPromise();

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    const jobRoleList = jobRole_new;
    //console.log('jobRoleList: ', jobRoleList)
    const departmentList = department_new

    // console.log('Item: ',  this.taskData.approvalS_ABBR_LIST);


    const optionListArr = this.taskData.approvalS_ABBR_LIST
      .filter((item: any) => item.tasK_NO !== null)
      .map((item: any) => {


        // console.log("item.resposiblE_EMP_MKEY:", item.resposiblE_EMP_MKEY);
        const jobRole = jobRoleList.find((role: any) => role.mkey === parseInt(item.joB_ROLE));
        const departmentRole = departmentList.find((department: any) => department.mkey === parseInt(item.department));

        // console.log('jobRole: ', jobRole)
        // console.log('Item',item)

        return {
          TASK_NO: item.tasK_NO,
          seQ_NO: item.seQ_NO,
          maiN_ABBR: item.approvaL_ABBRIVATION,
          abbR_SHORT_DESC: item.approvaL_DESCRIPTION,
          dayS_REQUIERD: item.dayS_REQUIRED,
          enD_RESULT_DOC: item.outpuT_DOCUMENT,
          joB_ROLE: jobRole ? jobRole.typE_DESC : "Not found",
          joB_ROLE_mkey: jobRole.mkey || 0,
          department: departmentRole ? departmentRole.typE_DESC : "Not found",
          department_mkey: departmentRole.mkey,
          start_date: item.tentativE_START_DATE,
          end_date: item.tentativE_END_DATE,
          approvaL_MKEY: item.approvaL_MKEY,
          status: item.status,
          tasK_STATUS: item.tasK_STATUS,
          task_MKEY: item.mkey,
          resposiblE_EMP: item.resposiblE_EMP_NAME,
          resposiblE_EMP_MKEY: item.resposiblE_EMP_MKEY
        }
      });

    //  console.log('Updated optionListArr with typE_DESC getTree_new:', optionListArr);

    this.loading = true;

    const same_data = optionListArr;
    const noSubParentTasks: any = []

    const allRootTaskNumbersInHierarchy = this.subTasks.map((subtask: any) => subtask.TASK_NO.TASK_NO.split('.')[0]);

    same_data.forEach((task: any) => {

      const taskRootNo = task.TASK_NO.split('.')[0];
      if (!allRootTaskNumbersInHierarchy.includes(taskRootNo)) {
        noSubParentTasks.push(task);
      }
    });

    this.loading = false;


    this.new_list_of_selectedSeqArr = this.subTasks
    // this.selectedSeqArr = [...this.optionSubTASk]

    this.noParentTree_new(noSubParentTasks)
  }





  noParentTree_new(noParentTree?: any) {


    const no_parent_arr = noParentTree.map((item: any) => ({
      TASK_NO: item,
      subtask: [],
      visible: false
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
            visible: false
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

    this.subTasks = [...this.subTasks];
    this.selectedSeqArr = [...filteredTasks, ...this.subTasks];

    // console.log('selectedSeqArr noParentTree_new', this.selectedSeqArr)
    // this.selectedSeqArr = [...this.subTasks]

    this.new_list_of_selectedSeqArr = this.selectedSeqArr
    this.loading = false;


  }


  navigateToProjectDefination() {
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'project-defination' } });
  }

  ngOnDestroy(): void {
    console.log('Component is being destroyed');

    sessionStorage.removeItem('task');
  }
}
