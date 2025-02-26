import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  reloadOnceFlag = false;

  loginName: string = '';
  loginPassword: string = '';

  createdOrUpdatedUserName:any


  constructor(
              private router:Router,
              private apiService:ApiService,
              private dataService:CredentialService,
              private tostar:ToastrService
             ) { 

              //this.apiService.getRecursiveUser();


             }

  ngOnInit(): void {

    this.onLogin()

  }


  
  onLogin() {   

    this.dataService.validateUser(this.loginName, this.loginPassword);

    const data = this.dataService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,    

    console.log('onLogin data')

    const USER_CRED = {    
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL, 
      PASSWORD:atob(data[0]?.LOGIN_PASSWORD)
    }; 



    // console.log('USER_CRED',USER_CRED)

    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if(response.jwtToken){
          // console.log('response.jwtToken', response.jwtToken)
          this.getTaskStatusDetails();

          // this.selectedOption = 'Over-due';
          // const option = 'DEFAULT';
          // this.fetchTaskDetails(this.loggedInUser[0]?.MKEY, option);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }


  getTaskStatusDetails() {
    this.loggedInUser = this.dataService.getUser();
    const token = this.apiService.getRecursiveUser();


    // console.log('getTaskStatusDetails',this.loggedInUser)

    // console.log('token',token)
  
    if (!this.loggedInUser || !this.loggedInUser[0]?.MKEY || !token) {
      console.warn('User or token not initialized. Retrying later...');
      return; 
    }
  
    const MKEY = this.loggedInUser[0].MKEY;
  
    this.apiService.getHomeDetailsNew(MKEY.toString(), token).subscribe(
      (response) => {

        const today = response[0].Table;
        const overdue = response[0].Table1;
        const review = response[0].Table2;
        const allocatedButNotStarted = response[0].Table3;
        const future = response[0].Table4;
        const assignByMe = response[0].Table5;
        const assignByMeButNotCreated = response[0].Table6;
        const active = response[0].Table7;
  
        this.todayTasksCount = today.length;
        this.overdueTasksCount = overdue.length;
        this.reviewTasksCount = review.length;
        this.allocatedButNotStartedTasksCount = allocatedButNotStarted.length;
        this.futureTasksCount = future.length;
        this.assignByMeTasksCount = assignByMe.length;
        this.assignByMeButNotCreatedTasksCount = assignByMeButNotCreated.length;
        this.activeTasksCount = active.length;
      },
      (error) => {
        console.error('API error:', error);
        this.tostar.error('Network error')
        
      }
    );
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
