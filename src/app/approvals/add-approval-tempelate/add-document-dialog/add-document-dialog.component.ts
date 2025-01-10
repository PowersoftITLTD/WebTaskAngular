import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.css']
})
export class AddDocumentDialogComponent implements OnInit {

    docTempForm: FormGroup | any;
    docCatList:any[] = [];

  

  constructor(
              private formBuilder: FormBuilder,
              private tostar: ToastrService,
              private credentialService: CredentialService,
              private apiService: ApiService,
              private router: Router,
               private dialogRef: MatDialogRef<AddDocumentDialogComponent>
            ) { }

  ngOnInit(): void {
    this.initilizeTempDocForm();
    this.fetchData();
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

    fetchData(){
      const token = this.apiService.getRecursiveUser();
  
      this.apiService.getDocCategory(token).subscribe({
        next: (list: any) => {
          this.docCatList = list
          // this.setCategoryData();
          console.log('Document Type List:', this.docCatList);
        },
        error: (error: any) => {
          console.error('Unable to fetch Document Type List', error);
        }
      });
    }


    addDocumentTemplate() {

      const data = this.credentialService.getUser();
      const token = this.apiService.getRecursiveUser();
  
  
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
  
      this.apiService.postDocumentTempelate(addTmpDoc, token).subscribe({
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


    closeDialog(){
      this.dialogRef.close();
  
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
  
        console.log('CHECK CONTROL NAME', controlName)
    
        if (control?.errors?.required) {
         if(
          controlName === 'documentNumberFieldName' && this.docTempForm.get('documentNotApplied')?.value === 'Y' ||
          controlName === 'documentDateFieldName' && this.docTempForm.get('documentDateApplicable')?.value === 'Y' ||
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
      const check_field_date_name = this.docTempForm.get('documentNumberFieldName')?.value
  
      const doc_num_applicable = this.docTempForm.get('documentNotApplied')?.value
      const doc_date_applicable = this.docTempForm.get('documentDateApplicable')?.value
  
      console.log('doc_num_applicable', doc_num_applicable)
  
      if ((check_field_num_name && doc_num_applicable === 'N')) {
        this.tostar.error(`Please set 'Document No. Applicable' to 'Yes' if field is required`);
        return false;
      }
  
      if ((check_field_date_name && doc_date_applicable === 'N')) {
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

}
