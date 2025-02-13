import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';


@Component({
  selector: 'app-team-progress',
  templateUrl: './team-progress.component.html',
  styleUrls: ['./team-progress.component.css'],
})

export class TeamProgressComponent implements OnInit {

  public rowSelection: "single" | "multiple" = "multiple";
  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  public pivotPanelShow: "always" | "onlyWhenPivoting" | "never" = "always";
  public themeClass: string ="ag-theme-quartz";

  showMemberDetails: boolean = false;

    
  @Input() loggedInUser: any = {};

  rowData: any[]=[];
  rowData2: any[]=[];
  subordinate:any[] = [];
  level:any[]=[];
  searchTerm: string = '';
  filterType: string = 'directReportee';
  selectedTab = 'tab2'
  visibleMatIcon:boolean = false;
  loading: boolean = true;

  getDataPath = function (data:any) {
    return data.hierachy;
  };

  constructor(private router:Router,
              private apiService:ApiService,
              private dataService:CredentialService,
             ) { }

  ngOnInit(): void {      

    this.updateTableCount3();
  }

  
  updateTableCount3() {
    this.loggedInUser = this.dataService.getUser();
    const token = this.apiService.getRecursiveUser();


    this.apiService.getTeamTaskNew(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response) => {

      this.level = response[0]?.Data;
       
      if (this.filterType === 'directReportee') {
        const directReportees = this.level.filter(item => item.RA1_MKEY === this.loggedInUser[0]?.MKEY);
  
        directReportees.forEach(directReportee => {
          directReportee.subordinates = this.getSubordinates(directReportee.ERP_EMP_MKEY);
        });
  
        this.rowData2 = directReportees;
        this.loading = false;
      }
    });
  }
  
  getSubordinates(erpEmpMkey: number): any[] {
    const subordinates = this.level.filter(sub => sub.RA1_MKEY === erpEmpMkey);
  
    subordinates.forEach(subordinate => {
      subordinate.subordinates = this.getSubordinates(subordinate.ERP_EMP_MKEY);
    });
  
    return subordinates;
  }
  


  
  createMemberHierarchy(member: any): any {
    const memberData: any = {
      "MEMBER_NAME": member.MEMBER_NAME,
      "Today": member.DEPTTODAY || "0",
      "Overdue": member.DEPTOVERDUE || "0",
      "Future": member.DEPTFUTURE || "0",
      "Today_1": member.INTERDEPTTODAY || "0",
      "Overdue_1": member.INTERDEPTOVERDUE || "0",
      "Future_1": member.INTERDEPTFUTURE || "0",
    };
  
  

    console.log('memberData.subordinates', memberData.subordinates)
    
    return memberData;
  }


  underlinedCellRenderer(params:any) {
    return `<div style="text-decoration: underline" type="button"><b>${params.value}</b></div>`;
  }

  onBackButtonClick() {
    this.showMemberDetails = false;
  }


  toggleTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleMemberDetails(member: any) {
    member.expanded = !member.expanded;
  }

  onFilterTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();

    this.filterType = value;
    if (this.filterType === 'all') {
      this.expandAllSubordinates(this.rowData2);
      this.visibleMatIcon = false
    } else if(this.filterType === 'directReportee') {
      this.collapseAllSubordinates(this.rowData2);
      this.visibleMatIcon = true
    }
  
    this.updateTableCount3();

}

expandAllSubordinates(members: any[]) {
  members.forEach(member => {
    member.showSubordinates = true;
    this.expandSubordinatesRecursive(member.subordinates);
  });
}

expandSubordinatesRecursive(members: any[]) {
  if (members) {
    members.forEach(member => {
      member.showSubordinates = true;
      this.expandSubordinatesRecursive(member.subordinates);
    });
  }
}

collapseAllSubordinates(members: any[]) {
  members.forEach(member => {
    member.showSubordinates = false;
    this.collapseSubordinatesRecursive(member.subordinates);
  });
}

collapseSubordinatesRecursive(members: any[]) {
  if (members) {
    members.forEach(member => {
      member.showSubordinates = false;
      this.collapseSubordinatesRecursive(member.subordinates);
    });
  }
}

hasSubordinates(member: any): boolean {
  return member.subordinates && member.subordinates.length > 0;
}


  
toggleSubordinates(member: any): void {
  member.showSubordinates = !member.showSubordinates;
}




onCellClicked(event: MouseEvent, member: any, colId: string): void {
  event.stopPropagation();  

  console.log('event', event)

  console.log('colId', colId);
  console.log('member', member);

  if (colId === 'DEPTTODAY' || colId === 'DEPTOVERDUE' || colId === 'DEPTFUTURE' ||
      colId === 'INTERDEPTTODAY' || colId === 'INTERDEPTOVERDUE' || colId === 'INTERDEPTFUTURE') {
    let additionalParams = {};

    switch (colId) {
      case 'DEPTTODAY':
        additionalParams = { source: 'todayDepartment' };
        break;
      case 'DEPTOVERDUE':
        additionalParams = { source: 'overdueDepartment' };
        break;
      case 'DEPTFUTURE':
        additionalParams = { source: 'futureDepartment' };
        break;
      case 'INTERDEPTTODAY':
        additionalParams = { source: 'todayInterDepartment' };
        break;
      case 'INTERDEPTOVERDUE':
        additionalParams = { source: 'overdueInterDepartment' };
        break;
      case 'INTERDEPTFUTURE':
        additionalParams = { source: 'futureInterDepartment' };
        break;
      default:
        break;
    }

    // Navigate with query parameters
    this.router.navigate(['/dashboard/task-due-status'], {
      queryParams: {
        Member_Name: member['MEMBER_NAME'],
        ...additionalParams
      }
    });
  }
}

  

}



