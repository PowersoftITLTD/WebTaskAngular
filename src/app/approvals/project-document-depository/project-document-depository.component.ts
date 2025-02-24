import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { CITIES, ICity } from '../add-approval-tempelate/cities';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-document-depository',
  templateUrl: './project-document-depository.component.html',
  styleUrls: ['./project-document-depository.component.css']
})
export class ProjectDocumentDepositoryComponent implements OnInit {

  receivedUser: string | any;
  disablePrivate: boolean = false;

  @Input() recursiveLogginUser: any = {};

  docDepositoryForm: FormGroup | any;

  project: any = [];
  sub_proj: any = [];
  docTypeList: any[] = [];
  docCatList: any[] = [];
  docType: any[] = [];
  public filteredDocs: ICity[] = [];

  myFiles: { file: File; name: string }[] = [];
  myFilesName: any[] = [];

  public cities: ICity[] = CITIES;
  file: File | any;
  baseURL: string | any

  searchQuery: string = '';


  public activeIndices: number[] = []; // Change here

  taskData: any;

  createdOrUpdatedUserName: any
  updatedDetails: boolean = false;



  selectedDocsMap: { [key: string]: any[] } = { endResult: [], checklist: [] };
  public selectedNoValueKey: ICity[] = [this.cities[4], this.cities[0]];


  end_list: object = {};
  check_list: object = {};

  loginName: string = '';
  loginPassword: string = '';

  public accordionItems = [
    { title: 'Classification', content: 'Some placeholder content for the first accordion panel.' },

  ];

  constructor(private apiService: ApiService,
    private credentialService: CredentialService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tostar: ToastrService
  ) {

    this.fetchProjectData();


    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';

    if (navigation?.extras.state) {
      const RecursiveTaskData: any = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;
      // console.log('RecursiveTaskData', RecursiveTaskData)

      if (RecursiveTaskData.mkey) {
        this.updatedDetails = !isNewTemp;
      } else {
        this.updatedDetails = false;
      }

      sessionStorage.setItem('task', JSON.stringify(RecursiveTaskData));
      sessionStorage.removeItem('add_new_task');
    } else {
      const RecursiveTaskData = sessionStorage.getItem('task');
      console.log('RecursiveTaskData', RecursiveTaskData)
      if (RecursiveTaskData) {
        try {
          this.taskData = JSON.parse(RecursiveTaskData);
          if (!isNewTemp) {
            this.updatedDetails = this.taskData.mkey ? true : false;
          }
        } catch (error) {
          console.error('Failed to parse task data', error);
        }
      }
    }
  }

  ngOnInit(): void {

    this.filteredDocs = this.cities;
    this.activeIndices = this.accordionItems.map((_, index) => index);

    this.onLogin();
    this.projectDepositoryForm();

    if (this.taskData && this.taskData.MKEY) {
      this.recursiveLogginUser = this.apiService.getRecursiveUser();

      this.apiService.getDocTypeDP(this.recursiveLogginUser).subscribe({
        next: (list: any) => {
          const doc_key = this.taskData.DOC_MKEY
          list.filter((doc: any) => {
            if (doc.mkey === doc_key) {
              this.toggleSelection('checklist', doc)
            }
          });
        },
        error: (error: any) => {
          console.error('Unable to fetch Document Type List', error);
        }
      });
    }

    if (this.taskData && this.taskData.MKEY) {
      this.getSubProj();
      this.taskData.PROJECT_DOC_FILES.forEach((docFile: any) => {
        this.myFiles.push({
          name: docFile.FILE_NAME,
          file: docFile.FILE_PATH,
        });
      });

    }

  }


  projectDepositoryForm() {
    this.docDepositoryForm = this.formBuilder.group({
      buildingType: ['', Validators.required],
      propertyType: ['', Validators.required],
      documentName: ['', Validators.required],
      documentNumberFieldName: ['', Validators.required],
      documentDateFieldName: ['', Validators.required],
      documentAttachment: [''],
      validityDate: ['', Validators.required],
    })
  }



  AddAndUpdateDocumentDepository() {

    const USER_CRED = this.credentialService.getUser();
    const PROJECT = this.docDepositoryForm.get('propertyType')?.value;

    const SUB_PROJECT = this.docDepositoryForm.get('buildingType')?.value;

    let SELECTED_PROJ;

    if (!this.taskData) {
      SELECTED_PROJ = this.sub_proj.find((sub_proj: any) => sub_proj.TYPE_DESC === SUB_PROJECT.TYPE_DESC);
    }

    const projectName = PROJECT?.MASTER_MKEY ? PROJECT.MASTER_MKEY : this.taskData?.PROPERTY_MKEY;
    const subProjectName = SELECTED_PROJ?.MASTER_MKEY ? SELECTED_PROJ.MASTER_MKEY : this.taskData?.BUILDING_MKEY;

    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    const DOC_NAME_MKEY = this.docType[0]?.MKEY;

    if (!projectName || !subProjectName || !DOC_NAME_MKEY) {
      this.tostar.error('Property, Building Type, or Document Name is missing!');
      return;
    } else if (!DOC_NAME_MKEY) {
      this.tostar.error('Please select document from list');
      return;
    }

    const formData: any = new FormData();
    const check_building = this.docDepositoryForm.get('buildingType')?.value;
    const check_property = this.docDepositoryForm.get('propertyType')?.value;

    if (this.taskData && this.taskData.MKEY) {
      if (this.docDepositoryForm.get('propertyType')?.value?.MASTER_MKEY !== undefined) {
        this.taskData.PROPERTY_TYPE = null
      }
    }


    if (this.taskData && this.taskData?.MKEY) {
      if (this.taskData.PROPERTY_MKEY === undefined && this.taskData.BUILDING_MKEY === null || check_building === '0' || check_property === '0') {
        if (this.docDepositoryForm.get('buildingType')?.value?.MASTER_MKEY === undefined) {
          this.tostar.error('Please select property and building')
          return;
        }
      }
    }


    const addDocDepository: any = {
      MKEY: this.taskData && this.taskData.MKEY ? this.taskData?.MKEY : 0,
      BUILDING_MKEY: this.docDepositoryForm.get('buildingType')?.value?.MASTER_MKEY || this.taskData.BUILDING_MKEY,
      PROPERTY_MKEY: this.docDepositoryForm.get('propertyType')?.value?.MASTER_MKEY || this.taskData.PROPERTY_MKEY,
      DOC_MKEY: DOC_NAME_MKEY,
      DOC_NUMBER: this.docDepositoryForm.get('documentNumberFieldName')?.value,
      DOC_DATE: this.docDepositoryForm.get('documentDateFieldName')?.value,
      VALIDITY_DATE: this.docDepositoryForm.get('validityDate')?.value,
      CREATED_BY: USER_CRED[0]?.MKEY,
      DELETE_FLAG: 'N',
      PROJECT_DOC_FILES: this.myFiles
    }

    console.log('Check files from ADD and Updated model: ', this.myFiles)
    Object.keys(addDocDepository).forEach((key) => {
      if (key === "PROJECT_DOC_FILES" && Array.isArray(addDocDepository[key])) {
        addDocDepository[key].forEach((file: File | any, index: number) => {
          console.log('file.file file',file)
          formData.append(`${key}`, file.file);
        });
      } else if (key !== "PROJECT_DOC_FILES") {
        const value = addDocDepository[key] !== undefined ? addDocDepository[key] : "";
        formData.append(key, value);
      }
    });

    console.log("Form Data Contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }


    console.log('updateDocDepository', addDocDepository)

    this.apiService.postProjectDocument(this.recursiveLogginUser, formData).subscribe(
      (response) => {
        console.log('API response:', response);
        this.tostar.success('success', `Your request added successfully`);
        this.router.navigate(['task/approval-screen'], { queryParams: { source: 'project-document-depository' } });
      },
      (error: ErrorHandler | any) => {
        // console.error('Error:', error);
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server') 
      }
    );
  }


  uploadFile(task_mkey: number): void {

    const currentURL = window.location.href;
    const baseURL = currentURL.split('#')[0] + '#/';
    this.baseURL = baseURL

    console.log('task_mkey', task_mkey)
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const data = this.credentialService.getUser();

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD),

    };


    console.log('FILE', this.file.name)

    if (this.file) {
      const additionalAttributes = {
        MKEY: this.taskData?.MKEY,
        FILE_NAME: this.file,
      };

      console.log('additionalAttributes', additionalAttributes)

      this.apiService.postDocUploadDepository(this.file, additionalAttributes, this.recursiveLogginUser).subscribe(
        response => {
          console.log('Upload successful:', response);
        },
        (error:ErrorHandler|any) => {
          const errorData = error.error.errors;
          const errorMessage = Object.values(errorData).flat().join(' , ');
          this.tostar.error(errorMessage, 'Error Occured in server') 
        }
      );
    } else {
      console.warn('No file selected');
    }
  }


  downloadFile(file_path: any): any {
    const baseUrl = 'http://192.168.19.188:8065';
    const fullPath = `${baseUrl}/${file_path}`;
    return fullPath;
  }



  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      Array.from(inputElement.files).forEach((file: File) => {
        // Push an object with file and its name to myFiles array
        this.myFiles.push({
          file: file,
          name: file.name,
        });
      });

      console.log('Check files', this.myFiles);

      const labelElement = document.getElementById('AttachmentDetails');
      if (labelElement) {
        // Join file names for display
        const fileNames = this.myFiles.map((item: any) => item.name).join(', ');
        labelElement.textContent = fileNames;
      }
    }
  }



  onLogin() {

    this.credentialService.validateUser(this.loginName, this.loginPassword);

    const data = this.credentialService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,

      console.log('onLogin data')

    const USER_CRED = {
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };

    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if (response.jwtToken) {
          this.fetchData();
          // this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }


  private fetchData() {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    this.apiService.getDocTypeDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.docTypeList = list
        this.mappedSelectedCheckList();

        // console.log('Document Type List:', this.docTypeList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });


    this.apiService.getDocCategory(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.docCatList = list

        // console.log('Document Type List:', this.docCatList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }


  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getProjectDetailsNew(token).subscribe(
      (response: any) => {
        this.project = response[0].data;
        // console.log("Project", this.project);
      },
      (error: ErrorHandler | any) => {
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server')       }
    );
  }

  onProjectSelect(selectElement: HTMLSelectElement) {
    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex];
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : null;
    const token = this.apiService.getRecursiveUser();


    console.log('selectedProjectMkey', selectedProjectMkey)

    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
        (response: any) => {
          console.log(response)
          this.sub_proj = response[0]?.data;
          console.log("Sub-Project", this.sub_proj);
          // this.raisedAtListCheck()

        },
        (error: ErrorHandler | any) => {
          const errorData = error.error.errors;
          const errorMessage = Object.values(errorData).flat().join(' , ');
          this.tostar.error(errorMessage, 'Error Occured in server')         }
      );
    }
  }


  getSubProj() {

    const token = this.apiService.getRecursiveUser();

    this.apiService.getSubProjectDetailsNew(this.taskData.PROPERTY_MKEY.toString(), token).subscribe(
      (response: any) => {

        this.sub_proj = response[0]?.data;
        this.setProjectNameToTaskData();

      },
      (error: ErrorHandler | any) => {
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.tostar.error(errorMessage, 'Error Occured in server')       }
    );
  }

  setProjectNameToTaskData(): void {
    if (this.taskData && this.taskData.MKEY) {
      const token = this.apiService.getRecursiveUser();

      this.apiService.getProjectDetailsNew(token).subscribe(
        (response: any) => {
          const project = response[0].data;
          const matchedProject = project.find((property: any) =>
            property.MASTER_MKEY === this.taskData.PROPERTY_MKEY
          );


          const matchedSubProject = this.sub_proj.find((building: any) =>
            building.MASTER_MKEY === Number(this.taskData.BUILDING_MKEY)
          );

          if (matchedProject) {
            this.taskData.PROPERTY_NAME = matchedProject.TYPE_DESC;

          } else {
            console.log('No matching project found for MASTER_MKEY:', this.taskData.PROPERTY_MKEY);
          }

          if (matchedSubProject) {
            this.taskData.BUILDING_NAME = matchedSubProject.TYPE_DESC;
          } else {
            console.log('No matching sub-project found for MASTER_MKEY:', this.taskData.BUILDING_MKEY);
          }
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error occurred while fetching projects');
        }
      );
    }
  }


  getGroupedAndSortedDocs(listType: 'endResult' | 'checklist') {
    const groupedDocs: any = {};
    this.docTypeList.forEach(docs => {
      const category = docs.attributE2 || 'Uncategorized';
      if (!groupedDocs[category]) {
        groupedDocs[category] = [];
      }
      groupedDocs[category].push(docs);
    });

    // Sort within groups by document name
    for (const docCategory in groupedDocs) {
      groupedDocs[docCategory].sort((a: any, b: any) => {
        const nameA = a.typE_DESC || '';
        const nameB = b.typE_DESC || '';
        return nameA.localeCompare(nameB);
      });
    }

    return groupedDocs;
  }




  toggleSelection(listType: 'endResult' | 'checklist', doc: any) {

    const selectedDocs: any = this.selectedDocsMap[listType];

    const index = selectedDocs.findIndex((selected: any) => selected.mkey === doc.mkey);

    if (index === -1) {
      selectedDocs.length = 0;
      selectedDocs.push(doc);
    } else {
      selectedDocs.splice(index, 1);
    }

    let end_list: { [key: string]: string } = {};
    let check_list: { [key: string]: string } = {};

    selectedDocs.forEach((selected: any) => {
      const key = selected.attributE2;
      const mkey = selected.mkey.toString();

      if (listType === 'endResult') {
        if (end_list[key]) {
          end_list[key] += `, ${mkey}`;
        } else {
          end_list[key] = mkey;
        }
      }

      if (listType === 'checklist') {
        if (check_list[key]) {
          check_list[key] += `, ${mkey}`;
        } else {
          check_list[key] = mkey;
        }
      }
    });

    if (listType === 'endResult') {
      this.end_list = end_list
    } else if (listType === 'checklist') {
      this.check_list = check_list
    }


    this.getProjDocumentDepository(selectedDocs);
  }


  mappedSelectedCheckList() {
    let mappedSelectedArray: any[] = [];

    // Ensure DOC_NAME is handled as a number or convert it to a number
    if (this.taskData?.DOC_MKEY && typeof this.taskData?.DOC_MKEY === 'number') {
      const selectedMkeys = [this.taskData.DOC_MKEY]; // Wrap the single number in an array

      // Filter the docTypeList based on the selectedMkeys
      let selectedItems = this.docTypeList.filter(doc => selectedMkeys.includes(doc.mkey));

      selectedItems.forEach(item => {
        mappedSelectedArray.push(item);
      });
    }

    // Assign the mapped array to the checklist key
    this.selectedDocsMap['checklist'] = mappedSelectedArray;
  }

  getProjDocumentDepository(data: any) {

    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const USER_CRED = this.credentialService.getUser();
    const doc_mkey = data[0]?.mkey

    this.apiService.getProjDocDepositoryFeilds(this.recursiveLogginUser, doc_mkey, USER_CRED[0].MKEY).subscribe({
      next: (list: any) => {
        this.docType = list
        // console.log('Document Type List:', this.docType);
      },
      error: (error: any) => {
        this.docType = []
        console.log('Document Type List:', this.docType);

        // console.error('Unable to fetch Document Type List', error);
      }
    });
  }


  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index);
    } else {
      this.activeIndices.splice(idx, 1);
    }
  }

  isSelected(listType: 'endResult' | 'checklist', doc: any): boolean {
    return this.selectedDocsMap[listType].some(selected => selected.mkey === doc.mkey);

  }

  getUniqueDocs(listType: 'endResult' | 'checklist'): string[] {
    return Array.from(new Set(this.docTypeList.map(docs => docs.attributE2)));
  }

  onSubmit(): boolean {
    const requiredControls: string[] = [];
    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };

    Object.keys(this.docDepositoryForm.controls).forEach(controlName => {
      const control = this.docDepositoryForm.get(controlName);

      if (control?.errors?.required) {
        if (
          (controlName === 'documentNumberFieldName' && this.docType[0]?.DOC_NUM_APP_FLAG === 'Y') ||
          (controlName === 'documentDateFieldName' && this.docType[0]?.DOC_NUM_DATE_APP_FLAG === 'Y') ||
          (controlName === 'validityDate' && this.docType[0]?.DOC_NUM_VALID_FLAG === 'Y')
        ) {

          const formattedControlName = convertToTitleCase(controlName);
          requiredControls.push(formattedControlName);
        }
      }
    });

    if (requiredControls.length > 0) {
      const m = `${requiredControls.join(', ')}`;
      this.tostar.error(m);
      return false; 
    }

    this.AddAndUpdateDocumentDepository();
    return true;
  }




  removeFile(index: number) {
    const confirmDelete = confirm("Are you sure you want to delete file?");

    if (confirmDelete) {
      this.myFiles.splice(index, 1);
      this.myFilesName.splice(index, 1)
    } else {
      console.log('Delete cancelled');

    }

  }

  fileUrl(filePath: string) {
    return `http://192.168.19.188:8087/${filePath}`;
  }


  createData() {
    this.AddAndUpdateDocumentDepository();
  }


  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }


  navigateToProjectDocDepository() {
    this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'project-document-depository' }});
  }

}
