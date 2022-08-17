import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { MatDialog } from '@angular/material';
import { EmailVerifyPopupComponent } from '../pipe/shared/components/email-verify-popup/email-verify-popup.component';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  getVerifyId:any;
  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient, private router: Router, public navCtrl: NgxNavigationWithDataComponent) { }

  ngOnInit() {
    this.getURLParameter();
  }

  getURLParameter() {
    this.getVerifyId= this.activatedRoute.snapshot.queryParams.id;
    console.log(this.getVerifyId);
    this.checkVerifyLink(this.getVerifyId)
  }

chkResponseVerify;
  checkVerifyLink(verifiedLink){
    let requestUrl = `${environment.baseUrl}/pwa/v1/signup/linkVerifier/${verifiedLink}`;
    console.log(requestUrl)
    this.http.get(requestUrl).subscribe(
      (res)=>{
        console.log('verify email response',res);
        localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
        this.chkResponseVerify = res;
        let isGuestUser = res['guestUser'];
        if(isGuestUser){
          let parms = res['resetPassLink'];
          let statusmssg =  res['statusMessage'];
          if(statusmssg == "Link is expired"){
            this.navCtrl.navigate("/login", { verifyEmail: res });

          }else{
            this.router.navigate(['/resetpassword'], { queryParams: { id: `${parms}` } });

          }

        }else{
          this.navCtrl.navigate("/login", { verifyEmail: res });

        }
        // this.openPopupVerify();
      }
    )
  }
openPopupVerify(){
  const dialogRef = this.dialog.open(EmailVerifyPopupComponent, {
    data: { verifyResponse: this.chkResponseVerify },
    autoFocus: false,
    closeOnNavigation: true,
    disableClose: true
  });
}

}
