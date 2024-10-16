import { Component, OnInit } from '@angular/core';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit {

  selectedTab: string = 'home'; 
  showSidePanel: boolean = true;
  receivedUser: any;

  loggedInUser: any;
  user:any = []


  constructor(private authService:CredentialService) {}

    ngOnInit(): void {
      this.userData();
    }


    userData() {
      const data = this.authService.getUser();
  
      this.user.push({   
        FIRST_NAME: data[0]?.FIRST_NAME,     
      });

    }

    receiveLoggedInUser(user: any): void {
      this.receivedUser = user;
    }


  }


