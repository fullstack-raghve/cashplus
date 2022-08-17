import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, shareReplay, refCount } from 'rxjs/operators';
import { email } from '@rxweb/reactive-form-validators';

@Injectable({
  providedIn: 'root'
})
export class MytripService {
  errorData = {}
  constructor(private http:HttpClient) { }



   getRecentTrip(emailid) {
     const url = environment.baseUrl + '/pwa/v1/myTrip/getRecentTrip/';
       return this.http.get(url+emailid).pipe(
         catchError(this.handleError)
       );   
   }

   private recentCache$: Observable<any>;
   getAllRecentTrip(email) {
    if (!this.recentCache$) {
      this.recentCache$ = this.getRecentTrip(email).pipe(
        shareReplay(1),
      );
    }
    return this.recentCache$;
  }
  
  clearAllRecentTriptCache(){
    this.recentCache$ = null;
  }



   getUpComingTrip(email){
    const url = environment.baseUrl + '/pwa/v1/myTrip/getUpComingTrip/';
    return this.http.get(url+email).pipe(
      map((data:any) => data),
      catchError(this.handleError)
    );  
   }

   
  private upcomingTripCache$: Observable<any>;
  getAllupcomingTrip(email) {
   if (!this.upcomingTripCache$) {
     this.upcomingTripCache$ = this.getUpComingTrip(email).pipe(
       shareReplay(1),
     );
   }
   return this.upcomingTripCache$;
 }
 
 clearAllUpcomingTriptCache(){
   this.upcomingTripCache$ = null;
 }




   tripDetail(id){
    const url = environment.baseUrl + '/pwa/v1/myTrip/getBookingDetail/';
    return this.http.get(url+id).pipe(
      catchError(this.handleError)
    );  
   }

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


  clearAllTripModuleCache(){
    this.clearAllRecentTriptCache();
    this.clearAllUpcomingTriptCache();
  }
}
