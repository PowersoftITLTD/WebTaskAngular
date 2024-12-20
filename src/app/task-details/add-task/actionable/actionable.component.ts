import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-actionable',
  templateUrl: './actionable.component.html',
  styleUrls: ['./actionable.component.css']
})
export class ActionableComponent implements OnInit {

  @Input() loggedInUser: any = {};

  status: any[] = [];
  currentStatus: any[] = [];

  task: any;
  taskDetails: any;
  details: any;
  selectedProgressStatus: any;
  progressForm: FormGroup | any;
  file: File | any;

  loading: boolean = true;
  disable: boolean = false;

  constructor(
    private apiService: ApiService,
    private dataService: CredentialService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private tostar: ToastrService
  ) {
    this.loggedInUser = this.dataService.getUser();

  }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      if (params['Task_Num']) {

        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();


        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;
          console.log('getSelectedTaskDetails',this.taskDetails)
          this.details = response[0]?.data;
          this.taskDetails = response[0]?.data[0].STATUS;
          this.getActionableDetails();
          this.checkTheStatus();


        });
      }
    });

    this.actionableDet();

  }


  actionableDet(): void {
    this.progressForm = this.fb.group({
      progress: ['', Validators.required],
      remark: ['', Validators.required],
      status: [''],
      file: ['']
    });
  }


  getActionableDetails() {
    this.loading = true;
    if (this.task && this.loggedInUser && this.taskDetails) {
      this.apiService.getActionableDetails(this.task, this.loggedInUser[0]?.MKEY, this.taskDetails).subscribe((data: any) => {
        console.log('from old',this.taskDetails)
        this.status = data.Table;
        this.currentStatus = data.Table1;
        this.loading = false;
        // console.log('this.currentStatus',this.currentStatus)

        // console.log('status', this.status)

        if (this.status.length > 0) {
          this.selectedProgressStatus = this.status[0]?.TYPE_DESC;


          this.progressForm.patchValue({ status: this.status[0].TYPE_DESC });

          // console.log('current_status', this.selectedProgressStatus)

          if (this.selectedProgressStatus === 'Work In Progress') {
            this.progressForm.patchValue({ progress: '0' });
          } else if (this.selectedProgressStatus === 'Close') {
            this.progressForm.patchValue({ progress: '100' });
            this.disable = true;
          } else if (this.selectedProgressStatus === 'Cancel') {
            this.progressForm.patchValue({ progress: '0' });
            this.disable = true;
          }

          this.shouldDisableSelect();

        } else {
          // console.error('No data in this.status');
        }
      });
    } else {
      console.error('Cannot fetch actionable details: Missing required parameters');
    }
  }


  checkTheStatus(){
    // this.loading = true;
    // if (this.task && this.loggedInUser && this.taskDetails) {
      const token = this.apiService.getRecursiveUser();
      console.log('checknthe ',this.task.toString());
      console.log('checknthe ',this.loggedInUser[0]?.MKEY);
      console.log('checknthe ',this.taskDetails);
      console.log('checknthe ',token);

      this.apiService.getActionableDetailsNew(this.task.toString(), this.loggedInUser[0]?.MKEY.toString(), this.taskDetails, token).subscribe((response: any) => {

        console.log('Response checkTheStatus', response[0]?.data)
        // this.status = data.Table;
        // this.currentStatus = data.Table1;
        // this.loading = false;
        
      });
    // } else {
    //   console.error('Cannot fetch actionable details: Missing required parameters');
    // }
  }

  onStatusChange(event: any) {
    const status = event.target.value;

    if (status === 'Close Initiated' || status === 'Close') {
      this.progressForm.patchValue({ progress: '100' });
      this.disable = true;
    } else if (status === 'Work In Progress' || status === 'Re-Work') {
      this.progressForm.patchValue({ progress: '0' });
      this.disable = false;
    } else if (status === 'Cancel Initiated') {
      this.progressForm.patchValue({ progress: '0' });
      this.disable = true;
    }

  }


  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }

    const labelElement = document.getElementById('TaskAttachmentDetails');
    if (labelElement) {
      labelElement.textContent = this.file.name;
    }
  }


  shouldDisableSelect(): boolean {
    if (this.loggedInUser && this.loggedInUser.length > 0 &&
      this.details && this.details.length > 0 &&
      this.status && this.status.length > 0) {

      const logged_user = this.loggedInUser[0]?.MKEY.toString();
      const task_user = this.details[0]?.RESPOSIBLE_EMP_MKEY;
      const status = this.status[0]?.TYPE_DESC;
      const currentStatus = this.currentStatus[0]?.STATUS;


      return logged_user === task_user || status === 'WORK IN PROGRESS' && currentStatus !== 'Re-Work';
    } else {
      return false;
    }
  }


  getSelectedTaskDetails(task: any, tokecn:string) {

    const token = this.apiService.getRecursiveUser();

    return this.apiService.getSelectedTaskDetailsNew(task, token);
  }


  createData() {

    const USER_MKEY = this.loggedInUser[0]?.MKEY
    const TASK_NUM = this.task

    const formData = new FormData();

    formData.append("Mkey", TASK_NUM)
    formData.append("TASK_MKEY", TASK_NUM)
    formData.append("TASK_PARENT_ID", TASK_NUM)
    formData.append("ACTION_TYPE", 'Progress')
    formData.append("DESCRIPTION_COMMENT", this.progressForm.get('remark').value)
    formData.append("PROGRESS_PERC", this.progressForm.get('progress').value)
    formData.append("STATUS", this.progressForm.get('status').value)
    formData.append("CREATED_BY", USER_MKEY)
    formData.append("TASK_MAIN_NODE_ID", TASK_NUM)
    formData.append("FILENAME", this.file)

    const file = this.progressForm.get('file').value


    this.apiService.postActionData(formData)
      .subscribe(
        response => {
          if (response) {
            this.tostar.success('success', `Progress updated successfully.`)
            this.router.navigate(['/task/task-management'])
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
  }


  saveActionable() {
    let validationErrors: string[] = [];

    const convertToTitleCase = (input: string) => {
      const titleCase = input.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
      return titleCase + ' is required'
    };

    Object.keys(this.progressForm.controls).forEach(controlName => {
      const control = this.progressForm.get(controlName);
      if (control?.errors?.required) {
        const formattedControlName = convertToTitleCase(controlName);
        validationErrors.push(formattedControlName);
      }
    });

    const percent = this.progressForm.value.progress
    if (percent > 100) {
      validationErrors.push('Progress should be less then or equal to 100');
    } else if (percent < 0) {
      validationErrors.push('Progress should inbetween 0 to 100');
    } else if (isNaN(percent) || percent % 1 !== 0) {
      validationErrors.push('Progress should be a whole number');
    }

    if (validationErrors.length > 0) {
      const m = `${validationErrors.join(' , ')}`;
      this.tostar.error(`${m}`);
      return;
    } else {
      this.createData();
    }
  }

  fileUrl(filePath: string) {

    console.log('filePath', filePath)
    return `http://182.78.248.166:8070/Task/Task/${filePath}`;
  }

}
