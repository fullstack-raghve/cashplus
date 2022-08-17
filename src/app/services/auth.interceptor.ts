import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent,HttpClient, HttpResponse,HttpHeaders }from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceUrl } from '../constants/serviceUrl';
import { AuthServices } from '../services/auth.service';
@Injectable()
export class AuthInterceptors implements HttpInterceptor{
    pass:boolean = false;
  constructor(
    private router:Router,
    private serviceUrl:ServiceUrl,
    private http: HttpClient,
    private authServices:AuthServices
            ){}
              headers:HttpHeaders;
      intercept(req:HttpRequest<any>, next :HttpHandler):Observable<HttpEvent<any>>{
        if(this.serviceUrl.ipUrl == req.url){
        this.pass = true
        return next.handle(req);
     }else{
        return next.handle(req);
      }
  }
}
