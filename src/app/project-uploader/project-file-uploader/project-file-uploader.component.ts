import { Component, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

type AOA = any[][];

@Component({
  selector: 'app-project-file-uploader',
  templateUrl: './project-file-uploader.component.html',
  styleUrls: ['./project-file-uploader.component.css']
})
export class ProjectFileUploaderComponent {

  receivedUser: any;

  file: File | null = null;
  fileExtension: string | any;
  data: AOA = [];
  loading = false;

  constructor(private toastr: ToastrService) {}


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


      this.data = this.data.map(row => row.map(cell => {

        if (typeof cell === 'string' && this.isDateString(cell)) {
          const parsedDate = this.parseDate(cell);
          return parsedDate ? this.formatDateToDDMMYYYY(parsedDate) : cell;
        }


        return cell;
      }));
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
