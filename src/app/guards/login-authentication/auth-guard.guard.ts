import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot  } from '@angular/router';
import { CredentialService } from 'src/app/services/credential/credential.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  
  constructor(private credentialService: CredentialService, private router: Router) {}



  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login/login-page']);
      return false;
    }
  }
}
