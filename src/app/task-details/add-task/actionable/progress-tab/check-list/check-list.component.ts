import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

interface ChecklistItem {
  MKEY: number;
  DOCUMENT_CATEGORY: number;
  DOCUMENT_NAME: string;
  TYPE_DESC: string | null;
  APP_CHECK: string;
  PROPERTY_MKEY: number;
  BUILDING_MKEY: number;
  CREATED_BY_ID: string;
  SR_NO: number;
  DOCUMENT_MKEY: number;
}

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})

export class CheckListComponent implements OnInit {
  loading: boolean = true;
  checkList: ChecklistItem[] = [];
  filteredChecklist: ChecklistItem[] = [];
  searchQuery: string = '';
  selectedDocs: { key: string; DOCUMENT_CATEGORY: number; MKEY: number }[] = [];
  @Input() task: any;
  taskDetails: any;
  
  constructor(
    private apiService: ApiService,
    private credentialService: CredentialService,
    private route: ActivatedRoute,
    private tostar: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();

        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;
          if (this.taskDetails) {
            this.fetchChecklist(this.taskDetails);
          }
        });
      }
    });
  }

  getSelectedTaskDetails(mkey: string, token: string) {
    return this.apiService.getSelectedTaskDetailsNew(mkey, token);
  }

  fetchChecklist(taskDetails: any): void {
    this.loading = true;
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();
  
    this.apiService.getCheckList(
      taskDetails?.[0]?.BUILDING_MKEY,
      taskDetails?.[0]?.PROJECT_MKEY,
      user?.[0]?.ROLE_ID,
      this.task.toString(),
      token
    ).subscribe({
      next: (response: any) => {
        if (response?.[0]?.DATA?.length) {
          this.checkList = response[0].DATA.map((item: any) => ({
            MKEY: item.MKEY,
            DOCUMENT_CATEGORY: item.DOCUMENT_CATEGORY,
            DOCUMENT_NAME: item.DOCUMENT_NAME,
            TYPE_DESC: item.TYPE_DESC,
            APP_CHECK: item.APP_CHECK,
            PROPERTY_MKEY: item.PROPERTY_MKEY,
            BUILDING_MKEY: item.BUILDING_MKEY,
            CREATED_BY_ID: item.CREATED_BY_ID,
            SR_NO: item.SR_NO,
          }));
  
          this.selectedDocs = this.checkList
            .filter(item => item.APP_CHECK === "Y")
            .map(item => ({
              key: `${item.MKEY}-${item.DOCUMENT_CATEGORY}`,
              DOCUMENT_CATEGORY: item.DOCUMENT_CATEGORY,
              MKEY: item.MKEY
            }));
  
          this.updateFilteredChecklist();
        }
  
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching checklist:', error);
        this.loading = false;
      }
    });
  }
  

  updateFilteredChecklist(): void {
    console.log('Updating filtered checklist');
    console.log('Search Query:', this.searchQuery); // Check if the search query is populated
    this.filteredChecklist = this.searchQuery
      ? this.checkList.filter(item =>
        item.DOCUMENT_NAME.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.DOCUMENT_CATEGORY.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (item.TYPE_DESC && item.TYPE_DESC.toLowerCase().includes(this.searchQuery.toLowerCase())) // Include TYPE_DESC in the search
      )
      : [...this.checkList];
  }

  toggleSelection(item: ChecklistItem): void {
    const docKey = `${item.MKEY}-${item.DOCUMENT_CATEGORY}`;
    const index = this.selectedDocs.findIndex(selected => selected.key === docKey);

    if (index !== -1) {
      this.selectedDocs.splice(index, 1);
      this.updateChecklistStatus(item, "N");
    } else {
      this.selectedDocs.push({ key: docKey, DOCUMENT_CATEGORY: item.DOCUMENT_CATEGORY, MKEY: item.MKEY });
      this.updateChecklistStatus(item, "Y");
    }
  }

  isSelected(item: ChecklistItem): boolean {
    return this.selectedDocs.some(selected => selected.key === `${item.MKEY}-${item.DOCUMENT_CATEGORY}`);
  }

  updateChecklistStatus(item: ChecklistItem, status: string): void {
    console.log({item});
    
    const token = this.apiService.getRecursiveUser();
    const payload = {
      MKEY: item.MKEY,
      DOC_MKEY: item.DOCUMENT_CATEGORY,
      SR_NO: item.SR_NO,
      DOCUMENT_CATEGORY: item.DOCUMENT_CATEGORY,
      APP_CHECK: status,
      PROPERTY_MKEY: item.PROPERTY_MKEY,
      BUILDING_MKEY: item.BUILDING_MKEY,
      DOC_NAME: item.DOCUMENT_NAME,
      TASK_MKEY: this.task.toString(),
      CREATED_BY: item.CREATED_BY_ID
    };

    this.apiService.updateCheckListDetails(payload, token).subscribe({
      next: response => {
        if(response[0]?.DATA){
          this.fetchChecklist(this.taskDetails)
        }
        console.log('Checklist updated:', response)},
      error: error => console.error('Error updating checklist:', error)
    });
  }

  onCheckboxChange(event: Event, item: ChecklistItem): void {
    event.stopPropagation();
    this.toggleSelection(item);
  }

}
