import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-document-tempelate',
  templateUrl: './document-tempelate.component.html',
  styleUrls: ['./document-tempelate.component.css']
})
export class DocumentTempelateComponent implements OnInit {

  @Input() recursiveLogginUser: any = {};

  public activeIndices: number[] = []; // Change here
  receivedUser: string | any;

  docTempForm: FormGroup | any;

  selectedTab: string = 'taskInfo';
  defaultCategory: string = 'PUBLIC';

  //Logged
  taskData: any;



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

  docTypeList: any[] = [];
  docCatList:any[] = [];

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

  createdOrUpdatedUserName:any


  selectedRadio: string = 'never';
  selectedTerm: string = 'Daily';
  minDate: string | any;

  updatedDetails: boolean = false;

  loginName: string = '';
  loginPassword: string = '';


  public accordionItems = [
    { title: 'Meta data fields as per ISO', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Location fields as per ACC', content: 'Some placeholder content for the second accordion panel.' },
  ];

  constructor(private formBuilder: FormBuilder,
    private tostar: ToastrService,
    private credentialService: CredentialService,
    private apiService:ApiService,
    private router: Router,

  ) { 


    this.dt = new Date() || this.taskData.enD_DATE;

    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';

    if (navigation?.extras.state) {
      const RecursiveTaskData: any = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;
      console.log('RecursiveTaskData',RecursiveTaskData)

      // if(RecursiveTaskData){
      //   this._getSelectedTaskDetails();
      // }
      // console.log('Selected data', this.taskData)
      if (RecursiveTaskData.mkey) {
        this.updatedDetails = !isNewTemp; // Don't update if adding a new task
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
          console.log('Check task data',this.taskData)
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
    this.activeIndices = this.accordionItems.map((_, index) => index);
    this.initilizeTempDocForm();
    this.onLogin();
  }


  initilizeTempDocForm() {
    this.docTempForm = this.formBuilder.group({
      documentAbbrivation: ['', Validators.required],
      documentNumberFieldName: ['', Validators.required],
      documentDateFieldName: ['', Validators.required],
      documentNotApplied: ['N', Validators.required],
      validityApplied: ['N', Validators.required],
      documentDateApplicable: ['N', Validators.required],
      attachmentApplicable: ['N', Validators.required],
      category:['',Validators.required],
      documentName:['', Validators.required]
    })
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

    this.apiService.getDocCategory(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.docCatList = list
        this.setCategoryData();
        console.log('Document Type List:', this.docCatList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });
  }


  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index);
    } else {
      this.activeIndices.splice(idx, 1);
    }
  }


  addDocumentTemplate() {

    const data = this.credentialService.getUser();
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
    


    const today = new Date();

    const USER_CRED = {
      MKEY: data[0]?.MKEY,
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD),
      COMPANY_ID: data[0]?.COMPANY_ID
    };

    const addTmpDoc:any = {
      doC_ABBR: this.docTempForm.get('documentAbbrivation')?.value,
      doC_NUM_FIELD_NAME: this.docTempForm.get('documentNumberFieldName')?.value,
      doC_NUM_DATE_NAME: this.docTempForm.get('documentDateFieldName')?.value,
      doC_NUM_APP_FLAG: this.docTempForm.get('documentNotApplied')?.value,
      doC_NUM_VALID_FLAG: this.docTempForm.get('validityApplied')?.value,
      doC_NUM_DATE_APP_FLAG: this.docTempForm.get('documentDateApplicable')?.value,
      doC_ATTACH_APP_FLAG: this.docTempForm.get('attachmentApplicable')?.value,
      doC_CATEGORY: Number(this.docTempForm.get('category')?.value),
      doC_NAME: this.docTempForm.get('documentName')?.value,
      attributE1: "",
      attributE2: "",
      attributE3: "",
      attributE4: "",
      createD_BY: data[0]?.MKEY,
      // creatioN_DATE: this.formatDateForInput(today),
      lasT_UPDATED_BY: data[0]?.MKEY,
      companY_ID:data[0]?.COMPANY_ID,
      // lasT_UPDATE_DATE: this.formatDateForInput(today),
      deletE_FLAG: "N"
    }


    console.log('addTmpDoc', addTmpDoc)

    this.apiService.postDocumentTempelate(addTmpDoc, this.recursiveLogginUser).subscribe({
      next:(addTemplateDate:any)=>{
        this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'document-tempelate' }});

        console.log('Data added successfully', addTemplateDate)

      }, error:(error)=>{
        if(error){
          console.error('Error updating task', error)
        }
      }
    })
    
  }



  updateDocTemplate(){

    const data = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();
    const doc_temp_key = this.taskData.mkey

    const doc_num_feild_name = this.docTempForm.get('documentNumberFieldName')?.value
    const doc_date_feild_name = this.docTempForm.get('documentDateFieldName')?.value

    const doc_not_app = this.docTempForm.get('documentNotApplied')?.value
    const doc_date_app =  this.docTempForm.get('documentDateApplicable')?.value

    console.log('doc_num_feild_name', doc_num_feild_name)
    console.log('doc_date_feild_name', doc_date_feild_name)

    console.log('doc_not_app', doc_not_app)
    console.log('doc_date_app', doc_date_app)


    if ((doc_num_feild_name === '' || doc_num_feild_name === undefined || doc_num_feild_name === null) && doc_not_app !== 'N') {
      this.tostar.error(`Please set Document No. Applicable to 'Yes'`);
    }
    
    
    
    console.log(
      "Condition Check:",
      doc_num_feild_name === '' || doc_num_feild_name === undefined || doc_num_feild_name === null,
      "AND",
      doc_not_app === 'Y'
    );
    
    const updateDocTemp = {
      mkey: this.taskData.mkey,
      doC_CATEGORY: Number(this.docTempForm.get('category')?.value),
      doC_NAME: this.docTempForm.get('documentName')?.value,
      doC_ABBR: this.docTempForm.get('documentAbbrivation')?.value,
      doC_NUM_FIELD_NAME: this.docTempForm.get('documentNumberFieldName')?.value,
      doC_NUM_DATE_NAME: this.docTempForm.get('documentDateFieldName')?.value,
      doC_NUM_APP_FLAG: this.docTempForm.get('documentNotApplied')?.value,
      doC_NUM_VALID_FLAG: this.docTempForm.get('validityApplied')?.value,
      doC_NUM_DATE_APP_FLAG: this.docTempForm.get('documentDateApplicable')?.value,
      doC_ATTACH_APP_FLAG: this.docTempForm.get('attachmentApplicable')?.value,
      attributE1: "string",
      attributE2: "string",
      attributE3: "string",
      attributE4: "string",
      attributE5: "string",
      createD_BY: data[0]?.MKEY,
      lasT_UPDATED_BY: data[0]?.MKEY,
      companY_ID:data[0]?.COMPANY_ID
      // status": "string",
      // message": "string"
    }

    console.log(updateDocTemp)

    this.apiService.putDocumentTempelate(updateDocTemp, doc_temp_key,token).subscribe({
      next:(update_doc)=>{
        this.router.navigate(['task/approval-screen'], {queryParams:{ source: 'document-tempelate' }});

        console.log('Doc updated successfully',update_doc )
      },error:(error)=>{
        console.log('Error occured',error)
      }
    })
  }


  setCategoryData(): void {

    if (this.taskData && this.taskData.mkey) {
      // Find the project in the project array

      console.log('docCatList', this.docCatList)
      const matchedCategory = this.docCatList.find((doc_type: any) => doc_type.mkey === this.taskData.doC_CATEGORY);

      console.log('matchedCategory', matchedCategory)

      if (matchedCategory) {
        this.taskData.category_Name = matchedCategory.typE_DESC;
      } else {
        console.log('No matching project found for MASTER_MKEY:', this.taskData.property);
      }
    }
  }


  formatDateForInput(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

 
  onSubmit(): boolean {
    const requiredControls: string[] = [];
    const requiredFields: string[] = [];
    // const formValues = this.docTempForm.value;
  
    const addControlError = (message: string) => requiredControls.push(message);
    // const addFieldError = (message: string) => requiredFields.push(message);
  
    const convertToTitleCase = (input: string) => {
      const titleCase = input.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
      return titleCase + ' is required';
    };
  
    Object.keys(this.docTempForm.controls).forEach(controlName => {
      const control = this.docTempForm.get(controlName);

      // console.log('CHECK documentDateApplicable', this.docTempForm.get('documentDateApplicable')?.value)
  
      if (control?.errors?.required) {
       if(
        (controlName === 'documentNumberFieldName' && this.docTempForm.get('documentNotApplied')?.value === 'Y') ||
        (controlName === 'documentDateFieldName' && this.docTempForm.get('documentDateApplicable')?.value === 'Y') ||
        controlName === 'documentName' ||
        controlName === 'category' ||
        controlName === 'documentAbbrivation' ||
        controlName === 'attachmentApplicable'||
        controlName === 'validityApplied' ||
        controlName === 'documentDateApplicable' ||
        controlName === 'documentNotApplied'
       ){
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
        } 
   
      }
    });


    const check_field_num_name = this.docTempForm.get('documentNumberFieldName')?.value
    const check_field_date_name = this.docTempForm.get('documentDateFieldName')?.value

    const doc_num_applicable = this.docTempForm.get('documentNotApplied')?.value
    const doc_date_applicable = this.docTempForm.get('documentDateApplicable')?.value

    console.log('doc_num_applicable', doc_num_applicable)
    console.log('doc_date_applicable', doc_date_applicable)


    if ((check_field_num_name === 'Y' && doc_num_applicable === 'N')) {
      this.tostar.error(`Please set 'Document No. Applicable' to 'Yes' if field is required`);
      return false;
    }

    if ((check_field_date_name === 'Y' && doc_date_applicable === 'N')) {
      this.tostar.error(`Please set 'Document Date Applicable' to 'Yes' if field is required`);
      return false;
    }

    console.log('check_field_name', check_field_num_name)
    console.log('check_field_date_name', check_field_date_name)
    if (requiredControls.length > 0) {
      const m = `${requiredControls.join(' , ')}`;
      this.tostar.error(`${m}`);
      return false;  
    }
  
    if (requiredFields.length > 0) {
      const m = `${requiredFields.join(' , ')}`;
      this.tostar.error(`${m}`);
      return false;  
    }
  
    return true;
  }

  onAddDocTemp() {
    const isValid = this.onSubmit();

    if (isValid) {
      const sendSuccessMessage = {
        'message': 'Template added successfully'
      };

      if (sendSuccessMessage) {
        this.tostar.success('Successfully!!', sendSuccessMessage['message']);
        this.addDocumentTemplate();
      }
    }
  }


  onUpdateDOcTemp() {
    const isValid = this.onSubmit();

    if (isValid) {
      const sendSuccessMessage = {
        'message': 'Template updated successfully'
      }

      if (sendSuccessMessage) {
        this.tostar.success('Successfully!!', sendSuccessMessage['message']);
        this.updateDocTemplate();
      }
    }
  }


  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }
}
