import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthServices } from 'src/app/services/auth.service';
import { MatSnackBar , MatDialog} from '@angular/material';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from "angularx-social-login";
import { Subscription } from 'rxjs';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import * as moment from "moment";
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import Swal from 'sweetalert2';
import { ForgotPasswordPopupComponent } from 'src/app/modules/auth-module/forgot-password-module/forgot-password-popup/forgot-password-popup.component';
import { environment } from 'src/environments/environment';
declare const gapi: any;


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  language = 'en'
  loginForm: FormGroup;
  submitted = true;
  message: string;
  token: any;
  isAuthenticated: boolean;
  loggedIn;
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
  travSub:Subscription;
  isDataFromGuestLogin;
  @Output() clickOnForgot = new EventEmitter<any>();
  @Output() clickOnSignup = new EventEmitter<any>();

  @Input()  getSessionTimeOutValue: any;
  @Input() getEmailValue:any;

  constructor(private router: Router, private snackBar: MatSnackBar,
    private authServices: AuthServices,
    private sendTravllerDataService: SendTravllerDataService,
    private authService: AuthService,
    private modalController: ModalController,
    private profileControllerService: ProfileControllerService,
    private spinner: NgxSpinnerService,
     private httpservie: AuthServices,
     public dialog: MatDialog, 
     private ngZone: NgZone,
    private formBuilder: FormBuilder, public navCtrl: NgxNavigationWithDataComponent,  private loadingController: LoadingController,  private overlayService: OverlayService) { }
show_err_message = false;
  ngOnInit() {
  
 this.start();
    this.loggedIn = localStorage.getItem('isLoggedIn');
    // console.log(this.loggedIn);
    // console.log('session time out',this.getSessionTimeOutValue)
    if (this.loggedIn == null)
      this.loggedIn = 'false';
    this.loginForm = this.formBuilder.group({
      userAlias: ['', [Validators.required, Validators.pattern(/^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/), Validators.maxLength(45)]],
      password: ['', [Validators.required]]
    });

    if(this.getEmailValue){
      this.loginForm.patchValue({
        userAlias:this.getEmailValue
      })
    }

    this.loginForm.valueChanges.subscribe(
      (res)=>{
this.show_err_message = false;
      }
    )
    this.gettravllerfromservice();

  }

  signUp() {
    this.clickOnSignup.emit(true)
  }
  ionViewWillEnter() {
    // console.log('i am from user login')
  }

  dismiss() {
    this.removeZindexClass();
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  get f() { return this.loginForm.controls; }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
  //     if (res) {
  //       // console.log("google", res);
  //       let body = {
  //         'accountType': 3,
  //         'email': res['email'],
  //         'firstName': res['firstName'],
  //         'imageUrl': res['photoUrl'],
  //         'lastName': res['lastName'],
  //         'middleName': res['middleName'] || 'string'
  //       };
  //       this.removeZindexClass();
  //       this.presentLoading();;

  //       this.authServices.getSociallogin(body).subscribe(response => {
  //         // console.log(response);
  //         if (response['statusCode'] == 0) {
  //           this.closeLoading();
  //           localStorage.setItem("isLoggedIn", "true");
  //             localStorage.setItem('token', response['sLoginKey']);
  //           localStorage.setItem('loginemail', res['email']);
  //           if(this.getSessionTimeOutValue == true){
  //             this.modalController.dismiss({
  //               dismissed: true
  //             });
  //           }else{
  //             this.modalController.dismiss({
  //               'dismissed': true
  //             });
  //             this.router.navigate(["/traveller-details"]);
              
  //             // let countryCodee = localStorage.getItem('countryCode');
   
  //             // this.countryCode = countryCodee.toLowerCase();
  //             // this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
  //             // this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
  //             // this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
  //             // this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
  //             // this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
  //             // this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
  //             // this.refreshedDest = localStorage.getItem('refreshedDest')
  //             // this.triptype = localStorage.getItem('tripType');
         
  //             // let adultinfo = this.adult ? this.adult : 1
  //             // let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
  //             // let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
  //             // let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
  //             // let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
         
  //             // if (this.triptype == "oneway") {
  //             //   this.router.navigate([maskUrlOneway]);
         
  //             // }
  //             // if (this.triptype == "returnway") {
  //             //   this.router.navigate([maskUrlReturn]);
         
  //             // }    if (this.triptype == "multicity") {
  //             //   console.log('multicity',this.triptype)
  //             //  this.router.navigate([maskUrlReturn]);
  //             //  this.router.navigate(['/travllers-details'])
      
  //             // }
  //           }
  //           this.removeZindexClass();
  //         } else {
  //           this.closeLoading();
  //         }
  //       });
  //     }

  //   });
  // }


  
 start() {
  gapi.load('auth2', function () {
    gapi.auth2.init({
      client_id: environment.googleApiKey,
      scope: 'profile email',
      fetch_basic_profile: true,
    });
  });
}

signInWithGoogle() {
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
      if (response['statusCode'] == 0) {
        this.closeLoading();
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('token', response['sLoginKey']);
        localStorage.setItem('loginemail', res['email']);
        sessionStorage.setItem('loginemail', res['email']);

        if(this.getSessionTimeOutValue == true){
          this.modalController.dismiss({
            dismissed: true
          });
        }else{
          this.modalController.dismiss({
            'dismissed': true
          });
          this.router.navigate(["/traveller-details"]);
          
          // let countryCodee = localStorage.getItem('countryCode');

          // this.countryCode = countryCodee.toLowerCase();
          // this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
          // this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
          // this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
          // this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
          // this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
          // this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
          // this.refreshedDest = localStorage.getItem('refreshedDest')
          // this.triptype = localStorage.getItem('tripType');
     
          // let adultinfo = this.adult ? this.adult : 1
          // let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          // let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          // let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
          // let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
     
          // if (this.triptype == "oneway") {
          //   this.router.navigate([maskUrlOneway]);
     
          // }
          // if (this.triptype == "returnway") {
          //   this.router.navigate([maskUrlReturn]);
     
          // }    if (this.triptype == "multicity") {
          //   console.log('multicity',this.triptype)
          //  this.router.navigate([maskUrlReturn]);
          //  this.router.navigate(['/travllers-details'])
  
          // }
        }
        this.removeZindexClass();
      } else {
        this.closeLoading();
      }
    });
  }
}


  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      if (res) {
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
        this.presentLoading();;

        this.authServices.getSociallogin(body).subscribe(response => {
          // console.log(response);
          if (response['statusCode'] == 0) {
            this.closeLoading();
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem('token', response['sLoginKey']);
            localStorage.setItem('loginemail', res['email']);
            sessionStorage.setItem('loginemail', res['email']);

            if(this.getSessionTimeOutValue == true){
              this.modalController.dismiss({
                dismissed: true
              });
            }else{
              this.modalController.dismiss({
                'dismissed': true
              });
              this.router.navigate(["/traveller-details"]);
              // let countryCodee = localStorage.getItem('countryCode');
   
              // this.countryCode = countryCodee.toLowerCase();
              // this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
              // this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
              // this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
              // this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
              // this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
              // this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
              // this.refreshedDest = localStorage.getItem('refreshedDest')
              // this.triptype = localStorage.getItem('tripType');
         
              // let adultinfo = this.adult ? this.adult : 1
              // let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
              // let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
              // let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
              // let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
         
              // if (this.triptype == "oneway") {
              //   this.router.navigate([maskUrlOneway]);
         
              // }
              // if (this.triptype == "returnway") {
              //   this.router.navigate([maskUrlReturn]);
         
              // }
              // if (this.triptype == "multicity") {
              //   console.log('multicity',this.triptype)
              //  this.router.navigate([maskUrlReturn]);
              //  this.router.navigate(['/travllers-details'])
      
              // }
            }
            this.removeZindexClass();
          } else {
            this.closeLoading();
          }
        });
      }
    });
  }



  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm)
    } else {
      this.removeZindexClass();
      this.presentLoading();
      let email = this.f.userAlias.value;
      let password = this.f.password.value;
      let newlogin = {
        "password": password,
        "userAlias": email,
        "userType": "registereduser"
      }

      this.authServices.loginuser(newlogin).subscribe(res => {
        if(res){
          console.log(res);
          this.closeLoading();
          let login1 = res['statusMessage'];
          this.token = res['loginKey'];
          let forgotPasswordUrl = "/pwa/v1/forgotpassword/getForgotPassword/";
          let countryCode = localStorage.getItem("countryCode");
          this.isDataFromGuestLogin = JSON.parse(
             localStorage.getItem("getDataFromGuestLogin")
          );
          console.log("token:-",this.token);
            //  console.log(this.f.userAlias.value)
            //  console.log(countryCode)
            //  console.log(environment.baseUrl)
        if(login1 == "User is not varified"){
              this.httpservie
              .postData(environment.baseUrl+
                 forgotPasswordUrl +
                 this.f.userAlias.value +
                  "/" +
                  countryCode
              ).subscribe(res => {
            console.log(res);
            if(res){
              this.closeLoading();
              let sendData ={
                response:res,
                isDataFromGuest:this.isDataFromGuestLogin,
                forgotEmail: this.f.userAlias.value,
              }         
              this.dialog.open(ForgotPasswordPopupComponent, {
                panelClass: "alert-password-change",
                backdropClass: "alert-password-back-drop",
                data:sendData,
                width:'100%',
                maxWidth:'95vw',
             });
            }
          })
        }
        else if(login1 == "Entered wrong password too many times! Account is currently locked"){   
          Swal.fire({
            text: "Your password is locked. Please contact customer service.",
            customClass : {
             container:"swalForCOD"
           },
           imageUrl: 'assets/icon/Lock.png',
           confirmButtonText: 'OK'
         }).then((result) => {
           if(result.value == true) {
             console.log("locked is Account");
          }
        })
      }
      else if(login1 == "user is not of registered Type") {
        console.log(login1);
        let snackBarRef1 = this.snackBar.open("You are not registered.Please Sign Up!", "", {
          duration: 1000,
        });
    } 
      else if(this.token == null) {
          this.isAuthenticated = false;
          this.show_err_message = true;
          this.message = "Invalid Email & Password";
          let snackBarRef1 = this.snackBar.open('Invalid Credentials!', '', {
            duration: 1000,
          });
          // console.log(this.token);
      }      
      else if(login1 == "unsuccess") {
          console.log(login1);
          let snackBarRef1 = this.snackBar.open("Invalid Credentials!", "", {
            duration: 1000,
          });
      }

      else {
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem('loginemail', this.f.userAlias.value);
            sessionStorage.setItem('loginemail', this.f.userAlias.value);


            this.isAuthenticated = true;
            console.log("isAuthenticated"+this.isAuthenticated);
            localStorage.setItem("token", this.token);
            if(this.getSessionTimeOutValue == true){
              this.modalController.dismiss({
                dismissed: true
              });
            } else {
              this.modalController.dismiss({
                'dismissed': true
              });
              this.router.navigate(["/traveller-details"]);
              // let countryCodee = localStorage.getItem('countryCode');
   
              // this.countryCode = countryCodee.toLowerCase();
              // this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
              // this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');
              // this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
              // this.returnwaydepartDate = localStorage.getItem('returnwaydepartDate');
              // this.returnwayreturnDate = localStorage.getItem('returnwayreturnDate');
              // this.refreshedOrigin = localStorage.getItem('refreshedOrigin');
              // this.refreshedDest = localStorage.getItem('refreshedDest')
              // this.triptype = localStorage.getItem('tripType');
         
              // let adultinfo = this.adult ? this.adult : 1
              // let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
              // let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
              // let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
              // let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
         
              // if (this.triptype == "oneway") {
              //   this.router.navigate([maskUrlOneway]);
         
              // }
              // if (this.triptype == "returnway") {
              //   this.router.navigate([maskUrlReturn]);
         
              // }
              // if (this.triptype == "multicity") {
              //   console.log('multicity',this.triptype)
              //   this.router.navigate([maskUrlReturn]);
              //  this.router.navigate(['/travllers-details'])
      
              // }
            }
            this.removeZindexClass();
            this.snackBar.open('Logged in Successfully','',{
              duration:1000,
             });
          }
        }
      });
    }
  }


  forgotpassword() {
    this.clickOnForgot.emit(true)
  }

  
  removeZindexClass(){
    let allDivs;
    allDivs = document.getElementsByClassName('cdk-overlay-container');
    // console.log(allDivs)
    if(allDivs && allDivs['length'] != 0){
      allDivs[0].classList.remove('zindexNegative');
    }
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

}

