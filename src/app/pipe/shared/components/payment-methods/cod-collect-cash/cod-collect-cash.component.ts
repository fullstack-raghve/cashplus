import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as country from "../../../../../constants/new-countries.constant";
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { NationalityComponent } from 'src/app/nationality/nationality.component';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/services/flight.service';
import { FareDetailsComponent } from '../../flightcomponents/fare-details/fare-details.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { OverlayService } from 'src/app/services/overlay.service';
import swal from "sweetalert2";
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';

@Component({
  selector: 'app-cod-collect-cash',
  templateUrl: './cod-collect-cash.component.html',
  styleUrls: ['./cod-collect-cash.component.scss'],
})
export class CodCollectCashComponent implements OnInit {
  @Input() tncurl;
  @Input() allPassengers;
  payOffice:boolean= false;
  branchName: string;
  branchCode: string;
  branchCurrencyCode: string;
  branchId: string;
  groupId: string;
  searchKey: string;
  countryId: string;
  countryCode: string;
  selectedFlightOptionKey: string;
  serviceVendor: string;
  islogin: string;
  loginemail: string;
  onwarddate: string;
  returndate: string;
  adult: any;
  children: any;
  infants: any;

  preferedtime = ['09:00 to 12:00', '12:00 to 03:00', '03:00 to 06:00']
  addresstype = ['Home', 'Office']
 
  travllerDetailsUrl: string;
  tripType: string;
  subscribess: Subscription;
  selectedflight2: any;
  returnwaycurreny: any;
  selectedflightreturnway: any;
  selectedflight: any;
  displayfareoneway: number;
  cprice: number;  
  multiCityCurrency: any;
  subscribe: Subscription;
  multiflight: any;
  multiflightFare: number;
  passengersList: string;
  countryName: string;
  formdata: any;
  flag: boolean = false;

  termsNCheck:boolean = false;
  affilatePartnerId: string;
  fareConfirmReqKeyLocal: string;
  searchPageURL: string;
  adultdefault: any;
  travSub: Subscription;
  constructor(
    private flightService:FlightService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private overlayService: OverlayService,
    private sendTravelerData: SendTravllerDataService 
  ) {
    this.refrshing();

    //console.log('passenger list',this.router.getCurrentNavigation().extras.state.example); // should log out 'bar'
    this.passengersList = this.router.getCurrentNavigation().extras.state.example;
    //console.log(this.passengersList)
    this.formdata = this.router.getCurrentNavigation().extras.state.addressdetails;
    //console.log('addressdetails',this.formdata);

  }
  

  codCollectCashForm :FormGroup;
  ngOnInit() {
    this.tripType = sessionStorage.getItem("tripType");
    this.searchPageURL = sessionStorage.getItem("searchPageURL");
this.gettravllerfromservice();
    //console.log('i m from cod')
    this.payOffice = true;
   // this.passengersList = localStorage.getItem('passengersList');
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
    this.loginemail = sessionStorage.getItem('loginemail');
    this.onwarddate = sessionStorage.getItem('returnwaydepartDate');
    this.returndate = sessionStorage.getItem('returnwayreturnDate');
    this.countryName =  localStorage.getItem('countryName');
    this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');

 this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");

    this.getsingleflightmulti();
    this.getsingleflight();
    this.getsingleflight();
    this.getAllNewCountry();
   
    this.travllerDetailsUrl = sessionStorage.getItem("travllerDetailsUrl");
    this.updateFare();
    
    this.codCollectCashForm = this.fb.group({
      enterName: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'Name is required.'
            }),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.minLength({value:3, message:'Minimum 3 characters are required'}),
            RxwebValidators.maxLength({value:30, message:'Maximum 30 characters are allowed'}),
          ]
        })
      ],
      dialcode: [
        "+971",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Dial code number is required.'
          })]
        })
      ],
      mbNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Mobile number is required.'
          }), RxwebValidators.numeric({
            message:'Only numbers are allowed.'
          }), 
          RxwebValidators.minLength({value:7, message:'Minimum 7 characters are required'}),
          RxwebValidators.maxLength({value:11, message:'Maximum 11 characters are allowed'})]
        })
      ],
      address: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Address is required.'
          }),RxwebValidators.pattern({
            expression: { alpha: /^[a-zA-Z ]*$/ },
            message: "Only alphabets are allowed."
          }), 
          RxwebValidators.maxLength({value:100, message:'Maximum 100 characters are allowed'})]
        })
      ],
      buildingname: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Building name/no, apartment no. is required.'
          }),  RxwebValidators.maxLength({value:50, message:'Maximum 50 characters are allowed'})]
        })
      ],
      areaname: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Area name is required.'
          }),  RxwebValidators.maxLength({value:50, message:'Maximum 50 characters are allowed'})]
        })
      ],
      cityname: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'City is required.'
          }),RxwebValidators.pattern({
            expression: { alpha: /^[a-zA-Z ]*$/ },
            message: "Only alphabets are allowed."
          }), 
          RxwebValidators.maxLength({value:25, message:'Maximum 25 characters are allowed'})]
        })
      ],
      zipCode: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Zip Code is required.'
          }),RxwebValidators.numeric({
            message:'Only numbers are allowed.'
          }) ,
            RxwebValidators.minLength({value:6, message:'Minimum 6 characters are required'}),
            RxwebValidators.maxLength({value:10, message:'Maximum 10 characters are allowed'})]
        })
      ],
      nearlandmark: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Nearest Landmark is required.'
          })]
        })
      ],
      time: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Time is required.'
          })]
        })
      ],
      addtype: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Address type is required.'
          })]
        })
      ],
      // saveaddCheckbox: [
      //   "",
      //   RxwebValidators.compose({
      //     validators: [RxwebValidators.required({
      //       message:'Checkbox is required.'
      //     })]
      //   })
      // ],
      saveaddCheckbox: [false],
      tncCheckbox: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Checkbox is required.'
          })]
        })
      ],
      country: [this.countryName],
    });
    this.updatefileds();

    if (this.countryName !='null') {
      this.codCollectCashForm.get("country").disable();
    } else {

    }

  }
refrshing(){
  this.flightService.getpagerefresh().subscribe(res=>{
    if(res){
      // //console.log('page not refreshed')
     }else{
     // this.router.navigate(['./payment-methods']);

       //console.log('page refreshed');
  
     }
  })
}

presentLoading() {
  this.overlayService.showLoader();
}

closeLoading() {
  this.overlayService.hideLoader();
}

isDisabled = false;
  codAddAddress(){
    //console.log('COD Form');
    let x = this.codCollectCashForm.get("saveaddCheckbox").value;
    //console.log('sav add val ',x);
    let checkboxvalue =  this.codCollectCashForm.controls['tncCheckbox'].value;  
    //console.log(checkboxvalue);    
    //console.log('form status',this.codCollectCashForm.invalid)
if (this.codCollectCashForm.invalid) {
  for (let i in this.codCollectCashForm.controls)
    this.codCollectCashForm.controls[i].markAsTouched();
    if(checkboxvalue == false) {       
      this.termsNCheck = true;
    }
  return;
}
else if(checkboxvalue == true) {       
  this.termsNCheck = false;
}

//console.log('isDisabled',this.isDisabled)

this.isDisabled = true;
this.presentLoading();
   // this.spinner.show();
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
        "passengerList": this.passengersList,
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
          
          "address": this.codCollectCashForm.get("address").value,
          "addressId": 0,
          "addressType": this.codCollectCashForm.get("addtype").value,
          "area": this.codCollectCashForm.get("areaname").value,
          "buildingName": this.codCollectCashForm.get("buildingname").value,
          "city": this.codCollectCashForm.get("cityname").value,
          "codType": 2,
          "isdCode": this.codCollectCashForm.get("dialcode").value,
          "landmark": this.codCollectCashForm.get("nearlandmark").value,
          "mobileNumber": this.codCollectCashForm.get("mbNo").value,
          "name": this.codCollectCashForm.get("enterName").value,
          "pinCode" : this.codCollectCashForm.get("zipCode").value,
          "preferredTime" : this.codCollectCashForm.get("time").value,
          "saveAddress" : this.islogin == 'true' ? this.codCollectCashForm.get("saveaddCheckbox").value : false,
           }
    }
 
     //0 //saveadress flase;
      
      //console.log('cod request body',reqbody)
       this.flightService.bookAndHold(reqbody).subscribe((res)=>{
         //console.log('cod api res',res);
         this.closeLoading();
         let bookingRefNo = res['bookingRefNo'];
         //let ticketingOnHold = res['flightBookingResponseBean']['ticketingOnHold'];
         ////console.log('isticketingOnHold',ticketingOnHold)
         //localStorage.setItem('ticketingOnHoldstatus',ticketingOnHold);
         this.flightService.sendbookingRefNo(bookingRefNo);
         this.router.navigate(['./booking-confirmation']);

     })
}

openTC(){
  window.open(this.tncurl, "_blank");

}

  backTo() {
    //this.router.navigate([this.travllerDetailsUrl]);
    this.router.navigate(['./payment-methods']);
  }
  // editflight() {
  //   this.router.navigate(["/search-flights"]);
  // }

  editflight() {
    let isAffBooking = sessionStorage.getItem('isAffBooking');
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    // if(isAffBooking =='true'){

    //   let setLanguageSetting = 'en';
    //   let currentCountryName = localStorage.getItem('currentCountryName')
    //   let selectedCountryCode = localStorage.getItem('selectedCountryCode');
    
    // if(selectedCountryCode){
    //   let x = selectedCountryCode.toLowerCase();
    //   this.router.navigate([x + "/" + setLanguageSetting]);
    
    // }else{
    //   let y = currentCountryName.toLowerCase();
    
    //   this.router.navigate([y + "/" + setLanguageSetting]);
    
    // }
    
    //   sessionStorage.removeItem('booking-type');
    //   sessionStorage.removeItem('isAffBooking');
    
    // }
    if(isAffBooking =='true'){
  
      let setLanguageSetting = 'en';
      let currentCountryName = localStorage.getItem('currentCountryName')
      let selectedCountryCode = localStorage.getItem('selectedCountryCode');
    
    if(selectedCountryCode){
      let x = selectedCountryCode.toLowerCase();
      let a = x + '/' + setLanguageSetting;
        window.location.replace(a);

    
    }else{
      let y = currentCountryName.toLowerCase();
      let b = y + '/' + setLanguageSetting;
      window.location.replace(b);
    
    }
    
      sessionStorage.removeItem('booking-type');
      sessionStorage.removeItem('isAffBooking');
    
    }else{
      //this.router.navigate([countryCode + "/" + setLanguageSetting]);
      this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
    }

   

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
      data: 'ccd'
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      //console.log(res);
     this.setButtonClose = false;
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
            this.multiCityCurrency = this.multiflight.flightFare.currency

            this.multiflightFare = this.multiflight.flightFare.totalBaseFare + this.multiflight.flightFare.totalTax + this.multiflight.flightFare.totalFees + this.multiflight.flightFare.markupPrice + this.multiflight.flightFare.serviceChargePrice - this.multiflight.flightFare.discountPrice
            //console.log('currncy',this.multiCityCurrency);
            //console.log('flight fare',this.multiflightFare)
          }

        } else {
        }
      });
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
        }
  
      } else {
      }
    });
  }

  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  allCountry;
  allCountryList: any;
  newCountryList = [];
  getAllNewCountry() {
    this.allCountryList = country.countries;
    this.allCountryList.forEach(element => {
      this.newCountryList.push({
        countryCode: element["countryCode"],
        countryId: element["countryId"],
        countryName: element["countryName"],
        phoneCode: element['phoneCode'],
      });
    });
    this.allCountry = this.newCountryList;
    
  }

  onchangeOfIsdCode(formfield, selectedvalue){
    let selectedCurrentValue;
    //console.log(selectedvalue)
    if (formfield != undefined) {
      if (formfield == 'isdCode' && (selectedvalue != '' || selectedvalue != null) ) {
          selectedCurrentValue = selectedvalue;
      }
    }
    let sendCurrentData = {
      formfield: formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList: this.newCountryList,
    }
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });

    this.bottomSheet._openedBottomSheetRef
      .afterDismissed()
      .subscribe((res) => {
        //console.log(res);
        if (res != undefined) {
          if (res['currentFieldSelected'] == 'isdCode') {
            this.codCollectCashForm.get('dialcode').setValue(res['currentCountrySelected']['phoneCode']);
          }
        }
      })
  }

  onSelectCountry(formfield, selectedvalue){
    let selectedCurrentValue;
  

    if(formfield != undefined){
    if(formfield == 'country' && selectedvalue ){
      
      const selectedCountry = this.newCountryList.find(
        c => c.countryId == selectedvalue
      );
      selectedCurrentValue = selectedCountry['phoneCode'];

    }
  }
    let sendCurrentData ={
      formfield:formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList: this.newCountryList
    }
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });

   
    
    this.bottomSheet._openedBottomSheetRef
    .afterDismissed()
    .subscribe((res)=>{
      if(res != undefined){
        if(res['currentFieldSelected'] == 'country'){
          this.codCollectCashForm.get('country').setValue(res['currentCountrySelected']['countryId']);
        }
      }
     
      
    })
  }


  
  onSubmit()
  {
    //this.editAddress()
    //console.log(this.codCollectCashForm.valid);
    this.markFormGroupTouched(this.codCollectCashForm as FormGroup);
    //console.log(this.markFormGroupTouched(this.codCollectCashForm as FormGroup))
  }

updatefileds(){
  if(this.formdata != undefined){
    this.flag = true;

  this.codCollectCashForm.patchValue({
      enterName:  this.formdata.name,
      dialcode: this.formdata.isdCode,
      mbNo: this.formdata.mobileNumber,
      address: this.formdata.address,
      buildingname:this.formdata.buildingName,
      areaname:this.formdata.area,
      cityname: this.formdata.city,
      zipCode:this.formdata.pinCode,
      country: this.countryName,
      time: this.formdata.preferredTime,
      addtype:this.formdata.addressType,
      nearlandmark:this.formdata.landmark,
      saveaddCheckbox:false,
      tncCheckbox:true,
})
//console.log(this.formdata)
}else{
//console.log('no edit')
}
}


  editAddress(){ 
   
    this.codCollectCashForm.get('saveaddCheckbox').clearValidators();
    this.codCollectCashForm.get('tncCheckbox').clearValidators();
    if (this.codCollectCashForm.invalid) {
      //console.log("Invalid form:-"+this.codCollectCashForm);
      this.markFormGroupTouched(this.codCollectCashForm);
      return;
    }
    //console.log('addressId:', this.formdata.addressId);
    let data = {
      "address": this.codCollectCashForm.get("address").value,
      "addressId": this.formdata.addressId,
      "addressType": this.codCollectCashForm.get("addtype").value,
      "area": this.codCollectCashForm.get("areaname").value,
      "buildingName": this.codCollectCashForm.get("buildingname").value,
      "city": this.codCollectCashForm.get("cityname").value,
      "isdCode": this.codCollectCashForm.get("dialcode").value,
      "landmark": this.codCollectCashForm.get("nearlandmark").value,
      "mobileNumber": this.codCollectCashForm.get("mbNo").value,
      "name": this.codCollectCashForm.get("enterName").value,
      "pinCode" : this.codCollectCashForm.get("zipCode").value,
      "preferredTime" : this.codCollectCashForm.get("time").value,
      "userAlias": this.loginemail
     // "saveAddress" : this.islogin == 'true' ? this.codCollectCashForm.get("saveaddCheckbox").value : false,
    }
    //console.log('obj:',data);
      
   // payment-methods
    this.flightService.editUserAddress(data).subscribe((res)=>{
//console.log('ediit user response',res);
if(res['statusMessage'] == 'success'){
  this.router.navigate(['./payment-methods'], { queryParams: { data: res } });
  let snackBarRef1 = this._snackBar.open("Address updated successfully",'', {
    duration: 1500
  });
 }
 else{
      let snackBarRef1 = this._snackBar.open("Some technical error",'', {
        duration: 1500
      });
    }

  });

}
 

gettravllerfromservice(){
  this.travSub =  this.sendTravelerData.gettravller().subscribe(res=>{
    ////console.log(res)
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


updateFare(){
  this.flightService.getFare().subscribe(res=>{
    let updatedFare = res;
    if(res){
 ////console.log('updatedFare BD',updatedFare);
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
