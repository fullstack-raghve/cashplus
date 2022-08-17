import { Component, OnInit, KeyValueDiffers } from '@angular/core';
import { Router } from '@angular/router';
import { HomeModuleModule } from '../../home-module/home-module.module';
import { ServiceUrl } from 'src/app/constants/serviceUrl';
import 'rxjs/add/operator/map';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthServices } from 'src/app/services/auth.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})

// export class ILogin {
//   username: string;
//   password: string;
// }

export class AccountComponent implements OnInit {
  loginForm: FormGroup;
  submitted = true;
 //  model: ILogin = { username: "admin", password: "admin123" };
  message: string;
  token: any;

  title: string = "Welcome to Travelwings!"
  url_fb = "assets/icon/facebook.svg";
  url_google = "assets/icon/google-plus.svg";
  constructor(private router: Router, private _snackBar: MatSnackBar,
    private authServices: AuthServices, private serviceUrl: ServiceUrl,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      // username: ['', [Validators.required, Validators.minLength(4),
      // Validators.maxLength(20), Validators.pattern('[a-zA-Z]+')]],
      userAlias: ['', Validators.required],
      password: ['', Validators.required]
    });

  }


  //   loginUser() {
  //    // http://203.122.41.147:8080/pwa/oauth/token
  //    // const url = 'http://localhost:9090/oauth/token';
  //     //const url = 'http://203.122.41.147:8080/pwa/oauth/token';

  //     const url = 'http://203.122.41.147:8080/pwa/oauth/token';



  //     this.submitted = true;
  //     alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
  //     this.router.navigate(['/view-profile-module'])

  //     var body = "grant_type=password&username=enduser&password=password";

  // return this.http.post(url, body, {
  //   headers: new HttpHeaders({
  //     Authorization: "Basic +token",
  //     "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
  //   })
  // });
  //     // stop here if form is invalid
  //     //if (this.loginForm.invalid) {
  //       //return;
  //     //}


  //   }
  get f() { return this.loginForm.controls; }
 // login(username, password) {

    // const headers = {
    //   'Authorization': 'Basic ' + btoa(':'),
    //   'Content-type': 'application/x-www-form-urlencoded'
    // }
    // const bodyreq = {
    //   'username': 'enduser',
    //   'password': 'password',
    //   'grant_type': 'password'

    // }
 //   console.log(this.loginForm.value)
  //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
 //   this.router.navigate(['/view-profile-module'])
//  }
login() {
  console.log(this.loginForm.value);
   
  let logindetails = this.loginForm.value;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      alert('Invalid Credential')
        return;
    }
   let  email = this.f.userAlias.value;
   let  password = this.f.password.value;
    let newlogin = {
      "password": password,
      "userAlias": email
     }

    this.authServices.loginuser(newlogin);
    }
  goBack() {
    // this.router.navigate(['/']);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
let setLanguageSetting = 'en';
this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }

  //validation code if fields are empty
  openSnackBar(username: string, password: string) {
    let message2 = username;
    let action2 = password;
    // console.log(message2);
    // console.log(action2)
    if(message2='', action2!=""){
      let snackBarRef1 = this._snackBar.open('Logged in Succefully','',{
        duration:1000,
      });
    }
  //  else if (message2 == '') {
  //     let snackBarRef1 = this._snackBar.open('Please Enter user name', '', {
  //       duration: 1000
  //     });
  //   } else if (action2 == '') {
  //     let snackBarRef1 = this._snackBar.open('Please Enter Password', '', {
  //       duration: 1000
  //     });
  //   }
 

  }
  forgotpassword(){
this.router.navigate(['/forgot-password'])
  }

  signUp(){
    this.router.navigate(['/register'])
  }


}