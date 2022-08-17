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
import swal from "sweetalert2";
@Component({
  selector: "app-bank-deposit",
  templateUrl: "./bank-deposit.component.html",
  styleUrls: ["./bank-deposit.component.scss"],
  providers: [MessageService],
})
export class BankDepositComponent implements OnInit, OnDestroy {
  @Input() bookandholdstatus;
  @Input() allPassengers;
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
  @Input() tncurl;
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
 
  affilatePartnerId: string;
  fareConfirmReqKeyLocal: string;
  searchPageURL: string;
  constructor(
    private flightService: FlightService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private sendTravelerData: SendTravllerDataService,
     private cookieService: CookieService,public dialog: MatDialog,
     private overlayService: OverlayService  ) {}

  ngOnInit() {
    this.tripType = sessionStorage.getItem("tripType");
    this.searchPageURL = sessionStorage.getItem("searchPageURL");
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
    this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');

    
 this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");


this.bankDepositform  = this.fb.group({
  termconditions: [false, Validators.required]

})



    this.getsingleflightmulti();

    this.bankDeposit();
    this.gettravllerfromservice();
    this.getsingleflight();

    this.updateFare();
  }

  bankDeposit() {
    let data = {
      branchCode: this.branchCode,
      branchId: this.branchId,
      countryId: this.countryId,
    };
    this.flightService.bankDeposit(data).subscribe((res) => {
      //console.log("bank deposit response", res);
      if (res["statusMessage"] == "success") {
        this.bankdetails = res["bankDepositDetail"];

        this.banktoshow = this.bankdetails[0];
//         let videourl = res["bankDepositDetail"][0]['videoPath'];
//         if(videourl){
//           this.yt_iframe_html = this.embedService.embed(videourl);
//           //console.log('yt_iframe_htm',this.yt_iframe_html)

//         }
//  //console.log('videourl',videourl)

      }
    });
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  termconditionfalg:boolean = false;
  isdisabled:boolean = false;
  requestBooking() {
    this.sessisionTimeOut();
    if(!this.sessisionTimeOut()){
      this.sessionTimeOutPopupShow();
    }else{

    let checkboxvalue =  this.bankDepositform.controls['termconditions'].value;
    
      if(checkboxvalue == false) {
        this.termconditionfalg = true;
        return;
      } else {
        this.termconditionfalg = false;
      

     

this.isdisabled = true;
    //this.spinner.show();
    this.presentLoading();

    let reqbody = {
      affilatePartnerId:this.affilatePartnerId,
      branchCode: this.branchCode,
      branchCurrencyConversionToUSD: 0,
      branchCurruency: this.branchCurrencyCode,
      groupId: this.groupId,
      countryId: this.countryId,
      surchargeAmount: "",
      countryCode: this.countryCode,
      conversionRate: 0,
      noOfAdult: this.adult ? this.adult : 1,
      noOfChild: this.children ? this.children : 0,
      noOfInfant: this.infants ? this.infants : 0,
      onwardJourneyDate: this.onwarddate,
      passengerList: this.allPassengers,
      returnJourneyDate: this.returndate ? this.returndate : "null",
      selectedFlightOptionKey: this.selectedFlightOptionKey,
      tripType: this.tripType == "returnway" ? "RoundTrip" : this.tripType,
      userAlias: this.loginemail ? this.loginemail : this.loginemail,
      userCurruency:  this.branchCurrencyCode,
      userSelectedCurrency:  this.branchCurrencyCode,
      bookingRequestBean: {
        productType: 0,
        modeOfPayment: 7,
        paymentGatewayId: "null",
        cardNumber: "null",
        cardHolderName: "null",
        cvvNumber: "null",
        expMonth: "null",
        expYear: "null",
        street: "null",
        state: "null",
        country: "null",
        zip: "null",
        address: "null",
        city: "null",
        f_name: "null",
        l_name: "null",
        email: "null",
        payMobileNumber: "null",
        phoneNumber: "null"
       
      },
      bankDepositModel: this.banktoshow,
      exchangeHouseModel: {
        address: "null",
        approvalStatus: "null",
        branchId: "null",
        countryId: "null",
        emailId: "null",
        exchangeHouseBranch: "null",
        exchangeHouseId: "null",
        exchangeHouseName: "null",
        latitude: "null",
        logoPath: "null",
        longitude: "null",
        phoneNumber: "null",
        status: "null",
        videoPath: "null",
      },
    };

    //console.log("bankandhold request body", reqbody);
    this.flightService.bookAndHold(reqbody).subscribe((res) => {
   //   //console.log("bankandhold api res from bank deposit", res);
     // this.spinner.hide();
     this.closeLoading();
      // if(res['statusMessage'] != 'success'){
      //   this.messageService.add({ severity:'warn', summary:'Warn', detail:'Some Technical Error',sticky: false });

      //  }

      // localStorage.setItem('bookandholdstatus','Hold');
      let bookingRefNo = res["bookingRefNo"];
      //localStorage.setItem('bookingRefNo',bookingRefNo);
      let ticketingOnHold = res["flightBookingResponseBean"]["ticketingOnHold"];
      //console.log("isticketingOnHold", ticketingOnHold);
      sessionStorage.setItem("ticketingOnHoldstatus", ticketingOnHold);

      this.flightService.sendbookingRefNo(bookingRefNo);
      this.router.navigate(["./booking-confirmation"]);
    });


  }
  }
  }


 
  openTC(){
     window.open(this.tncurl, "_blank");
  
  }

  
  gettravllerfromservice() {
    this.travSub = this.sendTravelerData.gettravller().subscribe((res) => {
      var info = res["trvllerfield"];
      this.adultdefault = res.adult;
      this.adult = info.adult;
      this.children = info.children;
      this.infants = info.infants;

     
    });
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
    this.subscribe = this.flightService
      .getselectedFlightmulti()
      .subscribe((res) => {
        if (res) {
          //console.log(res);
          this.multiflight = res["onwardFlightOption"];
          //  this.cp = res["currentPrice"];
          if (this.tripType == "multicity") {
            this.setmultiCityFare(res["onwardFlightOption"])
            // this.multiCityCurrency = this.multiflight.flightFare.currency;

            // this.multiflightFare =
            //   this.multiflight.flightFare.totalBaseFare +
            //   this.multiflight.flightFare.totalTax +
            //   this.multiflight.flightFare.totalFees +
            //   this.multiflight.flightFare.markupPrice +
            //   this.multiflight.flightFare.serviceChargePrice -
            //   this.multiflight.flightFare.discountPrice;
            // //console.log("currncy", this.multiCityCurrency);
            // //console.log("flight fare", this.multiflightFare);
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

  setmultiCityFare(multiCity) {
    //console.log('multicity fare')

    this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
    this.multiCityCurrency = multiCity.flightFare.currency
    this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
    //console.log(this.multiflightFare)
  }

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
      data:'bd'

    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      //console.log(res);
      this.setButtonClose = !this.setButtonClose;
      //console.log(this.setButtonClose);
    });
  }

  bankId;
  clickedindex;
  clickedbankId;
  flag = 0;
  flags: boolean = true;
  selectedbank(data, i) {
    this.flags = false;
    this.flag = i;
    this.clickedbankId == data.bankId;
    this.clickedindex = i;
    ////console.log('clicked bank',data);
    this.banktoshow = data;
    this.videoURL = data.videoPath;
    //console.log("bank to show", this.banktoshow);
    //this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
  }

  mydata() {
    //console.log("mydata");
  }
  ngOnDestroy() {
    // this.subscribess.unsubscribe();
    // this.travSub.unsubscribe();
  }

  sessisionTimeOut(): boolean {
    let isTimerCookie: any = this.cookieService.check("timerStart");
    //console.log("is cookie", isTimerCookie);
    return isTimerCookie;
  }


  updateFare(){
    this.flightService.getFare().subscribe(res=>{
      let updatedFare = res;
      if(res){
 //  //console.log('updatedFare BD',updatedFare);
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
