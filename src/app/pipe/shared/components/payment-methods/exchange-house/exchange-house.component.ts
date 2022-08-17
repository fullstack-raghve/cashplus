import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { FareDetailsComponent } from '../../flightcomponents/fare-details/fare-details.component';
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import { OverlayService } from 'src/app/services/overlay.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-exchange-house',
  templateUrl: './exchange-house.component.html',
  styleUrls: ['./exchange-house.component.scss'],
  providers: [MessageService]

})
export class ExchangeHouseComponent implements OnInit,OnDestroy {
  @Input() bookandholdstatus;
  @Input() allPassengers;
  @Input() tncurl;
  sliderOpts = {
    zoom: false,
    slidesPerView: 2.8,
    spaceBetween: 3
   };
  branchId: string;
  branchCode: string;
  countryId: string;
  bankdetails: Object;
  tripType:any;
  displayfareoneway: number;
  selectedflight2: any;
  selectedflightreturnway: any;
  returnwaycurreny: any;
  selectedflight: any;
  cprice: number;
  subscribe:Subscription;
  returndate: string;
  onwarddate: string;
  loginemail: string;
  islogin: string;
  serviceVendor: string;
  selectedFlightOptionKey: string;
  countryCode: string;
  searchKey: string;
  groupId: string;
  branchCurrencyCode: string;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;
  travSub: Subscription;
  subscribess: Subscription;
  banktoshow: any;
  videoURL: any;
  multiflightFare: number;
  multiCityCurrency: any;
  multiflight: any;

  // code by Anusha
  public termsExchangeForm: FormGroup;
  public isExchangeCheck: boolean = false;
  
  affilatePartnerId: string;
  fareConfirmReqKeyLocal: string;
  searchPageURL: string;

  constructor(private flightService:FlightService,private router:Router,private messageService: MessageService,private spinner: NgxSpinnerService,private bottomSheet: MatBottomSheet,private sendTravelerData: SendTravllerDataService,  private fb: FormBuilder,
    private cookieService: CookieService,
    public dialog: MatDialog, private overlayService: OverlayService ) { }




  ngOnInit() {

    this.tripType = sessionStorage.getItem('tripType');
    this.searchPageURL = sessionStorage.getItem("searchPageURL");

    this.branchCode = localStorage.getItem('branchCode');
    this.branchCurrencyCode = localStorage.getItem('branchCurrencyCode');
    this.branchId = localStorage.getItem('branchId');
    this.groupId = localStorage.getItem('groupId');
    this.searchKey = sessionStorage.getItem('searchKey');
    this.countryId = localStorage.getItem('countryId');
    this.countryCode = localStorage.getItem('countryCode');
    this.selectedFlightOptionKey = sessionStorage.getItem('selectedFlightOptionKey');
      this.serviceVendor = sessionStorage.getItem('serviceVendor');
       this.islogin = localStorage.getItem("isLoggedIn");
      this.loginemail = sessionStorage.getItem('loginemail');

      //this.onwarddate = sessionStorage.getItem('returnwaydepartDate');
      //this.returndate = sessionStorage.getItem('returnwayreturnDate');

      this.onwarddate = sessionStorage.getItem("returnwaydepartDate");
      this.returndate = sessionStorage.getItem("returnwayreturnDate");
      this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');
      this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");
// //console.log('returndate', this.returndate)
// //console.log('onwarddate', this.onwarddate)

       
      this.getsingleflightmulti();

this.gettravllerfromservice();
  this.getsingleflight();
this.getExchangeHouse();
this.updateFare();

 
  this.termsExchangeForm = this.fb.group({
    terms: [false, Validators.requiredTrue]
  })

  }
 
  openTC(){
     window.open(this.tncurl, "_blank");
  
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  
  getExchangeHouse(){
    let data = {
      "branchCode": this.branchCode,
      "branchId": this.branchId,
      "countryId": this.countryId
    }
    this.flightService.exchangeHouse(data).subscribe((res)=>{
  //console.log('exchange house res',res);
  if(res['statusMessage'] == 'success'){
  this.bankdetails = res['exchangeHouseList'];
  
this.banktoshow = this.bankdetails[0];

  }
    })
  }
  bankId;
clickedindex;
clickedbankId;
flag = 0;
flags:boolean = true;
selectedbank(data,i){
  this.flags = false;
  this.flag  = i;
  this.clickedbankId == data.bankId
this.clickedindex = i;
////console.log('clicked bank',data);
this.banktoshow = data;
this.videoURL = data.videoPath
//console.log('bank to show',this.banktoshow);
//this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
}
 exchngeboolean:boolean = false;
  requestBooking(){

    this.sessisionTimeOut();
    if(!this.sessisionTimeOut()){
      this.sessionTimeOutPopupShow();
      return;
    }
    if(this.termsExchangeForm.invalid) {
      this.isExchangeCheck = true;
      this.termsExchangeForm.controls['terms'].markAsTouched();
      return;
    } else {
      this.isExchangeCheck = false;
    }
   // this.spinner.show();
   this.exchngeboolean = true;
    this.presentLoading();
       let reqbody = {
        "affilatePartnerId":this.affilatePartnerId,
        "branchCode": this.branchCode,
        "branchCurrencyConversionToUSD": 0,
        "branchCurruency": this.branchCurrencyCode,
          "groupId":this.groupId,
          "countryId":this.countryId,
           "surchargeAmount":'',
          "countryCode":this.countryCode,
        "conversionRate": 0,
        "noOfAdult": this.adult ? this.adult : 1,
        "noOfChild": this.children ? this.children : 0,
        "noOfInfant": this.infants ? this.infants : 0,
        "onwardJourneyDate": this.onwarddate,
        "passengerList": this.allPassengers,
        "returnJourneyDate": this.returndate ? this.returndate : "null",
        "selectedFlightOptionKey": this.selectedFlightOptionKey,
        "tripType": this.tripType == "returnway" ?  "RoundTrip" : this.tripType,
        "userAlias": this.loginemail ? this.loginemail:this.loginemail,
        "userCurruency":  this.branchCurrencyCode,
        "userSelectedCurrency":  this.branchCurrencyCode,
       "bookingRequestBean":{
       "productType": 0,   
       "modeOfPayment": 8,
       "paymentGatewayId": "null",
       "cardNumber":"null",
         "cardHolderName":"null",
       "cvvNumber":"null",
       "expMonth":"null",
       "expYear":"null",
       "street":"null",
       "state": "null",
       "country": "null",
       "zip": "null",
       "address": "null",
       "city": "null",
       "f_name": "null",
       "l_name": "null",
       "email": "test@gmail.com",
       "payMobileNumber":"null",
       "phoneNumber": "null",
       
       },
       "bankDepositModel": {
        "accountName": "null",
        "accountNumber":"null",
        "address": "null",
        "approvalStatus": 0,
        "bankCode": "null",
        "bankId": 0,
        "bankName": "null",
        "branch": "null",
        "branchId": 0,
        "countryId": 0,
        "email": "null",
        "latitude": "null",
        "logoPath": "null",
        "longitude":"null",
        "phoneNumber": "null",
        "status": "null",
        "videoPath":"null",
      },
       "exchangeHouseModel":this.banktoshow
      }
     
      
      //console.log('bankandhold request body',reqbody)
       this.flightService.bookAndHold(reqbody).subscribe((res)=>{
         //console.log('bankandhold api res exchnge house',res)
        // this.spinner.hide();
        
          this.closeLoading();

         let bookingRefNo = res['bookingRefNo'];
         //localStorage.setItem('bookingRefNo',bookingRefNo);
         let ticketingOnHold = res['flightBookingResponseBean']['ticketingOnHold'];
         //console.log('isticketingOnHold',ticketingOnHold)
         sessionStorage.setItem('ticketingOnHoldstatus',ticketingOnHold);
         this.flightService.sendbookingRefNo(bookingRefNo);
         this.router.navigate(['./booking-confirmation']);

        //  if(res['statusMessage'] != 'success'){
        //   this.messageService.add({ severity:'warn', summary:'Warn', detail:'Some Technical Error',sticky: false });

        //  }
 
       })
     }
   
   
  
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
       this.subscribess = this.flightService.getselectedFlight().subscribe(res => {
         //console.log(res)
         if (res) {
           this.selectedflight2 = res["onwardFlightOption"];
           
           this.selectedflight = res["onwardFlightOption"];
           this.selectedflightreturnway = res["roundTripFlightOption"];
           ///response --returnway  end
           if (this.tripType == "returnway") {
             //this.returnwaycurreny =  res["roundTripFlightOption"]['currency'];
             this.returnwaycurreny =  res["roundTripFlightOption"]['onwardFlightOption']['flightFare']['currency'];

             this.setReturnWayfare(res);
            //  this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice']
     
           }
     
           if (this.tripType == "oneway") {
            this.setOnewfare(res["onwardFlightOption"])
            //  this.displayfareoneway = this.selectedflight2.flightFare.totalBaseFare + this.selectedflight2.flightFare.totalTax + this.selectedflight2.flightFare.totalFees + this.selectedflight2.flightFare.markupPrice + this.selectedflight2.flightFare.serviceChargePrice - this.selectedflight2.flightFare.discountPrice
            //  // //console.log(this.displayfareoneway)
           }
     
         } else {
         }
       });
     }

     getsingleflightmulti() {
      this.subscribe = this.flightService
        .getselectedFlightmulti()
        .subscribe(res => {
          if (res) {
            //console.log(res);
            this.multiflight = res["onwardFlightOption"];
          //  this.cp = res["currentPrice"];
            if (this.tripType == "multicity") {
              this.setmultiCityFare(res["onwardFlightOption"])
              // this.multiCityCurrency = this.multiflight.flightFare.currency
  
              // this.multiflightFare = this.multiflight.flightFare.totalBaseFare + this.multiflight.flightFare.totalTax + this.multiflight.flightFare.totalFees + this.multiflight.flightFare.markupPrice + this.multiflight.flightFare.serviceChargePrice - this.multiflight.flightFare.discountPrice
           //console.log('currncy',this.multiCityCurrency);
           //console.log('flight fare',this.multiflightFare)

            }
  
          } else {
          }
        });
    }

    
  sessionTimeOutPopupShow() {

    const dialogRef = this.dialog.open(SessionTimeoutComponent, {
      data: { searchResultUrl: 'this.searchPageURL '},
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
       this.setButtonClose = true;
       this.bottomSheet.open(FareDetailsComponent, {
         panelClass: "fare-class",
         backdropClass: "fare-backdrop",
         data:'eh'
       });
       this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
         //console.log(res);
        this.setButtonClose = false;
       });
     }

     ngOnDestroy(){
      // this.subscribess.unsubscribe();
      // this.travSub.unsubscribe();
     }


     exhouse(){
       //console.log('this is ex house')
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
    // //console.log('updatedFare eh',updatedFare);
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
