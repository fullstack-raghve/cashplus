import { Injectable, ChangeDetectorRef } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServices } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  loginstatus: any;
  //localitem: string;
///guard -code
  constructor(private _authService: AuthServices,
    private _router: Router) { 
     // this.localitem = localStorage.getItem('token')
     }


    canActivate(): boolean {

      this.loginstatus = this._authService.loggedIn1();
// console.log('login status is ',this.loginstatus);

      if (this.loginstatus == 'true') {
        // console.log('response from authguard if ',this.loginstatus);
        return true
      } else {
        // console.log('response from authguard else',this.loginstatus);   
      this._router.navigate(['/login'])
        return false
      }
    }

}
