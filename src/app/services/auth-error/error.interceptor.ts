import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthenticationService } from './authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    // constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // auto logout if 401 response returned from api
                    // this.authenticationService.logout();
                    location.reload();
                }

                const errorMessage = error.error.message || error.statusText;
                return throwError(errorMessage);
            })
        );
    }
}
