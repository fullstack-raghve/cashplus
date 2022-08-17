import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileControllerService{

  errorData: {};
  token: string;

  //private userData = JSON.parse(localStorage.getItem("token"));

  constructor(private http: HttpClient) {
    //this.getipAddress();
    let gettoken = localStorage.getItem('token');
    // console.log(gettoken);
    this.token = gettoken;
    var token = gettoken;
  }



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'loginkey': 'bWFoZW5kcmFAeW9wbWFpbC5jb20jODc2NXRvbnk='
    })

  }

  addGroup(group) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/addGroup';
    return this.http.post(url, group).pipe(
      catchError(this.handleError)
    );
  }

  addTravller(travller) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/addTraveller';
    return this.http.post(url, travller).pipe(
      catchError(this.handleError)
    );
  }

  addTravllerIngroup(travlleringroup) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/addTravellerInGroup';
    return this.http.post(url, travlleringroup).pipe(
      catchError(this.handleError)
    );
  }

  editgroup(editgroup) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/editGroup';
    return this.http.post(url, editgroup).pipe(
      catchError(this.handleError)
    );
  }

  editprofile(editprofile) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/editProfile';
    return this.http.put(url, editprofile).pipe(
      catchError(this.handleError)
    );
  }

  forgotpasswordaction(forgotpaswrd) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/editProfile';
    return this.http.put(url, forgotpaswrd).pipe(
      catchError(this.handleError)
    );
  }

  checkLoginKeyValidOrNot(loginKey){
    const url =  `${environment.baseUrl}/pwa/v1/login/checkLoginKey/${loginKey}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }


  getprofile(email) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/getProfile/';
    return this.http.get(url + email).pipe(
      catchError(this.handleError)
    );
  }


    private profileCache$: Observable<any>;
   getAllProfile(email) {
    if (!this.profileCache$) {
      this.profileCache$ = this.getprofile(email).pipe(
        shareReplay(1),
      );
    }
    return this.profileCache$;
  }
  
  clearAllProfiletCache(){
    this.profileCache$ = null;
  }



  removegroup(groupid) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/removeGroup/';
    return this.http.delete(url + groupid).pipe(
      catchError(this.handleError)
    );
  }

  removetravllerIngroup(id) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/removeTravellerInGroup/';
    return this.http.put(url, id).pipe(
      catchError(this.handleError)
    );
  }

  removetravller(tid) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/removeTraveller/';
    return this.http.delete(url + tid).pipe(
      catchError(this.handleError)
    )
  }

  saveuserprefrences(model) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/saveUserPreference';
    return this.http.post(url, model).pipe(
      catchError(this.handleError)
    )
  }

  getUserprefrences(email) {
    const url = environment.baseUrl + `/pwa/v1/myprofile/getUserPreference/${email}`;
    return this.http.get(url, email).pipe(
      catchError(this.handleError)
    )
  }
  addcard(model) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/addCard';
    return this.http.post(url, model).pipe(
      catchError(this.handleError)
    )
  }
  deletecard(model) {
    const url = environment.baseUrl + '/pwa/v1/myprofile/deleteCard';
    return this.http.post(url, model).pipe(
      catchError(this.handleError)
    )
  }
  getAllAirport() {
    const url = environment.baseUrl + '/pwa/v1/airport/getAllAirport';
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }




  ///socila media list api details

  //http://203.122.41.147:8080/pwa/v1/sociallogin/getSocialLogin
  getSociallogin(userdetail) {
    const url = environment.baseUrl + '/pwa/v1/sociallogin/getSocialLogin';
    return this.http.post(url, userdetail).pipe(
      catchError(this.handleError)
    )
  }


  ///adult call,child call,infant call
  private callSubject = new BehaviorSubject('')

  sendCall(data) {
    this.callSubject.next(data);
  }

  getcall(): Observable<any> {
    return this.callSubject.asObservable()
  }

  ///
  private callSubject1 = new BehaviorSubject('');

  sendCall1(data) {
    this.callSubject1.next(data);
  }

  getcall1(): Observable<any> {
    return this.callSubject1.asObservable()
  }


  private callSubject2 = new BehaviorSubject('');

  sendCall2(data) {
    this.callSubject2.next(data);
  }

  getcall2(): Observable<any> {
    return this.callSubject2.asObservable()
  }
  ////call end

  //send and get group data on group click to edit page
  private groupSubject = new BehaviorSubject('')
  // private groupSubject = new Subject<>();

  sendgroupdata(data) {
    this.groupSubject.next(data);
  }

  getgroupdata(): Observable<any> {
    return this.groupSubject.asObservable()
  }

  ///end group code ///////////
  private travllerdataadult1 = new BehaviorSubject('')

  sendselectedtravllerdataadult1(tdata) {
    this.travllerdataadult1.next(tdata);
  }
  getselectedtravllerdataadult1(): Observable<any> {
    return this.travllerdataadult1.asObservable()
  }

  ///send and get selected travller data
  private travllerdata = new BehaviorSubject('')

  sendselectedtravllerdata(tdata) {
    this.travllerdata.next(tdata);
    // console.log(tdata);
  }
  getselectedtravllerdata(): Observable<any> {
    return this.travllerdata.asObservable()
  }

  //////////////////send and get index of current adult,child & INFANT
  private indexinfant = new BehaviorSubject('')

  sendindexinfant(tdata) {
    this.indexinfant.next(tdata);
  }
  getindexinfant(): Observable<any> {
    return this.indexinfant.asObservable()
  }

  ///adult -index

  private indexadult = new BehaviorSubject('')

  sendindexadult(tdata) {
    this.indexadult.next(tdata);
  }
  getindexadult(): Observable<any> {
    return this.indexadult.asObservable()
  }
  ///child -index

  private indexchild = new BehaviorSubject('')

  sendindexchild(tdata) {
    this.indexchild.next(tdata);
  }
  getindexchild(): Observable<any> {
    return this.indexchild.asObservable()
  }
  /////////INDEX END

  private travllerdataadult2 = new BehaviorSubject('')

  sendselectedtravllerdataadult2(tdata) {
    this.travllerdataadult2.next(tdata);
  }
  getselectedtravllerdataadult2(): Observable<any> {
    return this.travllerdataadult2.asObservable()
  }


  ///send and get selected travller data -adult
  private travllerdataadult = new BehaviorSubject('')

  sendselectedtravllerdataadult(tdata) {
    this.travllerdataadult.next(tdata);
  }
  getselectedtravllerdataadult(): Observable<any> {
    return this.travllerdataadult.asObservable()
  }

  ////send  & get sselected infant
  private trinfant = new BehaviorSubject('')

  sendselectedtravllerinfant(infant) {
    this.trinfant.next(infant);

  }
  getselectedtravllerinfant(): Observable<any> {
    return this.trinfant.asObservable()
  }

  ////send  & get sselected child
  private trchild = new BehaviorSubject('')

  sendselectedtravllerchild(child) {
    this.trchild.next(child);

  }
  getselectedtravllerchild(): Observable<any> {
    return this.trchild.asObservable()
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
  public sendCurrentURL = new BehaviorSubject('');
  getCurrentURL = this.sendCurrentURL.asObservable();
  sendCurrentUrlToComponent(url) {
    this.sendCurrentURL.next(url);
  }

  //forgot password to back page

  public sendCurrentURL1 = new BehaviorSubject('');
  getCurrentURL1 = this.sendCurrentURL1.asObservable();
  sendCurrentUrlToComponent1(url) {
    this.sendCurrentURL1.next(url);
  }
  ////for signup

  public sendCurrentURL2 = new BehaviorSubject('');
  getCurrentURL2 = this.sendCurrentURL2.asObservable();
  sendCurrentUrlToComponent2(url) {
    this.sendCurrentURL2.next(url);
  }

  public sendCurrentURL3 = new BehaviorSubject('');
  getCurrentURL3 = this.sendCurrentURL3.asObservable();
  sendCurrentUrlToComponent3(url) {
    this.sendCurrentURL3.next(url);
  }



public sendDataFromGuestlogin = new BehaviorSubject('');
  getDataFromGuestLogin = this.sendDataFromGuestlogin.asObservable();

  sendDataFromGuestLogin(data:any){
    this.sendDataFromGuestlogin.next(data)
  }

  public IfprofileUpdate = new BehaviorSubject('');
  getProfileUpdateVariable = this.IfprofileUpdate.asObservable();

  sendIfProfileUpdate(data:any){
    this.IfprofileUpdate.next(data);
  }

  public sendUserProfileDetails = new BehaviorSubject('');
  getUserProfileDetails = this.sendUserProfileDetails.asObservable();

  sendCurrentProfileUSerDetails(data:any){
    this.sendUserProfileDetails.next(data);
  }


}
