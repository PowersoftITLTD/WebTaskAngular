import { ChangeDetectorRef, Component, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { IgxComboComponent } from 'igniteui-angular';
import { CITIES, ICity } from './cities';
import { ApiService } from 'src/app/services/api/api.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentDialogComponent } from './add-document-dialog/add-document-dialog.component';
import { AddInstructionDialogComponent } from './add-instruction-dialog/add-instruction-dialog.component';

@Component({
  selector: 'app-add-approval-tempelate',
  templateUrl: './add-approval-tempelate.component.html',
  styleUrls: ['./add-approval-tempelate.component.css'],
})
export class AddApprovalTempelateComponent implements OnInit {

  public cities: ICity[] = CITIES;

  public selectedCities: ICity[] = [];
  public selectedDocs: any[] = [];
  public filteredDocs: ICity[] = [];

  selectedDocsChecklist: any[] = [];
  selectedDocsEndResult: any[] = [];

  allTags: any[] = [];
  taskData: any;

  lodingTrue: boolean = false;

  currentDate: string = new Date().toISOString().split('T')[0];

  selectedAbbr: string = '';
  searchQuery: string = '';
  searchQuery_1: string = '';

  end_list: object = {};
  check_list: object = {};

  subTask: any[] = [];

  private isCheckValueCalled: boolean = false;
  private isCheckValueCalled_1: boolean = false;


  selectedDocsMap: { [key: string]: any[] } = { endResult: [], checklist: [] };

  buildingList: any[] = [];
  standardList: any[] = [];
  statutoryAuthList: any[] = [];
  jobRoleList: any[] = [];
  departmentList: any[] = [];
  docTypeList: any[] = [];
  instruDetailsList: any[] = [];
  SanctoningAuthList: any[] = [];
  SanctoningDeptList: any[] = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];
  fieldErrs: any[] = [];
  ApprovalTempData: any[] = [];
  selectedTags:any[]=[];

  getRelAbbr: any[] = [];

  rows: any[] = [];

  updatedDetails: boolean = false;
  isInsertingApprl: boolean = false;



  abbrivationError = '';

  check: any

  selectedAbbrDetails: any = {
    shorT_DESCRIPTION: '',
    long_DESCRIPTION: '',
    nO_DAYS_REQUIRED: null,
    abbR_SHORT_DESC: ''
  };

  createdOrUpdatedUserName: any

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
    private tostar: ToastrService,
    private router: Router,
    private credentialService: CredentialService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';

    if (navigation?.extras.state) {
      const RecursiveTaskData: any = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;
      console.log('Approval: ', RecursiveTaskData)
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
    this.InitilizeApprlTempForm();
    this.fetchEmployeeName();
    this.getTags();
    if (this.taskData && this.taskData.mkey) {

      this.selectedTags = this.taskData?.tags.split(',')

      console.log('Tag', this.selectedTags)
      // this.end_list = this.taskData.enD_RESULT_DOC_LST
      // console.log('checklisT_DOC_LST', this.taskData.checklisT_DOC_LST)
      // console.log('enD_RESULT_DOC_LST', this.taskData.enD_RESULT_DOC_LST)
      // console.log('getRelAbbr', this.getRelAbbr)
    }
    // this.populateFormWithSavedData(this.taskData.subtasK_LIST)
  }





  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }


  InitilizeApprlTempForm() {
    this.approvalTempForm = this.formBuilder.group({
      building: ['', Validators.required],
      standard: ['', Validators.required],
      statutoryAuth: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescrition: ['', Validators.required],
      abbr: ['', Validators.required],
      department: ['', Validators.required],
      assignedTo: [null],
      jobRole: ['', Validators.required],
      noOfDays: ['', Validators.required],
      // sanctioningAuth:['',Validators.required],
      // sanctioningDept:['',Validators.required],      
      endResult: ['dummy_1, dummy_2'],
      tags: [''],
      sequenceOrder: [''],
      rows: this.formBuilder.array([], [this.duplicateAbbrivationValidator()]),
      rows_new: this.formBuilder.array([])
    })
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

        if (this.taskData && this.taskData.mkey) {
          this.mappedSelectedEndList();
          this.mappedSelectedCheckList();
        }

        // console.log('Document Type List:', this.docTypeList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });


    this.apiService.getInstructionDetails(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.instruDetailsList = list

        if (this.taskData && this.taskData.mkey) {
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
      next: (list: any) => {
        this.departmentList = list
        //  console.log('Department List:', this.departmentList);       
      }, error: (error: ErrorHandler) => {

      }
    })


    this.apiService.getSanctoningAuthDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.SanctoningAuthList = list
        // console.log('SanctoningAuthList :', this.SanctoningAuthList);      
      }, error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);

      }
    })

    if (this.taskData && this.taskData.mkey) {

      const formArrayVal_new: FormArray = this.approvalTempForm.get('rows') as FormArray;

      formArrayVal_new.removeAt(formArrayVal_new.length);


      console.log('formArrayVal_new: ', formArrayVal_new)
      this.addRow()
      this.checkValueForNewRow_1();

      

        // Ensure FormArray is not empty before checking the last row
      //  if (formArrayVal_new.length > 0) {
      //   const lastRow = formArrayVal_new.at(formArrayVal_new.length - 1);

      //   // Check if the last row is empty (adjust conditions as needed)
      //   if (lastRow.value && Object.values(lastRow.value).every(val => val === null || val === '')) {
      //   }
      // } 

      // this.check
      this.end_list = this.taskData.enD_RESULT_DOC_LST;
      this.check_list = this.taskData.checklisT_DOC_LST;
    }
  }


  openDialog(): void {
    this.dialog.open(AddDocumentDialogComponent, {
      width: '80rem',
      data: { /* Any data to pass to the modal if needed */ }
    });
  }


  openDialogINSTR(): void {
    const dialogRef = this.dialog.open(AddInstructionDialogComponent, {
      width: '50rem',
      height: '20rem',
      data: { /* Any data you want to pass to the dialog */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result)

        // this.approvalTempForm.reset();
        // this.cdr.detectChanges();  // Manually trigger change detection


        const new_instr = {
          typE_DESC: result[0].typE_DESC,
          attributE2: result[0].typE_CODE,
          mkey: result[0].mkey
        }
        this.instruDetailsList.push(new_instr);
      }
    });
  }

  async addApprovalTempelate() {

    this.lodingTrue = true;

    // setTimeout(() => {
    //   this.lodingTrue = false;
    //   this.tostar.error('Something went wrong.');
    // }, 10000);
    

    const fieldErrors: string[] = [];

    const USER_CRED = this.credentialService.getUser();
    const abbrivation = this.approvalTempForm.get('abbr')?.value;
    const addFieldError = (message: string) => fieldErrors.push(message);

    const assignedToValue = this.approvalTempForm.get('assignedTo')?.value;
    const trimmedAssignedToValue = assignedToValue ? assignedToValue.trim() : ''; const assignedEmployee = this.employees.find(employee => employee.Assign_to === assignedToValue);

    if (!assignedEmployee || !assignedEmployee.MKEY) {
      trimmedAssignedToValue === null
      // addFieldError('Please select valid Responsible Person');
    }

    if (abbrivation) {
      try {
        const isAbbrUsed = await this.apiService.getAbbrivationCheck(abbrivation, this.recursiveLogginUser).toPromise();
        if (isAbbrUsed) {
          console.log('Check abbrivarion: ', isAbbrUsed);
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

    // console.log('val_of_formArr', val_of_formArr);

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


    const formArrayVal_new: FormArray = (this.approvalTempForm.get('rows_new') as FormArray);
    const val_of_formArr_new = formArrayVal_new.value;

    const subAuth = val_of_formArr_new
      .map((row: any) => {
        return {
          LEVEL: row.level.toString(),
          SANCTIONING_DEPARTMENT: row.sanctioningDept,
          SANCTIONING_AUTHORITY: row.sanctioningAuth,
          START_DATE: row.startDate_newRow,
          END_DATE: row.endDate_newRow ? row.endDate_newRow : null
        }
      })

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

    console.log('Tags: ', tagsString)

    const assignedEmployeeMKey = assignedEmployee ? assignedEmployee.MKEY : null;
    const addApprovalTemplate = this.createApprovalTemplate(abbrivation, assignedEmployeeMKey, USER_CRED[0].MKEY, subTasks, subAuth, tagsString);

    try {
      const addApprlTempData = await this.apiService.postApprovalTemp(addApprovalTemplate, this.recursiveLogginUser).toPromise();
      console.log('Data added successfully', addApprlTempData);

     console.log('message: ',addApprlTempData.message)
     if(addApprlTempData.message === 'Duplicate'){
        this.tostar.error('This abbrivation is already taken');
        return;
     }
    } catch (error) {
      console.error('Error updating task', error);
      //addFieldError('Error updating task. Abbrivation already used');
    }

    if (fieldErrors.length > 0) {
      this.fieldErrs = fieldErrors;
      fieldErrors.forEach(errorMessage => this.tostar.error(errorMessage));
      return;
    }

    this.tostar.success('Success', 'Template added successfuly');
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'authority-tempelate' } });

    this.lodingTrue = false;

      
  }

  getTags() {
    this.loggedInUser = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    // console.log('getTagDetailss1', token);

    this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => {
      this.allTags = response[0].data.map((item: { name: string }) => item.name);
      
    });

    //console.log(this.allTags)
  }




  private createApprovalTemplate(MAIN_ABBR: string, employeeMKey: number, userMKey: number, Subtask: [], sancAuth: [], tagsString: string) {
    return {
      abbR_SHORT_DESC: this.approvalTempForm.get('shortDescription')?.value,
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
      seQ_ORDER: String(this.approvalTempForm.get('sequenceOrder')?.value),
      attributE1: userMKey.toString(),
      attributE2: "ADD FORM",
      attributE3: "SAVE BUTTON",
      attributE4: "",
      attributE5: "",
      createD_BY: userMKey || 0,
      lasT_UPDATED_BY: userMKey || 0,
      // sanctioN_AUTHORITY: Number(this.approvalTempForm.get('sanctioningAuth')?.value),
      // sanctioN_DEPARTMENT: this.approvalTempForm.get('sanctioningDept')?.value,
      enD_RESULT_DOC: "",
      checklisT_DOC: "",
      deletE_FLAG: "N",
      enD_RESULT_DOC_LST: this.end_list,
      checklisT_DOC_LST: this.check_list,
      TAGS: tagsString,
      subtasK_LIST: Subtask || [],
      sanctioninG_DEPARTMENT_LIST: sancAuth || []
    };
  }





  updateApprovalTemplate() {

    const USER_CRED = this.credentialService.getUser();

    const token = this.apiService.getRecursiveUser();

    const fieldErrors: string[] = [];
    const addFieldError = (message: string) => fieldErrors.push(message);

    const assignedToValue = this.approvalTempForm.get('assignedTo')?.value;
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
        };
      });

    const formArrayVal_new: FormArray = (this.approvalTempForm.get('rows_new') as FormArray);


    const val_of_formArr_new = formArrayVal_new.value;


    const subAuth = val_of_formArr_new
      .map((row: any) => {
        const endDate = row.endDate_newRow ? row.endDate_newRow : null;
        return {
          LEVEL: row.level.toString(),
          SANCTIONING_DEPARTMENT: row.sanctioningDept,
          SANCTIONING_AUTHORITY: row.sanctioningAuth,
          START_DATE: row.startDate_newRow,
          END_DATE: endDate,
          MKEY: this.taskData?.mkey
        }
      })

    console.log('subAuth', subAuth)

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

    const assignedEmployeeMKey = assignedEmployee ? assignedEmployee.MKEY : null;
    // console.log('checklisT_DOC_LST', this.taskData.checklisT_DOC_LST)
    // console.log('enD_RESULT_DOC_LST', this.taskData.enD_RESULT_DOC_LST)

    const updateApprlTemp = {
      mkey: this.taskData.mkey,
      abbR_SHORT_DESC: this.approvalTempForm.get('shortDescription')?.value,
      buildinG_TYPE: Number(this.approvalTempForm.get('building')?.value),
      buildinG_STANDARD: Number(this.approvalTempForm.get('standard')?.value),
      statutorY_AUTHORITY: Number(this.approvalTempForm.get('statutoryAuth')?.value),
      shorT_DESCRIPTION: this.approvalTempForm.get('shortDescription')?.value,
      lonG_DESCRIPTION: this.approvalTempForm.get('longDescrition')?.value,
      maiN_ABBR: this.approvalTempForm.get('abbr')?.value,
      authoritY_DEPARTMENT: this.approvalTempForm.get('department')?.value,
      resposiblE_EMP_MKEY: assignedEmployeeMKey,
      joB_ROLE: Number(this.approvalTempForm.get('jobRole')?.value),
      dayS_REQUIERD: Number(this.approvalTempForm.get('noOfDays')?.value),
      seQ_ORDER: String(this.approvalTempForm.get('sequenceOrder')?.value),
      attributE1: null,
      attributE2: "SAVE FORM",
      attributE3: "SAVE BUTTON",
      attributE4: null,
      attributE5: null,
      createD_BY: USER_CRED[0].MKEY,
      lasT_UPDATED_BY: USER_CRED[0].MKEY,
      // sanctioN_AUTHORITY: Number(this.approvalTempForm.get('sanctioningAuth')?.value),
      // sanctioN_DEPARTMENT: this.approvalTempForm.get('sanctioningDept')?.value,
      enD_RESULT_DOC: "",
      checklisT_DOC: "",
      deletE_FLAG: "N",
      enD_RESULT_DOC_LST: this.end_list,
      checklisT_DOC_LST: this.check_list,
      tags: tagsString,
      subtasK_LIST: subTasks || [],
      sanctioninG_DEPARTMENT_LIST: subAuth || []
    }

    console.log('updateApprlTemp', updateApprlTemp)

    this.apiService.putApprovalTemp(updateApprlTemp, doc_temp_key, token).subscribe({
      next: (data) => {
        if(data){
          this.isInsertingApprl = true;
        }
       
        this.tostar.success('Success', 'Template updated successfuly')
        this.router.navigate(['task/approval-screen'], { queryParams: { source: 'authority-tempelate' } });
        console.log('data successfully updated', data)
      }, error: (error) => {

        const errorDetails = error.error?.errors;


        if (error.error?.errors?.SEQ_ORDER?.length) {
          this.tostar.error('Sequence number is required');
        }
               

        if (errorDetails) {

          Object.keys(errorDetails).forEach(key => {
            if (key.includes('START_DATE')) {
              const departmentIndexMatch = key.match(/\[\d+\]/);
              if (departmentIndexMatch) {
                const departmentIndex = departmentIndexMatch[0].replace(/[\[\]]/g, '');

                const rowStartDate_Sanction = errorDetails[key];
                if (rowStartDate_Sanction && rowStartDate_Sanction.length > 0) {
                  this.tostar.error('Required Field', `Start Date field is required for the sanction in department ${departmentIndex}`);
                }
              }
            }
          });
        }
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
      const matchedEmp = this.employees.find((employee: any) =>
        employee.MKEY === Number(this.taskData.resposiblE_EMP_MKEY)
      );
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
      this.activeIndices.push(index);
    } else {
      this.activeIndices.splice(idx, 1);
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


    let selectedItems = this.instruDetailsList.filter(doc => allSelectedMkeys.includes(doc.mkey));


    selectedItems.forEach(item => {
      mappedSelectedArray.push(item);
    });

    this.selectedDocsMap['checklist'] = mappedSelectedArray;

  }





  toggleSelection(listType: 'endResult' | 'checklist', doc: any) {
    // console.log('listType', listType);

    const selectedDocs: any = this.selectedDocsMap[listType];

    const index = selectedDocs.findIndex((selected: any) => selected.mkey === doc.mkey);
    if (index === -1) {
      selectedDocs.push(doc);
      // console.log('selectedDocs', selectedDocs)
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
      // console.log('end_list result:', this.end_list);
    } else if (listType === 'checklist') {
      this.check_list = check_list
      // console.log('check_list result:', this.check_list);
    }
  }


  isSelected(listType: 'endResult' | 'checklist', doc: any): boolean {
    return this.selectedDocsMap[listType].some(selected => selected.mkey === doc.mkey);

  }

  getUniqueDocs(listType: 'endResult' | 'checklist'): string[] {
    return Array.from(new Set(this.docTypeList.map(docs => docs.attributE2)));
  }

  // getUniqueINST(listType: 'endResult' | 'checklist'): string[] {
  //   return Array.from(new Set(this.instruDetailsList.map(docs => docs.attributE2)));
  // }

  getUniqueINST(listType: 'endResult' | 'checklist') {
    const categories = this.instruDetailsList.map(doc => doc.attributE2 || 'Uncategorized');
    return [...new Set(categories)];
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


  getGroupedAndINSTDetails(listType: 'endResult' | 'checklist') {

    const groupedDocs: any = {};
    this.instruDetailsList.forEach(docs => {
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

      // API call to fetch abbreviation and other data
      this.apiService.GetAbbrAndShortAbbr(buildingType, buildingStandard, statutoryAuthority, this.recursiveLogginUser).subscribe({
        next: (gerAbbrRelData) => {
          this.checkValue(gerAbbrRelData); // Call checkValue to process the first time

          // console.log(gerAbbrRelData);
          this.getRelAbbr = Array.isArray(gerAbbrRelData) ? gerAbbrRelData : [gerAbbrRelData];

          if (this.getRelAbbr.length === 0) {
            this.tostar.error("Details of this combination is empty or missing");
            return;
          }

          const rows: FormArray = this.approvalTempForm.get('rows') as FormArray;

          

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

          // console.log('tagsString from row', tagsString);

          // Create a new row with the necessary controls
          const newRow = this.formBuilder.group({
            abbrivation: [null, Validators.required],
            shorT_DESCRIPTION: [null],
            sanctioN_DEPARTMENT: [null],
            nO_DAYS_REQUIRED: [null],
            authoritY_DEPARTMENT: [null],
            enD_RESULT_DOC: [null],
            subtasK_MKEY: [null],
            subTaskTags: [tagsString],
            sequentialNo: [rows.length + 1],
          });

          rows.push(newRow);

          if (!this.isCheckValueCalled) {
            this.isCheckValueCalled = true;
          } else {
            //this.checkValueForNewRow(newRow);
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
              //console.log('matchedDepartment: ', matchedDepartment)
              value.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
            } else {
              console.log("Department not found");
            }

            if (value.maiN_ABBR && value.maiN_ABBR === subtask.subtasK_ABBR) {
              const rowForm = this.formBuilder.group({
                sequentialNo: [subtask.seQ_NO],
                abbrivation: [subtask.subtasK_ABBR],
                shorT_DESCRIPTION: [value.shorT_DESCRIPTION],
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


  checkValueForNewRow(newRow: AbstractControl) {
    const formArray = this.approvalTempForm.get('rows') as FormArray;
    const newRowData = newRow.value;
    const values = [newRowData];

    values.forEach((value: any) => {
      if (this.taskData && this.taskData.subtasK_LIST) {
        this.taskData.subtasK_LIST.forEach((subtask: any) => {
          console.log('subtask: ', subtask)
          const departmentList = this.departmentList;
          const matchedDepartment = departmentList.find(department => department.mkey === value.authoritY_DEPARTMENT);

          if (matchedDepartment) {
            console.log('matchedDepartment: ', matchedDepartment);
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

  get rows_new() {
    return (this.approvalTempForm.get('rows_new') as FormArray);
  }

  addRowNew() {
    const rows = this.rows_new.controls;


    if (rows.length === 0) {

      this.rows_new.push(
        this.formBuilder.group({
          level: [1, [Validators.required, Validators.min(1)]],
          sanctioningDept: ['', Validators.required],
          sanctioningAuth: ['', Validators.required],
          startDate_newRow: ['', Validators.required],
          endDate_newRow: ['']
        })
      );
      return;
    }

    // console.log('check group', this.approvalTempForm.get('rows_new').controls)

    const lastRow = rows[rows.length - 1];
    const prevRow = rows[rows.length - 2];

    const lastLevel = lastRow.value?.level;
    const previousLevel = prevRow ? prevRow.value?.level : null;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (rows[0].value.level !== 1 && !this.taskData && !this.taskData?.mkey) {
        this.tostar.error('Level should start from 1')
        return
      }

      const requiredFields = ['level', 'sanctioningDept', 'sanctioningAuth', 'startDate_newRow'];
      const rowEmpty = requiredFields.some(field => !row.value[field]);
      if (rowEmpty) {
        this.tostar.error('Please fill in all fields in all rows before adding a new row');
        return;
      }
    }

    if (lastLevel === previousLevel) {
      const startDate = new Date(lastRow.value?.startDate_newRow);
      const endDate = new Date(prevRow.value?.endDate_newRow);

      // console.log('endDate', endDate)

      if (!isNaN(endDate.getTime())) {
        if (startDate > endDate) {
          console.log('Start date is greater than end date');
        } else {
          // console.log('Start date is NOT greater than end date');
          this.tostar.error('Start date of same level should greater then end date of same level');
          return;
        }
      }
    
    }
    const start_date_new = new Date(lastRow.value?.startDate_newRow)
    const end_date_new = new Date(lastRow.value?.endDate_newRow)


    if (start_date_new > end_date_new) {
      this.tostar.error('End date should be greater then start date');
      return
    }  

    if (lastLevel !== null && (previousLevel === null || lastLevel == previousLevel + 1 || lastLevel == previousLevel)) {

      const rowGroup = this.formBuilder.group({
        level: ['', Validators.required],
        sanctioningAuth: ['', Validators.required],
        sanctioningDept: ['', Validators.required],
        startDate_newRow: ['', Validators.required],
        endDate_newRow: ['']
      });

      (this.approvalTempForm.get('rows_new') as FormArray).push(rowGroup);
      // this.checkValueForNewRow_1(rowGroup)

    } else {
      this.tostar.error(`Last row level should be ${previousLevel} or ${previousLevel + 1} from its previous row`);
    }
  }

  checkValueForNewRow_1() {
    const formArray_new_1 = this.approvalTempForm.get('rows_new') as FormArray;
    // console.log('formArray_new_1', formArray_new_1);

    formArray_new_1.clear();

    this.taskData.sanctioninG_DEPARTMENT_LIST.forEach((department: any) => {
      const rowGroup = this.formBuilder.group({
        level: [Number(department.LEVEL), [Validators.required, Validators.min(1)]],
        sanctioningDept: [department.SANCTIONING_DEPARTMENT, Validators.required],
        sanctioningAuth: [department.SANCTIONING_AUTHORITY, Validators.required],
        startDate_newRow: [this.formatDate(department.START_DATE), Validators.required],
        endDate_newRow: [department.END_DATE ? this.formatDate(department.END_DATE) : '', '']
      });
      formArray_new_1.push(rowGroup);
    });
  }


  onAbbrChange(event: Event, rowForm: FormGroup, rowIndex?: number | any) {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const selectedAbbr = selectElement.value; // Now TypeScript knows 'value' exists

    //console.log('selectedAbbr', selectedAbbr)
    rowForm.get('abbrivation')?.setValue(selectedAbbr);

    const selectedRow = this.getRelAbbr.find(r => r.maiN_ABBR === selectedAbbr);
    console.log('selectedRow: ',rowForm);
    const header_no_of_days = Number(this.approvalTempForm.get('noOfDays')?.value);
    const subtas_no_of_days = selectedRow?.dayS_REQUIERD || 0;

    const formArray = this.approvalTempForm.get('rows') as FormArray;
    
    // Calculate total days required across all rows
    let totalDaysRequired = formArray.controls.reduce((sum, row) => {
        return sum + (row.get('nO_DAYS_REQUIRED')?.value || 0);
    }, 0);

    totalDaysRequired += subtas_no_of_days; // Add newly selected row's days

    console.log('Total Days Required: ', totalDaysRequired);
    console.log('header_no_of_days: ', header_no_of_days)

    if (totalDaysRequired >= header_no_of_days) {
        if (!confirm(`Days are exceeding as per header which is ${header_no_of_days} Days. Do you still want to proceed?`)) {
            formArray.removeAt(formArray.length - 1); // Remove the last added row
            return;
        }
    }

    const abbrivation = this.approvalTempForm.get('abbr')?.value;
    


    if(abbrivation === selectedAbbr){
      this.tostar.error('Same approval cannot assign to itself');
      formArray.removeAt(formArray.length - 1); // Remove the last added row
      return;
    }else if(abbrivation === '' || abbrivation === undefined || abbrivation === null){
      this.tostar.error('Please enter the approval header abbrivation');
      formArray.removeAt(formArray.length - 1); // Remove the last added row
      return;
    }

    console.log('ROW form: ',formArray.value)

    const sublist_form_value = formArray.value

    const abbrivationSet = new Set();
    let hasDuplicate = false;
    
    sublist_form_value.forEach((val: any) => {
        if (abbrivationSet.has(val.abbrivation)) {
            hasDuplicate = true;
        } else {
            abbrivationSet.add(val.abbrivation);
        }
    });
    
    if (hasDuplicate) {
        this.tostar.error("Record already exist");
        formArray.removeAt(formArray.length - 1); // Remove the last added row
        return;
    }

    const matchedDepartment = this.departmentList.find(department => department.mkey === selectedRow?.authoritY_DEPARTMENT);

    console.log('matchedDepartment: ',matchedDepartment)
    if (matchedDepartment) {
        selectedRow.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
    } else {
        console.log("Department not found");
    }

    if (selectedRow) {
        rowForm.get('selectedAbbr')?.setValue(selectedRow.maiN_ABBR);
        rowForm.get('shorT_DESCRIPTION')?.setValue(selectedRow.shorT_DESCRIPTION);
        rowForm.get('sanctioN_DEPARTMENT')?.setValue(selectedRow.sanctioN_DEPARTMENT);
        rowForm.get('nO_DAYS_REQUIRED')?.setValue(selectedRow.dayS_REQUIERD);
        rowForm.get('enD_RESULT_DOC')?.setValue(selectedRow.enD_RESULT_DOC);
        rowForm.get('authoritY_DEPARTMENT')?.setValue(selectedRow.abbR_SHORT_DESC);
        rowForm.get('subtasK_MKEY')?.setValue(selectedRow.mkey);
        rowForm.get('SUBTASK_TAGS')?.setValue(selectedRow.subTaskTags);
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



 removeRow(index: number) {
    const rows = this.approvalTempForm.get('rows') as FormArray;

    if (rows.length > 0) {
      rows.removeAt(index);

      this.updateSequentialNumbers();
    } else {
      console.warn('No rows to remove');
    }
  }

  removeRowNew(index: number) {
    const rows = this.approvalTempForm.get('rows_new') as FormArray;

    if (rows.length > 0) {
      // Remove the row at the specified index
      rows.removeAt(index);

      // Optionally, update the sequential numbers if required after removal
      // this.updateSequentialNumbers();
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


  validateInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Block non-numeric input
    }
  }
  
  enforceMinValue(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value !== '' && Number(input.value) < 1) {
      input.value = '1'; // Prevents 0 or negative values
    }
  }
  
  validateInput_sequence_num(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const char = event.key;
  
    // Allow numbers (0-9), dot (.), Backspace, Delete, and Arrow keys
    if (!char.match(/[0-9.]/) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(char)) {
      event.preventDefault();
      return;
    }
  
    // Prevent multiple consecutive dots or dot at the start
    if (char === '.' && (input.value.endsWith('.') || input.value === '')) {
      event.preventDefault();
    }
  }
  
  enforceMinValue_sequence_num(event: Event) {
    const input = event.target as HTMLInputElement;
  
    // Remove leading dots
    input.value = input.value.replace(/^\+/, '');
  
    // Ensure no multiple consecutive dots (e.g., "1..1" becomes "1.1")
    input.value = input.value.replace(/\{2,}/g, '');
  
    // Prevent ending with a dot
    input.value = input.value.replace(/\$/, '');
  }
    

  onSubmit() {
    const requiredControls: string[] = [];
    const requiredFields: string[] = [];
    const valid = this.approvalTempForm.valid;

    const addControlError = (message: string) => requiredControls.push(message);

    const convertToTitleCase = (input: string) => {
      return input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() + ' is required';
    };

    // Check for required form controls
    Object.keys(this.approvalTempForm.controls).forEach(controlName => {
      const control = this.approvalTempForm.get(controlName);
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

    const formArrayVal_new: FormArray = (this.approvalTempForm.get('rows_new') as FormArray);
    const val_of_formArr_new = formArrayVal_new.value;

    const isValid_sanction = val_of_formArr_new.every((row: any) => {
      if (!row.level || !row.level.toString().trim()) {
        this.tostar.error('Field Required for row', 'Please provide level');
        return false;
      }
      if (!row.sanctioningDept || !row.sanctioningDept.trim()) {
        this.tostar.error('Field Required for row', "Sanctioning Department is required.");
        return false;
      }
      if (!row.sanctioningAuth || !row.sanctioningAuth.trim()) {
        this.tostar.error('Field Required for row', 'Sanctioning Authority is required');
        return false;
      }
      return true;
    });

    if (!isValid_sanction) {
      return false;
    }

    const subAuth = val_of_formArr_new.map((row: any) => {
      return {
        LEVEL: row.level.toString(),
        SANCTIONING_DEPARTMENT: row.sanctioningDept,
        SANCTIONING_AUTHORITY: row.sanctioningAuth,
        START_DATE: new Date(row.startDate_newRow),
        END_DATE: new Date(row.endDate_newRow)
      };
    });


    let lastEndDate: Date | null = null;
    let previousLevel: number | null = null;
    let previousRow: any = null;

    for (let i = 0; i < subAuth.length; i++) {
      const current = subAuth[i];

      if (previousRow && current.LEVEL === previousRow.LEVEL) {
        if (current.START_DATE <= previousRow.END_DATE) {
          this.tostar.error(`For level ${current.LEVEL}, the start date should be after the end date of the previous row in the same level.`);
          return false;
        }
      }

      if (current.SANCTIONING_DEPARTMENT === '' || current.SANCTIONING_DEPARTMENT === null) {
        this.tostar.error('SANCTIONING_DEPARTMENT is required');
        return false;
      }

      // New Validation: Check level sequencing
      if (previousLevel !== null) {
        const currentLevel = parseInt(current.LEVEL);
        if (!(currentLevel === previousLevel || currentLevel === previousLevel + 1)) {
          this.tostar.error(`Last row level should be ${previousLevel} or ${previousLevel + 1} from its previous row`);
          return false;
        }
      }

      if (current.END_DATE && current.START_DATE > current.END_DATE) {
        this.tostar.error(`For level ${current.LEVEL}, the end date should be greater than the start date.`);
        return false;
      }


      previousLevel = parseInt(current.LEVEL);
      previousRow = current;
      lastEndDate = current.END_DATE;
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

  onUpdateTempDoc() {
    const isValid = this.onSubmit();

    if (isValid) {
      this.updateApprovalTemplate();
    } else {
      // this.updateApprovalTemplate();

      console.log('Form is invalid, cannot add template');
    }
  }


  ngOnDestroy(): void {
    sessionStorage.removeItem('task');
  }

  navigateToApprovlTempelate() {
    this.router.navigate(['task/approval-screen'], { queryParams: { source: 'authority-tempelate' } });
  }

  formatDate(date: string): string {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = formattedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}


