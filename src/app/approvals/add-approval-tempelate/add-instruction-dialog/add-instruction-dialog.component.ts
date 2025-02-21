import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-add-instruction-dialog',
  templateUrl: './add-instruction-dialog.component.html',
  styleUrls: ['./add-instruction-dialog.component.css']
})
export class AddInstructionDialogComponent implements OnInit {

  categoryForm: FormGroup | any;
  updatedDetails: boolean = false;
  isCategoryUpdate: boolean = false;
  isInstructionUpdate: boolean = false;


  constructor(
    private credentialService: CredentialService,
    private apiService: ApiService,
    private router: Router,
    private tostar: ToastrService,
    private dialogRef: MatDialogRef<AddInstructionDialogComponent>
  ) { }

  ngOnInit(): void {

    this.categoryForm = new FormGroup({
      // category: new FormControl(''),  // Set an initial value (empty string)
      instruction: new FormControl('')

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
      DOC_INSTR: categoryName,
      CREATED_BY: USER_CRED.USER_MKEY,
      COMPANY_ID: USER_CRED.COMPANY_ID
    };

    this.apiService.postInstructionDetails(JSON.stringify(addInstruction), token).subscribe({
      next: (response) => {
        if (response.Status === 'Ok' && response.Message === 'Inserted Successfully') {
          this.tostar.success('Instruction added successfully');
          this.dialogRef.close(response.data);    
        } else if (response.Status === 'Error' && response.Message === 'Category already exists!!!') {
          this.tostar.warning('This Instruction is already exist');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  updateINSTR(){
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


    this.apiService.postInstructionDetails(JSON.stringify(addInstruction), token).subscribe({
      next: (response) => {

        console.log('Instruction added successfully', response);
        if (response.Status === 'Ok' && response.Message === 'Inserted Successfully') {
          this.tostar.success('Instruction added successfully');
          this.dialogRef.close();
          // this.router.navigate(['task/approval-screen'], { queryParams: { source: 'category-master' } });
        } else if (response.Status === 'Error' && response.Message === 'Category already exists!!!') {
          this.tostar.warning('This Instruction is already exist');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  closeDialog(){
    this.dialogRef.close();

  }


  onActionButtonClick(field: string, isUpdate: boolean = false) {
    console.log('onActionButtonClick', field, '&', isUpdate);

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

  // if (this.isInstructionUpdate) {
    if (this.categoryForm.value.instruction === '' || this.categoryForm.value.instruction === null || this.categoryForm.value.instruction === undefined) {
      this.tostar.error('Please update the Instruction');
    } else {
      console.log('Come to add details');
      this.addINSTR();  // Call the method that adds instruction
    }
  //}
}


}
