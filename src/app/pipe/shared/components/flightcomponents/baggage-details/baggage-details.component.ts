import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-baggage-details',
  templateUrl: './baggage-details.component.html',
  styleUrls: ['./baggage-details.component.scss'],
})
export class BaggageDetailsComponent implements OnDestroy{
  selectedflight = [];
  selectedflightobj: any;
  selectedflightreturn = [];
  selectedflightobjreturn: any;
  subscribe: Subscription;
  subscribe1: Subscription;

  multiflight: any;
  cp: any;
  confirFlightPageURL: string;
  cabin_baggage = '5-7 KG'
  constructor(private router:Router,private flightService : FlightService) { }

  // ngOnInit() {
  //   this.getsingleflight();
  //   this.getsingleflightmulti();
  //   this.confirFlightPageURL = localStorage.getItem('confirFlightPageURL');

  // }
  ionViewWillEnter() {
    this.getsingleflight();
    this.getsingleflightmulti();
    this.confirFlightPageURL = sessionStorage.getItem('confirFlightPageURL');
  }
  backTo(){
   // this.router.navigate(['/confirm-flight']);
    this.router.navigate([this.confirFlightPageURL]);

  }
  getReponse = false;
  getsingleflight(){
    this.subscribe1 =  this.flightService.getselectedFlight().subscribe((res)=>{
      if(res){
        //console.log(res) 
        ///response -oneway start
        this.selectedflight = res['onwardFlightOption']
        this.selectedflightobj = res['onwardFlightOption']
  
        ///response --oneway end
        this.getReponse = true;
          ///response -return start
          this.selectedflightreturn = res['roundTripFlightOption']
          this.selectedflightobjreturn = res['roundTripFlightOption']
          //console.log(this.selectedflightobjreturn.returnFlightOption.flightlegs.length);
          ///response -return  end
      }
      else if (res == 'multicity') { }
      else {
        let countryCode = localStorage.getItem('countryCode').toLowerCase();
        //console.log(countryCode)
        let setLanguageSetting = 'en';
        this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
        this.getReponse = false;
        //console.log('page refresh', res);
      }
     

    })

  }

///////////multi
getsingleflightmulti(){

  this.subscribe = this.flightService.getselectedFlightmulti().subscribe((res)=>{
     if(res){
     //console.log(res) 
     this.multiflight =  res['onwardFlightOption']
         this.cp =res['currentPrice']


   }else{

   }
   })

 }

 ngOnDestroy(): void {
   //Called once, before the instance is destroyed.
   //Add 'implements OnDestroy' to the class.
   this.subscribe.unsubscribe();
   this.subscribe1.unsubscribe();

 }

}
