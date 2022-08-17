import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SendTravllerDataService {
  private Subject = new Subject<any>();
  private calenderSubject = new Subject<any>();

  constructor() {}

  ////travller field
  private travllers = new BehaviorSubject<any>({
    adult: 1
  });

  sendtravllers(trvllerfield) {
    this.travllers.next({ trvllerfield });
  }
  gettravller(): Observable<any> {
    return this.travllers.asObservable();
  }

  ////

  ////travller info to book api -child to parent info////////////////////
  // private adult = new BehaviorSubject<any>('');
  private adult = new Subject<any>();
  sendadult(adult) {
    //console.log(adult)
    this.adult.next({ adult });
  }
  getadult(): Observable<any> {
    return this.adult.asObservable();
  }

  private child = new BehaviorSubject<any>("");
  sendtchild(child) {
    this.adult.next({ child });
  }
  getchild(): Observable<any> {
    return this.child.asObservable();
  }

  private infant = new BehaviorSubject<any>("");
  sendtinfant(infant) {
    this.infant.next({ infant });
  }
  getinfant(): Observable<any> {
    return this.infant.asObservable();
  }

  ///////////////////////////////////////////////

  sendmsg(msz: any) {
    this.Subject.next({ text: msz });
  }

  getmsg(): Observable<any> {
    // console.log("getmsg"+this.Subject.asObservable())
    return this.Subject.asObservable();
  }
  senddata(data: any) {
    this.Subject.next({ text2: data });
    console.log("SERVICES" + data);
  }
  sendonewaycalenderdata(data: any) {
    this.calenderSubject.next({ text2: data });
    console.log("SERVICES" + data);
  }

  getdata(): Observable<any> {
    return this.Subject.asObservable();
  }
  getonewaycalenderdata(): Observable<any> {
    return this.calenderSubject.asObservable();
  }
  private sendTravellerCount = new BehaviorSubject("");
  getTravellerCount = this.sendTravellerCount.asObservable();

  sendTravellerCountdate(data: any) {
    this.sendTravellerCount.next(data);
  }
}
