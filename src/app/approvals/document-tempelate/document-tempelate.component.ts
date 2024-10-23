import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-tempelate',
  templateUrl: './document-tempelate.component.html',
  styleUrls: ['./document-tempelate.component.css']
})
export class DocumentTempelateComponent implements OnInit {

  public activeIndices: number[] = []; // Change here
  receivedUser: string | any;


  public accordionItems = [
    { title: 'Meta data fields as per ISO', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Location fields as per ACC', content: 'Some placeholder content for the second accordion panel.' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.activeIndices = this.accordionItems.map((_, index) => index);
  }


  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index); // Add index if not present
    } else {
      this.activeIndices.splice(idx, 1); // Remove index if present
    }
  }
 

}
