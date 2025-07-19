import { Component, ErrorHandler, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ApiService } from 'src/app/services/api/api.service';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { stringify, validate } from 'uuid';
import { event } from 'jquery';

type AOA = any[][];

interface fileTaskData {
  wbs: string;
  Name: string;
  Duration: string;
  Start_Date: string;
  Finish_Date: string;
  Predecessors: string | null;
  Resource_Names: string;
  Text1: string;
  Outline_Level: number;
  Number1: number;
  Unique_ID: number;
  //percentComplete: number;
}




@Component({
  selector: 'app-project-upload',
  templateUrl: './project-upload.component.html',
  styleUrls: ['./project-upload.component.css']
})

export class ProjectUploadComponent implements OnInit {

  //@Input() type!: string;

  searchText: string = '';

  data: AOA = [];
  project: any = [];
  sub_proj: any = [];
  subTasks: any = [];
  tasksWithoutWbs: any = [];

  incorrect_feild_update: Array<any> = [];  // Ensure this is an array of objects

  receivedUser: any;
  excelHeader: any;

  file: File | null = null;
  procedureDisable: boolean = true;
  fileExtension: string | any;

  loading = false;
  extractFile = false;
  extractExistingFile = false;
  noFileExist = false;
  disableSubmit = true;
  fileTab = false;
  closeExistingFilePopup = false;
  lodingTrue = false;
  hideCancel = false;
  hideSubmit = true;

  fileTaskForm: FormGroup | any

  remove_column_data: any;
  uploadedData: any

  error: number | any;
  no_error: number | any;

  hasValidationError: boolean = false;


  constructor(
    private credentialService: CredentialService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    @Inject('type') public type: 'upload' | 'modify'
  ) {

    if (this.type === 'modify') {
      this.noFileExist = true;
      this.fileTab = false;
      this.disableSubmit = false;
    }

  }


  ngOnInit(): void {
    this.fetchProjectData();
    this.FileTaskForm();

  }



  FileTaskForm() {
    this.fileTaskForm = this.fb.group({
      property: ['', Validators.required],
      building: ['', Validators.required],
      mppName: ['', Validators.required],
      ExcelFile: ['', Validators.required]
    })
  }

  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getProjectDetailsNew(token).subscribe(
      (response: any) => {
        this.project = response[0].data;
      },
      (error: ErrorHandler | any) => {
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.toastr.error(errorMessage, 'Error Occured in server')
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
          // console.log(response)
          this.sub_proj = response[0]?.data;
          // this.raisedAtListCheck()

        },
        (error: ErrorHandler | any) => {
          const errorData = error.error.errors;
          const errorMessage = Object.values(errorData).flat().join(' , ');
          this.toastr.error(errorMessage, 'Error Occured in server')
        }
      );
    }
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  uploadExcelFile(event: Event | any | null) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      //this.toastr.warning('No file selected');
      return;
    }

    this.file = inputElement.files[0];
    const fileName = this.file.name;
    this.fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

    const labelElement = document.getElementById('TaskAttachmentDetails');
    if (labelElement) {
      labelElement.textContent = `Attachment: ${fileName}`;
    }
  }


  async readFileData() {

    const requiredControls: string[] = [];
    const requiredFields: string[] = [];


    // let requiredMessage: string = 'Following fields are required: ';

    //const formValues = this.fileTaskForm.value;  


    const addControlError = (message: string) => requiredControls.push(message);
    const addFieldError = (message: string) => requiredFields.push(message);



    const convertToTitleCase = (input: string) => {
      const titleCase = input.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
      return titleCase + ' is required'
    };

    Object.keys(this.fileTaskForm.controls).forEach(controlName => {
      const control = this.fileTaskForm.get(controlName);

      if (control?.errors?.required) {
        // Convert camelCase to Title Case
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });

    if (requiredControls.length > 0) {
      const m = `${requiredControls.join(' , ')}`;
      this.toastr.error(`${m}`);
      return;
    }

    if (requiredFields.length > 0) {
      const m = `${requiredFields.join(' , ')}`;
      this.toastr.error(`${m}`);
      return;
    }
    if (!this.file) {
      //this.toastr.warning('No file selected to read');
      return;
    }



    this.loading = true;

    if (!['csv', 'xls', 'xlsx'].includes(this.fileExtension)) {
      this.toastr.warning('Only Excel files are allowed');
      this.loading = false;
      return;
    } else {

      this.toastr.success('Excel file uploaded');
    }

    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(this.file);
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      this.data = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      //console.log('Data: ', this.data)

      this.data = this.data.map(row =>
        row.map(cell => {
          if (typeof cell === 'string' && this.isDateString(cell)) {
            const parsedDate = this.parseDate(cell);
            return parsedDate ? this.formatDateToDDMMYYYY(parsedDate) : cell;
          }
          return cell;
        })
      )
        .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

      this.extractFileData(this.data);

    } catch (error) {
      this.toastr.error('Error reading file');
    } finally {
      this.loading = false;
      this.procedureDisable = false;
    }

    this.hideCancel = true;
    this.hideSubmit = false;
  }


  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  private parseDate(input: string): Date | null {
    const parsedDate = new Date(input);
    return !isNaN(parsedDate.getTime()) ? parsedDate : null;
  }

  private formatDateToDDMMYYYY(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  private isDateString(value: string): boolean {

    if (value.includes('.')) {
      return false;
    }
    const dateRegex = /^(?:(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4}|\d{4}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{1,2}|\d{2,4}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{1,2})|\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})(\s+\d{1,2}:\d{2}(\s*[AP]{1}[M]{1})?)?$|(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\D?$|(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\s*[\w\W]?$|(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\s*[\s\S]?$/;
    return dateRegex.test(value);
  }


  extractFileData(data: any[][]): fileTaskData[] {

    // console.log('extractFileData: ', data);

    const Project = Number(this.fileTaskForm.get('property')?.value);
    const Sub_Project = Number(this.fileTaskForm.get('building')?.value);
    const Mpp_Name = this.fileTaskForm.get('mppName')?.value;
    const Created_By = this.credentialService.getUser()[0].MKEY;
    const Updated_By = this.credentialService.getUser()[0].MKEY;
    const Creation_Date = new Date().toISOString();
    const Updation_Date = new Date().toISOString();
    const fileName = this.file?.name
    const Process_Flag = 'N';


    //console.log('File name: ', this.file?.name)

    const extractedFileData: fileTaskData[] = data.map(
      ([
        wbs,
        Name,
        Duration,
        Start_Date,
        Finish_Date,
        Predecessors,
        Resource_Names,
        Text1,
        Outline_Level,
        Number1,
        Unique_ID,
        Percent_Complete,

      ]) => ({
        wbs,
        Name,
        Duration,
        Start_Date: Start_Date || '',
        Finish_Date: Finish_Date || '',
        Predecessors: Predecessors || '',
        Resource_Names,
        Text1,
        Outline_Level: Number(Outline_Level),
        Number1: Number(Number1),
        Unique_ID: Number(Unique_ID),
        Percent_Complete: Percent_Complete,
        Project,
        Sub_Project,
        Created_By,
        Updated_By,
        Process_Flag,
        Creation_Date,
        Updation_Date,
        Mpp_Name,
        fileName
      })
    );

    //console.log('extracted file data', extractedFileData);

    const header: any = [
      data[0][0],
      data[0][1],
      data[0][2],
      data[0][3],
      data[0][4],
      data[0][5],
      data[0][6],
      data[0][7],
      data[0][8],
      data[0][9],
      data[0][10],
      'Percent_Complete_d',
      'Remarks'
    ].map(String);

    const remove_column_data = extractedFileData.slice(1);

    //console.log('remove_column_data', remove_column_data)

    const uploaded_data = remove_column_data.map((item: any) => [

      item.wbs,
      item.Name,
      item.Duration,
      item.Start_Date,
      item.Finish_Date,
      item.Predecessors,
      item.Resource_Names,
      item.Text1,
      item.Outline_Level,
      item.Number1,
      item.Unique_ID,
      item.Percent_Complete
    ].map(String));

    uploaded_data.unshift(header);

    this.uploadedData = uploaded_data

    //this.data = check
    this.remove_column_data = remove_column_data
    this.getTree(this.remove_column_data);

    //this.checkSub(remove_column_data)
    return extractedFileData;
  }

  updateTaskDates(): void {

    const validWbsRegex = /^([1-9]\d*)(\.([1-9]\d*))*$/;

    // Step 1: Sort the data based on WBS
    this.remove_column_data.sort((a: any, b: any) => {
      if (a.wbs !== undefined) {
        a.wbs.localeCompare(b.wbs);
      }
    });

    //console.log('check the remove_column_data: ', this.remove_column_data);

    // Step 2: Update the Start and Finish Dates for each task
    this.remove_column_data.forEach((task: any) => {

      if (!validWbsRegex.test(task.wbs) || !validWbsRegex.test(task.wbs)) {
        let outlineLevelError = `Please provide correct WBS number "${task.wbs}".`;
        this.hasValidationError = true;
        this.incorrect_feild_update.push({
          errorType: 'Outline Level Error',
          message: outlineLevelError,
          taskWbs: task.wbs,
          parentWbs: task.wbs,
        });
      }



      // const taskStartDate_new = new Date(task.Start_Date);
      // const taskFinishDate_new = new Date(task.Finish_Date);

      // const currentDate = new Date();
      // currentDate.setHours(0, 0, 0, 0); // uncomment if you want to ignore time part

      // const isStartDatePast = taskStartDate_new && taskStartDate_new < currentDate;
      // const isFinishDatePast = taskFinishDate_new && taskFinishDate_new < currentDate;

      // if (isStartDatePast && isFinishDatePast) {
      //   console.log(`❌ Both Start and Finish Dates are in the past. Start: ${taskStartDate_new}, Finish: ${taskFinishDate_new}, Current: ${currentDate}`);
      //   this.hasValidationError = true;
      //   this.incorrect_feild_update.push({
      //     errorType: 'Date in Past',
      //     message: `Start Date and Finish Date for Task "${task.wbs}" cannot be in the past.`,
      //     taskWbs: task.wbs,
      //   });
      // } else {
      //   if (isStartDatePast) {
      //     //console.log(`❌ Start Date in past: ${taskStartDate_new}, Current: ${currentDate}`);
      //     this.hasValidationError = true;
      //     this.incorrect_feild_update.push({
      //       errorType: 'Date in Past',
      //       message: `Start Date for Task "${task.wbs}" cannot be in the past.`,
      //       taskWbs: task.wbs,
      //     });
      //   }

      //   if (isFinishDatePast) {
      //     //console.log(`❌ Finish Date in past: ${taskFinishDate_new}, Current: ${currentDate}`);
      //     this.hasValidationError = true;
      //     this.incorrect_feild_update.push({
      //       errorType: 'Date in Past',
      //       message: `Finish Date for Task "${task.wbs}" cannot be in the past.`,
      //       taskWbs: task.wbs,
      //     });
      //   }
      // }
      

      const validateField = (taskValue: any, field: string, errorType: string) => {
        // console.log('Check taskValue',taskValue)
        if (taskValue === undefined || taskValue === '') {
          let errorMessage = `${field} for task "${task.wbs}" is empty or invalid.`;
          this.hasValidationError = true;
          this.incorrect_feild_update.push({
            errorType: errorType,
            message: errorMessage,
            taskWbs: task.wbs,
            // parentWbs: parentTask.wbs,
          });
          // this.toastr.error(errorMessage, `${field} Validation Failed`);
        }
      };

      if (this.type === 'upload') {
        if (task.Number1 !== 0 && task.Number1 !== '0') {
          let errorMessage = `For task "${task.wbs}" Number1 should be 0`;
          this.hasValidationError = true;
          this.incorrect_feild_update.push({
            errorType: 'Number 1 should be zero for type upload',
            message: errorMessage,
            taskWbs: task.wbs,
          });
        }

        // if(task.Percent_Complete != 0 || task.Percent_Complete != '0'){
        //   let errorMessage = `For task "${task.wbs}" percent complete column should be 0`;
        //   this.hasValidationError = true;
        //   this.incorrect_feild_update.push({
        //     errorType: 'Percent should be zero for type upload',
        //     message: errorMessage,
        //     taskWbs: task.wbs,
        //   });
        // }
      }else if(this.type === 'modify') {
       //console.log('Check Progress perc: ', task.Percent_Complete)
      //  if (task.Percent_Complete === null || task.Percent_Complete === "" || task.Percent_Complete === undefined) {
      //     let errorMessage = `For task "${task.wbs}" percent complete at least should be 0`;
      //     this.hasValidationError = true;
      //     this.incorrect_feild_update.push({
      //       errorType: 'Percent at least zero.',
      //       message: errorMessage,
      //       taskWbs: task.wbs,
      //     });
      //   }

        // if (task.Number1 === 0 || task.Number1 === '0') {
        //   // this.hasValidationError = true;
        //   let errorMessage = `For task "${task.wbs}", please provide the correct Number1 or a non-zero value`;
        //   this.incorrect_feild_update.push({
        //     errorType: 'Number 1 should be non-zero for non-upload types',
        //     message: errorMessage,
        //     taskWbs: task.wbs,
        //   });
        // }
      }

      //console.log('Check the task keys: ', task)
      validateField(task.Duration, 'Duration', 'Invalid Duration');
      validateField(task.Name, 'Name', 'Invalid Name');
      validateField(task.Resource_Names, 'Resource Names', 'Invalid Resource Names');
      validateField(task.Text1, 'Text1', 'Invalid Text1');
      validateField(task.Number1, 'Number1', 'Invalid Number1');
      validateField(task.Start_Date, 'Start_Date', 'Invalid Start date');
      validateField(task.Finish_Date, 'Finish_Date', 'Invalid Finish date');
      // validateField(task.wbs, parentTask.wbs, 'WBS', 'Invalid WBS provided')
      // console.log('inside updateTaskDate: ', this.remove_column_data)
      const parentTask = this.getParentTask(task);
      if (parentTask) {

        this.validateDates(task, parentTask);
      }
    });
  }



  validateDates(task: any, parentTask: any): void {
    this.validateOutlineLevels(task, parentTask);
    this.validateWbs(task, parentTask);
    this.validateTaskDates(task, parentTask);
    this.validateParentDates(parentTask);
  }

  private validateOutlineLevels(task: any, parentTask: any): void {
    if (isNaN(task.Outline_Level)) {
      const message = `The outline level for task "${task.wbs}" is not provided or invalid.`;
      this.hasValidationError = true;
      this.incorrect_feild_update.push({
        errorType: 'Outline Level Error',
        message,
        taskWbs: task.wbs,
        parentWbs: parentTask.wbs,
      });
    } else if (isNaN(parentTask.Outline_Level)) {
      const message = `The outline level for task "${parentTask.wbs}" is not provided or invalid.`;
      this.hasValidationError = true;
      this.incorrect_feild_update.push({
        errorType: 'Outline Level Error',
        message,
        taskWbs: parentTask.wbs,
        parentWbs: parentTask.wbs,
      });
    }
  }

  private validateWbs(task: any, parentTask: any): void {
    const validWbsRegex = /^([1-9]\d*)(\.([1-9]\d*))*$/;

    if (!validWbsRegex.test(task.wbs) || !validWbsRegex.test(parentTask.wbs)) {
      this.hasValidationError = true;
      const message = `Please provide correct WBS number for ${task.wbs}.`;
      this.incorrect_feild_update.push({
        errorType: 'Outline Level Error',
        message,
        taskWbs: task.wbs,
        parentWbs: parentTask.wbs,
      });
    }
  }

  private validateTaskDates(task: any, parentTask: any): void {
    const taskStartDate = task.Start_Date;
    const taskFinishDate = task.Finish_Date;
    const parentStartDate = parentTask.Start_Date;
    const parentFinishDate = parentTask.Finish_Date;


    //  console.log('currentDate: ', currentDate)


    if (taskStartDate && parentStartDate && taskStartDate < parentStartDate) {
      const message = `The start date for task "${task.wbs}" is after the "${parentTask.wbs}" task's start date.`;
      this.hasValidationError = true;
      this.incorrect_feild_update.push({
        errorType: 'Start Date Error',
        message,
        taskWbs: task.wbs,
        parentWbs: parentTask.wbs,
      });
    }

    if (taskFinishDate && parentFinishDate && taskFinishDate > parentFinishDate) {
      const message = `The finish date for task "${task.wbs}" is before the "${parentTask.wbs}" task's finish date.`;
      this.hasValidationError = true;
      this.incorrect_feild_update.push({
        errorType: 'Finish Date Error',
        message,
        taskWbs: task.wbs,
        parentWbs: parentTask.wbs,
      });
    }

    if (taskStartDate && taskFinishDate && taskFinishDate < taskStartDate) {
      const message = `The finish date for task "${task.wbs}" should be greater than the start date.`;
      this.hasValidationError = true;
      this.incorrect_feild_update.push({
        errorType: 'Finish Date Error',
        message,
        taskWbs: task.wbs,
        parentWbs: parentTask.wbs,
      });
    }
  }

  private validateParentDates(parentTask: any): void {
    const parentStartDate = parentTask.Start_Date;
    const parentFinishDate = parentTask.Finish_Date;

    // if (parentStartDate && parentFinishDate && parentStartDate > parentFinishDate) {
    //   const message = `The finish date for task "${parentTask.wbs}" should be greater than the start date.`;
    //   this.hasValidationError = true;
    //   this.incorrect_feild_update.push({
    //     errorType: 'Parent Finish Date Error',
    //     message,
    //     taskWbs: '',  // Task not relevant for this error
    //     parentWbs: parentTask.wbs,
    //   });
    // }
  }



  isInvalid(val1: any, val2: any): boolean {
    // Check if the value is undefined or NaN
    return val1 === undefined || val2 === undefined || isNaN(val1) || isNaN(val2);
  }

  getParentTask(task: any): any | null {
    const outlineLevel = task.Outline_Level;

    // console.log('outlineLevel: ', outlineLevel)

    // Root task (level 1) has no parent
    if (outlineLevel === 1) {
      return null;
    }

    // Find the parent task based on WBS
    if (task.wbs !== undefined) {
      const parentWBS = task.wbs.split('.').slice(0, -1).join('.');

      // console.log('parentWBS: ', parentWBS)

      return this.remove_column_data.find((t: any) => t.wbs === parentWBS) || null;
    }
  }


  parseDuration(duration: string): number {
    const match = duration.match(/(\d+)\s*days/);
    return match ? parseInt(match[1], 10) : 0;
  }

  proceed(remove_column_data?: any) {

    this.updateTaskDates();

    const addRemarksToTasks: any = (incorrectData: any, taskData: any) => {
      // Loop through each task in remove_column_data
      taskData.forEach((task: any) => {
        // Find matching task in incorrect_feild_update by WBS
        const matchingError = incorrectData.find((error: any) => error.taskWbs === task.wbs);

        // If there's a matching error, add the remark
        if (matchingError) {
          task.Remarks = matchingError.message;
        } else {
          // If no matching error, ensure remark is not added (null or undefined)
          task.Remarks = null;  // You can also skip adding the remark key entirely if you prefer
        }
      });

      return taskData;
    };

    // Call the function
    const updatedTaskData = addRemarksToTasks(this.incorrect_feild_update, this.remove_column_data);

    // Output the result
    this.getTree(updatedTaskData);

    const errorCount = updatedTaskData.filter((item: any) =>
      item.Remarks && item.Remarks.trim() !== ''
    ).length;

    const successCount = updatedTaskData.length - errorCount;

    // console.log('successCount: ', successCount);
    // console.log('errorCount: ', errorCount);

    this.error = errorCount;
    this.no_error = successCount;
    this.extractFile = true;
    this.lodingTrue = false;


    // this.lodingTrue = true;
    const token = this.apiService.getRecursiveUser();

    // this.getTree(this.remove_column_data);
    // console.log('remove_column_data: ', this.remove_column_data)
    if (!this.hasValidationError) {
      if (this.type === 'upload') {
        this.remove_column_data = this.remove_column_data.map((item: any) => ({
          ...item,
          Session_User_Id: this.credentialService.getUser()[0].MKEY,
          Business_Group_Id: this.credentialService.getUser()[0].COMPANY_ID
        }));

        this.apiService.postExelTaskData(this.remove_column_data, token).subscribe((response: any) => {

          if (response[0].Data === null) {
            this.toastr.error('Please try after sometime', 'Something went wrong');
          }

          const header: any = [
            this.data[0][0],
            this.data[0][1],
            this.data[0][2],
            this.data[0][3],
            this.data[0][4],
            this.data[0][5],
            this.data[0][6],
            this.data[0][7],
            this.data[0][8],
            this.data[0][9],
            this.data[0][10],
            'Percent_Complete', // Append the fixed value as in your mapping
            'Remarks'
          ].map(String); // Ensure all header values are strings

         // console.log('check response[0].Data: ', response[0].Data)
          const uploaded_data = response[0].Data.map((item: any) => [
            item.WBS,
            item.Name,
            item.Duration,
            item.Start_Date,
            item.Finish_Date,
            item.Predecessors,
            item.Resource_Names,
            item.Text1,
            item.Outline_Level,
            item.Number1,
            item.Unique_ID,
            //0,
            item.Percent_Complete || 0,
            item.Remarks,
          ].map(String));


          uploaded_data.unshift(header);

          this.data = uploaded_data

          

          // const errorKeywords = ['Error : Resource Not Found', 'Error : Duplicate unique_id'];

          const errorCount = response[0].Data.filter((item: any) =>
            item.Remarks && item.Remarks.trim() !== ''
          ).length;

          const successCount = response[0].Data.length - errorCount;

          // console.log('successCount: ', successCount);
          // console.log('errorCount: ', errorCount);

          this.error = errorCount;
          this.no_error = successCount;
          this.extractFile = true;
          this.lodingTrue = false;

          this.getTree(response[0].Data);
          this.fileTab = false;
          // this.noFileExist = false;
          //this.uploadExcelFile(null)

          if (errorCount === 0) {
            this.toastr.success('File successfully updated!!');
            this.procedureDisable = true;
          }

        }, (error: ErrorHandler) => {
          console.log(error, 'Error occured')
          this.toastr.error('Error occored while performing operation')
        }
        )
      } else if (this.type === 'modify') {


        this.remove_column_data = this.remove_column_data.map((item: any) => ({
          ...item,
          Session_User_Id: this.credentialService.getUser()[0].MKEY,
          Business_Group_Id: this.credentialService.getUser()[0].COMPANY_ID
        }));


        this.apiService.sheetUpdate(this.remove_column_data, token).subscribe((response: any) => {


          // console.log('remove_column_data: ', this.remove_column_data);
          if (response[0].Data === null) {
            this.toastr.error(response[0].Message);
            this.no_error = 0;
          }

          //console.log('response[0].Message: ', response[0].Message)

          this.getTree(response[0].Data);



          // console.log('Check the uploaded data from proceed: ', this.uploadedData)

          const header: any = [
            this.data[0][0],
            this.data[0][1],
            this.data[0][2],
            this.data[0][3],
            this.data[0][4],
            this.data[0][5],
            this.data[0][6],
            this.data[0][7],
            this.data[0][8],
            this.data[0][9],
            this.data[0][10],
            'Percent_Complete', // Append the fixed value as in your mapping
            'Remarks'
          ].map(String); // Ensure all header values are strings

          // console.log('check response[0].Data: ', response[0].Data)
          const uploaded_data = response[0].Data.map((item: any) => [
            item.WBS,
            item.Name,
            item.Duration,
            item.Start_Date,
            item.Finish_Date,
            item.Predecessors,
            item.Resource_Names,
            item.Text1,
            item.Outline_Level,
            item.Number1,
            item.Unique_ID,
            item.Percent_Complete || 0,
            item.Remarks,
          ].map(String));

          //console.log('uploaded_data sds: ', uploaded_data)

          uploaded_data.unshift(header);

          this.data = uploaded_data

          // console.log('uploaded_data: ', uploaded_data)

          const errorKeywords = ['Error : Resource Not Found', 'Error : Duplicate unique_id'];

          const errorCount = response[0].Data.filter((item: any) =>
            item.Remarks && item.Remarks.trim() !== '' &&
            errorKeywords.some(keyword => item.Remarks.includes(keyword))
          ).length;

          const successCount = response[0].Data.length - errorCount;

          this.error = errorCount;
          this.no_error = successCount;
          this.extractFile = true;
          this.lodingTrue = false;


          console.log('errorCount: ', errorCount)
          console.log('errorCount typeof: ', typeof errorCount)



        }, (error: ErrorHandler) => {
          console.log(error, 'Error occured')
          this.toastr.error('Error occored while performing operation')
        }
        )
        // this.updateUploadedSheet();
      }
    }
  }


  selectedFileName(): string | undefined {
    const FILE_NAME = this.file?.name;
    return FILE_NAME
    // console.log(FILE_NAME)

    // if (files && files.length > 0) {
    //   const file = files[0];
    //   return file.name || file.FILE_NAME;
    // }
    // return "Attach Document";
  }




  ifSheetExist() {
    const { property, building } = this.fileTaskForm.value;
    const user = this.credentialService.getUser()?.[0];
    const token = this.apiService.getRecursiveUser();

    if (!property || !building || !user?.MKEY || !token) {
      return;
    }

    this.apiService.sheetExist(Number(property), Number(building), user?.MKEY, 1, token).subscribe((response) => {
      if (response[0].Data.length === 0) {
        this.noFileExist = true;
        this.disableSubmit = false
        this.extractExistingFile = false
        this.fileTab = true;
        this.closeExistingFilePopup = true;
        this.data = [];
        this.subTasks = [];
        this.excelHeader = [];

        if (this.closeExistingFilePopup) {
          setTimeout(() => {
            this.closeExistingFilePopup = false;
          }, 5000)
        }

      } else if (response.length > 0) {


        // console.log('response[0].Data if sheet there: ', response[0].Data)
        this.noFileExist = false;
        //this.disableSubmit = true;
        if (this.type === 'modify') {
          this.disableSubmit = false
          this.remove_column_data = response[0].Data
        } else {
          this.disableSubmit = true
        };
        this.fileTab = false;
        this.closeExistingFilePopup = false;

        this.getTree(response[0].Data);
        this.transFormFileData(response[0].Data);
      }
    })

      this.hideCancel = false;
      this.hideSubmit = true;
  }

  updateUploadedSheet() {

    const { property, building } = this.fileTaskForm.value;
    const user = this.credentialService.getUser()?.[0];
    const token = this.apiService.getRecursiveUser();

    if (!property || !building || !user?.MKEY || !token) {
      return;
    }

    this.apiService.sheetUpdate(this.data, token).subscribe((response) => {
      if (response[0].Data.length === 0) {
        this.noFileExist = true;
        this.disableSubmit = false
        this.extractExistingFile = false
        this.fileTab = true;
        this.closeExistingFilePopup = true;
        this.data = [];

        if (this.closeExistingFilePopup) {
          setTimeout(() => {
            this.closeExistingFilePopup = false;
          }, 5000)
        }

      } else if (response.length > 0) {
        this.noFileExist = false;
        this.disableSubmit = true;
        this.fileTab = false;

        this.closeExistingFilePopup = false;
        this.subTasks = response[0].Data;
        this.transFormFileData(response[0].Data);
      }
    })
  }

  closeEmptyRecord() {
    // this.noFileExist = false
    this.closeExistingFilePopup = false;
  }

  transFormFileData(responseData: any[]): any {

    const header_keys = Object.keys(responseData[0]);

    const headerRow = [
      header_keys[1],
      header_keys[2],
      header_keys[3],
      header_keys[4],
      header_keys[5],
      header_keys[6],
      header_keys[7],
      header_keys[8],
      header_keys[9],
      header_keys[10],
      header_keys[11],
      header_keys[12]
    ];

    const formatDate = (dateString: string): string => {
      if (!dateString || dateString === "0001-01-01T00:00:00") return "";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
    };

    const mappedData = [
      headerRow,
      ...responseData
        .map(task => [
          String(task.WBS ?? ""),
          String(task.Name ?? ""),
          String(task.Duration ?? ""),
          String(formatDate(task.Start_Date)),
          String(formatDate(task.Finish_Date)),
          String(task.Predecessors ?? ""),
          String(task.Resource_Names ?? ""),
          String(task.Text1 ?? ""),
          String(task.Outline_Level ?? ""),
          String(task.Number1 ?? ""),
          String(task.Unique_ID ?? ""),
          String(task.Percent_Complete ?? ""),
        ])
    ];

    this.data = mappedData
    // console.log('Data: ', this.data)
    this.extractExistingFile = true;
    this.fileTab = true;

  }


  exportToExcel(): void {
    console.log('check exportToExcel', this.data)
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MSP_test_Report');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a download link and trigger it
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'MSP_test_Report.xlsx';
    anchor.click();

    // Cleanup the object URL
    window.URL.revokeObjectURL(url);
  }


  // getTree(excelData?: any) {
  //   console.log('Excel data: ', excelData);

  //   const excel_keys: any = Object.keys(excelData[0]);

  //   const mapped_headers = excel_keys.reduce((acc: any, key: any) => {
  //     acc[key] = key;
  //     return acc;
  //   }, {});

  //   this.excelHeader = [mapped_headers];

  //   const excelData_new = excelData.map((item: any) => {
  //     const normalizedItem = Object.entries(item).reduce((acc: any, [key, value]) => {
  //       const normalizedKey = key.toLowerCase(); // normalize all keys
  //       acc[normalizedKey] = value;
  //       return acc;
  //     }, {});
  //     return normalizedItem;
  //   });

  //   const tasks = excelData_new;

  //   this.tasksWithoutWbs = tasks.filter((task: any) => !task.outline_level);
  //   const validTasks = tasks.filter((task: any) => !!task.outline_level);

  //   // Sort tasks by Outline_Level-aware order
  //   validTasks.sort((a: any, b: any) => a.number1 - b.number1); // Keep order stable if needed

  //   const stack: any[] = [];
  //   const tree: any[] = [];

  //   validTasks.forEach((task:any) => {
  //     const node = {
  //       wbs: task,
  //       visible: true,
  //       subtask: []
  //     };

  //     while (stack.length > 0 && stack[stack.length - 1].wbs.outline_level >= task.outline_level) {
  //       stack.pop();
  //     }

  //     if (stack.length === 0) {
  //       // It's a root-level task
  //       tree.push(node);
  //     } else {
  //       // It's a child of the last item in the stack
  //       stack[stack.length - 1].subtask.push(node);
  //     }

  //     stack.push(node);
  //   });

  //   // Add non-hierarchical tasks (no outline_level) to the end
  //   const nonOutlineTasks = this.tasksWithoutWbs.map((task: any) => ({
  //     wbs: task,
  //     visible: true,
  //     subtask: []
  //   }));

  //   this.subTasks = [...tree, ...nonOutlineTasks];
  //   console.log('this.subTasks: ',  this.subTasks )
  //   this.loading = false;
  // }

  getTree(excelData?: any) {

    const excel_keys: any = Object.keys(excelData[0])
    //console.log('excel_keys: ', excel_keys);
    const mapped_headers = excel_keys
      .reduce((acc: any, key: any) => {
        acc[key] = key;  // Bind the key to itself
        return acc;
      }, {});

    this.excelHeader = [mapped_headers];

    const excelData_new = excelData.map((item: any) => {
      // Create a new object for each entry
      const normalizedItem = Object.entries(item).reduce((acc: any, [key, value]) => {
        // Normalize 'WBS' to 'wbs'
        const normalizedKey = key.toLowerCase() === 'wbs' ? 'wbs' : key;
        acc[normalizedKey] = value; // Assign normalized key-value pair
        return acc;
      }, {});

      return normalizedItem;
    });


    const tasks = excelData_new;

    // Separate tasks with undefined wbs
    this.tasksWithoutWbs = tasks.filter((task: any) => !task.wbs);

    // Only process tasks that have a defined wbs
    const validTasks = tasks.filter((task: any) => !!task.wbs);

    // console.log('validTasks: ', validTasks);

    const buildHierarchy = (tasks: any[], rootWbs: string) => {
      const rootTask = tasks.find((task: any) => task.wbs === rootWbs);
      if (!rootTask) return null;

      const buildSubtasks = (wbs: string, depth: number): any[] => {
        const subtasks = tasks.filter((task: any) => {
          if (!task.wbs) return false;
          const taskDepth = task.wbs.split(".").length - 1;
          return task.wbs.startsWith(wbs + ".") && taskDepth === depth + 1;
        });

        return subtasks.map((subtask: any) => ({
          wbs: {
            ...subtask,
            wbs: '  '.repeat(depth + 1) + subtask.wbs
          },
          visible: true,
          subtask: buildSubtasks(subtask.wbs, depth + 1)
        }));
      };

      const rootDepth = rootTask.wbs.split(".").length - 1;

      return {
        wbs: {
          ...rootTask,
          wbs: rootTask.wbs
        },
        visible: true,
        subtask: buildSubtasks(rootTask.wbs, rootDepth)
      };
    };

    // Clear previous data
    this.subTasks = [];

    // Find top-level (root) tasks
    const rootTasks = validTasks.filter((task: any) => {

      if (!task.wbs) return false;
      return task.wbs.split(".").length === 1;
    });

    // Build hierarchy for each top-level task
    rootTasks.forEach((task: any) => {
      const hierarchy = buildHierarchy(validTasks, task.wbs);
      if (hierarchy) {
        this.subTasks.push(hierarchy);
      }
    });

    // Optionally append tasks without wbs to the end
    this.subTasks.push(...this.tasksWithoutWbs.map((task: any) => ({
      wbs: task,
      visible: true,
      subtask: []
    })));

    if (this.subTasks.length === 0) {
      this.noParentTree(validTasks)
    }

    this.loading = false;
  }

  noParentTree(noParentTree: any = []) {
    const taskMap: Record<string, any> = {};
    noParentTree.forEach((task: any) => {
      taskMap[task.wbs] = {
        wbs: {
          ...task,
          wbs: '  '.repeat(task.wbs.split('.').length - 1) + task.wbs  // Indent wbs
        },
        subtask: [],
        visible: true
      };
    });

    const resultTree: any[] = [];

    noParentTree.forEach((task: any) => {
      const wbsParts = task.wbs.split('.');
      if (wbsParts.length === 1) {
        resultTree.push(taskMap[task.wbs]);
      } else {
        const parentWbs = wbsParts.slice(0, -1).join('.');
        const parent = taskMap[parentWbs];

        if (parent) {
          parent.subtask.push(taskMap[task.wbs]);
        } else {
          resultTree.push(taskMap[task.wbs]);
        }
      }
    });

    this.subTasks = resultTree;
  }

  toggleVisibility(task: any) {
    task.visible = !task.visible;
  }

  calculateIndentation(taskNo: string, multiplier: number): number {
    // console.log(`taskNo: ${taskNo}, multiplier${multiplier}`);
    const spacesCount = taskNo.search(/\S/);
    return spacesCount * multiplier;
  }
  // calculateIndentation(task: any, baseIndent: number = 40): number {
  //   const level = task?.outline_level || task?.Outline_Level || 1; // handle both camelCase and PascalCase
  //   return (level - 1) * baseIndent;
  // }

  hasError(row: any[]): boolean {
    return row.some(val => val?.trim() !== '' || val?.trim() !== null);
  }

  //   get isDisabled() {

  //     console.log('Type: ', this.type);
  //     console.log('file tab: ', this.fileTab);
  //     console.log('noFileExist', this.noFileExist)

  //   return !(this.fileTab && this.noFileExist) && this.type === 'upload';
  // }

  isDisabled() {
    return !(this.fileTab && this.noFileExist || this.type === 'upload');
  }

  cancel() {
    this.subTasks = [];
    this.excelHeader = [];
    this.remove_column_data = [];
    this.data = [];

    this.file = null;

    this.hideCancel = false;
    this.hideSubmit = true;

    this.error = 0;
    this.no_error = 0;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clears the file input visually
    }

    const labelElement = document.getElementById('TaskAttachmentDetails');
    if (labelElement) {
      labelElement.textContent = 'Attachment: None';
    }

    this.fileExtension = '';
    // this.fileTab = false;
    // this.noFileExist = false;
    this.hasValidationError = false;
    this.incorrect_feild_update = [];
    this.extractFile = false;
    this.extractExistingFile = false;

  }



  reset() {
    this.cancel();
    this.closeEmptyRecord();
    this.fileTab = true;
    this.noFileExist = true;
    this.subTasks = [];
    // window.location.reload()
  }

}
