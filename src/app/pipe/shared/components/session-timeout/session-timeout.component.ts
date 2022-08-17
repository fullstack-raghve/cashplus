import { Component, OnInit, Inject } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { FlightService } from 'src/app/services/flight.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss'],
})
export class SessionTimeoutComponent implements OnInit {
  isAffBooking: string;

  constructor( public dialogRef: MatDialogRef<SessionTimeoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private globalService: GlobalService,
    private flightService: FlightService,private router: Router, private overlayService: OverlayService, private cookieService: CookieService,) { }

  ngOnInit() {
   this.isAffBooking =  sessionStorage.getItem('isAffBooking');
console.log('isAffBooking',this.isAffBooking)
  }

  getFareConfirmReq:Subscription;
  getFareConfirmRequestBody(){
       this.getFareConfirmReq =  this.globalService.getFareConfirmRequestBody.subscribe(
      (res)=>{
        console.log('fare recall reqbody',res);
        this.checkForFare(res)
      }
    )
  }
  backToHome(){
  
    // sessionStorage.removeItem('booking-type');
    // sessionStorage.removeItem('isAffBooking');

        let setLanguageSetting = 'en';
        let currentCountryName = localStorage.getItem('currentCountryName')
        let selectedCountryCode = localStorage.getItem('selectedCountryCode');
      
      if(selectedCountryCode){
        let x = selectedCountryCode.toLowerCase();
        let a = x + '/' + setLanguageSetting;
          window.location.replace(a);
          this.dialogRef.close();

      
      }else{
        let y = currentCountryName.toLowerCase();
        let b = y + '/' + setLanguageSetting;
        window.location.replace(b);
        this.dialogRef.close();

      }
      
        sessionStorage.removeItem('booking-type');
        sessionStorage.removeItem('isAffBooking');
      
      
    

  }

  searchPageURL;
  backToSearchresult(){
    this.searchPageURL = localStorage.getItem('searchPageURL');
    this.router.navigate([this.searchPageURL]);
    this.dialogRef.close();
    // this.getFareConfirmReq.unsubscribe();
  }
  tripType;

  checkForFare(res){
    this.tripType = sessionStorage.getItem('tripType');
    this.overlayService.showLoader();
    this.flightService.fareConfirmapi(res).subscribe(res => {
      if(res){
        console.log('after getting response fare recall',res)
        this.overlayService.hideLoader();
        if(this.tripType == "returnway"){
          if(res['roundTripFlightOption'] == null){
            this.redirectToWidgetPage();
            return;
          }
        }
        if(this.tripType == "oneway" || this.tripType == "multicity"){
          if(res['onwardFlightOption'] == null){
            this.redirectToWidgetPage();
            return;
          }
        }
        
        if(res && res['roundTripFlightOption'] && res['roundTripFlightOption']['lccflight']){
          this.IsLccFlight = res && res['roundTripFlightOption']['lccflight'] ? res['roundTripFlightOption']['lccflight'] : false;
        }
        else if(res && res['onwardFlightOption'] && res['onwardFlightOption']['lccflight']){
          this.IsLccFlight = res && res['onwardFlightOption']['lccflight'] ? res['onwardFlightOption']['lccflight'] : false;
        }
        this.setNewSessionTimer();
        this.dialogRef.close(res);
        this.getFareConfirmReq.unsubscribe();
      }
    })
  }

  redirectToWidgetPage(){
    let countryCodedd = localStorage.getItem('countryCode')
    let countryCode = countryCodedd && countryCodedd.toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
    this.dialogRef.close();
  }

  isTimerCookie: any;
  sessionTime = 15;
  IsLccFlight;
  setNewSessionTimer() {
    console.log(this.IsLccFlight)
    // let sessionTimeFlight = this.IsLccFlight ? 10 : 15;
    let sessionTimeFlight = this.sessionTime;
    console.log('session timer', sessionTimeFlight)
      this.cookieService.delete('timerStart')
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + sessionTimeFlight);
      this.cookieService.set('timerStart', 'true', dateNow, '', '', false, 'Lax');
      console.log('set new session')
  }


  

}
