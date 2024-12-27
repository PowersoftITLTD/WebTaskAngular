import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approved-tempelate',
  templateUrl: './approved-tempelate.component.html',
  styleUrls: ['./approved-tempelate.component.css']
})
export class ApprovedTempelateComponent implements OnInit {

  receivedUser: string | any;


  constructor() { }

  ngOnInit(): void {
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

}
