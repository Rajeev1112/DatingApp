import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'protractor';

@Injectable()
export class ErrorIntercepter implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    const ApplicationError = error.headers.get('Application-Error');
                    if ( ApplicationError) {
                        console.error(ApplicationError);
                        return throwError(ApplicationError);
                    }

                }
            })
        );
  }
}

export const ErrorIntercepterProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorIntercepter,
    multi: true
}
