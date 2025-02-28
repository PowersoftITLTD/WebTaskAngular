import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

interface DocumentListItem {
  selected?: boolean;
  MKEY: number,
  DOCUMENT_CATEGORY: string,
  DOCUMENT_NAME: string,
  TYPE_DESC: string | null,
  CREATED_BY: string,
  SR_NO: number,
}

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})

export class OutputComponent implements OnInit {
  loading: boolean = true;
  @Input() recursiveLogginUser: any = {};
  project: any = [];
  sub_proj: any = [];
  file: File | any;
  selectedTags: [] = [];
  taskData: any;
  outputList: any[] = [];
  myFiles: { file: File; name: string }[] = [];
  docTypeList: any[] = [];
  @Input() task: any;
  taskDetails: any;
  selectedDocument: any = null;
  isModalOpen: boolean = false;
  isAddModalOpen: boolean = false;
  searchItem: string = '';
  selectedDocs: { key: string; DOCUMENT_CATEGORY: number; MKEY: number }[] = [];
  groupedDocsList: { DOCUMENT_NAME: string; DOCUMENTS: DocumentListItem[] }[] = [];

  tasksData = {
    property: '',
    building: '',
    document: null
  };

  columns = [
    { header: 'Sr No.', field: 'srNo', visible: true },
    { header: 'Document Category', field: 'ATTRIBUTE2', visible: false },
    { header: 'Document Number', field: 'DOC_NUMBER', visible: false },
    { header: 'Document Name', field: 'TYPE_DESC', visible: false },
    { header: 'Document Date', field: 'DOC_DATE', visible: false },
    { header: 'Validity Date', field: 'VALIDITY_DATE', visible: false },
    { header: 'Action', field: 'action', visible: true }
  ];

  constructor(private apiService: ApiService,
    private credentialService: CredentialService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tostar: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.fetchProjectData();
  }

  ngOnInit(): void {
    this._getSelectedTaskDetails();

    if (this.taskData && this.taskData.MKEY) {
      this.recursiveLogginUser = this.apiService.getRecursiveUser();
      this.getSubProj();
    }

    this.route.params.subscribe(params => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();

        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;
          this.fetchOutputList(response[0]?.data);
        });
      }
    });

    this.columns.forEach(col => {
      if (col.field !== 'srNo' && col.field !== 'action') {
        this.checkColumnVisibility(col);
      }
    });
  }

  getSelectedTaskDetails(mkey: string, tokecn: string) {
    return this.apiService.getSelectedTaskDetailsNew(mkey, tokecn);
  }

  _getSelectedTaskDetails() {
    this.route.params.subscribe(params => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();
        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;
          this.apiService.getSubProjectDetailsNew(this.taskDetails[0]?.PROJECT_MKEY.toString(), token).subscribe(
            (response: any) => {
              this.sub_proj = response[0].data;
            },
            (error: ErrorHandler) => {
              console.error('Error fetching sub-projects', error);
            }
          );
          if (response[0]?.data.length > 0 && response[0].data[0]?.TAGS !== null) {
            this.selectedTags = response[0]?.data[0].TAGS.split(',');
          } else {
            this.selectedTags = [];
          }
        });
      }
    });
  }

  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getProjectDetailsNew(token).subscribe(
      (response: any) => {
        this.project = response[0].data;
      },
      (error: ErrorHandler) => {
        console.error('Error fetching projects', error);
      }
    );
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
          console.error('Error fetching sub-projects', error);
        }
      );
    }
  }

  getSubProj() {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getSubProjectDetailsNew(this.taskData.PROPERTY_TYPE.toString(), token).subscribe(
      (response: any) => {
        this.sub_proj = response[0].data;
        this.setProjectNameToTaskData();
      },
      (error: ErrorHandler) => {
        console.error('Error fetching sub-projects', error);
      }
    );
  }

  setProjectNameToTaskData(): void {
    if (this.taskData && this.taskData.MKEY) {
      const matchedProject = this.project.find((property: any) => property.MASTER_MKEY === this.taskData.PROPERTY_TYPE);
      const matchedSubProject = this.sub_proj.find((building: any) => building.MASTER_MKEY === Number(this.taskData.BUILDING_TYPE));

      if (matchedProject) {
        this.taskData.project_Name = matchedProject.TYPE_DESC;
      }

      if (matchedSubProject) {
        this.taskData.sub_proj_name = matchedSubProject.TYPE_DESC;
      }
    }
  }

  fetchOutputList(taskDetails: any): void {
    this.loading = true;
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();

    this.apiService.getOutputList(taskDetails[0].BUILDING_MKEY, taskDetails[0].PROJECT_MKEY, user[0].ROLE_ID, this.task.toString(), token).subscribe(
      (response: any) => {
        if (response[0].DATA && response[0].DATA.length > 0) {
          this.outputList = response[0].DATA;
          this.columns.forEach(col => {
            if (col.field !== 'srNo' && col.field !== 'action') {
              this.checkColumnVisibility(col);
            }
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching output list:', error);
        this.loading = false;
      }
    );
  }

  checkColumnVisibility(col: any): void {
    const flagMapping: { [key: string]: string } = {
      'DOC_NUMBER': 'DOC_NUM_APP_FLAG',
      'DOC_DATE': 'DOC_NUM_DATE_APP_FLAG',
      'VALIDITY_DATE': 'DOC_NUM_VALID_FLAG'
    };

    const flagField = flagMapping[col.field];

    if (flagField) {
      // Filter only rows where flag is 'Y'
      const flaggedDocs = this.outputList.filter(doc => doc[flagField] === 'Y');

      // Check if at least one flagged row has valid data
      const hasValidData = flaggedDocs.some(doc => doc[col.field] !== null && doc[col.field] !== '' && doc[col.field] !== 'null');

      // If there's no valid data for any flagged rows, hide the column
      col.visible = hasValidData;
    } else {
      // If no flag exists, check if any data is present
      col.visible = this.outputList.some(doc => doc[col.field] !== null && doc[col.field] !== '');
    }
  }

  fetchDocsList() {
    const token = this.apiService.getRecursiveUser();
    this.apiService.getDocTypeDP(token).subscribe({
      next: (list: any) => {
        this.docTypeList = list.map((item: any) => ({
          MKEY: item.mkey,
          DOCUMENT_CATEGORY: item.attributE1,
          DOCUMENT_NAME: item.attributE2,
          TYPE_DESC: item.typE_DESC,
          CREATED_BY: item.CREATED_BY,
          SR_NO: item.SR_NO,
          selected: this.isDocumentSelected(item)
        }));

        this.updateFilteredDocsList();
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });
  }

  updateFilteredDocsList(): void {
    const searchItemLower = this.searchItem.toLowerCase().trim();
    const groupedData: { [key: string]: { DOCUMENT_NAME: string; DOCUMENTS: DocumentListItem[] } } = {};

    this.docTypeList.forEach(item => {
      const matchesSearch =
        item.DOCUMENT_NAME.toLowerCase().includes(searchItemLower) ||
        (item.TYPE_DESC && item.TYPE_DESC.toLowerCase().includes(searchItemLower));

      if (matchesSearch) {
        const groupKey = item.DOCUMENT_NAME || 'Unknown'; // Ensuring grouping based on `DOCUMENT_NAME`

        // Filter out TYPE_DESC values already present in checklist
        const isTypeDescInChecklist = this.outputList.some(
          output => output.TYPE_DESC === item.TYPE_DESC
        );

        if (!groupedData[groupKey]) {
          groupedData[groupKey] = { DOCUMENT_NAME: groupKey, DOCUMENTS: [] };
        }

        // Only add items where TYPE_DESC is NOT in the checklist
        if (!isTypeDescInChecklist) {
          groupedData[groupKey].DOCUMENTS.push(item);
        }
      }
    });

    // Remove groups that have no remaining DOCUMENTS after filtering
    this.groupedDocsList = Object.values(groupedData).filter(group => group.DOCUMENTS.length > 0);
  }

  toggleListSelection(docItem: DocumentListItem): void {
    docItem.selected = !docItem.selected;
    this.addDocumentToOutput(docItem);
  }

  isDocumentSelected(item: DocumentListItem): boolean {
    return this.selectedDocs.some(selected =>
      selected.MKEY === item.MKEY &&
      selected.DOCUMENT_CATEGORY.toString() === item.DOCUMENT_CATEGORY
    );
  }
  addDocumentToOutput(item: DocumentListItem): void {
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();

    const payload = {
      SR_NO: 0,
      MKEY: this.task || null,
      DELETE_FLAG: "N",
      CREATED_BY: user[0].MKEY.toString() || null,
      OUTPUT_DOC_LST: {
        [item.DOCUMENT_NAME]: item.MKEY.toString(),
      },
    };

    this.apiService.addOutputDetails(payload, token).subscribe({
      next: (response) => {
        if (response[0]?.DATA) {
          this.fetchOutputList(this.taskDetails);
        } else {
          this.tostar.error("Error adding document to output list", "Error");
        }
      },
      error: (error) => console.error("Error updating output list:", error),
    });
  }


  openAddModal() {
    this.fetchDocsList();
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }


  openModal(document: any): void {
    this.isModalOpen = true;
    setTimeout(() => {
      this.selectedDocument = document;
      document.TASK_OUTPUT_ATTACHMENT.forEach((docFile: any) => {
        this.myFiles.push({
          name: docFile.FILE_NAME,
          file: docFile.FILE_PATH,
        })
      })
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedDocument = null;
  }

  hasFile(): boolean {
    return this.selectedDocument.TASK_OUTPUT_ATTACHMENT.length > 0;
  }

  selectedFileName(): string {
    const files = this.selectedDocument.TASK_OUTPUT_ATTACHMENT;

    if (files && files.length > 0) {
      const file = files[0];
      return file.name || file.FILE_NAME;
    }
    return "Attach Document";
  }

  getDownloadUrl(): string {
    const filePath = this.selectedDocument.TASK_OUTPUT_ATTACHMENT[0]?.FILE_PATH;
    return `http://192.168.19.188:8087/${filePath}`
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedDocument.TASK_OUTPUT_ATTACHMENT = [file];
    }
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      Array.from(inputElement.files).forEach((file: File) => {
        // Push an object with file and its name to myFiles array
        this.myFiles.push({
          file: file,
          name: file.name,
        });
      });

      const labelElement = document.getElementById('AttachmentDetails');
      if (labelElement) {
        // Join file names for display
        const fileNames = this.myFiles.map((item: any) => item.name).join(', ');
        labelElement.textContent = fileNames;
      }
    }
  }

  saveChanges(): void {
    const token = this.apiService.getRecursiveUser();
    const formData: any = new FormData();

    const documentData: any = {
      PROJECT_DOC_FILES: this.myFiles,
      DOC_MKEY: this.selectedDocument.DOC_MKEY.toString(),
      PROPERTY_MKEY: this.selectedDocument.PROPERTY_MKEY,
      BUILDING_MKEY: this.selectedDocument.BUILDING_MKEY,
      VALIDITY_DATE: this.selectedDocument.VALIDITY_DATE || '',
      CREATED_BY: this.selectedDocument.CREATED_BY_ID,
      DOC_NUMBER: this.selectedDocument.DOC_NUMBER || '',
      DOC_DATE: this.selectedDocument.DOC_DATE || '',
      SR_NO: this.selectedDocument.SR_NO,
      MKEY: this.selectedDocument.MKEY,
      DELETE_FLAG: "N"
    };

    // Populate FormData using the object model
    Object.keys(documentData).forEach((key) => {
      if (key === "PROJECT_DOC_FILES" && Array.isArray(documentData[key])) {
        documentData[key].forEach((file: File | any, index: number) => {
          formData.append(`${key}`, file.file);
        });
      } else if (key !== "PROJECT_DOC_FILES") {
        const value = documentData[key] !== undefined ? documentData[key] : "";
        formData.append(key, value);
      }
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    Object.entries(documentData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    this.apiService.updateOutputDetails(formData, token).subscribe(
      (response: any) => {
        if (response[0].DATA?.length) {
          this.fetchOutputList(this.taskDetails);
          this.closeModal();
          this.tostar.success('Changes saved successfully');
        } else {
          this.tostar.error('Error while saving changes');
        }
      },
      (error: any) => {
        this.tostar.error('Some error occurred');
      }
    );
  }

  removeFile(): void {
    this.selectedDocument.TASK_OUTPUT_ATTACHMENT = [];
    this.myFiles = [];
  }

  addNewDocument(): void {

  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }

}