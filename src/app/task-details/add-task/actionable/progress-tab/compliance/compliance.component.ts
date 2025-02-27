import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css']
})
export class ComplianceComponent implements OnInit {
  loading : boolean = true;
  originalComplianceList: any[] = [];
  complianceList: any[] = [];
  isAscending: boolean = true;
  @Input() task: any;
  taskDetails: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private credentialService: CredentialService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);

        const token = this.apiService.getRecursiveUser();

        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;
          this.fetchComplianceList(response[0]?.data);
        });
      }
    });
  }

  getSelectedTaskDetails(mkey: string, token: string) {
    return this.apiService.getSelectedTaskDetailsNew(mkey, token);
  }

  fetchComplianceList(taskDetails: any): void {
    this.loading = true;
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();

    this.apiService.getComplianceList(
      taskDetails[0].BUILDING_MKEY,
      taskDetails[0].PROJECT_MKEY,
      user[0].ROLE_ID,
      this.task.toString(),
      token
    ).subscribe(
      (response: any) => {
        if (response[0].DATA && response[0].DATA.length > 0) {
          this.complianceList = response[0].DATA;
          this.originalComplianceList = [...response[0].DATA];
        } else {
          console.warn('No compliance data found.');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching compliance list:', error);
        this.loading = false;
      }
    );
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchText = target.value.trim().toLowerCase();

    if (searchText === '') {
      this.complianceList = [...this.originalComplianceList];
    } else {
      this.complianceList = this.originalComplianceList.filter(compliance =>
        compliance.SHORT_DESCRIPTION.toLowerCase().includes(searchText) ||
        compliance.LONG_DESCRIPTION.toLowerCase().includes(searchText)
      );
    }
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.complianceList.sort((a, b) => {
      const dateA = new Date(a.TO_BE_COMPLETED_BY).getTime();
      const dateB = new Date(b.TO_BE_COMPLETED_BY).getTime();
      return this.isAscending ? dateA - dateB : dateB - dateA;
    });
  }

  addCompliance(data: any, taskCompliance: any): void {

    console.log('task data', this.taskDetails)

    console.log('this.taskDetails:', this.taskDetails);
    console.log('PROJECT_MKEY:', this.taskDetails?.PROJECT_MKEY);
    console.log('BUILDING_MKEY:', this.taskDetails?.BUILDING_MKEY);


    if (!Array.isArray(data) || data.length === 0) {
      data = [
        {
          MKEY: 90,
          PROPERTY_MKEY: Number(this.taskDetails[0]?.PROJECT_MKEY),
          BUILDING_MKEY: this.taskDetails[0]?.BUILDING_MKEY
        }
      ]
    }
  console.log('data[0].MKEY', data);

    this.router.navigate(['compliance', 'add-compliance', { compliance_state: data[0].MKEY, taskCompliance: taskCompliance }], {state: { taskData: data[0] }});
  }

  initiateCompliance(data:any, initiate:string){
 
    this.router.navigate(['compliance', 'add-compliance', { compliance_state: data.MKEY, initiate:initiate }], {state: { taskData: data  }});
  }

  openSelectedTask(data: any) {
    this.router.navigate(['compliance', 'add-compliance', { compliance_state: data.MKEY }], {state: { taskData: data }});
  }
}
