import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-fare-rules',
  templateUrl: './fare-rules.component.html',
  styleUrls: ['./fare-rules.component.scss'],
})
export class FareRulesComponent implements OnInit,OnDestroy {

  selectedflightarray = [];
  selectedflightobj: any;
  selectedflightreturn =[];
  selectedflightobjreturn: any;
  subscribe: any;
  subscribe1: any;
  multiflight: any;
  cp: any;
  branchCode: string;
  branchCurrencyCode: string;
  branchId: string;
  groupId: string;
  searchKey: string;
  countryId: string;
  countryCode: string;
  tripType: string;
  flightOptionKey: string;
  serviceVendor: string;
  lccRuleDescription: any;
  fareRuleResponseBean = [];
  Object = Object;
  loading =  true;
  confirFlightPageURL: string;
  isRefundableTicket;
  bookingtype: string;
  isAffBooking: string;
  flightBookingRequestBean: any;
  headingWiseList: any;
  constructor(private router:Router,private flightService : FlightService) { }
  ngOnInit() {
  this.isRefundableTicket = sessionStorage.getItem('isRefundableTicket')
    this.confirFlightPageURL = sessionStorage.getItem('confirFlightPageURL');
    this.branchCode = localStorage.getItem('branchCode');
   // //console.log(this.branchCode);
    this.branchCurrencyCode = localStorage.getItem('branchCurrencyCode');
   // //console.log(this.branchCurrencyCode);
    this.isAffBooking = sessionStorage.getItem('isAffBooking');

    this.branchId = localStorage.getItem('branchId');
    this.groupId = localStorage.getItem('groupId');
    this.searchKey = sessionStorage.getItem('searchKey');
    this.countryId = localStorage.getItem('countryId');
    this.countryCode = localStorage.getItem('countryCode');
    this.tripType = sessionStorage.getItem('tripType');
    this.flightOptionKey = sessionStorage.getItem('flightOptionKey');
    this.serviceVendor = sessionStorage.getItem('serviceVendor');
    //console.log(this.serviceVendor);
    ////console.log('trip type is',this.tripType);
  //this.bookingtype =  sessionStorage.getItem('booking-type');



    this.getsingleflight();
    this.getsingleflightmulti();
    this.getFlightfarerules();

  }
  backTo(){

    this.router.navigate([this.confirFlightPageURL]);

  }
isFarerule:boolean;
  getFlightfarerules(){

var data = {
    "bookingType": this.isAffBooking =='true' ? 'affiliate':null,
    "branchId": this.branchId,
    "countryId": this.countryId,
    "fareType":  "MINI",
    "flightOptionKey": this.flightOptionKey,
    "flightSearchKey":  this.searchKey,
    "groupId": this.groupId,
    "noOfAdult": 1,
    "noOfChild": 0,
    "noOfInfant": 0,
    "tripType": this.tripType == "returnway" ?  "roundtrip" : this.tripType
  
}
    this.flightService.getFlightfarerule1cache(data).subscribe((res) =>{

this.loading = false
      this.lccRuleDescription =  res['lccRuleDescription'];
      this.headingWiseList =  res['headingWiseList'];
      this.fareRuleResponseBean = res['fareRuleResponseBean']
      this.flightBookingRequestBean = res['fareRuleResponseBean'] && res['fareRuleResponseBean']['flightBookingRequestBean']
      
      // if(!this.flightBookingRequestBean && !this.lccRuleDescription && (this.headingWiseList && this.headingWiseList.length<1)){
      if((this.isRefundableTicket == "null" || this.isRefundableTicket == null || !this.isRefundableTicket) && !this.flightBookingRequestBean && !this.lccRuleDescription && !this.headingWiseList){
        this.isFarerule = false;

      }else{
        this.isFarerule = true;

      }


    })
  }

///service --

///sevice vendor - amedus - mini(if in db), full(always)

getReponse = false;
  getsingleflight(){
   this.subscribe1 = this.flightService.getselectedFlight().subscribe((res)=>{
     if(res){
   
      this.getReponse = true;
      ///response -oneway start
      this.selectedflightarray = res['onwardFlightOption']
      this.selectedflightobj= res['onwardFlightOption']

      ///response --oneway end

            ///response -return start
            this.selectedflightreturn = res['roundTripFlightOption']
            this.selectedflightobjreturn = res['roundTripFlightOption']
            ///response -return  end
     }
     else if (res == 'multicity') { }
      else {
        let countryCode = localStorage.getItem('countryCode').toLowerCase();
        let setLanguageSetting = 'en';
        this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
        this.getReponse = false;
      }
     

    })

  }

  ///////////multi
getsingleflightmulti(){

  this.subscribe = this.flightService.getselectedFlightmulti().subscribe((res)=>{
     if(res){
     this.multiflight =  res['onwardFlightOption']
         this.cp =res['currentPrice']


   }else{

   }
   })

 }


 /////method to get selected flight from search result to similar flight page

 
 ngOnDestroy(): void {
   //Called once, before the instance is destroyed.
   //Add 'implements OnDestroy' to the class.
   this.subscribe.unsubscribe();
   this.subscribe1.unsubscribe();

 }

 farerule(){
  this.router.navigate(['/fare-rule'])

 }

}

