import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OriginDestinationService {
  origins: any;

  city: any;
constructor(private http: HttpClient){
  
}

alterback = new BehaviorSubject(false) // Alternate header back 
appback = new BehaviorSubject (true) // // App header common back arrow

  // constructor(private globalService: GlobalService) {
  //   let cid = localStorage.getItem('countryId')
  //   this.globalService.getpopularcity(cid).subscribe((res) => {
  //     console.log(res);
  //     this.city =  res['cityAndAirportDataList'];
  //     let origin = this.city[3];
  //     let dest = this.city[2];

  //    console.log(origin);
  //    console.log(dest);

  //   });
  // }
  //private Subject =  new Subject<any>();
  // private SendOrigin = new BehaviorSubject<any>({
  //   airportId: 2,
  //   airportCode: "DXB1",
  //   airportName: "Dubai International Airport",
  // });

  // private SendDestination = new BehaviorSubject<any>({
  //   airportId: 3,
  //   airportCode: "SIN2",
  //   airportName: "Singapore Changi Airport",
  // });

  private SendOrigin = new BehaviorSubject<any>('')

  sendOrigin(origin: any) {
    this.SendOrigin.next(origin)
  }

  getOrigin(): Observable<any> {
    return this.SendOrigin.asObservable()
  }

  ///destination
  private SendDestination = new BehaviorSubject<any>('')

  sendDestination(destination: any) {
    this.SendDestination.next(destination)
  }

  getDestination(): Observable<any> {
    return this.SendDestination.asObservable()
  }


   private popcity = new BehaviorSubject<any>('')

sendpopcity(popcity){
this.popcity.next(popcity)
}

getpopcity(): Observable<any>{
  return this.popcity.asObservable()

}

getAllPortList() { 
  return this.http.get('/assets/airportList.json');
}


 
}
