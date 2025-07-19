import { Component, ErrorHandler, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ProjectUploadComponent } from './project-upload/project-upload.component';
import { ProjectModifyComponent } from './project-modify/project-modify.component';
import { ActivatedRoute, Route, Router } from '@angular/router';


@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})

export class UploadExcelComponent implements OnInit {

    @Output() tabChanged = new EventEmitter<string>(); 

  receivedUser: any;
  selectedTab: string = 'upload';

  selectedComponent: any = ProjectUploadComponent;
  tabInjector: Injector | any;

  tabs: any[] = [
    { key: 'upload', label: 'Upload Project', component: ProjectUploadComponent },
    { key: 'modify', label: 'Modify Project', component: ProjectUploadComponent }
  ];

  constructor(private route: ActivatedRoute, private router: Router,     private injector: Injector,
){}

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      const type = params['type'];

      console.log('check type',type)

      if (type === 'upload' || type === 'modify') {
        this.selectedTab = type;
      } else {
        this.selectedTab = 'upload';
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { type: 'upload' },
          queryParamsHandling: 'merge'
        });
      }
      this.setSelectedComponent();
    });
  }



  // get selectedComponent() {
  //   return this.tabs.find(tab => tab.key === this.selectedTab)?.component;
  // }

  setSelectedComponent(): void {
    const tab = this.tabs.find(t => t.key === this.selectedTab);
    this.selectedComponent = tab?.component;

    this.tabInjector = Injector.create({
      providers: [{ provide: 'type', useValue: this.selectedTab }],
      parent: this.injector,
    });
  }

  //  get componentInjector() {
  //     return Injector.create({
  //       providers: [
  //         { provide: 'type', useValue: this.selectedTab }
  //       ],
  //       parent: this.injector
  //     });
  //   }

  switchTab(tabKey: string): void {
    console.log('tabKey: ', tabKey)
    this.selectedTab = tabKey;
    this.tabChanged.emit(tabKey); 

      this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: tabKey },
      queryParamsHandling: 'merge' // preserves other query params
    });
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

}
