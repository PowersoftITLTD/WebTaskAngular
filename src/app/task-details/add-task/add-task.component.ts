import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { SideBarService } from 'src/app/services/side-panel/side-bar.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnInit {

  @Input() loggedInUser: any;
  @Input() recursiveLogginUser: any = {};


  //Logged
  receivedUser: any;

  //Form 
  taskForm: FormGroup | any;

  //tags
  tags: any[] = [];
  suggestions: any[] = [];
  allTags: any[] = [];
  selectedTags: any[] = [];
  selectedCategory: any;


  //Form Controls
  category: any = [];
  project: any = [];
  sub_proj: any = [];
  status: any = [];
  empName: any = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];

  showDropdown: boolean = false;
  disablePrivate: boolean = false;
  inputHasValue: boolean = false;

  ma: boolean = false;

  selectedIndex: number = -1

  // Completion_Date: string = '';

  //Select Tab
  selectedTab: string = 'taskInfo';
  defaultCategory: string = 'PUBLIC';

  //file upload
  file: File | any;
  taskParentId: any;
  taskMainNodeId: any;
  mkey: any;

  constructor(
              private apiService: ApiService,
              private formBuilder: FormBuilder,
              private tostar: ToastrService,
              private credentialService: CredentialService,
              private router: Router,
             ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.fetchCategoryData();
    this.fetchProjectData();
    this.fetchEmployeeName();
    this.getTagsnew();
    // this.fetchEmployeeNameNew()
    // this.getSubProject()
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      taskDescription: ['', [Validators.required]],
      category: ['', Validators.required],
      project: [],
      subProject: [],
      completionDate: ['', Validators.required],
      assignedTo: ['', [Validators.required]],
      tags: [],
      file: []
    });
  }

  descriptionMaxLength() {
    return this.taskForm.get('taskDescription').value.length >= 1000;
  }

  taskNameMaxLength() {
    return this.taskForm.get('taskName').value.length >= 150;
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
        // console.log("Project", this.project);
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }

  onProjectSelect(selectElement: HTMLSelectElement) {
    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex];
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : null;
    const token = this.apiService.getRecursiveUser();

    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
        (response: any) => {
          console.log(response)
          this.sub_proj = response[0]?.data;
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching sub-projects');
        }
      );
    }
  }



  getTagsnew() {
    this.loggedInUser = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => { 
        this.allTags = response[0].data.map((item: { name: string }) => item.name);    
    });
  }


  getPrivateCategory(event: Event): void {
    this.selectedCategory = (event.target as HTMLInputElement).value.trim();

    if (this.selectedCategory === 'PRIVATE') {

      const private_emp = this.employees.filter(employee => employee.MKEY === this.loggedInUser[0]?.MKEY);

      if (private_emp.length > 0) {
        const assignTo = private_emp[0].Assign_to;
        this.taskForm.get('assignedTo').setValue(assignTo);
        this.disablePrivate = true;
        // console.log('Assign_to:', assignTo);
      }

    } else if (this.selectedCategory !== 'PRIVATE') {

      this.disablePrivate = false;
      this.taskForm.get('assignedTo').setValue(null);
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
        });
        // console.log('this.employees', this.employees);    
      },
      (error: ErrorHandler) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  // fetchEmployeeNameNew(){
  //   const token = this.apiService.getRecursiveUser();;

  //   this.apiService.getEmpDetailsNew(token).subscribe((data:any)=>{
  //     console.log(data)
  //   })
  // }
  





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




  selectEmployee(employee: any): void {

    // console.log('selectEmployee',employee)
    const assignedTo = employee.Assign_to;

    // console.log('assignedTo', assignedTo)
    this.taskForm.get('assignedTo').setValue(assignedTo);

    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
  }





  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }


  createData(): void {

    const assigningUser = this.credentialService.getUser();
    const assignedToValue = this.taskForm.get('assignedTo')?.value.trim();
    const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);
    const PROJECT = this.taskForm.get('project')?.value || { MASTER_MKEY: '0' };
    const SUB_PROJECT = this.taskForm.get('subProject')?.value || { MASTER_MKEY: '0' };



    // if (this.newTaskOrSubTask) {
    const tagsValue = this.taskForm.get('tags')?.value;
    let tagsString = '';

    if (Array.isArray(tagsValue)) {
      tagsString = tagsValue.map(tag => tag.display).join(',');
    }

    const selectedCategoryDesc = this.taskForm.get('category')?.value;
    const selectedCategory = this.category.find((cat: any) => cat.TYPE_DESC === selectedCategoryDesc);
    
    console.log('assignedEmployee.Assign_to', assignedEmployee)

    if(assignedEmployee === undefined || assignedEmployee === null){
      this.tostar.error('Select Proper assignee name')
    }
    const taskData = {
      TASK_NO: "0000",
      TASK_NAME: this.taskForm.get('taskName')?.value,
      TASK_DESCRIPTION: this.taskForm.get('taskDescription')?.value,
      CATEGORY: selectedCategory.MKEY,
      PROJECT_ID: PROJECT.MASTER_MKEY,
      SUBPROJECT_ID: SUB_PROJECT.MASTER_MKEY,
      COMPLETION_DATE: this.taskForm.get('completionDate')?.value,
      ASSIGNED_TO: assignedEmployee.Assign_to,
      TAGS: tagsString,
      ISNODE: "N",
      START_DATE: '',
      CLOSE_DATE: '',
      DUE_DATE: '',
      TASK_PARENT_ID: '',
      STATUS: "WIP",
      STATUS_PERC: "0",
      TASK_CREATED_BY: assigningUser[0]?.MKEY,
      APPROVER_ID: '1', //assigningUser.MKEY
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


    console.log(taskData)


      const token = this.apiService.getRecursiveUser();;

      this.apiService.addTaskManagement(taskData, token).subscribe((response:any)=>{
        // console.log('Add task response',response)
        if (response[0].data && response[0].data.length > 0) {

          // console.log('Add task response',response)

            this.taskParentId = response[0].data[0].TASK_PARENT_ID;
            this.taskMainNodeId = response[0].data[0].TASK_MAIN_NODE_ID;
        }
             this.uploadFile(response[0].data[0].MKEY);
             this.tostar.success('success', `Your Task saved successfully with Task No : ${response[0].data[0].TASK_NO}`);
             this.router.navigate(['/task/task-management'])
      });
  }


  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      // console.log(this.file)
    }

    const labelElement = document.getElementById('AttachmentDetails');
    if (labelElement) {
      labelElement.textContent = this.file.name;
    }
  }




  uploadFile(mkey:any): void {


    if (this.file) {

    const token = this.apiService.getRecursiveUser();
    const USER_MKEY = this.loggedInUser[0]?.MKEY  

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

  onSubmit() {
    const requiredControls: string[] = [];
    const requiredFields:string[] = [];
    
    // let requiredMessage: string = 'Following fields are required: ';

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
        // Convert camelCase to Title Case
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });

    const completionDateInput = new Date(formValues.completionDate);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    const hasRequiredTaskFields = formValues.taskName.trim() !== '' && formValues.taskDescription.trim() !== '';

    if (completionDateInput < currentDate) {
      addFieldError(`Completion Date can't be past Date`);
    }
    
    if(!hasRequiredTaskFields){
      addFieldError('Empty Fields not accepted');
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

    if (this.taskForm.valid) {
      console.log('Form is valid. Proceeding to submit.');
      this.createData();
    } else {
      console.log('Form is invalid. Cannot submit.');
    }
  }

  navigateToTask() {
    this.router.navigate(['task/task-management']);
  }
}








