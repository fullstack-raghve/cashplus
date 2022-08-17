import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { Subscription } from 'rxjs';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { FareDetailsComponent } from '../../flightcomponents/fare-details/fare-details.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import { OverlayService } from 'src/app/services/overlay.service';
@Component({
  selector: 'app-mobile-pay',
  templateUrl: './mobile-pay.component.html',
  styleUrls: ['./mobile-pay.component.scss'],
})
export class MobilePayComponent implements OnInit,OnDestroy {
  threeGform:FormGroup;
  @Input() tncurl;
  branchCode: string;
  branchCurrencyCode: string;
  branchId: string;
  groupId: string;
  searchKey: string;
  countryId: string;
  selectedFlightOptionKey: string;
  formvalue: any;
  cardholdername: any;
  email: any;
  phone: any;
  address: any;
  street: any;
  country: any;
  zipcode: any;
  city: any;
  state: any;
  islogin: string;
  loginemail: string;
  onwarddate: string;
  returndate: string;
  tripType: string;
  roundtrip: string;
  isUccflight: string;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;
  travSub:Subscription;
  @Input() allPassengers;
  countryCode: string;
  selectedflight2: any;
  selectedflight: any;
  returnwaycurreny: any;
  displayfareoneway: number;
  selectedflightreturnway: any;
  cprice: number;
  subscribess:Subscription;
  bookingRefNo: any;
  multiCityCurrency: any;
  multiflightFare: number;
  displayfareonewayCurrency: any;
  multiflight: any;
  affilatePartnerId: string;
  constructor(private fb:FormBuilder, private overlayService: OverlayService,public dialog: MatDialog,private router:Router,private spinner: NgxSpinnerService,private bottomSheet: MatBottomSheet,private flightService:FlightService,private http:HttpClient,private sendTravelerData: SendTravllerDataService,
    ) { 
  }

  ngOnInit() {
    this.gettravllerfromservice();

    this.selectedFlightOptionKey = sessionStorage.getItem('selectedFlightOptionKey');

    this.branchCode = localStorage.getItem('branchCode');
this.branchCurrencyCode = localStorage.getItem('branchCurrencyCode');

this.branchId = localStorage.getItem('branchId');
this.groupId = localStorage.getItem('groupId');
this.searchKey = sessionStorage.getItem('searchKey');
this.countryId = localStorage.getItem('countryId');
this.selectedFlightOptionKey = sessionStorage.getItem('selectedFlightOptionKey');

this.islogin = localStorage.getItem("isLoggedIn");
this.loginemail = localStorage.getItem('loginemail');
this.onwarddate = sessionStorage.getItem('returnwaydepartDate');
this.returndate = sessionStorage.getItem('returnwayreturnDate');

  this.tripType = sessionStorage.getItem('tripType');
this.countryCode = localStorage.getItem('countryCode');

this.roundtrip = sessionStorage.getItem('tripround');

this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");
  this.isUccflight =  sessionStorage.getItem('isUccflight');
   
    this.getsingleflight();
    this.getsingleflightmulti();
    
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }


  isMOBBoolean:boolean = false;

  mobilepay(){
//this.spinner.show();
   this.presentLoading();

this.isMOBBoolean = true;
  var reqbody = {
    'affilatePartnerId':this.affilatePartnerId,
    "branchCode": this.branchCode,
    "branchCurrencyConversionToUSD": 0,
    "branchCurruency": this.branchCurrencyCode,
    "groupId":this.groupId,
    "countryId":this.countryId,
    "countryCode":this.countryCode,
    "surchargeAmount":0,
    "conversionRate": 0,
    "noOfAdult": this.adult ? this.adult : 1,
    "noOfChild": this.children ? this.children : 0,
    "noOfInfant": this.infants ? this.infants : 0,
    "onwardJourneyDate": this.onwarddate,
    "passengerList": this.allPassengers,
    "returnJourneyDate": this.returndate ? this.returndate : "null",
    "selectedFlightOptionKey": this.selectedFlightOptionKey,
    "tripType": this.tripType == "returnway" ?  "roundtrip" : this.tripType,
    "userAlias": this.loginemail,
    "userCurruency":  this.branchCurrencyCode,
    "userSelectedCurrency":  this.branchCurrencyCode,
    "bookingRequestBean":{
    "productType": 0,
    "modeOfPayment": 4,
    "paymentGatewayId": 3
   
    }
    }
    //console.log('req body of mob pay',reqbody)
  
  this.flightService.flightbook(reqbody).subscribe(res=>{
    //console.log('res from mobile pay click',res);
    this.bookingRefNo =    res['bookingRefNo'];

          
          if (this.bookingRefNo) {
            //console.log(this.bookingRefNo);
          ///  this.spinner.hide();
          this.closeLoading();
            localStorage.setItem("BOOKRN", this.bookingRefNo);

            this.flightService.sendbookingRefNo(this.bookingRefNo);
            this.router.navigate(["./booking-confirmation"]);
          }
  
  })
  
    }


    ////get nationality




    gettravllerfromservice(){
      this.travSub =  this.sendTravelerData.gettravller().subscribe(res=>{
        //console.log(res)
      var info=res['trvllerfield'];
      this.adultdefault = res.adult;
      this.adult = info.adult;
      this.children = info.children;
      this.infants = info.infants;
  
      //console.log(this.adult);
  //console.log(this.children);
  //console.log(this.infants);
  
      })
  
    }
    getsingleflight() {
      this.subscribess = this.flightService
        .getselectedFlight()
        .subscribe((res) => {
          //console.log(res);
          if (res) {
            this.selectedflight2 = res["onwardFlightOption"];
  
            this.selectedflight = res["onwardFlightOption"];
            this.selectedflightreturnway = res["roundTripFlightOption"];
            ///response --returnway  end
            if (this.tripType == "returnway") {
              this.returnwaycurreny =  res["roundTripFlightOption"]['onwardFlightOption']['flightFare']['currency'];
  
              // this.cprice =
              //   res["roundTripFlightOption"]["totalBaseFare"] +
              //   res["roundTripFlightOption"]["totalTax"] +
              //   res["roundTripFlightOption"]["totalFee"] +
              //   res["roundTripFlightOption"]["markupPrice"] +
              //   res["roundTripFlightOption"]["serviceChargePrice"] -
              //   res["roundTripFlightOption"]["discountPrice"];
              this.setReturnWayfare(res);
            }
  
            if (this.tripType == "oneway") {
              // this.displayfareoneway =
              //   this.selectedflight2.flightFare.totalBaseFare +
              //   this.selectedflight2.flightFare.totalTax +
              //   this.selectedflight2.flightFare.totalFees +
              //   this.selectedflight2.flightFare.markupPrice +
              //   this.selectedflight2.flightFare.serviceChargePrice -
              //   this.selectedflight2.flightFare.discountPrice;
              // // //console.log(this.displayfareoneway)
              this.setOnewfare(res["onwardFlightOption"])
  
              this.displayfareonewayCurrency = this.selectedflight2.flightFare.currency;
  
            }
          } else {
          }
        });
    }
   
    getsingleflightmulti() {
      this.subscribess = this.flightService
        .getselectedFlightmulti()
        .subscribe((res) => {
          if (res) {
            //console.log(res);
            this.multiflight = res["onwardFlightOption"];
            //  this.cp = res["currentPrice"];
            if (this.tripType == "multicity") {
              this.setmultiCityFare(res["onwardFlightOption"])
            
            }
          } else {
          }
        });
    }
  
    setmultiCityFare(multiCity) {
      //console.log('multicity fare')
  
      this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
      this.multiCityCurrency = multiCity.flightFare.currency
      this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
      //console.log(this.multiflightFare)
    }

    sessionTimeOutPopupShow() {

      const dialogRef = this.dialog.open(SessionTimeoutComponent, {
        data: { searchResultUrl: 'this.searchPageURL' },
        autoFocus: false,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: "sessionTimeOutPopup",
        backdropClass: "show_popup_session",
      });
  
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result)
        if (result) {
          if (this.tripType == "oneway") {
            this.setOnewfare(result["onwardFlightOption"])
            this.flightService.selectedFlight(result);
            this.flightService.sendsimilarflightmulti("");
          }
          if (this.tripType == "returnway") {
            this.setReturnWayfare(result);
            this.flightService.selectedFlight(result);
            this.flightService.sendsimilarflightmulti("");
          }
          if (this.tripType == "multicity") {
            this.flightService.selectedFlightmulti(result);
            this.setmultiCityFare(result["onwardFlightOption"]);
            this.flightService.selectedFlight('multicity');
          }
        }
  
      });
    }
  
  
    setOnewfare(res) {
      //console.log('onew way fare')
      this.displayfareoneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
      this.flightService.sendflightdetails(res);
      //console.log(this.displayfareoneway)
    }
    setReturnWayfare(res) {
  
      this.flightService.sendflightdetails(res['roundTripFlightOption']);
      this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
      //console.log(this.cprice)
    }
  
   
  

    // fareDetails() {
    //   this.bottomSheet.open(FareDetailsComponent, {
    //     panelClass: "fare-class",
    //     backdropClass: "fare-backdrop",
    //     data:'mobilepaay'
    //   });
    //   this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
    //     //console.log(res);
    //   });
    // }

    setButtonClose = false;

    closePopup() {
     this.bottomSheet.dismiss();
     this.setButtonClose = false;
   }
 
   fareDetails() {
     this.setButtonClose = !this.setButtonClose;
     this.bottomSheet.open(FareDetailsComponent, {
       panelClass: "fare-class",
       backdropClass: "fare-backdrop",
       data:'mobilepaay'
 
     });
     this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
       //console.log(res);
       this.setButtonClose = !this.setButtonClose;
       //console.log(this.setButtonClose);
     });
   }

    ngOnDestroy(){
    //this.travSub.unsubscribe();
    }
}
