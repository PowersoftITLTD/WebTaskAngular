import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-document-search',
  templateUrl: './project-document-search.component.html',
  styleUrls: ['./project-document-search.component.css']
})
export class ProjectDocumentSearchComponent implements OnInit {

  receivedUser: string | any;


  constructor() { }

  ngOnInit(): void {
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

}
  