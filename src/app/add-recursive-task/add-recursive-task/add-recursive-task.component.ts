import { Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecursiveTaskData } from '../../interface/recursiveTaskData'
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';




@Component({
  selector: 'app-add-recursive-task',
  templateUrl: './add-recursive-task.component.html',
  styleUrls: ['./add-recursive-task.component.css']
})
export class AddRecursiveTaskComponent implements OnInit, OnDestroy {

  @Input() loggedInUser: any;
  @Input() recursiveLogginUser: any = {};

  taskData: RecursiveTaskData | any;


  selectedTab: string = 'taskInfo';
  defaultCategory: string = 'PUBLIC';

  //Logged
  receivedUser: string | any;


  selectedMonth: string | any;
  USER_CRED:any;
  baseURL:string | any

  get_Months_from_multiselect: any;

  //Form 
  recursiveTaskForm: FormGroup | any;
  selectedTermChange:any;

  //tags
  tags: any[] = [];
  allTags: any[] = [];
  selectedTags: any[] = [];
  selectedMonths: string[] = [];
  employees: any[] = [];
  category: any = [];
  project: any = [];
  sub_proj: any = [];

  filteredEmployees: any[] = [];

  selectedCategory: any;

  dt: any
  selectedDays: Set<string> = new Set<string>();

  showDropdown: boolean = false;
  disablePrivate: boolean = false;
  inputHasValue: boolean = false;

  WeekUpdatedate: boolean | string | any;
  monthDayUpdate: boolean | string | any;
  regularDayUpdate: boolean = true;

  monthDayIndex: any;

  //file upload
  file: File | any;
  taskParentId: any;
  taskMainNodeId: any;
  mkey: any;

  selectWeek: boolean = false;
  selectMonth: boolean = false;
  isChecked: boolean = false;
  myModel: boolean = true;

  selectedMonthDay: any

  selectedRadio: string = 'never';
  selectedTerm: string = 'Daily';
  minDate: string | any;

  repeat_type: any[] = [
    { value: '1', type: 'Daily' },
    { value: '2', type: 'Weekly' },
    { value: '3', type: 'Monthly' },
    { value: '4', type: 'Yearly' },
  ];

  updatedDetails: boolean = false;

  weekDays: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']



  month_days: any[] = [
    { type: 'Day 1' },
    { type: 'Day 2' },
    { type: 'Day 3' },
    { type: 'Day 4' },
    { type: 'Day 5' },
    { type: 'Day 6' },
    { type: 'Day 7' },
    { type: 'Day 8' },
    { type: 'Day 9' },
    { type: 'Day 10' },
    { type: 'Day 11' },
    { type: 'Day 12' },
    { type: 'Day 13' },
    { type: 'Day 14' },
    { type: 'Day 15' },
    { type: 'Day 16' },
    { type: 'Day 17' },
    { type: 'Day 18' },
    { type: 'Day 19' },
    { type: 'Day 20' },
    { type: 'Day 21' },
    { type: 'Day 22' },
    { type: 'Day 23' },
    { type: 'Day 24' },
    { type: 'Day 25' },
    { type: 'Day 26' },
    { type: 'Day 27' },
    { type: 'Day 28' },
    { type: 'Day 29' },
    { type: 'Day 30' },
    { type: 'Day 0' },
  ];

  list: any[];

  selectedMonth_day: string | any = '';

  startDate = new Date().toISOString().slice(0, 16);

  constructor(
    private formBuilder: FormBuilder,
    private tostar: ToastrService,
    private apiService: ApiService,
    private router: Router,
    private credentialService: CredentialService
  ) {


    this.dt = new Date() || this.taskData.enD_DATE;

    const navigation: any = this.router.getCurrentNavigation();
    const isNewTask = sessionStorage.getItem('isNewTask') === 'true';

    if (navigation?.extras.state) {
      const RecursiveTaskData: RecursiveTaskData = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;
      // if(RecursiveTaskData){
      //   this._getSelectedTaskDetails();
      // }
      // console.log('Selected data', this.taskData)
      if (RecursiveTaskData.mkey) {
        this.updatedDetails = !isNewTask; // Don't update if adding a new task
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
          if (!isNewTask) {
            this.updatedDetails = this.taskData.mkey ? true : false;
          }
        } catch (error) {
          console.error('Failed to parse task data', error);
        }
      }
    }
    this.list =
      [
        { name: 'All', checked: true },
        { name: 'January', checked: false },
        { name: 'February', checked: false },
        { name: 'March', checked: false },
        { name: 'April', checked: false },
        { name: 'May', checked: false },
        { name: 'June', checked: false },
        { name: 'July', checked: false },
        { name: 'August', checked: false },
        { name: 'September', checked: false },
        { name: 'October', checked: false },
        { name: 'November', checked: false },
        { name: 'December', checked: false },
      ]

    this.initializeForm();
  }

  addNewTask() {
    sessionStorage.setItem('isNewTask', 'true');
  }

  ngOnInit(): void {

    const currentURL = window.location.href;
    const baseURL = currentURL.split('#')[0] + '#/'; 
    this.baseURL = baseURL

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    // console.log(this.taskData)
    if (this.taskData?.ends) {
      this.selectedRadio = this.taskData.ends;
    } else {
      this.selectedRadio = 'never'; // Default value
    }

    if (this.taskData?.term === 'Weekly') {
      this.onTermSelect('Weekly')
      this.initializeSelectedDays(this.taskData);
    } else if (this.taskData?.term === 'Monthly' || this.taskData?.term === 'Yearly') {
      this.onTermSelect('Monthly')
    }

    // console.log(this.taskData.project_Name)

    this.fetchCategoryData();
    this.fetchProjectData();
    this.fetchEmployeeName();
    this.getTags();



    if(this.taskData && this.taskData.mkey){
      this._getSelectedTaskDetails();

      const tagsArray = this.taskData.tags.split(',');

      this.selectedTags = tagsArray
      console.log('tagsArray', tagsArray  )
    }
   

    // if(this.taskData){
    // }
    // if (this.taskData.attributE13 == "") {
    //   this.taskData.attributE13 = "1";
    // }

  }


  _getSelectedTaskDetails() {
    this.apiService.getSubProjectDetails(this.taskData.projecT_ID).subscribe(
      (data: any) => {
        this.sub_proj = data;
        console.log('this.sub_proj',this.sub_proj)                                  
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching sub-projects');
      }
    );

    // this.recursiveTaskForm.patchValue({
    //   noOfDays: this.taskData[0].noOfDays
    // });

    if (this.taskData.length > 0 && this.taskData.tags !== null) {
      const tagsArray = this.taskData.tags.split(',');
      this.selectedTags = tagsArray;

      console.log('tagsArray', tagsArray)
    } else {
      this.selectedTags = [];
    }
  }


  shareCheckedList(item: any[]) {

    this.get_Months_from_multiselect = item;

    // if (this.taskData && this.taskData.mkey) {
    //   if (item.length > 0) {
    //     this.get_Months_from_multiselect = item;
    //   }
    // } else if (!this.taskData || !this.taskData.mkey) {
    // }
  }



  initializeForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const startDate = this.formatDateForInput(this.taskData?.starT_DATE);
    let endDateNew: any;

    // Determine endDateNew
    if (startDate) {
      endDateNew = startDate < today ? today : startDate;
    } else {
      endDateNew = today;
    }

    let month_day = '';
    const month_index = this.taskData?.attributE1;


    if (this.taskData?.term === 'Monthly') {
      month_day = 'Day ' + month_index;
    }

    this.selectedMonth_day = month_day;


    console.log('this.selectedMonth_day', this.selectedMonth_day)


    this.recursiveTaskForm = this.formBuilder.group({
      taskName: [this.taskData?.tasK_NAME || '', [Validators.required, Validators.maxLength(8)]],
      taskDescription: [this.taskData?.tasK_DESCRIPTION || '', Validators.required],
      repeatTerm: [this.taskData?.repeatTerm || '1', Validators.required],
      termType: [this.taskData?.term || 'Daily', Validators.required],
      startDate: [this.formatDateForInput(this.taskData?.starT_DATE) || '', [Validators.required]],
      staDate_new: [this.formatDateForInput(this.taskData?.starT_DATE)],
      endDate: [this.formatDateForInput(this.taskData?.enD_DATE) || "00-00-0000", [Validators.required]],
      endDate_new: [this.formatDateForInput(this.taskData?.enD_DATE) || endDateNew],
      term: [this.taskData?.ends || 'never'],
      setWeekDays: ['', Validators.required],
      selectMonthDay: [this.selectedMonth_day || '', Validators.required],
      noOfDays:['', Validators.required],
      assignedTo:['',Validators.required ], 
      category:[''],
      tags: [],
      file: [],
      project: [],
      subProject: [],
    });

  }


  getSelectedTaskDetails(mkey: string) {
    return this.apiService.getSelectedTaskDetails(mkey.toString());
  }


  //Add
  addRecursiveData() {

    console.log('addRecursiveData')

    const data = this.credentialService.getUser();

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD),

    };

    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    const formValues = this.recursiveTaskForm.value;
    const startDate: any = new Date(formValues.startDate);
    const endDate = new Date(formValues.endDate)
    const repeat_term: string = formValues.repeatTerm
    const term_type: string = formValues.termType

    const formData = new FormData();

    formData.append("FILENAME", this.file)

    console.log('formData',formData)

    const file = this.file || null;
    // const file_path = file_name ? `Attachments\\\\12\\${file_name}` : null;

    let endDateStr = null;

    if (this.selectedRadio === 'never' || formValues.endDate === "00-00-0000") {
      endDateStr = null;
    } else {
      endDateStr = this.formatDate(new Date(endDate));
    }

    const weekDays = formValues.setWeekDays.split(' , ');
    const monthDays: any = this.get_Months_from_multiselect;

    const monthMapping: any = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthDayIndex: any = this.toggleMonthDaySelection(this.selectedMonth_day);
    const attributes = new Array(16).fill('');

    if (term_type === 'Weekly') {
      weekDays.forEach((day: string) => {
        const index = this.weekDays.indexOf(day);
        if (index !== -1) {
          attributes[index] = day;
        }
      });
    }

    if (term_type === 'Monthly' || term_type === 'Yearly') {
      monthDays.forEach((month: string) => {
        const monthIndex = monthMapping[month];
        if (monthIndex && monthIndex + 1 <= 13) { 
          attributes[monthIndex] = monthIndex.toString(); 
        }
      });
    }

    const monthDayIndexArray = Array.isArray(monthDayIndex) ? monthDayIndex : [monthDayIndex];

    let attribute0 = '';
    let attribute13 = '';

    if (term_type === 'Daily') {
      attribute13 = repeat_term.toString(); 
    } else if (term_type === 'Monthly' || term_type === 'Yearly' ) {
      if (attributes[12] === '12') {
        attribute13 = '12'; 
      } else {
        attribute13 = ''; 
      }
      attribute0 = monthDayIndexArray.join(','); 
      if (attribute0 === "31") {
        attribute0 = '0';
      }
    } else {
      attribute0 = attributes[0] || ''; 
    }

    const selectedCategoryDesc = this.recursiveTaskForm.get('category')?.value;
    const selectedCategory = this.category.find((cat: any) => cat.TYPE_DESC === selectedCategoryDesc);

    const assigningUser = this.credentialService.getUser();
    const assignedToValue = this.recursiveTaskForm.get('assignedTo')?.value.trim();
    const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);
    console.log('assignedEmployee', assignedEmployee)
    const PROJECT = this.recursiveTaskForm.get('project')?.value || { MASTER_MKEY: '0' };
    const SUB_PROJECT = this.recursiveTaskForm.get('subProject')?.value || { MASTER_MKEY: '0' };

    const tagsValue = this.recursiveTaskForm.get('tags')?.value;
    let tagsString = '';

    if (Array.isArray(tagsValue)) {
      tagsString = tagsValue.map(tag => tag.display).join(',');
    }

    // console.log('selectedCategory.MKEY', selectedCategory.MKEY)

    const addRecursiveTask = {
      tasK_NAME: this.recursiveTaskForm.get('taskName')?.value,
      tasK_DESCRIPTION: this.recursiveTaskForm.get('taskDescription')?.value,
      caregory:selectedCategory.MKEY.toString(),
      projecT_ID:PROJECT.MASTER_MKEY,
      suB_PROJECT_ID:SUB_PROJECT.MASTER_MKEY,
      assigneD_TO:assignedEmployee.MKEY,
      tags:tagsString,
      nO_DAYS:this.recursiveTaskForm.get('noOfDays')?.value,
      term: this.recursiveTaskForm.get('termType')?.value,
      starT_DATE: this.formatDateForInput(startDate),
      ends: this.recursiveTaskForm.get('term').value,
      enD_DATE: endDateStr,
      createD_BY: data[0]?.MKEY.toString(),
      lasT_UPDATED_BY: data[0]?.MKEY.toString(),
      attributE1: attribute0,
      attributE2: attributes[1] ,
      attributE3: attributes[2],
      attributE4: attributes[3],
      attributE5: attributes[4],
      attributE6: attributes[5],
      attributE7: attributes[6],
      attributE8: attributes[7],
      attributE9: attributes[8],
      attributE10: attributes[9],
      attributE11: attributes[10],
      attributE12: attributes[11],
      attributE13: attribute13,
      attributE14: "Add",
      attributE15: "Add Button",
      attributE16: USER_CRED.MKEY.toString(),
      // files:file
      // filE_NAME:file_name,
      // filE_PATH:file_path
    }

    console.log('addRecursiveTask', addRecursiveTask)

    this.apiService.addRecursiveTask(addRecursiveTask, this.recursiveLogginUser).subscribe({
      next: (addData: RecursiveTaskData) => {   

        console.log('Data added successfully', addData)
        // if(!addData){
        //   this.tostar.error('Try after sometime', 'Error occured');
        //   return;
        // }
        this.uploadFile(addData.mkey);

        this.router.navigate(['/task/recursive-task'])

      }, error: (error) => {


        if(error){
          console.error('Error updating task:', error);
          this.tostar.error('Try after sometime', 'Error occured');
          return error;
        }
      }
    })

  }








  //Update
  updateRecursiveData() {

    const data = this.credentialService.getUser();

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD),

    };

    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const formValues = this.recursiveTaskForm.value;
    const startDate: any = new Date(formValues.staDate_new);
    const endDate = new Date(formValues.endDate_new);
    const repeat_term: string = formValues.repeatTerm;
    const term_type: string = formValues.termType;
    // const file_name:any = this.file.name

    // let file = ''

    // if(this.file.name !== undefined){
    //   file = '';
    // }else{
    //   file = file_name;
    // }

    const file_name = this.file?.name || null;
    const file_path = file_name ? `Attachments\\\\12\\${file_name}` : null;

    console.log('file_name', file_name);
    console.log('file_path', file_path);

    let endDateStr: string | null = null;

    if (this.selectedRadio === 'never') {
      endDateStr = null;
    } else if (this.selectedRadio === 'on' || this.selectedRadio === undefined) {
      endDateStr = this.formatDate(new Date(endDate));
    }

    const weekDays = formValues.setWeekDays.split(' , ');
    const monthDays: any = this.get_Months_from_multiselect;

    const monthMapping: any = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthDayIndex: any = this.toggleMonthDaySelection(this.selectedMonth_day);
    const attributes = new Array(16).fill('');

    if (term_type === 'Weekly') {
      weekDays.forEach((day: string) => {
        const index = this.weekDays.indexOf(day);
        if (index !== -1) {
          attributes[index] = day;
        }
      });
    }


    if (term_type === 'Monthly' || term_type === 'Yearly' ) {
      monthDays.forEach((month: string) => {
        const monthIndex = monthMapping[month];
        if (monthIndex && monthIndex + 1 <= 13) { 
          attributes[monthIndex] = monthIndex.toString(); 
        }
      });
    }

    const monthDayIndexArray = Array.isArray(monthDayIndex) ? monthDayIndex : [monthDayIndex];


    let attribute0 = '';
    let attribute13 = '';
    
    if (term_type === 'Daily') {
      attribute13 = repeat_term.toString();
    } else if (term_type === 'Monthly' || term_type === 'Yearly') {
      if (attributes[12] === '12') {
        attribute13 = '12'; 
      } else {
        attribute13 = ''; 
      }
    
      attribute0 = monthDayIndexArray.join(','); 
    
      if (attribute0 === "31") {
        attribute0 = '0';
      }
    } else {
      attribute0 = attributes[0] || ''; 
    }


    const selectedCategoryDesc = this.recursiveTaskForm.get('category')?.value;
    const selectedCategory = this.category.find((cat: any) => cat.TYPE_DESC === selectedCategoryDesc);

    const assignedToValue = this.recursiveTaskForm.get('assignedTo')?.value;

    const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);
    console.log('assignedEmployee', assignedEmployee)

    let wordsArray = assignedToValue.split(' ')
    let capitalizedWords = wordsArray.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    let resultString = capitalizedWords.join(' ');

    const PROJECT = this.recursiveTaskForm.get('project')?.value;
    const matchedProject = this.project.find((project: any) => project.TYPE_DESC === PROJECT);
    console.log('PROJECT value',PROJECT)

    console.log('matchedProject', matchedProject)

    const SUB_PROJ = this.recursiveTaskForm.get('subProject')?.value;
    const SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJ);

    const tagsValue = this.recursiveTaskForm.get('tags')?.value;

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
    

    const updateRecursiveTask: any = {
      mkey: this.taskData.mkey,
      tasK_NAME: this.recursiveTaskForm.get('taskName')?.value,
      tasK_DESCRIPTION: this.recursiveTaskForm.get('taskDescription')?.value,
      category:selectedCategory.MKEY,
      projecT_ID:matchedProject?.MASTER_MKEY || 0,
      suB_PROJECT_ID:SELECTED_PROJ?.MASTER_MKEY || 0,
      assigneD_TO:assignedEmployee.MKEY,
      tags:tagsString,
      nO_DAYS:this.recursiveTaskForm.get('noOfDays')?.value,
      term: this.recursiveTaskForm.get('termType')?.value,
      starT_DATE: this.formatDateForInput(startDate),
      ends: this.recursiveTaskForm.get('term').value,
      enD_DATE: endDateStr,
      lasT_UPDATED_BY: data[0]?.MKEY.toString(),
      attributE1: attribute0,
      attributE2: attributes[1],
      attributE3: attributes[2],
      attributE4: attributes[3],
      attributE5: attributes[4],
      attributE6: attributes[5],
      attributE7: attributes[6],
      attributE8: attributes[7],
      attributE9: attributes[8],
      attributE10: attributes[9],
      attributE11: attributes[10],
      attributE12: attributes[11],
      attributE13: attribute13,
      attributE14: "Save",
      attributE15: "Save Button",
      attributE16: USER_CRED.MKEY.toString(),
      filE_NAME:file_name,
      filE_PATH:file_path

    };

    console.log('updateRecursiveTask', updateRecursiveTask)

    this.apiService.updateRecursiveTask(this.taskData.mkey, updateRecursiveTask, this.recursiveLogginUser).subscribe({
      next: (updateData: RecursiveTaskData) => {

        this.router.navigate(['/task/recursive-task'])

        console.log('Task updated successfully:', updateData);
        this.uploadFile(updateData.mkey)
      },
      error: (error) => {
        if(error){
          console.error('Error updating task:', error);
          this.tostar.error('Try after sometime', 'Error occured');
          return;
        }      
      },
    });
  }


  uploadFile(task_mkey:number): void {

    console.log('task_mkey', task_mkey)
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const data = this.credentialService.getUser();

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD),

    };
  
    if (this.file) {
      const additionalAttributes = {
        files:this.file,
        TASK_MKEY: task_mkey,
        CREATED_BY: USER_CRED.MKEY,
        ATTRIBUTE14: USER_CRED.MKEY,
        ATTRIBUTE15: 'Add',
        ATTRIBUTE16: 'Add but',
        FILE_NAME:this.file.name,
        FILE_PATH:`${this.baseURL}/Attachment/${task_mkey}`
      };
  
      // console.log('additionalAttributes',additionalAttributes)
  
      this.apiService.recursiveFileUploader(this.file, additionalAttributes, this.recursiveLogginUser).subscribe(
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

  fetchCategoryData(): void {
    this.apiService.getCategory().subscribe(
      (data: any) => {
        this.category = data;
        this.recursiveTaskForm.patchValue({ category: 'PUBLIC' });
        // console.log('category', this.category)
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching categories');
      }
    );
  }

  getPrivateCategory(event: Event): void {
    this.selectedCategory = (event.target as HTMLInputElement).value.trim();

    if (this.selectedCategory === 'PRIVATE') {

      const private_emp = this.employees.filter(employee => employee.MKEY === this.loggedInUser[0]?.MKEY);

      if (private_emp.length > 0) {
        const assignTo = private_emp[0].Assign_to;
        this.recursiveTaskForm.get('assignedTo').setValue(assignTo);
        this.disablePrivate = true;
        // console.log('Assign_to:', assignTo);
      }

    } else if (this.selectedCategory !== 'PRIVATE') {

      this.disablePrivate = false;
      this.recursiveTaskForm.get('assignedTo').setValue(null);
    }
  }

  

  fetchProjectData(): void {
    this.apiService.getProjectDetails().subscribe(
      (data: any) => {
        this.project = data;
        // console.log("Project", this.project);
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }

  onProjectSelect(selectElement: HTMLSelectElement) {

    const selectedIndex = selectElement.selectedIndex - 1;

    // console.log('selectElement', selectElement.selectedIndex)
    const selectedOption: any = this.project[selectedIndex] || 0;
    // console.log('selectedOption', selectedOption)
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : 0;

    // console.log('selectedProjectMkey', selectedProjectMkey)

    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetails(selectedProjectMkey).subscribe(
        (data: any) => {

          this.sub_proj = data;

          // console.log("Sub-Project", this.sub_proj);

        },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching sub-projects');
        }
      );
    }
  }

  onDayChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    // console.log('onDayChange selectedValue',selectedValue)

    this.selectedMonth_day = selectedValue;

    const formValues = this.recursiveTaskForm.value;

    if (formValues.termType === 'Weekly') {
      this.toggleWeekDaySelection(selectedValue);
    } else if (formValues.termType === 'Monthly' || formValues.termType === 'Yearly') {
      this.selectedMonthDay = selectedValue;
      this.toggleMonthDaySelection(selectedValue);
    }
  }


  toggleWeekDaySelection(day: string): void {

    // console.log('toggleWeekDaySelection',this.selectedDays)

    if (this.selectedDays.has(day)) {

      // console.log('toggleWeekDaySelection',this.selectedDays)

      this.selectedDays.delete(day);
      // console.log('toggleWeekDaySelection',this.selectedDays)

    } else {
      this.selectedDays.add(day);
    }

    const selectedDates = Array.from(this.selectedDays);
    this.recursiveTaskForm.patchValue({ setWeekDays: selectedDates.join(" , ") });
  }


  getTags() {
    this.loggedInUser = this.credentialService.getUser();
    // console.log('this.loggedInUser[0]?.MKEY', this.loggedInUser[0]?.MKEY)
    this.apiService.getTagDetailss(this.loggedInUser[0]?.MKEY).subscribe((data: any) => { this.allTags = data });
  }



  toggleMonthDaySelection(month: string) {
    const formValues = this.recursiveTaskForm.value;
    const startDate_new: any = new Date(formValues.staDate_new);

    const MKEY = this.taskData?.mkey;

    let start_date = this.recursiveTaskForm.value.startDate;
    let start_date_new = this.formatDate(startDate_new);

    if (!start_date) {
        start_date = new Date().toISOString().split('T')[0];
    }

    if (!MKEY) {
        const startDate = new Date(start_date);
        const startMonth = startDate.getMonth(); 
        const startYear = startDate.getFullYear();

        const monthDayIndex: any = parseInt(month.replace('Day', '').trim(), 10); 

        const lastDayOfMonth = "31";


        if (month === 'Day 0') {
            this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth });
            return lastDayOfMonth;
        } else if (monthDayIndex < parseInt(lastDayOfMonth)) {
            this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth });
            return monthDayIndex;
        } else {
            this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth });
            return lastDayOfMonth;
        }
    } else if (MKEY) {

        const startDate_new = new Date(start_date_new);
        const startMonth_new = startDate_new.getMonth(); // 0-based index
        const startYear_new = startDate_new.getFullYear();

        const monthDayIndex: any = parseInt(month.replace('Day', '').trim(), 10); 


        const lastDayOfMonth = "31";


        if (month === 'Day 0') {
            this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth });
            return lastDayOfMonth;
        } else if (monthDayIndex < parseInt(lastDayOfMonth)) {
            this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth });
            return monthDayIndex;
        } else {
            this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth });
            return lastDayOfMonth;
        }
    }
}


  onRadioChange(event: any) {
    this.selectedRadio = event.value
    const formValues = this.recursiveTaskForm.value;

    if (this.selectedRadio === 'never' || formValues.endDate === null) {
      this.recursiveTaskForm.patchValue({ endDate: '00-00-0000' });
    }

    if (this.selectedRadio === undefined) {
      this.selectedRadio === 'on'
    }
  };


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
    this.recursiveTaskForm.get('assignedTo').setValue(assignedTo);

    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
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


  fetchEmployeeName(): void {

    this.apiService.getEmpDetails().subscribe(
      (data: any) => {
        // console.log("Employee data:", data);
        // const _data = data;

        data.forEach((emp: any) => {
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

  descriptionMaxLength() {
    return this.recursiveTaskForm.get('taskDescription').value.length >= 1000;
  }

  taskNameMaxLength() {
    return this.recursiveTaskForm.get('taskName').value.length >= 150;
  }


  onTermSelect(selectElement: any) {



    const term = selectElement.value

    this.selectedTermChange = term;

    if (term === 'Daily') {
      this.regularDayUpdate = true;
      this.selectMonth = false;
      this.selectWeek = false;
    } else if (term === 'Weekly' || selectElement === 'Weekly') {
      this.selectMonth = false;
      this.selectWeek = true;
      this.regularDayUpdate = false;
    } else if (term === 'Monthly' || selectElement === 'Monthly' || term === 'Yearly' || selectElement === 'Yearly') {
      this.selectMonth = true;
      this.selectWeek = false;
      this.selectedMonth_day = 'Day ' + this.taskData?.attributE1
      this.regularDayUpdate = false;
    }


    if (this.taskData) {
      if (this.taskData.term !== 'Monthly' && term === 'Monthly') {
        this.selectedMonth_day = ''; // Reset value
      }

      else if (this.taskData.term !== 'Yearly' && term === 'Yearly') {
        this.selectedMonth_day = null; // Reset value
       
      }
    }

    // console.log('this.selectedMonth_day onTermSelect', this.selectedMonth_day)
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }


  removeFile() {
    this.taskData.filE_NAME = null;
    this.taskData.filE_PATH = null;
  }


  fileUrl(task_mkey: any) {
    if (!this.file) {
        // console.error('File is not defined');
        return ''; // or return a default URL
    }
    return `${this.baseURL}//Attachment/${task_mkey}/${this.file.name}`;
}


  
  initializeSelectedDays(taskData: RecursiveTaskData): void {

    if (taskData) {
      const days = [
        taskData.attributE1,
        taskData.attributE2,
        taskData.attributE3,
        taskData.attributE4,
        taskData.attributE5,
        taskData.attributE6,
        taskData.attributE7,
      ];
      days.forEach(day => {
        if (day) {
          this.selectedDays.add(day);
        }
      });
    }
    const selectedDates = Array.from(this.selectedDays);
    this.recursiveTaskForm.patchValue({ setWeekDays: selectedDates.join(" , ") });

  }


  onDateChange(date: string) {
    // Handle date changes without affecting the term value
    this.recursiveTaskForm.get('endDate')?.setValue(date);
  }






  onSubmit() {

    // console.log('coming to submit')


    const formValues = this.recursiveTaskForm.value;

    const controlErrors: string[] = [];
    const fieldErrors: string[] = [];

    const terms = formValues.repeatTerm;

    const currentDate: any = new Date();
    const startDate = new Date(formValues.startDate);
    const endDate = new Date(formValues.endDate);

    const startDate_new: any = this.formatDateForInput(formValues.staDate_new);
    const endDate_new = this.formatDateForInput(formValues.endDate_new);

    const task_start_date: any = this.formatDateForInput(this.taskData?.starT_DATE);
    const task_end_date = this.formatDateForInput(this.taskData?.enD_DATE);

    const curren_date_format: any = this.formatDateForInput(currentDate)

    const addControlError = (message: string) => controlErrors.push(message);
    const addFieldError = (message: string) => fieldErrors.push(message);


  

    const { termType, repeatTerm } = formValues;

 
    
    const clearFields = {
      Weekly: () => this.recursiveTaskForm.patchValue({ setWeekDays: '' }),
      Monthly: () => this.recursiveTaskForm.patchValue({ selectMonthDay: '' }),        
    };

    // console.log('check term type',termType)



    Object.entries(clearFields).forEach(([key, action]) => {
      if (termType !== key) action();
      // console.log('check term type from entries',termType)

    });

  

    if (termType !== 'Daily' && repeatTerm !== "1") {
      this.recursiveTaskForm.patchValue({ repeatTerm: "1" });
    }

    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };

    const validateRequiredControls = (excludedControls: string[] = []) => {
      const keys = Object.keys(this.recursiveTaskForm.controls).filter(controlName => !excludedControls.includes(controlName));

      keys.forEach(controlName => {
        const control = this.recursiveTaskForm.get(controlName);
        if (control?.errors?.required) {
          const formattedControlName = convertToTitleCase(controlName);
          if (formattedControlName === 'Start Date is required') {
            addControlError('Start date is invalid or empty');
          } else if (formattedControlName === 'End Date is required') {
            addControlError('End date is invalid or empty');
          } else {
            addControlError(formattedControlName);
          }
        }
      });
    };

    let excludedControls: string[] = [];

    // Check if taskData is defined and has mkey
    // if (this.taskData && (this.taskData.mkey || this.taskData.mkey !== undefined)) {
      if (termType !== 'Yearly') {
        switch (termType) {
          case 'Daily':
            excludedControls = ['selectMonthDay', 'setWeekDays'];
            break;
          case 'Weekly':
            excludedControls = ['selectMonthDay'];
            break;
          case 'Monthly':
            excludedControls = ['setWeekDays'];
            break;
          // case 'Yearly':
          //   excludedControls = ['setWeekDays'];
          //   break;
        }
      }
    
      if (termType === 'Yearly') {
        console.log('check term type year', termType);
        switch (termType) {
          case 'Yearly':
            excludedControls = ['setWeekDays', 'selectMonthDay'];
            break;
        }
      }
    //} 
    
    
    // else if (!this.taskData || !this.taskData.mkey) {
    //   switch (termType) {
    //     case 'Daily':
    //       excludedControls = ['selectMonthDay', 'setWeekDays'];
    //       break;
    //     case 'Weekly':
    //       excludedControls = ['selectMonthDay'];
    //       break;
    //     case 'Monthly':
    //       excludedControls = ['setWeekDays'];
    //       break;
    //     case 'Yearly':
    //       excludedControls = ['setWeekDays', 'selectMonthDay'];
    //       break;
    //   }
    // }  
  

    validateRequiredControls(excludedControls);

    const hasRequiredTaskFields = formValues.taskName.trim() !== '' && formValues.taskDescription.trim() !== '';
    if (['Daily', 'Weekly', 'Monthly' ].includes(termType) && !hasRequiredTaskFields) {
      addFieldError('Empty Fields not accepted');
    }

    currentDate.setDate(currentDate.getDate() - 1);

  


    if (startDate_new === '' || startDate_new === 'Invalid Date') {   //add
      if ((startDate < currentDate) && (endDate < currentDate) && this.selectedRadio !== 'never') {
        addControlError('Start date and End Date can\'t be a past date');
      } else if (startDate < currentDate) {
        addControlError('Start Date can\'t be a past date');
      } else if (startDate > endDate) {
        addControlError('End date should be greater or equal to start date');
      } else if (endDate < currentDate && this.selectedRadio !== 'never') {
        addControlError('End Date can\'t be a past date');
      } else if (terms <= 0) {
        addControlError('Repeat term should be greater than 0');
      } else if (terms > 20) {
        addControlError('Max repeat terms accepted is 20');
      }
    }


    if (startDate_new !== 'Invalid Date') {  //save


      if (startDate_new !== task_start_date) {
        if (startDate_new < curren_date_format) {
          addControlError('Set start date at least in current or future date');
        } else if (startDate_new > endDate_new && this.selectedRadio !== 'never') {
          addControlError('End date should be greater or equal to start date');
        } else if (endDate_new < curren_date_format && this.selectedRadio !== 'never') {
          addControlError('End Date can\'t be a past date');
        }
      } else if (startDate_new > endDate_new && this.selectedRadio !== 'never') {
        addControlError('End date should be greater or equal to start date');
      } else if (endDate_new < curren_date_format && this.selectedRadio !== 'never') {
        addControlError('End Date can\'t be a past date');
      } else if (terms <= 0) {
        addControlError('Repeat term should be greater than 0');
      } else if (terms > 20) {
        addControlError('Max repeat terms accepted is 20');
      } else if(termType === 'Yearly' && this.selectedMonth_day === null){
        addControlError('Please select day for year');
      }

    }

    if (controlErrors.length > 0) {
      this.tostar.error(controlErrors.join(' , '));
      return false;  // Indicate validation failed
    } else if (fieldErrors.length > 0) {
      this.tostar.error(fieldErrors.join(' , '));
      return false;  // Indicate validation failed
    }

    return true;  // Indicate validation passed
  }

 

  onSubmitYearly() {
    // console.log('Submitting Yearly Task');

    const formValues = this.recursiveTaskForm.value;
    const controlErrors:any = [];
    const fieldErrors:any = [];

    const terms = formValues.repeatTerm;

    const currentDate:any = new Date();
    const startDate = new Date(formValues.startDate);
    const endDate = new Date(formValues.endDate);

    const startDate_new = this.formatDateForInput(formValues.staDate_new);
    const endDate_new = this.formatDateForInput(formValues.endDate_new);

    const curren_date_format = this.formatDateForInput(currentDate);
    const task_start_date: any = this.formatDateForInput(this.taskData?.starT_DATE);

    currentDate.setDate(currentDate.getDate() - 1);


    const addControlError = (message:any) => controlErrors.push(message);
    const addFieldError = (message:any) => fieldErrors.push(message);

    // Convert to title case
    const convertToTitleCase = (input:any) => {
        return input.replace(/([A-Z])/g, ' $1').replace(/^./, (str:any) => str.toUpperCase()).trim() + ' is required';
    };

    // Validate required fields, excluding irrelevant fields for Yearly
    const validateRequiredControls = () => {
        const excludedControls = ['setWeekDays'];
        const keys = Object.keys(this.recursiveTaskForm.controls).filter(controlName => !excludedControls.includes(controlName));
        keys.forEach(controlName => {
            const control = this.recursiveTaskForm.get(controlName);
            if (control?.errors?.required) {
                const formattedControlName = convertToTitleCase(controlName);
                addControlError(formattedControlName);
            }
        });
    };

    validateRequiredControls();

    // Common validation for task name and description
    const hasRequiredTaskFields = formValues.taskName.trim() !== '' && formValues.taskDescription.trim() !== '';
    if (!hasRequiredTaskFields) {
        addFieldError('Empty Fields not accepted');
    }

    // Yearly specific date validation
    if (startDate_new === '' || startDate_new === 'Invalid Date') {   //add
      if ((startDate < currentDate) && (endDate < currentDate) && this.selectedRadio !== 'never') {
        addControlError('Start date and End Date can\'t be a past date');
      } else if (startDate < currentDate) {
        addControlError('Start Date can\'t be a past date');
      } else if (startDate > endDate) {
        addControlError('End date should be greater or equal to start date');
      } else if (endDate < currentDate && this.selectedRadio !== 'never') {
        addControlError('End Date can\'t be a past date');
      } else if (terms <= 0) {
        addControlError('Repeat term should be greater than 0');
      } else if (terms > 20) {
        addControlError('Max repeat terms accepted is 20');
      }
    }


  

    if (controlErrors.length > 0) {
        this.tostar.error(controlErrors.join(' , '));
        return false;  
    } else if (fieldErrors.length > 0) {
        this.tostar.error(fieldErrors.join(' , '));
        return false;  
    }

    return true; 
}



onSubmitAddYear(){
  const isValid = this.onSubmitYearly();

  if (isValid) {
    const formValues = this.recursiveTaskForm.value;
    const successMessageMap: any = {
     
      'Yearly': 'Yearly recursion task added'
    };

    const successMessage = successMessageMap[formValues.termType];

    if (successMessage) {
      this.tostar.success('Successfully !!', successMessage);
      this.addRecursiveData();

    }
  }
}

  onSubmitAdd() {


    const isValid = this.onSubmit();

    if (isValid) {
      const formValues = this.recursiveTaskForm.value;
      const successMessageMap: any = {
        'Daily': 'Daily recursion task added',
        'Year': 'Yearly recursion task added',
        'Weekly': 'Weekly recursion task added',
        'Monthly': 'Monthly recursion task added'
      };

      const successMessage = successMessageMap[formValues.termType];

      if (successMessage) {
        this.tostar.success('Successfully !!', successMessage);
        // this.router.navigate(['/task/task-management']);
        this.addRecursiveData();

      }
    }
  }

  onSubmitUpdate() {
    const isValid = this.onSubmit();



    if (isValid) {
      const formValues = this.recursiveTaskForm.value;
      const successMessageMap: any = {
        'Daily': 'Daily recursion task updated',
        'Yearly': 'Yearly recursion task updated',
        'Weekly': 'Weekly recursion task updated',
        'Monthly': 'Monthly recursion task updated'
      };

      const successMessage = successMessageMap[formValues.termType];

      if (successMessage) {
        this.tostar.success('Success', successMessage);
        // this.router.navigate(['/task/task-management']);
        this.updateRecursiveData();

      }
    }
  }


  formatDate(date: any) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }


  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }

}






