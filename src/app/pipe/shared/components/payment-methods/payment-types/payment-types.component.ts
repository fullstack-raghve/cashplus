import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { FlightService } from "src/app/services/flight.service";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { Subscriber, Subscription } from "rxjs";
import * as moment from "moment";
import * as country from "../../../../../constants/new-countries.constant";
import { OverlayService } from 'src/app/services/overlay.service';
import swal from "sweetalert2";

@Component({
  selector: "app-payment-types",
  templateUrl: "./payment-types.component.html",
  styleUrls: ["./payment-types.component.scss"],
})
export class PaymentTypesComponent implements OnInit {
  returwaydata: any;
  navtoshow: boolean = false;
  sliderOpts = {
    zoom: false,
    slidesPerView: 2.5,
    spaceBetween: 5,
  };
  newdatas: any;
  navlist = [];
  subscribe: any;
  selectedflight2: any;
  selectedflightreturnway: any;
  adult: any;
  children: any;
  infants: any;
  adultdefault: any;
  selectedflight: any;
  finalorigin: any;
  finaldest: any;
  myeconomyonward: any;
  myeconomyreturn: any;
  departDate: any;
  returnDate: any;
  multiflight: any;
  cp: any;
  cprice: any;
  travSub: Subscription;
  threeCC: any;
  fourMP: any;
  allPassengerData;
  banktrannsfer: any;
  cod: any;
  exhangehouse: any;
  branchId: string;
  groupId: string;
  searchKey: string;
  countryId: string;
  countryCode: string;
  selectedFlightOptionKey: string;
  tripType: string;
  searchPageURL: string;
  travllerDetailsUrl: string;
  serviceVendor: string;
  obj;
  bankDepositAllowed: any;
  exchangeHouseAllowed: any;
  array = ['Amadeus','Indigo','Spice','Travelfusion','Galileo','Sabre'];
  nopg: boolean = false;
  branchMob: string;
  branchEmailId: string;
  qt: string;
  isQuickteller: any;
  fareConfirmReqKeyLocal: string;
  tncurl: any;
  isCashplus: any;
  constructor(
    private router: Router,
    private sendTravllerDataService: SendTravllerDataService,
    public navCtrl: NgxNavigationWithDataComponent,
    private flightService: FlightService,
    private overlayService: OverlayService
  ) {
  
  }

  ngOnInit() {
    this.branchMob = localStorage.getItem('BranchcontactNo');
    this.branchEmailId =  localStorage.getItem('branchEmailId');
    this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');

    this.flightService.getDataFromTraveller().subscribe(response => {
      let data = response;
      this.obj={
        "statusCode": data['statusCode'] ?  data['statusCode'] :true, 
        "statusMessage": data['statusMessage'] ? data['statusMessage'] :true ,
        "passportValidation":data['passportValidation'] == true ? true:(data['passportValidation'] == false ? false:true),
        "nationalityValidation":   data['nationalityValidation'] == true ? true:(data['nationalityValidation'] == false ? false:true),
        "dobValidation": data['dobValidation']  == true  ? true:(data['dobValidation'] == false ? false:true)
      }
     
    }); 
    

  this.getAllCountryList();
    
    this.tripType = sessionStorage.getItem("tripType");
    this.searchPageURL = sessionStorage.getItem("searchPageURL");
    this.travllerDetailsUrl = sessionStorage.getItem("travllerDetailsUrl");

    //console.log(this.tripType);
    let branchCode = localStorage.getItem("branchCode");
    this.branchId = localStorage.getItem("branchId");
    this.groupId = localStorage.getItem("groupId");
    this.searchKey = sessionStorage.getItem("searchKey");
    this.countryId = localStorage.getItem("countryId");
    this.countryCode = localStorage.getItem("countryCode");
    this.serviceVendor = sessionStorage.getItem("serviceVendor");
    //console.log('serviceVendor is paymny page',this.serviceVendor);

    this.selectedFlightOptionKey = sessionStorage.getItem(
      "selectedFlightOptionKey"
    );
  //  //console.log(this.selectedFlightOptionKey);
let loginemailid = localStorage.getItem('loginemail');
////console.log('loginemail is',loginemailid);

    let passengersList = JSON.parse(sessionStorage.getItem("passengersList"));
    this.allPassengerData = passengersList;


    this.allPassengerData.forEach((element,i) => {
     
      if(element.type.toString() == 'A')
      {
        element.dob = this.obj['dobValidation'] == true ?moment(element.dob, "DD/MM/YYYY").format("YYYY-MM-DD"):null;
      }      
      else{
        element.dob = moment(element.dob, "DD/MM/YYYY").format("YYYY-MM-DD");
      }       
      element.passportExpiryDate = this.obj['passportValidation'] == true ? moment(element.passportExpiryDate, "DD/MM/YYYY").format("YYYY-MM-DD"):null;
    element.nationality =this.obj['nationalityValidation'] == true? this.getSelectedCountry(element.nationality):null;

      element.title = element.tittle.toString();
      if(element.type.toString() == 'A')
      {
        if(i==0){
            element.email = (element.travellerDataNew == null || element.travellerDataNew == '') ? loginemailid  : (element.travellerDataNew['email'] == null || element.travellerDataNew['email'] =='') ? loginemailid : element.travellerDataNew['email'] ;
        }
        else
          element.email = null;         
      }     
      else{
        element.email = null;
      }     
      if(element.type.toString() == 'A')
      {
        if(i==0){
            element.isdCode = element.isdCode;
            element.mobileNo = element.mobileNo;
          }
        else
         {
           element.isdCode = null;
           element.mobileNo = null;
        }      
      }     
      else
         {
           element.isdCode = null;
           element.mobileNo = null;
        }      
      element.passportNo = this.obj['passportValidation'] == true ? element.passportNo :null;
      delete element.userImage;
      delete element.tittle;
      delete element.travellerDataNew;
      delete element.getIsTravellerSelected;
      delete element.isValue;
    });

    this.checkBooknHold();

 let body =
{
"branchCode": branchCode,
"branchId": this.branchId,
"countryId": this.countryId
}
    this.flightService.paymethod(body).subscribe((res) => {
      let finaldata = res;

this.bankDepositAllowed = finaldata['bankDepositAllowed'];
this.exchangeHouseAllowed = finaldata['exchangeHouseAllowed'];



     let collectCashFromLocationAllowed = finaldata['collectCashFromLocationAllowed'];
localStorage.setItem("collectCashFromLocationAllowed",collectCashFromLocationAllowed);

      this.newdatas = finaldata["paymentMap"];


      if (this.newdatas["3-Credit Card"] && this.newdatas["3-Credit Card"][0]) {
        this.threeCC = this.newdatas["3-Credit Card"][0];

      }
      if (
        this.newdatas["4-Mobile Payment"] &&
        this.newdatas["4-Mobile Payment"][0]
      ) {
        this.fourMP = this.newdatas["4-Mobile Payment"][0];
      }
      if (
        this.newdatas["6-Cash On Delivery"] &&
        this.newdatas["6-Cash On Delivery"][0]
      ) {
        this.cod = this.newdatas["6-Cash On Delivery"][0];
      }
      if (
        this.newdatas["7-Bank Transfer"] &&
        this.newdatas["7-Bank Transfer"][0]
      ) {
        this.banktrannsfer = this.newdatas["7-Bank Transfer"][0];
      }
      if (
        this.newdatas["8-Exchange House"] &&
        this.newdatas["8-Exchange House"][0]
      ) {
        this.exhangehouse = this.newdatas["8-Exchange House"][0];
      }

      ////
      if (
        this.newdatas["10-Quickteller"] &&
        this.newdatas["10-Quickteller"][0]
      ) {
        this.isQuickteller = this.newdatas["10-Quickteller"][0];
      }

      if (
        this.newdatas["11-Cash Plus"] &&
        this.newdatas["11-Cash Plus"][0]
      ) {
        this.isCashplus = this.newdatas["11-Cash Plus"][0];
      }

      
    this.isCashplus = '11-Cash Plus';
     // this.isQuickteller = '10-Quickteller';

     
      
      if(this.fourMP == undefined && this.threeCC  == undefined){
this.nopg = true;
      //console.log('both are defined');

      }else{
        this.nopg = false;

      }

     



    });

    this.getsingleflight();
    this.gettravllerfromservice();
    this.odddata();
    this.getsingleflightmulti();
    this.checkvendor();
    this.gettermcondition();
  }


////**fare calculate


checkvendor() {
  if (this.array.includes(this.serviceVendor)) {
    this.fareCheck();
    this.presentLoading();
  }
 
}


fareCheck() {
  var reqbody = {
    fareConfirmRequestKey: this.fareConfirmReqKeyLocal,
    selectedFlightOptionKey: this.selectedFlightOptionKey,
    passengerList:this.allPassengerData
  };

  this.flightService.fareRecheck(reqbody).subscribe((res) => {
   
      if (this.tripType == "oneway") {
        let resOnward = res['onwardFlightOption']
       let onewayfarerechk = resOnward.flightFare.totalBaseFare + resOnward.flightFare.totalTax + resOnward.flightFare.totalFees + resOnward.flightFare.markupPrice + resOnward.flightFare.serviceChargePrice - resOnward.flightFare.discountPrice;
       this.flightService.sendFare(onewayfarerechk)

       this.closeLoading();

      


       this.lowprice(onewayfarerechk);
      }
      if (this.tripType == "multicity") {
        let resOnward = res['onwardFlightOption']
       let displayfaremultirechk = resOnward.flightFare.totalBaseFare + resOnward.flightFare.totalTax + resOnward.flightFare.totalFees + resOnward.flightFare.markupPrice + resOnward.flightFare.serviceChargePrice - resOnward.flightFare.discountPrice;
       this.flightService.sendFare(displayfaremultirechk)
       this.closeLoading();
       //console.log('fare rechk fare multicity PTC>>>>>>>>>>>', displayfaremultirechk)
      
       
      
        this.lowpriceM(displayfaremultirechk);

      }
      if (this.tripType == "returnway") {
       let  displayfarereturnwayrechk  = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
       this.flightService.sendFare(displayfarereturnwayrechk)
       this.closeLoading();
       //console.log('fare rechk fare returnnway PTC>>>>>>>>>', displayfarereturnwayrechk)
      
    
       this.lowpriceR(displayfarereturnwayrechk);

      }
   
   // }
  });
}



lowprice(displayfareoneway){

  if (displayfareoneway<1) {
    //alert('APIs Technical Error');
    swal.fire(
      "This flight is no more available",
      "Please select another flight",
      "error"
    );
    this.router.navigate([this.searchPageURL]);
  }
}
lowpriceR(displayfareoneway){

  if (displayfareoneway<1) {
    //alert('APIs Technical Error');
    swal.fire(
      "This flight is no more available",
      "Please select another flight",
      "error"
    );
    this.router.navigate([this.searchPageURL]);
  }
}

lowpriceM(displayfareoneway){

  if (displayfareoneway<1) {
    //alert('APIs Technical Error');
    swal.fire(
      "This flight is no more available",
      "Please select another flight",
      "error"
    );
    this.router.navigate([this.searchPageURL]);
  }
}


///** fare cal end */
  allCountryList: any;
  newCountryList = [];
  getAllCountryList() {
    this.allCountryList = country.countries;
    this.allCountryList.forEach(element => {
      this.newCountryList.push({
        countryCode: element["countryCode"],
        countryId: element["countryId"],
        countryName: element["countryName"],
        phoneCode: element['phoneCode']
      });
    });
  }
  getSelectedCountry(id) {
    let currentCounrt = this.newCountryList.filter(res => {
      return res["countryId"] == id;
    });
    return currentCounrt[0]['countryCode'];
  }
  ionViewWillEnter() {
    let bookingURL = localStorage.getItem('bookingURL');
   // //console.log("i am ion view qill enter .>>payment types");
    this.geturl(bookingURL);
  }
  backTo() {
    this.router.navigate(["/traveller-details"]);
   // this.router.navigate([this.travllerDetailsUrl]);
  }


 
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
 

  editflight2() {
    // this.router.navigate(["/search-flights"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    ///let url = countryCode + "/" + setLanguageSetting + '/search-flights';
    let url = countryCode + "/" + setLanguageSetting;

    this.router.navigate([url]);
    //window.location.replace(url);
  }

  
  index: number = 0;

  openNext() {
      this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
      this.index = (this.index === 0) ? 2 : this.index - 1;
  }


  gettravllerfromservice() {
    this.travSub = this.sendTravllerDataService
      .gettravller()
      .subscribe((res) => {
        //console.log(res);
        var info = res["trvllerfield"];
        this.adultdefault = res.adult;
        this.adult = info.adult;
        this.children = info.children;
        this.infants = info.infants;

      //  //console.log(this.adult);
       // //console.log(this.children);
     //   //console.log(this.infants);
      });
  }

  getsingleflightmulti() {
    this.subscribe = this.flightService
      .getselectedFlightmulti()
      .subscribe((res) => {
        if (res) {
        //  //console.log(res);
          this.multiflight = res["onwardFlightOption"];
          this.cp = res["currentPrice"];
        } else {
        }
      });
  }

  odddata() {
    this.flightService.getoddata().subscribe((res) => {
     // //console.log(res);
      this.finalorigin = res.returnwayOrigin;
      this.finaldest = res.returnwaydestination;

      this.myeconomyonward = res.myeconomyonward;
      this.myeconomyreturn = res.myeconomyreturn;

      this.departDate = res.returnwaydepartDate;
      this.returnDate = res.returnwayreturnDate;

      // this.reqdepartdate = this.convertdepart(this.departDate);
      // this.reqreturndate = this.convertdepart(this.returnDate)

      // //console.log(this.reqdepartdate);
      // //console.log(this.reqreturndate)
    });
  }

  ngOnDestroy() {
    this.travSub.unsubscribe();
  }
  getReponse = false;
  getsingleflight() {
    this.subscribe = this.flightService.getselectedFlight().subscribe((res) => {
      if (res) {
       // //console.log(res);
        this.cprice = res["currentPrice"];
        this.getReponse = true;
        ///response -oneway start
        this.selectedflight2 = res["onwardFlightOption"];
        this.selectedflight = res["onwardFlightOption"];
       // //console.log("Selected 2" + this.selectedflight2);
        //  //console.log("Selected 1"+ this.selectedflight)
        ///response --oneway end
        ///response -returnway start
        this.selectedflightreturnway = res["roundTripFlightOption"];
        ///response --returnway  end
      }
      else if (res == 'multicity') { }
      else {
        let countryCode = localStorage.getItem('countryCode').toLowerCase();
      //  //console.log(countryCode)
        let setLanguageSetting = 'en';
        this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
        this.getReponse = false;
        ////console.log('page refresh', res);
      }
    });
  }

  checkHoldRes: any;
  autoticketingDisable:any;
  checkBooknHold() {
    let model = {
      branchId: this.branchId,
      selectedFlightOptionKey: this.selectedFlightOptionKey,
      tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
    };
    this.flightService.validateBookAndHold(model).subscribe((res) => {
      ////console.log("book hold res", res);
      this.autoticketingDisable = res['autoticketingDisable'];
      this.checkHoldRes = res["bookAndHold"];
     // //console.log("is book and true", this.checkHoldRes);
    });
  }
  gettermcondition(){
 
    this.flightService.gettermconditions(this.countryCode).subscribe((res) => {
     // //console.log('gettermcondition', res);
      this.tncurl  = res['termsAndServiceUrl'];
    });
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  myyloading:boolean = false;
  geturl(bookingURL){
   // let url = bookingURL;
    if(bookingURL == '/booking-confirmation'){
      this.myyloading = true;
     // //console.log('refreshingggggg>>>>>>>>>>')
    //  //console.log('refreshingggggg bcoz>>>>>>>>>>',bookingURL);

   // this.presentLoading();
    this.editflight2();
     // this.closeLoading();
      localStorage.removeItem('bookingURL');
      // this.flightService.sendhBookingURL('');
    
    }else{
      this.myyloading = false;
    }
//     this.flightService.getBookingURL().subscribe((res)=>{
// //console.log('res of get booking url',res)

//     });

  }

  // @HostListener('window:beforeunload', ['$event'])
  // reloadPage($event){
    // //console.log(this.router.url)
    // let currentUrl = this.router.url
    // let urlAirportList = currentUrl.split("/");
    // let paymentmethods = urlAirportList.includes("payment-methods");
    // //console.log(paymentmethods)
    // if(paymentmethods == true){
    //   return;
    // }
    // $event.preventDefault();
    // $event.returnValue = "Unsaved modifications";
    // return event;
  // }
}

