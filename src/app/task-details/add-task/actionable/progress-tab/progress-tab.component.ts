import { Component, OnInit } from '@angular/core';
import { ProgressDetailsComponent } from './sub-task/progress-details.component';
import { CheckListComponent } from './check-list/check-list.component';
import { OutputComponent } from './output/output.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { SancAuthComponent } from './sanc-auth/sanc-auth.component';
import { HistoryComponent } from './history/history.component';

@Component({
  selector: 'app-progress-tab',
  templateUrl: './progress-tab.component.html',
  styleUrls: ['./progress-tab.component.css'],
})
export class ProgressTabComponent implements OnInit {
  selectedTab: string = 'subTask';

  tabs = [
    { key: 'subTask', label: 'Sub Task', component: ProgressDetailsComponent },
    { key: 'checkList', label: 'Check List', component: CheckListComponent },
    { key: 'output', label: 'Output', component: OutputComponent },
    { key: 'sanctioningAuthority', label: 'Sanctioning Authority', component: SancAuthComponent },
    { key: 'compliance', label: 'Compliance', component: ComplianceComponent },
    { key: 'history', label: 'History', component: HistoryComponent },
  ];

  switchTab(tabKey: string): void {
    this.selectedTab = tabKey;
  }

  constructor() {}

  ngOnInit(): void {}
}
