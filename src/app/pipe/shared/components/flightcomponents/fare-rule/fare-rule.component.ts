import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { Location } from '@angular/common';
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-fare-rule',
  templateUrl: './fare-rule.component.html',
  styleUrls: ['./fare-rule.component.scss'],
})
export class FareRuleComponent implements OnInit {
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
  fareRuleResponseBean: any;
  loading = true;
  confirFlightPageURL: string;
  bookingtype: string;
  isAffBooking: string;
  infants: any;
  children: any;
  adult: any;
  adultdefault: any;
  travSub: Subscription;

  constructor(private router: Router,
private sendTravelerData: SendTravllerDataService,
    private location: Location,private flightService : FlightService) { }

  ngOnInit() {
    this.confirFlightPageURL = sessionStorage.getItem('confirFlightPageURL');

    this.branchCode = localStorage.getItem('branchCode');
    ////console.log(this.branchCode);
    this.branchCurrencyCode = localStorage.getItem('branchCurrencyCode');
    ////console.log(this.branchCurrencyCode);
    this.isAffBooking = sessionStorage.getItem('isAffBooking');
this.gettravllerfromservice()
    this.branchId = localStorage.getItem('branchId');
    this.groupId = localStorage.getItem('groupId');
    this.searchKey = sessionStorage.getItem('searchKey');
    this.countryId = localStorage.getItem('countryId');
    this.countryCode = localStorage.getItem('countryCode');
    this.tripType = sessionStorage.getItem('tripType');
    this.flightOptionKey = sessionStorage.getItem('flightOptionKey');
    this.serviceVendor = sessionStorage.getItem('serviceVendor');
   // //console.log(this.serviceVendor)
    //this.bookingtype =  sessionStorage.getItem('booking-type');

this.getFlightfarerules();

    
  }

isFullFare:boolean;
  getFlightfarerules(){
    
    var data = {
      "bookingType": this.isAffBooking =='true' ? 'affiliate': null,
        "branchId": this.branchId,
        "countryId": this.countryId,
        "fareType":  "FULL",
        "flightOptionKey": this.flightOptionKey,
        "flightSearchKey":  this.searchKey,
        "groupId": this.groupId,
        "noOfAdult": this.adult,
        "noOfChild": this.children,
        "noOfInfant": this.infants,
        "tripType": this.tripType == "returnway" ?  "roundtrip" : this.tripType

    }
    //console.log('req body is',data)
        this.flightService.getFlightfarerule2cache(data).subscribe((res) =>{
          //console.log('fare type - full',res);
          this.loading = false;
this.fareRuleResponseBean = res['fareRuleResponseBean'];

let headingWiseList = res['fareRuleResponseBean'] && res['fareRuleResponseBean']['headingWiseList'];
let headingWiseListLength =   headingWiseList && headingWiseList.length;
   if(headingWiseListLength<1){
    this.isFullFare = true;

    //console.log('full fare rule not found');
   }else{
    this.isFullFare = false;

    //console.log('full fare rule  found///');

   }
        })
      }



  back(){
    this.router.navigate(['/fare-rules']);
// this.location.back();
  }

  gettravllerfromservice(){
    this.travSub =  this.sendTravelerData.gettravller().subscribe(res=>{
      //console.log(res)
    var info=res['trvllerfield'];
    this.adultdefault = res.adult;
    this.adult = info.adult;
    this.children = info.children;
    this.infants = info.infants;
  
  //   //console.log(this.adult);
  // //console.log(this.children);
  // //console.log(this.infants);
  
    })
  
  }

}
