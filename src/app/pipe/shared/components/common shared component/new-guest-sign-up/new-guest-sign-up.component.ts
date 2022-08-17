import { Component, OnInit, Output, EventEmitter, ViewChild, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { AuthServices } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MustMatch } from 'src/app/modules/auth-module/register-module/register/register.validator';
import { ModalController, LoadingController } from '@ionic/angular';
import { OverlayService } from 'src/app/services/overlay.service';
import { environment } from 'src/environments/environment';
declare const gapi: any;


 

@Component({
  selector: 'app-new-guest-sign-up',
  templateUrl: './new-guest-sign-up.component.html',
  styleUrls: ['./new-guest-sign-up.component.scss'],
})
export class NewGuestSignUpComponent implements OnInit {
  @ViewChild('guestSignUp') public div: HTMLElement;
  title: string = "Welcome to Travelwings!";
  url_fb = "assets/homePageIcons/fbIcon.png";
  url_google = "assets/homePageIcons/googleIcon.png";
  arr = [];

@Output() clickOnSignUpButton = new EventEmitter<any>();
@Output() clickOnLoginButton = new EventEmitter<any>();
@Output() clickOnForgotpassword = new EventEmitter<any>();

@Input()  getSessionTimeOutValue: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authServices: AuthServices,
    private _snackBar: MatSnackBar,
    private modalController: ModalController,
    private spinner: NgxSpinnerService,
    private loadingController: LoadingController,
 private overlayService: OverlayService,
 private ngZone: NgZone,
  ) { }
  regForm: FormGroup;
  submitted = true;
  loggedIn;

  get registration() {
    return this.regForm.controls;
  }

  ngOnInit() {
    // console.log('session time out',this.getSessionTimeOutValue);
    this.start();
    this.addDivClass();
    this.resgisTrationForm();

    this.loggedIn = localStorage.getItem('isLoggedIn');
    // console.log(this.loggedIn);
    if(this.loggedIn == null)
    this.loggedIn = 'false'; 
    
  }

  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  dismiss() {
    this.removeDivClass();
    this.removeZindexClass();
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  resgisTrationForm(){
    this.regForm = this.formBuilder.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern("^[a-zA-Z ]*$")]],
        lastName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern("^[a-zA-Z ]*$")]],
        userAlias: ['', [Validators.required, Validators.pattern(/^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/), Validators.maxLength(45)]],
        password: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(15),Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,15}$/
        )]],
        verifyPassword: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
        checked: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "verifyPassword")
      }
    );
  }

  termcondition: boolean;
  registerUser() {
    this.submitted = true;
    let val = this.regForm.controls['checked'].value;
    // console.log(val);
    if (!val) {
      this.termcondition = true;
    } else {
      this.termcondition = false;

    }
    if (this.regForm.invalid) {
      return;
    }
    // console.log(this.regForm.value);
    let data = this.regForm.value;
    // console.log(data);
    this.removeZindexClass();
    this.presentLoading();
    this.authServices.newRegistration(data).subscribe(dats => {
      // console.log(dats);
      if (dats) {
        this.closeLoading();
        this.removeDivClass();
        this.arr = dats["statusMessage"];
        let info = JSON.stringify(this.arr);
        this._snackBar.open(info, "", {
          duration: 3000,
          panelClass: ["warning"],
          verticalPosition: "top"
        });
        this.clickOnSignUpButton.emit(true);
        
      } else {
         this.closeLoading();
      }

    });
  }


  // signInWithGoogle():void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
  //     if(res){
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
  //       this.presentLoading();
      
  //       this.authServices.getSociallogin(body).subscribe(response => {
  //         // console.log(response);
  //        if(response['statusCode'] == 0){
  //         this.closeLoading();
  //         localStorage.setItem("isLoggedIn", "true");
  //         localStorage.setItem('token', response['sLoginKey']);
  //         localStorage.setItem('loginemail', res['email']);
  //         this.removeDivClass();
  //         if(this.getSessionTimeOutValue == true){
  //           this.modalController.dismiss({
  //             dismissed: true
  //           });
  //         }else{
  //           this.modalController.dismiss({
  //             'dismissed': true
  //           });
  //           this.router.navigate(["/traveller-details"]);
  //         }
  //         this.removeZindexClass();
  //        }else{
  //         this.closeLoading();
  //        }
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
      if(response['statusCode'] == 0){
        this.closeLoading();
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('token', response['sLoginKey']);
        localStorage.setItem('loginemail', res['email']);
        this.removeDivClass();
        if(this.getSessionTimeOutValue == true){
          this.modalController.dismiss({
            dismissed: true
          });
        }else{
          this.modalController.dismiss({
            'dismissed': true
          });
          this.router.navigate(["/traveller-details"]);
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
        this.presentLoading();
      
        this.authServices.getSociallogin(body).subscribe(response => {
          // console.log(response);
         if(response['statusCode'] == 0){
          this.closeLoading();
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem('token', response['sLoginKey']);
          localStorage.setItem('loginemail', res['email']);
          this.removeDivClass();
          if(this.getSessionTimeOutValue == true){
            this.modalController.dismiss({
              dismissed: true
            });
          }else{
            this.modalController.dismiss({
              'dismissed': true
            });
            this.router.navigate(["/traveller-details"]);
          }
          this.removeZindexClass();
         }else{
          this.closeLoading();
         }
        });
      }
    });
  }

  login(){
    this.removeDivClass();
    this.clickOnLoginButton.emit(true)
  }
  forgotpassword(){
    this.removeDivClass();
    this.clickOnForgotpassword.emit(true)
  }

  removeDivClass(){
    this.div['nativeElement'].parentElement.parentElement.parentElement.classList.remove('guestSignUpLogin');
  }

  addDivClass(){
    this.div['nativeElement'].parentElement.parentElement.parentElement.classList.add('guestSignUpLogin');
    // console.log(this.div)
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
}
