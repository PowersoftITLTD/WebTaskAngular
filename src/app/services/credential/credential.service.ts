import { ErrorHandler, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  private loggedInUser: any;
  private users: any[] | any;
  private loggedInUserKey = 'loggedInUser'
  private passwordSubject = new BehaviorSubject<string | null>(null);

  user: any = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private tostar: ToastrService,
    private cookieService: CookieService
  ) { }


  getUsers(): Observable<void> {
    const token = this.apiService.getRecursiveUser();;

    return this.apiService.getEmpDetailsNew(token).pipe(
      tap((response: any) => this.users = response[0]?.data.users),
      catchError((error: any) => {
        console.error('Error fetching users:', error);
        return of();
      })
    );
  }

  // getPassword(): Observable<string | null> {
  //   return this.passwordSubject.asObservable();
  // }
  
  getPassword(): Observable<string | null> {
    return this.passwordSubject.asObservable();
  }


  
  validateUser(email: string, password: string): Observable<boolean> {

    const token = this.apiService.getRecursiveUser();;

    return this.apiService.getLoginDetailsNew(email, password).pipe(
      map(response => {
        const user = response[0].data;

        console.log('user', user)

        if (user && user.length > 0) {
          this.loggedInUser = user;
          this.passwordSubject.next(password);
          // this.cookieService.set('userPassword', password, undefined, '/', undefined, true, 'Strict');
          // console.log('Logged in successfully with password:', password);
          this.saveUser(user);
          this.router.navigate(['dashboard/dashboard-page']);
          return true;
        } else {
          return false;
        }
      }),
      catchError((error: ErrorHandler) => {
        console.error('Error validating user:', error);
        this.tostar.error('Please try after sometime', 'Error Occured')
        return of(false);
      })
    );
  }


  validRecursiveUser(login_id:string, login_password:string){
    this.apiService.login(login_id, login_password);
  }
  

  getUser(): any {
    const storedUser = localStorage.getItem(this.loggedInUserKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }


  saveUser(user: any): void {
    const sessionId = new Date().getTime().toString();     
    localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
    localStorage.setItem('sessionId', sessionId); // Store session ID in localStorage
    sessionStorage.setItem('sessionId', sessionId); // Store session ID in sessionStorage
  }

  // isAuthenticated(): boolean {
  //   const storedUser = localStorage.getItem('loggedInUser');
  //   this.loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  //   return !!this.loggedInUser;
  // }


  isAuthenticated(): boolean {
    const storedUser = localStorage.getItem(this.loggedInUserKey);
    const localSessionId = localStorage.getItem('sessionId');
    const sessionSessionId = sessionStorage.getItem('sessionId');
  
    if (!storedUser || !localSessionId || localSessionId !== sessionSessionId) {
      this.logout();
      return false;
    }
  
    return true;
  }
  
  
  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser = null;
  }

}




