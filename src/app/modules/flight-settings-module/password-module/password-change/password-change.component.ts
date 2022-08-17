import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthServices } from "src/app/services/auth.service";
import { MatSnackBar } from "@angular/material";
import { MustMatch } from "src/app/modules/auth-module/register-module/register/register.validator";

@Component({
  selector: "app-password-change",
  templateUrl: "./password-change.component.html",
  styleUrls: ["./password-change.component.scss"],
})
export class PasswordChangeComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  arr = [];
  title = "Change Password";
  loginemail: string;
  passwordform: any;
  confirmPassword: any;
  currentPassword: any;
  newPassword: any;
  mssg: string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authServices: AuthServices,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    localStorage.removeItem("getDataFromGuestLogin");
    this.loginemail = localStorage.getItem("loginemail");
    // console.log(this.loginemail);

    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{5,15}$/
            ),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validator: MustMatch("newPassword", "confirmPassword"),
      }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
  backTo() {
    // this.router.navigate(["/"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }

  changePassword() {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      this.markFormGroupTouched(this.changePasswordForm);
      return;
    }
    this.passwordform = this.changePasswordForm.value;
    this.currentPassword = this.passwordform.currentPassword;
    this.newPassword = this.passwordform.newPassword;
    this.confirmPassword = this.passwordform.confirmPassword;


    if (this.newPassword != this.confirmPassword) {
      //alert('samemm')
      this.mssg = "New Password & Confirm Password not Matching!";

      this._snackBar.open(this.mssg, "", {
        duration: 3000,
        panelClass: ["warning"],
        verticalPosition: "top",
      });
      return;
    }

    if (this.currentPassword == this.confirmPassword) {
      //alert('samemm')
      this.mssg = "New Password & Current Password Cant be Same!";

      this._snackBar.open(this.mssg, "", {
        duration: 3000,
        panelClass: ["warning"],
        verticalPosition: "top",
      });
      return;
    }

    var reqbody = {
      currentPassword: this.currentPassword,
      confirmPassword: this.confirmPassword,
      newPassword: this.newPassword,
      userAlias: this.loginemail,
    };

    //    console.log(this.changePasswordForm.value);
    // let data = this.changePasswordForm.value;
    // console.log(data)

    this.authServices.changePassword(reqbody).subscribe((cp) => {
      this.arr = cp["statusMessage"];

      if (
        cp["statusMessage"] ==
        "User is not valid or new Password is same as Old Password"
      ) {
        let message = "Invalid Credentials/Password is same as Old Password";
        this._snackBar.open(message, "", {
          duration: 3000,
          panelClass: ["warning"],
          verticalPosition: "top",
        });
      }
      if (cp["statusMessage"] == "origDecPass is same as currentPassword") {
        let message = "Invalid Credentials";
        this._snackBar.open(message, "", {
          duration: 3000,
          panelClass: ["warning"],
          verticalPosition: "top",
        });
      }
      if (cp["statusMessage"] == "Password changed sucessfully") {
        let message = "Password changed Successfully";
        this._snackBar.open(message, "", {
          duration: 1000,
          panelClass: ["warning"],
          verticalPosition: "top",
        });
        this.router.navigate(["/login"]);
      }

      //let info = JSON.stringify(this.arr);

      // this._snackBar.open(info, '', {
      //    duration: 3000,
      //    panelClass: ['warning'],
      //    verticalPosition: 'top',

      // });
    });
  }
}
