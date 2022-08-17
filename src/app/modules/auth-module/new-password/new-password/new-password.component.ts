import { Subscriber } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AuthService } from "angularx-social-login";
import { AuthServices } from "src/app/services/auth.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ShowChangePasswordPopupComponent } from "../show-change-password-popup/show-change-password-popup.component";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import Swal from 'sweetalert2';
import { ShowYesNoComponent } from 'src/app/pipe/shared/components/show-yes-no/show-yes-no.component';
@Component({
  selector: "app-new-password",
  templateUrl: "./new-password.component.html",
  styleUrls: ["./new-password.component.scss"]
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  verifiedUser = false;
  getId;
  loading;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public navCtrl: NgxNavigationWithDataComponent,
  ) { }

  ngOnInit() {
    this.getURLParameter();
    this.createForm();
    console.log('password change')
  }

  getURLParameter() {
    this.getId = this.activatedRoute.snapshot.queryParams.id;
    console.log(this.getId);
    this.verifyPasswordCode(this.getId);

    if(this.getId){
      Swal.fire({
        text: "Your account has been verified and secured.",
        customClass : {
        container:"swalForCOD"
        },
        imageUrl: 'assets/images/secutity.png',
        confirmButtonText: 'Continue'
        }).then((result) => {
        if(result.value == true) {
      //  console.log(" Verification link has been sent to your email id.");
        }
        })
    }

  }

  verifyPasswordCode(passwordVerifyCode) {
    this.loading = true;
    if (passwordVerifyCode) {
      this.http
        .get(
          environment.baseUrl +
          "/pwa/v1/resetpassword/getVerified/" +
          passwordVerifyCode
        )
        .subscribe(
          res => {
            console.log(res);
            this.loading = false;
            if (res['statusMessage'] == 'success') {
              this.verifiedUser = true;
            } else {
              // this.openResponsePopup(res);
              this.navCtrl.navigate("/forgot-password", { changePassword: res });
            }
          },
          err => {
            console.log(err);
          }
        );
    }

  }

  openResponsePopup(response){
    const dialogRef = this.dialog.open(ShowYesNoComponent, {
      data: { 
        show_reset_password_res: true,
        response_reset_password: response
       },
      autoFocus: false,
      closeOnNavigation: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navCtrl.navigate("/forgot-password");
      }
    });
  }

  createForm() {
    this.newPasswordForm = this.formBuilder.group({
      // password: [
      //   "",
      //   RxwebValidators.compose({
      //     validators: [RxwebValidators.required()]

      //   })
      // ],
      password: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'New Password is required.'
            }),
            RxwebValidators.pattern({
              expression: { data: /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,15}$/ },
              message: "Password should be between 5 and 15 character & combination of one uppercase letter, one number!"
            })
          ]
        })
      ],
      confirmPassword: [
        "",
        [
          RxwebValidators.required({
            message:'Confirm Password is required.'
          }),
          RxwebValidators.compare({
            fieldName: "password",
            message: "Password and confirm password should be same."
          })
        ]
      ]
      // password: [
      //   "",
      //   [
      //     Validators.required,
      //     Validators.pattern(
      //       /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,15}$/
      //     ),
      //   ],
      // ],
      // confirmPassword: [
      //   "",
      //   [
      //     Validators.required,
      //     Validators.minLength(5),
      //     Validators.maxLength(15),
      //   ],
      // ],
    });
  }

  submit() {
    if (!this.newPasswordForm.valid) {
      this.markFormGroupTouched(this.newPasswordForm);
    } else {
      let reqbody = {
        "confirmPassword": this.newPasswordForm.get('confirmPassword').value,
        "newPassword": this.newPasswordForm.get('password').value,
        "token": this.getId
      }
      console.log(reqbody);

      this.http.post(environment.baseUrl + '/pwa/v1/resetpassword/changePassword', reqbody).subscribe(
        (res) => {
          console.log(res);
        }
      )

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      
      Swal.fire({
        text: "Your new password has been set successfully.",
        customClass : {
        container:"swalForCOD"
        },
        imageUrl: 'assets/icon/success.png',
        confirmButtonText: 'OK'
        }).then((result) => {
        if(result.value == true) {
          this.newPasswordForm.reset();
        console.log("Your new password has been set successfully.");
        }
        })


      this.router.navigate(["/login"]);

      // const dialogRef = this.dialog.open(ShowChangePasswordPopupComponent, {
      //   width: "300px",
      //   panelClass: "alert-password-change",
      //   backdropClass: "alert-password-back-drop"
      // });

      // dialogRef.afterClosed().subscribe(result => {
      //   console.log("The dialog was closed");
      //   this.newPasswordForm.reset();
      // });
    }
  }

  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  goBack() {
    // this.router.navigate(["/"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }
}
