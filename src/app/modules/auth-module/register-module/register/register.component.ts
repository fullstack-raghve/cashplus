import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
// import { RegistrationValidator } from './register.validator';
import { GlobalService } from "src/app/services/global.service";
import { Register } from "./register.model";
import { AuthServices } from "src/app/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MustMatch } from "./register.validator";
import { Location } from "@angular/common";
import { MessageService } from "primeng/api";

import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from "angularx-social-login";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { Subscription } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { LoadingController } from "@ionic/angular";
import { OverlayService } from 'src/app/services/overlay.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
declare const gapi: any;
//import { MustMatch } from '../../../../../';
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  title: string = "Welcome to Travelwings!";
  url_fb = "assets/homePageIcons/fbIcon.png";
  url_google = "assets/homePageIcons/googleIcon.png";
  arr = [];
  char_limit_3_20 = ' should have minimum 3 and maximum 20 characters.'
  phn_limit_7_11 = 'should have minimum 7 and maximum 11 digit.';
  Char_max_length_20 = ' should have maximum 20 characters.'
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authServices: AuthServices,
    private _snackBar: MatSnackBar,
    private location: Location,
    private profileControllerService: ProfileControllerService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private loadingController: LoadingController,
    private overlayService: OverlayService,
    private ngZone: NgZone,
  ) {}
  regForm: FormGroup;
  submitted = true;

  get registration() {
    return this.regForm.controls;
  }
  isDataFromGuestLogin: any;
  ngOnInit() {
    this.start();
    this.isDataFromGuestLogin = JSON.parse(
      localStorage.getItem("getDataFromGuestLogin")
    );
    // console.log(this.isDataFromGuestLogin);
    
    this.regForm = this.formBuilder.group(
      {
        firstName: [
          "",
          RxwebValidators.compose({
            validators: [
              RxwebValidators.required(),
              RxwebValidators.pattern({
                expression: { alpha: /^[a-zA-Z ]*$/ },
                message: "Only alphabets are allowed.",
              }),
              RxwebValidators.maxLength({value:20, message:''}),
            ],
          }),
        ],
        lastName: [
          "",
          RxwebValidators.compose({
            validators: [
              RxwebValidators.required(),
              RxwebValidators.pattern({
                expression: { alpha: /^[a-zA-Z ]*$/ },
                message: "Only alphabets are allowed.",
              }),
              RxwebValidators.maxLength({value:20, message:''}),
            ],
          }),
        ],
        userAlias: [
          "",
          RxwebValidators.compose({
            validators: [
              RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { pattern: /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/ },
              message: "Please enter valid email",
            }),
            RxwebValidators.maxLength({value:45, message:''}),],
          }),
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,15}$/
            ),
          ],
        ],
        verifyPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ],
        ],
        checked: ["", Validators.required],
      },
      {
        validator: MustMatch("password", "verifyPassword"),
      }
    );
  }

  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  goBack() {
    this.regForm.reset();
    this.profileControllerService.sendCurrentUrlToComponent2(this.router.url);
    // this.location.back();
    if (this.isDataFromGuestLogin == null) {
      // this.router.navigate(["/"]);
      let countryCode = localStorage.getItem('countryCode').toLowerCase();
      let setLanguageSetting = 'en';
      this.router.navigate([countryCode + "/" + setLanguageSetting]);
    } else {
      this.router.navigate(["/confirm-flight"]);
      localStorage.removeItem("getDataFromGuestLogin");
    }
    localStorage.removeItem("getDataFromGuestLogin");
  }
  gologin() {
    this.router.navigate(["/login"]);
  }
  termcondition: boolean;
  registerUser() {
   
    let val = this.regForm.controls["checked"].value;
    // console.log(val);
    if (!val) {
      this.termcondition = true;
    } else {
      this.termcondition = false;
    }

    if (this.regForm.invalid) {
      this.submitted = true;
      this.markFormGroupTouched(this.regForm)
      return;
    }

    // console.log(this.regForm.value);
    let data = this.regForm.value;
    console.log(data);
    this.presentLoading();
    this.authServices.newRegistration(data).subscribe((dats) => {
      // console.log(dats);
      if (dats) {
        this.arr = dats["statusMessage"];
        let info = JSON.stringify(this.arr);
        let infoss: any = this.arr;
        // this.closeLoading();
        if (dats["statusMessage"] == "success") {
          
        this.closeLoading();
          // let snackBarRef1 = this._snackBar.open("Please Check your email and verify to continue registration", "", {
          //   duration: 4000,
          // });

          Swal.fire({
            text: "Please check your email and verify to continue registration.",
            customClass : {
            container:"swalForCOD"
            },
            imageUrl: 'assets/icon/success.png',
            confirmButtonText: 'OK'
            }).then((result) => {
            if(result.value == true) {
            console.log("Please Check your email and verify to continue registration");
            }
            })


          this.router.navigate(["/login"]);
          this.regForm.markAsUntouched();
          this.regForm.reset();
        } else if (dats["statusMessage"] == "User Alias Already Exist") {
          // let snackBarRef1 = this._snackBar.open("Email id is Already Exist", "", {
          //   duration: 4000,
          // });
          Swal.fire({
            text: "Email ID is already exist.",
            customClass : {
            container:"swalForCOD"
            },
            imageUrl: 'assets/icon/success.png',
            confirmButtonText: 'OK'
            }).then((result) => {
            if(result.value == true) {
            console.log("Email id is Already Exist");
            }
            })
          this.closeLoading();
        }
      } else {
        this.closeLoading();
      }
    });
  }

  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((res) => {
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
        if (response) {
          this.closeLoading();
          // console.log(response);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", response["sLoginKey"]);
          localStorage.setItem("loginemail", res["email"]);
          if (this.isDataFromGuestLogin == null) {
            this.router.navigate(["myaccount/user-profile-form/myprofile"]);
          } else {
            this.router.navigate(["/traveller-details"]);
          }
        }
      });
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

  signUpWithGoogle() {
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
          // this.loadprofile();
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


  clear() {
    this.messageService.clear();
    this.router.navigate(["/login"]);
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
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
