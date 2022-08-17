import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FlightService } from 'src/app/services/flight.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';

@Component({
  selector: 'app-fare-details',
  templateUrl: './fare-details.component.html',
  styleUrls: ['./fare-details.component.scss'],
})
export class FareDetailsComponent {
  subscribe1: Subscription;
  farelist: any;
  triptype: string;
  totalfare: number;
  reutnrway: any;
  totalfaremulti: number;
  farelistmutli: any;
  subscribe2: Subscription;
  surchargeAmount: string;
  multicitycurrency: any;
  sheetdata: any;
  showsruchrge: boolean;
  ticketInfo: any;
  fareConfirmReqKeyLocal: string;
  selectedFlightOptionKey: string;
  allPassengers: any;
  oneway_tax: any;
  roundtrip_tax: any;
  multitex: any;
  fareSubscribe:Subscription;
  constructor(private bottomSheetRef: MatBottomSheetRef, 
    private flightService: FlightService,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef1: MatBottomSheetRef<FareDetailsComponent>
    ) {
      this.sheetdata = data;
     // console.log('sheetdata',this.sheetdata);
     if(this.sheetdata == 'eh' || this.sheetdata == 'bd' || this.sheetdata == 'cod' || this.sheetdata == 'mobilepaay' || this.sheetdata == 'qt' || this.sheetdata == 'ccd' || this.sheetdata == 'cyber'){
this.showsruchrge = false;
     }else{
      this.showsruchrge = true;
      this.surchargeAmount = this.sheetdata;
     }
     }

  ngOnInit() {
  //  console.log('load from faredetails oninit');

    //this.surchargeAmount = localStorage.getItem('surchargeAmount');
   // console.log('surchargeAmount', this.surchargeAmount)
    this.triptype = sessionStorage.getItem('tripType');
   // console.log(this.triptype);
   this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');
   this.selectedFlightOptionKey = sessionStorage.getItem("selectedFlightOptionKey");
   let passengersList = JSON.parse(sessionStorage.getItem("passengersList"));
    this.allPassengers = passengersList;

    this.getflightselected();
    this.getsingleflightmulti();
    this.updateFare();
    //this.fareCheck();
   // console.log('load from faredetails');
  }

  ionViewWillEnter() {
    this.triptype = sessionStorage.getItem('tripType');
  //  console.log(this.triptype);
    this.surchargeAmount = localStorage.getItem('surchargeAmount');
    //console.log('surchargeAmount', this.surchargeAmount)
    this.getflightselected();
    this.getsingleflightmulti();
 //   console.log('load from faredetails');
  }

  

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.bottomSheetRef.dismiss();
      }
    });
  }


  getflightselected() {
    this.subscribe1 = this.flightService.getflightdetails().subscribe(res => {
    //  console.log('selected flight detials -faredetails',res);
     // console.log(this.triptype)
      //if trip type is oneway

      if (this.triptype == "oneway") {
       // console.log('from fare details -- oneway')
        this.farelist = res;
        this.ticketInfo = this.farelist.flightFare.refundableInfo;

        this.ticketInfo == "S-REFUNDABLE" ? this.ticketInfo = 'REFUNDABLE' : this.ticketInfo;
        this.ticketInfo == "S-NON-REFUNDABLE" ? this.ticketInfo = "NON-REFUNDABLE" : this.ticketInfo;

        this.ticketInfo == "Gal-REFUNDABLE" ? this.ticketInfo = "REFUNDABLE" : this.ticketInfo;
        this.ticketInfo == "Gal-NON-REFUNDABLE" ? this.ticketInfo = "NON-REFUNDABLE" : this.ticketInfo;

        this.totalfare = this.farelist.flightFare.t3Price - this.farelist.flightFare.discountPrice;
        this.totalfare = this.totalfare - this.farelist.flightFare.totalTax;

      this.oneway_tax = this.farelist.flightFare.totalTax;
      //  console.log(this.totalfare);
      }


      //if trip type is retunway
      if (this.triptype == "returnway") {
        this.reutnrway = res;
this.ticketInfo = this.reutnrway.onwardFlightOption.flightFare.refundableInfo;

this.ticketInfo == "S-REFUNDABLE" ? this.ticketInfo = 'REFUNDABLE' : this.ticketInfo;
this.ticketInfo == "S-NON-REFUNDABLE" ? this.ticketInfo = "NON-REFUNDABLE" : this.ticketInfo;

this.ticketInfo == "Gal-REFUNDABLE" ? this.ticketInfo = "REFUNDABLE" : this.ticketInfo;
this.ticketInfo == "Gal-NON-REFUNDABLE" ? this.ticketInfo = "NON-REFUNDABLE" : this.ticketInfo;
         this.roundtrip_tax = this.reutnrway.totalTax;
      //  console.log('from fare details -- returnway')
        let afterdiscount = res.t3Price - res.discountPrice;
        this.totalfare = afterdiscount - res.totalTax;
       // console.log(this.totalfare);
      }
    })

  }


  getsingleflightmulti() {
    this.flightService
      .getselectedFlightmulti()
      .subscribe(res => {
        if (res) {
        //  console.log('selected multicity res',res);
          if (this.triptype == "multicity") {
            this.farelistmutli = res['onwardFlightOption'];
           
            this.ticketInfo = this.farelistmutli.flightFare.refundableInfo;
        
                    
this.ticketInfo == "S-REFUNDABLE" ? this.ticketInfo = 'REFUNDABLE' : this.ticketInfo;
this.ticketInfo == "S-NON-REFUNDABLE" ? this.ticketInfo = "NON-REFUNDABLE" : this.ticketInfo;

this.ticketInfo == "Gal-REFUNDABLE" ? this.ticketInfo = "REFUNDABLE" : this.ticketInfo;
this.ticketInfo == "Gal-NON-REFUNDABLE" ? this.ticketInfo = "NON-REFUNDABLE" : this.ticketInfo;


            
             this.multicitycurrency = this.farelistmutli.flightFare.currency
            this.totalfaremulti = this.farelistmutli.flightFare.t3Price - this.farelistmutli.flightFare.discountPrice;
            this.totalfaremulti = this.totalfaremulti - this.farelistmutli.flightFare.totalTax;
            //console.log(this.totalfaremulti);
           this.multitex = this.farelistmutli.flightFare.totalTax
          }

        } else {
        }
      });
  }

  updateFare(){
   this.fareSubscribe = this.flightService.getfareBreakup().subscribe(res=>{
      console.log('res from pg',res);
      if(res){
        if (this.triptype == "oneway"){
          this.totalfare = res['fare'];
          this.oneway_tax = res['texNfee']

       }
       if (this.triptype == "returnway"){
        this.totalfare = res['fare'];
        this.roundtrip_tax = res['texNfee']

     }
     if (this.triptype == "multicity"){
      this.totalfaremulti = res['fare'];
      this.multitex = res['texNfee']

   }
      }
     
    })
  }

  ngOnDestroy() {
    this.fareSubscribe.unsubscribe();
    this.subscribe1.unsubscribe();
    //this.subscribe2.unsubscribe();
  }

  dismiss() {
    this.bottomSheetRef.dismiss();

  }

 

  fareCheck() {

var reqbody = {
fareConfirmRequestKey: this.fareConfirmReqKeyLocal,
selectedFlightOptionKey: this.selectedFlightOptionKey,
passengerList:this.allPassengers
// branchId:this.branchId;
};

this.flightService.fareRecheck(reqbody).subscribe((res) => {
  //console.log('res fr>>>>>>>>>>>',  res);

if(res['statusMessage']==='success'){
  if (this.triptype == "oneway") {
    let resOnward = res['onwardFlightOption']
   
   let totalfare = resOnward.flightFare.t3Price - resOnward.flightFare.discountPrice;
   let oneway_fare = totalfare-resOnward.flightFare.totalTax;
   let oneway_tax = resOnward.flightFare.totalTax;

   ///console.log('Fare oneway on recheck>>>>>>>>>>>',  oneway_fare);
  // console.log('Taxes & Fees oneway on recheck>>>>>>>>>>>', this.oneway_tax);

   
  if(oneway_fare != this.totalfare || oneway_tax != this.oneway_tax){
     this.totalfare = oneway_fare;
     this.oneway_tax = oneway_tax;
    console.log('new fares')

  }else{
    console.log('old fares')
  }
  


  }
  if (this.triptype == "multicity") {
    let resOnward = res['onwardFlightOption']
   let displayfaremultirechk = resOnward.flightFare.totalBaseFare + resOnward.flightFare.totalTax + resOnward.flightFare.totalFees + resOnward.flightFare.markupPrice + resOnward.flightFare.serviceChargePrice - resOnward.flightFare.discountPrice;
    console.log('fare rechk fare multicity >>>>>>>>>>>', displayfaremultirechk)
  
    if(displayfaremultirechk){
      // if(this.beforeOCF_multicity != displayfaremultirechk){
      //   this.multiflightFare = displayfaremultirechk;
      //  }
    }
  

  }
  if (this.triptype == "returnway") {
 
    let response = res['roundTripFlightOption'];
    let roundtrip_tax = response.totalTax;
      console.log('roundtrip_tax -- returnway',roundtrip_tax)
      let afterdiscount = response.t3Price - response.discountPrice;
      let totalfare = afterdiscount - roundtrip_tax;
     // console.log(this.totalfare);
      console.log('roundtrip_totalfare -- returnway',totalfare)
 if(totalfare === this.totalfare || roundtrip_tax === this.roundtrip_tax){
  this.totalfare = totalfare-1;
  this.roundtrip_tax = roundtrip_tax-1;
console.log('fare updated')
 }else{

 }
  }
}else{
  console.log('invalid fare recheck')
}
// }
});
}

}
