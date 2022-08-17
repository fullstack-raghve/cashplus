import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, NgZone, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "src/app/services/global.service";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { MatBottomSheetRef, MatBottomSheet } from "@angular/material";
import { PriceFilterComponent } from "../price-filter/price-filter.component";
import { FlightFilterComponent } from "../flight-filter/flight-filter.component";
import { FlightService } from "src/app/services/flight.service";
import { LoadingController, NavController, IonContent } from "@ionic/angular";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from "moment";
import { FilterReturnwayComponent } from '../filter-returnway/filter-returnway.component';
import { FilterMultiComponent } from '../filter-multi/filter-multi.component';
import { OriginDestinationService } from 'src/app/services/origin-destination.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { RouterStateSnapshot } from '@angular/router';
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';
import { filter, pairwise } from 'rxjs/operators';
import { ScrollPaginationService } from 'src/app/services/scroll-pagination.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { NullAstVisitor } from '@angular/compiler';
import  *  as  airportList  from  '../../../../../../assets/airportList.json';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
@Component({
  selector: "app-searchresult",
  templateUrl: "./searchresult.component.html",
  styleUrls: ["./searchresult.component.scss"],

})
export class SearchresultComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
 
  language = 'en'
  math = Math;
  loading = true;
  loaderToShow: any;
  private foo: string;
  returwaydata: any;
  formdata: Subscription;
  refreshedData: Subscription;
  flightarr = [];
  flightarrreturn = [];
  flightarr1 = [];
  flighttofilter = [];
  flighttofilterreturn = [];
  origins: any;
  destinations: any;
  JourneyDate: any;
  journeyDate: any;
  economy: any;
  orignname: any;
  destname: any;
  economyname: any;
  trvllertotal: any;
  datefield: any;
  onewaytriptype: any;
  returnwaytriptype: any;
  returnflightarr = [];
  returnflightarrTotal =[];
  filteredflight: any[];
  SelectedplatingCarrierName: any;
  selectedFlightPrice: any;
  searchCacheKeyoneway: any;
  searchCacheKey: any;
  flightOptionKey: any;
  key: string;
  noFilteredflight = false;
  isScrollable = true;
  isScrollableoneway = true;

 onewaynoflightfilter = false;
  loader = 0;
  totalduration: any;
  seladult: string;
  selchildren: string;
  selinfants: string;
  adult: any;
  children: any;
  infants: any;
  adultdefault: any;
  departDate: any;
  returnDate: any;
  reqdepartdate: any;
  reqreturndate: any;
  finalorigin: any;
  finaldest: any;
  myeconomyonward: any;
  myeconomyreturn: any;
  sortprice: boolean;
  duration: boolean;
  deparure: boolean;
  arrival: boolean;
  flighttofilterasec: any[];
  flighttofilterdepart: any[];
  flight_for_filter_multi: any;
  mlti_trip_type: any;
  flightforfiltermulti: any;
  mltitriptype: any;
  removeduplicateinmulti: any;
  filteredflightmulti: any;
  triptyp: any;
  flightsimilarmlti: any;
  travSub: Subscription;
  selectedflight: any;
  countryId: string;
  groupId: string;
  flightOptionKeyreturn: string;
  totalMultiflights: any;
  flightwidget: any;
  serviceVendor: any;
  sortbyresponse: any;
  multiuniques: any;
  roundtriptype: any;
  finalResult1: any = [];
  finalResult2: any = [];
  multitotals: any = [];
  count = 0;
  sortedby: string;
  newOneWayAllData1: any;
  newmultiAllData: any;
  maximumFractionDigits = 0;
  pagecount = 0;

  newResponseReturnway: Object;
  tripTypeParam: string;
  originNew: string;
  destinationNew: string;
  OriginAirportCityName: string;
  DestinationAirportCityName: string;
  countryCode: string;
  previoueurl: any;
  isrefreshed: string;
  FlightOnwardCabinClass: string;
  FlightOnwardCarrier: string;
  FlightReturnCabinClass: string;
  returnwaydepartDate: string;
  returnwayreturnDate: string;
  flightarronewayTotal =[];
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
  whichinfant: string | number;
  whichchild: string | number;
  whichadult: string | number;
  refreshSub:Subscription;
  ccData :any;
  valforreturncc :any;
  umretunwayOnwrd: number;
  umretunwayReturn: number;
  todayDateis = moment().format("YYYY-MM-DD");
  countrycode: string;
  countryInUrl: string;
  trueCountry: any;
  myccFinal: string;
  myccFinal3: string;
  webMulticity;
  isBack = false

  constructor(
    private _origindesi: OriginDestinationService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public loadingController: LoadingController,
    private globalService: GlobalService,
    private bottomSheet: MatBottomSheet,
    private flightService: FlightService,
    private cd: ChangeDetectorRef,
    public navCtrl: NavController,
    private location: Location,
    private spinner: NgxSpinnerService,
    private sendTravllerDataService: SendTravllerDataService,
    private cookieService: CookieService,
    private scrollPaginationService : ScrollPaginationService,
 private overlayService: OverlayService

    // private _bottomSheetRef: MatBottomSheetRef<PriceFilterComponent>
  ) {


    setInterval(() => {
      this.loader += 0.1;
    }, 200);
  }

  getCountryId = Number(localStorage.getItem("countryId"));
  getCountryGroupId = Number(localStorage.getItem("groupId"));
  ionViewWillEnter() {
    this.flightService.sendfareBreakup('');
    this.flightService.getCardSate().subscribe(res=>{
     // //console.log(res)
      if(res){
        this.loading = true;
            }
    })

    localStorage.removeItem('surchargeAmount');
    localStorage.removeItem('cpo');
    localStorage.removeItem('cpm');
    localStorage.removeItem('cpr');
   // //console.log('i am ion view qill enter');
  }


  ngOnInit() {
    //this.calculateDataOneway();
//this.checkUrloneway()
  sessionStorage.removeItem('booking-type');
  sessionStorage.removeItem("isAffBooking");
  sessionStorage.removeItem("allPassengers");
  sessionStorage.removeItem("selectedFlightOptionKey");
  sessionStorage.removeItem("fareConfirmReqKeyLocal");
  

this.countrycode = localStorage.getItem('countryCode').toLowerCase();
    localStorage.removeItem('Filtered_Data');
    localStorage.removeItem('surchargeAmount');
    localStorage.removeItem('cpo');
    localStorage.removeItem('cpm');
    localStorage.removeItem('cpr');
    sessionStorage.removeItem("affilatePartnerId");
    this.flightService.sendfareBreakup('');

    let EconomyData = localStorage.getItem("EconomyData");
    let DataEconomyData;
    if (EconomyData) {
      DataEconomyData = JSON.parse(EconomyData);
      this.ccData = DataEconomyData[1];
    }
     else this.ccData =1;

    //for return cc
    let returnccData = localStorage.getItem("ReturnCC");
    ////console.log(returnccData);

    if(returnccData) {
     let returnccValue = JSON.parse(returnccData);
      this.valforreturncc = returnccValue[1];
    } 
    else 
      this.valforreturncc = 1;
    ////console.log("Local storage Economy:-" + "onwards:"+this.ccData+"return:"+this.valforreturncc);
    this.flightService.getpagerefresh().subscribe(res=>{
      // //console.log('page refresh api',res);
      this.isrefreshed = res;
      if(res){
        
this.isBack = true;
        // //console.log('page not refreshed')
       }else{
        let searchpageurl = this.router.url.substr(1);

        if(searchpageurl.includes('Adult')){
          this.unmaskUrlOneway();

         }else{

         
        this.getDashboard();
        let tripType =  sessionStorage.getItem('tripType')
      //  //console.log('tripType',tripType);
       if(tripType == 'multicity'){
        // this.backTo();
         let countryCode = localStorage.getItem('countryCode').toLowerCase();
         let setLanguageSetting = 'en';
         this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
     
       }else{
        this.getDashboard();

       }
        //  //console.log('page refreshed');
      }
       }
    })

  this.newOneWayAllData1 = ''
    this.selectedflight = "";
    
    this.myLocation()
 

    // this.sortprice = true;
    // this.sortnow();
    this.odddata();
    this.flightarr = [];
    this.returnflightarr = [];
    this.totalMultiflights = [];
    this.roundTripResult = [];
    this.multiCityResult = [];
    this.oneWayResult = [];
    this.loading = true;
    localStorage.removeItem('checkedList1');
    sessionStorage.removeItem('checkedList1');

    this.gettravllerfromservice();
    this.getFlights();
    //this.getOnewayformdata();
    this.getformdata();
    this.getselectedtravllersfromlocal();
    this.getwidget();
    this.countryId = localStorage.getItem("countryId");
    this.groupId = localStorage.getItem("groupId");
    // this.bottomSheet.open(FlightFilterComponent);
    this.sortedby = localStorage.getItem('sortedBy');
    let searchPageURL = this.router.url.substr(1);
    localStorage.setItem('searchPageURL',searchPageURL);
    sessionStorage.setItem('searchPageURL',searchPageURL);
    let countryInUrl = searchPageURL.split('/');
    this.countryInUrl = countryInUrl[0];
  }

 

  checkUrloneway(){
    let searchpageurl = this.router.url.substr(1);

    if(searchpageurl.includes('Adult')){
     // alert('yes adult is in url');
     this.unmaskUrlOneway();
     // //console.log('yes adult is in url');

      
    }else{
     // alert('no adult is in url');
      ////console.log('no adult is in url');

    }
  }

  unmaskUrlOneway(){
    ////console.log('yes adult is in url');
    let afterdomainpart = this.router.url;
    let x = '/ae/en/cheap-flights/search/Dubai-to-New-Delhi/DXB-DEL/Oneway'
    let Beforedomainpart =  window.location.origin;
    let fullurl =  Beforedomainpart+x;
      //  location.replace(fullurl);

///cal full city and fetch date from url -cb1
this.calculateDataOneway();



  }
  airportItem = airportList;
  UMOpaxinfochildd;
  calculateDataOneway(){

    localStorage.removeItem('UMOpaxinfoinfant');
    localStorage.removeItem('UMOpaxinfo');
  localStorage.removeItem('UMOpaxinfochild');

    let searchpageurl = this.router.url.substr(1);
    if(searchpageurl.includes('Adult') && !searchpageurl.includes('Child') && !searchpageurl.includes('Infant')){
    this.activatedroute.paramMap.subscribe(params => {
      //console.log(params)
      this.UMOcountryCode = params.get("countryCode");
      this.UMOlanguage = params.get("language");
      this.UMOonwrdate = params.get("OriginAirportCityName-:to-:DestinationAirportCityName");

       ///chk date status///////
   let currentDate =  moment(this.todayDateis).format('YYYY-MM-DD');
   let urlDate = moment(this.UMOonwrdate).format('YYYY-MM-DD');
   if(urlDate > currentDate){
     //console.log('urlDate is Greter than currentDate');
   }else if(currentDate > urlDate){
     //console.log('urlDate is less than currentDate');
     this.UMOonwrdate = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("YYYY-MM-DD");
   
   }else{
     //console.log('Both date are same');
   }
   //////////////

      this.flightService.sendheaderdate(moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
      this.UMOfullcity = params.get("search");
      this.UMOcabinclass = params.get("originCity-:destinationCity");
    let UMOpaxinfo =  params.get("tripType");
    this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

    +this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;

    
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
//
sessionStorage.setItem('refreshedOrigin',this.UMOoriginNew);
sessionStorage.setItem('refreshedDest',this.UMOdestinationNew);
  

    ////console.log(this.airportItem)
   // //console.log(this.airportItem['default']);
let finalist = this.airportItem['default'];
  let filterorigin = finalist.filter((data)=>{
     return data.airportCode == this.UMOoriginNew;
    });
   // //console.log('filterorigin',filterorigin);
   let urlorigincityname = filterorigin[0].cityName;
    let destinationfinl = finalist.filter((data)=>{
      return data.airportCode == this.UMOdestinationNew;
     });
   // //console.log('destinationfinl',destinationfinl);
    let urldestcityname = destinationfinl[0].cityName;

  let OriginAirportCityName =  urlorigincityname && urlorigincityname.replace(/\s/g, '-');
let DestinationAirportCityName = urldestcityname && urldestcityname.replace(/\s/g, '-');
    
 localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
 localStorage.setItem("OriginAirportCityName",OriginAirportCityName);

 sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName);
 sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName);

    let yoneway=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Oneway'
////console.log('unmask to mask url',yoneway);
let Beforedomainpart =  window.location.origin;

let fullurl =  Beforedomainpart+yoneway;
    location.replace(fullurl);
   
    this.onewayResultUM();


  });///parms end
}//if end


///cb3 end
  }

  onewayResultUM(){
 
    this.getDashboard()

  }


  // gettravllerfromservice() {
  //   this.travSub = this.sendTravllerDataService.gettravller().subscribe(res => {
      
  //     var info = res["trvllerfield"];
  //     this.adultdefault = res.adult;
  //     this.adult = info.adult;
  //     this.children = info.children;
  //     this.infants = info.infants;
    
  //   });
  // }

  gettravllerfromservice(){
    this.travSub =  this.sendTravllerDataService.gettravller().subscribe(res=>{
     // //console.log(res)
       
      if(res && res['adult'] === 1){
        this.adultdefault = res.adult;
      }else{
        var info=res['trvllerfield'];
        this.adult = info.adult;
        this.children = info.children;
        this.infants = info.infants;
      }
     
  
  
  
  
  
   
  
    })
  
  }

  getselectedtravllersfromlocal() {
    this.seladult = localStorage.getItem("seladult");
    this.selchildren = localStorage.getItem("selchildren");
    this.selinfants = localStorage.getItem("selinfants");
  }

  showAutoHideLoader() {
    this.loadingController
      .create({
        message: "Please Wait...",
        duration: 500
      })
      .then(res => {
        res.present();

        res.onDidDismiss().then(dis => {
            // //console.log("Loading dismissed! after 2 Seconds");
        });
      });
  }

  
  backTo() {
    this.loading = false;
    this.isBack = true;
    this.flightService.sendonewaydata('');
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    let TripType = sessionStorage.getItem('tripType').toLowerCase();
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights'],{ queryParams: { path: TripType}});

    localStorage.removeItem('isrefreshed');

    //document.cookie
    // this.formdata.unsubscribe();
    localStorage.removeItem('sortedBy');
    localStorage.removeItem('currentindex');
    localStorage.removeItem('checkedList1');
    localStorage.removeItem('Filtered_Data');
    localStorage.removeItem('click');
    //
    sessionStorage.removeItem('sortedBy');
    sessionStorage.removeItem('checkedList1');
    sessionStorage.removeItem('currentindex');
    sessionStorage.removeItem('Filtered_Data');
    sessionStorage.removeItem('click');
    
    


    this._origindesi.alterback.next(false);
    this._origindesi.appback.next(true);

    //this.navCtrl.navigateBack(["/search-flights"])
  }

myLocation(){
  this.location.subscribe(x => {
    ////console.log(x)
    if(x['pop']){
      this.isBack = true;
     // //console.log('back')
    }
  }
  
    );
}

  openPrice() {
    this.bottomSheet.open(PriceFilterComponent, {
      "backdropClass": 'calender-backdrop',
      "panelClass": 'city_panel'
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      // if (res == undefined) {
      //     return;
      // }
     // //console.log('response from sort by component', res);
      this.sortbyresponse = res['data'];
      this.sortedby = localStorage.getItem('sortedBy');

      /////////////sort by for oneway----------

      //sort by price
      if (res['data']['triptype'] == "oneway" && res['data']['sortBy'] == "Price") {

        if (this.sortedby == 'PriceLH') {
          this.flightarr.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
          // //console.log('after sort by price LH', this.flightarr)
        } else {
          this.flightarr.sort(function (a, b) { return b['finalPrice'] - a['finalPrice'] });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
          // //console.log('after sort by price HL', this.flightarr)

        }

      }


      //sort by duration
      if (res['data']['triptype'] == "oneway" && res['data']['sortBy'] == "Duration") {

        if (this.sortedby == 'DurationLH') {

          this.flightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['finalDuration']) - Date.parse('01/01/2013 ' + b['finalDuration']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
         //  //console.log('after sort by DurationLH', this.flightarr);

        } else {

          this.flightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['finalDuration']) - Date.parse('01/01/2013 ' + a['finalDuration']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
          // //console.log('after sort by DurationHL', this.flightarr);
        }



      }

      //sort by departure 
      if (res['data']['triptype'] == "oneway" && res['data']['sortBy'] == "Departure") {

        if (this.sortedby == 'DepartureLH') {
          this.flightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['departTime']) - Date.parse('01/01/2013 ' + b['departTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);

         //  //console.log('after sort by DepartureLH', this.flightarr)
        } else {

          this.flightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['departTime']) - Date.parse('01/01/2013 ' + a['departTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
         //  //console.log('after sort by DepartureHL', this.flightarr)

        }


      }

      //sort by arrival 
      if (res['data']['triptype'] == "oneway" && res['data']['sortBy'] == "Arrival") {

        if (this.sortedby == 'ArrivalLH') {
          this.flightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['arrivalTime']) - Date.parse('01/01/2013 ' + b['arrivalTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
          ////console.log('after sort by ArrivalLH', this.flightarr);
        } else {
          this.flightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['arrivalTime']) - Date.parse('01/01/2013 ' + a['arrivalTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'] ,this.flightarr);
          ////console.log('after sort by ArrivalHL', this.flightarr);

        }

      }

      /////////////sort by for returnway---------------------

      //sort by price
      if (res['data']['triptype'] == "returnway" && res['data']['sortBy'] == "Price") {

        if (this.sortedby == 'PriceLH') {
          this.returnflightarr.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by PriceLH', this.returnflightarr)
        } else {
          this.returnflightarr.sort(function (a, b) { return b['finalPrice'] - a['finalPrice'] });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by PriceHL', this.returnflightarr)
        }


      }


      //sort by duration
      if (res['data']['triptype'] == "returnway" && res['data']['sortBy'] == "Duration") {

        if (this.sortedby == 'DurationLH') {
          this.returnflightarr.sort(function (a, b) {
            return a['finalDurationOfJourney'] - b['finalDurationOfJourney'];
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by DurationLH', this.returnflightarr)
        } else {
          this.returnflightarr.sort(function (a, b) {
            return b['finalDurationOfJourney'] - a['finalDurationOfJourney'];
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by DurationHL', this.returnflightarr)
        }


      }

      //sort by departure 
      if (res['data']['triptype'] == "returnway" && res['data']['sortBy'] == "Departure") {


        if (this.sortedby == 'DepartureLH') {

          this.returnflightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['departTime']) - Date.parse('01/01/2013 ' + b['departTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by DepartureLH', this.returnflightarr)
        } else {

          this.returnflightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['departTime']) - Date.parse('01/01/2013 ' + a['departTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by DepartureHL', this.returnflightarr)
        }


      }

      //sort by arrival 
      if (res['data']['triptype'] == "returnway" && res['data']['sortBy'] == "Arrival") {

        if (this.sortedby == 'ArrivalLH') {
          this.returnflightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['arrivalTime']) - Date.parse('01/01/2013 ' + b['arrivalTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by ArrivalLH', this.returnflightarr);
        } else {

          this.returnflightarr.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['arrivalTime']) - Date.parse('01/01/2013 ' + a['arrivalTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.returnflightarr);
          ////console.log('after sort by ArrivalHL', this.returnflightarr);

        }


      }


      //////////////////////////sort by for multicity ----
    //  this.getCurrentResultInfo(this.triptyp,this.totalMultiflights);
      //sort by price
      if (res['data']['triptype'] == "multicity" && res['data']['sortBy'] == "Price") {

        if (this.sortedby == 'PriceLH') {
          this.totalMultiflights.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
          //////console.log('after sort by PriceLH', this.totalMultiflights)
        } else {

          this.totalMultiflights.sort(function (a, b) { return b['finalPrice'] - a['finalPrice'] });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
          //////console.log('after sort by PriceLH', this.totalMultiflights)
        }


      }

      //sort by duration
      if (res['data']['triptype'] == "multicity" && res['data']['sortBy'] == "Duration") {

        if (this.sortedby == 'DurationLH') {
          this.totalMultiflights.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['finalDurationOfJourney']) - Date.parse('01/01/2013 ' + b['finalDurationOfJourney']);
          });

          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
          //////console.log('after sort by DurationLH', this.flightarr)
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);

        } else {
          this.totalMultiflights.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['finalDurationOfJourney']) - Date.parse('01/01/2013 ' + a['finalDurationOfJourney']);
          });

          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
         //// //console.log('after sort by DurationHL', this.flightarr)

        }


      }

      //sort by departure 
      if (res['data']['triptype'] == "multicity" && res['data']['sortBy'] == "Departure") {

        if (this.sortedby == 'DepartureLH') {

          this.totalMultiflights.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['departTime']) - Date.parse('01/01/2013 ' + b['departTime']);
          });

          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
         //// //console.log('after sort by DepartureLH', this.totalMultiflights)
        } else {
          this.totalMultiflights.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['departTime']) - Date.parse('01/01/2013 ' + a['departTime']);
          });

          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
         //// //console.log('after sort by DepartureHL', this.totalMultiflights)

        }


      }


      //sort by arrival 
      if (res['data']['triptype'] == "multicity" && res['data']['sortBy'] == "Arrival") {


        if (this.sortedby == 'ArrivalLH') {
          this.totalMultiflights.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['arrivalTime']) - Date.parse('01/01/2013 ' + b['arrivalTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
          ////console.log('after sort by ArrivalLH', this.totalMultiflights)

        } else {

          this.totalMultiflights.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + b['arrivalTime']) - Date.parse('01/01/2013 ' + a['arrivalTime']);
          });
          this.scrollToElementById('#card_grid');
          this.getCurrentResultInfo(res['data']['triptype'],this.totalMultiflights);
         // //console.log('after sort by ArrivalHL', this.totalMultiflights)

        }


      }

    });

  }
perPageRender = 8;
  openFilter() {

    let reqBody = {
      data: this.newOneWayAllData,
      type: 'oneWay',
    }
    // //console.log(reqBody)
    this.bottomSheet.open(FlightFilterComponent, {
      data: reqBody,
      "backdropClass": 'calender-backdrop',
      "panelClass": 'city_panel',
      "disableClose" : true
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      // //console.log(res);

      if (res != undefined) {
        if (res && res.data.length != 0) {
          this.onewaynoflightfilter = false;
          this.scrollToElementById('#card_grid');
          this.flightarr = res["data"].filter(
            (v, i, a) =>
              a.findIndex(
                t =>
                  t.platingCarrier === v.platingCarrier &&
                  t.flightFare.t3Price === v.flightFare.t3Price
              ) === i
          );
          
          this.getCurrentResultInfo(this.triptyp, this.flightarr);
        }
        else {
          this.oneWayTripScrollShow = false;
          this.oneWayResult = [];
          this.onewaynoflightfilter = true;
          this.shownoFilter = true;
        }
    }
//       if (res != undefined){

//         let sendFinalData = res["data"].filter(
//           (v, i, a) =>
//             a.findIndex(
//               t =>
//                 t.platingCarrier === v.platingCarrier &&
//                 t.flightFare.t3Price === v.flightFare.t3Price
//             ) === i
//         );
//         //console.log('after uniques', sendFinalData)
//         this.flightarr = sendFinalData;
//         if(this.flightarr.length<1){

//           this.onewaynoflightfilter = true;
//           //console.log(this.onewaynoflightfilter);
//           //console.log(this.flightarr.length);

//         }
//         if(this.flightarr.length<this.flightarronewayTotal.length){
//           //console.log('filtered data length is less then total');
//           this.isScrollableoneway = false;
//           //console.log('is scrollable status',this.isScrollableoneway)

// }else{
//  this.isScrollableoneway = true;
//  //console.log('filtered data length is not less then total');
//  //console.log('is scrollable status',this.isScrollableoneway)

// }
//       }
      // //console.log(this.newOneWayAllData)
    });
  }


  openFilter1() {

    let reqBody = {
      data: this.newOneWayAllData1,
      type: 'return',
      // 'click_clear_button': this.noFilteredflight
    }
    // //console.log(reqBody)
    this.bottomSheet.open(FilterReturnwayComponent, {
      data: reqBody,
      "backdropClass": 'calender-backdrop',
      "panelClass": 'city_panel',
      "disableClose" : true
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      // //console.log(res);
      if (res != undefined) {
        if (res && res.data.length != 0) {
          this.noFilteredflight = false;
          this.scrollToElementById('#card_grid');
          this.returnflightarr = res["data"].filter(
            (v, i, a) =>
              a.findIndex(
                t =>
                t['onwardFlightOption']["flightlegs"][0].carrier ===
                v['onwardFlightOption']["flightlegs"][0].carrier &&
                t['returnFlightOption']["flightlegs"][0].carrier ===
                v['returnFlightOption']["flightlegs"][0].carrier &&
                t.t3Price === v.t3Price
              ) === i
          );
        
          this.getCurrentResultInfo(this.returnwaytriptype, this.returnflightarr);
        }
        else {
          this.roundTripScrollShow = false;
          this.roundTripResult = [];
          this.noFilteredflight = true;
          this.shownoFilter = true;
        }
    }
    });
  }

  noFilteredflightmulti = false;
  openFiltermulti() {

    let reqBody = {
      data: this.newmultiAllData,
      type: 'multicity',
    }
    // //console.log(reqBody)
    this.bottomSheet.open(FilterMultiComponent, {
      data: reqBody,
      "backdropClass": 'calender-backdrop',
      "panelClass": 'city_panel',
      "disableClose" : true
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      //  //console.log(res);
       if(res != undefined){
      if ( res &&  res.data.length != 0 ) {
        this.scrollToElementById('#card_grid');
        this.totalMultiflights = res["data"];
        this.noFilteredflightmulti = false;

        this.getCurrentResultInfo(this.triptyp,this.totalMultiflights);
      }
      else{
        this.multicityScroll = false;
        this.multiCityResult = [];
        this.noFilteredflightmulti = true;
        this.shownoFilter = true;
      }
    }
    });
  }

  @ViewChild(IonContent) resultContent: IonContent;
  scrollToElementById(id: any) {
    this.resultContent.scrollToTop(10);
  }

  ///////////////////////similar option returnway--start/////////////////////////
  similarOptionreturn(flighdata) {
    let countrycode = localStorage.getItem('countryCode').toLowerCase();

    if(countrycode != this.countryInUrl){
     // //console.log('this.countrycode, this.countryInUrl',this.countrycode,this.countryInUrl);
    
///////

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
  ////console.log(result.value == true);
  if (result.value == true) {
    //this.router.navigate([this.searchPageURL]);
    //console.log('clicked ok');

  }
});


      return;
    }

    this.selectedflight = flighdata;
    
this.clearRuleData();
    //send flight details to fare details component ---------
    this.flightService.sendflightdetails(this.selectedflight);
    localStorage.setItem('FlightOnwardCabinClass',flighdata.onwardFlightOption.flightFare.cabinClass);
    localStorage.setItem('FlightReturnCabinClass',flighdata.returnFlightOption.flightFare.cabinClass);
    localStorage.setItem('FlightOnwardCarrier',flighdata.onwardFlightOption.platingCarrier);
//
sessionStorage.setItem('FlightOnwardCabinClass',flighdata.onwardFlightOption.flightFare.cabinClass);
sessionStorage.setItem('FlightReturnCabinClass',flighdata.returnFlightOption.flightFare.cabinClass);
sessionStorage.setItem('FlightOnwardCarrier',flighdata.onwardFlightOption.platingCarrier);

    //get service vendor and save to local storgae 
    this.serviceVendor = flighdata['onwardFlightOption']['serviceVendor'];
    localStorage.setItem('serviceVendor', this.serviceVendor);
    sessionStorage.setItem('serviceVendor', this.serviceVendor);

    this.flightOptionKey = flighdata.flightOptionKey;
    ///

    ///set this key in local for returnway
    // //console.log(this.flightOptionKey);
    localStorage.setItem("flightOptionKey", this.flightOptionKey);
    sessionStorage.setItem("flightOptionKey", this.flightOptionKey);

    this.key = sessionStorage.getItem("searchKey");

    //////////getprice and company returnway  --- --------------------------------------------------
    var priceselectedreturn = flighdata.t3Price;
    var selectedreturnCarreronward =
      flighdata.onwardFlightOption.marketingCarrier;
    var selectedreturnCarrerreturn =
      flighdata.returnFlightOption.marketingCarrier;

    var originonward = flighdata.onwardFlightOption.origin;
    var destonward = flighdata.onwardFlightOption.destination;
    var originreturn = flighdata.returnFlightOption.origin;
    var destreturn = flighdata.returnFlightOption.destination;
    

    var returnwayfilterflight = this.flighttofilterreturn.filter(function (flight) {
      return (
        flight.t3Price == priceselectedreturn &&
        flight.onwardFlightOption.marketingCarrier ==
        selectedreturnCarreronward &&
        flight.returnFlightOption.marketingCarrier == selectedreturnCarrerreturn
      );
    });
    // //console.log(returnwayfilterflight);



    /////GET ONWARD OPTION OF SIMILAR RESUTL

    var onwardoptionofsmilar = this.flighttofilterreturn.filter(function (
      flightonward
    ) {
      return (
        flightonward.onwardFlightOption.origin == originonward &&
        flightonward.onwardFlightOption.destination == destonward &&
        flightonward.onwardFlightOption.flightFare.t3Price ==
        priceselectedreturn &&
        flightonward.onwardFlightOption.marketingCarrier ==
        selectedreturnCarreronward
      );
    });
    // //console.log(onwardoptionofsmilar);

    /////END ONWARD OPTION OF SIMILAR RESUTL
    /////GET RETURN OPTION OF SIMILAR RESUTL

    var returnoptionofsmilar = this.flighttofilterreturn.filter(function (
      flightreturn
    ) {
      return (
        flightreturn.returnFlightOption.origin == originreturn &&
        flightreturn.returnFlightOption.destination == destreturn &&
        flightreturn.returnFlightOption.flightFare.t3Price ==
        priceselectedreturn &&
        flightreturn.returnFlightOption.marketingCarrier ==
        selectedreturnCarreronward
      );
    });
    // //console.log(returnoptionofsmilar);

    /////END RETURN OPTION OF SIMILAR RESUTL

    if (returnwayfilterflight.length < 2) {
      this.proceedreturnway(flighdata);
      this.cookieService.delete('timerStart');
      this.sendDataToConfirmFlight();
    } else {
     
      ////////
      this.flightService.sendsimilarflightreturnway(returnwayfilterflight);
      //SEND SELECTED FLIGHT IN SIMILAR
     // //console.log(flighdata)
      this.flightService.selectedFlight(flighdata);

      this.flightService.sendsimilarflight("");

      this.flightService.sendsimilarflightmulti("");

    // this.router.navigate(["/similarOption"+'/cheap-flights'+'/search']);
     let ctnames = localStorage.getItem("cityDetails");       
     

     if(ctnames != null){
      let ctdetail = JSON.parse(ctnames);
     // //console.log("citynames:"+ JSON.stringify(ctdetail));
      this.OriginAirportCityName = ctdetail['Origin'].replace(/\s/g, '-'); 
      this.DestinationAirportCityName = ctdetail['Destination'].replace(/\s/g, '-');

     }else{

     }


     this.router.navigate([this.countryCode+'/'+this.language+'/'+'cheap-flights/'+'search/'+this.OriginAirportCityName+'-to-'+this.DestinationAirportCityName+'/'+this.finalorigin+'-'+this.finaldest+'/Return'+'/SimilarFlights']);


    }

  }

  ///////////////////////similar option returnway---end/////////////////////////

  ////////////////////smilar option/selcted start////////// -oneway-multi
  similarOption(selectedflight) {
    let countrycode = localStorage.getItem('countryCode').toLowerCase();
    ////console.log('this.countrycode, this.countryInUrl',countrycode,this.countryInUrl);

    if(countrycode != this.countryInUrl){
     // //console.log('this.countrycode, this.countryInUrl',this.countrycode,this.countryInUrl);
    
///////

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
  ////console.log(result.value == true);
  if (result.value == true) {
    //this.router.navigate([this.searchPageURL]);
    //console.log('clicked ok');

  }
});


      return;
    }
///////
this.clearRuleData();
    localStorage.setItem('FlightOnwardCarrier',selectedflight.platingCarrier);
    localStorage.setItem('FlightOnwardCabinClass',selectedflight.flightFare.cabinClass);

    sessionStorage.setItem('FlightOnwardCarrier',selectedflight.platingCarrier);
    sessionStorage.setItem('FlightOnwardCabinClass',selectedflight.flightFare.cabinClass);
   
this.onewaySelectedFlight = selectedflight
    this.selectedflight = selectedflight;

    //get service vendor and save to local storgae 
    this.serviceVendor = selectedflight['serviceVendor'];

    localStorage.setItem('serviceVendor', this.serviceVendor);
    localStorage.setItem('flightOptionKey', selectedflight['flightOptionKey']);
//
sessionStorage.setItem('serviceVendor', this.serviceVendor);
sessionStorage.setItem('flightOptionKey', selectedflight['flightOptionKey']);


    //send flight details to fare details component ---------
    this.flightService.sendflightdetails(this.selectedflight);
    //////code for flight key and searchkey of selected card\
    // //console.log(selectedflight);
    ////select card
    ///flight key
    this.flightOptionKey = selectedflight.flightOptionKey;
    /////////search key
    this.key = sessionStorage.getItem("searchKey");
    ///send selected flights to similar/confirm-flight component
    //this.flightService.selectedFlight(flight);
    // //console.log(this.key);
    //this.router.navigate(['/confirm-flight'])

    ///////////code end
    ///getprice and company
    // this.selectedFlightPrice = selectedflight.flightFare.t3Price;
    let displayfare = selectedflight.flightFare.totalBaseFare + selectedflight.flightFare.totalTax + selectedflight.flightFare.totalFees + selectedflight.flightFare.markupPrice + selectedflight.flightFare.serviceChargePrice
    this.selectedFlightPrice = displayfare - selectedflight.flightFare.discountPrice
    // this.selectedFlightPrice = displayfare - selectedflight.flightFare.discountPrice.formatter.maximumFractionDigits

    var price = this.selectedFlightPrice;

    this.SelectedplatingCarrierName = selectedflight.platingCarrier;
    var carriercompany = this.SelectedplatingCarrierName;

    // //console.log(carriercompany);
    // //console.log(price);

    //////////getprice and company returnway  end--- ---------------------------------------------------

    /////////filter selected.flight oneway

    var filteredflight = this.flighttofilter.filter(function (flight) {
      return (
        flight.flightFare.totalBaseFare + flight.flightFare.totalTax + flight.flightFare.totalFees + flight.flightFare.markupPrice + flight.flightFare.serviceChargePrice - flight.flightFare.discountPrice == price &&
        flight.platingCarrier == carriercompany
      );
    });

    // //console.log(onewayfilterflight);
   
    filteredflight.map(res => {
      res["departTime"] = res["flightlegs"][0]["depTime"];
      res["arrivalTime"] =  res["flightlegs"][res["flightlegs"].length - 1]["arrTime"];
      res["arrivalDateoneway"] =  res["flightlegs"][res["flightlegs"].length - 1]["arrDate"];
    });
    filteredflight.sort(function (a, b) {
      return Date.parse('01/01/2013 ' + a['departTime']) - Date.parse('01/01/2013 ' + b['departTime']);
    });
    // //console.log('after sort',filteredflight);

////sort by date onway

    filteredflight.sort((a, b) => {
      return <any>new Date(a['arrivalDateoneway']) - <any>new Date(b['arrivalDateoneway']);
      });
    ///////end condition

    /////end filter
    ///send selected flights to similar/confirm-flight component
    this.flightService.selectedFlight(selectedflight);
    ///send similar flights to similar component -oneway and return
    //this.flightService.sendsimilarflight(returnwayfilterflight)

    ///oneway flight to similar option to similar page send

    if (filteredflight) {
      //alert('oneway')
      this.flightService.sendsimilarflight(filteredflight);
      this.flightService.sendsimilarflightreturnway("");
      this.flightService.sendsimilarflightmulti("");
    }

    /////if-else condition on the baisis --if similar flight are then on similar otherwise on

    if (filteredflight.length > 1) {
     // //console.log("length is gr than 1");
      // this.finalorigin = this.finalorigin ? this.finalorigin : localStorage.getItem('refreshedOrigin');
      // this.finaldest = this.finaldest ? this.finaldest : localStorage.getItem('refreshedDest')
     
      let ctnames = localStorage.getItem("cityDetails"); 
      if(ctnames != null){
        let ctdetail = JSON.parse(ctnames);
       // //console.log("citynames:"+ JSON.stringify(ctdetail));
   
        this.OriginAirportCityName = ctdetail['Origin'].replace(/\s/g, '-'); 
        this.DestinationAirportCityName = ctdetail['Destination'].replace(/\s/g, '-');
      }else{

      }      
   
      //this.router.navigate(["/similarOption"]);
      this.router.navigate([this.countryCode+'/'+this.language+'/'+'cheap-flights/'+'search/'+this.OriginAirportCityName+'-to-'+this.DestinationAirportCityName+'/'+this.finalorigin+'-'+this.finaldest+'/Oneway'+'/SimilarFlights']);

    } else {
      // //console.log("length is less than 1");
      this.proceednosimilar();
      this.cookieService.delete('timerStart');
      this.sendDataToConfirmFlight();
    }
  }



  ////////////////////smilar/selcted end//////////

  ////similar and selected flight on the basis of selected flight ---multi start
  similarOptionMulti(selectedflight) {



    let countrycode = localStorage.getItem('countryCode').toLowerCase();
    //console.log('this.countrycode, this.countryInUrl',countrycode,this.countryInUrl);

    if(countrycode != this.countryInUrl){
      //console.log('this.countrycode, this.countryInUrl',this.countrycode,this.countryInUrl);
    
///////

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
  ////console.log(result.value == true);
  if (result.value == true) {
    //this.router.navigate([this.searchPageURL]);
    //console.log('clicked ok');

  }
});


      return;
    }
///////

this.clearRuleData();
    this.selectedflight = selectedflight;
    ///send selected flight to fare details component 
    this.flightService.sendflightdetails(this.selectedflight);


    // //console.log(selectedflight);
    this.flightOptionKey = selectedflight.flightOptionKey;
    this.key = sessionStorage.getItem("searchKey");

    this.flightOptionKey = selectedflight.flightOptionKey;
    localStorage.setItem("flightOptionKey", this.flightOptionKey);
    sessionStorage.setItem("flightOptionKey", this.flightOptionKey);

    this.serviceVendor = selectedflight['serviceVendor'];

    localStorage.setItem('serviceVendor', this.serviceVendor);
    sessionStorage.setItem('serviceVendor', this.serviceVendor);

    ///getprice and company
    this.selectedFlightPrice = selectedflight.flightFare.t3Price;
    var price = this.selectedFlightPrice;

    this.SelectedplatingCarrierName = selectedflight.marketingCarrier;
    var carriercompany = this.SelectedplatingCarrierName;

    // //console.log(carriercompany);
    // //console.log(price);

    /////////filter selected.flight on the basis of selected - multicity  ==== flightforfiltermulti(426)
    // this.removeduplicateinmulti =  total flight form multiserch
    this.flightsimilarmlti = this.removeduplicateinmulti.filter(function (
      flight
    ) {
      return (
        flight.flightFare.t3Price == price &&
        flight.marketingCarrier == carriercompany
      );
    });
    // //console.log(multifilterflight);
    // //console.log(this.flightsimilarmlti);

    ///send selected flights to similar/confirm-flight component
    this.flightService.selectedFlight(selectedflight);

    ///multiflight to similar option to similar page send
    if (this.flightsimilarmlti) {
      //alert('multi')

      //we r not sending to similar page
      // this.flightService.sendsimilarflightmulti(this.flightsimilarmlti);
      this.flightService.sendsimilarflight("");
      this.flightService.sendsimilarflightreturnway("");

      //  this.router.navigate(["/similarOption"]);

      ////run this method directly on click of card
      this.proceedmulti();
      this.cookieService.delete('timerStart');
      this.sendDataToConfirmFlight();

    }
  }
  
  sendDataToConfirmFlight(){
    this.flightService.sendSearchResultCard(true);
  }
  ////similar and selected flight on the basis of selected flight ---multi start

  ////procedd if no similar flight[[[[]]]]
  // getCountryGroupId /getCountryId

  proceednosimilar() {
//console.log('proceed no similar oneway');
//console.log("i m from oneway proceed no similar");
//console.log('final origin ',this.finalorigin);
//console.log('final dest ',this.finaldest);
//console.log('dep date ', this.departDate);
//console.log('retun date ',this.returnDate);
////console.log('proceed no similar oneway selctd flight', this.onewaySelectedFlight)
    this.FlightOnwardCarrier =  this.onewaySelectedFlight.platingCarrier
    this.FlightOnwardCabinClass = this.onewaySelectedFlight.flightFare.cabinClass;
    this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
     this.FlightOnwardCabinClass = this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1)
    
    let newadultoneway = this.adult ? this.adult : 1;
    let newchildoneway = this.children ? this.children : 0;
    let newinfantoneway = this.infants ? this.infants : 0;

    if (this.FlightOnwardCabinClass === "Economy") {
         
      this.selctedcabinclass = 1;
    } else if (this.FlightOnwardCabinClass === "Premium") {
       
      this.selctedcabinclass = 2;
    } else if (this.FlightOnwardCabinClass === "Business") {
       
      this.selctedcabinclass = 3;
    } else if (this.FlightOnwardCabinClass === "FirstClass") {
       
      this.selctedcabinclass = 4;
    } else {
    }
    let branchCurrencyCode = localStorage.getItem("branchCurrencyCode");

    // let countryCodee = localStorage.getItem('countryCode');
    // this.countryCode = countryCodee.toLowerCase();
    // this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
    // this.FlightOnwardCarrier = localStorage.getItem('FlightOnwardCarrier');
    //    this.reqdepartdate = localStorage.getItem('returnwaydepartDate');
    //    this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    //    this.FlightOnwardCabinClass = this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1)
   this.presentLoading();

    var fareitem = {
      countryId: this.getCountryId,
      curruencyCode:branchCurrencyCode,
      flightOptionKey: this.flightOptionKey,
      flightSearchKey: this.key,
      flightSearchWidgetList: [
        {
          cabinClass: this.selctedcabinclass ? this.selctedcabinclass : 1,
          destination: this.finaldest,
          onwardJourneyDate: this.departDate,
          origin: this.finalorigin,
          returnJourneyDate: "DEL"
        }
      ],
      groupId: this.getCountryGroupId,
      noOfAdult: this.whichadult ? this.whichadult : newadultoneway,
      noOfChild: this.whichchild ? this.whichchild : newchildoneway,
      noOfInfant: this.whichinfant ? this.whichinfant : newinfantoneway,

      tripType: "oneway"
    };
     ////console.log(fareitem);
    this.flightService.fareConfirmapi(fareitem).subscribe(res => {
      // //console.log(res);
      if (res) {
        if(res['onwardFlightOption'] == null){
          this.flightService.selectedFlight(null);
        }else{
          this.flightService.selectedFlight(res);
        }
        this.closeLoading();
        
        this.globalService.sendFareConfirmRequestToComponent(fareitem)
      
       // this.router.navigate(["/confirm-flight"]);
       let adult = this.adult ? this.adult : 1;
       this.newadult = this.adult ? this.adult : 1
       let onewaydepartDate =  moment(this.departDate, "DD-MM-YYYY").format("YYYY-MM-DD");
     
       this.FlightOnwardCabinClass == 'FirstClass' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;
       this.FlightOnwardCabinClass == 'Premiumeconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;
       this.FlightOnwardCabinClass == 'PremiumEconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;

       let maskUrlforAdult = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.FlightOnwardCarrier+'/Oneway';
       let maskUrlforAdultChild = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.children+'Child'+'/'+this.FlightOnwardCarrier+'/Oneway';
       let maskUrlforAdultChildInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Oneway';
       let maskUrlforAdultInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Oneway';

       //console.log('onewaydepartDate',onewaydepartDate);

       //console.log('adult,child,infant top',this.newadult,this.children,this.infants);

if(this.newadult >= 1 && this.children == 0 && this.infants ==0){
  this.router.navigate([maskUrlforAdult]);

//console.log('adult,nochild,noinfant',this.newadult,this.children,this.infants)
}
if(this.newadult >= 1 && this.children >= 1 && this.infants ==0){
  this.router.navigate([maskUrlforAdultChild]);

  //console.log('adult,child,noinfant',this.newadult,this.children,this.infants)

}if(this.newadult >= 1 && this.children >= 1 && this.infants >=1){
  this.router.navigate([maskUrlforAdultChildInfant]);

  //console.log('adult,child,infant -all',this.newadult,this.children,this.infants)

}if(this.adult >= 1 && this.children == 0 && this.infants >=1){
  this.router.navigate([maskUrlforAdultInfant]);
  
  //console.log('adult,child,infant',this.adult,this.children,this.infants)
  
  }


      }
    });
  }

  //this method to get  flight info after lets fly click
  getformdata() {
    this.flightService.getflightformdata().subscribe(formdata => {
      var dataObj = formdata;
      this.orignname = dataObj.returnwayOrigin;
      this.destname = dataObj.returnwaydestination;
      this.economyname = dataObj.economy;
      this.trvllertotal = dataObj.travellerfield;
      this.datefield = dataObj.returnwaydepartDate;
      // //console.log(this.orignname);
    });
  }
  newOneWayAllData;
  //this method to get  flight api data for oneway and returnway



  /////////////other method for total duration


  zeroPad(num) {
    var str = String(num);
    if (str.length < 2) {
      return "0" + str;
    }
    return str;
  }
  totalTimeString(timeStrings) {
    // //console.log("TimeStrings", timeStrings);
    var totals = timeStrings.reduce(
      function (a, timeString) {
        var parts = timeString.split(":");
        var temp;
        if (parts.length > 0) {
          temp = Number(parts.pop()) + a.seconds;
          a.seconds = temp % 60;
          if (parts.length > 0) {
            temp = Number(parts.pop()) + a.minutes + (temp - a.seconds) / 60;
            a.minutes = temp % 60;
            a.hours = a.hours + (temp - a.minutes) / 60;
            if (parts.length > 0) {
              a.hours += Number(parts.pop());
            }
          }
        }

        return a;
      },
      {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    );

    return [
      this.zeroPad(totals.hours),
      this.zeroPad(totals.minutes),
      this.zeroPad(totals.seconds)
    ].join(":");
  }
  finalArrayResult: any = [];
  finalResult: any = [];


  ///////////end of total duration



  IsOneWayData: any;
  IsTwoData: any;
  IsMultiwayData: any;
  currentRequestBody;
  totalData;
  currentPageNumber;
  totalPage;
  getFlights() {
     //------------------webengage----------------------------------------------   
     var s = document.createElement("script");
     s.type = "text/javascript";
     s.src = "assets/js/webEngage.js";
     s.id = '_webengage_script_tag';
     $("head").append(s);

     //----------------------------------------------------------------

    this.formdata = this.flightService.getonewaydata().subscribe(data => {

       //console.log('total search flight result', data);

      if (data && data['response']["onwardFlightOptions"])
      this.IsOneWayData = data['response']["onwardFlightOptions"].length;
      this.currentRequestBody = data['reqbody']
      this.searchCacheKey = data['response'] && data['response']["searchCacheKey"];
      localStorage.setItem("searchKey", this.searchCacheKey);
      sessionStorage.setItem("searchKey", this.searchCacheKey);

      /////end searchCacheKey retunrway

      this.roundtriptype = data['response'] && data['response']['tripType']

      //////////code to get multicity data from api

      this.mltitriptype = data['response'] && data['response']["tripType"];

      this.triptyp = data['response'] && data['response']["tripType"];


      if (this.triptyp == "multicity") {

        localStorage.setItem("searchKey", this.searchCacheKey);
        sessionStorage.setItem("searchKey", this.searchCacheKey);
       // sessionStorage.setItem("WebEngageCodemulticity",JSON.stringify(data));
        this.removeduplicateinmulti = data['response']["onwardFlightOptions"];
        this.totalMultiflights = data['response']["onwardFlightOptions"];
        this.newmultiAllData = data['response']["onwardFlightOptions"];
        //console.log(data['reqbody'])
        //////////remove dulicate flight in muticity - from total////////////
        ///no unique required for multicity---
        // this.multiuniques = this.removeduplicateinmulti.filter((v, i, a) =>a.findIndex(t =>t.marketingCarrier === v.marketingCarrier && t.flightFare.t3Price === v.flightFare.t3Price) === i);
        // //console.log(this.flightforfiltermulti);
        /////add new parAMS for multicity ---

        if (this.totalMultiflights) {
          this.totalMultiflights.map(res => {
            res['finalPrice'] = res['flightFare']['t3Price'] - res['flightFare']['discountPrice'];
            res["departTime"] = res['optionSegmentBean'][0]["flightlegs"][0]["depTime"];
            res["arrivalTime"] = res['optionSegmentBean'][res['optionSegmentBean'].length - 1]["flightlegs"][["flightlegs"].length - 1]["arrTime"];
            res["departHour"] = moment(res["departTime"], "hh:mm:ss A").format("HH");
            res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss A").format("HH");

            res["companyname"] = res['optionSegmentBean'][0]["flightlegs"][0].carrier != res['optionSegmentBean'][1]["flightlegs"][0].carrier ? 'Multiple_Airline' : res["platingCarrierName"];
            res['imgname'] = res['optionSegmentBean'][0]["flightlegs"][0].carrier != res['optionSegmentBean'][1]["flightlegs"][0].carrier ? 'multiple' : res["platingCarrier"];

            var allLegsTime = [];
            for (let i = 0; i < res['optionSegmentBean'].length; i++) {
              for (let j = 0; j < res['optionSegmentBean'][i].flightlegs.length; j++) {
                let makeTIme = moment(res['optionSegmentBean'][i].flightlegs[j].journeyDuration, "hh:mm:ss").format(
                  "hh:mm:ss"
                );
                allLegsTime.push(makeTIme);
              }
              this.finalResult = this.totalTimeString(allLegsTime);
              if (i + 1 == res['optionSegmentBean'].length) {
                this.finalArrayResult.push(this.finalResult);
                this.multitotals = this.finalResult
              }
            }
            res['finalDurationOfJourney'] = this.multitotals;
          });


          //////////////////////remove flights with negative values
          this.totalMultiflights = this.totalMultiflights.filter(function(flighdata){ 
  ////console.log(flighdata)
  return flighdata.flightFare.totalBaseFare + flighdata.flightFare.totalTax + flighdata.flightFare.totalFees + flighdata.flightFare.markupPrice + flighdata.flightFare.serviceChargePrice - flighdata.flightFare.discountPrice > 0
});

         //////////////////////


          // //console.log('after adding params in multicty', this.totalMultiflights);
          this.IsMultiwayData = this.totalMultiflights;
          this.getCurrentResultInfo(this.triptyp, this.totalMultiflights);

          // if(this.totalMultiflights.length >50){
          //   this.pageSize = Math.ceil(this.totalMultiflights.length/12);
          //   //console.log('page size',this.pageSize)
          //   this.pageCurrent = 1;
          //   let getInfor = this.scrollPaginationService.getPager(this.totalMultiflights.length, this.pageCurrent, this.pageSize);
          //   //console.log(getInfor);

          //   this.multiCityResult.push(...this.totalMultiflights.slice(getInfor.startIndex, getInfor.endIndex + 1));
          //   //console.log(this.multiCityResult);
          // }else{
          //   this.multiCityResult.push(...this.totalMultiflights);
          //   //console.log(this.multiCityResult);
          // }

        }
        ///////////////////////////end duplicate multicity//////////

        // //console.log(this.flighttofilterreturn);



        ////get searchCacheKey key oneway//
        this.searchCacheKey = data['response']["searchCacheKey"];
        localStorage.setItem("searchKey", this.searchCacheKey);
        sessionStorage.setItem("searchKey", this.searchCacheKey);

        /////end cache key

          //------------------webengage----------------------------------------------    

      this.webMulticity =  JSON.parse(localStorage.getItem("MulticityData"));
      let webMultictyData = [];
      //console.log(this.webMulticity);
      let webcc;
      for(let i=0; i< 6 ; i++)
      { 
        if(this.webMulticity && this.webMulticity[i] && this.webMulticity[i].SelectedeconomyType){
          if (this.webMulticity[i].SelectedeconomyType == 1) {
            webcc = "Economy";
          } else if (this.webMulticity[i].SelectedeconomyType == 2) { 
            webcc = "Premium Economy";
          } else if (this.webMulticity[i].SelectedeconomyType == 3) {   
            webcc = "Business Class";
          } else if (this.webMulticity[i].SelectedeconomyType == 4) {  
            webcc = "First Class";
          }
        }
        else
          webcc = "";             
          var obj = {
            startingFrom :this.webMulticity && this.webMulticity[i]  && this.webMulticity[i].OriginairportName ?  this.webMulticity[i].OriginairportName : "",
            startingFromCity:this.webMulticity && this.webMulticity[i] && this.webMulticity[i].origin ?  this.webMulticity[i].origin : "",
            goingTo:this.webMulticity && this.webMulticity[i] && this.webMulticity[i].DestinationairportName ?  this.webMulticity[i].DestinationairportName : "",
            goingToCity:this.webMulticity && this.webMulticity[i] && this.webMulticity[i].destination ?  this.webMulticity[i].destination : "",
            date1:this.webMulticity && this.webMulticity[i] && this.webMulticity[i].JourneyDate ? this.webMulticity[i].JourneyDate : "",
            departCabinClass:webcc 
          }
          webMultictyData.push(obj);
    }
    //console.log(webMultictyData);
    webengage.track("SRF", {
      "Type"                  : "Multi-city Search",          			              			    
      "No of Adults"          : data['reqbody']['noOfAdult']  ? data['reqbody']['noOfAdult']  : 1+"Adult",
      "No of Children"        : data['reqbody']['noOfChild']  ? data['reqbody']['noOfChild']  : 0+"Child",
      "No of Infants"         : data['reqbody']['noOfInfant'] ? data['reqbody']['noOfInfant'] : 0+"Infant",
      // "Aliance Airlines"      : " ",
      // "Prefered Airlines"     : " ",          			    
      "Trips"  : [
      {
                "Trip1"           :  [
                  {                 				            				    
                    "Origin Airport" 		    : webMultictyData[0].startingFrom,
                    "Origin Name"           : webMultictyData[0].startingFromCity,
                    "Destination Airport"   : webMultictyData[0].goingTo,
                    "Destination Name"      : webMultictyData[0].goingToCity,
                    "Departing Date"        : webMultictyData[0].date1,
                    "Depating Flight Class" : webMultictyData[0].departCabinClass,
                  },	
                ],	
                "Trip2"           :  [
                  { 
                    "Origin Airport" 	      : webMultictyData[1].startingFrom,
                    "Origin Name"           : webMultictyData[1].startingFromCity,
                    "Destination Airport"   : webMultictyData[1].goingTo,
                    "Destination Name"      : webMultictyData[1].goingToCity,
                    "Departing Date"        : webMultictyData[1].date1,
                    "Depating Flight Class" : webMultictyData[1].departCabinClass,
                  },	
                ],	
                "Trip3"           :  [
                  { 
                    "Origin Airport" 		    : webMultictyData[2].startingFrom,
                    "Origin Name"           : webMultictyData[2].startingFromCity,
                    "Destination Airport"   : webMultictyData[2].goingTo,
                    "Destination Name"      : webMultictyData[2].goingToCity,
                    "Departing Date"        : webMultictyData[2].date1,
                 "Depating Flight Class"    : webMultictyData[2].departCabinClass,
                  },	
                ],	
                "Trip4"           :  [
                  { 
                    "Origin Airport" 	    	: webMultictyData[3].startingFrom,
                    "Origin Name"           : webMultictyData[3].startingFromCity,
                    "Destination Airport"   : webMultictyData[3].goingTo,
                    "Destination Name"      : webMultictyData[3].goingToCity,
                    "Departing Date"        : webMultictyData[3].date1,
                 "Depating Flight Class"    : webMultictyData[3].departCabinClass,
                  },	
                ],	
                "Trip5"           :  [
                  { 
                    "Origin Airport" 		    : webMultictyData[4].startingFrom,
                    "Origin Name"           : webMultictyData[4].startingFromCity,
                    "Destination Airport"   : webMultictyData[4].goingTo,
                    "Destination Name"      : webMultictyData[4].goingToCity,
                    "Departing Date"        : webMultictyData[4].date1,
                 "Depating Flight Class"    : webMultictyData[4].departCabinClass,
                  },	
                ],	
                "Trip6"           :  [
                  { 
                    "Origin Airport" 	    	: webMultictyData[5].startingFrom,
                    "Origin Name"           : webMultictyData[5].startingFromCity,
                    "Destination Airport"   : webMultictyData[5].goingTo,
                    "Destination Name"      : webMultictyData[5].goingToCity,
                    "Departing Date"        : webMultictyData[5].date1,
                   "Depating Flight Class"  : webMultictyData[5].departCabinClass,
                  },	
                ],             			    		
     }
   ],
});

  //----------------------------------------------------------------




      }
      if (this.triptyp == "oneway") {

        // //console.log('i m from oneway');


        this.newOneWayAllData = data['response']["onwardFlightOptions"];
        this.flighttofilter = data['response']["onwardFlightOptions"];
        // //console.log(this.flighttofilter);
        this.searchCacheKey = data['response']["searchCacheKey"];
        localStorage.setItem("searchKey", this.searchCacheKey);
        sessionStorage.setItem("searchKey", this.searchCacheKey);
       // sessionStorage.setItem("WebEngageCodeOneway",JSON.stringify(data));
        ///////oneway --get unique flights of oneway

        this.flightarr = this.flighttofilter.filter(
          (v, i, a) =>
            a.findIndex(
              t =>
                t.platingCarrier === v.platingCarrier &&
                t.flightFare.t3Price === v.flightFare.t3Price
            ) === i
        );
        // //console.log(this.flightarr);

        //////////total duration end

        if (this.flightarr.length > 0) {
          this.flightarr.map(res => {
            res['finalPrice'] = res["flightFare"]['t3Price'];
            res["departTime"] = res["flightlegs"][0]["depTime"];
            res["arrivalTime"] = res["flightlegs"][res["flightlegs"].length - 1]["arrTime"];
            res["departHour"] = moment(res["departTime"], "hh:mm:ss  A").format("HH");
            res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss  A").format("HH");

            var allLegsTime = [];
            for (let j = 0; j < res["flightlegs"].length; j++) {
              //   //console.log("j:"+j+"time:"+this.flightarr[i].flightlegs[j].journeyDuration);
              let makeTIme = moment(res["flightlegs"][j].journeyDuration, "hh:mm:ss").format(
                "hh:mm:ss"
              );
              allLegsTime.push(makeTIme);
              // //console.log("all legs array", allLegsTime); 
            }
            this.finalResult = this.totalTimeString(allLegsTime);
            this.finalArrayResult.push(this.totalTimeString(allLegsTime));
            //     //console.log("total:------------", this.finalResult); 
            //}
            //  //console.log("final:------------", this.finalArrayResult); 

            res['finalDuration'] = this.finalResult;

          })


//////////////////////remove flights with negative values
this.flightarr = this.flightarr.filter(function(flighdata){ 
  ////console.log(flighdata)
  return flighdata.flightFare.totalBaseFare + flighdata.flightFare.totalTax + flighdata.flightFare.totalFees + flighdata.flightFare.markupPrice + flighdata.flightFare.serviceChargePrice - flighdata.flightFare.discountPrice > 0
});

         //////////////////////


          this.flightarr.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });

          this.flightarronewayTotal = this.flightarr

        }

        this.getCurrentResultInfo(this.triptyp, this.flightarr);

        //------------------webengage----------------------------------------------    
let webcc;
if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 1) {
  webcc = "Economy";
} else if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 2) { 
  webcc = "Premium Economy";
} else if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 3) {   
  webcc = "Business Class";
} else if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 4) {  
  webcc = "First Class";
}

let webOrginAirportName = JSON.parse(sessionStorage.getItem("OriginDataDetails"));
let webDestinationAirportName = JSON.parse(sessionStorage.getItem("DestinationDataDetails"));
let webOrginAirportName1 = JSON.parse(localStorage.getItem("OriginDataDetails"));
let webDestinationAirportName1 = JSON.parse(localStorage.getItem("DestinationDataDetails"));
////console.log(webOrginAirportName[0]['airportName'])
////console.log(webDestinationAirportName[0]['airportName'])
   webengage.track("SRF", {
    "Type"                  : "oneway",
    "Origin Airport"        : webOrginAirportName && webOrginAirportName[0]['airportName'] ? webOrginAirportName[0]['airportName'] :webOrginAirportName1[0]['airportName'],
    "Origin Name"           : data['reqbody']['flightSearchWidgetList'][0]['origin'],
    "Destination Airport"   : webDestinationAirportName && webDestinationAirportName[0]['airportName'] ? webDestinationAirportName[0]['airportName'] : webDestinationAirportName1[0]['airportName'] ,
    "Destination Name"      : data['reqbody']['flightSearchWidgetList'][0]['destination'],
    "Departing Date"        : data['reqbody']['flightSearchWidgetList'][0]['onwardJourneyDate'] + "T00:00:00.000Z",
    "Depating Flight Class" : webcc,
    "No of Adults"          : data['reqbody']['noOfAdult']  ? data['reqbody']['noOfAdult']  : 1+"Adult",
    "No of Children"        : data['reqbody']['noOfChild']  ? data['reqbody']['noOfChild']  : 0+"Child",
    "No of Infants"         : data['reqbody']['noOfInfant'] ? data['reqbody']['noOfInfant'] : 0+"Infant",
    // "Aliance Airlines"      : " ",
    // "Prefered Airlines"     : " ",
 });    

//----------------------------------------------------------------




      }

      ////////////multicity end

      this.origins = data['response'] && data['response']["onwardFlightOptions"].origin;

      ///////////find trip type////////
      this.onewaytriptype = data['response'] && data['response']["tripType"];
      this.returnwaytriptype = data['response'] && data['response']["tripType"];
      ///////////end code of trip type////////
      this.loading = false;
      this.flightService.sendCardSate(false);

      if (this.roundtriptype == 'roundtrip') {

        // //console.log('i m from returnway');
        // //console.log(data['response']["roundTripFlightOptions"]);
        if (data['response']["roundTripFlightOptions"])
          this.IsTwoData = data['response']["roundTripFlightOptions"].length;
     //   //console.log(data['response']["roundTripFlightOptions"].length);
        this.newOneWayAllData1 = data['response']["roundTripFlightOptions"];

        this.flighttofilterreturn = data['response']["roundTripFlightOptions"];
        // res['onwardFlightOption']["flightlegs"][0].carrier != res['returnFlightOption']["flightlegs"][0].carrier
        this.returnflightarr = this.flighttofilterreturn.filter(
          (v, i, a) =>
            a.findIndex(
              t =>
                t['onwardFlightOption']["flightlegs"][0].carrier ===
                v['onwardFlightOption']["flightlegs"][0].carrier &&
                t['returnFlightOption']["flightlegs"][0].carrier ===
                v['returnFlightOption']["flightlegs"][0].carrier &&
                t.t3Price === v.t3Price
            ) === i
        );
         //console.log('search result of retunway --uniques', this.returnflightarr);



        if (this.returnflightarr.length > 0) {

          this.returnflightarr.map(res => {


            res['finalPrice'] = res['t3Price'] - res['discountPrice'];
            res["departTime"] = res['onwardFlightOption']["flightlegs"][0]["depTime"];
            res["arrivalTime"] = res['returnFlightOption']["flightlegs"][res['returnFlightOption']["flightlegs"].length - 1]["arrTime"];

            res['depDateOnward'] = res['onwardFlightOption']["flightlegs"][0]["depDate"];
            res["arrDateOnward"] = res['onwardFlightOption']["flightlegs"][res['onwardFlightOption']["flightlegs"].length - 1]["arrDate"];

            res['depDateReturn'] = res['returnFlightOption']["flightlegs"][0]["depDate"];
            res["arrDateReturn"] = res['returnFlightOption']["flightlegs"][res['returnFlightOption']["flightlegs"].length - 1]["arrDate"];

            res["onwardflightnoatzero"] = res["onwardFlightOption"]["flightlegs"][0]['flightNumber'];
            res["onwardflightnoatone"] = res["onwardFlightOption"]["flightlegs"][1] && res["onwardFlightOption"]["flightlegs"][1]['flightNumber'];
            res["onwardflightnoattwo"] = res["onwardFlightOption"]["flightlegs"][2] && res["onwardFlightOption"]["flightlegs"][2]['flightNumber'];

            res["returnflightnoatzero"] = res["returnFlightOption"]["flightlegs"][0]['flightNumber'];
            res["returnflightnoatone"] = res["returnFlightOption"]["flightlegs"][1] && res["returnFlightOption"]["flightlegs"][1]['flightNumber'];
            res["returnflightnoattwo"] = res["returnFlightOption"]["flightlegs"][2] && res["returnFlightOption"]["flightlegs"][2]['flightNumber'];

            res['checkLegsOnwardFlight'] = [];
            res['checkLegsReturnFlight'] = [];

            if (res["onwardFlightOption"]["flightlegs"].length) {
              res['checkLegsOnwardFlight'] = [];
              res["onwardFlightOption"]["flightlegs"].forEach(element => {
                res['checkLegsOnwardFlight'].push(element['flightNumber'])
              });
            }
            if (res["returnFlightOption"]["flightlegs"].length) {
              res['checkLegsReturnFlight'] = [];
              res["returnFlightOption"]["flightlegs"].forEach(element => {
                res['checkLegsReturnFlight'].push(element['flightNumber'])
              });
            }




            res["departHour"] = moment(res["departTime"], "hh:mm:ss  A").format("HH");
            res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss  A").format("HH");

            var allLegsTime = [];
            for (let j = 0; j < res['onwardFlightOption']["flightlegs"].length; j++) {
              let makeTIme = moment(res['onwardFlightOption']["flightlegs"][j].journeyDuration, "hh:mm:ss").format(
                "hh:mm:ss"
              );
              allLegsTime.push(makeTIme);
            }
            this.finalResult1 = this.totalTimeString(allLegsTime);
            this.finalArrayResult.push(this.totalTimeString(allLegsTime));
            //   //console.log("total:------------onward", this.finalResult1); 

            res['finalDurationOnward'] = this.finalResult1.split(':').reduce((acc, time) => (60 * acc) + +time);


            var allLegsTime = [];
            for (let j = 0; j < res['returnFlightOption']["flightlegs"].length; j++) {
              let makeTIme = moment(res['returnFlightOption']["flightlegs"][j].journeyDuration, "hh:mm:ss").format(
                "hh:mm:ss"
              );
              allLegsTime.push(makeTIme);
            }
            this.finalResult2 = this.totalTimeString(allLegsTime);
            this.finalArrayResult.push(this.totalTimeString(allLegsTime));
            //  //console.log("total:------------return", this.finalResult2); 

            res['finalDurationReturn'] = this.finalResult2.split(':').reduce((acc, time) => (60 * acc) + +time);

            res['finalDurationOfJourney'] = res['finalDurationOnward'] + res['finalDurationReturn'];
          })


//////////////////////remove flights with negative values
this.returnflightarr = this.returnflightarr.filter(function(flighdata){ 
  ////console.log(flighdata)
  return  flighdata.totalBaseFare + flighdata.totalTax + flighdata.totalFee + flighdata.markupPrice + flighdata.serviceChargePrice - flighdata.discountPrice > 0
});

         //////////////////////
          this.returnflightarr.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });
          this.returnflightarrTotal = this.returnflightarr;
          this.total_result_roundtrip = this.returnflightarr;
        }
        this.getCurrentResultInfo(this.returnwaytriptype, this.returnflightarr);
       // sessionStorage.setItem("WebEngageCodeReturnway",JSON.stringify(data));

      //------------------webengage----------------------------------------------    
      let webcc,webreturnncc;
      if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 1) {
        webcc = "Economy";
      } else if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 2) { 
        webcc = "Premium Economy";
      } else if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 3) {   
        webcc = "Business Class";
      } else if (data['reqbody']['flightSearchWidgetList'][0]['cabinClass'] == 4) {  
        webcc = "First Class";
      }
      if (data['reqbody']['flightSearchWidgetList'][1]['cabinClass'] == 1) {
        webreturnncc = "Economy";
      } else if (data['reqbody']['flightSearchWidgetList'][1]['cabinClass'] == 2) { 
        webreturnncc = "Premium Economy";
      } else if (data['reqbody']['flightSearchWidgetList'][1]['cabinClass'] == 3) {   
        webreturnncc = "Business Class";
      } else if (data['reqbody']['flightSearchWidgetList'][1]['cabinClass'] == 4) {  
        webreturnncc = "First Class";
      }
      let webOrginAirportName = JSON.parse(sessionStorage.getItem("OriginDataDetails"));
      let webDestinationAirportName = JSON.parse(sessionStorage.getItem("DestinationDataDetails"));
      let webOrginAirportName1 = JSON.parse(localStorage.getItem("OriginDataDetails"));
      let webDestinationAirportName1 = JSON.parse(localStorage.getItem("DestinationDataDetails"));
     // //console.log(webOrginAirportName[0]['airportName'])
     // //console.log(webDestinationAirportName[0]['airportName'])
       webengage.track("SRF",  {   
        "Type" 			            : "Round Trip",
        "Origin Airport"        : webOrginAirportName && webOrginAirportName[0]['airportName'] ? webOrginAirportName[0]['airportName'] : webOrginAirportName1[0]['airportName'],
        "Origin Name"           : data['reqbody']['flightSearchWidgetList'][0]['origin'],
        "Destination Airport" 	: webDestinationAirportName && webDestinationAirportName[0]['airportName'] ? webDestinationAirportName[0]['airportName'] : webDestinationAirportName1[0]['airportName'],
        "Destination Name"      : data['reqbody']['flightSearchWidgetList'][0]['destination'],
        "Departing Date"        : data['reqbody']['flightSearchWidgetList'][0]['onwardJourneyDate'] + "T00:00:00.000Z",
        "Arrival Date"          : data['reqbody']['flightSearchWidgetList'][0]['returnJourneyDate'] + "T00:00:00.000Z",
        "Depating Flight Class" : webcc,
        "Arrival Flight Class"  : webreturnncc,
        "No of Adults"          : data['reqbody']['noOfAdult']  ? data['reqbody']['noOfAdult']  : 1+"Adult",
        "No of Children"        : data['reqbody']['noOfChild']  ? data['reqbody']['noOfChild']  : 0+"Child",
        "No of Infants"         : data['reqbody']['noOfInfant'] ? data['reqbody']['noOfInfant'] : 0+"Infant",
        // "Aliance Airlines"      : " ",
        // "Prefered Airlines"     : " ",
  });	      
      //----------------------------------------------------------------
      }
    });
  }

 total_result_roundtrip;
  editflight() {
    this.isBack = true;
    let countryCodedd = localStorage.getItem('countryCode')
    let countryCode = countryCodedd && countryCodedd.toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
    localStorage.removeItem('isrefreshed');

    // this.formdata.unsubscribe();
    localStorage.removeItem('sortedBy');
    localStorage.removeItem('currentindex');
    localStorage.removeItem('checkedList1');
    localStorage.removeItem('currentindex');
    localStorage.removeItem('Filtered_Data');
    localStorage.removeItem('click');
    //
    sessionStorage.removeItem('sortedBy');
    sessionStorage.removeItem('currentindex');
    sessionStorage.removeItem('checkedList1');
    sessionStorage.removeItem('currentindex');
    sessionStorage.removeItem('Filtered_Data');
    sessionStorage.removeItem('click');
    // this.router.navigate(["/search-flights"]);


    this._origindesi.alterback.next(true);
    this._origindesi.appback.next(false);

  

  }

  odddata() {
    this.flightService.getoddata().subscribe(res => {
      //console.log('odd data response',res);
      if (res) {
        //console.log('i m from odd data -if');

        this.finalorigin = res.returnwayOrigin;
        this.finaldest = res.returnwaydestination;

        this.myeconomyonward = res.myeconomyonward;
        this.myeconomyreturn = res.myeconomyreturn;

        this.departDate = res.returnwaydepartDate;
        this.returnDate = res.returnwayreturnDate;

        this.reqdepartdate = this.convertdepart(this.departDate);
        this.reqreturndate = this.convertdepart(this.returnDate);

        //console.log(this.reqdepartdate);
        //console.log(this.reqreturndate);

        let countryCodee = localStorage.getItem('countryCode');
        this.countryCode = countryCodee && countryCodee.toLowerCase();

        this.FlightOnwardCabinClass = sessionStorage.getItem('FlightOnwardCabinClass');
        this.FlightReturnCabinClass = sessionStorage.getItem('FlightReturnCabinClass');

        this.FlightReturnCabinClass =  this.FlightReturnCabinClass && this.FlightReturnCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        this.FlightReturnCabinClass = this.FlightReturnCabinClass && this.FlightReturnCabinClass.charAt(0).toUpperCase() + this.FlightReturnCabinClass.slice(1);
   
         this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
       this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1)
      this.FlightOnwardCarrier = sessionStorage.getItem('FlightOnwardCarrier');
      this.OriginAirportCityName = localStorage.getItem("OriginAirportCityName");
      this.DestinationAirportCityName = localStorage.getItem("DestinationAirportCityName");
      this.OriginAirportCityName =  this.OriginAirportCityName && this.OriginAirportCityName.replace(/\s/g, '-');
      this.DestinationAirportCityName = this.OriginAirportCityName && this.DestinationAirportCityName.replace(/\s/g, '-');

      }else{
        //console.log('no odd response may be from refresh');
   
  }
    });
  }

  dataOnRefresh(){
    //console.log('i m from dataOnRefresh method');
    this.adult = 1;
     this.children = 0;
     this.infants =0;
    this.finalorigin = localStorage.getItem('refreshedOrigin');
    ////console.log('odd else- this.finalorigin',this.finalorigin)
    this.finaldest = localStorage.getItem('refreshedDest');
   // //console.log('odd else-this.finaldest',this.finaldest)

 let countryCodee = localStorage.getItem('countryCode');
 ////console.log('odd else-countryCodee',this.finaldest)

 this.FlightOnwardCarrier = sessionStorage.getItem('FlightOnwardCarrier');
 this.FlightOnwardCabinClass = sessionStorage.getItem('FlightOnwardCabinClass');
  this.FlightOnwardCarrier = sessionStorage.getItem('FlightOnwardCarrier');
  this.reqdepartdate = sessionStorage.getItem('returnwaydepartDate');
  this.departDate = this.reqdepartdate;
 this.FlightOnwardCabinClass = sessionStorage.getItem('FlightOnwardCabinClass');
 this.FlightReturnCabinClass = sessionStorage.getItem('FlightReturnCabinClass');
 
 this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
 this.FlightOnwardCabinClass = this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1);
 this.FlightReturnCabinClass =  this.FlightReturnCabinClass && this.FlightReturnCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
 this.FlightReturnCabinClass = this.FlightReturnCabinClass && this.FlightReturnCabinClass.charAt(0).toUpperCase() + this.FlightReturnCabinClass.slice(1);
 this.countryCode = countryCodee && countryCodee.toLowerCase();

  this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
this.FlightOnwardCabinClass =   this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1)
 


this.OriginAirportCityName = localStorage.getItem("OriginAirportCityName");
this.DestinationAirportCityName = localStorage.getItem("DestinationAirportCityName");
this.OriginAirportCityName =  this.OriginAirportCityName && this.OriginAirportCityName.replace(/\s/g, '-');
this.DestinationAirportCityName = this.DestinationAirportCityName && this.DestinationAirportCityName.replace(/\s/g, '-');

this.returnwayreturnDate = sessionStorage.getItem('returnwayreturnDate');

this.returnDate = this.returnwayreturnDate;

 this.countryId = localStorage.getItem('countryId');
 this.groupId = localStorage.getItem('groupId');
//this.cd.detectChanges();
////console.log('im afrer detect chnges');
  }

  convertdepart(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
    // "onwardJourneyDate":"29-08-2019",
  }
  convertreturn(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
    // "onwardJourneyDate":"29-08-2019",
  }

  //////////////procedd if no more options --- to confirm flight page ---for oneway

  proceed() {
   this.presentLoading();
  
    var fareitem = {
      countryId: this.countryId,
      curruencyCode: "AED",
      flightOptionKey: this.flightOptionKey,
      flightSearchKey: this.key,
      flightSearchWidgetList: [
        {
          cabinClass: this.ccData,
          destination: this.finaldest,
          onwardJourneyDate: this.reqdepartdate,
          origin: this.finalorigin,
          returnJourneyDate: "DEL"
        }
      ],
      groupId: this.groupId,
      noOfAdult: this.adult ? this.adult : 1,
      noOfChild: this.children ? this.children : 0,
      noOfInfant: this.infants ? this.infants : 0,
      tripType: "oneway"
    };
    //console.log("request body of oneway with no similar", fareitem);
    this.flightService.fareConfirmapi(fareitem).subscribe(res => {
      // //console.log("request body return flight", res);
      if (res) {
        this.closeLoading();
        this.globalService.sendFareConfirmRequestToComponent(fareitem)
        

        this.flightService.selectedFlight(res);
        this.flightService.selectedFlightmulti("");
        this.router.navigate(["/confirm-flight"]);
      }
    }, (err)=>{
      this.closeLoading();
    });
  }

  proceedreturnway(flighdata) {
    //console.log('i m from proceedreturnway() method')
    //console.log('final origin ',this.finalorigin);
    //console.log('final dest ',this.finaldest);
    //console.log('dep date ', this.departDate);
    //console.log('retun date ',this.returnDate);

    this.FlightOnwardCabinClass = flighdata.onwardFlightOption.flightFare.cabinClass;
    this.FlightReturnCabinClass = flighdata.returnFlightOption.flightFare.cabinClass;
    this.FlightOnwardCarrier  = flighdata.onwardFlightOption.platingCarrier;

       this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
   
       this.FlightOnwardCabinClass = this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1);
    this.FlightReturnCabinClass =  this.FlightReturnCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
   this.FlightReturnCabinClass = this.FlightReturnCabinClass.charAt(0).toUpperCase() + this.FlightReturnCabinClass.slice(1);
let finalcabinclass = this.ccData ? this.ccData : this.umretunwayOnwrd;
   this.presentLoading();
   this.flightOptionKeyreturn = sessionStorage.getItem('flightOptionKey');

    this.adult = this.adult ? this.adult : 1; 
    this.children = this.children ? this.children : 0;
    this.infants = this.infants ? this.infants : 0;
 let finladult = this.whichadult ? this.whichadult : this.adult;
let finalchild = this.whichchild ? this.whichchild : this.children;
let finlinfant = this.whichinfant ? this.whichinfant : this.infants;

let branchCurrencyCode = localStorage.getItem('branchCurrencyCode');

    var fareitems = {
      "countryId": this.countryId,
      "curruencyCode": branchCurrencyCode,
      "flightOptionKey": this.flightOptionKeyreturn,
      "flightSearchKey": this.key,
      "flightSearchWidgetList": [
        {
          "cabinClass": finalcabinclass ,
          "destination": this.finaldest,
          "onwardJourneyDate": this.departDate,
          "origin": this.finalorigin,
          "returnJourneyDate":this.returnDate 
        }
      ],
      "groupId": this.groupId,
      "noOfAdult": finladult,
      "noOfChild": finalchild,
      "noOfInfant": finlinfant,
      "tripType": "roundtrip"
    }
   // //console.log('adult,child,infnt',finladult,finalchild,finlinfant);

   // //console.log('retunway req body no similar', fareitems)
    // var mydeparting = this.flightForm.get('returnwaydepartDate').value;
    // var myreturning = this.flightForm.get('returnwayreturnDate').value;
    this.flightService.fareConfirmapi(fareitems).subscribe(res => {
      // //console.log(res)
      if (res) {
        if(res['roundTripFlightOption'] == null){
          this.flightService.selectedFlight(null);
        }else{
          this.flightService.selectedFlight(res);
          this.flightService.selectedFlightmulti('');
        }
        this.globalService.sendFareConfirmRequestToComponent(fareitems)
        this.closeLoading();

        
        //console.log('adult,child,infnt',finladult,finalchild,finlinfant);

        this.FlightOnwardCabinClass == 'FirstClass' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;
       this.FlightOnwardCabinClass == 'Premiumeconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;
       this.FlightOnwardCabinClass == 'PremiumEconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;

       this.FlightReturnCabinClass == 'FirstClass' ? this.FlightReturnCabinClass = 'First' : this.FlightReturnCabinClass;
       this.FlightReturnCabinClass == 'Premiumeconomy' ? this.FlightReturnCabinClass = 'Premium' : this.FlightReturnCabinClass;
       this.FlightReturnCabinClass == 'PremiumEconomy' ? this.FlightReturnCabinClass = 'Premium' : this.FlightReturnCabinClass;

       //this.router.navigate(['/confirm-flight']);
        let adultinfo = finladult ? finladult : 1
        let returnwaydepartDate =  moment(this.departDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        let returnwayreturnDate = moment(this.returnDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        let maskUrlforAdult = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/Return'
        let maskUrlforAdultChild = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.children+'Child'+'/'+this.FlightOnwardCarrier+'/Return'
        let maskUrlforAdultInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Return'
      
        let maskUrlforAdultChildInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Return'

        //console.log('adult,child,infnt',finladult,finalchild,finlinfant);

 if(this.adult >= 1 && this.children == 0 && this.infants ==0){
   this.router.navigate([maskUrlforAdult]);
 
 //console.log('adult,child,infant',this.adult,this.children,this.infants)
 }
 if(this.adult >= 1 && this.children >= 1 && this.infants ==0){
   this.router.navigate([maskUrlforAdultChild]);
 
   //console.log('adult,child,infant',this.adult,this.children,this.infants)
 
 }if(this.adult >= 1 && this.children >= 1 && this.infants >=1){
  //console.log('adult,child,infant',this.adult,this.children,this.infants)

   this.router.navigate([maskUrlforAdultChildInfant]);
 
 
 }if(this.adult >= 1 && this.children == 0 && this.infants >=1){
  this.router.navigate([maskUrlforAdultInfant]);
  
 // //console.log('adult,child,infant',this.adult,this.children,this.infants)
  
  }
 

      }
      // if (res==this.selectedflight) {
      //   this.flightService.selectedFlight(res);
      //   let snackBarRef1 = this.snackBar.open('select departureFlight', '', {
      //     duration: 1000,
      //   });
      //   this.router.navigate(['/confirm-flight'])
      // }
    }, (err)=>{
      this.closeLoading();
    });

  }

  //get selected widget 

  getwidget() {
    this.flightService.getflightwidget().subscribe((res) => {
      // //console.log(res)
      this.flightwidget = res;
      // //console.log(this.flightwidget);
   
    })

  }
  Finalurl = [];
  ///proceed to confirm flight --on card select of multiflight not to similar
  proceedmulti() {
   this.presentLoading();
   this.Finalurl = [];
   let countryCodee = localStorage.getItem('countryCode');
   this.countryCode = countryCodee.toLowerCase();
    ///serch key  & flightoptionkey find on page load  --searchCacheKey from response
    this.key = sessionStorage.getItem('searchKey');
    let flightOptionKey = sessionStorage.getItem('flightOptionKey')
  
    var fareconfirm = {
      "countryId": this.countryId,
      "curruencyCode": "AED",
      "flightOptionKey": flightOptionKey,
      "flightSearchKey": this.key,
      "flightSearchWidgetList": this.flightwidget,
      "groupId": this.groupId,
      "noOfAdult": this.adult ? this.adult : 1,
      "noOfChild": this.children ? this.children : 0,
      "noOfInfant": this.infants ? this.infants : 0,
      "tripType": "multicity"
    }
    ////console.log('Data For URl', fareconfirm);
   // //console.log('flightwidget', this.flightwidget);
    this.flightService.fareConfirmapi(fareconfirm).subscribe(resnew => {
    ////console.log('fare confirm in multicity', resnew);
      if (resnew) {
        this.closeLoading();
        if(resnew['onwardFlightOption'] == null){
          this.flightService.selectedFlightmulti(null);
        }else{
          this.flightService.selectedFlightmulti(resnew);
        }
       // this.router.navigate(['/confirm-flight'])
       ////console.log(this.selectedflight.imgname)
       this.globalService.sendFareConfirmRequestToComponent(fareconfirm)
       for(let i=0;i< this.flightwidget.length;i++)
       {
          let cons;
          if (this.flightwidget[i].cabinClass == 1 ) {         
            cons =  "Economy";
          } else if(this.flightwidget[i].cabinClass == 2) {           
            cons =  "Premium";
          } else if (this.flightwidget[i].cabinClass == 3) {          
            cons =  "Business";
          } else if (this.flightwidget[i].cabinClass == 4) {             
            cons = "First";
          } 
          this.Finalurl.push(this.flightwidget[i]['origin']+'-'+this.flightwidget[i]['destination']+'/'+ moment(this.flightwidget[i]['onwardJourneyDate'], "DD-MM-YYYY").format("YYYY-MM-DD")+'/'+cons+'/');

          //  this.Finalurl.push(this.flightwidget[i]['origin']+'-'+this.flightwidget[i]['destination']+'/'+ this.flightwidget[i]['onwardJourneyDate']+'/'+cons+'/');
           //this.Finalurl.join(""); 
          // moment(this.flightwidget[i]['onwardJourneyDate'], "DD-MM-YYYY").format("YYYY-MM-DD")
           ///moment(this.flightwidget[i]['onwardJourneyDate'], "DD-MM-YYYY").format("YYYY-MM-DD"),
           }
           //console.log(this.Finalurl);
           //console.log(this.Finalurl.join(''))
           let adultinfomulti = this.adult ? this.adult : 1
          
           let maskUrlforAdultmulti =  this.countryCode+'/'+this.language+'/'+'flight-review/'+this.Finalurl.join('')+adultinfomulti+'Adult'+'/'+this.selectedflight.imgname+'/'+'Multi'
           let maskUrlforAdultChildmulti = this.countryCode+'/'+this.language+'/'+'flight-review/'+this.Finalurl.join('')+adultinfomulti+'Adult'+'/'+this.children+'Child'+'/'+this.selectedflight.imgname+'/'+'Multi'
           let maskUrlforAdultChildInfantmulti =  this.countryCode+'/'+this.language+'/'+'flight-review/'+this.Finalurl.join('')+adultinfomulti+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.selectedflight.imgname+'/'+'Multi'
           let maskUrlforAdultInfantmult =  this.countryCode+'/'+this.language+'/'+'flight-review/'+this.Finalurl.join('')+adultinfomulti+'Adult'+'/'+this.infants+'Infant'+'/'+this.selectedflight.imgname+'/'+'Multi'
           ////console.log('adult,child,infnt',this.adult,this.children,this.infants);
   
    if(this.adult >= 1 && this.children == 0 && this.infants ==0){
      //console.log("URL"+maskUrlforAdultmulti)
      this.router.navigate([maskUrlforAdultmulti]);    
      //console.log('adult,child,infant',this.adult,this.children,this.infants)
    }
    else if(this.adult >= 1 && this.children >= 1 && this.infants ==0){
      //console.log("URL"+maskUrlforAdultChildmulti)
      this.router.navigate([maskUrlforAdultChildmulti]);    
      //console.log('adult,child,infant',this.adult,this.children,this.infants)    
    }
    else if(this.adult >= 1 && this.children >= 1 && this.infants >=1){
      //console.log("URL"+maskUrlforAdultChildInfantmulti)
      this.router.navigate([maskUrlforAdultChildInfantmulti]);    
      //console.log('adult,child,infant',this.adult,this.children,this.infants)   
    }
    else if(this.adult >= 1 && this.children == 0 && this.infants >=1){
      //console.log("URL"+maskUrlforAdultInfantmult)
      this.router.navigate([maskUrlforAdultInfantmult]);     
      //console.log('adult,child,infant',this.adult,this.children,this.infants)      
    }     
    else{
     this.router.navigate([maskUrlforAdultmulti]);
   //  this.router.navigate( [this.countryCode+'/'+this.language+'/'+'flight-review/'+'confirmflight/'+this.Finalurl+'multi']);
    }
     // this.router.navigate( [this.countryCode+'/'+this.language+'/cheap-flights/confirmflight/multi']);        
 }

    }, (err)=>{
      this.closeLoading();
    });
  }

  pageNumber = 1;
  startIndex = 0;
  endIndex = 4;
  pageSize;
  pageCurrent = 1;

  getOnewayResult = [];
  multiCityResult = [];

  doInfinite(event) {
    this.flightService.getflights(this.currentRequestBody).subscribe(
      (res) => {
        if(res){
          // //console.log(res);
          this.onScrollRequest(res);
           event.target.complete();

          //  setTimeout(() => {
          //   event.target.disabled = true;
          //  }, 5000);
        }
      
      }
    )
  }

  scrollFirst = true;
  onScrollRequest(data) {
    if (data['tripType'] == "oneway") {
      this.scrollFirst = false;
      this.newOneWayAllData = data["onwardFlightOptions"];
      this.flighttofilter = data["onwardFlightOptions"];
      this.searchCacheKey = data["searchCacheKey"];
      localStorage.setItem("searchKey", this.searchCacheKey);
      sessionStorage.setItem("searchKey", this.searchCacheKey);

      this.flightarr = this.flighttofilter.filter(
        (v, i, a) =>
          a.findIndex(
            t =>
              t.platingCarrier === v.platingCarrier &&
              t.flightFare.t3Price === v.flightFare.t3Price
          ) === i
      );
      // //console.log(this.flightarr);

      if (this.flightarr.length > 0) {
        this.flightarr.map(res => {
          res["finalPrice"] = res["flightFare"]["t3Price"];
          res["departTime"] = res["flightlegs"][0]["depTime"];
          res["arrivalTime"] =
            res["flightlegs"][res["flightlegs"].length - 1]["arrTime"];
          res["departHour"] = moment(res["departTime"], "hh:mm:ss  A").format(
            "HH"
          );
          res["arivalHour"] = moment(
            res["arrivalTime"],
            "hh:mm:ss  A"
          ).format("HH");

          var allLegsTime = [];
          for (let j = 0; j < res["flightlegs"].length; j++) {
            let makeTIme = moment(
              res["flightlegs"][j].journeyDuration,
              "hh:mm:ss"
            ).format("hh:mm:ss");
            allLegsTime.push(makeTIme);
          }
          this.finalResult = this.totalTimeString(allLegsTime);
          this.finalArrayResult.push(this.totalTimeString(allLegsTime));

          res["finalDuration"] = this.finalResult;
        });

        // //console.log("after adding params", this.flightarr);

        this.flightarr.sort(function (a, b) {
          return a["finalPrice"] - b["finalPrice"];
        });
      }
    }
    if (data['tripType'] == 'roundtrip') {
      this.scrollFirst = false;
      this.newOneWayAllData1 = data["roundTripFlightOptions"];

      this.flighttofilterreturn = data["roundTripFlightOptions"];


      this.returnflightarr = this.flighttofilterreturn.filter(
        (v, i, a) =>
          a.findIndex(
            t =>
            t['onwardFlightOption']["flightlegs"][0].carrier ===
            v['onwardFlightOption']["flightlegs"][0].carrier &&
            t['returnFlightOption']["flightlegs"][0].carrier ===
            v['returnFlightOption']["flightlegs"][0].carrier &&
            t.t3Price === v.t3Price
          ) === i
      );
      // //console.log('search result of retunway --uniques', this.returnflightarr);



      if (this.returnflightarr.length > 0) {

        let x = 'roundtrip|BOM|2020-05-19|AI|144|S|2020-05-19|DEL|DEL|2020-05-26|AI|805|S|2020-05-26|BOM'

        let filterflight  = this.flighttofilterreturn.filter((res)=>{
          return res.flightOptionKey == x
        })
        
        // //console.log('this we want',filterflight);

        this.returnflightarr.map(res => {
          res['checkLegsOnwardFlight']= [];
          res['checkLegsReturnFlight']= [];
          res['finalPrice'] = res['t3Price'] - res['discountPrice'];
          res["departTime"] = res['onwardFlightOption']["flightlegs"][0]["depTime"];
          res["arrivalTime"] = res['returnFlightOption']["flightlegs"][res['returnFlightOption']["flightlegs"].length - 1]["arrTime"];
          res["departHour"] = moment(res["departTime"], "hh:mm:ss  A").format("HH");
          res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss  A").format("HH");

          res['depDateOnward'] = res['onwardFlightOption']["flightlegs"][0]["depDate"];
          res["arrDateOnward"] = res['onwardFlightOption']["flightlegs"][res['onwardFlightOption']["flightlegs"].length - 1]["arrDate"];

          res['depDateReturn'] = res['returnFlightOption']["flightlegs"][0]["depDate"];
          res["arrDateReturn"] = res['returnFlightOption']["flightlegs"][res['returnFlightOption']["flightlegs"].length - 1]["arrDate"];
          res["onwardflightnoatzero"] = res["onwardFlightOption"]["flightlegs"][0]['flightNumber'];
          res["onwardflightnoatone"] = res["onwardFlightOption"]["flightlegs"][1] && res["onwardFlightOption"]["flightlegs"][1]['flightNumber'];
          res["onwardflightnoattwo"] = res["onwardFlightOption"]["flightlegs"][2] && res["onwardFlightOption"]["flightlegs"][2]['flightNumber'];
          res["returnflightnoatzero"] = res["returnFlightOption"]["flightlegs"][0]['flightNumber'];
          res["returnflightnoatone"] = res["returnFlightOption"]["flightlegs"][1] && res["returnFlightOption"]["flightlegs"][1]['flightNumber'];
          res["returnflightnoattwo"] = res["returnFlightOption"]["flightlegs"][2] && res["returnFlightOption"]["flightlegs"][2]['flightNumber'];

          

          if(res["onwardFlightOption"]["flightlegs"].length){
            res['checkLegsOnwardFlight']= [];
            res["onwardFlightOption"]["flightlegs"].forEach(element => {
              res['checkLegsOnwardFlight'].push(element['flightNumber'])
            });
          }
          if(res["returnFlightOption"]["flightlegs"].length){
            res['checkLegsReturnFlight'] = [];
            res["returnFlightOption"]["flightlegs"].forEach(element => {
              res['checkLegsReturnFlight'].push(element['flightNumber'])
            });
          }

          var allLegsTime = [];
          for (let j = 0; j < res['onwardFlightOption']["flightlegs"].length; j++) {
            let makeTIme = moment(res['onwardFlightOption']["flightlegs"][j].journeyDuration, "hh:mm:ss").format(
              "hh:mm:ss"
            );
            allLegsTime.push(makeTIme);
          }
          this.finalResult1 = this.totalTimeString(allLegsTime);
          this.finalArrayResult.push(this.totalTimeString(allLegsTime));
          res['finalDurationOnward'] = this.finalResult1.split(':').reduce((acc, time) => (60 * acc) + +time);

          var allLegsTime = [];
          for (let j = 0; j < res['returnFlightOption']["flightlegs"].length; j++) {
            let makeTIme = moment(res['returnFlightOption']["flightlegs"][j].journeyDuration, "hh:mm:ss").format(
              "hh:mm:ss"
            );
            allLegsTime.push(makeTIme);
          }
          this.finalResult2 = this.totalTimeString(allLegsTime);
          this.finalArrayResult.push(this.totalTimeString(allLegsTime));

          res['finalDurationReturn'] = this.finalResult2.split(':').reduce((acc, time) => (60 * acc) + +time);
          res['finalDurationOfJourney'] = res['finalDurationOnward'] + res['finalDurationReturn'];
        })
  

        this.returnflightarr.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });

      //  //console.log('after adding params in retunway', this.returnflightarr);

      }
    }
    if (data["tripType"] == "multicity") {
      this.scrollFirst = false;
      localStorage.setItem("searchKey", data['searchCacheKey']);
      sessionStorage.setItem("searchKey", data['searchCacheKey']);

      this.removeduplicateinmulti = data["onwardFlightOptions"];
      this.totalMultiflights = data["onwardFlightOptions"];
      this.newmultiAllData = data["onwardFlightOptions"];

      if (this.totalMultiflights) {
        this.totalMultiflights.map(res => {
          res["finalPrice"] =
            res["flightFare"]["t3Price"] - res["flightFare"]["discountPrice"];
          res["departTime"] =
            res["optionSegmentBean"][0]["flightlegs"][0]["depTime"];
          res["arrivalTime"] =
            res["optionSegmentBean"][res["optionSegmentBean"].length - 1][
            "flightlegs"
            ][["flightlegs"].length - 1]["arrTime"];
          res["departHour"] = moment(res["departTime"], "hh:mm:ss A").format(
            "HH"
          );
          res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss A").format(
            "HH"
          );

          //////////////code ////////////total duration
          var allLegsTime = [];
          ////console.log("Array is:------------",res['optionSegmentBean']);
          for (let i = 0; i < res["optionSegmentBean"].length; i++) {
            for (
              let j = 0;
              j < res["optionSegmentBean"][i].flightlegs.length;
              j++
            ) {
              let makeTIme = moment(
                res["optionSegmentBean"][i].flightlegs[j].journeyDuration,
                "hh:mm:ss"
              ).format("hh:mm:ss");
              allLegsTime.push(makeTIme);
            }

            this.finalResult = this.totalTimeString(allLegsTime);
            ////console.log("total:------------", this.finalResult);
            if (i + 1 == res["optionSegmentBean"].length) {
              this.finalArrayResult.push(this.finalResult);

              this.multitotals = this.finalResult;
            }
          }

          res["finalDurationOfJourney"] = this.multitotals;
        });



        
        // //console.log(
        //   "after adding params in multicty",
        //   this.totalMultiflights
        // );
      }
      ///////////////////////////end duplicate multicity//////////

      // //console.log(this.flighttofilterreturn);

      ////get searchCacheKey key oneway//
      this.searchCacheKey = data["searchCacheKey"];
      localStorage.setItem("searchKey", this.searchCacheKey);
      sessionStorage.setItem("searchKey", this.searchCacheKey);

      /////end cache key
    }

  }

  multicityScroll = true;
  multiCityScroll(event){
    setTimeout(() => {
      event.target.complete();
      this.pageCurrent = this.pageCurrent+1;
      let getInfor = this.scrollPaginationService.getPager(this.totalMultiflights.length, this.pageCurrent, this.perPageRender);
      // //console.log(getInfor)
      this.multiCityResult.push(...this.totalMultiflights.slice(getInfor.startIndex, getInfor.endIndex + 1))
      // //console.log(this.multiCityResult)
      
      if((getInfor.totalItems -1) == getInfor.endIndex){
        this.multicityScroll = false;
      }
    }, 50);
  }
  
  roundTripScrollShow = true;
  roundTripScroll(event){
    setTimeout(() => {
      event.target.complete();
      this.pageCurrent = this.pageCurrent+1;
      let getInfor = this.scrollPaginationService.getPager(this.returnflightarr.length, this.pageCurrent, this.perPageRender);
      // //console.log(getInfor)
      this.roundTripResult.push(...this.returnflightarr.slice(getInfor.startIndex, getInfor.endIndex + 1))
      //console.log(this.roundTripResult)
      
      if((getInfor.totalItems -1) == getInfor.endIndex){
        this.roundTripScrollShow = false;
      }
    }, 50);
  }

  oneWayTripScrollShow = true;
  oneWayTripScroll(event){
    setTimeout(() => {
      event.target.complete();
      this.pageCurrent = this.pageCurrent+1;
      let getInfor = this.scrollPaginationService.getPager(this.flightarr.length, this.pageCurrent, this.perPageRender);
      // //console.log(getInfor)
      this.oneWayResult.push(...this.flightarr.slice(getInfor.startIndex, getInfor.endIndex + 1))
      // //console.log(this.oneWayResult)
      
      if((getInfor.totalItems -1) == getInfor.endIndex){
        this.oneWayTripScrollShow = false;
      }
    }, 50);
  }

  roundTripResult = [];
  oneWayResult = [];

  getCurrentResultInfo(tripType, totalResult ){
    if(tripType == 'multicity'){
      if(totalResult.length >50){
        this.multicityScroll = true;
        this.multiCityResult = [];
        this.pageSize = Math.ceil(totalResult.length/12);
        // //console.log('page size',this.pageSize);
        this.pageCurrent = 1;
        let getInfor = this.scrollPaginationService.getPager(totalResult.length, this.pageCurrent, this.perPageRender);
        // //console.log(getInfor);
        this.multiCityResult.push(...totalResult.slice(getInfor.startIndex, getInfor.endIndex + 1));
        // //console.log(this.multiCityResult);
      }else{
        this.multiCityResult = [];
        this.multicityScroll = false;
        this.multiCityResult.push(...totalResult);
        // //console.log(this.multiCityResult);
      }
    }
    else if( (tripType == 'roundtrip' || tripType == 'returnway')){
      if(totalResult.length >40){
        this.roundTripScrollShow = true;
        this.roundTripResult = [];
        this.pageCurrent = 1;
        let getInfor = this.scrollPaginationService.getPager(totalResult.length, this.pageCurrent, this.perPageRender);
        // //console.log(getInfor);
        this.roundTripResult.push(...totalResult.slice(getInfor.startIndex, getInfor.endIndex + 1));
        // //console.log(this.roundTripResult);
      }else{
        this.roundTripResult = [];
        this.roundTripScrollShow = false;
        this.roundTripResult.push(...totalResult);
        // //console.log(this.roundTripResult);
      }
    }
    else if(tripType == 'oneway'){
      if(totalResult.length >40){
        this.oneWayTripScrollShow = true;
        this.oneWayResult = [];
        this.pageCurrent = 1;
        let getInfor = this.scrollPaginationService.getPager(totalResult.length, this.pageCurrent, this.perPageRender);
        // //console.log(getInfor);
        this.oneWayResult.push(...totalResult.slice(getInfor.startIndex, getInfor.endIndex + 1));
        // //console.log(this.oneWayResult);
      }else{
        this.oneWayResult = [];
        this.oneWayTripScrollShow = false;
        this.oneWayResult.push(...totalResult);
        // //console.log(this.oneWayResult);
      }
    }
    
  }

  ok() {
    // this.router.navigate(["/search-flights"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
  }

  openfilteroneway(){
    this.openFilter();
    setTimeout(() => {
      this.shownoFilter = false;
    }, 2000);

  }
  shownoFilter = true;
  openreturnwayfilter(){
    this.openFilter1();
    setTimeout(() => {
      this.shownoFilter = false;
    }, 2000);
  }
  clearFilter_result(tripType){
    this.scrollToElementById('#card_grid');
    if(tripType == 'roundtrip'){
      this.getCurrentResultInfo(tripType, this.total_result_roundtrip);
      this.returnflightarr = this.total_result_roundtrip ;
    }
  }
  clearRuleData(){
    this.flightService.clearfullfareRule();
  }
  openFiltermultiIfNoData(){
    this.openFiltermulti();
    setTimeout(() => {
      this.shownoFilter = false;
    }, 2000);
  }

  
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  getDashboard(){

   // let countryCodeInUrl =  this.activatedroute.snapshot.paramMap.get('countryCode');
    let currentUrl = this.router.url.substr(1);
   let countryCodeInUrl_split =   currentUrl.split('/')
   let countryCodeInUrl =  countryCodeInUrl_split[0];
   //
   let countryCodeInUrl_uppercase =  countryCodeInUrl.toUpperCase();

    this.globalService.getDashboard().subscribe(res => {
      // //console.log('new dashbaord api',res);
      let CountryinUrl = res['countryList'].filter(res => {
        return res.countryCode == countryCodeInUrl_uppercase;
       /// return res.defaultCountry == true;

      });
      // //console.log(trueCountry)
      // //console.log('country id',trueCountry[0]['countryId']);
      // //console.log('group id',trueCountry[0]['branchResponse']['groupId'])
this.refreshedCountryid = CountryinUrl[0]['countryId'];

////get dashboard by this country id
this.globalService.getDashboardByid(this.refreshedCountryid).subscribe(res=>{
//console.log('dashboard by id',res);
let totalList = res["countryList"];

////
let trueCountry_Final  = totalList.filter(res => {
  return res.defaultCountry == true;

});

//console.log('trueCountry>>>>on page >> refresh',trueCountry_Final && trueCountry_Final[0]);

this.refreshedgroupId = trueCountry_Final[0]['branchResponse']['groupId'];
this.refreshedcountryCode = trueCountry_Final[0]['countryCode'];
///////////////page refrehed method
localStorage.setItem('groupId',this.refreshedgroupId);
localStorage.setItem("countryId",this.refreshedCountryid );
localStorage.setItem("countryCode",this.refreshedcountryCode );
localStorage.setItem('branchCode',trueCountry_Final[0]['branchResponse']['branchCode']);
localStorage.setItem('branchCurrencyCode',trueCountry_Final[0]['branchResponse']['branchCurrencyCode']);
localStorage.setItem('branchId',trueCountry_Final[0]['branchResponse']['branchId']);
///
sessionStorage.setItem('groupId',this.refreshedgroupId);
sessionStorage.setItem("countryId",this.refreshedCountryid );
sessionStorage.setItem("countryCode",this.refreshedcountryCode );
sessionStorage.setItem('branchCode',trueCountry_Final[0]['branchResponse']['branchCode']);
sessionStorage.setItem('branchCurrencyCode',trueCountry_Final[0]['branchResponse']['branchCurrencyCode']);
sessionStorage.setItem('branchId',trueCountry_Final[0]['branchResponse']['branchId']);
///

})

///////


 
this.tripTypeParam = this.activatedroute.snapshot.paramMap.get('tripType');
//console.log('tripTypeParam>>>',this.tripTypeParam);
if(this.tripTypeParam == 'Return'){
  this.onRefreshReturnway();
}else if(this.tripTypeParam == 'Oneway'){
  this.onRefreshOneway();
}else{
  // //console.log('multicity');
}


/////////////////

    });
  }
  onRefreshReturnway(){
    localStorage.setItem('tripType','returnway');
    localStorage.setItem('TripType','Returnway');
//
sessionStorage.setItem('tripType','returnway');
sessionStorage.setItem('TripType','Returnway');
/////unmask 1 adult start

let UMOonwrdate = localStorage.getItem('UMOonwrdate');
let UMOreturndate = localStorage.getItem('UMOreturndate');

 let UMOcabinclass = localStorage.getItem('UMOcabinclass');
 let UMOcabinclassreturn = localStorage.getItem('UMOcabinclassreturn');

 let UMOpaxinfo =  localStorage.getItem('UMOpaxinfo');
 
 let UMOpaxinfochildd = localStorage.getItem('UMOpaxinfochild');
 
let UMOInfant = localStorage.getItem('UMOpaxinfoinfant');


 if (UMOcabinclass === "Economy") {
         
  this.umretunwayOnwrd = 1;
} else if (UMOcabinclass === "Premium" || UMOcabinclass === "PREMIUM") {
   
  this.umretunwayOnwrd = 2;
} else if (UMOcabinclass === "Business" || UMOcabinclass === "BUSINESS") {
   
  this.umretunwayOnwrd = 3;
} else if (UMOcabinclass === "FirstClass") {
   
  this.umretunwayOnwrd = 4;
} else {
}
var obj=[UMOcabinclass,this.umretunwayOnwrd];
 localStorage.setItem("EconomyData" ,JSON.stringify(obj));
 sessionStorage.setItem("EconomyData" ,JSON.stringify(obj));

 let whichcabin_retunway_onwrd = this.umretunwayOnwrd ? this.umretunwayOnwrd : 1;

 if (UMOcabinclassreturn === "Economy") {
         
  this.umretunwayReturn = 1;
} else if (UMOcabinclassreturn === "Premium" || UMOcabinclassreturn === "PREMIUM") {
   
  this.umretunwayReturn = 2;
} else if (UMOcabinclassreturn === "Business" || UMOcabinclassreturn === "BUSINESS") {
   
  this.umretunwayReturn = 3;
} else if (UMOcabinclassreturn === "FirstClass") {
   
  this.umretunwayReturn = 4;
} else {
}
let whichcabin_retunway_return = this.umretunwayReturn ? this.umretunwayReturn : 1;
this.whichadult = UMOpaxinfo ? UMOpaxinfo : 1;
this.whichchild = UMOpaxinfochildd ? UMOpaxinfochildd : 0;
this.whichinfant = UMOInfant ? UMOInfant : 0;

///unmask 1adult end


    let branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
let new_date_onward_15 = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("DD-MM-YYYY");

let new_date_return_22 = moment(new Date(), "DD-MM-YYYY").add(22,'days').format("DD-MM-YYYY");
////console.log('new_date+22',new_date_return_22);
///////////whic date
let whichdate_retunway_onwrd = UMOonwrdate ? UMOonwrdate : new_date_onward_15;
let whichdate_retunway_return = UMOreturndate ? UMOreturndate : new_date_return_22;

////which date end

this.globalService.sendReturnDataDate(whichdate_retunway_return);

////
localStorage.setItem('returnwaydepartDate',whichdate_retunway_onwrd);
sessionStorage.setItem('returnwaydepartDate',whichdate_retunway_onwrd);

localStorage.setItem('returnwayreturnDate',whichdate_retunway_return);
sessionStorage.setItem('returnwayreturnDate',whichdate_retunway_return);

////get paramter from url -

this.tripTypeParam = this.activatedroute.snapshot.paramMap.get('tripType');

const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
////console.log(snapshot);  // <-- hope it helps
////console.log(snapshot.url);  // <-- hope it helps
////console.log(snapshot.url.valueOf());  // <-- hope it helps

this.activatedroute.paramMap.subscribe(params => {
 
  let fullcity = params.get("originCity-:destinationCity");
  let fullcitySplit = fullcity.split('-')
 
this.originNew = fullcitySplit[0]
this.destinationNew = fullcitySplit[1]

localStorage.setItem('refreshedOrigin',this.originNew);
localStorage.setItem('refreshedDest',this.destinationNew);
//
sessionStorage.setItem('refreshedOrigin',this.originNew);
sessionStorage.setItem('refreshedDest',this.destinationNew);

let fullcityName = params.get("OriginAirportCityName-:to-:DestinationAirportCityName");

//console.log('full city name',fullcityName);
//console.log('full city name split',fullcityName.split('to'))
let fcn = fullcityName.split('to');
let DestinationAirportCityName = fcn[1];
let OriginAirportCityName = fcn[0];

//console.log('OriginAirportCityName on refreshed',OriginAirportCityName.substring(0,OriginAirportCityName.length-1));


//console.log('DestinationAirportCityName on refreshed',DestinationAirportCityName.slice(1))

// this.OriginAirportCityName = localStorage.getItem("OriginAirportCityName");
 localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName.slice(1));
 localStorage.setItem("OriginAirportCityName",OriginAirportCityName.substring(0,OriginAirportCityName.length-1));
//
sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName.slice(1));
sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName.substring(0,OriginAirportCityName.length-1));
})
///et paramter from url end
let field = {
  adult:  this.whichadult,
  children:this.whichchild,
  infants: this.whichinfant,
  // type: this.data.type
};

this.dataOnRefresh();

this.sendTravllerDataService.sendtravllers(field);
this.gettravllerfromservice();
    var reqbody = {
      currencyCode: branchCurrencyCode,
      flightSearchWidgetList: [
        {
          origin: this.originNew,
          destination: this.destinationNew,
          cabinClass:  whichcabin_retunway_onwrd,
          onwardJourneyDate: whichdate_retunway_onwrd,
          returnJourneyDate: whichdate_retunway_return
        },
        {
          origin: this.destinationNew,
          destination: this.originNew,
          cabinClass: whichcabin_retunway_return,
          onwardJourneyDate: whichdate_retunway_return,
          returnJourneyDate: ""
        }
      ],

      noOfAdult:this.whichadult,
      noOfChild:this.whichchild,
      noOfInfant:this.whichinfant,

      tripType: "roundtrip",
      groupId: this.getCountryGroupId ? this.getCountryGroupId : this.refreshedgroupId,
      countryId: this.getCountryId ? this.getCountryId : this.refreshedCountryid
    };

    if (whichcabin_retunway_onwrd == 1) {
      this.myccFinal = 'Economy';
    } else if (whichcabin_retunway_onwrd == 2) {
      this.myccFinal = 'Premium Economy';
    } else if (whichcabin_retunway_onwrd == 3) {
      this.myccFinal = 'Business Class';
    } else if (whichcabin_retunway_onwrd == 4) {
      this.myccFinal = "First Class";
    } else {
      whichcabin_retunway_onwrd = 1;
      this.myccFinal = 'Economy';

    }
    var objjjj = [this.myccFinal,whichcabin_retunway_onwrd];
    //console.log('returnway refreshed>> set cabin',objjjj);

    localStorage.setItem("EconomyData", JSON.stringify(objjjj));
    sessionStorage.setItem("EconomyData", JSON.stringify(objjjj));
    
    if (whichcabin_retunway_return == 1) {
      this.myccFinal3 = 'Economy';
    } else if (whichcabin_retunway_return == 2) {
      this.myccFinal3 = 'Premium Economy';
    } else if (whichcabin_retunway_return == 3) {
      this.myccFinal3 = 'Business Class';
    } else if (whichcabin_retunway_return == 4) {
      this.myccFinal3 = "First Class";
    } else {
      whichcabin_retunway_return = 1;
      this.myccFinal3 = 'Economy';

    }

    var objc = [this.myccFinal3,whichcabin_retunway_return];
   // //console.log('returnway refreshed>> set cabin',objc);

    localStorage.setItem("ReturnCC", JSON.stringify(objc));
    sessionStorage.setItem("ReturnCC", JSON.stringify(objc));


   this.refreshSub =  this.flightService.getflights(reqbody)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        ////console.log('returnway response on refresh',res);
       
        
          if(!this.isBack){
//console.log('data should send')

this.newResponseReturnway = res;
this.flighttofilterreturn = res["roundTripFlightOptions"];

let sendDataToSerachComponent = {
 'response':res,
 'reqbody':reqbody
};
this.flightService.sendonewaydata(sendDataToSerachComponent);
          }else{
            res = null;
            //console.log('data should not send')
          }
       
  
    
     
    });
  }
  onRefreshOneway(){
    // //console.log('refreshed oneway')
    //console.log('um-onwrdate>>>',this.UMOonwrdate);
    localStorage.setItem('tripType','oneway');
    localStorage.setItem('TripType','Oneway');

    sessionStorage.setItem('tripType','oneway');
    sessionStorage.setItem('TripType','Oneway');

    let UMOInfant = localStorage.getItem('UMOpaxinfoinfant');
   let UMOonwrdate = localStorage.getItem('UMOonwrdate');
    let UMOcabinclass = localStorage.getItem('UMOcabinclass');
    let UMOpaxinfo =  localStorage.getItem('UMOpaxinfo');
    let UMOpaxinfochildd = localStorage.getItem('UMOpaxinfochild');

    //console.log('UMOonwrdate',UMOonwrdate)
    //console.log('UMOpaxinfo',UMOpaxinfo)

    if (UMOcabinclass === "Economy") {
         
      this.selctedcabinclass = 1;
    } else if (UMOcabinclass === "Premium" || UMOcabinclass === "PREMIUM") {
       
      this.selctedcabinclass = 2;
    } else if (UMOcabinclass === "Business" || UMOcabinclass === "BUSINESS") {
       
      this.selctedcabinclass = 3;
    } else if (UMOcabinclass === "FirstClass") {
       
      this.selctedcabinclass = 4;
    } else {
    }
    //console.log('UMOcabinclass',this.selctedcabinclass);
    var obj=[UMOcabinclass,this.selctedcabinclass];
    localStorage.setItem("EconomyData" ,JSON.stringify(obj));
    sessionStorage.setItem("EconomyData" ,JSON.stringify(obj));

    let branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
    let new_date_onward_15 = moment(new Date(), "DD-MM-YYYY").add(15,'days').format("DD-MM-YYYY");
    this.activatedroute.paramMap.subscribe(params => {
      let countryCode = params.get("countryCode");
      let fullcity = params.get("originCity-:destinationCity");
      let fullcitySplit = fullcity.split('-')
     
    this.originNew = fullcitySplit[0];
    this.destinationNew = fullcitySplit[1];
    // //console.log('from url origin',this.originNew);
    // //console.log('from url dest',this.destinationNew);
    localStorage.setItem('refreshedOrigin',this.originNew);
    localStorage.setItem('refreshedDest',this.destinationNew);
   //
   sessionStorage.setItem('refreshedOrigin',this.originNew);
   sessionStorage.setItem('refreshedDest',this.destinationNew);

    let fullcityName = params.get("OriginAirportCityName-:to-:DestinationAirportCityName");

//console.log('full city name',fullcityName);
//console.log('full city name split',fullcityName.split('to'));
let fcn = fullcityName.split('to');
let DestinationAirportCityName = fcn[1];
let OriginAirportCityName = fcn[0];

// //console.log('OriginAirportCityName on refreshed',OriginAirportCityName.substring(0,OriginAirportCityName.length-1));


// //console.log('DestinationAirportCityName on refreshed',DestinationAirportCityName.slice(1))

// this.OriginAirportCityName = localStorage.getItem("OriginAirportCityName");
 localStorage.setItem("DestinationAirportCityName",DestinationAirportCityName.slice(1));
 localStorage.setItem("OriginAirportCityName",OriginAirportCityName.substring(0,OriginAirportCityName.length-1));
///
sessionStorage.setItem("DestinationAirportCityName",DestinationAirportCityName.slice(1));
sessionStorage.setItem("OriginAirportCityName",OriginAirportCityName.substring(0,OriginAirportCityName.length-1));
  });

  this.dataOnRefresh();
    ///et paramter from url end
    this.whichadult = UMOpaxinfo ? UMOpaxinfo : 1;
    this.whichchild = UMOpaxinfochildd ? UMOpaxinfochildd : 0;
    this.whichinfant = UMOInfant ? UMOInfant : 0;
let field = {
  adult:  this.whichadult,
  children:this.whichchild,
  infants:this.whichinfant
  // type: this.data.type
};
this.sendTravllerDataService.sendtravllers(field);
this.gettravllerfromservice();

let whichdate = UMOonwrdate ? UMOonwrdate : new_date_onward_15;
localStorage.setItem('returnwaydepartDate',whichdate);
sessionStorage.setItem('returnwaydepartDate',whichdate);

    var reqbody = {
      currencyCode: branchCurrencyCode,
      flightSearchWidgetList: [
        {
          origin: this.originNew,
          destination: this.destinationNew,
          cabinClass:  this.selctedcabinclass ? this.selctedcabinclass : 1,
          onwardJourneyDate:whichdate
        }
      ],
      noOfAdult:  +this.whichadult,
      noOfChild:  +this.whichchild,
      noOfInfant:  +this.whichinfant,
      tripType: "oneway",
      groupId: this.getCountryGroupId ? this.getCountryGroupId : this.refreshedgroupId,
      countryId: this.getCountryId ? this.getCountryId : this.refreshedCountryid
    }

    if (this.selctedcabinclass == 1) {
      this.myccFinal = 'Economy';
    } else if (this.selctedcabinclass == 2) {
      this.myccFinal = 'Premium Economy';
    } else if (this.selctedcabinclass == 3) {
      this.myccFinal = 'Business Class';
    } else if (this.selctedcabinclass == 4) {
      this.myccFinal = "First Class";
    } else {
      this.selctedcabinclass = 1;
      this.myccFinal = 'Economy';

    }
    var objj = [this.myccFinal, this.selctedcabinclass];
    ////console.log('oneway refreshed>> set cabin',objj);

    localStorage.setItem("EconomyData", JSON.stringify(objj));
    sessionStorage.setItem("EconomyData", JSON.stringify(objj));


    //console.log('req body of unmask n refresh oneway',reqbody);
   this.refreshedData = this.flightService.getflights(reqbody).subscribe(res => {
      // //console.log(res);
      let sendDataToSerachComponent = {
        'response': res,
        'reqbody': reqbody
      };
      
      ///sending API data to search result component
      this.flightService.sendonewaydata(sendDataToSerachComponent);
      this.globalService.sendReturnDataDate(whichdate);
    });

   
     }

    //// ngOnDestroy() {
     //  this.refreshedData.unsubscribe();
    // //console.log('search page destroyed');
      // this.formdata.unsubscribe();
     //// this.travSub.unsubscribe();
    ////}

    ngOnDestroy() {
      // This aborts all HTTP requests.
      //this.ngUnsubscribe.next();
      // This completes the subject properlly.
    //  this.ngUnsubscribe.complete();
  this.travSub.unsubscribe();
      // this.refreshSub.unsubscribe();
      // this.flightService.sendonewaydata('');

      // //console.log('page destoryed')
      
  }
}
