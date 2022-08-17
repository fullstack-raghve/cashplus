import { Component, OnInit, NgZone } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AuthServices } from "src/app/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import swal from "sweetalert2";
import * as $ from 'jquery';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from "angularx-social-login";

import { SnackBarComponent } from "src/app/pipe/shared/components/snack-bar/snack-bar.component";
import { LoadingController } from "@ionic/angular";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { take, mergeMap } from "rxjs/operators";
import { OverlayService } from 'src/app/services/overlay.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { EmailVerifyPopupComponent } from 'src/app/pipe/shared/components/email-verify-popup/email-verify-popup.component';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ForgotPasswordPopupComponent } from '../../forgot-password-module/forgot-password-popup/forgot-password-popup.component';
import { HttpClient, HttpParams } from '@angular/common/http';

// import "gapi.auth2";
// import { fromPromise } from 'rxjs/observable/fromPromise';

import { from as fromPromise, Observable } from 'rxjs';
declare const gapi: any;
export class ILogin {
  username: string;
  password: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = true;
  model: ILogin = { username: "admin", password: "admin123" };
  message: string;
  token: any;
  isAuthenticated: boolean;
  errorm: string = "";
  FB: any;
  user: SocialUser;
  loggedIn;
  loginemail: any;
  twitterRequestTokenKey: any;
  twitterInstanceKey: any;
  info: any;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private authServices: AuthServices,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private profileControllerService: ProfileControllerService,
    private overlayService: OverlayService,
    public navCtrl: NgxNavigationWithDataComponent,
    public dialog: MatDialog,
    private httpservie: AuthServices,
    private http: HttpClient,
    private ngZone: NgZone,
    private activatedRoute:ActivatedRoute
  ) { }


  isDataFromGuestLogin;
  ngOnInit() {
    this.start();
    console.log('login intialize');

    this.isDataFromGuestLogin = JSON.parse(
      localStorage.getItem("getDataFromGuestLogin")
    );

    this.loggedIn = localStorage.getItem("isLoggedIn");
    if (this.loggedIn == null) this.loggedIn = "false";
    // { pattern: /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/ },
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Validators.pattern(emailregex)
    this.loginForm = this.formBuilder.group({
      userAlias: ["", [Validators.required, Validators.pattern(/^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/), Validators.maxLength(45)]],
      password: ["", [Validators.required, Validators.maxLength(30)]],
    });

    this.getVerifyResponse();
    this.getTwparams();
  }
  
  getVerifyResponseData;
  getVerifyResponse() {
    this.getVerifyResponseData = this.navCtrl.get('verifyEmail');
    console.log(this.getVerifyResponseData)
    if (this.getVerifyResponseData != undefined) {
      this.openPopupVerify();
    }

  }

  getTwparams(){
  // let
   let qp1 = this.activatedRoute.snapshot.queryParamMap.get('oauth_token');
console.log('qp1>>>',qp1);
let qp2 = this.activatedRoute.snapshot.queryParamMap.get('oauth_verifier');
console.log('qp2>>>',qp2);
if(qp2){
  this.twtoken(qp2);
}
  }

  openPopupVerify() {
    this.dialog.open(EmailVerifyPopupComponent, {
      data: { verifyResponse: this.getVerifyResponseData }
    });
  }

  ionViewWillEnter() {
    this.loginForm = this.formBuilder.group({
      userAlias: ["", [Validators.required, Validators.pattern(/^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/), Validators.maxLength(45)]],
      password: ["", [Validators.required, Validators.maxLength(30)]],
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

  twlogin(){
    localStorage.removeItem('twitterInstanceKey');
    localStorage.removeItem('twitterRequestTokenKey');
    localStorage.removeItem('info');

    console.log('twitter login');
    this.authServices.getTwitterAuthUrl().subscribe(res=>{
      console.log('twitter res>>>',res);
      this.info = res['status']
      let authenticationURL =  res['authenticationURL'];
      this.twitterInstanceKey  = res['twitterInstanceKey'];
      this.twitterRequestTokenKey = res['twitterRequestTokenKey'];
      localStorage.setItem('twitterInstanceKey',this.twitterInstanceKey);
      localStorage.setItem('twitterRequestTokenKey',this.twitterRequestTokenKey);
      localStorage.setItem('info',this.info);

      if(authenticationURL){
      //  this.router.navigate(['authenticationURL']);
      window.open(authenticationURL);
     /// this.twtoken();
      }

    })
  }

  twtoken(oauth_verifier){
   
   let twitterInstanceKey =  localStorage.getItem('twitterInstanceKey');
   let twitterRequestTokenKey =  localStorage.getItem('twitterRequestTokenKey');
   let info =  localStorage.getItem('info');


    let data = 
      {
        "info": info,
        "oauth_verifier": oauth_verifier,
        "twitterInstanceKey": twitterInstanceKey,
        "twitterRequestTokenKey": twitterRequestTokenKey
      }
      console.log('oauth_verifier req body',data);

    this.authServices.twitteroauthcallback(data).subscribe(res=>{
console.log('oauth_verifier res',res);
if(res != 'success'){
//alert('not verified');

swal.fire(
  // "Can't proceed with selected flight",
  "  Dear User your account is not verified by twitter so please login through travel wings account or any other social login.",
  //"error"
);
//this.router.navigate([this.searchPageURL]);

}
    })
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
      this.authServices.getSociallogin(res).subscribe((response) => {
        if (response["statusCode"] == 0) {
          // console.log(response);
            localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", response["sLoginKey"]);
          localStorage.setItem("loginemail", res["email"]);
          sessionStorage.setItem("loginemail", res["email"]);

          this.loadprofile();
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
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((res) => {
      if (res) {
        let data = {
          accountType: 4,
          email: res["email"],
          firstName: res["firstName"],
          imageUrl: res["photoUrl"],
          lastName: res["lastName"],
          middleName: res["middleName"] || "string",
        };
        this.presentLoading();
        this.authServices.getSociallogin(data).subscribe((response) => {
          // console.log(response);
          if (response["statusCode"] == 0) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", response["sLoginKey"]);
            localStorage.setItem("loginemail", res["email"]);
            sessionStorage.setItem("loginemail", res["email"]);

            this.loadprofile();
            this.closeLoading();
            this.router.navigate(["myaccount/user-profile-form/myprofile"]);

            //  this.profileControllerService.sendIfProfileUpdate(true);
            //  this.profileControllerService.sendCurrentProfileUSerDetails('');
          } else {
            this.closeLoading();
          }
        });
      }
    });
  }

  signOut() {
    this.authServices.logout().subscribe((res) => {
      // console.log(res);
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("token");
      //  this.loggedIn = false;
    });
    // this.router.navigate(["/"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }

  signUp() {
    this.router.navigate(["/register"]);
  }

  getErrorEmail() {
    return this.loginForm.get("userAlias").hasError("required")
      ? "Email ID is required "
      : this.loginForm.get("userAlias").hasError("pattern")
        ? "Not a valid Email ID"
        : this.loginForm.get("userAlias").hasError("alreadyInUse")
          ? "This Email ID is already in use"
          : this.loginForm.get("userAlias").hasError("maxLength")
            ? 'Email id should have maximum 45 characters.'
            : '';
  }
  // maxLength
  // Email id should have maximum 45 characters.
  get f() {
    return this.loginForm.controls;
  }

  login() {
    // console.log(this.loginForm.value);

    let logindetails = this.loginForm.value;

    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm)
    } else {
      this.loginemail = this.f.userAlias.value;
      let email = this.f.userAlias.value;
      let password = this.f.password.value;
      let newlogin = {
        password: password,
        userAlias: email,
        userType: "registereduser",
      };
      this.presentLoading();
      this.authServices.loginuser(newlogin).subscribe((res) => {
        if (res) {
          console.log(res);
          this.closeLoading();
          let login1 = res["statusMessage"];
          let token = res["loginKey"];
          this.token = token;
          var tokny = token;
          let forgotPasswordUrl = "/pwa/v1/forgotpassword/getForgotPassword/";
          let countryCode = localStorage.getItem("countryCode");
          let localtoken = localStorage.setItem("token", token);

          if (login1 == "User is not varified") {
            // console.log(this.f.userAlias.value)
            this.httpservie
              .postData(environment.baseUrl +
                forgotPasswordUrl +
                this.f.userAlias.value +
                "/" +
                countryCode
              )
              .subscribe(res => {
                //console.log(res);
                if (res) {
                  this.closeLoading();
                  // console.log(email);
                  let sendData = {
                    response: res,
                    isDataFromGuest: this.isDataFromGuestLogin,
                    forgotEmail: this.f.userAlias.value,
                  }
                  this.dialog.open(ForgotPasswordPopupComponent, {
                    panelClass: "alert-password-change",
                    backdropClass: "alert-password-back-drop",
                    data: sendData,
                    width: '100%',
                    maxWidth: '95vw',
                  });
                }
              })
          }
          else if (login1 == "Entered wrong password too many times! Account is currently locked") {
            Swal.fire({
              text: "Your password is locked. Please contact customer service.",
              allowOutsideClick: false,
              customClass: {
                container: "swalForCOD"
              },
              imageUrl: 'assets/icon/Lock.png',
              confirmButtonText: 'OK'
            }).then((result) => {
              console.log(result.value == true);
              if (result.value == true) {
                console.log("locked Account")
              }
            })
          }
          else if (login1 == "user is not of registered Type") {
            console.log(login1);
            let snackBarRef1 = this.snackBar.open("You are not registered.Please Sign Up!", "", {
              duration: 1000,
            });
          }
          else if (login1 != "success") {
            let snackBarRef1 = this.snackBar.open("Invalid Credentials!", "", {
              duration: 1000,
            });
          }
          else if (this.token != null) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loginemail", this.loginemail);
            sessionStorage.setItem("loginemail", this.loginemail);

            this.isAuthenticated = true;
            // console.log(this.isAuthenticated);
            localStorage.setItem("token", token);

           //webengage
           var s = document.createElement("script");
           s.type = "text/javascript";
           s.src = "assets/js/webEngage.js";
           s.id = '_webengage_script_tag';
           $("head").append(s);
           webengage.user.login(3095);
           webengage.user.setAttribute({   
             "we_first_name" : "sunakshi",
             "we_last_name"  : "singh",
             "we_email" : "sunakshi.singh@techtreeit.com",
             "we_phone" : 9999999990,
             "currency" : "AED",
             "tw_country"    :"ENGLISH",
             "tw_language"   : "IN",
               });
           //---------------------------------
            this.loadprofile();
            this.router.navigate(["myaccount/user-profile-form/myprofile"]);

          }
          else {
            this.isAuthenticated = false;
            this.closeLoading();
            this.router.navigate(["/login"]);
          }
        }
      });

      if (((email = ""), (password = ""))) {
        this.closeLoading();
        let snackBarRef1 = this.snackBar.open("Logged in Succefully", "", {
          duration: 1000,
        });
      }
    }
  }

  forgotpassword() {
    this.router.navigate(["/forgot-password"]);
  }
  goBack() {
    if (this.isDataFromGuestLogin == null) {
      // this.router.navigate(["/"]);
      let countryCode = localStorage.getItem('countryCode').toLowerCase();
      let setLanguageSetting = 'en';
      this.router.navigate([countryCode + "/" + setLanguageSetting]);
    } else {
      this.router.navigate(["/confirm-flight"]);
      localStorage.removeItem("getDataFromGuestLogin");
    }
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  loadprofile() {
    this.loginemail = localStorage.getItem("loginemail");
    this.profileControllerService
      .getAllProfile(this.loginemail)
      .subscribe((profile) => {
        // if(profile['status'] == 0 && profile['statusMessage'] == 'success'){
        //   // this.profileControllerService.sendCurrentProfileUSerDetails(profile);
        //   // this.profileControllerService.sendIfProfileUpdate(false);
        // }
      });
  }
  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}

  // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
    //   console.log(res)
    // if (res) {
    //   const body = {
    // accountType: 3,
    // email: res["email"],
    // firstName: res["firstName"],
    // imageUrl: res["photoUrl"],
    // lastName: res["lastName"],
    // middleName: res["middleName"] || "string",
    //   };
    //   this.presentLoading();
    //   this.authServices.getSociallogin(body).subscribe((response) => {
    //     if (response["statusCode"] == 0) {
    //       // console.log(response);
    //       localStorage.setItem("isLoggedIn", "true");
    //       localStorage.setItem("token", response["sLoginKey"]);
    //       localStorage.setItem("loginemail", res["email"]);
    //       this.loadprofile();
    //       // setTimeout(() => {
    //         this.closeLoading();
    //         this.router.navigate(["myaccount/user-profile-form/myprofile"]);
    //       // }, 500);
    //       //  this.profileControllerService.sendIfProfileUpdate(true);
    //       //  this.profileControllerService.sendCurrentProfileUSerDetails('');
    //     } else {
    //       this.closeLoading();
    //     }
    //   });
    // }
    // });
