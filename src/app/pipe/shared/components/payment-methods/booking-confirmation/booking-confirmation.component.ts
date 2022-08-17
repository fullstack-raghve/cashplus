import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,Renderer2, ChangeDetectionStrategy } from '@angular/core'; 
import { FlightService } from 'src/app/services/flight.service';
import { reduceEachLeadingCommentRange } from 'typescript';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { json } from '@rxweb/reactive-form-validators';
import { MytripService } from 'src/app/services/mytrip.service';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { HostListener } from '@angular/core';
import swal from "sweetalert2";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss'],

})
export class BookingConfirmationComponent implements OnInit,AfterViewInit {
  @ViewChild('content') content: ElementRef;
  @ViewChild('myerr') myErrorText: ElementRef;
  listener;


  
  bookingRefNo: string;
  bookingdetail: Object;
  subscribebooking: Subscription;
  flightDetails = [];
  passengerDetails = [];
  tripType: string;
  branchMob: string;
  fareDetails: any;
  adultDetail: any;
  childDetail: any;
  infantDetail: any;
  adulttotal: any;
  childtotal: any;
  infantttotal: any;
  grandtotal: any;
  bookingStatus: any;
  maildata: any;
  isticketingOnHold: string;
  BOOKRN: string;
  loginemail: string;
  countryCode: string;
  supplierCurruency: any;
  onlineConvinenceFees: any;
  pdfurl: any;
  onlineRuleAutoTicketing: any;
  markupPrice: any;
  serviceCharge: any;
  disc: any;
  branchEmailId: string;
  ccd: string;
  backurl: string;
  @ViewChild('tasknote') input: ElementRef;
  curruency: any;
  constructor(private renderer: Renderer2,location: LocationStrategy,private flightService: FlightService, private router: Router, private spinner: NgxSpinnerService, private tripService:MytripService,
    private profileControllerService: ProfileControllerService,private fb: FormBuilder
    ) {
     
     }

  ngOnInit() {
  
  this.getURL();
  this.spinner.show();
  this.loginemail = sessionStorage.getItem('loginemail');
  this.countryCode = localStorage.getItem('countryCode');
  this.ccd =  this.countryCode.toLowerCase();
this.tripType = sessionStorage.getItem('tripType');
this.branchMob = localStorage.getItem('BranchcontactNo');
this.isticketingOnHold = sessionStorage.getItem('ticketingOnHoldstatus');


this.branchEmailId =  localStorage.getItem('branchEmailId');
this.branchMob =  localStorage.getItem('BranchcontactNo');

  this.subscribebooking = this.flightService.getbookingRefNo().subscribe(res =>{
    this.bookingRefNo = res;

  });


  this.getbookingdetails();

 

  this.profileControllerService.clearAllProfiletCache();
 

  }

  

  ionViewWillEnter() {
   
  }

  ngAfterViewInit() {
//    this.renderer.selectRootElement(this.input["nativeElement"]).focus();
// this.input.nativeElement.click();
  }
myForm : FormGroup;
createForm(){
this.myForm =  this.fb.group({
  name:['',Validators.required]
})
}


noBack(){

// window.history.pushState(null, "", window.location.href);
// window.onpopstate = function() {
// window.history.pushState(null, "", window.location.href);
// };

//new code
// history.pushState(null, document.title, location.href);
// window.addEventListener('popstate', function (event)
// {
//   history.pushState(null, document.title, location.href);
// });

//
// window.onbeforeunload = function(){
//   return 'Are you sure? Your work will be lost.';
// }

// history.pushState(null, null, location.href);
// window.onpopstate = function(){
// history.go(1);
// };



}
goback1(){
  const state = { 'page_id': 1, }
const title = 'tw'
const url = 'booking-confirmation';

history.pushState(state, title, url)

  window.onpopstate = function() {
    alert("Press Browser Back Button");
  };
     history.pushState({}, '');
}
goback2(){
  window.addEventListener('popstate',
   function(){alert("Press Browser Back Button");});
}

goback3(){
  window.addEventListener("hashchange", function(e) {
    if(e.oldURL.length > e.newURL.length)
        alert("back")
});
}




  @HostListener('window:popstate', ['$event'])

  onPopState(event) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass : {
        container:"swalForCOD"
        },
     
    })
    
    swalWithBootstrapButtons.fire({
      allowOutsideClick: false,
      customClass : {
        container:"swalForBack"
        },
      title: 'Are you sure you want to leave this page?',
      text: "You will redirected to home page.",
      icon: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'OK',
      reverseButtons: false
    }).then((result) => {
      if (result.value == true) {
           
        this.bck();
  //window.location.replace(this.backurl);
  localStorage.removeItem('bookingURL');
  sessionStorage.removeItem('booking-type');

        
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.router.navigate(["./booking-confirmation"]);


      }
    })


   
  
   
  
}

  getURL(){
   let bookingURL = this.router.url;
   localStorage.setItem('bookingURL',bookingURL);
   sessionStorage.setItem('bookingURL',bookingURL);

   this.flightService.sendhBookingURL(bookingURL);
  }

  


  

  backToHome(){
    let setLanguageSetting = 'en';
      let countryCode = localStorage.getItem('currentCountryName').toLowerCase();
    let SettingCountryCodeUppercase = localStorage.getItem('SettingCountryCode');
    let SettingCountryCode = SettingCountryCodeUppercase && SettingCountryCodeUppercase.toLowerCase();

    if(countryCode == SettingCountryCode &&  SettingCountryCode){
     // this.router.navigate([countryCode + "/" + setLanguageSetting]);
     // console.log('current country,and setting country are same or no setting counrty')
    // console.log('back to home countryCode',countryCode);

     let x = countryCode + "/" + setLanguageSetting;
 window.location.replace(x);
    }else{
 let x = countryCode + "/" + setLanguageSetting;

 window.location.replace(x);
  
  }
  }
  
  bck(){
    
      let isAffBooking = sessionStorage.getItem('isAffBooking');
      let countryCode = localStorage.getItem('countryCode').toLowerCase();
      let setLanguageSetting = 'en';
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
       
        let c = countryCode + "/" + setLanguageSetting;

        window.location.replace(c);
      }
  
     
  
    
  }
  editflight() {
    localStorage.removeItem('BOOKRN');
    localStorage.removeItem('bookingURL');
    sessionStorage.removeItem('booking-type');
    // this.formdata.unsubscribe();
    localStorage.removeItem('sortedBy');
    localStorage.removeItem('currentindex');
    localStorage.removeItem('checkedList1');
    localStorage.removeItem('currentindex');
  localStorage.removeItem('Filtered_Data');
  localStorage.removeItem('click');
  this.bck();
  

   }

  getbookingdetails(){

this.flightService.bookingConfirmationapi(this.bookingRefNo).subscribe(res=>{


this.bookingdetail = res;
this.flightDetails = res['flightDetails'];
this.passengerDetails = res['passengerDetails'];
this.fareDetails = res['fareDetails'];
this.adultDetail = res['fareDetails']['adultDetailConfirmationModel'];
this.childDetail = res['fareDetails']['childDetailConfirmationModel'];
this.infantDetail = res['fareDetails']['infantDetailConfirmationModel'];
this.bookingStatus = res['bookingStatus'];
this.curruency = res['fareDetails']['curruency'];
this.onlineConvinenceFees = this.fareDetails.onlineConvinenceFees



this.onlineConvinenceFees = this.onlineConvinenceFees ? this.onlineConvinenceFees : 0;
this.pdfurl = res['invoiceUrl']
this.onlineRuleAutoTicketing = res['onlineRuleAutoTicketing'];

this.markupPrice = res['fareDetails']['markupPrice'];
this.serviceCharge = res['fareDetails']['serviceCharge'];

this.markupPrice = this.markupPrice ? this.markupPrice : 0;
this.serviceCharge = this.serviceCharge ? this.serviceCharge : 0;


if(this.bookingStatus == 'Booked'){
  this.tripService.clearAllUpcomingTriptCache();
}

if(this.adultDetail.length != 0){
  this.adulttotal = this.adultDetail.length*this.adultDetail[0]["flightFare"] + this.adultDetail.length*this.adultDetail[0]["feeNTaxes"] + this.adultDetail.length*this.adultDetail[0]["fees"];;

}
if(this.childDetail.length != 0){
  this.childtotal = this.childDetail.length*this.childDetail[0]["flightFare"] +  this.childDetail.length*this.childDetail[0]["feeNTaxes"] +  this.childDetail.length*this.childDetail[0]["fees"];
 

  

}
if(this.infantDetail.length != 0){
  this.infantttotal = this.infantDetail.length*this.infantDetail[0]["flightFare"]+ this.infantDetail.length*this.infantDetail[0]["feeNTaxes"] + this.infantDetail.length*this.infantDetail[0]["fees"];


}
this.grandtotal = this.adulttotal + (this.childtotal ? this.childtotal : 0) + (this.infantttotal ? this.infantttotal : 0);

if(this.bookingStatus == 'failed' || this.bookingStatus == 'Not Booked'){


  this.grandtotal = this.grandtotal + this.onlineConvinenceFees;
  this.grandtotal =   this.grandtotal - this.fareDetails.discount;
    this.grandtotal = Math.ceil(this.grandtotal);
}else{
  this.grandtotal = this.grandtotal + this.onlineConvinenceFees;
  this.grandtotal =   this.grandtotal - this.fareDetails.discount;
    this.grandtotal = Math.ceil(this.grandtotal);
  
}




//calculation for grand total of adult ,child & infant
this.spinner.hide();
this.maildata = JSON.stringify(res)




})
  }

// bookingmail(){

//   var model = {
//       "countryCode": this.countryCode,
//       "mailContent": this.maildata,
//       "mailTitle": "PWA",
//       "to": this.loginemail
//   }
//   console.log('booking mail req body',model);

//   this.flightService.flightBookEmail(model).subscribe((res)=>{
// console.log('booking mail response',res);
//   })
// }




bokmail(){
  
}


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribebooking.unsubscribe();
    //alert('hello');
  }

  gotohome(){
    
// this.router.navigate(['/']);

let countryCode = localStorage.getItem('countryCode').toLowerCase();
let setLanguageSetting = 'en';
this.router.navigate([countryCode + "/" + setLanguageSetting]);
localStorage.removeItem('BOOKRN');


// this.router.navigate(['/confirm-flight'])

  }

//   ngOnDestroy(): void {
//     this.listener();
// }

}
