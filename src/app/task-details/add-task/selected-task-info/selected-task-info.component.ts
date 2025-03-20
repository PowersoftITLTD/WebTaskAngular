import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-selected-task-info',
  templateUrl: './selected-task-info.component.html',
  styleUrls: ['./selected-task-info.component.css']
})

export class SelectedTaskInfoComponent implements OnInit {


  @Input() loggedInUser: any;

  category: any = [];
  project: any = [];
  sub_proj: any = [];
  status: any = [];
  allTags: any[] = [];


  compDate:any
  
  taskForm: FormGroup | any;
  ma: boolean = false;
  showCalendarPicker: boolean = false;
  formattedDate: string | any;

  NewTaskOrSubTask: string = '';
  receivedUser: any;
  selectedProject: any;

  taskDetails: any;

  filteredEmployees: any[] = [];
  employees: any[] = [];
  selectedTags: [] = [];

  isDisabled: boolean = false;

  emp_ID: number | any
  assignedEmp: any;
  task: any;

  //file upload
  file: File | any;
  taskParentId: any;
  taskMainNodeId: any;
  mkey: any;

  editMode: boolean = false;
  isSelectDisabled: boolean = false;

  showAddSubTaskButton: boolean = false;
  showSaveSubTaskButton: boolean = false;
  hideSaveLogggedUser: boolean = true

  selectedTab: string = 'actionable';

  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private tostar: ToastrService,
    private dataService: CredentialService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.taskDetails = [];
  }


  ngOnInit(): void {    
    this.fetchProjectData();
    this.fetchEmployeeName();
    this.initializeForm();
    this.fetchCategoryData();
    this.getTags();
    this._getSelectedTaskDetails();
  }


  onDateChange(event: any): void {
    const selectedDate = event.target.value;  // Get the selected date from the event
    this.taskForm.get('completionDate')?.setValue(selectedDate);  // Update the form control with the selected date
  }

  shouldDisableSelect(): boolean {
    const loggedInUser = this.loggedInUser;
    const taskCreatedBy = this.taskDetails[0]?.TASK_CREATED_BY;
    const editMode = this.editMode;

    // Logic to determine if select should be disabled
    return loggedInUser && this.taskDetails[0] && loggedInUser[0]?.MKEY !== taskCreatedBy && !editMode;
  }


  _getSelectedTaskDetails() {
    this.route.params.subscribe(params => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();
        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {

          this.taskDetails = response[0]?.data;


          // console.log('COMPLETION_DATE:', this.taskDetails[0]?.COMPLETION_DATE);


          // console.log('taskDetails', response[0]?.data)

          // console.log('this.taskDetails[0]?.PROJECT_MKEY', this.taskDetails[0])

          this.apiService.getSubProjectDetailsNew(this.taskDetails[0]?.PROJECT_MKEY.toString(), token).subscribe(
            (response: any) => {
              this.sub_proj = response[0].data;
              // console.log('this.sub_proj',this.sub_proj)                                  
            },
            (error: ErrorHandler) => {
              console.log(error, 'Error Occurred while fetching sub-projects');
            }
          );

          this.taskForm.patchValue({
            completionDate: this.taskDetails[0].COMPLETION_DATE
          });

          

          if (response[0]?.data.length > 0 && response[0].data[0]?.TAGS !== null) {
            const tagsArray = response[0]?.data[0].TAGS.split(',');
            this.selectedTags = tagsArray;
          } else {
            this.selectedTags = [];
          }
        });
      }
    });
  }
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`; // 'yyyy-MM-dd' format
  }
  
  
  
  canEditTaskDescription(): boolean {
    if (this.loggedInUser && this.taskDetails[0]) {
      return this.loggedInUser[0]?.MKEY === this.taskDetails[0].TASK_CREATED_BY || this.editMode;
    }
    return false;
  }

  sameOwnerDisable(): boolean {
    return this.taskDetails.length > 0 && this.taskDetails[0].TASK_CREATED_BY === this.loggedInUser[0]?.MKEY && this.taskDetails[0].RESPOSIBLE_EMP_MKEY !== this.loggedInUser[0]?.MKEY;
  }


  statusDisabled(): boolean {
    if (this.taskDetails && this.taskDetails.length > 0 && this.taskDetails[0]) {
      return (
        this.taskDetails[0].STATUS === 'COMPLETED' ||
        this.taskDetails[0].STATUS === 'CANCELLED' ||
        this.taskDetails[0].STATUS === 'CANCEL'
      );
    } else {
      return false;
    }
  }

  assignToItself() {
    return this.taskDetails[0].CAREGORY === 'PRIVATE' && this.loggedInUser[0]?.MKEY === this.taskDetails[0].TASK_CREATED_BY
  }


  _showAddSubTaskButton() {
    this.selectedTab = 'taskInfo'
    this.showAddSubTaskButton = true
    this.editMode = true;

    if (this.taskDetails.length > 0) {
      this.taskDetails[0].EMP_FULL_NAME = '';
    }
  }

  shouldDisplayReadOnly(): boolean {
    return this.taskDetails[0]?.CATEGORY === 'PRIVATE' && !!this.taskDetails[0]?.EMP_FULL_NAME.toLowerCase() || !this.canEditTaskDescription();
  }



  getSelectedTaskDetails(mkey: string, tokecn:string) {
    const token = this.apiService.getRecursiveUser();

    return this.apiService.getSelectedTaskDetailsNew(mkey, token);
  }


  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      taskDescription: ['', [Validators.required]],
      category: ['', Validators.required],
      project: [''],
      subProject: [''],
      completionDate: ['', Validators.required],
      assignedTo: ['', Validators.required],
      tags: [],
    });
  }

  fetchEmpID() {
    const token = this.apiService.getRecursiveUser();;

    this.apiService.getEmpDetailsNew(token).subscribe(
      (data: any) => {
        this.emp_ID = data;
        const empObj = this.emp_ID.find((e: any) => e.MKEY == this.task.RESPOSIBLE_EMP_MKEY);
        // console.log('empObj',empObj)

        this.assignedEmp = empObj ? { EMP_FULL_NAME: empObj.EMP_FULL_NAME } : null;

        // console.log('assignedEmp', this.assignedEmp);
      },
      (error: ErrorHandler) => {
        console.log(error, "Error Occurred");
      }
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

          // console.log('nameParts',nameParts)

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
      const nameParts = fullName.split(' ');
      const initials = nameParts.map((part: any) => part.charAt(0)).join('');

      if (initials.startsWith(filterValue)) {
        return true;
      }
      return nameParts.some((part: any) => part.startsWith(filterValue));
    });

    // console.log('filteredEmployees', this.filteredEmployees);
  }



  selectEmployee(employee: any): void {
    const assignedTo = employee.Assign_to;
    this.taskForm.get('assignedTo').setValue(assignedTo);
    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
  }


  getTags() {

    this.loggedInUser = this.dataService.getUser();
    const token = this.apiService.getRecursiveUser();

    // console.log('getTagDetailss1', token);

    this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => { 
        this.allTags = response[0].data.map((item: { name: string }) => item.name);
    
    });
  }


  isMaxLengthReached() {
    const taskDescriptionValue = this.taskForm.get('taskDescription').value;
    this.ma = taskDescriptionValue.length >= 350;
    return this.ma;
  }

  fetchCategoryData(): void {
      const token = this.apiService.getRecursiveUser();;
    this.apiService.getCategorynew(token).subscribe(
      (response: any) => {
        this.category = response[0].data;
        this.taskForm.patchValue({ category: 'PUBLIC' });
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching categories');
      }
    );
  }


  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getProjectDetailsNew(token).subscribe(
      (response: any) => {
        this.project = response[0].data;
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }


  formatDate(dateString: string): string {
    if (!dateString) return '';

    const parts = dateString.split('-');

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else {
      return dateString;
    }
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

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  createData(): void {

    const assigningUser = this.dataService.getUser();
    const assignedToValue = this.taskForm.get('assignedTo')?.value.trim();
    const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);

    const PROJECT = this.taskForm.get('project')?.value;
    const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);

    const SUB_PROJ = this.taskForm.get('subProject')?.value;
    const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJ);

    const Task_Num = this.task
    const TASK_PARENT_NUMBER = this.taskDetails[0].TASK_NO;

    const tagsValue = this.taskForm.get('tags')?.value;
    let tagsString = '';

    // console.log('assignedEmployee.Assign_to', assignedEmployee.Assign_to)
    if (assignedEmployee.Assign_to === undefined || assignedEmployee.Assign_to === null) {
      this.tostar.error('Please provide proper Assignee name')
    }

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

    const selectedCategoryDesc = this.taskForm.get('category')?.value;

    if(assignedEmployee === undefined || assignedEmployee === null){
      this.tostar.error('Select Proper assignee name')
    }


    console.log(Task_Num)

    const subTaskData: any = {
      TASK_NO: Task_Num.toString(),
      TASK_NAME: this.taskForm.get('taskName')?.value,
      TASK_DESCRIPTION: this.taskForm.get('taskDescription')?.value,
      CATEGORY: selectedCategoryDesc,
      PROJECT_ID: matchedProject?.MASTER_MKEY || 0,
      SUBPROJECT_ID: SELECTED_PROJ?.MASTER_MKEY || 0,
      COMPLETION_DATE: this.taskForm.get('completionDate')?.value,
      ASSIGNED_TO: assignedEmployee.Assign_to,
      TAGS: tagsString,
      ISNODE: "N",
      START_DATE: '',
      CLOSE_DATE: '',
      DUE_DATE: '',
      TASK_PARENT_ID: Task_Num,
      TASK_PARENT_NODE_ID: Task_Num,
      TASK_PARENT_NUMBER: TASK_PARENT_NUMBER,
      STATUS: "WIP",
      STATUS_PERC: "0",
      TASK_CREATED_BY: assigningUser[0]?.MKEY,
      APPROVER_ID: '1',
      IS_ARCHIVE: '',
      ATTRIBUTE1: '',
      ATTRIBUTE2: '',
      ATTRIBUTE3: '',
      ATTRIBUTE4: '',
      ATTRIBUTE5: '',
      CREATED_BY: assigningUser[0]?.MKEY,
      CREATION_DATE: '',
      LAST_UPDATED_BY: assigningUser[0]?.MKEY,
      APPROVE_ACTION_DATE: '',
      Current_task_mkey: Task_Num
    }



    const token = this.apiService.getRecursiveUser();;

    console.log('subTaskData', subTaskData)
    this.apiService.addSubTaskManagement(subTaskData, token).subscribe({
      next: (response: any) => {
        const responseData = response[0]?.data;
    
        if (responseData && responseData.length > 0) {
          const task = responseData[0];
          this.taskParentId = task.TASK_PARENT_ID;
          this.taskMainNodeId = task.TASK_MAIN_NODE_ID;
          this.mkey = task.MKEY;
    
          this.removeFile();
          this.uploadFile(this.mkey);
          this.tostar.success('Success', `Your Task saved successfully with Task No: ${task.TASK_NO}`);
          this.router.navigate(['/task/task-management']);
        } else {
          this.tostar.error('Error', 'Task creation failed. No data returned.');
        }
      },
      error: (err) => {
        console.error('Error creating subtask:', err);
        this.tostar.error('Error', 'Failed to save the task. Please try again later.');
      },
    });
         
  }



  submitForm() {
    let validationErrors: string[] = [];

    const convertToTitleCase = (input: string) => {
      const titleCase = input.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
      return titleCase + ' is required'
    };

    Object.keys(this.taskForm.controls).forEach(controlName => {
      const control = this.taskForm.get(controlName);
      if (control?.errors?.required) {
        const formattedControlName = convertToTitleCase(controlName);
        validationErrors.push(formattedControlName);
      }
    });

    const completionDateInput = new Date(this.taskForm.value.completionDate);
    const completionDateExisting = new Date(this.taskDetails[0].COMPLETION_DATE);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    if (completionDateInput > completionDateExisting) {
      validationErrors.push(`Completion Date can't be greater than ${this.taskDetails[0].COMPLETION_DATE}`);
    } else if (completionDateInput < currentDate) {
      validationErrors.push(`Completion Date can't be in the past`);
    } else if (completionDateExisting < currentDate) {
      validationErrors.push(`Completion Date can't be in the past`);
    } else if (completionDateInput <= completionDateExisting && completionDateExisting >= currentDate && completionDateInput >= currentDate) {
      if (validationErrors.length > 0) {
        const m = `${validationErrors.join(' , ')}`;
        this.tostar.error(`${m}`);
        return;
      }
      this.createData();
    }

    if (validationErrors.length > 0) {
      const m = `${validationErrors.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    }
  }


  


  savePreviousTask() {

    const Task_Num = this.task
    const assigningUser = this.dataService.getUser();
    const selectedCategoryDesc = this.taskForm.get('category')?.value;
    const assignedToValue = this.taskForm.get('assignedTo')?.value;

    let wordsArray = assignedToValue.split(' ')
    let capitalizedWords = wordsArray.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    let resultString = capitalizedWords.join(' ');

    const PROJECT = this.taskForm.get('project')?.value;
    const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);

    const SUB_PROJ = this.taskForm.get('subProject')?.value;
    const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJ);

    const tagsValue = this.taskForm.get('tags')?.value;

    // console.log('masmalk')
    const checkDate = this.taskForm.get('completionDate')?.value

    

    // console.log('checkDate', checkDate)

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

    // console.log('tagsString check',tagsString)
    const taskData = {
      TASK_NO: Task_Num.toString(),
      TASK_NAME: this.taskForm.get('taskName')?.value,
      TASK_DESCRIPTION: this.taskForm.get('taskDescription')?.value,
      CATEGORY: selectedCategoryDesc,
      PROJECT_ID: matchedProject?.MASTER_MKEY || 0,
      SUBPROJECT_ID: SELECTED_PROJ?.MASTER_MKEY || 0, //|| SUB_PROJCT?.MASTER_MKEY || 0,
      COMPLETION_DATE: this.taskForm.get('completionDate')?.value,
      ASSIGNED_TO: resultString,
      TAGS: tagsString,
      ISNODE: "N",
      START_DATE: '',
      CLOSE_DATE: '',
      DUE_DATE: '',
      TASK_PARENT_ID: '',
      STATUS: "WIP",
      STATUS_PERC: "0",
      TASK_CREATED_BY: assigningUser[0]?.MKEY,
      APPROVER_ID: '1',
      IS_ARCHIVE: '',
      ATTRIBUTE1: '',
      ATTRIBUTE2: '',
      ATTRIBUTE3: '',
      ATTRIBUTE4: '',
      ATTRIBUTE5: '',
      CREATED_BY: assigningUser[0]?.MKEY,
      CREATION_DATE: '',
      LAST_UPDATED_BY: assigningUser[0]?.MKEY,
      APPROVE_ACTION_DATE: ''
    };



    // console.log('Save Task taskData',taskData)
  

    const token = this.apiService.getRecursiveUser();;

    // console.log('save task token', token)

    this.apiService.addTaskManagement(taskData, token).subscribe((response:any)=>{
      console.log(response[0].data)
      if (response[0].data && response[0].data.length > 0) {
          this.taskParentId = response[0].data[0].TASK_PARENT_ID;
          this.taskMainNodeId = response[0].data[0].TASK_MAIN_NODE_ID;
          this.mkey = response[0].data[0].MKEY
      }
          this.removeFile();
           this.uploadFile(response[0].data[0].MKEY);
           this.tostar.success('success', `Your Task saved successfully with Task No : ${response[0].data[0].TASK_NO}`);
           this.router.navigate(['/task/task-management'])
    })
  }


  fileUrl() {
    return `http://task.piplapps.com:8074/${this.taskDetails[0].FILE_PATH}`;
  }


  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      console.log(this.file)
    }

    const labelElement = document.getElementById('AttachmentDetails');
    if (labelElement) {
      labelElement.textContent = this.file.name;
    }
  }

  uploadFile(mkey:any): void {


    if (this.file) {

    const token = this.apiService.getRecursiveUser();
    // const data = this.dataService.getUser();
    const USER_MKEY = this.loggedInUser[0]?.MKEY;   
  
    if (this.file) {
      const additionalAttributes = {

        files:this.file,      
        MKEY:0,
        TASK_MKEY: mkey,
        TASK_PARENT_ID:this.taskParentId,
        TASK_MAIN_NODE_ID:this.taskMainNodeId,
        DELETE_FLAG: 'Y',
        CREATED_BY:USER_MKEY   
      };
  
  
      this.apiService.uploadFileNew(this.file, additionalAttributes, token).subscribe(
        response => {
          console.log('Upload successful:', response);
        },
        error => {
          console.error('Upload failed:', error);
        }
      );
    } else {
      console.warn('No file selected');
    }

  }
}


  removeFile() {
    this.taskDetails[0].FILE_NAME = null;
    this.taskDetails[0].FILE_PATH = null;
  }



  saveGeneratedTask(): void {
    // let validationErrors: string[] = [];

    const requiredControls: string[] = [];
    const requiredFields:string[] = [];

    const formValues = this.taskForm.value; 

    const addControlError = (message: string) => requiredControls.push(message);
    const addFieldError = (message: string) => requiredFields.push(message);

    const convertToTitleCase = (input: string) => {
      const titleCase = input.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
      return titleCase + ' is required'
    };

    Object.keys(this.taskForm.controls).forEach(controlName => {
      const control = this.taskForm.get(controlName);
      if (control?.errors?.required) {
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });

    const completionDateInput = new Date(formValues.completionDate);
    const completionDateExisting = new Date(this.taskDetails[0].COMPLETION_DATE);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    const hasRequiredTaskFields = formValues.taskName.trim() !== '' && formValues.taskDescription.trim() !== '';

    if(!hasRequiredTaskFields){
      addFieldError('Empty Fields not accepted');
    }

    if (completionDateInput > completionDateExisting) {
      addControlError(`Completion Date can't be greater than ${this.taskDetails[0].COMPLETION_DATE}`);
    } else if (completionDateInput < currentDate) {
      addControlError(`Completion Date can't be in the past`);
    } else if (completionDateExisting < currentDate) {
      addControlError(`Completion Date can't be in the past`);
    } else if (completionDateInput <= completionDateExisting && completionDateExisting >= currentDate && completionDateInput >= currentDate) {

      if (requiredControls.length > 0) {
        const m = `${requiredControls.join(' , ')}`;
        this.tostar.error(`${m}`);
        return;
      }

      
    if (requiredFields.length > 0) {
      const m = `${requiredFields.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    }
      this.savePreviousTask();
    }

    if (requiredControls.length > 0) {
      const m = `${requiredControls.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    }

    if (requiredFields.length > 0) {
      const m = `${requiredFields.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    }
  }

  navigateToTask() {
    this.router.navigate(['task/task-management']);
  }
}



