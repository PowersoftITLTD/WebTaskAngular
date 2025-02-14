import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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
  @Input() task: any;
  taskDetails: any;
  selectedDocument: any = null;
  isModalOpen: boolean = false;
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


  openModal(document: any): void {
    this.isModalOpen = true;
    setTimeout(() => {
      this.selectedDocument = document;
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
    return `http://192.168.19.188:8065/${filePath}`
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedDocument.TASK_OUTPUT_ATTACHMENT = [file];
    }
  }

  saveChanges(): void {
    const token = this.apiService.getRecursiveUser();
    const formData = new FormData();
    formData.append('PROJECT_DOC_FILES', this.selectedDocument.TASK_OUTPUT_ATTACHMENT[0] || "null");
    formData.append('DOC_MKEY', this.selectedDocument.DOC_MKEY.toString());
    formData.append('PROPERTY_MKEY', this.selectedDocument.PROPERTY_MKEY);
    formData.append('BUILDING_MKEY', this.selectedDocument.BUILDING_MKEY);
    formData.append('VALIDITY_DATE', this.selectedDocument.VALIDITY_DATE);
    formData.append('CREATED_BY', this.selectedDocument.CREATED_BY_ID);
    formData.append('DOC_NUMBER', this.selectedDocument.DOC_NUMBER);
    formData.append('DOC_DATE', this.selectedDocument.DOC_DATE);
    formData.append('SR_NO', this.selectedDocument.SR_NO);
    formData.append('MKEY', this.selectedDocument.MKEY);
    formData.append('DELETE_FLAG', "N");

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
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }

}
