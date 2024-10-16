import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'task-management';
  showSidePanel: boolean = true;

  isSidePanelOpen = true;
  isDialogOpen = false;
  isDialogClosing = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/login/login-page' ||  this.router.url.startsWith('/login/reset-password')) {
          this.showSidePanel = false;
        } else {
          this.showSidePanel = true;
        }
      }
    });
  }


  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }




}
