import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AuthServices } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
})
export class AppSettingsComponent implements OnInit {
  islogin:boolean;
  userIsAuthenticated = true;
  private authListenerSubs: Subscription;
  isLoggedIn: string;
   constructor(private router:Router, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<AppSettingsComponent>, private _authService: AuthServices) { 
    this.bottomSheetRef.disableClose = false;
   }

  ngOnInit() {
///check login var --
this.isLoggedIn = localStorage.getItem("isLoggedIn");
//console.log(this.isLoggedIn);

  this.islogin =  this._authService.loggedIn().valueOf();
  //console.log(this.islogin);
  }

  
  settings(){
   this.router.navigate(['/settings-module']);
  this.bottomSheetRef.dismiss()
 }
 logoutuser(){
  // this._authService.logout();
   //this.router.navigate(['/']);
   this._authService.logout().subscribe(res=>{
     //console.log(res);
     if(res){
      localStorage.setItem('isLoggedIn', "false");
      localStorage.removeItem('token');
      localStorage.removeItem('loginemail');
      this.bottomSheetRef.dismiss();
      this.router.navigate(['/login'])
     }
   })
   

 }
 changePassword(){
   this.router.navigate(['/password-module']);
   this.bottomSheetRef.dismiss()
 }
  
 
 

 
}


