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
  docCatList:any[] = [];
  docType:any[]=[];
  public filteredDocs: ICity[] = [];
  public cities: ICity[] = CITIES;
  file: File | any;
  baseURL:string | any

  public activeIndices: number[] = []; // Change here

  taskData: any;

  createdOrUpdatedUserName:any
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
              private credentialService:CredentialService,
              private formBuilder:FormBuilder,
              private router: Router,
              private tostar: ToastrService
             ) {

              const navigation: any = this.router.getCurrentNavigation();
              const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';
          
              if (navigation?.extras.state) {
                const RecursiveTaskData: any = navigation.extras.state.taskData;
                this.taskData = RecursiveTaskData;
                console.log('RecursiveTaskData', RecursiveTaskData)
          
                if (RecursiveTaskData.mkey) {
                  this.updatedDetails = !isNewTemp;
                } else {
                  this.updatedDetails = false;
                }
          
                sessionStorage.setItem('task', JSON.stringify(RecursiveTaskData));
                sessionStorage.removeItem('add_new_task');
              } else {
                const RecursiveTaskData = sessionStorage.getItem('task');
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
    this.activeIndices = this.accordionItems.map((_, index) => index); // Set all indices to open

    this.fetchProjectData();
    this.onLogin();
    this.projectDepositoryForm();
  }


  projectDepositoryForm(){
    this.docDepositoryForm = this.formBuilder.group({
      buildingType: ['',Validators.required],
      propertyType: ['',Validators.required],
      // documentName: ['',Validators.required],
      documentNumberFieldName: ['',Validators.required],
      documentDateFieldName: ['',Validators.required],
      documentAttachment: [''],
      validityDate: ['',Validators.required],     
    })
  }


  addDocumentDepository(){
    const USER_CRED = this.credentialService.getUser();

    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    const PROJECT = this.docDepositoryForm.get('propertyType')?.value ;
    const SUB_PROJECT = this.docDepositoryForm.get('buildingType')?.value ;

    console.log('docType addDocumentDepository', this.docType[0]?.MKEY)
    console.log('USER_CRED[0]?.MKEY', USER_CRED[0]?.MKEY)
    const DOC_NAME_MKEY = this.docType[0]?.MKEY;

    if (!PROJECT || !SUB_PROJECT || !DOC_NAME_MKEY) {
      this.tostar.error('Property, Building Type, or Document Name is missing!');
      return; 
    }else if(!DOC_NAME_MKEY){
      this.tostar.error('Please select document from list');
      return;
    }

    const addDocDepository:any = {
      BUILDING_TYPE: SUB_PROJECT.MASTER_MKEY,
      PROPERTY_TYPE: PROJECT.MASTER_MKEY,
      DOC_NAME: DOC_NAME_MKEY,
      DOC_NUMBER: this.docDepositoryForm.get('documentNumberFieldName')?.value,
      DOC_DATE: this.docDepositoryForm.get('documentDateFieldName')?.value,
      DOC_ATTACHMENT: this.docDepositoryForm.get('documentAttachment')?.value,
      VALIDITY_DATE: this.docDepositoryForm.get('validityDate')?.value,
      CREATED_BY: USER_CRED[0]?.MKEY,
      attributE1: USER_CRED[0]?.MKEY.toString(),
      attributE2: "ADD FORM",
      attributE3: "ADD",   
    }

    console.log('addDocDepository', addDocDepository)

    this.apiService.postProjectDocument(this.recursiveLogginUser,addDocDepository).subscribe(
      (response) => {
        console.log('API response:', response);
        this.tostar.success('success', `Your request added successfully`);
        this.uploadFile(response.mkey)

      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  

  uploadFile(task_mkey:number): void {

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

  onLogin() {   

    this.credentialService.validateUser(this.loginName, this.loginPassword);

    const data = this.credentialService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,    

    console.log('onLogin data')

    const USER_CRED = {    
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL, 
      PASSWORD:atob(data[0]?.LOGIN_PASSWORD)
    }; 

    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if(response.jwtToken){
          this.fetchData();
          // this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }


  private fetchData(){
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    this.apiService.getDocTypeDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.docTypeList = list
        console.log('docTypeList',this.docTypeList)
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
    this.apiService.getProjectDetails().subscribe(
      (data: any) => {
        this.project = data;
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching projects');
      }
    );
  }


  onProjectSelect(selectElement: HTMLSelectElement) {

    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex] || 0;
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : 0;

    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetails(selectedProjectMkey).subscribe((data: any) => { this.sub_proj = data },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching sub-projects');
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
    // console.log('listType', listType);
  
    const selectedDocs: any = this.selectedDocsMap[listType];    

    // console.log('selectedDocs', selectedDocs)
    
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

  let allSelectedMkeys: number[] = [];

  for (let key in this.taskData.checklisT_DOC_LST) {
      if (this.taskData.checklisT_DOC_LST.hasOwnProperty(key)) {
          const selectedMkeysString = this.taskData.checklisT_DOC_LST[key];

          const selectedMkeys = selectedMkeysString.split(',')
              .map((mkey: string) => parseInt(mkey.trim(), 10))
              .filter((mkey: number) => !isNaN(mkey));  // Ensure no NaN values

          allSelectedMkeys = [...allSelectedMkeys, ...selectedMkeys];
      }
  }

  let selectedItems = this.docTypeList.filter(doc => allSelectedMkeys.includes(doc.mkey));


  selectedItems.forEach(item => {
      mappedSelectedArray.push(item);  
  });

  this.selectedDocsMap['checklist'] = mappedSelectedArray;

}



getProjDocumentDepository(data:any){

  this.recursiveLogginUser = this.apiService.getRecursiveUser();
  const USER_CRED = this.credentialService.getUser();
  const doc_mkey =  data[0]?.mkey

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


  onSubmit() {
    const requiredControls: string[] = [];
    const requiredFields: string[] = [];
    const valid = this.docDepositoryForm.valid;  
  
    const addControlError = (message: string) => requiredControls.push(message);
  
    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };
  
    Object.keys(this.docDepositoryForm.controls).forEach(controlName => {
      const control = this.docDepositoryForm.get(controlName);
  
      // Check for required fields and the flag conditions
      if (control?.errors?.required) {
        // Check flags to decide if the field is required
        if (
          (controlName === 'documentNumberFieldName' && this.docType[0]?.DOC_NUM_APP_FLAG === 'Y') ||
          (controlName === 'documentDateFieldName' && this.docType[0]?.DOC_NUM_DATE_APP_FLAG === 'Y') ||
          (controlName === 'validityDate' && this.docType[0]?.DOC_NUM_VALID_FLAG === 'Y')
        ) {
          // Convert camelCase to Title Case
          const formattedControlName = convertToTitleCase(controlName);
          addControlError(formattedControlName);
        }
      }
    });
  
    if (requiredControls.length > 0) {
      const m = `${requiredControls.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    }
    
    this.addDocumentDepository();

   
  }
  


  onDocDepository() {

    this.onSubmit();
   
  }


  ngOnDestroy(): void {
    console.log('Component is being destroyed');

    sessionStorage.removeItem('task');
  }
  
}
