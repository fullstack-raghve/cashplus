import { Injectable } from '@angular/core';
import { Subject,Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, delay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  errorData: {};

  constructor(private http:HttpClient) {
    this.getAllAirportList();
   }
  ngOnInit() {
    // this.getAllAirportList();
  }

//  getOrigin() {
  // const url = environment.baseUrl + '/pwa/v1/airport/getAllAirport';
    // return this.http.get(url).pipe(
    //   catchError(this.handleError)
    // );   
// }

//   getpopularcity(countryId) {
//     const url = environment.baseUrl + '/pwa/v1/popularCities/getPopularCities/';
//       return this.http.get(url+countryId).pipe(
//          catchError(this.handleError)
//     );   
// }

getAffliateFlight(data){
  const url = environment.baseUrl + '/pwa/v1/affiliate/getFlight';
  return this.http.post(url,data).pipe(
    catchError(this.handleError)
  ); 
}


getAllAirportList():any{
  const url = environment.baseUrl + '/pwa/v1/airport/getAirportList';
  return this.http.get(url).pipe(
    catchError(this.handleError)
  ); 
}
getOrigin() {
  const url = environment.baseUrl + '/pwa/v1/airport/getAllAirport';
  return this.http.get(url).pipe(
  catchError(this.handleError)
  ); 
  }
  
  getpopularcity(countryId) {
  const url = environment.baseUrl + '/pwa/v1/popularCities/getPopularCities/';
  return this.http.get(url+countryId).pipe(
  catchError(this.handleError)
  ); 
  }



searchGetAirport(term: string) {
  const url = environment.baseUrl + '/pwa/v1/airport/getAirport/';
  if (term === '') {
    return of([]);
  }
  return this.http.get(url+term+'/'+124);
}

getDashboard(){
  const url = environment.baseUrl + '/pwa/v1/dashboard/getdashboard';
  return this.http.get(url).pipe(
    catchError(this.handleError)
  ); 
}

getDashboardByid(countryId) {
  const url = environment.baseUrl + '/pwa/v1/dashboard/getdashboardByCountryId/';
  return this.http.get(url+countryId)
  .pipe(
    catchError(this.handleError)
  );   
}

getsocialmedia(countryid){
  const url = environment.baseUrl + '/pwa/v1/dashboard/getdashboardsocialmedia/';
  return this.http.get(url+countryid)
  .pipe(
    catchError(this.handleError)
  );
}
getdashboardBanner(countrycode){
  const url = environment.baseUrl + '/pwa/v1/dashboard/getdashboardBanner/';
  return this.http.get(url+countrycode)
  .pipe(
    catchError(this.handleError)
  );
}

getdashboardByCC(countrycode){
  const url = environment.baseUrl + '/pwa/v1/dashboard/getdashboardByCountryCode/';
  return this.http.get(url+countrycode)
  .pipe(
    catchError(this.handleError)
  );
}





headers={
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
}

////send and get origin dest - index

private indexod = new BehaviorSubject('')

sendindex(tdata){
this.indexod.next(tdata);
}
getindex() : Observable<any> {
  return this.indexod.asObservable()
 }
 


  private returnwaydata = new Subject<any>()

  sendReurnwaydata(formdata){
    this.returnwaydata.next(formdata)
   // //console.log('data -' +this.returnwaydata.next(formdata))
  }
  
  getReurnwaydata() : Observable<any>{
    //console.log("getdata"+this.returnwaydata.asObservable())
    return this.returnwaydata.asObservable()
  }
//////////////////

  private settingdata = new Subject<any>();
  sendsettingdata(data){
    //console.log(data)
    this.settingdata.next(data)
  }
  getsettingdata() : Observable<any>{
    return this.settingdata.asObservable()
  }


 
  private apidataorigin = new BehaviorSubject<any>({
    airportId: 2,
    airportCode: "DXB1",
    airportName: "Dubai International Airport",
  });
  
  private apidataDestination = new BehaviorSubject<any>({
    airportId: 3,
    airportCode: "SIN1",
    airportName: "Singapore Changi Airport",
  });
  
  
  
    sendapiOrigin(origin: any){
      // //console.log(origin);
      this.apidataorigin.next(origin)
    }
    
    getapiOrigin() : Observable<any>{
      // //console.log()
      return this.apidataorigin.asObservable()
    }

    sendapidest(origin: any){
      // //console.log(origin)
      this.apidataDestination.next(origin)
    }
    
    getapidest() : Observable<any>{
      return this.apidataDestination.asObservable()
    }
////////////////////////////////////////////////////////
    private multidates = new BehaviorSubject('')

    sendMultidate(dd){
      this.multidates.next(dd)

    }
    getMultidate(): Observable<any>{
      return this.multidates.asObservable()

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


    private sendReturnDate = new BehaviorSubject('');
    getReturnDate = this.sendReturnDate.asObservable();

    sendReturnDataDate(date: any){
    this.sendReturnDate.next(date);
    }


    private sendRequestBodyFareConfirm = new BehaviorSubject('');
    getFareConfirmRequestBody = this.sendRequestBodyFareConfirm.asObservable();


    sendFareConfirmRequestToComponent(reqbody){
     // //console.log('sendFareConfirmRequestToComponent>>',reqbody)
      this.sendRequestBodyFareConfirm.next(reqbody)
    }


    
  private sendSelectedFlightReload = new BehaviorSubject('');
  getsendSelectedFlightReload = this.sendSelectedFlightReload.asObservable();

  pageReloadSelectFlight(data:any){
    this.sendSelectedFlightReload.next(data);
  }

  }
