import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AuthServices } from 'src/app/services/auth.service';
import { OverlayService } from 'src/app/services/overlay.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email-verify-popup',
  templateUrl: './email-verify-popup.component.html',
  styleUrls: ['./email-verify-popup.component.scss'],
})
export class EmailVerifyPopupComponent implements OnInit {
  already_verified:any = false;
  user_verified:any = false;
  guestUserEmail: any;
  isguestuser: any;
  isLink_sent: boolean;
  istechnicalissue: boolean;
  expiredlink: any;
  constructor(private authServices : AuthServices,
    private overlayService: OverlayService,
    private router: Router,
    public dialogRef: MatDialogRef<EmailVerifyPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    console.log('EmailVerifyPopupComponent data',this.data);
    this.getResponse();
  }
  isLink_expired:boolean = false;
  getResponse(){
    if(this.data['verifyResponse']['statusMessage'] == "Already Verified"){
      //this.already_verified = true;
      this.dialogRef.close();

      this.popup2();
    }
    else if(this.data['verifyResponse']['statusMessage'] == 'success'){
      this.user_verified = true;
      this.dialogRef.close();

      this.popup4();
    } else if(this.data['verifyResponse']['statusMessage'] == 'Link is expired' || this.data['verifyResponse']['statusMessage'] == 'id is expired'){
      this.guestUserEmail = this.data['verifyResponse']['userAlias'];
      this.isguestuser = this.data['verifyResponse']['guestUser'];
      this.isLink_expired = true;
      this.expiredlink = this.data['verifyResponse']['statusMessage'];
      if(this.expiredlink == 'Link is expired'){
        this.dialogRef.close();
        this.popup1();
      }
      if(this.expiredlink == 'id is expired'){
        this.dialogRef.close();
        this.popup3();
      }
    }
    else if(this.data['verifyResponse']['statusMessage'] == 'Some Technical Error'){
     // this.guestUserEmail = this.data['verifyResponse']['userAlias'];
     // this.isguestuser = this.data['verifyResponse']['guestUser'];
      this.istechnicalissue = true;
    }
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
  closePopup(){
    this.dialogRef.close();
  }
  popup3(){
    localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
    Swal.fire({
      text: "Sorry! this link has been expired.",
      allowOutsideClick: false,
      customClass : {
      container:"swalForEXP"
      },
      //imageUrl: 'assets/icon/success.png',
      confirmButtonText: 'OK'
      }).then((result) => {
      if(result.value == true) {
        this.dialogRef.close();
       // this.closePopupnew();
     // console.log(" Verification link has been sent to your email id.");
      }
      }) 
  }

  popup1(){
    localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
    Swal.fire({
     
      title: 'Sorry! this link has been expired.',
      text: "Click continue to resend the verification link.",
      allowOutsideClick: false,
      customClass : {
      container:"swalForCOD3"
      },
      //imageUrl: 'assets/icon/success.png',
      confirmButtonText: 'Continue'
      }).then((result) => {
      if(result.value == true) {
        this.dialogRef.close();
        this.closePopupnew();
     // console.log(" Verification link has been sent to your email id.");
      }
      }) 
  }
  popup2(){
    localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');

    Swal.fire({
      text: " Your email address has already been verified.",
      allowOutsideClick: false,
      customClass : {
      container:"swalForCOD"
      },
      imageUrl: 'assets/icon/success.png',
      confirmButtonText: 'OK'
      }).then((result) => {
      if(result.value == true) {
        this.dialogRef.close();
     // console.log(" Verification link has been sent to your email id.");
      }
      }) 
  }
  popup4(){
    localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');

    Swal.fire({
      text: "Your account has been verified and secured.",
      customClass : {
      container:"swalForCOD"
      },
      imageUrl: 'assets/images/secutity.png',
      confirmButtonText: 'Continue'
      }).then((result) => {
      if(result.value == true) {
       /// this.router.navigate(["myaccount/user-profile-form/myprofile"]);

    //  console.log(" Verification link has been sent to your email id.");
      }
      })
  }

  closePopupnew(){
    //this.dialogRef.close();
    this.presentLoading();

    let countryCode = localStorage.getItem('countryCode')
    let data = {
      
        "countryCode": countryCode,
        "guestUser": this.isguestuser,
        "userAlias": this.guestUserEmail

      
    }
    console.log('resend link req body',data)

    this.authServices.resendVerifcationlink(data).subscribe((res)=>{
console.log('resend link res',res);
// if(res['statusMessage'] == 'success'){
  if(res['statusMessage'] == 'success'){

  this.dialogRef.close();
  this.closeLoading();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
 // this.isLink_sent = true;

 Swal.fire({
  text: "Verification link has been sent to your email id.",
  allowOutsideClick: false,
  customClass : {
  container:"swalForCOD"
  },
  imageUrl: 'assets/icon/success.png',
  confirmButtonText: 'OK'
  }).then((result) => {
  if(result.value == true) {
    this.closeLoading();

  console.log(" Verification link has been sent to your email id.");
  }
  })


//this.router.navigate(["/login"]);


}


if(res['statusMessage'] == 'Already Verified'){

  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');

  this.dialogRef.close();
 // this.isLink_sent = true;

 Swal.fire({
  text: "Your email address has already been verified.",
  allowOutsideClick: false,
  customClass : {
  container:"swalForCOD"
  },
  imageUrl: 'assets/icon/success.png',
  confirmButtonText: 'OK'
  }).then((result) => {
  if(result.value == true) {
    this.closeLoading();
   // this.router.navigate(["myaccount/user-profile-form/myprofile"]);

  console.log(" Your email address has already been verified.");
  }
  })


//this.router.navigate(["/login"]);


}
    })

  }
  OKK(){
    this.dialogRef.close();

  }
  ISSUE(){
    this.dialogRef.close();

  }

}
