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


    return this.apiService.getLoginDetails(email, password).pipe(
      map(response => {
        const user = response;

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

    console.log(`User recursive login id${login_id} & password ${login_password}`)
    this.apiService.login(login_id, login_password);
  }
  

  getUser(): any {
    const storedUser = localStorage.getItem(this.loggedInUserKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }


  saveUser(user: any): void {

    console.log('User: ', user)

    // user[0] = {
    //   MKEY: user[0].MKEY,
    //   COMPANY_NAME: user[0].COMPANY_NAME,
    //   FIRST_NAME: user[0].FIRST_NAME,
    //   LAST_NAME: user[0].LAST_NAME,
    //   EMP_FULL_NAME: user[0].EMP_FULL_NAME,
    //   EMAIL_ID_OFFICIAL: user[0].EMAIL_ID_OFFICIAL,
    //   KEY: user[0].LOGIN_PASSWORD            
    // };

    localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    const storedUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    return !!this.loggedInUser;
  }

  
  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser = null;
  }

}




