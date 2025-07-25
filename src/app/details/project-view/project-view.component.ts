// import { Component, OnInit } from '@angular/core';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ApiService } from 'src/app/services/api/api.service';
import { formatDate } from '@angular/common';



type AOA = any[][];

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  project: any = [];
  sub_proj: any = [];

  receivedUser: any;


  file: File | null = null;
  fileExtension: string | any;
  data: AOA = [];
  loading = false;

  ngOnInit(): void { }


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
      this.toastr.warning('No file selected');
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
    if (!this.file) {
      this.toastr.warning('No file selected to read');
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

      console.log('Data: ', this.data)

      this.data = this.data.map(row => row.map(cell => {
        if (typeof cell === 'string' && this.isDateString(cell)) {
          const parsedDate = this.parseDate(cell);
          return parsedDate ? this.formatDateToDDMMYYYY(parsedDate) : cell;
        }
        return cell;
      }));

      // console.log('Data: ', this.data);
    } catch (error) {
      this.toastr.error('Error reading file');
    } finally {
      this.loading = false;
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
    return formatDate(date, 'dd-MM-yyyy', 'en-US');
  }

  private isDateString(value: string): boolean {

    if (value.includes('.')) {
      return false;
    }
    const dateRegex = /^(?:(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4}|\d{4}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{1,2}|\d{2,4}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{1,2})|\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})(\s+\d{1,2}:\d{2}(\s*[AP]{1}[M]{1})?)?$|(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\D?$|(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\s*[\w\W]?$|(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\s*[\s\S]?$/;
    return dateRegex.test(value);
  }

}
