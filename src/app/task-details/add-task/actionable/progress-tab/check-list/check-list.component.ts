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

interface InstructionListItem {
  // MKEY: number;
  // DOCUMENT_CATEGORY: number;
  // DOCUMENT_NAME: string;
  // typE_DESC: string | null;
  // APP_CHECK: string;
  // PROPERTY_MKEY: number;
  // BUILDING_MKEY: number;
  // CREATED_BY: string;
  // SR_NO: number;
  // DOCUMENT_MKEY: number;
  selected?: boolean;
  // mkey: number;

  MKEY: number,
  DOCUMENT_CATEGORY: string,
  DOCUMENT_NAME: string,
  TYPE_DESC: string | null,
  CREATED_BY: string,
  SR_NO: number,
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
  searchItem: string = '';
  selectedDocs: { key: string; DOCUMENT_CATEGORY: number; MKEY: number }[] = [];
  @Input() task: any;
  taskDetails: any;
  groupedChecklist: { DOCUMENT_NAME: string; DOCUMENTS: ChecklistItem[] }[] = [];
  groupedInstruList: { DOCUMENT_NAME: string; DOCUMENTS: InstructionListItem[] }[] = [];

  isModalOpen = false;
  instruDetailsList: any[] = [];

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

    const searchQueryLower = this.searchQuery.toLowerCase().trim();

    const groupedData: { [key: string]: { DOCUMENT_NAME: string; DOCUMENTS: ChecklistItem[] } } = {};

    this.checkList.forEach(item => {
      const matchesSearch =
        item.DOCUMENT_NAME?.toLowerCase().includes(searchQueryLower) ||
        (item.TYPE_DESC && item.TYPE_DESC?.toLowerCase().includes(searchQueryLower));

      if (matchesSearch) {
        if (!groupedData[item.DOCUMENT_NAME]) {
          groupedData[item.DOCUMENT_NAME] = { DOCUMENT_NAME: item.DOCUMENT_NAME, DOCUMENTS: [] };
        }
        groupedData[item.DOCUMENT_NAME].DOCUMENTS.push(item);
      }
    });

    this.groupedChecklist = Object.values(groupedData);
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

  isInstructionSelected(item: InstructionListItem): boolean {
    return this.selectedDocs.some(selected =>
      selected.MKEY === item.MKEY &&
      selected.DOCUMENT_CATEGORY.toString() === item.DOCUMENT_CATEGORY
    );
  }




  updateChecklistStatus(item: ChecklistItem, status: string): void {
    const token = this.apiService.getRecursiveUser();
    console.log('item', item);
    
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
        if (response[0]?.DATA) {
          this.fetchChecklist(this.taskDetails)
        }
      },
      error: error => console.error('Error updating checklist:', error)
    });
  }

  onCheckboxChange(event: Event, item: ChecklistItem): void {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  openModal() {
    this.fetchInstruDetails();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  fetchInstruDetails() {
    const token = this.apiService.getRecursiveUser();
    this.apiService.getInstructionDetails(token).subscribe({
      next: (list: any) => {
        this.instruDetailsList = list.map((item: any) => ({
          MKEY: item.mkey,
          DOCUMENT_CATEGORY: item.attributE1,
          DOCUMENT_NAME: item.attributE2,
          TYPE_DESC: item.typE_DESC,
          CREATED_BY: item.CREATED_BY,
          SR_NO: item.SR_NO,
          selected: this.isInstructionSelected(item)
        }));

        this.updateFilteredInstrulist();
      },
      error: (error: any) => {
        console.error('Unable to fetch Document Type List', error);
      }
    });
  }


  updateFilteredInstrulist(): void {
    const searchItemLower = this.searchItem.toLowerCase().trim();
    const groupedData: { [key: string]: { DOCUMENT_NAME: string; DOCUMENTS: InstructionListItem[] } } = {};

    this.instruDetailsList.forEach(item => {
      const matchesSearch =
        item.DOCUMENT_NAME.toLowerCase().includes(searchItemLower) ||
        (item.TYPE_DESC && item.TYPE_DESC.toLowerCase().includes(searchItemLower));

      if (matchesSearch) {
        const groupKey = item.DOCUMENT_NAME || 'Unknown'; // Ensuring grouping based on `DOCUMENT_NAME`

        // Filter out TYPE_DESC values already present in checklist
        const isTypeDescInChecklist = this.checkList.some(
          checklistItem => checklistItem.TYPE_DESC === item.TYPE_DESC
        );

        if (!groupedData[groupKey]) {
          groupedData[groupKey] = { DOCUMENT_NAME: groupKey, DOCUMENTS: [] };
        }

        // Only add items where TYPE_DESC is NOT in the checklist
        if (!isTypeDescInChecklist) {
          groupedData[groupKey].DOCUMENTS.push(item);
        }
      }
    });

    // Remove groups that have no remaining DOCUMENTS after filtering
    this.groupedInstruList = Object.values(groupedData).filter(group => group.DOCUMENTS.length > 0);

  }

  toggleListSelection(docItem: InstructionListItem): void {
    docItem.selected = !docItem.selected;

    const status = docItem.selected ? 'N' : 'Y';

    this.addDocumentToChecklist(docItem, status);
  }


  addDocumentToChecklist(item: InstructionListItem, status: string): void {
    const token = this.apiService.getRecursiveUser();
    const user = this.credentialService.getUser();

    const payload = {
      DELETE_FLAG: status || null,
      DOC_MKEY: item.MKEY || null,
      SR_NO: status === "N" ? 0 : item.SR_NO || null,
      DOCUMENT_CATEGORY: parseInt(item.DOCUMENT_CATEGORY) || null,
      TASK_MKEY: this.task || null,
      CREATED_BY: user[0].MKEY.toString() || null
    }

    this.apiService.addDocToChecklist(payload, token).subscribe({
      next: response => {
        if (response[0]?.DATA) {
          this.fetchChecklist(this.taskDetails)
        } else {
          console.log('Error adding document to checklist:', response)
          this.tostar.error('Error adding document to checklist', 'Error');
        }
      },
      error: error => console.error('Error updating checklist:', error)
    });
  }

}
