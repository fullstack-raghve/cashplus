import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { FlightService } from "src/app/services/flight.service";
import { ModalController } from "@ionic/angular";
import { GuestLoginComponent } from "../../common shared component/guest-login/guest-login.component";
import { AuthServices } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { FareDetailsComponent } from "../fare-details/fare-details.component";
import { Location, PlatformLocation } from '@angular/common';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { UserLoginComponent } from '../../common shared component/user-login/user-login.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from 'src/app/services/global.service';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import  *  as  airportList  from  '../../../../../../assets/airportList.json';
import Swal from 'sweetalert2';
import { OverlayService } from "src/app/services/overlay.service";

// import { NewGuestLoginComponent } from '../../common shared component/new-guest-login/new-guest-login.component';

@Component({
  selector: "app-confirm-flight",
  templateUrl: "./confirm-flight.component.html",
  styleUrls: ["./confirm-flight.component.scss"]
})
export class ConfirmFlightComponent implements OnInit, OnDestroy {
  returwaydata: any;
  selectedflight;
  selectedflight2: any;
  panelOpenState = false;
  islogin: any;
  subscribe: Subscription;
  selectedflightreturnway: any;
  seladult: string;
  selchildren: string;
  selinfants: string;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;
  finalorigin: any;
  finaldest: any;
  myeconomyonward: any;
  myeconomyreturn: any;
  departDate: any;
  returnDate: any;
  multiflight: any;
  cp: any;
  language = 'en'
  cprice: any;
  travSub: Subscription;
  selectedFlightOptionKey: any;
  isUccflight: any;
  triptype: string;
  loadingg: boolean;
  displayfareoneway: number;
  similarPageURL: string;
  searchPageURL: string;
  countryCode: string;
  FlightOnwardCabinClass: string;
  FlightReturnCabinClass: string;
  FlightOnwardCarrier: string;
  returnwaydepartDate: string;
  returnwayreturnDate: string;
  refreshedOrigin: string;
  refreshedDest: string;
  public redirectTo: string;
  multiflightFare: number;
  multiCityCurrency: any;
  IsLccFlight;
  segmentData;
  passengerLength;
  ////
refreshedCountryid: any;
refreshedgroupId: any;
newadult: any;
refreshedcountryCode: any;
onewaySelectedFlight: any;
UMOcountryCode: string;
UMOlanguage: string;
UMOonwrdate: string;
UMOfullcity: string;
UMOcabinclass: string;
UMOpaxinfo: string;
UMOoriginNew: string;
UMOdestinationNew: string;
selctedcabinclass: number;
  UMOpaxinfoinfant: string;
  UMOreturndate: string;
  UMOcabinclassreturn: string;
  todayDateis = moment().format("YYYY-MM-DD");
  bookingtype;
  objdata;
  countryInUrl: string;
  isAffBooking: string;
  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private sendTravllerDataService: SendTravllerDataService,
    private _authService: AuthServices,
    private flightService: FlightService,
    public modalController: ModalController,
    private location: Location,
    private spinner: NgxSpinnerService,
    private profileControllerService: ProfileControllerService,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private location_new: PlatformLocation,
    private overlayService: OverlayService,
  ) {
    this.redirectTo = activatedRoute.snapshot.data.redirectTo;
  }

  

  ngOnInit() {
    this.bookingtype =  sessionStorage.getItem('booking-type');
    this.isAffBooking = sessionStorage.getItem('isAffBooking');
   this.loaddashboard();
    this.getunmaskurl();
    
    localStorage.removeItem('surchargeAmount');
    localStorage.removeItem('cpo');
    localStorage.removeItem('cpm');
    localStorage.removeItem('cpr');
    
    let confirFlightPageURL = this.router.url.substr(1);

    let countryInUrl = confirFlightPageURL.split('/');
    this.countryInUrl = countryInUrl[0];

    localStorage.setItem('confirFlightPageURL', confirFlightPageURL);
    sessionStorage.setItem('confirFlightPageURL', confirFlightPageURL);

    this.searchPageURL = sessionStorage.getItem('searchPageURL');
    this.loadingg = true;
    this.getRouterDetails();
    this.triptype = sessionStorage.getItem('tripType');
    this.islogin = localStorage.getItem('isLoggedIn');

    //console.log('is login status:', this.islogin);

    this.selectedflight2 = "";
    this.selectedflight = "";
    //console.log("confirm");
    this.getsingleflight();
    this.getsingleflightmulti();
    // this.odddata();

    this.getselectedtravllersfromlocal();
    this.gettravllerfromservice();
    // this.getTravellerDetailsUrl();
   
  }




  getunmaskurl(){

    let searchpageurl = this.router.url.substr(1);

    if(searchpageurl.includes('flight-search')){
    this.unmaskurl();

     }else{


     }
  }

  unmaskurl(){

    let currentUrl = this.router.url;
  
    let currentUrl_length  =  currentUrl.length;
  
    //console.log('currentUrl_length',currentUrl_length)
    if(currentUrl_length>77){
      this.calculateDataReturnway();
    }else{
      this.calculateDataOneway();
    }
  }


 
  airportItem = airportList;
  UMOpaxinfochildd;
  calculateDataOneway(){
    localStorage.removeItem('UMOpaxinfoinfant');
    localStorage.removeItem('UMOpaxinfo');
  localStorage.removeItem('UMOpaxinfochild');
    let searchpageurl = this.router.url.substr(1);

/////if condition for adult and child cb2
if(searchpageurl.includes('Adult') && searchpageurl.includes('Child') && searchpageurl.includes('Infant')){
    this.activatedRoute.paramMap.subscribe(params => {
    //console.log(params)
    this.UMOcountryCode = params.get("countryCode");
    this.UMOlanguage = params.get("language");
    this.UMOonwrdate = params.get("dateonwar");
///chk date status
let currentDate =  moment(this.todayDateis).format('YYYY-MM-DD');
let urlDate = moment(this.UMOonwrdate).format('YYYY-MM-DD');
if(urlDate > currentDate){
	//console.log('urlDate is Greter than currentDate');
}else if(currentDate > urlDate){
  //console.log('urlDate is less than currentDate');
  this.UMOonwrdate = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("YYYY-MM-DD");

}else{
	////console.log('Both date are same');
}
///

    this.UMOfullcity = params.get("originCity-:destinationCity");
    this.UMOcabinclass = params.get("FlightOnwardCabinClass");

  let UMOpaxinfo =  params.get("adult");
  this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

  +this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;
  // if(+this.UMOpaxinfo>9){
  //   this.UMOpaxinfo = '1';
  // }else{

  // }

  let UMOpaxinfochild =  params.get("FlightOnwardCarrier");
  this.UMOpaxinfochildd = UMOpaxinfochild.replace(/[^0-9]/g,'');

  if(+this.UMOpaxinfochildd>0){
    localStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);
    sessionStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);

  }else{
    localStorage.removeItem('UMOpaxinfochild');

  }

  let UMOpaxinfoinfant =  params.get("Oneway");
  this.UMOpaxinfoinfant = UMOpaxinfoinfant.replace(/[^0-9]/g,'');

  if(+this.UMOpaxinfoinfant>0){
    localStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);
    sessionStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);

  }else{
    localStorage.removeItem('UMOpaxinfoinfant');

  }

   

    localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    localStorage.setItem('myeconomyonward',this.UMOcabinclass)
    localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    //
    sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    sessionStorage.setItem('myeconomyonward',this.UMOcabinclass)
    sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);

   // var num = txt.replace(/[^0-9]/g,'');
       let fullcitySplit = this.UMOfullcity.split('-')
   
  this.UMOoriginNew = fullcitySplit[0];
  this.UMOdestinationNew = fullcitySplit[1];
   
  localStorage.setItem('refreshedOrigin',this.UMOoriginNew);
  localStorage.setItem('refreshedDest',this.UMOdestinationNew);
///
sessionStorage.setItem('refreshedOrigin',this.UMOoriginNew);
sessionStorage.setItem('refreshedDest',this.UMOdestinationNew);


  ////console.log(this.airportItem)
 // //console.log(this.airportItem['default']);
let finalist = this.airportItem['default'];
let filterorigin = finalist.filter((data)=>{
   return data.airportCode == this.UMOoriginNew;
  });
  //console.log('filterorigin',filterorigin);
 let urlorigincityname = filterorigin[0].cityName;
  let destinationfinl = finalist.filter((data)=>{
    return data.airportCode == this.UMOdestinationNew;
   });
  //console.log('destinationfinl',destinationfinl);
  let urldestcityname = destinationfinl[0].cityName;

  let OriginAirportCityName =  urlorigincityname && urlorigincityname.replace(/\s/g, '-');
  let DestinationAirportCityName = urldestcityname && urldestcityname.replace(/\s/g, '-');
      
   localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
   localStorage.setItem("OriginAirportCityName",OriginAirportCityName);
  ///
  sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
  sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName);


  let yoneway=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Oneway'
//console.log('unmask to mask url',yoneway);
let Beforedomainpart =  window.location.origin;
let fullurl =  Beforedomainpart+yoneway;
  location.replace(fullurl);
 
 


});///parms end
}

///retunway-only adult
if(searchpageurl.includes('Adult') && !searchpageurl.includes('Child') &&  !searchpageurl.includes('Infant')){
  this.activatedRoute.paramMap.subscribe(params => {
  //console.log('params',params);
  this.UMOcountryCode = params.get("countryCode");
  this.UMOlanguage = params.get("language");
  this.UMOfullcity = params.get("originCity-:destinationCity");

  this.UMOonwrdate = params.get("dateonwar");
  this.UMOreturndate = params.get("adult");

  ///chk date status - retunway
let currentDate =  moment(this.todayDateis).format('YYYY-MM-DD');
let urlDate1 = moment(this.UMOonwrdate).format('YYYY-MM-DD');
let urlDate2 = moment(this.UMOreturndate).format('YYYY-MM-DD');

if(currentDate > urlDate1 || currentDate > urlDate2){
  //console.log('urlDate is less than currentDate');
  this.UMOonwrdate = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("YYYY-MM-DD");
  this.UMOreturndate = moment(new Date(), "DD-MM-YYYY").add(22,'days').format("YYYY-MM-DD");

}
///


  this.UMOcabinclass = params.get("FlightOnwardCabinClass");
  this.UMOcabinclassreturn = params.get("FlightOnwardCarrier");

let UMOpaxinfo =  params.get("Oneway");
this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

+this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;




  localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
  localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  localStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
  localStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn); 
  localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
////
sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
sessionStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
sessionStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn); 
sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);

     let fullcitySplit = this.UMOfullcity.split('-')
 
this.UMOoriginNew = fullcitySplit[0];
this.UMOdestinationNew = fullcitySplit[1];
 
localStorage.setItem('refreshedOrigin',this.UMOoriginNew);
localStorage.setItem('refreshedDest',this.UMOdestinationNew);
///
sessionStorage.setItem('refreshedOrigin',this.UMOoriginNew);
sessionStorage.setItem('refreshedDest',this.UMOdestinationNew);


////console.log(this.airportItem)
// //console.log(this.airportItem['default']);
let finalist = this.airportItem['default'];
let filterorigin = finalist.filter((data)=>{
 return data.airportCode == this.UMOoriginNew;
});
//console.log('filterorigin',filterorigin);
let urlorigincityname = filterorigin[0].cityName;
let destinationfinl = finalist.filter((data)=>{
  return data.airportCode == this.UMOdestinationNew;
 });
//console.log('destinationfinl',destinationfinl);
let urldestcityname = destinationfinl[0].cityName;

let OriginAirportCityName =  urlorigincityname && urlorigincityname.replace(/\s/g, '-');
let DestinationAirportCityName = urldestcityname && urldestcityname.replace(/\s/g, '-');
    
 localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
 localStorage.setItem("OriginAirportCityName",OriginAirportCityName);
//
    
sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName);

//vv = http://pwa.techtreeit.in/in/en/cheap-flights/search/New-Delhi-to-Dubai/DEL-DXB/Return
let unmaskretunurl=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Return'
//console.log('unmask to mask url',unmaskretunurl);
let Beforedomainpart =  window.location.origin;
let fullurl =  Beforedomainpart+unmaskretunurl;
location.replace(fullurl);




});///parms end
}

  }

  calculateDataReturnway(){
    //console.log('calculation of retunway')
    localStorage.removeItem('UMOpaxinfoinfant');
    localStorage.removeItem('UMOpaxinfo');
  localStorage.removeItem('UMOpaxinfochild');
    let searchpageurl = this.router.url.substr(1);

/////if condition for adult and child cb2
//if( (searchpageurl.includes('Adult')) ){

if(searchpageurl.includes('Adult') && searchpageurl.includes('Child') &&  searchpageurl.includes('Infant')){
    this.activatedRoute.paramMap.subscribe(params => {
    //console.log('params',params);
    this.UMOcountryCode = params.get("countryCode");
    this.UMOlanguage = params.get("language");
    this.UMOfullcity = params.get("originCity-:destinationCity");

    this.UMOonwrdate = params.get("dateonward");
    this.UMOreturndate = params.get("datereturn");


      ///chk date status - retunway
let currentDate =  moment(this.todayDateis).format('YYYY-MM-DD');
let urlDate1 = moment(this.UMOonwrdate).format('YYYY-MM-DD');
let urlDate2 = moment(this.UMOreturndate).format('YYYY-MM-DD');

if(currentDate > urlDate1 || currentDate > urlDate2){
  //console.log('urlDate is less than currentDate');
  this.UMOonwrdate = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("YYYY-MM-DD");
  this.UMOreturndate = moment(new Date(), "DD-MM-YYYY").add(22,'days').format("YYYY-MM-DD");

}
///

    this.UMOcabinclass = params.get("cabinonward");
    this.UMOcabinclassreturn = params.get("cabinreturn");

  let UMOpaxinfo =  params.get("adultinfo");
  this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

  +this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;


  let UMOpaxinfochild =  params.get("career");
  this.UMOpaxinfochildd = UMOpaxinfochild.replace(/[^0-9]/g,'');

  if(+this.UMOpaxinfochildd>0){
    localStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);
    sessionStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);


  }else{
    localStorage.removeItem('UMOpaxinfochild');

  }

  let UMOpaxinfoinfant =  params.get("triptype");
  this.UMOpaxinfoinfant = UMOpaxinfoinfant.replace(/[^0-9]/g,'');

  if(+this.UMOpaxinfoinfant>0){
    localStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);
    sessionStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);


  }else{
    localStorage.removeItem('UMOpaxinfoinfant');

  }

  localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    localStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    localStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn);
    localStorage.setItem('myeconomyonward',this.UMOcabinclass);
    localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    ///
    sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    sessionStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    sessionStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn);
    sessionStorage.setItem('myeconomyonward',this.UMOcabinclass);
    sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
  

       let fullcitySplit = this.UMOfullcity.split('-')
   
  this.UMOoriginNew = fullcitySplit[0];
  this.UMOdestinationNew = fullcitySplit[1];
  localStorage.setItem('refreshedOrigin',this.UMOoriginNew);
  localStorage.setItem('refreshedDest',this.UMOdestinationNew);
  ///
  sessionStorage.setItem('refreshedOrigin',this.UMOoriginNew);
  sessionStorage.setItem('refreshedDest',this.UMOdestinationNew);



  ////console.log(this.airportItem)
 // //console.log(this.airportItem['default']);
let finalist = this.airportItem['default'];
let filterorigin = finalist.filter((data)=>{
   return data.airportCode == this.UMOoriginNew;
  });
  //console.log('filterorigin',filterorigin);
 let urlorigincityname = filterorigin[0].cityName;
  let destinationfinl = finalist.filter((data)=>{
    return data.airportCode == this.UMOdestinationNew;
   });
  //console.log('destinationfinl',destinationfinl);
  let urldestcityname = destinationfinl[0].cityName;

  let OriginAirportCityName =  urlorigincityname && urlorigincityname.replace(/\s/g, '-');
  let DestinationAirportCityName = urldestcityname && urldestcityname.replace(/\s/g, '-');
      
   localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
   localStorage.setItem("OriginAirportCityName",OriginAirportCityName);
  //
  sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
  sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName);

//vv = http://pwa.techtreeit.in/in/en/cheap-flights/search/New-Delhi-to-Dubai/DEL-DXB/Return
  let unmaskretunurl=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Return'
//console.log('unmask to mask url',unmaskretunurl);
let Beforedomainpart =  window.location.origin;
let fullurl =  Beforedomainpart+unmaskretunurl;
  location.replace(fullurl);
 
  


});///parms end
}
///retunway-only adult n child
if(searchpageurl.includes('Adult') && searchpageurl.includes('Child') &&  !searchpageurl.includes('Infant')){
  this.activatedRoute.paramMap.subscribe(params => {
  //console.log('params R-AC',params);
  this.UMOcountryCode = params.get("countryCode");
  this.UMOlanguage = params.get("language");
  this.UMOfullcity = params.get("originCity-:destinationCity");

  this.UMOonwrdate = params.get("dateonward");
  this.UMOreturndate = params.get("adultinfo");

    ///chk date status - retunway
let currentDate =  moment(this.todayDateis).format('YYYY-MM-DD');
let urlDate1 = moment(this.UMOonwrdate).format('YYYY-MM-DD');
let urlDate2 = moment(this.UMOreturndate).format('YYYY-MM-DD');

if(currentDate > urlDate1 || currentDate > urlDate2){
  //console.log('urlDate is less than currentDate');
  this.UMOonwrdate = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("YYYY-MM-DD");
  this.UMOreturndate = moment(new Date(), "DD-MM-YYYY").add(22,'days').format("YYYY-MM-DD");

}
///

  this.UMOcabinclass = params.get("cabinonward");
  this.UMOcabinclassreturn = params.get("childinfo");

let UMOpaxinfo =  params.get("career");
this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

+this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;



let UMOpaxinfochild =  params.get("triptype");
this.UMOpaxinfochildd = UMOpaxinfochild.replace(/[^0-9]/g,'');

if(+this.UMOpaxinfochildd>0){
  localStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);
  sessionStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);


}else{
  localStorage.removeItem('UMOpaxinfochild');

}



localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
  localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  localStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
  localStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn);
  localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
  //
  sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
  sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  sessionStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
  sessionStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn);
  sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);


     let fullcitySplit = this.UMOfullcity.split('-')
 
this.UMOoriginNew = fullcitySplit[0];
this.UMOdestinationNew = fullcitySplit[1];
 
localStorage.setItem('refreshedOrigin',this.UMOoriginNew);
localStorage.setItem('refreshedDest',this.UMOdestinationNew);
///
sessionStorage.setItem('refreshedOrigin',this.UMOoriginNew);
sessionStorage.setItem('refreshedDest',this.UMOdestinationNew);



////console.log(this.airportItem)
// //console.log(this.airportItem['default']);
let finalist = this.airportItem['default'];
let filterorigin = finalist.filter((data)=>{
 return data.airportCode == this.UMOoriginNew;
});
//console.log('filterorigin',filterorigin);
let urlorigincityname = filterorigin[0].cityName;
let destinationfinl = finalist.filter((data)=>{
  return data.airportCode == this.UMOdestinationNew;
 });
//console.log('destinationfinl',destinationfinl);
let urldestcityname = destinationfinl[0].cityName;

let OriginAirportCityName =  urlorigincityname && urlorigincityname.replace(/\s/g, '-');
let DestinationAirportCityName = urldestcityname && urldestcityname.replace(/\s/g, '-');
    
 localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
 localStorage.setItem("OriginAirportCityName",OriginAirportCityName);
//
sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName);

//vv = http://pwa.techtreeit.in/in/en/cheap-flights/search/New-Delhi-to-Dubai/DEL-DXB/Return
let unmaskretunurl=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Return'
//console.log('unmask to mask url',unmaskretunurl);
let Beforedomainpart =  window.location.origin;
let fullurl =  Beforedomainpart+unmaskretunurl;
location.replace(fullurl);




});///parms end
}

///retunway-only adult n infant
if(searchpageurl.includes('Adult') && !searchpageurl.includes('Child') &&  searchpageurl.includes('Infant')){
  this.activatedRoute.paramMap.subscribe(params => {
  //console.log('params R-ai',params);
  this.UMOcountryCode = params.get("countryCode");
  this.UMOlanguage = params.get("language");
  this.UMOfullcity = params.get("originCity-:destinationCity");

  this.UMOonwrdate = params.get("dateonward");
  this.UMOreturndate = params.get("adultinfo");

    ///chk date status - retunway
let currentDate =  moment(this.todayDateis).format('YYYY-MM-DD');
let urlDate1 = moment(this.UMOonwrdate).format('YYYY-MM-DD');
let urlDate2 = moment(this.UMOreturndate).format('YYYY-MM-DD');

if(currentDate > urlDate1 || currentDate > urlDate2){
  //console.log('urlDate is less than currentDate');
  this.UMOonwrdate = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("YYYY-MM-DD");
  this.UMOreturndate = moment(new Date(), "DD-MM-YYYY").add(22,'days').format("YYYY-MM-DD");

}
///

  this.UMOcabinclass = params.get("cabinonward");
  this.UMOcabinclassreturn = params.get("childinfo");

let UMOpaxinfo =  params.get("career");
this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

+this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;




let UMOpaxinfoinfant =  params.get("triptype");
this.UMOpaxinfoinfant = UMOpaxinfoinfant.replace(/[^0-9]/g,'');

if(+this.UMOpaxinfoinfant>0){
  localStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);
  localStorage.sessionStorage('UMOpaxinfoinfant',this.UMOpaxinfoinfant);


}else{
  localStorage.removeItem('UMOpaxinfoinfant');

}

localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
  localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  localStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
  localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
  localStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn);
  localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
////

sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
sessionStorage.setItem('UMOreturndate',moment(this.UMOreturndate, "YYYY-MM-DD").format("DD-MM-YYYY"));
sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
sessionStorage.setItem('UMOcabinclassreturn',this.UMOcabinclassreturn);
sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);

     let fullcitySplit = this.UMOfullcity.split('-')
 
this.UMOoriginNew = fullcitySplit[0];
this.UMOdestinationNew = fullcitySplit[1];
 
localStorage.setItem('refreshedOrigin',this.UMOoriginNew);
localStorage.setItem('refreshedDest',this.UMOdestinationNew);
//
 
sessionStorage.setItem('refreshedOrigin',this.UMOoriginNew);
sessionStorage.setItem('refreshedDest',this.UMOdestinationNew);


////console.log(this.airportItem)
// //console.log(this.airportItem['default']);
let finalist = this.airportItem['default'];
let filterorigin = finalist.filter((data)=>{
 return data.airportCode == this.UMOoriginNew;
});
//console.log('filterorigin',filterorigin);
let urlorigincityname = filterorigin[0].cityName;
let destinationfinl = finalist.filter((data)=>{
  return data.airportCode == this.UMOdestinationNew;
 });
//console.log('destinationfinl',destinationfinl);
let urldestcityname = destinationfinl[0].cityName;

let OriginAirportCityName =  urlorigincityname && urlorigincityname.replace(/\s/g, '-');
let DestinationAirportCityName = urldestcityname && urldestcityname.replace(/\s/g, '-');
    
 localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
 localStorage.setItem("OriginAirportCityName",OriginAirportCityName);
///
    
sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName);

//vv = http://pwa.techtreeit.in/in/en/cheap-flights/search/New-Delhi-to-Dubai/DEL-DXB/Return
let unmaskretunurl=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Return'
//console.log('unmask to mask url',unmaskretunurl);
let Beforedomainpart =  window.location.origin;
let fullurl =  Beforedomainpart+unmaskretunurl;
location.replace(fullurl);




});///parms end
}

  }

 



  ionViewWillEnter() {
    //   this.location_new.onPopState(() => {
    //     //console.log('back click out')
    //     if(this.IfConfirmResponseNull){
    //       this.cookieService.delete('timerStart')
    //       this.backToSearch();
    //       //console.log('back click')
    //       return;
    //     }
    //  });
      this.islogin = localStorage.getItem('isLoggedIn');
     
      localStorage.removeItem('surchargeAmount');
      localStorage.removeItem('cpo');
      localStorage.removeItem('cpm');
      localStorage.removeItem('cpr');
      // this.getTravellerDetailsUrl();
  
      this.checkUserLoginOrNOt();
  
    }


    gettoken;
    checkUserLoginOrNOt(){
      this.gettoken = localStorage.getItem('token');
      if(this.gettoken == null){
        return;
      }
        this.profileControllerService.checkLoginKeyValidOrNot(this.gettoken).subscribe(key => {
          if (key) {
            let isLoginKey = key["keyPresent"];
            if (!isLoginKey) {
              localStorage.setItem("isLoggedIn", "false");
              sessionStorage.setItem("isLoggedIn", "false");

              localStorage.removeItem("token");
              this.profileControllerService.clearAllProfiletCache();
            }
          }
        });
    }

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // this.bottomSheet.dismiss();
        
        this.closePopup();
        // this.cookieService.delete('timerStart')
        if (this.islogin == "true") { }
        else {
          this.modalController.dismiss({
            dismissed: true
          });
        }

      }
    });
  }


  previousUrlTravellerDetails;
  subscribtionTravellerDetails: Subscription;
  getTravellerDetailsUrl() {
    this.subscribtionTravellerDetails = this.profileControllerService.getCurrentURL1.subscribe(
      res => {
        //console.log('get url from service ioenter', res);
        this.previousUrlTravellerDetails = res;
        if (res && res == '/forgot-password' || res && res == '/register') {
          //console.log('from if1');
          this.modalController.dismiss({
            dismissed: true
          });
          this.continuenew();
        }
      }
    );
  }
  subscribtionTravellerDetails2: Subscription;
  getTravellerDetailsUrlnew() {
    this.subscribtionTravellerDetails2 = this.profileControllerService.getCurrentURL2.subscribe(
      res => {
        //console.log('get url from service ioenter', res);
        this.previousUrlTravellerDetails = res;
        if (res && res == '/register') {
          //console.log('from if');
          this.modalController.dismiss({
            dismissed: true
          });
          this.countinue();
        }
      }
    );
  }

  gettravllerfromservice() {
    this.travSub = this.sendTravllerDataService.gettravller().subscribe(res => {
      //console.log(res);
      var info = res["trvllerfield"];
      this.adultdefault = res.adult;
      this.adult = info.adult;
      this.children = info.children;
      this.infants = info.infants;
    });
  }

  baggageDetails() {
    this.router.navigate(["/baggage-details"]);
  }
  backTo() {
    this.cookieService.delete('timerStart')
   

if(this.isAffBooking =='true'){
  
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
  this.router.navigate([this.searchPageURL]);

}
    
  }
  fareRules() {
    this.router.navigate(["/fare-rules"]);
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
      backdropClass: "fare-backdrop"
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      //console.log(res);
      this.setButtonClose = false;
    });
  }

  getselectedtravllersfromlocal() {
    this.seladult = localStorage.getItem("seladult");
    this.selchildren = localStorage.getItem("selchildren");
    this.selinfants = localStorage.getItem("selinfants");
  }
  showReturnWayProceedBUtton = false;
  showOneWayProceedBUtton = false;
  getReponse = false;
  IfConfirmResponseNull = false;
  getsingleflight() {
    this.subscribe = this.flightService.getselectedFlight().subscribe(res => {
      //console.log('flight data review page oneway & returnway', res);
      if (res) {
        this.IsLccFlight = res['onwardFlightOption'] && res['onwardFlightOption']['lccflight'] ? res['onwardFlightOption']['lccflight'] : '';
        this.getDataFromSearchResultSimilar();
        this.getReponse = true;
      //  //console.log(res);

        if (this.triptype == "oneway" || this.triptype == "returnway") {

          this.flightPopUp(res)
          let threeGPayServiceCharge = res['threeGPayServiceCharge'];
          localStorage.setItem('threeGPayServiceCharge',threeGPayServiceCharge);
          sessionStorage.setItem('threeGPayServiceCharge',threeGPayServiceCharge);
  
          let fareConfirmReqKey = res['fareConfirmReqKey'];
          localStorage.setItem('fareConfirmReqKey',fareConfirmReqKey);
          sessionStorage.setItem('fareConfirmReqKey',fareConfirmReqKey);
  
            let interSwitchServiceCharge = res['interSwitchServiceCharge'];
            localStorage.setItem('interSwitchServiceCharge',interSwitchServiceCharge);
            sessionStorage.setItem('interSwitchServiceCharge',interSwitchServiceCharge);
  
           let interSwitchsurchargeCap =  res['interSwitchsurchargeCap'];
           localStorage.setItem('interSwitchsurchargeCap',interSwitchsurchargeCap);
           sessionStorage.setItem('interSwitchsurchargeCap',interSwitchsurchargeCap);
  
           let quickTellerServiceCharge = res['quickTellerServiceCharge'];
           let quickTellersurchargeCap = res['quickTellersurchargeCap'];
           localStorage.setItem('quickTellerServiceCharge',quickTellerServiceCharge);
           localStorage.setItem('quickTellersurchargeCap',quickTellersurchargeCap);
  ///
  sessionStorage.setItem('quickTellerServiceCharge',quickTellerServiceCharge);
  sessionStorage.setItem('quickTellersurchargeCap',quickTellersurchargeCap);
  
          this.loadingg = false;
          this.isUccflight = res['isUccflight'];
  
          localStorage.setItem('isUccflight', this.isUccflight);
          sessionStorage.setItem('isUccflight', this.isUccflight);
  
          let isuccfTxnValue = res['uccfTxn'];
          localStorage.setItem('isuccfTxnValue', isuccfTxnValue);
          sessionStorage.setItem('isuccfTxnValue', isuccfTxnValue);
  
          //console.log('is-uccfTxn--', isuccfTxnValue);
          //console.log('isUccflight is--', this.isUccflight);
  
          this.selectedFlightOptionKey = res["selectedFlightOptionKey"];
          localStorage.setItem(
            "selectedFlightOptionKey",
            this.selectedFlightOptionKey
          );
          sessionStorage.setItem(
            "selectedFlightOptionKey",
            this.selectedFlightOptionKey
          );
        }




        ///response -oneway start
        this.selectedflight2 = res["onwardFlightOption"];


        this.selectedflight = res["onwardFlightOption"];
        //console.log("Selected 2" + this.selectedflight2);
        //console.log("Selected 1" + this.selectedflight);
        ///response --oneway end
        ///response -returnway start

        this.selectedflightreturnway = res["roundTripFlightOption"];



        //console.log("return way data", this.selectedflightreturnway);
        if (this.selectedflightreturnway) {
          this.showReturnWayProceedBUtton = true;
          //console.log("inside if", this.showReturnWayProceedBUtton);
        }
        if (this.selectedflight) {
          this.showOneWayProceedBUtton = true;
          //console.log("one way inside", this.showOneWayProceedBUtton);
        }

        //console.log("outside if", this.showReturnWayProceedBUtton);
        //console.log("one way ouside", this.showOneWayProceedBUtton);

        if (this.triptype == "oneway") {

          if(res["onwardFlightOption"]){
            // flightFare.refundableInfo 
            localStorage.setItem('isRefundableTicket',res["onwardFlightOption"]['flightFare']['refundableInfo']);
            sessionStorage.setItem('isRefundableTicket',res["onwardFlightOption"]['flightFare']['refundableInfo']);
            this.setOnewfare(res["onwardFlightOption"])
          }else{}
          
        }
        if (this.triptype == "returnway") {
          localStorage.setItem('isRefundableTicket',res["roundTripFlightOption"].returnFlightOption.flightFare.refundableInfo);
          sessionStorage.setItem('isRefundableTicket',res["roundTripFlightOption"].returnFlightOption.flightFare.refundableInfo);

          this.setReturnWayfare(res);
        }

        ///response --returnway  end
      }
      else if (res == 'multicity') { }
      else if(res == null){
        this.IfConfirmResponseNull = true;
        setTimeout(() => {
          this.backToSearch()
        }, 1100);
        //console.log('null response')
      }
      else {
        let countryCode = localStorage.getItem('countryCode').toLowerCase();
        //console.log(countryCode)
        let setLanguageSetting = 'en';
        //this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
        this.getReponse = false;
        //console.log('page refresh', res);
      }
    });
  }

  flightPopUp(res){

    let fareStatus = res['fareStatus']
    let errorListLength = res['errorList'] && res['errorList'].length;
    // if(fareStatus==null || errorListLength>0){

    // }
    if((fareStatus==null && errorListLength>0) && (errorListLength !=undefined)){
      ////console.log('errorListLength',errorListLength);
    
    ///////
    
    Swal.fire({
    allowOutsideClick: false,
    title: 'Sorry, This flight is no more available for booking!',
    text: "Please select another flight.",
    icon: 'error',
    customClass : {
    container:"swalForBack"
    },
    confirmButtonColor: "#FECE24",
    confirmButtonText: 'OK'
    }).then((result) => {
    ////console.log(result.value == true);
    if (result.value == true) {
   // this.router.navigate([this.searchPageURL]);
    ////console.log('clicked ok');
    this.bck();
    }
    });
    
    
     // return;
    }else{
      //console.log('i m from else');
    
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
      this.router.navigate([this.searchPageURL]);
      //let c = countryCode + "/" + setLanguageSetting;

      //window.location.replace(c);
    }

   

  
}

  getsingleflightmulti() {
    this.subscribe = this.flightService
      .getselectedFlightmulti()
      .subscribe(res => {
        if (res) {
          //console.log('multicity response>>',res);
          this.segmentData = res;
          this.IsLccFlight = res['onwardFlightOption'] && res['onwardFlightOption']['lccflight'] ? res['onwardFlightOption']['lccflight'] : '';
          this.getDataFromSearchResultSimilar();
          this.multiflight = res["onwardFlightOption"];
          this.cp = res["currentPrice"];
          this.getReponse = true;
          if (this.triptype == "multicity") {
            this.flightPopUp(res);
            localStorage.setItem('isRefundableTicket',res["onwardFlightOption"]['flightFare']['refundableInfo']);
            sessionStorage.setItem('isRefundableTicket',res["onwardFlightOption"]['flightFare']['refundableInfo']);

            let isuccfTxnValue = res['uccfTxn'];
            localStorage.setItem('isuccfTxnValue', isuccfTxnValue);
            sessionStorage.setItem('isuccfTxnValue', isuccfTxnValue);

            let fareConfirmReqKey = res['fareConfirmReqKey'];
            localStorage.setItem('fareConfirmReqKey',fareConfirmReqKey);
            sessionStorage.setItem('fareConfirmReqKey',fareConfirmReqKey);

            this.selectedFlightOptionKey = res["selectedFlightOptionKey"];
            localStorage.setItem(
              "selectedFlightOptionKey",
              this.selectedFlightOptionKey
            );
            sessionStorage.setItem(
              "selectedFlightOptionKey",
              this.selectedFlightOptionKey
            );
            let threeGPayServiceCharge = res['threeGPayServiceCharge'];
            localStorage.setItem('threeGPayServiceCharge',threeGPayServiceCharge);
            sessionStorage.setItem('threeGPayServiceCharge',threeGPayServiceCharge);

            let interSwitchServiceCharge = res['interSwitchServiceCharge'];
            localStorage.setItem('interSwitchServiceCharge',interSwitchServiceCharge);
            sessionStorage.setItem('interSwitchServiceCharge',interSwitchServiceCharge);

           let interSwitchsurchargeCap =  res['interSwitchsurchargeCap'];
           localStorage.setItem('interSwitchsurchargeCap',interSwitchsurchargeCap);
           sessionStorage.setItem('interSwitchsurchargeCap',interSwitchsurchargeCap);

           let quickTellerServiceCharge = res['quickTellerServiceCharge'];
           let quickTellersurchargeCap = res['quickTellersurchargeCap'];
           localStorage.setItem('quickTellerServiceCharge',quickTellerServiceCharge);
           localStorage.setItem('quickTellersurchargeCap',quickTellersurchargeCap);
  ///
  sessionStorage.setItem('quickTellerServiceCharge',quickTellerServiceCharge);
  sessionStorage.setItem('quickTellersurchargeCap',quickTellersurchargeCap);
  
  this.isUccflight = res['isUccflight'];
  
  localStorage.setItem('isUccflight', this.isUccflight);
  sessionStorage.setItem('isUccflight', this.isUccflight);
            //console.log(this.selectedFlightOptionKey);
            this.setmultiCityFare(res["onwardFlightOption"])
          }

        }  else if(res == null){
          this.IfConfirmResponseNull = true;
          setTimeout(() => {
            this.backToSearch()
          }, 1100);
          //console.log('null response')
        }
        else {
        }
      });
  }

  getFareConfirmReq: Subscription;
  async countinue() {
    //this.cookieService.delete('timerStart');

//////
let countrycode = localStorage.getItem('countryCode').toLowerCase();
 ////console.log('this.countrycode, this.countryInUrl',countrycode,this.countryInUrl);
 //console.log(' this.countryInUrl',this.countryInUrl);
 //console.log('this.countrycode,',countrycode);

 //this.checkCountrycode_swal()


///////
//////

   // this.spinner.show();
    this.islogin = localStorage.getItem('isLoggedIn');
    var isTimerCookie: any = this.cookieService.check('timerStart');
   /// var isTimerCookie: any = true;///raghve new 6jan
     //console.log(isTimerCookie);
     //console.log(typeof(isTimerCookie));


    if (this.islogin == "true") {
      let email = localStorage.getItem('loginemail');
      sessionStorage.setItem('loginemail',email);
      
      if (isTimerCookie == false) {
        this.sessionTimeOutPopupShow();
      } else {


        this.spinner.hide();
        this.sendDataToConfirmFlight();
        // let adultinfo = this.adult ? this.adult : 1
        // let returnwaydepartDate =  moment(this.returnwaydepartDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        // let returnwayreturnDate = moment(this.returnwayreturnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        // let maskUrlReturn = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Return'
        // let maskUrlOneway = this.countryCode+'/'+this.language+'/flight-review/'+this.refreshedOrigin+'-'+this.refreshedDest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/travller-details'+'/Oneway';
        //this.router.navigate(['/travller-details']);
        this.router.navigate(["/traveller-details"]);

        if (this.triptype == "oneway") {
          // this.router.navigate([maskUrlOneway]);
          //this.router.navigate(['/travllers-details'])


        }
        if (this.triptype == "returnway") {
          // this.router.navigate([maskUrlReturn]);
          // this.router.navigate(['/travllers-details'])
        }
        if (this.triptype == "multicity") {
          //console.log('multicity', this.triptype)
          // // this.router.navigate([maskUrlReturn]);
          // this.router.navigate(['/travllers-details'])

        }

      }

    } else {
     /// //console.log('no login');

      if (isTimerCookie == false) {
        //console.log('isTimerCookie>>>>',isTimerCookie);

        this.sessionTimeOutPopupShow();
      }
      else {
        this.sendDataToConfirmFlight();
        this.spinner.hide();
        //console.log('open login comp');

        const modal = await this.modalController.create({
          component: GuestLoginComponent,
          backdropDismiss: false,
          showBackdrop: true,
          cssClass: 'new_guest_login',
        });

        return await modal.present();
      }

    }
  }
 
  sessionTimeOutPopupShow() {

    const dialogRef = this.dialog.open(SessionTimeoutComponent, {
      data: { searchResultUrl: this.searchPageURL },
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: "sessionTimeOutPopup",
      backdropClass: "show_popup_session",
    });
    this.spinner.hide();

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);

      if (result) {
        if (this.triptype == "oneway") {
          this.setOnewfare(result["onwardFlightOption"])
          this.flightService.selectedFlight(result);
          this.flightService.sendsimilarflightmulti("");
        }
        if (this.triptype == "returnway") {
          this.setReturnWayfare(result);
          this.flightService.selectedFlight(result);
          this.flightService.sendsimilarflightmulti("");
        }
        if (this.triptype == "multicity") {
          this.flightService.selectedFlightmulti(result);
          this.setmultiCityFare(result["onwardFlightOption"]);
          this.flightService.selectedFlight('multicity');
        }
      }

    });
  }
  checkCountrycode_swal(){
    // if(this.countrycode != this.countryInUrl){
  
  
    //   Swal.fire({
    //   allowOutsideClick: false,
    //   title: 'Sorry, This flight is no more available for booking!',
    //   //text: "Please select another flight.",
    //   icon: 'error',
    //   customClass : {
    //   container:"swalForBack"
    //   },
    //   confirmButtonColor: "#FECE24",
    //   confirmButtonText: 'OK'
    //   }).then((result) => {
    //   if (result.value == true) {
    //   //console.log('clicked ok');
      
    //   }
    //   });
      
      
    //     return;
    //   }else{
    //     //console.log('i m from else');
      
    //   }
   }

  setOnewfare(res) {
    ////console.log(res)
    ////console.log('onew way fare')
    this.flightService.sendflightdetails(res);
    this.displayfareoneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
    //console.log(this.displayfareoneway);
    this.lowprice(this.displayfareoneway)
    ////console.log(res.lccflight)
    // if(res.lccflight == true)
    //  this.passengerLength = 40;
    // else
    //  this.passengerLength = 54;
    //code for travller's detail page
       var reqbody ={
        "destinationCountry": res['destinationCountry'],
        "optionSegmentBean":null,
        "originCountry": res['originCountry'],
        "platingCarrier": res['platingCarrier'],
        "tripType":"oneway"
      }
      //console.log(reqbody);
      this.flightService.getMandatoryFields(reqbody).subscribe((Data) =>{
      //console.log('Data from Api:-',Data);
      this.objdata={
        "statusCode": Data['statusCode'], 
        "statusMessage": Data['statusMessage'],
        "passportValidation":  res['platingCarrier'] == 'IX' || res['platingCarrier'] == 'HY' || res['platingCarrier'] == 'KU' || res['platingCarrier'] == 'RJ' || res['platingCarrier'] == 'SV' || res['platingCarrier'] == 'SZ' ? true:Data['passportValidation'] ,
        "nationalityValidation":res['platingCarrier'] == 'G9' || res['platingCarrier'] == 'IX'? true:Data['nationalityValidation'],
        "dobValidation":res['platingCarrier'] == 'SG'|| res['platingCarrier'] == '6E'||res['platingCarrier'] == 'IX'? true: Data['dobValidation'], 
        // "passengerLength" :this.passengerLength
      }
      //console.log("Plating carrier:-",res['platingCarrier'])
      //console.log('Data for validation in travlers detail page:-'+ JSON.stringify(this.objdata));
      if(this.objdata)
        this.flightService.sendDataToTraveller(this.objdata);
     })
  }
  setReturnWayfare(res) {
    this.flightService.sendflightdetails(res['roundTripFlightOption']);
    this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
    //console.log(this.cprice);
    this.lowpriceR(this.cprice);
    //console.log(res['roundTripFlightOption'])
    // if(res['roundTripFlightOption']['onwardFlightOption'].lccflight == true || res['roundTripFlightOption']['returnFlightOption'].lccflight == true)
    //  this.passengerLength = 40;
    // else
    //  this.passengerLength = 54;
    //code for travller's detail page
    var reqbody ={
      "destinationCountry": res['roundTripFlightOption']['onwardFlightOption']['destinationCountry'],
      "optionSegmentBean":null,
      "originCountry": res['roundTripFlightOption']['onwardFlightOption']['originCountry'],
      "platingCarrier": res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'],
      "tripType":"RoundTrip"
    }
    //console.log(reqbody);
    this.flightService.getMandatoryFields(reqbody).subscribe((Data) =>{
      //console.log('Data from Api',Data);
      this.objdata={
        "statusCode": Data['statusCode'], 
        "statusMessage": Data['statusMessage'],
        "passportValidation":  res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'] == 'IX'? true:Data['passportValidation'] ,
        "nationalityValidation":res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'] == 'G9' || res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'] == 'IX'? true:Data['nationalityValidation'],
        "dobValidation":res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'] == 'SG'|| res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'] == '6E'||res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'] == 'IX'? true: Data['dobValidation'], 
        // "passengerLength" :this.passengerLength
      }
      //console.log("Plating carrier:-",res['roundTripFlightOption']['onwardFlightOption']['platingCarrier'])
      //console.log('Data for validation in travlers detail page:-'+ JSON.stringify(this.objdata));
      if(this.objdata)
        this.flightService.sendDataToTraveller(this.objdata);
   })

  }

  setmultiCityFare(multiCity) {
    //console.log('multicity fare')

    this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
    this.multiCityCurrency = multiCity.flightFare.currency
    this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
    //console.log(this.multiflightFare);
    this.lowpriceM(this.multiflightFare);

    //console.log("Data for multicity get mendatory fields:"+this.segmentData);
    let segmentbean = this.segmentData['onwardFlightOption']['optionSegmentBean'];
    //console.log(segmentbean);
    // if(segmentbean.lccflight == true)
    //   this.passengerLength = 40;
    // else
    //   this.passengerLength = 54;
    var reqbody ={
      "destinationCountry": this.segmentData['onwardFlightOption']['optionSegmentBean'][0]['destinationCountry'],
      "optionSegmentBean":segmentbean,
      "originCountry": this.segmentData['onwardFlightOption']['optionSegmentBean'][0]['originCountry'],
      "platingCarrier": this.segmentData['onwardFlightOption']['platingCarrier'],
      "tripType":"MultiCity"
    }
    //console.log(reqbody);
    this.flightService.getMandatoryFields(reqbody).subscribe((Data) =>{
      //console.log('Data from Api',Data);
      this.objdata={
        "statusCode": Data['statusCode'], 
        "statusMessage": Data['statusMessage'],
        "passportValidation":  this.segmentData['onwardFlightOption']['platingCarrier'] == 'IX'? true:Data['passportValidation'] ,
        "nationalityValidation":this.segmentData['onwardFlightOption']['platingCarrier'] == 'G9' || this.segmentData['onwardFlightOption']['platingCarrier'] == 'IX'? true:Data['nationalityValidation'],
        "dobValidation":this.segmentData['onwardFlightOption']['platingCarrier'] == 'SG'|| this.segmentData['onwardFlightOption']['platingCarrier'] == '6E'||this.segmentData['onwardFlightOption']['platingCarrier'] == 'IX'? true: Data['dobValidation'], 
        // "passengerLength" :this.passengerLength
      }
      //console.log("Plating carrier:-",this.segmentData['onwardFlightOption']['platingCarrier'])
      //console.log('Data for validation in travlers detail page:-'+ JSON.stringify(this.objdata));
      if(this.objdata)
        this.flightService.sendDataToTraveller(this.objdata);
   })
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



  async continuenew() {
    const modal = await this.modalController.create({
      component: UserLoginComponent
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
    this.travSub.unsubscribe();
    // this.subscribtionTravellerDetails.unsubscribe();
    // this.subscribtionTravellerDetails2.unsubscribe();
    this.getDataSearchResult.unsubscribe();
  }

  editflight() {
    this.cookieService.delete('timerStart')
    // this.router.navigate(["/search-flights"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);

  }

  

  isTimerCookie: any;
  sessionTime = 15;///rrr
  setTimeOutPopupInCookie() {
    //console.log(this.IsLccFlight)
    // let sessionTimeFlight = this.IsLccFlight ? 10: 15;
    let sessionTimeFlight = this.sessionTime;
    sessionStorage.setItem('test', 'value')
    //console.log('session timer', sessionTimeFlight)
    if (this.isTimerCookie == 'true' && this.isDataFromSearchResult == true) {
      this.cookieService.delete('timerStart')
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + sessionTimeFlight);

      this.cookieService.set('timerStart', 'true', dateNow, '', '', false, 'Lax');


      //console.log('if cookie is here and search result also true, set new cokkie and remove old one')
    }
    else if (this.isTimerCookie == false && this.isDataFromSearchResult == true) {

      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + sessionTimeFlight);
      this.cookieService.set('timerStart', 'true', dateNow, '', '', false, 'Lax');
      //console.log('if cookie is not here, set new cokkie')
    } else {
      //console.log('cokkie exist')
    }

  }

  getCokkiesData() {
    this.isTimerCookie = this.cookieService.check('timerStart');
    //console.log('timerStart val>>>',this.isTimerCookie);
  }

  getDataSearchResult: Subscription;
  isDataFromSearchResult: any;
  getDataFromSearchResultSimilar() {
    this.getDataSearchResult = this.flightService.getSearchResuldataIfClickOnCard.subscribe(
      (res) => {
       //console.log('getSearchResuldataIfClickOnCard>>>',res);
        if (res) {
          this.isDataFromSearchResult = res;
          this.getCokkiesData();
          this.setTimeOutPopupInCookie();
        }
      }
    )
  }

  sendDataToConfirmFlight() {
    this.flightService.sendSearchResultCard(false);
  }
  backToSearch(){
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    //console.log(countryCode)
    let setLanguageSetting = 'en';
    window.location.replace(countryCode + "/" + setLanguageSetting + '/search-flights')
    // this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
    this.getReponse = false;
  }


  loaddashboard() {
    
    if(this.isAffBooking == 'true'){
    
      let service = this.globalService.getDashboard().subscribe(dash => {
        //console.log('get dashboard on review page',dash);
  
     let countries = dash['countryList'];
      let dafaultcname = countries.filter((res)=>{
         return res.defaultCountry == true
        }
      )
       //console.log(dafaultcname[0]);
      let defaultcountryName = dafaultcname[0].countryName;
      let defaultcountryCode = dafaultcname[0].countryCode;
        //sessionStorage.setItem('currentCountryName',defaultcountryCode);
      localStorage.setItem('currentCountryName',defaultcountryCode);

        });
    }else{
      //console.log('no dashboard will load > no aff');

    }

  }

  // @HostListener('window:beforeunload', ['$event'])
  // reloadPage($event){
  //   $event.preventDefault();
  //   $event.returnValue = "";
  //   return event;
  // }

}
