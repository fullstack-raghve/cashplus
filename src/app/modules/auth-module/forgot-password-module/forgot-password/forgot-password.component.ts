import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { Location, PlatformLocation } from '@angular/common';

import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { AuthServices } from "src/app/services/auth.service";
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SnackBarComponent } from 'src/app/pipe/shared/components/snack-bar/snack-bar.component';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { ForgotPasswordPopupComponent } from '../forgot-password-popup/forgot-password-popup.component';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { OverlayService } from 'src/app/services/overlay.service';
import { ShowYesNoComponent } from 'src/app/pipe/shared/components/show-yes-no/show-yes-no.component';
declare const gapi: any;
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  title: string = "Welcome to Travelwings!";
  url_fb = "assets/icon/facebook.svg";
  url_google = "assets/icon/google-plus.svg";
  forgotPasswordUrl = "/pwa/v1/forgotpassword/getForgotPassword/";
  forGotUserForm: FormGroup;
  countryID = localStorage.getItem("countryId");
  countryCode = localStorage.getItem("countryCode");
  loggedIn;
  matcher = new MyErrorStateMatcher();
  passwordStatus;
  verificationExpireLinkmsg = 'Verification link is no longer available. Re-send a new verification link and try again.';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpservie: AuthServices,
    private location: Location,
    private snackBar: MatSnackBar,
    public navCtrl: NgxNavigationWithDataComponent,
    private profileControllerService: ProfileControllerService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private overlayService: OverlayService,
    private location_new: PlatformLocation,
    private ngZone: NgZone,
  ) {
    // console.log(navCtrl.get('changePassword'))
  }

  ngOnInit() {
  
 this.start();
    this.loggedIn = localStorage.getItem('isLoggedIn');
    console.log(this.loggedIn);
    this.isDataFromGuestLogin =JSON.parse(localStorage.getItem('getDataFromGuestLogin'))
    //console.log(this.isDataFromGuestLogin);

    this.passwordStatus = this.navCtrl.get('changePassword');
    if(this.passwordStatus != undefined){
      this.openResponsePopup(this.passwordStatus)
    }
    // console.log(this.passwordStatus)
    this.forGotUserForm = this.fb.group({
      forgotEmail: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/
          ),
          Validators.maxLength(45)
        ]
      ]
    });
  }

  ionViewWillEnter(){
    this.location_new.onPopState(() => {
      if(this.passwordStatus['statusMessage'] != ''){
        this.navCtrl.navigate("/login");
        this.passwordStatus =undefined;
      }
   
   });
  }
 


  get f() { 
    return this.forGotUserForm.controls;
  }
  goBack() {
    // let countryCode = localStorage.getItem('countryCode').toLowerCase();
    // let setLanguageSetting = 'en';
    this.router.navigate(['/login']);
  this.profileControllerService.sendCurrentUrlToComponent1(this.router.url)
  localStorage.removeItem('getDataFromGuestLogin');
  this.passwordStatus =undefined;
  }
  forgotUser() {
    this.submitted = true;
    if (!this.forGotUserForm.valid) {
      return;
    } else {
      this.presentLoading();
      this.httpservie
        .postData(environment.baseUrl+
          this.forgotPasswordUrl +
            this.forGotUserForm.get("forgotEmail").value +
            "/" +
            this.countryCode
        )
        .subscribe(res => {
          // console.log(environment.baseUrl);
          // console.log( this.forgotPasswordUrl);
          // console.log( this.forGotUserForm.get("forgotEmail").value);
          // console.log( this.countryCode);
          // console.log(res);
      if(res){
        this.closeLoading();
        let sendData ={
          response:res,
          isDataFromGuest:this.isDataFromGuestLogin,
          forgotEmail: this.forGotUserForm.get("forgotEmail").value
        }
        
        this.dialog.open(ForgotPasswordPopupComponent, {
          panelClass: "alert-password-change",
          backdropClass: "alert-password-back-drop",
          data:sendData,
          width:'100%',
          maxWidth:'95vw',
        });
      }
        });
    }
  }

  signup() {
    this.router.navigate(["/register"]);
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
      this.presentLoading();
      this.httpservie.getSociallogin(res).subscribe((response) => {
        if (response["statusCode"] == 0) {
          // console.log(response);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", response["sLoginKey"]);
          localStorage.setItem("loginemail", res["email"]);
          this.closeLoading();
          this.ngZone.run(() => {
            this.router.navigate(["myaccount/user-profile-form/myprofile"]);
          })
        } else {
          this.closeLoading();
        }
      });
    }
  }

  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      let data = {
        'accountType': 4,
        'email': res['email'],
        'firstName': res['firstName'],
        'imageUrl': res['photoUrl'],
        'lastName': res['lastName'],
        'middleName': res['middleName'] || 'string',


      };
      this.presentLoading();
      this.httpservie.getSociallogin(data).subscribe(response => {
        if(response){
          console.log(response);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem('token', response['sLoginKey']);
          localStorage.setItem('loginemail', res['email']);
          this.closeLoading();
          if(this.isDataFromGuestLogin == null){
            // this.router.navigate(["/view-profile-module"]);
            this.router.navigate(["myaccount/user-profile-form/myprofile"]);
          }else{
            this.router.navigate(['/traveller-details']);
            localStorage.removeItem('getDataFromGuestLogin');
          }
        }
       
      });
    });
  }

  guestLogindata:Subscription;
  isDataFromGuestLogin:any;
  // getdataFromGuestForgot(){
  //   this.guestLogindata = this.profileControllerService.getDataFromGuestLogin.subscribe(res=>{
  //     this.isDataFromGuestLogin = res;
  //     console.log(this.isDataFromGuestLogin)
  //   })
  // }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  openResponsePopup(response){
    const dialogRef = this.dialog.open(ShowYesNoComponent, {
      data: { 
        show_reset_password_res: true,
        response_reset_password: response
       },
      autoFocus: false,
      closeOnNavigation: true,
      width:'90%',
      maxWidth:'unset'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
