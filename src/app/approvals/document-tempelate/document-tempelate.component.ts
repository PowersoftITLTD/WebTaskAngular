<<<<<<< HEAD
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)

@Component({
  selector: 'app-document-tempelate',
  templateUrl: './document-tempelate.component.html',
  styleUrls: ['./document-tempelate.component.css']
})
export class DocumentTempelateComponent implements OnInit {

<<<<<<< HEAD
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

=======
  public activeIndices: number[] = []; // Change here
  receivedUser: string | any;

>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)

  public accordionItems = [
    { title: 'Meta data fields as per ISO', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Location fields as per ACC', content: 'Some placeholder content for the second accordion panel.' },
  ];

<<<<<<< HEAD
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
        console.log('Document Type List:', this.docCatList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });
=======
  constructor() { }

  ngOnInit(): void {
    this.activeIndices = this.accordionItems.map((_, index) => index);
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  }


  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
<<<<<<< HEAD
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
      doc_NAME: this.docTempForm.get('documentName')?.value,
      attributE1: "",
      attributE2: "",
      attributE3: "",
      attributE4: "",
      createD_BY: data[0]?.MKEY.toString(),
      creatioN_DATE: this.formatDateForInput(today),
      lasT_UPDATED_BY: data[0]?.MKEY.toString(),
      lasT_UPDATE_DATE: this.formatDateForInput(today),
      deletE_FLAG: "N"
    }

    console.log('addTmpDoc', addTmpDoc)

    this.apiService.postDocumentTempelate(addTmpDoc, this.recursiveLogginUser).subscribe({
      next:(addTemplateDate:any)=>{
        console.log('Data added successfully', addTemplateDate)

      }, error:(error)=>{
        if(error){
          console.error('Error updating task', error)
        }
      }
    })
    
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
  
      if (control?.errors?.required) {
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });
  
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
  
    return this.docTempForm.valid;
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


  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }
=======
      this.activeIndices.push(index); // Add index if not present
    } else {
      this.activeIndices.splice(idx, 1); // Remove index if present
    }
  }
 

>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
}
