import { Component, OnInit, Output, EventEmitter, Input, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthServices } from 'src/app/services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from "angularx-social-login";
import { environment } from 'src/environments/environment';
import { ForgotPasswordPopupComponent } from 'src/app/modules/auth-module/forgot-password-module/forgot-password-popup/forgot-password-popup.component';
import { OverlayService } from 'src/app/services/overlay.service';
declare const gapi: any;

@Component({
  selector: 'app-new-guest-forgot',
  templateUrl: './new-guest-forgot.component.html',
  styleUrls: ['./new-guest-forgot.component.scss'],
})
export class NewGuestForgotComponent implements OnInit {
  forgotUserForm: FormGroup;
  loggedIn;
  submitted = true;

  title: string = "Welcome to Travelwings!";
  @Output() requestPassword = new EventEmitter<any>();
  @Output() clickOnSignup = new EventEmitter<any>();

  @Input()  getSessionTimeOutValue: any;

  constructor(private spinner: NgxSpinnerService, private modalController: ModalController,
    private router: Router,
    private socialLogin: AuthService,
    private formBuilder: FormBuilder,
    private authServices: AuthServices,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,private ngZone: NgZone, private loadingController: LoadingController,  private overlayService: OverlayService) { }

  ngOnInit() {
    this.start();
    this.loggedIn = localStorage.getItem('isLoggedIn');
    this.addDivClass();
    // console.log('session time out',this.getSessionTimeOutValue)
   // this.loggedIn = localStorage.getItem('isLoggedIn');
    // console.log(this.loggedIn);

    this.forgotUserForm = this.formBuilder.group({
      userAlias: ['', [Validators.required, Validators.pattern(/^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/), Validators.maxLength(45)]]
    });
  }


  signUp() {
    this.removeDivClass();
    this.clickOnSignup.emit(true)
  }


  dismiss() {
      this.removeDivClass();
      this.removeZindexClass();
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  get f() { return this.forgotUserForm.controls; }

  // signInWithGoogle(): void {
  //   this.socialLogin.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
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
  //       this.presentLoading();

  //       this.authServices.getSociallogin(body).subscribe(response => {
  //         // console.log(response);
  //         if (response['statusCode'] == 0) {
  //           this.closeLoading();
  //           localStorage.setItem("isLoggedIn", "true");
  //           localStorage.setItem('token', response['sLoginKey']);
  //           localStorage.setItem('loginemail', res['email']);
         
            
  //           if(this.getSessionTimeOutValue == true){
  //             this.modalController.dismiss({
  //               dismissed: true
  //             });
  //           }else{
  //           this.modalController.dismiss({
  //             'dismissed': true
  //           });
  //             this.router.navigate(["/traveller-details"]);
  //           }
  //           this.removeZindexClass();
  //         } else {
  //           this.closeLoading();
  //         }
  //         this.removeDivClass();
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

    this.authServices.getSociallogin(res).subscribe(response => {
      // console.log(response);
      if (response['statusCode'] == 0) {
        this.closeLoading();
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('token', response['sLoginKey']);
        localStorage.setItem('loginemail', res['email']);
     
        
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
      } else {
        this.closeLoading();
      }
      this.removeDivClass();
    });
  }
}


  signInWithFB(): void {
    this.socialLogin.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
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
        this.presentLoading();

        this.authServices.getSociallogin(body).subscribe(response => {
          // console.log(response);
          if (response['statusCode'] == 0) {
            this.closeLoading();
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem('token', response['sLoginKey']);
            localStorage.setItem('loginemail', res['email']);
            this.removeDivClass();
            this.modalController.dismiss({
              'dismissed': true
            });
            if(this.getSessionTimeOutValue == true){
              this.modalController.dismiss({
                dismissed: true
              });
            }else{
              this.router.navigate(["/traveller-details"]);
            }
            this.removeZindexClass();
          } else {
            this.closeLoading();
          }
        });
      }
    });
  }

  forgotPasswordUrl = "/pwa/v1/forgotpassword/getForgotPassword/";
  countryID = localStorage.getItem("countryId");
  countryCode = localStorage.getItem("countryCode");
  isDataFromGuestLogin;
  submitRequest() {
    this.submitted = true;
    if (this.forgotUserForm.invalid) {
      this.markFormGroupTouched(this.forgotUserForm)
    }
    else {
      this.removeZindexClass();
      this.presentLoading();
      let reqBody = {
        'formValue': this.forgotUserForm.value
      }

      this.authServices
        .postData(environment.baseUrl +
          this.forgotPasswordUrl +
          this.forgotUserForm.get("userAlias").value +
          "/" +
          this.countryCode
        )
        .subscribe(res => {
          // console.log(res);
          if (res) {
            this.closeLoading();
            
            let sendData = {
              response: res,
              isDataFromGuest: 'true'
            }

            const dialogRef = this.dialog.open(ForgotPasswordPopupComponent, {
              panelClass: "alert-password-change",
              backdropClass: "alert-password-back-drop",
              data: sendData,
              width: '100%',
              maxWidth: '95vw',
            });

            dialogRef.afterClosed().subscribe(
              (res) => {
                // console.log(res)
                if(res['data'] == true){
                  this.removeDivClass();
                  this.requestPassword.emit(reqBody)
                }
               
              }
            )
          }
        });
    }

  }
  @ViewChild('guestSignUp') public div: HTMLElement;
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
  markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
