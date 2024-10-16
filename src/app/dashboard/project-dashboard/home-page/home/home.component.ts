import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() loggedInUser: any = {};

  todayTasksCount: number = 0;
  overdueTasksCount: number = 0;
  reviewTasksCount: number = 0;
  allocatedButNotStartedTasksCount: number = 0;
  futureTasksCount: number = 0;
  assignByMeTasksCount: number = 0;
  assignByMeButNotCreatedTasksCount: number = 0;
  activeTasksCount: number = 0;

  constructor(
              private router:Router,
              private apiService:ApiService,
              private dataService:CredentialService,
             ) { }

  ngOnInit(): void {
    this.getTaskStatusDetails();
  }


  getTaskStatusDetails(){

    this.loggedInUser = this.dataService.getUser();
  
    const MKEY = this.loggedInUser[0]?.MKEY
  
    this.apiService.getHomeDetails(MKEY).subscribe((data)=>{
  
      const today = data.Table
      const overdue = data.Table1
      const review = data.Table2
      const allocatedButNotStarted = data.Table3
      const future = data.Table4
      const assignByMe = data.Table5
      const assignByMeButNotCreated = data.Table6
      const active = data.Table7

      this.todayTasksCount = today.length;
      this.overdueTasksCount = overdue.length;
      this.reviewTasksCount = review.length;
      this.allocatedButNotStartedTasksCount = allocatedButNotStarted.length;
      this.futureTasksCount = future.length;
      this.assignByMeTasksCount = assignByMe.length;
      this.assignByMeButNotCreatedTasksCount = assignByMeButNotCreated.length;
      this.activeTasksCount = active.length;        
    })
  }

  navigateToAllocatedButNotStarted(){
    this.router.navigate(['task/task-management'], { queryParams:{ source: 'allocatedButNotStarted' }});
  }

  navigateToOverDuePage(){
    this.router.navigate(['task/task-management'], { queryParams:{ source: 'overdue' }});
  }

  navigateToFuturePage(){
    this.router.navigate(['task/task-management'], { queryParams:{ source: 'future' }});
  }

  navigateToTodayPage(){
    this.router.navigate(['task/task-management'], { queryParams:{ source:'today'}})
  }

  navigateToReview(){
    this.router.navigate(['task/task-management'], { queryParams:{ source:'review'}})  
  }
}
