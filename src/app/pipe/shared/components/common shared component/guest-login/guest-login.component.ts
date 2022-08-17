import { Component, OnInit, Input, ElementRef, Inject, Renderer2, NgZone } from "@angular/core";
import { ModalController, NavParams, LoadingController } from "@ionic/angular";
import { Router, NavigationStart, Event, NavigationEnd, NavigationError } from "@angular/router";
import { UserLoginComponent } from "../user-login/user-login.component";
import { AuthServices } from "src/app/services/auth.service";
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from "angularx-social-login";

import { Validators, FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import * as moment from "moment";
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { Subscription } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { environment } from 'src/environments/environment';
declare const gapi: any;
@Component({
  selector: "app-guest-login",
  templateUrl: "./guest-login.component.html",
  styleUrls: ["./guest-login.component.scss"]
})
export class GuestLoginComponent implements OnInit {
  loginForm: FormGroup;
  token: any;
  loggedIn: string;
  language = 'en'

  isGuestLogin = true;
  isLoginUser = false;
  isSignUpUser = false;
  isForGotPassword = false;

  @Input() sessionTimeOutTrue: any;
  isSessionTimeOut:any;
  refreshedDest: string;
  refreshedOrigin: string;
  returnwayreturnDate: string;
  returnwaydepartDate: string;
  FlightOnwardCarrier: string;
  FlightReturnCabinClass: string;
  FlightOnwardCabinClass: string;
  countryCode: string;
  triptype: string;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;
  travSub:Subscription

  constructor(
    private modalController: ModalController,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private authServices: AuthServices,
    private profileControllerService: ProfileControllerService,
    public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService,
    private navParams: NavParams,
    private sendTravllerDataService: SendTravllerDataService,
    private overlayService: OverlayService,
    private ngZone: NgZone,
    private el: ElementRef,
     @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private loadingController: LoadingController
  ) { }

  ngOnInit() {
this.start();
    let allDivs;
    allDivs = document.getElementsByClassName('cdk-overlay-container');
    // console.log(allDivs)
    if(allDivs && allDivs['length'] != 0){
      allDivs[0].classList.add('zindexNegative');
    }
  

    this.isSessionTimeOut = this.navParams.get('sessionTimeOutTrue')
    // console.log( 'Session time out',this.isSessionTimeOut );

    this.isLoginUser = false;
    this.isGuestLogin = true;
    this.isSignUpUser = false;
    this.isForGotPassword = false;
    this.gettravllerfromservice()
    this.getRouterDetails();
    this.loggedIn = localStorage.getItem('isLoggedIn');
    // console.log(this.loggedIn);
    if (this.loggedIn == null)
      this.loggedIn = 'false';
    this.loginForm = this.formBuilder.group({
      userAlias: ['', [Validators.required, Validators.pattern(/^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/), Validators.maxLength(45)]]
    });
  }

  start() {
    gapi.load('auth2', function () {
      gapi.auth2.init({
        client_id: environment.googleApiKey,
        scope: 'profile email',
        fetch_basic_profile: true,
      });
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
    this.removeZindexClass();
  }

  getEmailValueGuestLogin;

userLogin() {
  // console.log(this.loginForm.get('userAlias').value)
if(this.getEmailValueGuestLogin != ''){
  this.getEmailValueGuestLogin = this.loginForm.get('userAlias').value;
}
  
    this.isLoginUser = true;
    this.isGuestLogin = false;
    this.isSignUpUser = false;
    this.isForGotPassword = false;
  }

  forGotPassword(event){
    // console.log(event);
    this.isForGotPassword = true;
    this.isLoginUser = false;
    this.isGuestLogin = false;
    this.isSignUpUser = false;

  }

  signUpUser(event){
    // console.log(event)
    this.isSignUpUser = true;
    this.isForGotPassword = false;
    this.isLoginUser = false;
    this.isGuestLogin = false;
  }

  sendPasswordRequest(event){
    // console.log(event);
    this.isLoginUser = true;
    
    this.isSignUpUser = false;
    this.isForGotPassword = false;
    this.isGuestLogin = false;
  }

  get f() {
    return this.loginForm.controls;
  }

  submitted = false;
  login() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      this.markFormGroupTouched(this.loginForm)
    } else {
      this.removeZindexClass();
     this.presentLoading()
      let email = this.f.userAlias.value;

      let newlogin = {
        "userAlias": email,
        "userType": "guestuser"
      }

      this.authServices.loginuser(newlogin).subscribe(res => {
       
       if(res){
        this.closeLoading();
        this.token = res['loginKey'];
        localStorage.setItem('loginemail', this.f.userAlias.value);
        sessionStorage.setItem('loginemail', this.f.userAlias.value);

        localStorage.setItem("token", this.token);
       localStorage.setItem('isLoggedIn','false');

        if(this.isSessionTimeOut == true){
          this.modalController.dismiss({
            dismissed: true
          });
        }else{
           this.modalController.dismiss({
            dismissed: true
          });
          this.router.navigate(["/traveller-details"]);
        //  let countryCodee = localStorage.getItem('countryCode');
   
        //  this.countryCode = countryCodee.toLowerCase();
        //  this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
        //  this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
        //  this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
        //  this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
        //  this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
        //  this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
        //  this.refreshedDest = localStorage.getItem('refreshedDest')
        //  this.triptype = localStorage.getItem('tripType');

        //  let adultinfo = this.adult ? this.adult : 1
        //  let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        //  let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        //  let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
        //  let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
 
        //  if (this.triptype == "oneway") {
        //    this.router.navigate([maskUrlOneway]);
 
        //  }
        //  if (this.triptype == "returnway") {
        //    this.router.navigate([maskUrlReturn]);
 
        //  }
        //  if (this.triptype == "multicity") {
        //   console.log('multicity',this.triptype)
        //  this.router.navigate([maskUrlReturn]);
        //  this.router.navigate(['/travllers-details'])

        // }
          
        }
this.removeZindexClass();
       }else{
        this.closeLoading();
       }
      });
    }
  }

removeZindexClass(){
  let allDivs;
  allDivs = document.getElementsByClassName('cdk-overlay-container');
  // console.log(allDivs)
  if(allDivs && allDivs['length'] != 0){
    allDivs[0].classList.remove('zindexNegative');
  }
}

  signInWithGoogle(): void {

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((result: any) => {
      if (result) {
        var profile = result.getBasicProfile();
        let reqBody = {
          accountType: 3,
          email: profile.getEmail(),
          firstName: profile.getGivenName(),
          imageUrl: profile.getImageUrl(),
          lastName: profile.getFamilyName(),
        }
        this.ngZone.run(() => {
          this.loginByGoogleBackend(reqBody);
        })
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  loginByGoogleBackend(res) {
    console.log(res)
    if (res) {
      this.removeZindexClass();
      this.presentLoading();
      this.authServices.getSociallogin(res).subscribe((response) => {
        if(response['statusCode'] == 0){
          this.closeLoading();
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem('token', response['sLoginKey']);
          localStorage.setItem('loginemail', res['email']);
          sessionStorage.setItem('loginemail', res['email']);

          if(this.isSessionTimeOut == true){
            this.modalController.dismiss({
              dismissed: true
            });
          }else{
             this.modalController.dismiss({
              dismissed: true
            });
            this.router.navigate(["/traveller-details"]);
          //  let countryCodee = localStorage.getItem('countryCode');
         
          //  this.countryCode = countryCodee.toLowerCase();
          //  this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
          //  this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
          //  this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
          //  this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
          //  this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
          //  this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
          //  this.refreshedDest = localStorage.getItem('refreshedDest')
          //  this.triptype = localStorage.getItem('tripType');
      
          //  let adultinfo = this.adult ? this.adult : 1
          //  let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          //  let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          //  let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
          //  let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
      
          //  if (this.triptype == "oneway") {
          //   this.router.navigate(['/travllers-details'])
      
          //  }
          //  if (this.triptype == "returnway") {
          //   this.router.navigate(['/travllers-details'])
      
          //  }    if (this.triptype == "multicity") {
          //   console.log('multicity',this.triptype)
          // this.router.navigate([maskUrlReturn]);
          //  this.router.navigate(['/travllers-details'])
      
          // }
          }
          this.removeZindexClass();
         }else{
          this.closeLoading();
         }
      });
    }
  }



  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      if(res){
        // console.log("google", res);
        let body = {
          'accountType': 3,
          'email': res['email'],
          'firstName': res['firstName'],
          'imageUrl': res['photoUrl'],
          'lastName': res['lastName'],
          'middleName': res['middleName'] || 'string'
        };
        this.removeZindexClass();
        this.presentLoading()
      
        this.authServices.getSociallogin(body).subscribe(response => {
          // console.log(response);
         if(response['statusCode'] == 0){
          this.closeLoading();
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem('token', response['sLoginKey']);
          localStorage.setItem('loginemail', res['email']);
          sessionStorage.setItem('loginemail', res['email']);

          if(this.isSessionTimeOut == true){
            this.modalController.dismiss({
              dismissed: true
            });
          }else{
             this.modalController.dismiss({
              dismissed: true
            });
          this.router.navigate(["/traveller-details"]);
          //  let countryCodee = localStorage.getItem('countryCode');
   
          //  this.countryCode = countryCodee.toLowerCase();
          //  this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
          //  this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
          //  this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
          //  this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
          //  this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
          //  this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
          //  this.refreshedDest = localStorage.getItem('refreshedDest')
          //  this.triptype = localStorage.getItem('tripType');
  
          //  let adultinfo = this.adult ? this.adult : 1
          //  let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          //  let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          //  let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
          //  let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
   
          //  if (this.triptype == "oneway") {
          //    this.router.navigate([maskUrlOneway]);
   
          //  }
          //  if (this.triptype == "returnway") {
          //    this.router.navigate([maskUrlReturn]);
   
          //  }    if (this.triptype == "multicity") {
          //   console.log('multicity',this.triptype)
          //  this.router.navigate([maskUrlReturn]);
          //  this.router.navigate(['/travllers-details'])
  
          // }
          }
          this.removeZindexClass();
         }else{
          this.closeLoading();
         }
        });
      }
      
    });
  }

  register(event) {
    // console.log(event)
    this.isSignUpUser = true;

    this.isForGotPassword = false;
    this.isLoginUser = false;
    this.isGuestLogin = false;
  }

  getDataFromSigUp(event){
    // console.log(event);

    this.isLoginUser = true;
    
    this.isSignUpUser = false;
    this.isForGotPassword = false;
    this.isGuestLogin = false;
  }

  getRouterDetails() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
          this.dismiss();
          this.closeLoading();
      }
    });
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
  gettravllerfromservice() {
    this.travSub = this.sendTravllerDataService.gettravller().subscribe(res => {
      // console.log(res);
      var info = res["trvllerfield"];
      this.adultdefault = res.adult;
      this.adult = info.adult;
      this.children = info.children;
      this.infants = info.infants;
    });
  }

  markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  // sendDataToLoginForgotComponent(){
  //   this.profileControllerService.sendDataFromGuestLogin(true);
  // }
}

// this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
//   if(res){
// // console.log("google", res);
// let body = {
//   'accountType': 3,
//   'email': res['email'],
//   'firstName': res['firstName'],
//   'imageUrl': res['photoUrl'],
//   'lastName': res['lastName'],
//   'middleName': res['middleName'] || 'string'
// };
// this.removeZindexClass();
// this.presentLoading()

// this.authServices.getSociallogin(body).subscribe(response => {
//   // console.log(response);
//  if(response['statusCode'] == 0){
//   this.closeLoading();
//   localStorage.setItem("isLoggedIn", "true");
//   localStorage.setItem('token', response['sLoginKey']);
//   localStorage.setItem('loginemail', res['email']);
//   if(this.isSessionTimeOut == true){
//     this.modalController.dismiss({
//       dismissed: true
//     });
//   }else{
//      this.modalController.dismiss({
//       dismissed: true
//     });
//     this.router.navigate(["/traveller-details"]);
//   //  let countryCodee = localStorage.getItem('countryCode');
 
//   //  this.countryCode = countryCodee.toLowerCase();
//   //  this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
//   //  this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
//   //  this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
//   //  this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
//   //  this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
//   //  this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
//   //  this.refreshedDest = localStorage.getItem('refreshedDest')
//   //  this.triptype = localStorage.getItem('tripType');

//   //  let adultinfo = this.adult ? this.adult : 1
//   //  let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
//   //  let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
//   //  let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
//   //  let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';

//   //  if (this.triptype == "oneway") {
//   //   this.router.navigate(['/travllers-details'])

//   //  }
//   //  if (this.triptype == "returnway") {
  //   this.router.navigate(['/travllers-details'])

  //  }    if (this.triptype == "multicity") {
  //   console.log('multicity',this.triptype)
  // this.router.navigate([maskUrlReturn]);
  //  this.router.navigate(['/travllers-details'])

  // }
//   }
//   this.removeZindexClass();
//  }else{
//   this.closeLoading();
//  }
// });
// }

//   });