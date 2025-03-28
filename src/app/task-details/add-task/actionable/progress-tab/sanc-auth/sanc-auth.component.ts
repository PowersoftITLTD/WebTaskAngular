import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CredentialService } from '../../../../../services/credential/credential.service';
import { ApiService } from '../../../../../services/api/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sanc-auth',
  templateUrl: './sanc-auth.component.html',
  styleUrls: ['./sanc-auth.component.css']
})

export class SancAuthComponent implements OnInit {
  loading: boolean = true;
  sancAuthForm: FormGroup;
  sancAuthList: any[] = [];
  SanctoningAuthList: any[] = [];
  propertyMKey: any;
  @Input() task: any;
  taskDetails: any;
  isNewRow: boolean = false;
  isAddingRow: boolean = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private credentialService: CredentialService,
    private route: ActivatedRoute,
    private tostar: ToastrService
  ) {
    this.sancAuthForm = this.fb.group({
      rows_new: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.fetchProjectData();
    const token = this.apiService.getRecursiveUser();
    this.route.params.subscribe((params) => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();

        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;
          this.fetchSanctioningAuthorities(response[0]?.data);
        });
      }
    });
    this.apiService.getSanctoningAuthDP(token).subscribe({
      next: (list: any) => {
        this.SanctoningAuthList = list
      }, error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);

      }
    })
  }

  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getCategorynew(token).subscribe(
      (response: any) => {
        this.propertyMKey = response[0].data;
        this.sancAuthForm.patchValue({ category: 'Project' });
      },
      (error: ErrorHandler) => {
        console.log(error, 'Error Occurred while fetching categories');
      }
    );
  }

  getSelectedTaskDetails(mkey: string, tokecn: string) {
    const token = this.apiService.getRecursiveUser();
    return this.apiService.getSelectedTaskDetailsNew(mkey, token);
  }

  fetchSanctioningAuthorities(taskDetails: any): void {
    this.loading = true;
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();

    this.apiService
      .getSanctionaryAuth(
        taskDetails[0].BUILDING_MKEY,
        taskDetails[0].PROJECT_MKEY,
        user[0].ROLE_ID,
        this.task.toString(),
        token
      )
      .subscribe({
        next: (response: any) => {
          if (response?.[0]?.DATA) {
            this.sancAuthList = response[0].DATA?.sort((a: any, b: any) => a.LEVEL - b.LEVEL);
            this.prefillFormWithApiData();
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          this.loading = false;
        },
      });
  }

  get rowsNew(): FormArray {
    return this.sancAuthForm.get('rows_new') as FormArray;
  }

  prefillFormWithApiData(): void {
    let nextRowToEnable = true; // Flag to determine which row should be "In Progress"

    this.sancAuthList.forEach((item, index) => {
      let status = item.STATUS || 'Select';
      let disabled = false;

      if (status === 'Completed') {
        disabled = true;
      } else if (nextRowToEnable) {
        status = 'In-Progress';
        nextRowToEnable = false;
      } else if (this.sancAuthList?.length === 1) {
        status = 'In-Progress';
        nextRowToEnable = false;
      }
      else {
        status = 'Select';
        disabled = true;
      }

      this.renderTable({
        srNo: item.SR_NO,
        level: item.LEVEL,
        sanctioningDept: item.TYPE_CODE,
        sanctioningAuth: item.SANCTIONING_AUTHORITY,
        status: status,
        sanctioningAuthName: item.TYPE_DESC,
        disabled: disabled,
      });
    });
  }


  addRow(): void {
    this.isAddingRow = true;

    const lastRow = this.sancAuthList[this.sancAuthList.length - 1];
    let defaultStatus = 'Select';
    let disabled = true;

    if (lastRow?.STATUS === 'Completed') {
      defaultStatus = 'In-Progress';
      disabled = false;
    }

    const newRow = this.fb.group({
      srNo: [''],
      level: [lastRow?.LEVEL ? lastRow.LEVEL + 1 : 1, Validators.required],
      sanctioningDept: ['', Validators.required],
      sanctioningAuth: ['', Validators.required],
      status: [{ value: defaultStatus, disabled: disabled }, Validators.required],
      isNewRow: [true]
    });

    this.rowsNew.push(newRow);
  }


  saveRow(index: number): void {
    const row = this.rowsNew.at(index).value; // Get form values dynamically
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();

    const payload = {
      SR_NO: 0,
      DELETE_FLAG: "N",
      MKEY: this.task,
      LEVEL: row.level,
      SANCTIONING_DEPARTMENT: row.sanctioningDept,
      SANCTIONING_AUTHORITY_MKEY: (row.sanctioningAuth),
      CREATED_BY: user[0]?.MKEY,
    };
    // Validate required fields

    if (!payload.SANCTIONING_DEPARTMENT) {
      this.tostar.error('Sanctioning Department is required');
      return;
    }
    if (!payload.SANCTIONING_AUTHORITY_MKEY) {
      this.tostar.error('Sanctioning Authority is required');
      return;
    }
    this.apiService.addNewSancAuth(payload, token).subscribe(
      (response: any) => {
        if (response[0].DATA?.length > 0) {
          this.fetchSanctioningAuthorities(this.taskDetails);
          this.removeRow(index)
          this.isAddingRow = false;
          this.tostar.success(response[0].MESSAGE);
        } else {
          this.tostar.error("Error occurred while saving sanctioning authority");
        }
      },
      (error: any) => {
        console.log(error, 'Error occurred while saving sanctioning authority');
      }
    );
  }


  removeRow(index: number): void {
    this.isAddingRow = false;
    this.rowsNew.removeAt(index);
  }


  renderTable(data?: any): void {
    if (!this.rowsNew.controls.some((row) => row.value.srNo === data?.srNo)) {
      const row = this.fb.group({
        srNo: [data?.srNo || '', Validators.required],
        level: [{ value: data?.level || '', disabled: true }, Validators.required],
        sanctioningDept: [{ value: data?.sanctioningDept || '', disabled: true }, Validators.required],
        sanctioningAuth: [{ value: data?.sanctioningAuth || data.sanctioningAuthName, disabled: true }, Validators.required],
        status: [{ value: data?.status || 'Select', disabled: data?.disabled }, Validators.required],
      });
      this.rowsNew.push(row);
    }
  }

  // Called when the user changes the status of a row
  onStatusChange(index: number): void {
    const status = this.rowsNew.at(index).get('status')?.value;

    if (status === 'Completed') {
      // Disable current row
      this.rowsNew.at(index).get('status')?.disable();

      // Enable next row and set status to 'In Progress'
      if (index + 1 < this.rowsNew.length) {
        this.rowsNew.at(index + 1).get('status')?.setValue('In-Progress');
        this.rowsNew.at(index + 1).get('status')?.enable();
      }

      // Set all remaining rows to 'Select'
      for (let i = index + 2; i < this.rowsNew.length; i++) {
        this.rowsNew.at(i).get('status')?.setValue('Select');
        this.rowsNew.at(i).get('status')?.disable();
      }
    }

    this.updateStatus(index, status);
  }


  updateStatus(index: number, status: string): void {
    const token = this.apiService.getRecursiveUser();
    const payload = {
      PROPERTY_MKEY: this.taskDetails?.[0]?.PROJECT_MKEY,
      BUILDING_MKEY: this.taskDetails?.[0]?.BUILDING_MKEY,
      MKEY: this.task,
      STATUS: status,
      SR_NO: this.sancAuthList[index]?.SR_NO,
      LEVEL: this.sancAuthList[index]?.LEVEL.toString(),
      CREATED_BY: this.sancAuthList[index]?.CREATED_BY_ID,
    };

    this.apiService.updateSancAuthStatus(payload, token).subscribe({
      next: (response: any) => {
        this.tostar.success('Status updated successfully');

        if (!this.sancAuthList.length) {
          this.fetchSanctioningAuthorities(this.taskDetails);
        }
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
        this.tostar.error('Failed to update status');
      },
    });
  }
}

