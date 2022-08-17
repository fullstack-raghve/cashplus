import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { FareDetailsComponent } from '../../flightcomponents/fare-details/fare-details.component';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {Message} from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import Swal from 'sweetalert2';
import { OverlayService } from 'src/app/services/overlay.service';
import swal from "sweetalert2";


@Component({
  selector: 'app-cash-on-delivery',
  templateUrl: './cash-on-delivery.component.html',
  styleUrls: ['./cash-on-delivery.component.scss']
})
export class CashOnDeliveryComponent implements OnInit {
  payOffice:boolean= false;
  payLocation:boolean=false;
  msgs: Message[] = [];

  position: string;
  @Input() tncurl;
  @Input() bookandholdstatus;
@Input() allPassengers;
  branchId: string;
  branchCode: string;
  countryId: string;
  bankdetails:any;
  dummy:any;
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
    direction: 'horizontal',
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
  orgdetails: any;
  branchName: string;
  subscribe: Subscription;
  multiflight: any;
  multiCityCurrency: any;
  multiflightFare: number;
  
  // tab toggle by Anusha
  public payOfficeClass = {
    btn: true,
    success: false,
    borderActive: true
  }

  public payLocationClass = {
    btn: true,
    success: false,
    borderActive: false
  }
  // tab toggle ends

  // terms and condition form for validation
  public termsLocationForm: FormGroup;
  public termsOfficeForm: FormGroup;

  public isLocationCheck: boolean = false;
  public isOfficeCheck: boolean = false;
  displayfareonewayCurrency: any;
  savedaddress: any;
  selectedaddress: any;
  courierCharges: Object;
    //end of anusha's code
    marked = false;
    theCheckbox = false;
  
  collectCashFromLocationAllowed: string;
  affilatePartnerId: string;
  fareConfirmReqKeyLocal: string;
  searchPageURL: string;

  constructor(private flightService:FlightService,private confirmationService: ConfirmationService,private _snackBar: MatSnackBar,private router:Router,private spinner: NgxSpinnerService,private bottomSheet: MatBottomSheet,private sendTravelerData: SendTravllerDataService, private fb: FormBuilder,private cookieService: CookieService,private route:ActivatedRoute,
    public dialog: MatDialog,private overlayService: OverlayService ) {}

  ngOnInit() {
   // //console.log('i m from cod');
    this.loginemail = sessionStorage.getItem('loginemail');
    this.searchPageURL = sessionStorage.getItem("searchPageURL");

    this.route.queryParams.subscribe(
      (res)=>{
        //console.log(res);
        this.getCODAddress();
      });

    this.payOffice = true;
    this.branchName =  localStorage.getItem('branchName');
    this.tripType = sessionStorage.getItem('tripType');
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
      this.onwarddate = sessionStorage.getItem('returnwaydepartDate');
      this.returndate = sessionStorage.getItem('returnwayreturnDate');
      this.collectCashFromLocationAllowed = localStorage.getItem("collectCashFromLocationAllowed");
      this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');

      this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");
      
      this.getsingleflightmulti();

  this.gettravllerfromservice();
  this.getsingleflight();
  this.getCod();
  this.getCODAddress();
   this.getFees();
   this.updateFare();
  // anusha's code
  this.termsLocationForm = this.fb.group({
    termslocation: [false, Validators.required]
  })
  this.termsOfficeForm = this.fb.group({
    termsoffice: [false, Validators.required]
  });

  
    //end of anusha's code

  }
  
  ionViewWillEnter() {
    //console.log('i m from ion enter')
    this.getCODAddress();
  }
  payOnOffice(){
    this.payOffice = true;
    this.payLocation = false;
    // anusha's code
    this.payOfficeClass.borderActive = true;
    this.payLocationClass.borderActive = false;

  }
  payOnLocation(){
    
    this.payLocation = true;
    this.payOffice = false;
    // anusha's code
    this.payLocationClass.borderActive = true;
    this.payOfficeClass.borderActive = false;

  }


  
  toggleVisibility(e){
    this.marked= e.target.checked;
  }
  addNewAdd(){
    //this.router.navigate(['./cod-collect-cash']);
    this.router.navigate(['./cod-collect-cash'], { state: { example: this.allPassengers } });

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
  
  getsingleflight() {
    this.subscribess = this.flightService.getselectedFlight().subscribe(res => {
      //console.log(res)
      if (res) {
        this.selectedflight2 = res["onwardFlightOption"];
        
        this.selectedflight = res["onwardFlightOption"];
        this.selectedflightreturnway = res["roundTripFlightOption"];
        ///response --returnway  end
        if (this.tripType == "returnway") {
         // this.returnwaycurreny =  res["roundTripFlightOption"]['currency']
         this.returnwaycurreny =  res["roundTripFlightOption"]['onwardFlightOption']['flightFare']['currency'];

          this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice']
  
        }
  
        if (this.tripType == "oneway") {
          this.displayfareoneway = this.selectedflight2.flightFare.totalBaseFare + this.selectedflight2.flightFare.totalTax + this.selectedflight2.flightFare.totalFees + this.selectedflight2.flightFare.markupPrice + this.selectedflight2.flightFare.serviceChargePrice - this.selectedflight2.flightFare.discountPrice
          // //console.log(this.displayfareoneway)
          this.displayfareonewayCurrency = this.selectedflight2.flightFare.currency;
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
      data:'cod'

    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      //console.log(res);
     this.setButtonClose = false;
    });
  }

  getCod(){
    let data = {
      "branchCode": this.branchCode,
      "branchId": this.branchId,
      "countryId": this.countryId
    }
    //console.log('req body of cod',data)
this.flightService.codDetail(data).subscribe((res)=>{
//console.log('cod res',res)
   this.orgdetails = res['responseMap']['orgContactDetails'];
   //console.log('org deatils from cod',this.orgdetails)
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

  termsofficeCheck:boolean = false;
  isdisabled:boolean = false;
  codType(){
    if(this.payLocation){
      //console.log('i m from collect from my location and alredy save');
      let checkboxvalue =  this.termsLocationForm.controls['termslocation'].value;
    
      if(checkboxvalue == false) {
        this.isLocationCheck = true;
        return;
      } else {
        this.isLocationCheck = false;
        this.codBookingSavedAddress();

      }


    }else{
      //console.log('i m from pay at tw ofc')
      let checkboxvalueee =  this.termsOfficeForm.controls['termsoffice'].value;

      if(checkboxvalueee == false) {
        this.termsofficeCheck = true;
        return;
      } else {
        this.termsofficeCheck = false;
        this.codBooking();

      }
     // this.codBooking();
    }
  }

  codBooking(){
    this.sessisionTimeOut();
    if(!this.sessisionTimeOut()){
      this.sessionTimeOutPopupShow();
      return;
    }
  
    // end of Anusha's code
    //  this.spinner.show();
    this.isdisabled = true;
    this.presentLoading();
         let reqbody = {
          'affilatePartnerId':this.affilatePartnerId,
          "branchId": this.branchId,
          "branchName": this.branchName,
          "branchCode": this.branchCode,
          "branchCurrencyConversionToUSD": 0,
          "branchCurruency": this.branchCurrencyCode,
            "groupId":this.groupId,
            "countryId":this.countryId,
             "surchargeAmount":0,
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
         "modeOfPayment": 6,
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
         "phoneNumber": "null"
         
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
        "exchangeHouseModel": {
          "address": "null",
          "approvalStatus":  "null",
          "branchId": "null",
          "countryId": "null",
          "emailId":  "null",
          "exchangeHouseBranch":  "null",
          "exchangeHouseId":  "null",
          "exchangeHouseName":  "null",
          "latitude":  "null",
          "logoPath":  "null",
          "longitude":  "null",
          "phoneNumber": "null",
          "status":  "null",
          "videoPath": "null"
        },    
        "codBean": {
          "address": "string",
          "addressId": 0,
          "addressType": "string",
          "area": "string",
          "buildingName": "string",
          "city": "string",
          "codType": 1,
          "isdCode": "string",
          "landmark": "string",
          "mobileNumber": "string",
          "name": "string"
           }
      }
       
        
     //   //console.log('cod request body',reqbody)
         this.flightService.bookAndHold(reqbody).subscribe((res)=>{
           //console.log('cod api res',res);
          //// this.closeLoading();
           let bookingRefNo = res['bookingRefNo'];
           let ticketingOnHold = res['flightBookingResponseBean']['ticketingOnHold'];
           //console.log('isticketingOnHold',ticketingOnHold)
           //localStorage.setItem('ticketingOnHoldstatus',ticketingOnHold);
           this.flightService.sendbookingRefNo(bookingRefNo);
           this.router.navigate(['./booking-confirmation']);
  
       
   
         })
       
  }
  codBookingSavedAddress(){
    //console.log('codBookingSavedAddress')

if(this.clickedindex>=0){
  //console.log('clickedindex ',this.clickedindex);

//alert('gud')
//this.spinner.show();
this.isdisabled  = true;
this.presentLoading();

    let reqbody = {
      'affilatePartnerId':this.affilatePartnerId,
     "branchId": this.branchId,
     "branchName": this.branchName,
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
    "modeOfPayment": 6,
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
   "exchangeHouseModel": {
     "address": "null",
     "approvalStatus":  "null",
     "branchId": "null",
     "countryId": "null",
     "emailId":  "null",
     "exchangeHouseBranch":  "null",
     "exchangeHouseId":  "null",
     "exchangeHouseName":  "null",
     "latitude":  "null",
     "logoPath":  "null",
     "longitude":  "null",
     "phoneNumber": "null",
     "status":  "null",
     "videoPath": "null"
   },     
      "codBean": {
       
       "address": this.selectedaddress.address,
       "addressId": this.selectedaddress.addressId,
       "addressType": this.selectedaddress.addressType,
       "area":this.selectedaddress.area,
       "buildingName":this.selectedaddress.buildingName,
       "city": this.selectedaddress.city,
       "codType": 0,
       "isdCode": this.selectedaddress.isdCode,
       "landmark": this.selectedaddress.landmark,
       "mobileNumber": this.selectedaddress.mobileNumber,
       "name": this.selectedaddress.name,
       "pinCode" : this.selectedaddress.pinCode,
       "preferredTime" : this.selectedaddress.preferredTime,
       "saveAddress" : false,
        }
 }

  //0 //saveadress flase;
   
   ////console.log('cod request body my loc. save address',reqbody)
    this.flightService.bookAndHold(reqbody).subscribe((res)=>{
     // //console.log('cod api res',res);
     // this.spinner.hide();
    ///  this.closeLoading();
      let bookingRefNo = res['bookingRefNo'];
      //let ticketingOnHold = res['flightBookingResponseBean']['ticketingOnHold'];
      ////console.log('isticketingOnHold',ticketingOnHold)
      //localStorage.setItem('ticketingOnHoldstatus',ticketingOnHold);
      this.flightService.sendbookingRefNo(bookingRefNo);
      this.router.navigate(['./booking-confirmation']);

  })
}else{
  let snackBarRef1 = this._snackBar.open("Please select one address Either add a new address",'', {
    duration: 2000
  });
    //console.log('clickedindex select a ddd first' );

}
  }

  getCODAddress(){
    //console.log('this.loginemail',this.loginemail)
    this.flightService.getCODAddress(this.loginemail).subscribe((res)=>{
    //console.log('this is get cod address response',res)

this.savedaddress = res['userAddress'];
////console.log('address length',res['userAddress'].length)
    })
  }


  
  clickedindex;
  selectedAddress(address,i){
    //console.log('selected address',address)
    this.clickedindex = i;
this.selectedaddress = address;

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
            this.multiCityCurrency = this.multiflight.flightFare.currency

            this.multiflightFare = this.multiflight.flightFare.totalBaseFare + this.multiflight.flightFare.totalTax + this.multiflight.flightFare.totalFees + this.multiflight.flightFare.markupPrice + this.multiflight.flightFare.serviceChargePrice - this.multiflight.flightFare.discountPrice
            //console.log('currncy',this.multiCityCurrency);
            //console.log('flight fare',this.multiflightFare)
          }

        } else {
        }
      });
  }


getFees(){
     let  data = {
      "branchId": this.branchId,
      "countryId": this.countryId
    }
  

    this.flightService.getCourierDetails(data).subscribe((res)=>{
     // //console.log('get fee res',res)
      
     if(res){
this.courierCharges = res['courierCharges'];
     }
});
}

// confirm1(address) {
//   this.confirmationService.confirm({
//       message: 'Are you sure want to delete?',
//       header: 'Confirmation',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//          this.deleteCard(address);
//       },
//       reject: () => {
        
//       }
//   });
// }
deleteCard(address){
//console.log('selected address',address)
Swal.fire({
   text: "Are you sure you want to delete this address?",
   customClass : {
    container:"swalForCOD"
  },
  showCancelButton: true,
  confirmButtonText: 'Yes'
}).then((result) => {
  //console.log(result.value == true);
  if(result.value == true) {
        this.selectedaddress = address;
        //console.log(this.selectedaddress);
        let  data = {
          'addressId':address.addressId,
          'userAlias':this.loginemail
        }
    this.flightService.deleteAddress(data).subscribe((res)=>{
        //console.log('del address res',res);
        this.getCODAddress();
        Swal.fire(
          'Deleted!',
          'Your Address has been deleted.',
          'success'
        )
    })   
   // this.getalltrvllers(); 
  }
})
}

sessisionTimeOut(): boolean {
  let isTimerCookie: any = this.cookieService.check("timerStart");
  //console.log("is cookie", isTimerCookie);
  return isTimerCookie;
}


editAddress(address){
  
  //this.router.navigate(['./cod-collect-cash']);
  this.router.navigate(['./cod-collect-cash'], { state: { example: this.allPassengers, addressdetails:address } });

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
