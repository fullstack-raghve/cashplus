import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password-popup',
  templateUrl: './forgot-password-popup.component.html',
  styleUrls: ['./forgot-password-popup.component.scss'],
})
export class ForgotPasswordPopupComponent implements OnInit {
  resetPara = '';
  invalidEmail:boolean=true;
  dataRes;
  getAlldata;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ForgotPasswordPopupComponent>, private router: Router, 
    private profileControllerService: ProfileControllerService, private http: HttpClient) { }

  ngOnInit() {
    this.dataRes = this.data
    console.log(this.dataRes);
    this.getResponsedata();
  }
isValidEmailRegistered = false;
  getResponsedata(){
    if(this.dataRes['response']['statusMessage']== 'Password Reset Link Send Successfully'){
      this.resetPara = 'Password reset link is successfully send to your registered email ID';
      this.invalidEmail = true;
      this.isValidEmailRegistered = false;
    }else if(this.dataRes['response']['statusMessage'] == 'User Not Exist'){
       this.resetPara = "Invalid email ID";
       this.invalidEmail = false;
       this.isValidEmailRegistered = false;
    }else if(this.dataRes['response']['statusMessage'] == 'Registered email is not verfied'){
      this.notvalidEmail = true;
      this.isValidEmailRegistered = true;
    }
  }
  closePopup() {
    if(this.dataRes['response']['statusCode'] == 0 && this.dataRes['isDataFromGuest'] != null){
      this.dialogRef.close({
        data:true
      });

    }
    else if(this.dataRes['response']['statusCode'] == 1 && this.dataRes['isDataFromGuest'] != null){
      this.dialogRef.close({
        data:false
      });

    }
    else if(this.dataRes['response']['statusCode'] == 0 && this.dataRes['isDataFromGuest'] == null){
      this.router.navigate(["/login"]);
      this.dialogRef.close();
    }else{
      this.dialogRef.close();
    }
  }
  notvalidEmail = false;
  isSendVerifyLink = false;
  emailVrificationmsg = false;
  sendVerificationLink(){
    this.isSendVerifyLink = true;
    let forgotEmail = this.data['forgotEmail']
    let verifiedUrl = `${environment.baseUrl}/pwa/v1/signup/emailVerification`;
    let reqBody = {
      "countryCode": "",
      "firstName": "",
      "lastName": "",
      "password": "",
      "userAlias": forgotEmail,
      "verifyPassword": ""
    }
    this.http.post(verifiedUrl, reqBody).subscribe(
      (res)=>{
        if(res){
          this.isSendVerifyLink = false;
          this.emailVrificationmsg = true;
        }
        console.log(res)
      }
    )
  }

}
