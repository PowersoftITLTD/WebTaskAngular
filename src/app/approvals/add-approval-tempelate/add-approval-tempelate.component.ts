import { Component, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { IgxComboComponent } from 'igniteui-angular';
import { CITIES, ICity } from './cities';
import { ApiService } from 'src/app/services/api/api.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-approval-tempelate',
  templateUrl: './add-approval-tempelate.component.html',
  styleUrls: ['./add-approval-tempelate.component.css'],
})
export class AddApprovalTempelateComponent implements OnInit {

  public cities: ICity[] = CITIES;
  public selectedCities: ICity[] = [];
  public selectedDocs:any[] = [];
  public filteredDocs: ICity[] = [];

  selectedDocsChecklist: any[] = [];
  selectedDocsEndResult: any[] = [];

  allTags: any[] = [];
  taskData: any;



  selectedAbbr: string = '';

  end_list:object = {};
  check_list:object = {};

  subTask:any[]=[];

  private isCheckValueCalled: boolean = false;


  selectedDocsMap: { [key: string]: any[] } = { endResult: [], checklist: [] };

  buildingList:any [] = [];
  standardList:any[] = [];
  statutoryAuthList:any[] = [];
  jobRoleList:any[] = [];
  departmentList:any[] = [];
  docTypeList:any[] = [];
  SanctoningAuthList:any[]=[];
  SanctoningDeptList:any[]=[];
  employees: any[] = [];
  filteredEmployees: any[] = [];
  fieldErrs:any[]=[];
  ApprovalTempData:any[]=[];
  
  getRelAbbr:any[]=[];

  rows: any[] = [];
  updatedDetails: boolean = false;


  abbrivationError = '';

  check:any 

  selectedAbbrDetails: any = {
    shorT_DESCRIPTION: '',
    long_DESCRIPTION: '',
    nO_DAYS_REQUIRED: null,
    abbR_SHORT_DESC: ''
  };

  createdOrUpdatedUserName:any

  public searchTerm: string = '';
  loginName: string = '';
  loginPassword: string = '';


  inputHasValue: boolean = false;

  @Input() loggedInUser: any;


  @Input() recursiveLogginUser: any = {};

  @ViewChild('noValueKey', { read: IgxComboComponent })
  public comboNoValueKey: IgxComboComponent | any;

  public selectedNoValueKey: ICity[] = [this.cities[4], this.cities[0]];

  approvalTempForm: FormGroup | any;

  receivedUser: string | any;
  public activeIndices: number[] = []; // Change here

  public accordionItems = [
    { title: 'Classification', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Approval', content: 'Some placeholder content for the second accordion panel.' },
    { title: 'End Result', content: 'And lastly, the placeholder content for the third and final accordion panel.' },
    { title: 'Checklist', content: 'And lastly, the placeholder content for the third and final accordion panel.' },
    { title: 'Subtask', content: 'And lastly, the placeholder content for the third and final accordion panel.' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tostar:ToastrService,
    private router: Router,
    private credentialService:CredentialService
    ) { 
      const navigation: any = this.router.getCurrentNavigation();
      const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';
  
      if (navigation?.extras.state) {
        const RecursiveTaskData: any = navigation.extras.state.taskData;
        this.taskData = RecursiveTaskData;
        console.log('RecursiveTaskData', RecursiveTaskData)
  
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
            console.log('Check task data', this.taskData)
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
    this.onLogin();  
    this.InitilizeApprlTempForm();
    this.fetchEmployeeName();
    if (this.taskData && this.taskData.mkey) {
      // this.end_list = this.taskData.enD_RESULT_DOC_LST
      // console.log('checklisT_DOC_LST', this.taskData.checklisT_DOC_LST)
      // console.log('enD_RESULT_DOC_LST', this.taskData.enD_RESULT_DOC_LST)

      console.log('getRelAbbr', this.getRelAbbr)
      

    }

    // this.populateFormWithSavedData(this.taskData.subtasK_LIST)


  }



 

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }


  InitilizeApprlTempForm(){
    this.approvalTempForm = this.formBuilder.group({
      building:['', Validators.required],
      standard:['',Validators.required],
      statutoryAuth:['',Validators.required],
      shortDescription:['',Validators.required],
      longDescrition:['', Validators.required],
      abbr:['',Validators.required],
      department:['',Validators.required],
      assignedTo: [null, Validators.required],
      jobRole:['',Validators.required],
      noOfDays:['',Validators.required],
      sanctioningAuth:['',Validators.required],
      sanctioningDept:['',Validators.required],      
      endResult:['dummy_1, dummy_2'],
      tags:[''],
      rows: this.formBuilder.array([],[this.duplicateAbbrivationValidator()]) 
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

  private fetchData(): void {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();
  
    // 1. Building Classification DP
    this.apiService.getBuildingClassificationDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.buildingList = list;
        // console.log('Building Classification List:', this.buildingList);       
      },
      error: (error: any) => {
        console.error('Unable to fetch Building Classification List', error);
      }
    });
  
    // 2. Standard DP
    this.apiService.getStandardDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.standardList = list;
        // console.log('Standard List:', this.standardList);      
      },
      error: (error: any) => {
        console.error('Unable to fetch Standard List', error);
      }
    });
  
    // 3. Statutory Authority DP
    this.apiService.getStatutoryAuthorityDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.statutoryAuthList = list;
      },
      error: (error: any) => {
        console.error('Unable to fetch Statutory Authority List', error);
      }
    });
  
    // 4. Job Role DP
    this.apiService.getJobRoleDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.jobRoleList = list;
        // console.log('Job Role List:', this.jobRoleList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Job Role List', error);
      }
    });
  
    // 5. Document Type DP
    this.apiService.getDocTypeDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.docTypeList = list

        if(this.taskData && this.taskData.mkey){
          this.mappedSelectedEndList();
          this.mappedSelectedCheckList();


        }
     
        // console.log('Document Type List:', this.docTypeList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });


    this.apiService.getDepartmentDP(this.recursiveLogginUser).subscribe({
      next:(list:any) => {
        this.departmentList = list
      //  console.log('Department List:', this.departmentList);       
      },error:(error:ErrorHandler) =>{

      }
    })


    this.apiService.getSanctoningAuthDP(this.recursiveLogginUser).subscribe({
        next:(list:any)=>{
          this.SanctoningAuthList = list
          // console.log('SanctoningAuthList :', this.SanctoningAuthList);      
        }, error:(error:any)=> {
          console.error('Unable to fetch Document Type List', error);

        }
    })

  if(this.taskData && this.taskData.mkey){
    this.addRow()

    // this.check
    this.end_list = this.taskData.enD_RESULT_DOC_LST;
    this.check_list = this.taskData.checklisT_DOC_LST;      
    }
  }


  async addApprovalTempelate() {

    const fieldErrors: string[] = [];

    const USER_CRED = this.credentialService.getUser();
    const abbrivation = this.approvalTempForm.get('abbr')?.value;
    const addFieldError = (message: string) => fieldErrors.push(message);

    const assignedToValue = this.approvalTempForm.get('assignedTo')?.value.trim();
    const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);

    if (!assignedEmployee || !assignedEmployee.MKEY) {
        addFieldError('Please select valid Responsible Person');
    }

    if (abbrivation) {
        try {
            const isAbbrUsed = await this.apiService.getAbbrivationCheck(abbrivation, this.recursiveLogginUser).toPromise();
            if (isAbbrUsed) {
                this.abbrivationError = 'Abbreviation name already been taken.';
                addFieldError('Abbreviation name already exist');
            }
        } catch (error) {
            console.error('Error checking abbreviation', error);
        }
    }

    if (fieldErrors.length > 0) {
      const errorMessage = fieldErrors.join(' , '); 
      this.tostar.error(errorMessage);
      return;
  }

  const formArrayVal: FormArray = (this.approvalTempForm.get('rows') as FormArray);
  const val_of_formArr = formArrayVal.value;
  
  console.log('val_of_formArr', val_of_formArr);
  
  const subTasks = val_of_formArr
    .filter((row: any) => {
      // Check if any field is empty. You can adjust this check based on the specific fields you want to validate.
      return row.subtasK_MKEY && row.sequentialNo && row.abbrivation;
    })
    .map((row: any, index: number) => {
      return {
        subtasK_MKEY: row.subtasK_MKEY,  
        seQ_NO: row.sequentialNo.toString(),  
        subtasK_ABBR: row.abbrivation,  
        // SUBTASK_TAGS: sub_tags || null
      };
    });
  
  

    console.log('subTasks', subTasks);

    const tagsValue = this.approvalTempForm.get('tags')?.value;

    let tagsString = '';
    // console.log('tagsValue', tagsValue)

    if (Array.isArray(tagsValue)) {
      tagsString = tagsValue.map(tag => {
        if (typeof tag === 'string') {
          return tag;
        } else if (tag.display) {
          return tag.display;
        } else {
          return '';
        }
      }).join(',');
    }

    console.log('tagsString', tagsString)

  
    const addApprovalTemplate = this.createApprovalTemplate(abbrivation, assignedEmployee.MKEY, USER_CRED[0].MKEY, subTasks, tagsString);

    console.log('addApprovalTemplate', addApprovalTemplate);

    try {
        const addApprlTempData = await this.apiService.postApprovalTemp(addApprovalTemplate, this.recursiveLogginUser).toPromise();
        console.log('Data added successfully', addApprlTempData);
    } catch (error) {
        console.error('Error updating task', error);
        addFieldError('Error updating task');
    }

    if (fieldErrors.length > 0) {
        this.fieldErrs = fieldErrors 
        fieldErrors.forEach(errorMessage => this.tostar.error(errorMessage));
    }

    this.tostar.success('Success','Template added successfuly')

    this.router.navigate(['./'])
    // const formArrayVal:FormArray = (this.approvalTempForm.get('rows') as FormArray).value;

    // console.log('formArrayVal from Add Tempelate',formArrayVal)


}

getTags() {
  this.loggedInUser = this.credentialService.getUser();
  const token = this.apiService.getRecursiveUser();

  console.log('getTagDetailss1', token);

  this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => { 
      this.allTags = response[0].data.map((item: { name: string }) => item.name);
  
  });
}




private createApprovalTemplate(MAIN_ABBR: string, employeeMKey: number, userMKey: number, Subtask:[], tagsString:string) {
    return {
        abbR_SHORT_DESC:this.approvalTempForm.get('shortDescription')?.value,
        buildinG_TYPE: Number(this.approvalTempForm.get('building')?.value),        
        buildinG_STANDARD: Number(this.approvalTempForm.get('standard')?.value),
        statutorY_AUTHORITY: Number(this.approvalTempForm.get('statutoryAuth')?.value),
        shorT_DESCRIPTION: this.approvalTempForm.get('shortDescription')?.value,
        lonG_DESCRIPTION: this.approvalTempForm.get('longDescrition')?.value,
        MAIN_ABBR,
        authoritY_DEPARTMENT: this.approvalTempForm.get('department')?.value,
        resposiblE_EMP_MKEY: employeeMKey,
        joB_ROLE: Number(this.approvalTempForm.get('jobRole')?.value),
        dayS_REQUIERD: Number(this.approvalTempForm.get('noOfDays')?.value),
        attributE1: userMKey.toString(),
        attributE2: "ADD FORM",
        attributE3: "SAVE BUTTON",
        attributE4: "",
        attributE5: "",
        createD_BY: userMKey || 0,
        lasT_UPDATED_BY: userMKey || 0,
        sanctioN_AUTHORITY: Number(this.approvalTempForm.get('sanctioningAuth')?.value),
        sanctioN_DEPARTMENT: this.approvalTempForm.get('sanctioningDept')?.value,
        enD_RESULT_DOC: "",
        checklisT_DOC: "",
        deletE_FLAG: "N", 
        enD_RESULT_DOC_LST:this.end_list,
        checklisT_DOC_LST:this.check_list,
        TAGS:tagsString,
        subtasK_LIST:Subtask || []
    };
}





updateApprovalTemplate(){

  const USER_CRED = this.credentialService.getUser();

  const token = this.apiService.getRecursiveUser();

  const fieldErrors: string[] = [];
  const addFieldError = (message: string) => fieldErrors.push(message);

  const assignedToValue = this.approvalTempForm.get('assignedTo')?.value.trim();
  const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);

  if (!assignedEmployee || !assignedEmployee.MKEY) {
      addFieldError('Please select valid Responsible Person');
  }

  const formArrayVal: FormArray = (this.approvalTempForm.get('rows') as FormArray);
  const val_of_formArr = formArrayVal.value;
  
  console.log('val_of_formArr', val_of_formArr);
  
  const subTasks = val_of_formArr
    .filter((row: any) => {
      // Check if any field is empty. You can adjust this check based on the specific fields you want to validate.
      return row.subtasK_MKEY && row.sequentialNo && row.abbrivation;
    })
    .map((row: any, index: number) => {
      return {
        subtasK_MKEY: row.subtasK_MKEY,  
        seQ_NO: row.sequentialNo.toString(),  
        subtasK_ABBR: row.abbrivation,  
        // SUBTASK_TAGS: sub_tags || null
      };
    });
  

    const tagsValue = this.approvalTempForm.get('tags')?.value;

    let tagsString = '';
    // console.log('tagsValue', tagsValue)

    if (Array.isArray(tagsValue)) {
      tagsString = tagsValue.map(tag => {
        if (typeof tag === 'string') {
          return tag;
        } else if (tag.display) {
          return tag.display;
        } else {
          return '';
        }
      }).join(',');
    }
  

    console.log('subTasks', subTasks);
    const doc_temp_key = this.taskData.mkey

  // console.log('checklisT_DOC_LST', this.taskData.checklisT_DOC_LST)
  // console.log('enD_RESULT_DOC_LST', this.taskData.enD_RESULT_DOC_LST)

  const updateApprlTemp = {
    mkey:this.taskData.mkey,
    abbR_SHORT_DESC:this.approvalTempForm.get('shortDescription')?.value,
    buildinG_TYPE: Number(this.approvalTempForm.get('building')?.value),        
    buildinG_STANDARD: Number(this.approvalTempForm.get('standard')?.value),
    statutorY_AUTHORITY: Number(this.approvalTempForm.get('statutoryAuth')?.value),
    shorT_DESCRIPTION: this.approvalTempForm.get('shortDescription')?.value,
    lonG_DESCRIPTION: this.approvalTempForm.get('longDescrition')?.value,
    maiN_ABBR:this.approvalTempForm.get('abbr')?.value,
    authoritY_DEPARTMENT: this.approvalTempForm.get('department')?.value,
    resposiblE_EMP_MKEY: assignedEmployee.MKEY,
    joB_ROLE: Number(this.approvalTempForm.get('jobRole')?.value),
    dayS_REQUIERD: Number(this.approvalTempForm.get('noOfDays')?.value),
    attributE1: null,
    attributE2: "SAVE FORM",
    attributE3: "SAVE BUTTON",
    attributE4: null,
    attributE5: null,
    createD_BY: USER_CRED[0].MKEY,
    lasT_UPDATED_BY: USER_CRED[0].MKEY,  
    sanctioN_AUTHORITY: Number(this.approvalTempForm.get('sanctioningAuth')?.value),
    sanctioN_DEPARTMENT: this.approvalTempForm.get('sanctioningDept')?.value,
    enD_RESULT_DOC: "",
    checklisT_DOC: "",
    deletE_FLAG: "N", 
    enD_RESULT_DOC_LST:this.end_list,
    checklisT_DOC_LST:this.check_list,
    tags:tagsString,
    subtasK_LIST:subTasks || []
  }

  console.log('updateApprlTemp', updateApprlTemp)

  this.apiService.putApprovalTemp(updateApprlTemp,doc_temp_key, token).subscribe({
    next:(data)=>{
      this.tostar.success('Success','Template updated successfuly')
      this.router.navigate(['../'])
      console.log('data successfully updated', data)
    },error:()=>{

    }
  })
}






fetchEmployeeName(): void {
  const token = this.apiService.getRecursiveUser();;

  this.apiService.getEmpDetailsNew(token).subscribe(
    (response: any) => {
      // console.log("Employee data:", data);
      // const _data = data;

      response[0]?.data.forEach((emp: any) => {
        const fullName = emp.EMP_FULL_NAME;
        const MKEY = emp.MKEY;
        let capitalizedFullName = '';
        const nameParts = fullName.split(' ');

        // console.log('nameParts', nameParts)

        for (let i = 0; i < nameParts.length; i++) {
          if (nameParts[i].length === 1 && i < nameParts.length - 1) {
            capitalizedFullName += nameParts[i].toUpperCase() + '.' + nameParts[i + 1].charAt(0).toUpperCase() + nameParts[i + 1].slice(1).toLowerCase();
            i++;
          } else {
            capitalizedFullName += nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1).toLowerCase();
          }
          if (i !== nameParts.length - 1) {
            capitalizedFullName += ' ';
          }
        }

        this.employees.push({ Assign_to: capitalizedFullName, MKEY: MKEY });
        this.setEmpName();
      });
      // console.log('this.employees', this.employees);    
    },
    (error: ErrorHandler) => {
      console.error('Error fetching employee details:', error);
    }
  );
}


 setEmpName(): void {
  if (this.taskData && this.taskData.mkey) {

    // console.log('setEmpName',this.employees)
    // console.log('this.departmentList', this.departmentList)
    const matchedEmp = this.employees.find((employee: any) =>
      employee.MKEY === Number(this.taskData.resposiblE_EMP_MKEY)
    );

    // console.log('matchedEmp', matchedEmp)

    if (matchedEmp) {
      this.taskData.emp_name = matchedEmp.Assign_to;
    }
  }
}

filterEmployees(event: Event): void {
  const value = (event.target as HTMLInputElement).value.trim();

  if (!value) {
    this.filteredEmployees = [];
    return;
  }

  const filterValue = value.toLowerCase();
  this.filteredEmployees = this.employees.filter(emp => {
    const fullName = emp.Assign_to.toLowerCase();
    return fullName.includes(filterValue);
  });

  this.inputHasValue = value.trim().length > 0;

}


selectEmployee(employee: any): void {

  const assignedTo = employee.Assign_to;

  this.approvalTempForm.get('assignedTo').setValue(assignedTo);

  if (assignedTo) {
    this.filteredEmployees = [];
    return
  }
}
   




  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index); // Add index if not present
    } else {
      this.activeIndices.splice(idx, 1); // Remove index if present
    }
  }

  filterCities() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDocs = this.cities.filter(city =>
      city.name.toLowerCase().includes(term)      
    );

  }


  mappedSelectedEndList() {

    let mappedSelectedArray: any[] = [];

    let allSelectedMkeys: number[] = [];

    for (let key in this.taskData.enD_RESULT_DOC_LST) {
        if (this.taskData.enD_RESULT_DOC_LST.hasOwnProperty(key)) {
            const selectedMkeysString = this.taskData.enD_RESULT_DOC_LST[key];

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

    this.selectedDocsMap['endResult'] = mappedSelectedArray;

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





    toggleSelection(listType: 'endResult' | 'checklist', doc: any) {
      console.log('listType', listType);
   
      const selectedDocs: any = this.selectedDocsMap[listType];    
      
      const index = selectedDocs.findIndex((selected: any) => selected.mkey === doc.mkey);
      if (index === -1) {
        selectedDocs.push(doc);  
        console.log('selectedDocs', selectedDocs)
      } else {
        selectedDocs.splice(index, 1); 
      }
    
      let end_list: { [key: string]: string } = {};  
      let check_list: { [key: string]: string } = {};  
    
      selectedDocs.forEach((selected: any) => {
        const key = selected.attributE2;  
        const mkey = selected.mkey.toString(); 
    
        // Grouping logic for 'endResult'
        if (listType === 'endResult') {
          if (end_list[key]) {
            end_list[key] += `, ${mkey}`;
          } else {
            end_list[key] = mkey;
          }
        }
    
        // Grouping logic for 'checklist'
        if (listType === 'checklist') {
          if (check_list[key]) {
            check_list[key] += `, ${mkey}`;
          } else {
            check_list[key] = mkey;
          }
        }
      });
    
      // Log the results based on listType after the toggle operation
      if (listType === 'endResult') {
        this.end_list = end_list
        console.log('end_list result:', this.end_list);
      } else if (listType === 'checklist') {
        this.check_list = check_list
        console.log('check_list result:', this.check_list );
      }
    }
              

      isSelected(listType: 'endResult' | 'checklist', doc: any): boolean {
        return this.selectedDocsMap[listType].some(selected => selected.mkey === doc.mkey);

      }

      getUniqueDocs(listType: 'endResult' | 'checklist'): string[] {
        return Array.from(new Set(this.docTypeList.map(docs => docs.attributE2)));
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
   

   // Declare a flag to track if checkValue has already been called

addRow(savedData?: any) {
  const buildingType = this.approvalTempForm.get('building')?.value;
  const buildingStandard = this.approvalTempForm.get('standard')?.value;
  const statutoryAuthority = this.approvalTempForm.get('statutoryAuth')?.value;

  if (buildingType && buildingStandard && statutoryAuthority) {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();

    console.log(`buildingType ${buildingType} buildingStandard ${buildingStandard} statutoryAuthority ${statutoryAuthority}`);
    
    // API call to fetch abbreviation and other data
    this.apiService.GetAbbrAndShortAbbr(buildingType, buildingStandard, statutoryAuthority, this.recursiveLogginUser).subscribe({
      next: (gerAbbrRelData) => {
        this.checkValue(gerAbbrRelData); // Call checkValue to process the first time

        // console.log(gerAbbrRelData);
        this.getRelAbbr = Array.isArray(gerAbbrRelData) ? gerAbbrRelData : [gerAbbrRelData];

        // console.log(getRelAbbr)
        
        const rows: FormArray = this.approvalTempForm.get('rows') as FormArray;
        console.log('Rows check', rows);

        const tagsValue = rows.get('subTaskTags')?.value || [];
        let tagsString: string = '';

        if (Array.isArray(tagsValue)) {
          tagsString = tagsValue.map(tag => {
            if (typeof tag === 'string') {
              return tag;
            } else if (tag.display) {
              return tag.display;
            } else {
              return '';
            }
          }).join(',');
        }

        console.log('tagsString from row', tagsString);

        // Create a new row with the necessary controls
        const newRow = this.formBuilder.group({
          abbrivation: ['', Validators.required],
          shorT_DESCRIPTION: [''],
          sanctioN_DEPARTMENT: [''],
          nO_DAYS_REQUIRED: [''],
          authoritY_DEPARTMENT: [''],
          enD_RESULT_DOC: [''],
          subtasK_MKEY: [''],
          subTaskTags: [tagsString],
          sequentialNo: [rows.length + 1],
        });

        rows.push(newRow);

        if (!this.isCheckValueCalled) {
          this.isCheckValueCalled = true;
        } else {
          this.checkValueForNewRow(newRow);
        }
      },
      error: (err) => {
        this.tostar.error('Unable to fetch data, please check internet connection');
      }
    });
  } else {
    this.tostar.error('Please select all classification');
    return;
  }
}

// Modify checkValue to handle only new rows after the first call
checkValue(values?: any) {
  const formArray = this.approvalTempForm.get('rows') as FormArray;
  // console.log('this.getRelAbbr from checkValue', values);

  if (!this.isCheckValueCalled) {
    // Process all the rows for the first time if checkValue is not yet called
    values.forEach((value: any) => {
      if (this.taskData && this.taskData.subtasK_LIST) {
        this.taskData.subtasK_LIST.forEach((subtask: any) => {
          const departmentList = this.departmentList;
          const matchedDepartment = departmentList.find(department => department.mkey === value.authoritY_DEPARTMENT);

          // console.log('matchedDepartment', matchedDepartment);

          if (matchedDepartment) {
            value.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
          } else {
            console.log("Department not found");
          }

          if (value.maiN_ABBR && value.maiN_ABBR === subtask.subtasK_ABBR) {
            const rowForm = this.formBuilder.group({
              sequentialNo: [subtask.seQ_NO],
              abbrivation: [subtask.subtasK_ABBR],
              shorT_DESCRIPTION: [value.abbR_SHORT_DESC],
              sanctioN_DEPARTMENT: [value.sanctioN_DEPARTMENT || ''],
              nO_DAYS_REQUIRED: [value.dayS_REQUIERD || ''],
              authoritY_DEPARTMENT: [value.authoritY_DEPARTMENT || ''],
              enD_RESULT_DOC: [value.enD_RESULT_DOC || ''],
              subtasK_MKEY: [subtask.subtasK_MKEY],
              subTaskTags: [''],
            });

            formArray.push(rowForm);
          }
        });
      }
    });
  }
}

// Method to process only the newly added row
checkValueForNewRow(newRow: AbstractControl) {
  const formArray = this.approvalTempForm.get('rows') as FormArray;
  // Process the new row only
  const newRowData = newRow.value; // Get the data for the new row
  const values = [newRowData]; // Treat the new row as the only value

  values.forEach((value: any) => {
    if (this.taskData && this.taskData.subtasK_LIST) {
      this.taskData.subtasK_LIST.forEach((subtask: any) => {
        const departmentList = this.departmentList;
        const matchedDepartment = departmentList.find(department => department.mkey === value.authoritY_DEPARTMENT);

        if (matchedDepartment) {
          value.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
        } else {
          console.log("Department not found");
        }

        if (value.maiN_ABBR && value.maiN_ABBR === subtask.subtasK_ABBR) {
          const rowForm = this.formBuilder.group({
            sequentialNo: [subtask.seQ_NO],
            abbrivation: [subtask.subtasK_ABBR],
            shorT_DESCRIPTION: [value.abbR_SHORT_DESC],
            sanctioN_DEPARTMENT: [value.sanctioN_DEPARTMENT || ''],
            nO_DAYS_REQUIRED: [value.dayS_REQUIERD || ''],
            authoritY_DEPARTMENT: [value.authoritY_DEPARTMENT || ''],
            enD_RESULT_DOC: [value.enD_RESULT_DOC || ''],
            subtasK_MKEY: [subtask.subtasK_MKEY],
            subTaskTags: [''],
          });

          formArray.push(rowForm);
        }
      });
    }
  });
}

    
    
    


    populateFormWithSavedData(savedData: any[]) {
      const rows = this.approvalTempForm.get('rows') as FormArray;
  
    
      savedData.forEach(data => {
        const rowFormGroup = this.formBuilder.group({
          sequentialNo: [data.seQ_NO],
          abbrivation: [data.subtasK_ABBR],
          shorT_DESCRIPTION: [data.attributE1 || ''],  // Ensure these match your field names
          sanctioN_DEPARTMENT: [data.attributE2 || ''],
          nO_DAYS_REQUIRED: [data.attributE3 || ''],
          enD_RESULT_DOC: [data.attributE4 || ''],
          selectedAbbr: [data.subtasK_ABBR],  // Store selected abbreviation
          subtasK_MKEY: [data.subtasK_MKEY],
          SUBTASK_TAGS: [data.subTaskTags || []],  // Adjust according to your data structure
          authoritY_DEPARTMENT: [data.attributE5 || '']
        });
    
        // Add the FormGroup to the FormArray
        rows.push(rowFormGroup);
      });
    }

                

      onAbbrChange(event: Event, rowForm: FormGroup) {
        const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement

        const selectedAbbr = selectElement.value; // Now TypeScript knows 'value' exists
        console.log('selectedAbbr',selectedAbbr)

        const formArrayVal = (this.approvalTempForm.get('rows') as FormArray).controls;
        console.log('Rows:', formArrayVal);
        rowForm.get('abbrivation')?.setValue(selectedAbbr);
        
        
        const selectedRow = this.getRelAbbr.find(r => r.maiN_ABBR === selectedAbbr);
        const departmentList = this.departmentList  

        // console.log('Department', departmentList)

        const matchedDepartment = departmentList.find(department => department.mkey === selectedRow.authoritY_DEPARTMENT);

          if (matchedDepartment) {
              selectedRow.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
          } else {
              console.log("Department not found");
          }

          console.log('SELECTED ROEW',selectedRow)
   
        console.log('Selected Row onAbbrChange', selectedRow.mkey)
        if (selectedRow) {            
            rowForm.get('selectedAbbr')?.setValue(selectedRow.maiN_ABBR);
            rowForm.get('shorT_DESCRIPTION')?.setValue(selectedRow.shorT_DESCRIPTION);
            rowForm.get('sanctioN_DEPARTMENT')?.setValue(selectedRow.sanctioN_DEPARTMENT);
            rowForm.get('nO_DAYS_REQUIRED')?.setValue(selectedRow.dayS_REQUIERD);
            rowForm.get('enD_RESULT_DOC')?.setValue(selectedRow.enD_RESULT_DOC)
            rowForm.get('authoritY_DEPARTMENT')?.setValue(selectedRow.abbR_SHORT_DESC);
            rowForm.get('subtasK_MKEY')?.setValue(selectedRow.mkey)
            rowForm.get('SUBTASK_TAGS')?.setValue(selectedRow.subTaskTags)
        } else {
            rowForm.get('selectedAbbr')?.setValue('');
            rowForm.get('shorT_DESCRIPTION')?.setValue('');
            rowForm.get('sanctioN_DEPARTMENT')?.setValue('');
            rowForm.get('nO_DAYS_REQUIRED')?.setValue('');
            rowForm.get('enD_RESULT_DOC')?.setValue('');
            rowForm.get('authoritY_DEPARTMENT')?.setValue('');
            rowForm.get('subtasK_MKEY')?.setValue('');
            rowForm.get('SUBTASK_TAGS')?.setValue('');


        }
    }
    
  
    
      
    
      // Function to clear the fields if no abbreviation is selected
      clearFields(row: any): void {
        row.shorT_DESCRIPTION = '';
        row.long_DESCRIPTION = '';
        row.nO_DAYS_REQUIRED = null;
        row.enD_RESULT_DOC = '';
        row.abbR_SHORT_DESC = '';
      }
    

    

      toggleSave(row: any) {
        // Toggle the isSaved property of the current row
        row.isSaved = !row.isSaved;
      }
      

      removeRow(index: number) {
        const rows = this.approvalTempForm.get('rows') as FormArray;
        
        if (rows.length > 0) {
          // Remove the row at the specified index
          rows.removeAt(index);
          
          // Optionally, update the sequential numbers if required after removal
          this.updateSequentialNumbers();
        } else {
          console.warn('No rows to remove');
        }
      }
      
      updateSequentialNumbers() {
        const rows = this.approvalTempForm.get('rows') as FormArray;
        rows.controls.forEach((row, index) => {
          // Update the sequential number after a row is removed
          row.get('sequentialNo')?.setValue(index + 1); // Starts from 1
        });
      }


   duplicateAbbrivationValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const formArray = control as FormArray;
          const seenAbbrivation = new Set<string>();
      
          for (const rowControl of formArray.controls) {
            const abbrivation = rowControl.get('abbrivation')?.value;
            if (abbrivation && seenAbbrivation.has(abbrivation)) {
              return { duplicateAbbrivation: true };
            }
            seenAbbrivation.add(abbrivation);
          }
          return null; 
        };
      }
      

  onSubmit() {
    const requiredControls: string[] = [];
    const requiredFields:string[] = [];
    const valid = this.approvalTempForm.valid;  

    const addControlError = (message: string) => requiredControls.push(message);

    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };

    Object.keys(this.approvalTempForm.controls).forEach(controlName => {
      const control = this.approvalTempForm.get(controlName);

      if (control?.errors?.required) {
        // Convert camelCase to Title Case
        const formattedControlName = convertToTitleCase(controlName);
        addControlError(formattedControlName);
      }
    });


    if (requiredControls.length > 0) {
      const m = `${requiredControls.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    }
    const formArrayVal:any = (this.approvalTempForm.get('rows') as FormArray);
    // console.log('formArrayVal', formArrayVal.value)

    // const val_of_formArr = formArrayVal.value

    // console.log('val_of_formArr', val_of_formArr)

    // const subTasks = val_of_formArr.map((row: any, index: number) => {
    //   return {
    //     subtasK_MKEY: index + 1,      
    //     seQ_NO: row.sequentialNo.toString(),              
    //     subtasK_ABBR: row.abbrivation,  
    //   };
    // });
    
    // this.subTask = subTasks;

    // console.log(this.subTask)

    if (!valid) {
      if (formArrayVal.hasError('duplicateAbbrivation')) {
        this.tostar.error('Please select unique abbreviation from SUBTASK', 'Duplicate record found');
      } 
      return false; 
    }
  
    return true; 
  }
  
  onAddTempDoc() {
    const isValid = this.onSubmit(); 
    
    if (isValid) {
      
      this.addApprovalTempelate();
    } else {
      console.log('Form is invalid, cannot add template');
    }
  }

  onUpdateTempDoc(){
    const isValid = this.onSubmit();

    if(isValid){
      this.updateApprovalTemplate();
    }else{
      this.updateApprovalTemplate();

      console.log('Form is invalid, cannot add template');
    }
  }
  

  ngOnDestroy(): void {
    console.log('Component is being destroyed');

    sessionStorage.removeItem('task');
  }

}


