import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpHeaders
  } from "@angular/common/http";
  import { Injectable } from "@angular/core";
import { AuthServices } from 'src/app/services/auth.service';
  
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthServices) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
    //const authToken = this.authService.getToken();
    const authToken = localStorage.getItem('token') || '';

// const token =localStorage.getItem('token') || 'null';

    //  const authRequest = req.clone({
    //    headers: req.headers.set("Authorization", "Bearer " + authToken)
    //   });
    const httpOptions = req.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'loginkey': authToken
      })
    });

      return next.handle(httpOptions);
    }
  }

  
    
  