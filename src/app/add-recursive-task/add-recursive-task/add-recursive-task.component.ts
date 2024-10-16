import { Component, ErrorHandler, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
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


  get_Months_from_multiselect: any;

  //Form 
  recursiveTaskForm: FormGroup | any;

  //tags
  tags: any[] = [];
  allTags: any[] = [];
  selectedTags: any[] = [];
  selectedMonths: string[] = [];

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
  selectedTerm: string = 'Day';
  minDate: string | any;

  repeat_type: any[] = [
    { value: '1', type: 'Day' },
    { value: '2', type: 'Week' },
    { value: '3', type: 'Month' },
    // { value: '4', type: 'Year' },
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
    { type: 'Day 31' },
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
      console.log('RecursiveTaskData', RecursiveTaskData)
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



    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    if (this.taskData?.ends) {
      this.selectedRadio = this.taskData.ends;
    } else {
      this.selectedRadio = 'never'; // Default value
    }

    if (this.taskData?.term === 'Week') {
      this.onTermSelect('Week')
      this.initializeSelectedDays(this.taskData);
    } else if (this.taskData?.term === 'Month') {
      this.onTermSelect('Month')
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

    console.log('month_index', month_index)

    if (this.taskData?.term === 'Month') {
      month_day = 'Day ' + month_index;
    }

    this.selectedMonth_day = month_day;

    console.log('this.selectedMonth_day', this.selectedMonth_day)

    this.recursiveTaskForm = this.formBuilder.group({
      taskName: [this.taskData?.tasK_NAME || '', [Validators.required, Validators.maxLength(8)]],
      taskDescription: [this.taskData?.tasK_DESCRIPTION || '', Validators.required],
      repeatTerm: [this.taskData?.repeatTerm || '1', Validators.required],
      termType: [this.taskData?.term || 'Day', Validators.required],
      startDate: [this.formatDateForInput(this.taskData?.starT_DATE) || '', [Validators.required]],
      staDate_new: [this.formatDateForInput(this.taskData?.starT_DATE)],
      endDate: [this.formatDateForInput(this.taskData?.enD_DATE) || "00-00-0000", [Validators.required]],
      endDate_new: [this.formatDateForInput(this.taskData?.enD_DATE) || endDateNew],
      term: [this.taskData?.ends || 'never'],
      setWeekDays: ['', Validators.required],
      selectMonthDay: [this.selectedMonth_day || '', Validators.required],
    });

  }



  //Add
  addRecursiveData() {

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
    console.log('monthDayIndex: ', monthDayIndex.toString());
    const attributes = new Array(16).fill('');

    if (term_type === 'Week') {
      weekDays.forEach((day: string) => {
        const index = this.weekDays.indexOf(day);
        if (index !== -1) {
          attributes[index] = day;
        }
      });
    }

    if (term_type === 'Month') {
      monthDays.forEach((month: string) => {
        const monthIndex = monthMapping[month];
        if (monthIndex && monthIndex + 1 <= 13) { // Ensure we don't exceed attribute12
          attributes[monthIndex] = monthIndex.toString(); // Store the month number
          console.log('attributes[monthIndex]', attributes[monthIndex])
        }
      });
    }

    const monthDayIndexArray = Array.isArray(monthDayIndex) ? monthDayIndex : [monthDayIndex];

    let attribute0 = '';
    let attribute13 = '';

    if (term_type === 'Day') {
      attribute13 = repeat_term.toString(); // Set attribute13 for days
    } else if (term_type === 'Month') {
      // Check if December is selected
      if (attributes[12] === '12') {
        attribute13 = '12'; // Set attribute13 to 12 for December
      } else {
        attribute13 = ''; // Set attribute13 to empty if December is not selected
      }
      attribute0 = monthDayIndexArray.join(','); // Or modify as needed
    } else {
      attribute0 = attributes[0] || ''; // Default to first attribute if not day or month
    }

    console.log('Final attribute13:', attribute13); // Debugging line


    console.log('Value to Pass:', attribute0);

    const addRecursiveTask = {
      tasK_NAME: this.recursiveTaskForm.get('taskName')?.value,
      tasK_DESCRIPTION: this.recursiveTaskForm.get('taskDescription')?.value,
      term: this.recursiveTaskForm.get('termType')?.value,
      starT_DATE: this.formatDateForInput(startDate),
      ends: this.recursiveTaskForm.get('term').value,
      enD_DATE: endDateStr,//this.formatDateForInput(this.recursiveTaskForm.get('endDate')?.value),
      createD_BY: data[0]?.MKEY.toString(),
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
      attributE16: USER_CRED.MKEY.toString(),
      attributE14: "Add",
      attributE15: "Add Button"
    }

    console.log('addRecursiveTask: ', addRecursiveTask)


    this.apiService.addRecursiveTask(addRecursiveTask, this.recursiveLogginUser).subscribe({
      next: (addData: RecursiveTaskData) => {        
        console.log('addData', addData)

        this.router.navigate(['/task/recursive-task'])

      }, error: (error) => {
        console.error('Error updating task:', error);
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

    let endDateStr: string | null = null;

    if (this.selectedRadio === 'never') {
      endDateStr = null;
    } else if (this.selectedRadio === 'on' || this.selectedRadio === undefined) {
      endDateStr = this.formatDate(new Date(endDate));
    }

    const weekDays = formValues.setWeekDays.split(' , ');
    const monthDays: any = this.get_Months_from_multiselect;

    console.log('weekDays from updates', weekDays)
    console.log('monthDays from updates', monthDays)

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

    console.log('monthDayIndex', monthDayIndex.toString())
    const attributes = new Array(16).fill('');

    if (term_type === 'Week') {
      weekDays.forEach((day: string) => {
        const index = this.weekDays.indexOf(day);
        if (index !== -1) {
          attributes[index] = day;
        }
      });
    }



    // Set selected months to the attributes array
    if (term_type === 'Month') {
      monthDays.forEach((month: string) => {
        const monthIndex = monthMapping[month];
        if (monthIndex && monthIndex + 1 <= 13) { 
          attributes[monthIndex] = monthIndex.toString(); // Store the month number
          // console.log('attributes[monthIndex]', attributes[monthIndex])
        }
      });
    }



    const monthDayIndexArray = Array.isArray(monthDayIndex) ? monthDayIndex : [monthDayIndex];

    console.log('Selected monthDayIndexArray:', monthDayIndexArray); // Debugging line

    let attribute0 = '';
    let attribute13 = '';

    if (term_type === 'Day') {
      attribute13 = repeat_term.toString(); // Set attribute13 for days
    } else if (term_type === 'Month') {
      // Check if December is selected
      if (attributes[12] === '12') {
        attribute13 = '12'; // Set attribute13 to 12 for December
      } else {
        attribute13 = ''; 
      }      
      attribute0 = monthDayIndexArray.join(','); // Or modify as needed
      console.log('check month attribute0',attribute0)
    } else {
      attribute0 = attributes[0] || ''; // Default to first attribute if not day or month
    }

    console.log('Final attribute13:', attribute13); // Debugging line


    console.log('Value to Pass attributE13:', attribute13);

    console.log('attributes[12]', attributes[12])


    const updateRecursiveTask: any = {
      mkey: this.taskData.mkey,
      tasK_NAME: this.recursiveTaskForm.get('taskName')?.value,
      tasK_DESCRIPTION: this.recursiveTaskForm.get('taskDescription')?.value,
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
      attributE16: USER_CRED.MKEY.toString(),
      attributE14: "Save",
      attributE15: "Save Button"
    };


    console.log('updateRecursiveTask: ', updateRecursiveTask)

    this.apiService.updateRecursiveTask(this.taskData.mkey, updateRecursiveTask, this.recursiveLogginUser).subscribe({
      next: (updateData: RecursiveTaskData) => {

        this.router.navigate(['/task/recursive-task'])

        console.log('Task updated successfully:', updateData);
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }


  onDayChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    this.selectedMonth_day = selectedValue;

    const formValues = this.recursiveTaskForm.value;

    if (formValues.termType === 'Week') {
      this.toggleWeekDaySelection(selectedValue);
    } else if (formValues.termType === 'Month') {
      this.selectedMonthDay = selectedValue;
      this.toggleMonthDaySelection(selectedValue);
    }
  }


  toggleWeekDaySelection(day: string): void {

    if (this.selectedDays.has(day)) {
      this.selectedDays.delete(day);
    } else {
      this.selectedDays.add(day);
    }

    const selectedDates = Array.from(this.selectedDays);
    this.recursiveTaskForm.patchValue({ setWeekDays: selectedDates.join(" , ") });
  }



  toggleMonthDaySelection(month: string) {

    const formValues = this.recursiveTaskForm.value;
    const startDate_new: any = new Date(formValues.staDate_new);

    const MKEY = this.taskData?.mkey



    let start_date = this.recursiveTaskForm.value.startDate;
    let start_date_new = this.formatDate(startDate_new);

    if (!start_date) {
      start_date = new Date().toISOString().split('T')[0];
    }

    if (!MKEY) {

      console.log('coming to !MKEY');
      const startDate = new Date(start_date);
      const startMonth = startDate.getMonth(); // 0-based index
      const startYear = startDate.getFullYear();

      const monthDayIndex: any = parseInt(month.replace('Day', '').trim(), 10);  //month === 'Day 31' ? null :
      const lastDayOfMonth = new Date(startYear, startMonth + 1, 0).getDate();

      if (month === 'Day 31') {

        this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth.toString() });
        return lastDayOfMonth;
      } else if (monthDayIndex < lastDayOfMonth) {
        this.recursiveTaskForm.patchValue({ selectMonthDay: monthDayIndex.toString() });
        return monthDayIndex;
      } else {
        this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth.toString() });
        return lastDayOfMonth;
      }

    } else if (MKEY) {
      console.log('coming to MKEY');

      const startDate_new = new Date(start_date_new);
      console.log('startDate_new', startDate_new)
      const startMonth_new = startDate_new.getMonth(); // 0-based index
      const startYear_new = startDate_new.getFullYear();

      const monthDayIndex: any = parseInt(month.replace('Day', '').trim(), 10);  //month === 'Day 31' ? null :

      console.log('monthDayIndex', monthDayIndex)

      const lastDayOfMonth = new Date(startYear_new, startMonth_new + 1, 0).getDate();

      if (month === 'Day 31') {
        this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth.toString() });
        return lastDayOfMonth;
      } else if (monthDayIndex < lastDayOfMonth) {
        this.recursiveTaskForm.patchValue({ selectMonthDay: monthDayIndex.toString() });
        return monthDayIndex;
      } else {
        this.recursiveTaskForm.patchValue({ selectMonthDay: lastDayOfMonth.toString() });
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


  descriptionMaxLength() {
    return this.recursiveTaskForm.get('taskDescription').value.length >= 1000;
  }

  taskNameMaxLength() {
    return this.recursiveTaskForm.get('taskName').value.length >= 150;
  }


  onTermSelect(selectElement: any) {

    const term = selectElement.value

    if (term === 'Day') {
      this.regularDayUpdate = true;
      this.selectMonth = false;
      this.selectWeek = false;
    } else if (term === 'Week' || selectElement === 'Week') {
      this.selectMonth = false;
      this.selectWeek = true;
      this.regularDayUpdate = false;
    } else if (term === 'Month' || selectElement === 'Month') {
      this.selectMonth = true;
      this.selectWeek = false;
      this.selectedMonth_day = 'Day ' + this.taskData?.attributE1
      this.regularDayUpdate = false;
    } else if (term === 'Year') {
      this.selectMonth = false;
      this.selectWeek = false;
      this.regularDayUpdate = false;
    }
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
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
      Week: () => this.recursiveTaskForm.patchValue({ setWeekDays: '' }),
      Month: () => this.recursiveTaskForm.patchValue({ selectMonthDay: '' }),
    };

    Object.entries(clearFields).forEach(([key, action]) => {
      if (termType !== key) action();
    });

    if (termType !== 'Day' && repeatTerm !== "1") {
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
    if (termType === 'Day' || termType === 'Year') {
      excludedControls = ['setWeekDays', 'selectMonthDay'];
    } else if (termType === 'Week') {
      excludedControls = ['selectMonthDay'];
    } else if (termType === 'Month') {
      excludedControls = ['setWeekDays'];
    }

    validateRequiredControls(excludedControls);

    const hasRequiredTaskFields = formValues.taskName.trim() !== '' && formValues.taskDescription.trim() !== '';
    if (['Day', 'Week', 'Month', 'Year'].includes(termType) && !hasRequiredTaskFields) {
      addFieldError('Empty Fields not accepted');
    }

    currentDate.setDate(currentDate.getDate() - 1);

    // console.log('startDate', startDate)
    // console.log('endDate', endDate)
    // console.log('startDate_new', startDate_new)
    // console.log('endDate_new', endDate_new)
    // console.log('task_start_date: ', task_start_date);
    // console.log('task_end_date: ', task_end_date)
    // console.log('current_date', curren_date_format)


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
        } else if (endDate_new < curren_date_format) {
          addControlError('End Date can\'t be a past date');
        }
      } else if (startDate_new > endDate_new && this.selectedRadio !== 'never') {
        addControlError('End date should be greater or equal to start date');
      } else if (endDate_new < curren_date_format) {
        addControlError('End Date can\'t be a past date');
      } else if (terms <= 0) {
        addControlError('Repeat term should be greater than 0');
      } else if (terms > 20) {
        addControlError('Max repeat terms accepted is 20');
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


  onSubmitAdd() {
    const isValid = this.onSubmit();

    if (isValid) {
      const formValues = this.recursiveTaskForm.value;
      const successMessageMap: any = {
        'Day': 'Day wise recursion task added',
        'Year': 'Yearly recursion task added',
        'Week': 'Weekly recursion task added',
        'Month': 'Monthly recursion task added'
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
        'Day': 'Day wise recursion task updated',
        'Year': 'Yearly recursion task updated',
        'Week': 'Weekly recursion task updated',
        'Month': 'Monthly recursion task updated'
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






