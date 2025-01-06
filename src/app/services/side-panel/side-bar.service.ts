import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private sidebarWidthSubject = new BehaviorSubject<any>('100%');
  sidebarWidth$ = this.sidebarWidthSubject.asObservable();

  

  constructor() { 
   
  }

  

  setSidebarWidth(width: string) {
    this.sidebarWidthSubject.next(width);
  }
}
