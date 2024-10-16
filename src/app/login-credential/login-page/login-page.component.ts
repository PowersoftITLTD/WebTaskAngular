import { Component, ErrorHandler, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {

  email: string = '';
  password: string = '';

  lodingTrue: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loginService: CredentialService
  ) { }

  ngOnInit(): void { }


  login(): void {
    if (this.email && this.password) {
      this.lodingTrue = true;

      this.loginService.validateUser(this.email, this.password).pipe(
        catchError(error => {
          this.lodingTrue = false;
          return of(false);
        })
      ).subscribe(valid => {
        this.lodingTrue = false;
        if (valid) {
          this.router.navigate(['dashboard/dashboard-page']);
          this.toastr.success("Success", "Login Successfully");
        } else {
          if (navigator.onLine) {
            alert('Invalid email or password');
          }
        }
      });
    } else {
      console.log('coming to empty field check');
      alert('Please enter email and password');
    }
  }

  logout(): void {
    this.loginService.logout();
  }
}
