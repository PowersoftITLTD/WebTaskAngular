import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit, OnDestroy {

  docTypeList: any[] = [];
  taskData: any;
  receivedUser: string | any;
  createdOrUpdatedUserName: any;
  updatedDetails: boolean = false;
  isCategoryUpdate: boolean = false;
  isInstructionUpdate: boolean = false;

  @Input() recursiveLogginUser: any = {};

  loginName: string = '';
  loginPassword: string = '';
  categoryForm: FormGroup | any;
  instructionForm: FormGroup | any;

  constructor(
    private credentialService: CredentialService,
    private apiService: ApiService,
    private router: Router,
    private tostar: ToastrService
  ) {
    const navigation: any = this.router.getCurrentNavigation();
    const isNewTemp = sessionStorage.getItem('isNewTemp') === 'true';

    if (navigation?.extras.state) {
      const RecursiveTaskData: any = navigation.extras.state.taskData;
      this.taskData = RecursiveTaskData;
      console.log('RecursiveTaskData', RecursiveTaskData);

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
          console.log('Check task data', this.taskData);
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
    this.onLogin();
    this.categoryForm = new FormGroup({
      category: new FormControl(''),  // Set an initial value (empty string)
      instruction: new FormControl('')

    });


  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  onLogin() {
    this.credentialService.validateUser(this.loginName, this.loginPassword);
    const data = this.credentialService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME;

    const USER_CRED = {
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };

    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if (response.jwtToken) {
          // this.fetchData();
          // this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  // Add a new category
  addCategoryForDocSort() {
    const categoryName = this.categoryForm.value.category;
    const data = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    const USER_CRED = {
      USER_MKEY: data[0]?.MKEY,
      COMPANY_ID: data[0]?.COMPANY_ID
    };

    const addCategory = {
      DOC_CATEGORY: categoryName,
      CREATED_BY: USER_CRED.USER_MKEY,
      COMPANY_ID: USER_CRED.COMPANY_ID
    };

    this.apiService.postDocumentTempCategory(JSON.stringify(addCategory), token).subscribe({
      next: (response) => {

        console.log('Category added successfully', response);
        if (response.Status === 'Ok' && response.Message === 'Inserted Successfully') {
          this.tostar.success('Category added successfully');
          this.router.navigate(['task/approval-screen'], { queryParams: { source: 'category-master' } });
        } else if (response.Status === 'Error' && response.Message === 'Category already exists!!!') {
          this.tostar.warning('This category is already exist');

        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  addINSTR() {
    const categoryName = this.categoryForm.value.instruction;
    const data = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    const USER_CRED = {
      USER_MKEY: data[0]?.MKEY,
      COMPANY_ID: data[0]?.COMPANY_ID
    };

    const addInstruction = {
      DOC_CATEGORY: categoryName,
      CREATED_BY: USER_CRED.USER_MKEY,
      COMPANY_ID: USER_CRED.COMPANY_ID
    };


    console.log('addInstruction', addInstruction)

    this.apiService.postInstructionDetails(JSON.stringify(addInstruction), token).subscribe({
      next: (response) => {

        console.log('Instruction added successfully', response);
        if (response.Status === 'Ok' && response.Message === 'Inserted Successfully') {
          this.tostar.success('Instruction added successfully');
          this.router.navigate(['task/approval-screen'], { queryParams: { source: 'category-master' } });
        } else if (response.Status === 'Error' && response.Message === 'Category already exists!!!') {
          this.tostar.warning('This Instruction is already exist');
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateCategoryForDocSort(deleteFlag: string) {
    const categoryName = this.categoryForm.value.category;
    const data = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();

    const USER_CRED = {
      USER_MKEY: data[0]?.MKEY,
      COMPANY_ID: data[0]?.COMPANY_ID
    };

    console.log('Check flag', deleteFlag);

    const updateCategory = {
      MKEY: this.taskData?.mkey,
      DOC_CATEGORY: categoryName,
      CREATED_BY: USER_CRED.USER_MKEY,
      DELETE_FLAG: deleteFlag  // Pass 'Y' for delete or 'N' for save
    };

    console.log('updateCategory', updateCategory)

    this.apiService.updateDocumentTempCategory(updateCategory, token).subscribe({
      next: (data) => {
        console.log('Category updated successfully', data);
        if (deleteFlag === 'Y') {
          this.tostar.warning('Category deleted successfully');
        } else {
          this.tostar.success('Category updated successfully');
        }
        this.router.navigate(['task/approval-screen'], { queryParams: { source: 'category-master' } });
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  onDeleteClick() {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      console.log('Delete click');
      this.onsubmit('Y');
    } else {
      console.log('Delete cancelled');
    }
  }

  onActionButtonClick(field: string, isUpdate: boolean = false) {
    console.log('onActionButtonClick', field, '&', isUpdate);

    // Set the action type (add or update) based on the button clicked
    if (field === 'category') {
        this.isCategoryUpdate = isUpdate;  // Update category flag
        this.isInstructionUpdate = false;  // Reset instruction flag
    } else if (field === 'instruction') {
        this.isInstructionUpdate = isUpdate; // Update instruction flag
        this.isCategoryUpdate = false;  // Reset category flag
    }

    // Log the updated flags for debugging
    console.log('Category Update Flag:', this.isCategoryUpdate);
    console.log('Instruction Update Flag:', this.isInstructionUpdate);
}

  



  onsubmit(flag?: string) {


    console.log('this.isCategoryUpdate', this.isCategoryUpdate);
    console.log('this.isInstructionUpdate', this.isInstructionUpdate);

    if (this.isCategoryUpdate) {
      if (this.categoryForm.value.category === '' || this.categoryForm.value.category === null || this.categoryForm.value.category === undefined) {
        this.tostar.error('Please update the category');
      } else if (!this.taskData || !this.taskData?.mkey) {
        this.addCategoryForDocSort();
      } else {
        if (flag === 'Y') {
          this.updateCategoryForDocSort('Y');
        } else {
          this.updateCategoryForDocSort('N');
        }
      }
    } else if (this.isInstructionUpdate) {
      if (this.categoryForm.value.instruction === '' || this.categoryForm.value.instruction === null || this.categoryForm.value.instruction === undefined) {
        this.tostar.error('Please update the Instruction');
      } else if (!this.taskData || !this.taskData?.mkey) {
        this.addINSTR();
      } else {
        if (flag === 'Y') {
          // this.updateCategoryForDocSort('Y');
        } else {
          console.log('sdkjh');

          // this.updateCategoryForDocSort('N');
        }
      }
    }

  }



  ngOnDestroy(): void {
    console.log('Component is being destroyed');
    sessionStorage.removeItem('task');
  }

}
