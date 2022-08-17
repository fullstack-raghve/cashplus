
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, AsyncSubject } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';
import { delay } from 'rxjs/internal/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  private cache = new Map<string, any>();
  cachedResponse;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method == 'GET') {
        let urlAirportList = request.url.split("/");
        let bookingConfirmationCache = urlAirportList.includes("getBookingDetail");
        let stateCache = urlAirportList.includes("getAllStatesByCountryId");
        if(urlAirportList.includes("getAirportList")){
            const cachedResponse= this.cache.get(request.url);
            if (cachedResponse) {
              return of(cachedResponse)
            }
        }
        else if(bookingConfirmationCache){
          const cachedResponse= this.cache.get(request.urlWithParams);
          if (cachedResponse) {
            return of(cachedResponse)
          }
        }
        else if(stateCache){
          const cachedResponse= this.cache.get(request.urlWithParams);
          if (cachedResponse) {
            return of(cachedResponse)
          }
        }
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.url, event);
        }
      })
    );
  }
}
  // private cache: { [name: string]: AsyncSubject<HttpEvent<any>> } = {};

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //   var startTime = (new Date()).getTime();

  //   return next.handle(req).pipe(
  //     map(
  //       (event) => {
  //         if (event instanceof HttpResponse) {
  //           var endTime = (new Date()).getTime();
  //           event = event.clone({ headers: event.headers.set('endTime', endTime.toString()) });
  //           event = event.clone({ headers: event.headers.set('startTime', startTime.toString()) });
  //           var diff = endTime - startTime;

  //           console.log(event.url + " succeded in " + diff + " milli seconds");
  //         }
  //         return event;
  //       }), tap(event => { },
  //         error => {
  //           if (error instanceof HttpErrorResponse) {
  //             var endTime = (new Date()).getTime();
  //             var diff = endTime - startTime;

  //             console.log(error.url + " failed in " + diff + " milli seconds");
  //           }
  //         }
  //       )
  //   )
  //     ;
  // }

  //   if (event instanceof HttpResponse) {
//     subject.next(event);
//     subject.complete();
// }
  // private cache = new Map<string, any>();
  // cachedResponse;
  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //     console.log(request)
  //   if (request.method == 'GET') {
  //       let urlAirportList = request.url.split("/");
  //       if(urlAirportList.includes("getAirportList")){
  //           const cachedResponse= this.cache.get(request.urlWithParams);
  //           if (cachedResponse) {
  //             return of(cachedResponse)
  //           }else{
  //             return next.handle(request).pipe(
  //               tap(event => {
  //                   console.log(event)
  //                 if (event instanceof HttpResponse) {
  //                   this.cache.set(request.url, event);
  //                 }
  //               })
  //             );
  //           }
  //       }
       
  //   }

  //   // return next.handle(request)
  
  // }

  //   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //     if (request.method !== "GET") {
  //         return next.handle(request);
  //     }
  //     const cachedResponse = this.cache[request.urlWithParams] || null;
  //     if (cachedResponse) {
  //         return cachedResponse.pipe(delay(0))
  //     }
  //     const subject = this.cache[request.urlWithParams] = new AsyncSubject<HttpEvent<any>>();
  //     next.handle(request).pipe(
  //       tap(event => {
  //         console.log(event);
  //         this.closeLoading();
  //         if (event instanceof HttpResponse) {
  //           subject.next(event);
  //           subject.complete();
  //       }
  //     })
  //     )
  //     .subscribe(); // must subscribe to actually kick off request!
  //     return subject;
  // }
  
