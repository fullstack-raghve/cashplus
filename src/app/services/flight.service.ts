import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError, Subject, Observable, BehaviorSubject } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  errorData: {};
  constructor(private http:HttpClient) { }

///FLIGHT PAYMENT SERVICE CODE
paymethod(data) {
  // //console.log(body)
   const url = environment.baseUrl + '/pwa/v1/paymethod/getPayMethod';
     return this.http.post(url,data).pipe(
       catchError(this.handleError)
     );   
 }

 getFlightfarerule1(ReqModel) {
  
  const url = environment.baseUrl + '/pwa/v1/flightfarerule/getFlightfarerule';
    return this.http.post(url,ReqModel).pipe(
        
         catchError(this.handleError)
       );  
}
 getFlightfarerule2(ReqModel) {
  
  const url = environment.baseUrl + '/pwa/v1/flightfarerule/getFlightfarerule';
    return this.http.post(url,ReqModel).pipe(
        
         catchError(this.handleError)
       );  
}

paymethod1(data) {
  // //console.log(body)
   const url = environment.baseUrl + '/pwa/v1/paymethod/getPayMethod/';
     return this.http.get(url+data).pipe(
       catchError(this.handleError)
     );   
 }
 ////seatAvailability
 seatAvailability(ReqModel) {
  // //console.log(body)
   const url = environment.baseUrl + '/pwa/v1/book/seatAvailability';
     return this.http.post(url,ReqModel).pipe(
       catchError(this.handleError)
     );   
 }

 ////fareRecheck
 fareRecheck(ReqModel) {
  // //console.log(body)
   const url = environment.baseUrl + '/pwa/v1/book/fareRecheck';
     return this.http.post(url,ReqModel).pipe(
       catchError(this.handleError)
     );   
 }


 private minifullfareRule$: Observable<any>;
 getFlightfarerule1cache(ReqModel) {
  if (!this.minifullfareRule$) {
    this.minifullfareRule$ = this.getFlightfarerule1(ReqModel).pipe(
      shareReplay(1),
    );
  }
  return this.minifullfareRule$;
 }
 

private fullfareRule$: Observable<any>;
getFlightfarerule2cache(ReqModel) {
 if (!this.fullfareRule$) {
   this.fullfareRule$ = this.getFlightfarerule2(ReqModel).pipe(
     shareReplay(1),
   );
 }
 return this.fullfareRule$;
}

clearfullfareRule(){
 this.fullfareRule$ = null;
 this.minifullfareRule$ = null;
}


////
// code for mendatory details

 getMandatoryFields(ReqModel) {
   //console.log(ReqModel)
   const url = environment.baseUrl + '/pwa/v1/flight/getMandatoryFields';
     return this.http.post(url,ReqModel).pipe(
       catchError(this.handleError)
     );   
 }

private dataForTravllers = new BehaviorSubject('');
sendDataToTraveller(similrflight){
  this.dataForTravllers.next(similrflight)
}

getDataFromTraveller() : Observable<any>{
  return this.dataForTravllers.asObservable()
}

//---------------------------

//Validation Details

private PassengerDetails = new BehaviorSubject('');
sendPassengerDetails(data){
  this.PassengerDetails.next(data)
}

getPassengerDetails() : Observable<any>{
  return this.PassengerDetails.asObservable()
}

//---------------------------
//Validation Details

private fareBreakup = new BehaviorSubject('');
sendfareBreakup(data){
  this.fareBreakup.next(data)
}

getfareBreakup() : Observable<any>{
  return this.fareBreakup.asObservable()
}

//---------------------------

 getAllAirline(){
  const url = environment.baseUrl + '/pwa/v1/airline/getAllAirline';
  return this.http.get(url).pipe(
    catchError(this.handleError)
  );
 }

 flightBookEmail(body){

  const url = environment.baseUrl + '/pwa/v1/book/flightBookingEmail';
  return this.http.post(url,body).pipe(
    catchError(this.handleError)
  );

 }






///FLIGHT PAYMENT SERVICE CODE

  ///send/get data from serchresult component to similar first
  private sendsingleflight = new BehaviorSubject('')

  selectedFlight(data){
   // //console.log(data)
    this.sendsingleflight.next(data)
  }
  
  getselectedFlight() : Observable<any>{
    return this.sendsingleflight.asObservable()
  }

  /////////muli

  private sendsingleflightmulti = new BehaviorSubject('')

  selectedFlightmulti(data){
   // //console.log(data)
    this.sendsingleflightmulti.next(data)
  }
  
  getselectedFlightmulti() : Observable<any>{
    return this.sendsingleflightmulti.asObservable()
  }
  ///multi end
///////////smilar options start

// similarflight(onewayfilterflight)
private similarflight = new BehaviorSubject('')

sendsimilarflight(similrflight){
  this.similarflight.next(similrflight)
}

getsimilarflight() : Observable<any>{
  return this.similarflight.asObservable()
}
///////////similar option end


///////////send price and get price for sortinh   --code for sorting all
private sendprice = new BehaviorSubject('')

sendPrice(price){
  this.sendprice.next(price)
}

getPrice() : Observable<any>{
  return this.sendprice.asObservable()
}

private senddeparts = new BehaviorSubject('')

senddepart(dp){
  this.senddeparts.next(dp)
}

getdepart() : Observable<any>{
  return this.senddeparts.asObservable()
}

////send date on toph
private sendheaderdatee = new BehaviorSubject('')

sendheaderdate(date){
  this.sendheaderdatee.next(date)
}

getheaderdate() : Observable<any>{
  return this.sendheaderdatee.asObservable()
}
///booking confirmtion 
////send date on toph
private bookingconfiramtion = new BehaviorSubject('')

sendhBookingURL(date){
  this.bookingconfiramtion.next(date)
}

getBookingURL() : Observable<any>{
  return this.bookingconfiramtion.asObservable()
}

///

////send date on toph
private Fare = new BehaviorSubject('');

sendFare(date){
  this.Fare.next(date);
}

getFare() : Observable<any>{
  return this.Fare.asObservable()
}


////send date on toph
private cardSate = new BehaviorSubject('');

sendCardSate(state){
  this.cardSate.next(state);
}

getCardSate() : Observable<any>{
  return this.cardSate.asObservable()
}

//end date

////end - code for sorting all end


///////////smilar options start for returnway////////

 private similarflightreturnway = new BehaviorSubject('')

sendsimilarflightreturnway(similrflight){
  this.similarflightreturnway.next(similrflight)
}

getsimilarflightreturnway() : Observable<any>{
  return this.similarflightreturnway.asObservable()
}
///////////similar option for returnway end/////////////
 ///multistart
 private similarflightmulti = new BehaviorSubject('')

 sendsimilarflightmulti(similrflight){
  this.similarflightmulti.next(similrflight)

}

 getsimilarflightmulti(): Observable<any>{
  return this.similarflightmulti.asObservable()
}

///send and get flight widget
private flightwidget = new BehaviorSubject('')

sendflightwidget(data){
  this.flightwidget.next(data)

}

roundUpPrice(price){
  return Math.ceil(price);
}

getflightwidget(): Observable<any>{
  return this.flightwidget.asObservable()
}

///send nd get flight widget

 //multi end

///send/get data from oneway componet on lets fly click -- api data
  private onewaydata = new Subject<any>()

  sendonewaydata(formdata){
    ////console.log(formdata)
    this.onewaydata.next(formdata)
  }
  
  getonewaydata() : Observable<any>{
    return this.onewaydata.asObservable()
  }

  ///send origin -destination selected --
 // private oddata = new BehaviorSubject('')
  private oddata = new BehaviorSubject('')

  sendoddata(formdata){
  //console.log('flight service',formdata)
    this.oddata.next(formdata)
  }
  
  getoddata() : Observable<any>{
    return this.oddata.asObservable()
  }



  ///send/get data from oneway componet on lets fly click -- form field data
  private formdata = new Subject<any>()

  sendflightformdata(flightdata){
  //  //console.log(flightdata);
this.formdata.next(flightdata);
  }

  getflightformdata(): Observable<any>{
    return this.formdata.asObservable()
  }

  //send and get booking reg no.
  private bookingRefNo =  new BehaviorSubject('')

  sendbookingRefNo(refno){
    //console.log(refno)
    this.bookingRefNo.next(refno)
  }
  getbookingRefNo(): Observable<any>{
    return this.bookingRefNo.asObservable()
  }

  getflights(body) {
     const url = environment.baseUrl + '/pwa/v1/flight/flightSearch';
       return this.http.post(url,body).pipe(
         catchError(this.handleError)
       );   
   }



  // getflights(body) {
  //   const url = environment.baseUrlnew + '/pwa/v1/flight/flightSearch';
  //     return this.http.post(url,body).pipe(
  //       catchError(this.handleError)
  //     );   
  // }



  ////fare confirm fare api -23oct -19

  
  fareConfirmapi(body) {
   // //console.log(body)
    const url = environment.baseUrl + '/pwa/v1/flight/fareConfirm';
      return this.http.post(url,body).pipe(
        catchError(this.handleError)
      );   
  }

    ////fraud card api to check

  
    checkfraudcard(cn) {
      // //console.log(body)
       const url = environment.baseUrl + '/pwa/v1/paymethod/checkIsFraudlentCardExist/';
         return this.http.get(url+cn).pipe(
           catchError(this.handleError)
         );   
     }

    //  checkfraudcard(cn) {
    //   // //console.log(body)
    //    const url = environment.baseUrl + '/pwa/v1/paymethod/checkFraudCard/';
    //      return this.http.get(url+cn).pipe(
    //        catchError(this.handleError)
    //      );   
    //  }
     ////calculateSurcharge

     calculateSurcharge(body){
      const url = environment.baseUrl + '/pwa/v1/paymethod/calculateSurcharge';
      return this.http.post(url,body).pipe(
        catchError(this.handleError)
      );  
     }
   


  ///////////////////////////////////////////////
  private sendflight = new BehaviorSubject('');

  sendflightdetails(data){
    this.sendflight.next(data);
  }

  getflightdetails() : Observable<any>{
      return this.sendflight.asObservable();
      }


   ////page refresh service ----start
   private pagerefresh =new BehaviorSubject('');
   sendpagerefresh(data){
     this.pagerefresh.next(data);
   }
 
   getpagerefresh() : Observable<any>{
       return this.pagerefresh.asObservable();
   }   

///////////////page refresh end


  flightbook(body) {
    // //console.log(body)
     const url = environment.baseUrl + '/pwa/v1/book/flightbook';
       return this.http.post(url,body).pipe(
         catchError(this.handleError)
       );   
   }

   bookingConfirmationapi(refno) {
    // //console.log(body)
     const url = environment.baseUrl + '/pwa/v1/book/bookingConfirmation/';
       return this.http.get(url+refno).pipe(
         catchError(this.handleError)
       );   
   }

   getBookingDetail(refno) {
    // //console.log(body)
     const url = environment.baseUrl + '/pwa/v1/myTrip/getBookingDetail/';
       return this.http.get(url+refno).pipe(
         catchError(this.handleError)
       );   
   }

  //  pwa/v1/myTrip/getBookingDetail

   ////other payment method

   bankDeposit(data) {
     const url = environment.baseUrl + '/pwa/v1/payment/bankDeposit';
       return this.http.post(url,data).pipe(
         catchError(this.handleError)
       );   
   }
 
   exchangeHouse(data) {
    const url = environment.baseUrl + '/pwa/v1/payment/exchangeHouse';
      return this.http.post(url,data).pipe(
        catchError(this.handleError)
      );   
  }

  validateBookAndHold(data) {
    const url = environment.baseUrl + '/pwa/v1/book/validateBookAndHold';
      return this.http.post(url,data).pipe(
        catchError(this.handleError)
      );   
  }
  bookAndHold(data) {
    const url = environment.baseUrl + '/pwa/v1/book/bookAndHold';
      return this.http.post(url,data).pipe(
        catchError(this.handleError)
      );   
  }

  codDetail(data) {
    const url = environment.baseUrl + '/pwa/v1/payment/codDetail';
      return this.http.post(url,data).pipe(
        catchError(this.handleError)
      );   
  }

  getCODAddress(data){
    const url = environment.baseUrl + '/pwa/v1/myprofile/getUserAddress/';
    return this.http.get(url+data).pipe(
      catchError(this.handleError)
    );   
  }

 



   
  private termcondition$: Observable<any>;
  gettermconditions(data) {
   if (!this.termcondition$) {
     this.termcondition$ = this.gettermcondition(data).pipe(
       shareReplay(1),
     );
   }
   return this.termcondition$;
 }

  clearTnc(){
    this.termcondition$ = null;
  }

  deleteAddress(data){
    const url = environment.baseUrl + '/pwa/v1/myprofile/deleteUserAddress/';
    return this.http.post(url,data).pipe(
      catchError(this.handleError)
    ); 
  }
  gettermcondition(data){
    const url = environment.baseUrl + '/pwa/v1/termsandservice/termsandservice/';
    return this.http.get(url+data).pipe(
      catchError(this.handleError)
    );   
  }
  getCourierDetails(data){
    const url = environment.baseUrl + '/pwa/v1/book/getCourierDetails';
    return this.http.post(url,data).pipe(
      catchError(this.handleError)
    ); 
  }

  editUserAddress(data){
    const url = environment.baseUrl + '/pwa/v1/myprofile/editUserAddress';
    return this.http.post(url,data).pipe(
      catchError(this.handleError)
    ); 
  }
///////////
validateBoking(data){
  const url = environment.baseUrl + '/pwa/v1/book/validateBooking';
  return this.http.post(url,data).pipe(
    catchError(this.handleError)
  ); 
}


/////////////
private sendAffiliateMode = new BehaviorSubject("");

sendAffdata(data:any){
this.sendAffiliateMode.next(data);
}
getaffdata(): Observable<any>{
  return this.sendAffiliateMode.asObservable()

}


////

///////
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

  private sendIfClickOnSearchResultCard = new BehaviorSubject("");
  getSearchResuldataIfClickOnCard = this.sendIfClickOnSearchResultCard.asObservable();

  sendSearchResultCard(data: any) {
    this.sendIfClickOnSearchResultCard.next(data);
  }


}
