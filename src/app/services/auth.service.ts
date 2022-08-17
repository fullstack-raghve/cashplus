import { Injectable } from "@angular/core";
import {HttpClient,HttpHeaders,HttpEvent,HttpInterceptor,HttpHandler,HttpRequest,HttpErrorResponse} from "@angular/common/http";
import { RouterModule, Router } from "@angular/router";
import { catchError } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject, throwError } from "rxjs";
import { environment } from '../../environments/environment';
import { ProfileControllerService } from './profile-controller.service';
import { MytripService } from './mytrip.service';

let ipAddress = "";



@Injectable({
  providedIn: "root"
})
export class AuthServices {
  private isAuthenticated = false;
  private token: string;
  errorData: {};
  message;
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient,private _router: Router, private profileService: ProfileControllerService, private tripService: MytripService) {
    //this.getipAddress();
  }
toketGet = localStorage.getItem('token')
   // Http Options
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'loginkey':this.toketGet
      })
    }

  
  //   httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'key': 'gettoken'
  //   })
  // };

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }


 newRegistration(body:any){
  //console.log(body);
this.clearAllChache();
  const url = environment.baseUrl + '/pwa/v1/signup/createAcount';
  return this.http.post(url,body);
}

  changePassword(password) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/changePassword';
      return this.http.put(url,password,this.httpOptions).pipe(
        catchError(this.handleError)
      );   
  } 


  getSociallogin(userdetail){
    const url = environment.baseUrl + '/pwa/v1/sociallogin/getSocialLogin';
    return this.http.post(url,userdetail).pipe(
      catchError(this.handleError)
    )
  }


  getTwitterAuthUrl(){
    const url = environment.baseUrl + '/pwa/v1/sociallogin/getTwitterAuthUrl';
    return this.http.get(url).pipe(
      catchError(this.handleError)
    )
  }
  twitteroauthcallback(data){
    const url = environment.baseUrl + '/pwa/v1/sociallogin/twitteroauthcallback';
    return this.http.post(url,data).pipe(
      catchError(this.handleError)
    )
  }
  resendVerifcationlink(data){
    const url = environment.baseUrl + '/pwa/v1/signup/resendVerificationMail';
    return this.http.post(url,data).pipe(
      catchError(this.handleError)
    )
  }


  loginuser(logincredntial){
    this.clearAllChache();
    const url = environment.baseUrl + '/pwa/v1/login/loginuser';
    return this.http.post(url,logincredntial).pipe(
      catchError(this.handleError)
    );   
  }
postData(url){
  return this.http.get(url).pipe(
    catchError(this.handleError)
  ); 
}
getData(url){
  return this.http.get(url).pipe(
    catchError(this.handleError)
  ); 
}
  // loginuser(logincredntial){
  //   const url = environment.baseUrl + '/pwa/v1/login/loginuser';
  //   return this.http.post(url,logincredntial).subscribe(res =>{
  //     console.log(res);
  //       let login1 =res['statusMessage'];  
  //       let token = res['loginKey'];
  //       this.token = token;
  //       var tokny = token
  //     let localtoken =  localStorage.setItem("token", token);

  //       if (this.token != null) {
  //           console.log(localtoken);
  //         console.log(this.token);
  //          this.isAuthenticated = true;
  //          console.log(this.isAuthenticated)
  //       localStorage.setItem("token", token);
  //       this._router.navigate(['/view-profile-module'])

  //       }else{
  //        this.isAuthenticated = false;

  //         this.message = "Please check your username and password";
  //         this._router.navigate(['/login'])

  //       }

  //       console.log(this.token);

  //   })
  // }

  loggedIn() {
    return !!localStorage.getItem("token");
  }
  loggedIn1() {
    return localStorage.getItem("isLoggedIn");
  }
 

  logout() {
    this.clearAllChache();
    const url = environment.baseUrl + '/pwa/v1/logout/logoutuser/';
    
      return this.http.post(url, this.httpOptions).pipe(
      catchError(this.handleError)
  
    ); 

    localStorage.setItem('isLoggedIn', "false");
    localStorage.removeItem('token')
  // this._router.navigate(['/'])

  } 

  onlogout() {
    this.clearAllChache();
    this.token = null;
    this.isAuthenticated = false;
    //this.authStatusListener.next(false);
    //clearTimeout(this.tokenTimer);
    this._router.navigate(["/"]);
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  clearAllChache(){
    this.tripService.clearAllTripModuleCache();
    this.profileService.clearAllProfiletCache()
  }


  private authverifer = new BehaviorSubject('')

  sendauthverifer(dp){
    this.authverifer.next(dp)
  }
  
  getauthverifer() : Observable<any>{
    return this.authverifer.asObservable()
  }

  // getipAddress() {
  //   this.http.get("https://jsonip.com").subscribe(
  //     data => {
  //       ipAddress = data["ip"];
  //     //  console.log("Login Ip "+ipAddress)
  //     },
  //     error => {
  //       console.log("Error", error);
  //     }
  //   );
  // }

  // public isAuthenticated(): boolean {
  //   if (sessionStorage.getItem("token") != null) {
  //     return true;
  //   } else {
  //     localStorage.clear();
  //     return false;
  //   }
  // }

  

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {

      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong,

      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message

    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }

}




