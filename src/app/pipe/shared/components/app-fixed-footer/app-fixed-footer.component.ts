import { Component, OnInit } from "@angular/core";
// import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
//import { SettingsComponent } from 'src/app/modules/settings-module/settings/settings.component';
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { AppSettingsComponent } from "../app-settings/app-settings.component";
import { Router } from "@angular/router";
import { AuthServices } from "src/app/services/auth.service";

@Component({
  selector: "app-fixed-footer",
  templateUrl: "./app-fixed-footer.component.html",
  styleUrls: ["./app-fixed-footer.component.scss"]
})
export class AppFixedFooterComponent implements OnInit {
  homeactive: boolean = false;
  trips: boolean = false;
  support: boolean = false;
  account: boolean = false;
  more: boolean = false;

  loginn: boolean;
  isLoggedIn: string;
  active_home;
  constructor(
    public router: Router,
    //  private bottomSheetRef: MatBottomSheetRef<AppSettingsComponent>,
    private bottomSheet: MatBottomSheet,
    private _authServices: AuthServices
  ) { }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");

    this.homeactive = true;
    this.loginn = this._authServices.loggedIn();
    // console.log("from app-fixed footer- " + this.loginn);
    let currentUrl = window.location.href.split("/");
   // console.log(currentUrl)
    if (currentUrl[currentUrl.length - 1] == "en") {
      this.active_home = true;
    } else {
      this.active_home = false;
    }
  }

  setButtonClose = false;
  openSettings() {
    this.more = true;
    this.setButtonClose = true;
    // this.bottomSheet.open(AppSettingsComponent);
    this.bottomSheet.open(AppSettingsComponent, {
      panelClass: "moresetting-login",
      backdropClass: "moresetting-login-backdrop",
      disableClose: false
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      this.setButtonClose = false;
    });
  }
  closePopup() {
    this.bottomSheet.dismiss();
    this.setButtonClose = false;
  }
  openSettingsNologin() {
    this.setButtonClose = true;
    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(
      AppSettingsComponent,
      {
        panelClass: "moresetting-nologin",
        backdropClass: "moresetting-nologin-backdrop",
        disableClose: false,
      }
    );
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      this.setButtonClose = false;
    });
  }

  home() {
    this.closePopup();
    // this.router.navigate(["/"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }
  login() {
    this.closePopup();
    this.account = true;
    if ((this.loginn = true)) {
      // this.router.navigate(["/view-profile-module"]);
      this.router.navigate(['myaccount/user-profile-form/myprofile']);

    } else {
      this.router.navigate(["/login"]);
    }
  }
  // login(){
  //   this.router.navigate(['/login']);
  // }

  tripsModule() {
    this.closePopup();
    this.trips = true;
    this.router.navigate(["/myaccount/user-profile-form/myprofile/trips"]);
  }
  supportModule() {
    this.closePopup();
    this.support = true;
    this.router.navigate(["/support-module"]);
  }
}
