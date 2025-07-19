import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { formatDate } from '@angular/common';


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
  selector: 'app-project-modify',
  templateUrl: './project-modify.component.html',
  styleUrls: ['./project-modify.component.css']
})

export class ProjectModifyComponent implements OnInit {

  

   project: any = [];
    sub_proj: any = [];
  
    receivedUser: any;
  
    file: File | null = null;
    procedureDisable: boolean = true;
    fileExtension: string | any;
    data: AOA = [];
    loading = false;
  
    fileTaskForm: FormGroup | any
  
    remove_column_data: any;
    uploadedData: any
  
    error: number | any;
    no_error: number | any;

  constructor(
        private credentialService: CredentialService,
        private apiService: ApiService,
        private toastr: ToastrService,
        private fb: FormBuilder
  ) { }

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
         (error: ErrorHandler | any) => {
           const errorData = error.error.errors;
           const errorMessage = Object.values(errorData).flat().join(' , ');
           this.toastr.error(errorMessage, 'Error Occured in server')
         }
       );
     }
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
 
   receiveLoggedInUser(user: any): void {
     this.receivedUser = user;
   }
 
   uploadExcelFile(event: Event) {
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
 
     const addControlError = (message: string) => requiredControls.push(message); 
 
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
 
     const Project = Number(this.fileTaskForm.get('property')?.value);
     const Sub_Project = Number(this.fileTaskForm.get('building')?.value);
     const Mpp_Name = this.fileTaskForm.get('mppName')?.value;
     const Created_By = this.credentialService.getUser()[0].MKEY;
     const Updated_By = this.credentialService.getUser()[0].MKEY;
     const Creation_Date = new Date().toISOString();
     const Updation_Date = new Date().toISOString();
     const fileName = this.file?.name
     const Process_Flag = 'N';
  
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
         //percentComplete,
 
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
         //percentComplete,
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
       'Percent_Complete',
       'Remarks'
     ].map(String);
 
     const remove_column_data = extractedFileData.slice(1);
 
     const uploaded_data = remove_column_data.map(item => [
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
       0
     ].map(String));
 
     uploaded_data.unshift(header);
 
     this.uploadedData = uploaded_data; 
     this.remove_column_data = remove_column_data

     return extractedFileData;
   }
 
 
   proceed(remove_column_data?: any) {
 
     const token = this.apiService.getRecursiveUser();     
 
     this.apiService.postExelTaskData(this.remove_column_data, token).subscribe((response: any) => {
 
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
         //'Percent_Complete', // Append the fixed value as in your mapping
         'Remarks'
       ].map(String); 
 
 
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
         item.Remarks,
       ].map(String));
  
       uploaded_data.unshift(header);
 
       this.data = uploaded_data
 
       const errorKeywords = ['Error : Resource Not Found', 'Error : Duplicate unique_id'];
 
       const errorCount = response[0].Data.filter((item: any) =>
         errorKeywords.some(keyword => item.Remarks?.includes(keyword))
       ).length;
 
       const successCount = response[0].Data.length - errorCount;
 
       this.error = errorCount;
       this.no_error = successCount;
        
       this.toastr.success('File successfully updated!!')
 
     }, (error: ErrorHandler) => {
       console.log(error, 'Error occured')
       this.toastr.error('Error occored while performing operation')
     }
     )   
   }
 
 
   hasError(row: any[]): boolean {
     return row.some(val => val?.trim() === 'Error : Resource Not Found' || val?.trim() === 'Error : Duplicate unique_id');
   }

}
