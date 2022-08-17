import { ApplicationRef, Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SwUpdate } from '@angular/service-worker';
import { HttpParams } from '@angular/common/http';
import { ReactiveFormConfig } from '@rxweb/reactive-form-validators';
import { ConnectionService } from 'ng-connection-service';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert2';
import { Router, NavigationEnd,Event, ActivatedRoute } from '@angular/router';
import { GlobalService } from './services/global.service';
import { OverlayService } from './services/overlay.service';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FlightService } from './services/flight.service';
import { SendTravllerDataService } from './services/send-travller-data.service';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { interval } from 'rxjs';

declare var gtag: Function;
declare let ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  isConnected = true;
  status = 'ONLINE';
  finalorigin: string;
  finaldest: string;
  FlightOnwardCarrier: any;
  children: any;
  infants: any;
  countryCode: string;
  language: string;
  FlightOnwardCabinClass: any;
  adult: any;
  //isDataFromSearchResult: Object;
  isDataFromSearchResult: any;

  fareresponse: Object;
  FlightReturnCabinClass: any;
  cabinclass: number;
  urlccode: any;
  tripTypeAff: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _snackBar: MatSnackBar,
    private connectionService: ConnectionService,
    private route: Router,
    private globalService: GlobalService,
    private overlayService: OverlayService,
    private activeroute: ActivatedRoute,
    private flightService: FlightService,
    private sendTravllerDataService: SendTravllerDataService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private update: SwUpdate,
    private appRef: ApplicationRef
  
  ) {


    this.initializeApp();

    this.updateClient();
    this.checkUpdate();

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        // //console.log(this.status);
        //  this.dialog.alert('network was Disconnected:-()');
        // let snackBarRef1 = this._snackBar.open("You are in ONLINE", "", {
        //   duration: 1000
        // });
        swal.fire("You are Online", 'Internet Connection OK', 'question');

      }
      else {
        this.status = "OFFLINE";
        //  alert("You are in OFFLINE")
        // //console.log(this.status);
        //this.dialog.alert('network was Disconnected:-()');
        //  let snackBarRef1 = this._snackBar.open("You are in OFFLINE", "", {
        //   duration: 1000
        // });
        swal.fire("You are Offline", 'Please Check Your Internet Connection', 'question');

      }
    })

  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  setCountryCodeToURL: any;
  setLanguageSetting: any = 'en';
  getCurrentURL;
  ifUserReload = false;
  ngOnInit() {

    ////console.log('routerurl>>',this.route.url)

   this.getRouterDetails();
    this.reloadPage();


    let countryCode = localStorage.getItem('selectedCountryCode');
    //console.log(countryCode);

    if(countryCode != null){
      //console.log('countryCode APP.COMP',countryCode);
      this.globalService.getDashboard().subscribe(dash => {
        //console.log(dash);
        if (dash['countryList'] != null) {
          let defaultCountry =  dash['countryList'].filter((res) => {
            return res.countryCode == countryCode
          });
          if(defaultCountry && defaultCountry.length == 0){
            localStorage.removeItem("selectedCountry");
            let defaultCountry =  dash['countryList'].filter((res) => {
              return res.defaultCountry == true
            });
            this.setCountryCodeToURL = defaultCountry[0]['countryCode'].toLowerCase();
            //console.log(defaultCountry[0]);
            this.redirectToHomePage();
            // this.getdashBoardById(defaultCountry[0]['countryCode']['countryId']);
          }else{
            this.setCountryCodeToURL = countryCode.toLowerCase();
            this.setParameterToUrl();
          }
        }
      });

    }else{
      this.loaddashboard();
    }

    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {

    //     if (confirm("New version available. Load New Version?")) {

    //       window.location.reload();
    //     }
    //   });
    // }
    ReactiveFormConfig.set({
      "internationalization": {
        "dateFormat": "dmy",
        "seperator": "/"
      },
      "validationMessage": {
        "alpha": "Only alphabets are allowed.",
        "alphaNumeric": "Only alphabet and numbers are allowed.",
        "compare": "inputs are not matched.",
        "contains": "value is not contains in the input",
        "creditcard": "Creditcard number is not correct",
        "digit": "Only digit are allowed",
        "email": "Email is not valid",
        "greaterThanEqualTo": "please enter greater than or equal to the joining age",
        "greaterThan": "Please enter greater than to the joining age",
        "hexColor": "Please enter hex code",
        "json": "Please enter valid json",
        "lessThanEqualTo": "please enter less than or equal to the current experience",
        "lessThan": "please enter less than or equal to the current experience",
        "lowerCase": "Only lowercase is allowed",
        "maxLength": "Maximum length is 10 digit",
        "maxNumber": "Enter value less than equal to 3",
        "minNumber": "Enter value greater than equal to 1",
        "password": "Please enter valid password",
        "pattern": "Please enter valid zipcode",
        "range": "Please enter age between 18 to 60",
        "required": "This field is required",
        "time": "Only time format is allowed",
        "upperCase": "Only uppercase is allowed",
        "url": "Only url format is allowed",
        "zipCode": "Enter valid zip code",
        "minLength": "Minimum length is 10 digit",
        "numeric": 'Only numbers are allowed.',
        "nameoncard": 'Only numbers are allowed.',
        "composeMessageKey":"Maximum 20 characters are allowed."

      }
    });


    const navEndEvent$ = this.route.events.pipe(
      filter(e => e instanceof NavigationEnd),
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      var x = e.urlAfterRedirects;
      var countycodeInurl_splits = x.split('/');
      this.urlccode = countycodeInurl_splits[1];

     // //console.log('url have urlccode1',this.urlccode);
     // //console.log('url have urlccode2',countycodeInurl_splits[2]);


    ////console.log(e.urlAfterRedirects);
     // let url = this.route.url;
  this.affliateRedirect(e.urlAfterRedirects);

      if(environment.trackingAnalytics){
        // gtag('config', 'UA-60319074-20', {
        gtag('config', window.localStorage.getItem("gaTagCode"), {
          'page_path':window.location.href
        }
          );
      }


      // ga('set', 'page', e.urlAfterRedirects);
      // ga('send', 'pageview');
    });
    this.getParamValueQueryString('idValue')
  }

  updateClient() {
    if (!this.update.isEnabled) {
      return;
    }
    this.update.available.subscribe((event) => {
     // //console.log(`current`, event.current, `available `, event.available);
      if (confirm('update available for the app please conform')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });

    this.update.activated.subscribe((event) => {
      //console.log(`current`, event.previous, `available `, event.current);
    });
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {

        //const timeInterval = interval(5000);

        const timeInterval = interval(240 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() =>
           console.log('checked')
           );
        });
      }
    });
  }

  getRouterDetails() {
    const navEndEvent$ = this.route.events.pipe(
      filter(e => e instanceof NavigationEnd),
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      this.closeLoading();
    });
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
  getdashBoardById(countryId){
    this.globalService.getDashboardByid(countryId).subscribe(
      (res)=>{
        let branchdata = res['branchResponse']
        // this.setDataInLocalStorage(branchdata['branchCurrencyCode'], 'English', res['countryName'] )
      }
    )
   }
  setDataInLocalStorage(settingcurenncy, settinglanguage, selectedCountry){
    localStorage.setItem("SettingsCurrency", settingcurenncy);
   localStorage.setItem("SettingsLanguage", settinglanguage);
   localStorage.setItem("selectedCountry",selectedCountry);
 }
  reloadPage(){
    this.getCurrentURL= window.location.href.split("/");
    // //console.log('url>>>>',this.getCurrentURL);
     if(this.getCurrentURL.includes('affiliate')){
      // this.presentLoading();
     }
    let arrayReloadUrl = ['traveller-details','flight-review', 'baggage-details', 'fare-rules', 'SimilarFlights', 'payment-methods' ]
    if(this.getCurrentURL.includes('traveller-details') || this.getCurrentURL.includes('flight-review') || this.getCurrentURL.includes('baggage-details') || this.getCurrentURL.includes('fare-rules') || this.getCurrentURL.includes('SimilarFlights') || this.getCurrentURL.includes('payment-methods') || this.getCurrentURL.includes('confirming-booking?idValue')){
      let countryCode = localStorage.getItem('countryCode');
      //console.log('countryCode',countryCode)

      if(countryCode != null){
        //console.log(countryCode)
        let setLanguageSetting = 'en';
       // this.route.navigate([countryCode.toLowerCase() + "/" + setLanguageSetting + '/search-flights']);
        this.route.navigate([countryCode.toLowerCase() + "/" + setLanguageSetting]);
        //console.log('yes reload booking')

      } else{
        //console.log('yes reload traveller')
        this.ifUserReload = true;
        this.loaddashboard();
      }
    }
  }

  hasSubArray(master, sub) {
    return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
}
  ionViewWillEnter() {
    //console.log('enter')
    this.getParamValueQueryString('idValue')

    //console.log(this.getParamValueQueryString('idValue'))
  }

  getParamValueQueryString(paramName) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }

setParameterToUrl(){

  this.reloadScript();

  if(this.ifUserReload == true){
    window.location.replace('/');
    return;
  }

  let currentUrl = window.location.href.split("/");
  //console.log(currentUrl)
  if (currentUrl[currentUrl.length -1] == "") {
   // alert('hllo')

    //console.log(currentUrl)

    let getGA = localStorage.getItem('gaTagCode');
    const gA = `https://www.googletagmanager.com/gtag/js?id=${getGA}`;
    window.localStorage.setItem('gaURL', gA);

    this.route.navigate([
      this.setCountryCodeToURL +
      "/" +
      this.setLanguageSetting
    ]);
  }

}


redirectToHomePage(){
  //alert('hllo2')
  this.route.navigate([
    this.setCountryCodeToURL +
    "/" +
    this.setLanguageSetting
  ]);
 // //console.log('url>>>',this.route.url)

}

presentLoading() {
  this.overlayService.showLoader();
}


affMode:boolean = false;
affliateRedirect(url){
  
if(url.includes('affiliate')){
  this.affMode = true;
  if(this.affMode){
  //  this.presentLoading();
  this.spinner.show();

  }

this.flightService.clearTnc();
this.flightService.clearfullfareRule();
this.flightService.sendAffdata(this.affMode);

sessionStorage.setItem('booking-type','affiliate');

//this.presentLoading();


let token = this.activeroute.snapshot.queryParams.affilate_token;
let session = this.activeroute.snapshot.queryParams.session;
const reqbody = {
  "affiliateSession":session,  //"affid101@@@1791@@@107@@@2801",
  "affiliateToken":  token
}
////console.log('affliate flight reqbody>>>',reqbody);

this.globalService.getAffliateFlight(reqbody).subscribe(res=>{
  //console.log('affliate flight response>>>',res);
///
//this.closeLoading();
   if(res['statusMessage']=='success'){
   // this.presentLoading();

    this.isDataFromSearchResult = true;
    this.setBranchInfo(res)
     
     this.getCokkiesData();

     let tripIs =  res['flightWidget']['tripType']    
     this.tripTypeAff = tripIs.toLowerCase();
     this.setAffdataLocal(res);
     
   }else{
    this.cacheExpired();
    //console.log('no response');
//return;
   }
  //  //  
      


///oneway start
       if(this.tripTypeAff =='oneway'){
        //console.log('OneWay>>affiliate');

         this.fareConfirm_oneway(res);
         let flightSearchKey = res['flightSearchKey']
         sessionStorage.setItem("searchKey", flightSearchKey);
       }
///RoundTrip
if(this.tripTypeAff =='roundtrip'){
  //console.log('RoundTrip>>affiliate',this.tripTypeAff);

this.fareConfirm_roundtrip(res);
let flightSearchKey = res['flightSearchKey']
sessionStorage.setItem("searchKey",flightSearchKey);
}






})


}else{
  sessionStorage.removeItem('booking-type')
 // //console.log('nomal flow - no affiliate');
}

}

fareConfirm_oneway(res){
  //console.log('OneWay>>affiliate');

let mydata =  res;
  this.FlightOnwardCabinClass = res['onwardFlightOption']['flightFare']['cabinClass'];
  this.calculateCC(this.FlightOnwardCabinClass);

  this.FlightOnwardCabinClass == 'ECONOMY' ? this.FlightOnwardCabinClass = 'Economy' : this.FlightOnwardCabinClass;
  this.FlightOnwardCabinClass == 'PREMIUM ECONOMY' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;
  this.FlightOnwardCabinClass == 'BUSINESS' ? this.FlightOnwardCabinClass = 'Business' : this.FlightOnwardCabinClass;
  this.FlightOnwardCabinClass == 'FIRST CLASS' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;

  this.finaldest =  res['onwardFlightOption']['destination'];
  this.finalorigin =  res['onwardFlightOption']['origin'];
  this.FlightOnwardCarrier =  res['onwardFlightOption']['platingCarrier'];

  this.adult = res['flightWidget']['noOfAdults'];
  this.children = res['flightWidget']['noOfChilds'];
  this.infants = res['flightWidget']['noOfInfants'];
  let onwrdDate = moment(res['onwardFlightOption']['flightlegs'][0]['depDate'], "YYYY-MM-DD").format("DD-MM-YYYY")

const fareitem = {
    "affilatePartnerId": res['affiliatePartnerId'],
    "bookingType": "affiliate",
    "countryId": res['countryId'],
    "curruencyCode":  res['onwardFlightOption']['flightFare']['currency'],
    "flightOptionKey":  res['selectedFlightKey'],
    "flightSearchKey": res['flightSearchKey'],
    "flightSearchWidgetList": [
      {
        "cabinClass": this.cabinclass,
        "destination":this.finaldest,
        "onwardJourneyDate": onwrdDate,
        "origin": this.finalorigin,
        "returnJourneyDate": '01-02-2022'
      }
    ],
    "groupId":   +res['branchResponse']['groupId'],
    "noOfAdult":  +this.adult,
    "noOfChild": +this.children,
    "noOfInfant":  +this.infants,
    "tripType": "oneway"
  //


}
///api call

//console.log('fareconfirm api req body affiliate oneway>>',fareitem);
this.flightService.fareConfirmapi(fareitem).subscribe(res => {
 
  this.globalService.sendFareConfirmRequestToComponent(fareitem)

   //console.log('fareConfirmapi res oneway',res);
   this.fareresponse = res;
  if (res) {
    if(res['onwardFlightOption'] == null){
     // this.flightService.selectedFlight(null);
    }else{
    ///send selected flights to confirm-flight component
     // this.flightService.selectedFlight(res);
    }
    

   sessionStorage.setItem('fareConfirmReqKey',res['fareConfirmReqKey']);
   sessionStorage.setItem('selectedFlightOptionKey',res['selectedFlightOptionKey']);

   let serviceVendor=  res['serviceVendor'];
   sessionStorage.setItem('serviceVendor',serviceVendor);
   sessionStorage.setItem('isUccflight',res['isUccflight']);
   sessionStorage.setItem('isuccfTxnValue',res['uccfTxn']);
   sessionStorage.setItem('affilatePartnerId',res['affiliatePartnerId']);
   
   sessionStorage.removeItem("returnwayreturnDate");

 this.routerCalculation(mydata);

  }
});

///api call -end
}

calculateCC(cc){
    if (cc === "ECONOMY") {   
      this.cabinclass = 1;
    } else if (cc === "PREMIUM ECONOMY") { 
      this.cabinclass = 2;
    } else if (cc === "BUSINESS") {
      this.cabinclass = 3;
    } else if (cc === "FIRST CLASS") {
      this.cabinclass = 4;
    } else {
    }
  
  
}

fareConfirm_roundtrip(res){
  //console.log('fare confirm roundtrip mathod');
  let mydata =  res;
    this.FlightOnwardCabinClass = res['roundTripFlightOption']['onwardFlightOption']['flightFare']['cabinClass'];
    this.calculateCC(this.FlightOnwardCabinClass);

    this.FlightOnwardCabinClass == 'ECONOMY' ? this.FlightOnwardCabinClass = 'Economy' : this.FlightOnwardCabinClass;
    this.FlightOnwardCabinClass == 'PREMIUM ECONOMY' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;
    this.FlightOnwardCabinClass == 'BUSINESS' ? this.FlightOnwardCabinClass = 'Business' : this.FlightOnwardCabinClass;
    this.FlightOnwardCabinClass == 'FIRST CLASS' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;

    this.FlightReturnCabinClass = res['roundTripFlightOption']['returnFlightOption']['flightFare']['cabinClass'];
   
    this.FlightReturnCabinClass == 'ECONOMY' ? this.FlightReturnCabinClass = 'Economy' : this.FlightReturnCabinClass;
    this.FlightReturnCabinClass == 'PREMIUM ECONOMY' ? this.FlightReturnCabinClass = 'Premium' : this.FlightReturnCabinClass;
    this.FlightReturnCabinClass == 'BUSINESS' ? this.FlightReturnCabinClass = 'Business' : this.FlightReturnCabinClass;
    this.FlightReturnCabinClass == 'FIRST CLASS' ? this.FlightReturnCabinClass = 'First' : this.FlightReturnCabinClass;
   
    this.finalorigin =  res['roundTripFlightOption']['onwardFlightOption']['origin'];

    this.finaldest =  res['roundTripFlightOption']['onwardFlightOption']['destination'];
    this.FlightOnwardCarrier =  res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'];
  
    this.adult = res['flightWidget']['noOfAdults'];
    this.children = res['flightWidget']['noOfChilds'];
    this.infants = res['flightWidget']['noOfInfants'];

   // let onwrdDate = moment(res['roundTripFlightOption']['onwardFlightOption']['onwardJourneyDate'], "YYYY-MM-DD").format("DD-MM-YYYY");
   // let returnDate = moment(res['roundTripFlightOption']['returnFlightOption']['onwardJourneyDate'], "YYYY-MM-DD").format("DD-MM-YYYY");

        let onwrdDate = moment(res['roundTripFlightOption']['onwardFlightOption']['flightlegs'][0]['depDate'], "YYYY-MM-DD").format("DD-MM-YYYY");
    let returnDate = moment(res['roundTripFlightOption']['returnFlightOption']['flightlegs'][0]['depDate'], "YYYY-MM-DD").format("DD-MM-YYYY");

  let currencycode = res['roundTripFlightOption']['currency'];
  const fareitem = {
    "affilatePartnerId": res['affiliatePartnerId'],
      "bookingType": "affiliate",
      "countryId": res['countryId'],
      "curruencyCode":  currencycode,
      "flightOptionKey":  res['selectedFlightKey'],
      "flightSearchKey": res['flightSearchKey'],
      "flightSearchWidgetList": [
        {
          "cabinClass": this.cabinclass,
          "destination":this.finaldest,
          "onwardJourneyDate": onwrdDate,
          "origin": this.finalorigin,
          "returnJourneyDate": returnDate
        }
      ],
      "groupId": +res['branchResponse']['groupId'],
      "noOfAdult":  +this.adult,
      "noOfChild": +this.children,
      "noOfInfant":  +this.infants,
      "tripType": "RoundTrip"
    //
  
  
  }
  ///api call
  
      ////console.log('fareconfirm api aff RoundTrip>>',fareitem);
  this.flightService.fareConfirmapi(fareitem).subscribe(response => {
     /// //console.log('fareConfirmapi res RoundTrip',response);
     this.globalService.sendFareConfirmRequestToComponent(fareitem)

     this.fareresponse = response;
    if (response) {
    

     sessionStorage.setItem('fareConfirmReqKey',res['fareConfirmReqKey']);
     sessionStorage.setItem('selectedFlightOptionKey',res['selectedFlightOptionKey']);
    
     let serviceVendor=  response['serviceVendor'];
     sessionStorage.setItem('serviceVendor',serviceVendor);
     sessionStorage.setItem('isUccflight',response['isUccflight']);
     sessionStorage.setItem('isuccfTxnValue',response['uccfTxn']);
    
     sessionStorage.setItem('affilatePartnerId',response['affiliatePartnerId']);
     
     
     // this.globalService.sendFareConfirmRequestToComponent(fareitem)
   this.routerCalculation_roundtrip(mydata);
  
    }
  });
  
  ///api call -end
  }
  


routerCalculation(res){
  sessionStorage.setItem('booking-type','affiliate');

     this.sendDataToConfirmFlight();

     this.flightService.sendflightdetails(this.fareresponse);

     this.flightService.selectedFlight(this.fareresponse);
     this.flightService.sendsimilarflight(this.fareresponse);
     this.flightService.sendsimilarflightreturnway("");
     this.flightService.sendsimilarflightmulti("");

     let countryCodeAffiliate =  sessionStorage.getItem('countryCodeAffiliate')




     let field = {
       adult:  +this.adult,
       children:+this.children,
       infants: +this.infants,
       // type: this.data.type
     };
     this.sendTravllerDataService.sendtravllers(field);


     sessionStorage.setItem('tripType', 'oneway');
     sessionStorage.setItem('TripType', 'Oneway');

    // this.countryCode = 'in';
     this.language = 'en';




     let returnwaydepartDate =  res['onwardFlightOption']['flightlegs'][0]['depDate'];
     sessionStorage.setItem('returnwaydepartDate',moment(returnwaydepartDate, "YYYY-MM-DD").format("DD-MM-YYYY"));
     
     this.globalService.sendReturnDataDate(moment(returnwaydepartDate, "YYYY-MM-DD").format("DD-MM-YYYY"));

     ///this.globalService.sendReturnDataDate(onwardJourneyDate);
     let data= {
       economy: "",
myeconomyonward:  this.FlightOnwardCabinClass,
returnwayOrigin:this.finalorigin,
returnwaydepartDate:  moment(returnwaydepartDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
returnwaydestination:  this.finaldest,
travellerfield: ""
    }
    ////console.log('afflate onwrd data>>',data);
    this.flightService.sendoddata(data);

     let maskUrlforAdult = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+this.adult+'Adult'+'/'+this.FlightOnwardCarrier+'/Oneway';
     let maskUrlforAdultChild = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+this.adult+'Adult'+'/'+this.children+'Child'+'/'+this.FlightOnwardCarrier+'/Oneway';
     let maskUrlforAdultChildInfant = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+this.adult+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Oneway';
     let maskUrlforAdultInfant = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+this.adult+'Adult'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Oneway';

    // //console.log('adult,child,infant',this.adult,this.children,this.infants);
   
    
if(this.adult >= 1 && this.children == 0 && this.infants ==0){

  this.route.navigate([maskUrlforAdult]);

  this.spinner.hide();

    

////console.log('adult,child,infant',this.adult,this.children,this.infants)
}
if(this.adult >= 1 && this.children >= 1 && this.infants ==0){
this.route.navigate([maskUrlforAdultChild]);
this.spinner.hide();

//console.log('adult,child,infant',this.adult,this.children,this.infants)

}if(this.adult >= 1 && this.children >= 1 && this.infants >=1){
this.route.navigate([maskUrlforAdultChildInfant]);
this.spinner.hide();

//console.log('adult,child,infant',this.adult,this.children,this.infants)

}if(this.adult >= 1 && this.children == 0 && this.infants >=1){
this.route.navigate([maskUrlforAdultInfant]);
this.spinner.hide();

//console.log('adult,child,infant',this.adult,this.children,this.infants)

}

}


routerCalculation_roundtrip(res){

  this.sendDataToConfirmFlight();

  this.flightService.sendflightdetails(this.fareresponse);

  this.flightService.selectedFlight(this.fareresponse);
  this.flightService.sendsimilarflight(this.fareresponse);
  this.flightService.sendsimilarflightreturnway("");
  this.flightService.sendsimilarflightmulti("");

  let countryCodeAffiliate =  sessionStorage.getItem('countryCodeAffiliate')




  let field = {
    adult:  +this.adult,
    children:+this.children,
    infants: +this.infants,
    // type: this.data.type
  };
  this.sendTravllerDataService.sendtravllers(field);

  sessionStorage.setItem('tripType', 'returnway');
  sessionStorage.setItem('TripType', 'returnway');
  sessionStorage.setItem('tripround', 'roundtrip');

  //this.countryCode = 'in';
  this.language = 'en';

  let returnwaydepartDate1 =  res['roundTripFlightOption']['onwardFlightOption']['flightlegs'][0]['depDate'];
  sessionStorage.setItem('returnwaydepartDate',moment(returnwaydepartDate1, "YYYY-MM-DD").format("DD-MM-YYYY"));

  
  let returnwayreturnDate1 =  res['roundTripFlightOption']['returnFlightOption']['flightlegs'][0]['depDate'];
  sessionStorage.setItem('returnwayreturnDate',moment(returnwayreturnDate1, "YYYY-MM-DD").format("DD-MM-YYYY"));
  
  this.globalService.sendReturnDataDate(moment(returnwayreturnDate1, "YYYY-MM-DD").format("DD-MM-YYYY"));

  ///this.globalService.sendReturnDataDate(onwardJourneyDate);
  let data= {
    economy: "",
myeconomyonward:  this.FlightOnwardCabinClass,
myeconomyreturn:  this.FlightReturnCabinClass,
returnwayOrigin:this.finalorigin,
returnwaydepartDate:  moment(returnwaydepartDate1, "YYYY-MM-DD").format("DD-MM-YYYY"),
returnwaydestination:  this.finaldest,
returnwayreturnDate:  moment(returnwayreturnDate1, "YYYY-MM-DD").format("DD-MM-YYYY"),
   travellerfield: ""

 }
 ////console.log('afflate onwrd date',data);
 this.flightService.sendoddata(data);

 let returnwaydepartDate = returnwaydepartDate1 ///moment(this.departDate, "DD-MM-YYYY").format("YYYY-MM-DD");
 let returnwayreturnDate = returnwayreturnDate1 //moment(this.returnDate, "DD-MM-YYYY").format("YYYY-MM-DD");

 let maskUrlforAdult = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+this.adult+'Adult'+'/'+this.FlightOnwardCarrier+'/Return'
 let maskUrlforAdultChild = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+this.adult+'Adult'+'/'+this.children+'Child'+'/'+this.FlightOnwardCarrier+'/Return'
 let maskUrlforAdultInfant = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+this.adult+'Adult'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Return'

 let maskUrlforAdultChildInfant = countryCodeAffiliate+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+this.adult+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Return'

 ////console.log('adult,child,infnt>>>>',this.adult,this.children,this.infants);
 

if(this.adult >= 1 && this.children == 0 && this.infants ==0){
this.route.navigate([maskUrlforAdult]);
this.spinner.hide();

//console.log('adult,child,infant',this.adult,this.children,this.infants)
}
if(this.adult >= 1 && this.children >= 1 && this.infants ==0){
this.route.navigate([maskUrlforAdultChild]);
this.spinner.hide();

//console.log('adult,child,infant',this.adult,this.children,this.infants)

}if(this.adult >= 1 && this.children >= 1 && this.infants >=1){
//console.log('adult,child,infant',this.adult,this.children,this.infants)

this.route.navigate([maskUrlforAdultChildInfant]);
this.spinner.hide();


}if(this.adult >= 1 && this.children == 0 && this.infants >=1){
this.route.navigate([maskUrlforAdultInfant]);
this.spinner.hide();

////console.log('adult,child,infant',this.adult,this.children,this.infants)

}


}

setAffdataLocal(res){

  let flightOptionKey = res['selectedFlightKey'];
  sessionStorage.setItem("flightOptionKey", flightOptionKey);


  let countryCode = res['countryCode'].toLowerCase();
  localStorage.setItem("countryCode", countryCode);
  sessionStorage.setItem("countryCode", countryCode);
  sessionStorage.setItem("countryCodeAffiliate", countryCode);

  localStorage.setItem("countryName", res['countryName']);


  let branchCode = res['branchResponse']['branchCode'];
  localStorage.setItem("branchCode", branchCode);
  sessionStorage.setItem("branchCode", branchCode);

  let branchAddress = res['branchResponse']['branchAddress'];
  localStorage.setItem("branchAddress", branchAddress);
  sessionStorage.setItem("branchAddress", branchAddress);

  let branchCurrencyCode = res['branchResponse']['branchCurrencyCode'];
  localStorage.setItem("branchCurrencyCode", branchCurrencyCode);
  sessionStorage.setItem("branchCurrencyCode", branchCurrencyCode);

  
  let branchEmailId = res['branchResponse']['branchEmailId'];
  localStorage.setItem("branchEmailId", branchEmailId);
  sessionStorage.setItem("branchEmailId", branchEmailId);

         
  let branchId = res['branchResponse']['branchId'];
  localStorage.setItem("branchId", branchId);
  sessionStorage.setItem("branchId", branchId);
  

  let groupId = res['branchResponse']['groupId'];
  localStorage.setItem("groupId", groupId);
  sessionStorage.setItem("groupId", groupId);

  

  let BranchcontactNo = res['branchResponse']['contactNo'];
  localStorage.setItem("BranchcontactNo", BranchcontactNo);
  sessionStorage.setItem("BranchcontactNo", BranchcontactNo);
  sessionStorage.setItem('isAffBooking','true');

}

cacheExpired(){

      Swal.fire({
      allowOutsideClick: false,
      title: 'Sorry, This flight is no more available for booking!',
      //text: "Please select another flight.",
      icon: 'error',
      customClass : {
      container:"swalForBack"
      },
      confirmButtonColor: "#FECE24",
      confirmButtonText: 'OK'
      }).then((result) => {
      if (result.value == true) {
      //console.log('clicked ok');
      this.spinner.hide();
      window.location.replace('/');
      sessionStorage.removeItem('booking-type');
      sessionStorage.removeItem('isAffBooking');
     

      

      }
      });
  
}

bckAff(){
  let isAffBooking = sessionStorage.getItem('isAffBooking');
  //let countryCode = localStorage.getItem('countryCode').toLowerCase();
  let setLanguageSetting = 'en';
  if(isAffBooking =='true'){

    
    let currentCountryName = localStorage.getItem('currentCountryName')
    let selectedCountryCode = localStorage.getItem('selectedCountryCode');
  
  if(selectedCountryCode){
   // let x = selectedCountryCode.toLowerCase();
   // let a = x + '/' + setLanguageSetting;
      window.location.replace('/');

  
  }else{
   // let y = currentCountryName.toLowerCase();
  //  let b = y + '/' + setLanguageSetting;
    window.location.replace('/');
  
  }
  
    sessionStorage.removeItem('booking-type');
    sessionStorage.removeItem('isAffBooking');
  
  }
}


getCokkiesData() {
  this.isTimerCookie = this.cookieService.check('timerStart');
  ////console.log('isTimerCookie val>>>>',this.isTimerCookie);
  this.setTimeOutPopupInCookie();
}

setBranchInfo(res){
  ////console.log('i am from set branch res',res);
  localStorage.setItem('countryId',res['countryId']);

  localStorage.setItem('branchCode',res['branchResponse']['branchCode']);
  localStorage.setItem('branchName',res['branchResponse']['branchName']);
  localStorage.setItem('branchCurrencyCode',res['branchResponse']['branchCurrencyCode']);
  localStorage.setItem('branchId',res['branchResponse']['branchId']);
  localStorage.setItem('groupId',res['branchResponse']['groupId']);
  localStorage.setItem('countryCode',res['branchResponse']['countryCode']);
  localStorage.setItem('BranchcontactNo',res['branchResponse']['contactNo']);
  localStorage.setItem('BranchcontactNo',res['branchResponse']['branchEmailId']);
  localStorage.setItem('branchAddress',res['branchResponse']['branchAddress']);

}

isTimerCookie: any;
sessionTime = 15;
setTimeOutPopupInCookie() {
  // let sessionTimeFlight = this.IsLccFlight ? 10: 15;
  let sessionTimeFlight = this.sessionTime;
  sessionStorage.setItem('test', 'value')
  ////console.log('session timer', sessionTimeFlight)
  if (this.isTimerCookie == 'true' && this.isDataFromSearchResult == true) {
    this.cookieService.delete('timerStart')
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + sessionTimeFlight);

    this.cookieService.set('timerStart', 'true', dateNow, '', '', false, 'Lax');


   // //console.log('if cookie is here and search result also true, set new cokkie and remove old one')
  }
  else if (this.isTimerCookie == false && this.isDataFromSearchResult == true) {

    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + sessionTimeFlight);
    this.cookieService.set('timerStart', 'true', dateNow, '', '', false, 'Lax');
    ////console.log('if cookie is not here, set new cokkie')
  } else {
    ////console.log('cokkie exist')
  }

}



sendDataToConfirmFlight(){
  this.flightService.sendSearchResultCard(true);
}


  loaddashboard() {
    this.globalService.getDashboard().subscribe(dash => {
     // //console.log(dash);
      if (dash) {
       
          let defaultCountry =  dash['countryList'].filter((res) => {
            return res.defaultCountry == true
          });
          this.setCountryCodeToURL = defaultCountry[0]['countryCode'].toLowerCase();
          //console.log('dc is else>>',defaultCountry[0]);
          this.setParameterToUrl();
        
      }
    })
}
// var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  // Google Analytics Code
  reloadScript() {
    if (this.setCountryCodeToURL == 'ae') {                  // UAE
      localStorage.setItem('gaTagCode', 'UA-60319074-20');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-20';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ng') {           // Nigeria
      localStorage.setItem('gaTagCode', 'UA-60319074-21');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-21';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'gh') {           // Ghana
      localStorage.setItem('gaTagCode', 'UA-60319074-22');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-22';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'sa') {           // Saudi Arabia
      localStorage.setItem('gaTagCode', 'UA-60319074-38');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-38';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ke') {           // Kenya
      localStorage.setItem('gaTagCode', 'UA-60319074-39');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-39';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'za') {           // South Africa
      localStorage.setItem('gaTagCode', 'UA-60319074-40');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-40';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ma') {           // Morroco
      localStorage.setItem('gaTagCode', 'UA-60319074-41');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-41';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'tz') {           // Tanzania
      localStorage.setItem('gaTagCode', 'UA-60319074-42');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-42';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'mu') {           // Mauritius
      localStorage.setItem('gaTagCode', 'UA-60319074-43');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-43';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ug') {           // Uganda
      localStorage.setItem('gaTagCode', 'UA-60319074-44');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-44';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'cd') {           // DRC
      localStorage.setItem('gaTagCode', 'UA-60319074-45');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-45';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'zw') {           // Zimbabwe
      localStorage.setItem('gaTagCode', 'UA-60319074-46');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-46';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'mw') {           // Malawi
      localStorage.setItem('gaTagCode', 'UA-60319074-47');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-47';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'rw') {           // Rwanda
      localStorage.setItem('gaTagCode', 'UA-60319074-48');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-48';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'sn') {           // Snegal
      localStorage.setItem('gaTagCode', 'UA-60319074-49');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-49';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ci') {           // Ivory Coast
      localStorage.setItem('gaTagCode', 'UA-60319074-50');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-50';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ga') {           // Gabon
      localStorage.setItem('gaTagCode', 'UA-60319074-51');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-51';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'td') {           // Chad
      localStorage.setItem('gaTagCode', 'UA-60319074-52');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-52';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'gm') {           // Gambia
      localStorage.setItem('gaTagCode', 'UA-60319074-53');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-53';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'ml') {           // Mali
      localStorage.setItem('gaTagCode', 'UA-60319074-54');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-54';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'gn') {           // Guinea
      localStorage.setItem('gaTagCode', 'UA-60319074-55');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-55';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'gw') {           // Guinea Bissau
      localStorage.setItem('gaTagCode', 'UA-60319074-56');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-56';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'my') {           // Malaysia
      localStorage.setItem('gaTagCode', 'UA-60319074-57');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-57';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'sg') {           // Singapore
      localStorage.setItem('gaTagCode', 'UA-60319074-58');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-58';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'us') {           // USA
      localStorage.setItem('gaTagCode', 'UA-60319074-59');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-59';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'cn') {           // Canada
      localStorage.setItem('gaTagCode', 'UA-60319074-60');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-60';
      this.setScript(gA);
    } else if (this.setCountryCodeToURL == 'bi') {           // Burundi
      localStorage.setItem('gaTagCode', 'UA-60319074-61');
      const gA = 'https://www.googletagmanager.com/gtag/js?id=UA-60319074-61';
      this.setScript(gA);
    }
  }

  /**
   * To optimize the code - new function created
   * need to verify 
   * this.dynamicGACode('20') - function call in the condtional function
   */
  public dynamicGACode(countryNumber: string) {
    localStorage.setItem('gaTagCode', `UA-60319074-${countryNumber}`);
    const gA = `https://www.googletagmanager.com/gtag/js?id=UA-60319074-${countryNumber}`;
    this.setScript(gA);
  }

  setScript(src) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
  }

}

