
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FlightService } from "src/app/services/flight.service";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { FareDetailsComponent } from "../../flightcomponents/fare-details/fare-details.component";
import { Subscription } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OverlayService } from 'src/app/services/overlay.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-cash-plus',
  templateUrl: './cash-plus.component.html',
  styleUrls: ['./cash-plus.component.scss']
  //providers: [MessageService],

})

export class CashPlusComponent implements OnInit {

///////
@Input() autoticketingDisable;
@Input() bookandholdstatus;
@Input() allPassengers;
@Input() tncurl;
branchId: string;
branchCode: string;
countryId: string;
bankdetails: any;
dummy: any;
tripType: string;
branchCurrencyCode: string;
groupId: string;
searchKey: string;
countryCode: string;
selectedFlightOptionKey: string;
serviceVendor: string;
islogin: string;
loginemail: string;
onwarddate: string;
returndate: string;

sliderOpts = {
  zoom: false,
  slidesPerView: 3,
  direction: "horizontal",
};
displayfareoneway: number;
cprice: number;
returnwaycurreny: any;
selectedflightreturnway: any;
selectedflight: any;
selectedflight2: any;
adultdefault: any;
adult: any;
children: any;
infants: any;
travSub: Subscription;
subscribess: Subscription;
banktoshow: any;
videoURL: any;

termcondition: false;
multiCityCurrency: any;
multiflightFare: number;
multiflight: any;
subscribe: Subscription;
displayfareonewayCurrency: any;
yt_iframe_html: any;
bankDepositform:FormGroup;

cardname_max_length_40 = ' 40 characters are allowed.';

//////

  QTForm:FormGroup;
  surchargeAmount2: any;
  phone_firsstPL: any;
  fareConfirmReqKeyLocal: string;
  uccftxncharge: any;
  isUccflightFinal: any;
  isuccfFinal: any;
 
  isuccfTxnValue: string;
  actualFareTktPcc: number;
  amount: number;
  percentCal: any;
  bookingRefNo: any;
  onewayfareNoceil: number;
  fareO: number;
  cpriceNoceil: number;
  fareR: number;
  fareM: number;
  multiflightFareNoceil: number;
  surchargeAmountnewx: number;
  affilatePartnerId: string;
  //setButtonClose: boolean;
  constructor(
    private flightService: FlightService,
    private fb:FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private sendTravelerData: SendTravllerDataService,
     private cookieService: CookieService,public dialog: MatDialog,
     private overlayService: OverlayService  ) {}

  ngOnInit() {
    this.localdata();
    this.qtform();

   

    this.getsingleflightmulti();

  //  this.bankDeposit();
    this.gettravllerfromservice();
    this.getsingleflight();

    let PassengersList = this.allPassengers;
    this.phone_firsstPL = PassengersList[0]['mobileNo'];
  }
localdata(){
  this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');
  //// console.log('fareConfirmReqKeyLocal',this.fareConfirmReqKeyLocal);

   this.selectedFlightOptionKey = sessionStorage.getItem("selectedFlightOptionKey");
  this.tripType = sessionStorage.getItem("tripType");
  this.branchCode = localStorage.getItem("branchCode");
  this.branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
  this.branchId = localStorage.getItem("branchId");
  this.groupId = localStorage.getItem("groupId");
  this.searchKey = sessionStorage.getItem("searchKey");
  this.countryId = localStorage.getItem("countryId");
  this.countryCode = localStorage.getItem("countryCode");
  this.selectedFlightOptionKey = sessionStorage.getItem(
    "selectedFlightOptionKey"
  );
  this.serviceVendor = sessionStorage.getItem("serviceVendor");
  this.islogin = localStorage.getItem("isLoggedIn");
  this.loginemail = sessionStorage.getItem("loginemail");
  this.onwarddate = sessionStorage.getItem("returnwaydepartDate");
  this.returndate = sessionStorage.getItem("returnwayreturnDate");

  this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");
this.updateFare();
 
}
presentLoading() {
  this.overlayService.showLoader();
}

closeLoading() {
  this.overlayService.hideLoader();
}
  qtform(){
    this.QTForm = this.fb.group({
      
      cardname: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.maxLength({value:40, message:''}),

          ]
        })
      ],
      email: [
 "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Email id is required.'
          }),
          RxwebValidators.pattern({
            expression: { pattern: /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/ },
            message: "Please enter valid email id.",
          }),
           RxwebValidators.maxLength({value:45, message:''}),
        ],
        }),
      ],
      phone: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Phone no. is required.'
          }), 
          RxwebValidators.numeric(),  
          RxwebValidators.minLength({value:6, message:''}),
          RxwebValidators.maxLength({value:12, message:''}),],
        }),
      ],
      checkeboxx: ["", Validators.required],

   
    });
  }

  fullname:boolean;
  checkfullname(value: string) { 

    if(this.QTForm.controls['cardname'].hasError('alpha') || this.QTForm.controls['cardname'].hasError('required')){
console.log('errrr');

this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  this.surchargeAmountnewx = 0;

  localStorage.removeItem('surchargeAmount');

    }else{

   let cardnamevalue = this.QTForm.controls['cardname'].value;
   let cardnamevalue_split = cardnamevalue.split(" ");
   let cardnamevalue_split_zero = cardnamevalue_split[0];
   let cardnamevalue_split_one = cardnamevalue_split[1];
  // console.log('cardnamevalue_after split>>>',cardnamevalue_split)

  // console.log('cardnamevalue_split_zero',cardnamevalue_split_zero)
  // console.log('cardnamevalue_split_one',cardnamevalue_split_one)
  // // console.log('cardnamevalue_split_one length',cardnamevalue_split_one && cardnamevalue_split_one.length)

   // var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
// if(!regName.test(value)){
  if(cardnamevalue_split_one == undefined){

 // console.log('Invalid name given.');
    this.fullname = true;
    this.QTForm.controls['cardname'].setErrors({ 'incorrect': true});
    this.QTForm.controls['cardname'].markAsTouched();
   // console.log('this.fullname',this.fullname);

    this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  this.surchargeAmountnewx = 0;

  localStorage.removeItem('surchargeAmount');

}else{
  if(cardnamevalue_split_one.length<1){
    this.fullname = true;
    this.QTForm.controls['cardname'].setErrors({ 'incorrect': true});
    this.QTForm.controls['cardname'].markAsTouched();
    this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  this.surchargeAmountnewx = 0;
  
  }else{

 
  this.fullname = false;
    

 // console.log('Valid name given.');
 // console.log('this.fullname',this.fullname);
}
}
}
  }

  fareDetails() {
    this.setButtonClose = !this.setButtonClose;
    this.bottomSheet.open(FareDetailsComponent, {
      panelClass: "fare-class",
      backdropClass: "fare-backdrop",
      data: this.surchargeAmount2 ? this.surchargeAmount2 : 'qt'
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
     // console.log(res);
      this.setButtonClose = !this.setButtonClose;
     // console.log(this.setButtonClose);
    });
  }
  termconditions_interswitch:boolean;
  isdisabled:boolean = false;

  requestBooking(){
    
    let val = this.QTForm.controls["checkeboxx"].value;

   // console.log(val);
    if (!val) {
      this.termconditions_interswitch = true;
    } else {
      this.termconditions_interswitch = false;
    }


   // console.log('i m from is');
    if (this.QTForm.invalid) {
      for (let i in this.QTForm.controls)
        this.QTForm.controls[i].markAsTouched();

      return;
    }
    let cardname = this.QTForm.controls["cardname"].value;
    let spltname = cardname.split(" ")
    let fname = spltname[0];
    let lname = spltname[1];
    this.isdisabled = true;
    this.presentLoading();
    //this.mytime = 60000;
    /////call payment
    var reqbody = {
      affilatePartnerId:this.affilatePartnerId,   
      isBookAndHold: this.bookandholdstatus,
      autoTicketingDisabling:this.autoticketingDisable,
      branchCode: this.branchCode,
      branchCurrencyConversionToUSD: 0,
      branchCurruency: this.branchCurrencyCode,
      groupId: this.groupId,
      countryId: this.countryId,
      surchargeAmount: this.surchargeAmount2 ? this.surchargeAmount2:0,
      countryCode: this.countryCode,
      conversionRate: 0,
      noOfAdult: this.adult ? this.adult : 1,
      noOfChild: this.children ? this.children : 0,
      noOfInfant: this.infants ? this.infants : 0,
      onwardJourneyDate: this.onwarddate,
      passengerList: this.allPassengers,
      returnJourneyDate: this.returndate ? this.returndate : "null",
      selectedFlightOptionKey: this.selectedFlightOptionKey,
      tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
      userAlias: this.loginemail ? this.loginemail : this.loginemail,
      userCurruency: this.branchCurrencyCode,
      userSelectedCurrency: this.branchCurrencyCode,
      bookingRequestBean: {
        productType: 0,
        modeOfPayment: 11,
        paymentGatewayId: 0,
        cardNumber: null,
        cardHolderName: this.QTForm.controls["cardname"].value,
       cvvNumber: null,
       expMonth: null,
      expYear: null,
        street: "1295 Charleston Road",
        state: "CA",
        country: "US",
        zip: "94043",
        address: "noida",
        city: "Mountain view",
        f_name: fname,
        l_name: lname,
        email: this.loginemail,
        payMobileNumber: this.phone_firsstPL,
        phoneNumber: this.phone_firsstPL,
        isUccflight:this.isUccflightFinal,      // raghve
        uccfCharge: this.uccftxncharge,   // raghve
        isUccfTxn:this.isuccfFinal        // raghve
       
      },
    };
    this.flightService.flightbook(reqbody).subscribe((res) => {
  console.log('res of cashplus',res);
    this.bookingRefNo = res["bookingRefNo"];
    this.closeLoading();
    if (this.bookingRefNo) {
    // console.log(this.bookingRefNo);
      localStorage.setItem("BOOKRN", this.bookingRefNo);
      this.flightService.sendbookingRefNo(this.bookingRefNo);
      this.router.navigate(["./booking-confirmation"]);
    }
    });
  }


  gettravllerfromservice() {
    this.travSub = this.sendTravelerData.gettravller().subscribe((res) => {
     // console.log(res);
      var info = res["trvllerfield"];
      this.adultdefault = res.adult;
      this.adult = info.adult;
      this.children = info.children;
      this.infants = info.infants;

     // console.log(this.adult);
     // console.log(this.children);
     // console.log(this.infants);
    });
  }

  getsingleflight() {
    this.subscribess = this.flightService
      .getselectedFlight()
      .subscribe((res) => {
       // console.log(res);
        if (res) {
          this.selectedflight2 = res["onwardFlightOption"];

          
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
            this.selectedflight = res["onwardFlightOption"];

            // this.displayfareoneway =
            //   this.selectedflight2.flightFare.totalBaseFare +
            //   this.selectedflight2.flightFare.totalTax +
            //   this.selectedflight2.flightFare.totalFees +
            //   this.selectedflight2.flightFare.markupPrice +
            //   this.selectedflight2.flightFare.serviceChargePrice -
            //   this.selectedflight2.flightFare.discountPrice;
            // //// console.log(this.displayfareoneway)
            this.setOnewfare(res["onwardFlightOption"])

            this.displayfareonewayCurrency = this.selectedflight2.flightFare.currency;

          }
        } else {
        }
      });
  }
  getsingleflightmulti() {
    this.subscribe = this.flightService
      .getselectedFlightmulti()
      .subscribe((res) => {
        if (res) {
         // console.log(res);
          this.multiflight = res["onwardFlightOption"];
          //  this.cp = res["currentPrice"];
          if (this.tripType == "multicity") {
            this.selectedflight = res["onwardFlightOption"];
           // this.selectedflight = res["onwardFlightOption"];

            this.setmultiCityFare(res["onwardFlightOption"]);
            // this.multiCityCurrency = this.multiflight.flightFare.currency;

            // this.multiflightFare =
            //   this.multiflight.flightFare.totalBaseFare +
            //   this.multiflight.flightFare.totalTax +
            //   this.multiflight.flightFare.totalFees +
            //   this.multiflight.flightFare.markupPrice +
            //   this.multiflight.flightFare.serviceChargePrice -
            //   this.multiflight.flightFare.discountPrice;
            //// console.log("currncy", this.multiCityCurrency);
            //// console.log("flight fare", this.multiflightFare);
          }
        } else {
        }
      });
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
     // console.log(result)
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
   // console.log('onew way fare')
    this.displayfareoneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
    this.flightService.sendflightdetails(res);
 
   this.onewayfareNoceil = this.displayfareoneway;

   this.displayfareoneway = Math.ceil(this.displayfareoneway);
   this.fareO =  this.displayfareoneway;

  }
  setReturnWayfare(res) {

    this.flightService.sendflightdetails(res['roundTripFlightOption']);
    this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
   
   this.cpriceNoceil = this.cprice;
   this.cprice = Math.ceil(this.cprice);
   this.fareR =  this.cprice;

  }

  setmultiCityFare(multiCity) {
   // console.log('multicity fare')

    this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
    this.multiCityCurrency = multiCity.flightFare.currency
    this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
   // console.log(this.multiflightFare);
    this.multiflightFareNoceil = this.multiflightFare;
    
    this.multiflightFare = Math.ceil(this.multiflightFare);
    this.fareM =  this.multiflightFare;

  }

  setButtonClose = false;

   closePopup() {
    this.bottomSheet.dismiss();
    this.setButtonClose = false;
  }

  onKey(event: any){

  }

 

 
  openTC(){
     window.open(this.tncurl, "_blank");
  
  }

  updateFare(){
    this.flightService.getFare().subscribe(res=>{
      let updatedFare = res;
      if(res){
   //console.log('updatedFare BD',updatedFare);
    if (this.tripType == "oneway") {
      if(this.displayfareoneway != updatedFare){
        this.displayfareoneway = updatedFare;
      }  
    }
    if (this.tripType == "returnway") {
      if(this.cprice != updatedFare){
        this.cprice = updatedFare;
      }  

    }
    if (this.tripType == "multicity") {
      if(this.multiflightFare != updatedFare){
        this.multiflightFare = updatedFare;
      }  
    }
 
  }

  });


  }


}
