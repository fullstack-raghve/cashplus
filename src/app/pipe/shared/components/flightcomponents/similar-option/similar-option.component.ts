import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatBottomSheet } from '@angular/material';
import { FareDetailsComponent } from '../fare-details/fare-details.component';
import { FlightService } from 'src/app/services/flight.service';
import { LoadingController } from '@ionic/angular';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";
import { RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { OverlayService } from 'src/app/services/overlay.service';
import { GlobalService } from 'src/app/services/global.service';
//import {FareDetailsComponent} from
import  *  as  airportList  from  '../../../../../../assets/airportList.json';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-similar-option',
  templateUrl: './similar-option.component.html',
  styleUrls: ['./similar-option.component.scss'],
})
export class SimilarOptionComponent implements OnInit, OnDestroy {
  loading = true;
  language = 'en'
  subscribe1: Subscription;
  subscribe2: Subscription
  returwaydata: any;
  onewayflightarry = [];
  multiflightarry = [];
  selectedflight = [];
  selectedflight2: any;
  flightOptionKey: any;
  key: string;
  selectedRow: Number;
  setClickedRow: Function;
  returnflightarry = [];
  returnflightObj: any
  displayoneway = false;
  displayreturnway = false;
  flightOptionKeyreturn: any;
  keyreturn: string;
  seladult: string;
  selchildren: string;
  selinfants: string;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;
  snackBar: any;
  returnflight2: any;
  reqdepartdate: string;
  reqreturndate: string;
  fulldatefromcalender: any;
  departDate: any;
  returnDate: any;
  finalorigin: any;
  finaldest: any;
  myeconomyonward: any;
  myeconomyreturn: any;
  flightforfiltermulti: any;
  displaymulti: boolean = false;
  subscribe3: Subscription;
  currentPrice: any;

  travSub: Subscription;
  groupId = Number(localStorage.getItem('groupId'));
  countryId = Number(localStorage.getItem('countryId'));
  flightwidget: any;
  onewayflightlength: any;
  clickeddepartflight: boolean = false;
  message = 'Please select depart flight first!'
  returnflightoptkey: any;
  flightOptionKeysimilar: any;
  currentflightOptionKey: any;
  selectedflightx: any;
  returnwaydepartDate: string;
  returnwayreturnDate: string;
  displayfareoneway: number;
  triptype: string;
  clickedleftflightno: any;
  clickedrightflightno: any;
  clikedrightflightoptionkey: any;
  returnflightarrynew: any[];
  newkeyright: any;
  returnflightarreyrightunique: any[];
  clickedleftflightnoatone: any;
  rightflightnoatzero: any;
  countryCode: string;
  FlightOnwardCabinClass: string;
  FlightReturnCabinClass: string;
  FlightOnwardCarrier: string;
  previoueurl: any;
  searchPageURL: string;
  displayfareonewayCurrency: any;
  returnwaycurreny: any;
  returnwayprice: number;
  isrefreshed: any;

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
  UMOpaxinfoInfant: string;
  UMOpaxinfoinfant: string;
  todayDateis = moment().format("YYYY-MM-DD");

  ccData:any;
  valforreturncc:any;
  countryInUrl: string;
  constructor(private router: Router,
    private activatedrouter: ActivatedRoute,
    private spinner: NgxSpinnerService, private _snackBar: MatSnackBar,
    public loadingController: LoadingController,
    private sendTravllerDataService: SendTravllerDataService,
    private bottomSheet: MatBottomSheet,
    private location: Location,
    private flightService: FlightService, private cookieService: CookieService,  private overlayService: OverlayService,
    private globalService:GlobalService) {


  }

  ngOnInit() {
    this.getunmaskurl();
    localStorage.removeItem('surchargeAmount');
    localStorage.removeItem('cpo');
    localStorage.removeItem('cpm');
    localStorage.removeItem('cpr');
    this.triptype = sessionStorage.getItem('tripType');

    this.searchPageURL = sessionStorage.getItem('searchPageURL');
    this.odddata();
    this.returnwaydepartDate = sessionStorage.getItem('returnwaydepartDate');
    this.returnwayreturnDate = sessionStorage.getItem('returnwayreturnDate');
    //console.log(this.returnwaydepartDate)
    this.returnwayreturnDate = sessionStorage.getItem('returnwayreturnDate')
    this.getsimilarflight();
    this.getsimilarflightreturn();
    this.getsimilarflightmulti();
    this.getsingleflight();
    this.getselectedtravllersfromlocal();
    this.gettravllerfromservice();
    this.getsimilarflightmulti();

    ///serch key find on page load  --searchCacheKey from response
    this.key = sessionStorage.getItem('searchKey');

    ///flightoption key on page load
    //flightoptionkey
    this.getwidget();
    let similarPageURL = this.router.url.substr(1);
    localStorage.setItem('similarPageURL',similarPageURL);
    sessionStorage.setItem('similarPageURL',similarPageURL);

    let countryInUrl = similarPageURL.split('/');
    this.countryInUrl = countryInUrl[0];

    let EconomyData = sessionStorage.getItem("EconomyData");
    let DataEconomyData;
    if (EconomyData) {
      DataEconomyData = JSON.parse(EconomyData);
      this.ccData = DataEconomyData[1];
    }
     else this.ccData =1;

    //for return cc
    let returnccData = sessionStorage.getItem("ReturnCC");

    if(returnccData) {
     let returnccValue = JSON.parse(returnccData);
      this.valforreturncc = returnccValue[1];
    } 
    else 
      this.valforreturncc = 1;
    //console.log("Local storage Economy:-" + "onwards:"+this.ccData+"return:"+this.valforreturncc);
  }

  getunmaskurl(){

    let searchpageurl = this.router.url.substr(1);

    if(searchpageurl.includes('flight-search')){
      this.unmaskUrlOneway();

     }else{


     }
  }


  unmaskUrlOneway(){

this.calculateDataOneway();



  }
  airportItem = airportList;
  UMOpaxinfochildd;
  calculateDataOneway(){
    localStorage.removeItem('UMOpaxinfoinfant');
    localStorage.removeItem('UMOpaxinfo');
  localStorage.removeItem('UMOpaxinfochild');

    let searchpageurl = this.router.url.substr(1);

/////if condition for adult and child cb2
if(searchpageurl.includes('Adult') && searchpageurl.includes('Child') && !searchpageurl.includes('Infant')){
  this.activatedrouter.paramMap.subscribe(params => {
    //console.log(params)
    this.UMOcountryCode = params.get("countryCode");
    this.UMOlanguage = params.get("language");
    this.UMOonwrdate = params.get("OriginAirportCityName-:to-:DestinationAirportCityName");

    ///chk date status
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
///

    this.UMOfullcity = params.get("search");
    this.UMOcabinclass = params.get("originCity-:destinationCity");

  let UMOpaxinfo =  params.get("tripTypess");
  this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

  +this.UMOpaxinfo>9 ? this.UMOpaxinfo = '1' : this.UMOpaxinfo;


  let UMOpaxinfochild =  params.get("combination");
  this.UMOpaxinfochildd = UMOpaxinfochild.replace(/[^0-9]/g,'');



    localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    localStorage.setItem('myeconomyonward',this.UMOcabinclass)
    localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    localStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);
    //
    sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    sessionStorage.setItem('myeconomyonward',this.UMOcabinclass)
    sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    sessionStorage.setItem('UMOpaxinfochild',this.UMOpaxinfochildd);
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
 
  this.onewayResultUM();


});///parms end
}

/////if condition for adult and infant cb3
if(searchpageurl.includes('Adult') && !searchpageurl.includes('Child') && searchpageurl.includes('Infant')){
  this.activatedrouter.paramMap.subscribe(params => {
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

    this.UMOfullcity = params.get("search");
    this.UMOcabinclass = params.get("originCity-:destinationCity");

  let UMOpaxinfo =  params.get("tripTypess");
  this.UMOpaxinfo = UMOpaxinfo.replace(/[^0-9]/g,'');

  let UMOpaxinfoInfant =  params.get("combination");
  this.UMOpaxinfoinfant = UMOpaxinfoInfant.replace(/[^0-9]/g,'');

    //console.log('um-countryCode>>>', this.UMOcountryCode);
    //console.log('um-language>>', this.UMOlanguage);
    //console.log('um-fullcity>>', this.UMOfullcity);
    //console.log('um-onwrdate>>>',this.UMOonwrdate);
    //console.log('um-cabinclass>>>',this.UMOcabinclass);
    //console.log('um-paxinfo>>>',this.UMOpaxinfo);
    //console.log('um-UMOpaxinfoInfant>>>',this.UMOpaxinfoinfant);

    localStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
    localStorage.setItem('UMOcabinclass',this.UMOcabinclass);
    localStorage.setItem('myeconomyonward',this.UMOcabinclass)
    localStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
    localStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);
   // var num = txt.replace(/[^0-9]/g,'');
   sessionStorage.setItem('UMOonwrdate',moment(this.UMOonwrdate, "YYYY-MM-DD").format("DD-MM-YYYY"));
   sessionStorage.setItem('UMOcabinclass',this.UMOcabinclass);
   sessionStorage.setItem('myeconomyonward',this.UMOcabinclass)
   sessionStorage.setItem('UMOpaxinfo',this.UMOpaxinfo);
   sessionStorage.setItem('UMOpaxinfoinfant',this.UMOpaxinfoinfant);
   //
       let fullcitySplit = this.UMOfullcity.split('-')
   
  this.UMOoriginNew = fullcitySplit[0];
  this.UMOdestinationNew = fullcitySplit[1];
   
  localStorage.setItem('refreshedOrigin',this.UMOoriginNew);
  localStorage.setItem('refreshedDest',this.UMOdestinationNew);
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

  let yoneway=  '/'+this.UMOcountryCode+'/'+this.UMOlanguage+'/'+'cheap-flights/'+'search/'+OriginAirportCityName+'-to-'+DestinationAirportCityName+'/'+this.UMOoriginNew+'-'+this.UMOdestinationNew+'/Oneway'
//console.log('unmask to mask url',yoneway);
let Beforedomainpart =  window.location.origin;
let fullurl =  Beforedomainpart+yoneway;
  location.replace(fullurl);
 
  this.onewayResultUM();


});///parms end
}

  }

  onewayResultUM(){
 
   // this.getDashboard()

  }


  ionViewWillEnter() {
    localStorage.removeItem('surchargeAmount');
    localStorage.removeItem('cpo');
    localStorage.removeItem('cpm');
    localStorage.removeItem('cpr');
  }

  gettravllerfromservice() {
    this.travSub = this.sendTravllerDataService.gettravller().subscribe(res => {
      //console.log(res)
      if (res) {
        var info = res['trvllerfield'];
        this.adultdefault = res.adult;
        this.adult = info.adult;
        this.children = info.children
        this.infants = info.infants
      }


    })

  }
 

  backTo() {

    this.router.navigate([this.searchPageURL]);

  }
  setButtonClose = false;
  closePopup() {
    this.bottomSheet.dismiss();
    this.setButtonClose = false;
  }
  fareDetails() {
    this.setButtonClose = true;
    this.bottomSheet.open(FareDetailsComponent, {
      "panelClass": "fare-class",
      "backdropClass": 'fare-backdrop'
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      //console.log(res)
      this.setButtonClose = false;
    });

  }

  getsimilarflight() {
    this.subscribe1 = this.flightService.getsimilarflight().subscribe(res => {
//console.log(res)
      this.onewayflightlength = res;
      // this.onewayflightarry.sort(function (a, b) {
      //   return Date.parse('01/01/2013 ' + a['departTime']) - Date.parse('01/01/2013 ' + b['departTime']);
      // });
      //console.log(this.onewayflightlength.length);

      if (this.onewayflightlength.length < 2) {
        //console.log('nooo simialr option for this flight', this.onewayflightarry.length)
        // this.proceedauto()
      } else {
        //console.log('simialr option for this flight', this.onewayflightarry.length)

        this.onewayflightarry = res;
        this.displayoneway = true;

        // this.onewayflightarry.sort(function (a, b) {
        //   return Date.parse('01/01/2013 ' + a['departTime']) - Date.parse('01/01/2013 ' + b['departTime']);
        // });
      }
    })

  }

  //////////////// add time of onward and return
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

  //////// add time onward -return end


  moreOptionResponse;
  getsimilarflightreturn() {
    this.subscribe2 = this.flightService.getsimilarflightreturnway().subscribe(response => {
      //console.log('return ways similar flight data', response)
      if (response) {
        this.moreOptionResponse = response;
        this.returnflightarry = response;
        this.returnflight2 = response;
        this.displayreturnway = true;
        //console.log(response);
        //console.log(this.displayreturnway);

        this.returnflightarry.map(res => {
          res["departTimeOnward"] = res["onwardFlightOption"]["flightlegs"][0]["depTime"];
          res["departTimeReturn"] = res["returnFlightOption"]["flightlegs"][0]["depTime"];
         
          res['depDateOnward'] = res['onwardFlightOption']["flightlegs"][0]["depDate"];
          res["arrDateOnward"] = res['onwardFlightOption']["flightlegs"][res['onwardFlightOption']["flightlegs"].length - 1]["arrDate"];

          res['depDateReturn'] = res['returnFlightOption']["flightlegs"][0]["depDate"];
          res["arrDateReturn"] = res['returnFlightOption']["flightlegs"][res['returnFlightOption']["flightlegs"].length - 1]["arrDate"];
         
          res['checkLegsOnwardFlight'] = [];
          res['checkLegsReturnFlight'] = [];
          res["onwardflightnoatzero"] = res["onwardFlightOption"]["flightlegs"][0]['flightNumber'];
          res["onwardflightnoatone"] = res["onwardFlightOption"]["flightlegs"][1] && res["onwardFlightOption"]["flightlegs"][1]['flightNumber'];
          res["onwardflightnoattwo"] = res["onwardFlightOption"]["flightlegs"][2] && res["onwardFlightOption"]["flightlegs"][2]['flightNumber'];
          res["returnflightnoatzero"] = res["returnFlightOption"]["flightlegs"][0]['flightNumber'];
          res["returnflightnoatone"] = res["returnFlightOption"]["flightlegs"][1] && res["returnFlightOption"]["flightlegs"][1]['flightNumber'];
          res["returnflightnoattwo"] = res["returnFlightOption"]["flightlegs"][2] && res["returnFlightOption"]["flightlegs"][2]['flightNumber'];

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






        });

        ////console.log("after adding params", this.returnflightarry); 




        let uniqueReturn = this.returnflightarry.filter(
          (v, i, a) =>
            a.findIndex(
              t =>
                (t.returnFlightOption.flightlegs[0].flightNumber === v.returnFlightOption.flightlegs[0].flightNumber)
                && ((t.returnFlightOption.flightlegs[1] && t.returnFlightOption.flightlegs[1].flightNumber) === (v.returnFlightOption.flightlegs[1]
                  && v.returnFlightOption.flightlegs[1].flightNumber))
                && ((t.returnFlightOption.flightlegs[2] && t.returnFlightOption.flightlegs[2].flightNumber) === (v.returnFlightOption.flightlegs[2]
                  && v.returnFlightOption.flightlegs[2].flightNumber))
            ) === i
        );
     //   //console.log('after uniques return -right', uniqueReturn);

        for (var ob in uniqueReturn) {
          uniqueReturn[ob]['canSelected'] = false
        }

        let sendFinalDatasss = this.returnflightarry.filter(
          (v, i, a) =>
            a.findIndex(
              t =>
                (t.returnFlightOption.flightlegs[0].flightNumber === v.returnFlightOption.flightlegs[0].flightNumber)
                && ((t.returnFlightOption.flightlegs[1]
                  && t.returnFlightOption.flightlegs[1].flightNumber) === (v.returnFlightOption.flightlegs[1]
                    && v.returnFlightOption.flightlegs[1].flightNumber))
            ) !== i
        );
      //  //console.log('non-uniques return -right side', sendFinalDatasss);


        if (uniqueReturn.length > 0) {

          this.returnflightarreyrightunique = uniqueReturn;

          this.returnflightarreyrightunique.sort(function (a, b) {
          //  //console.log(a['departTimeReturn'] +"ssss"+b['departTimeReturn'])
            return Date.parse('01/01/2013 ' + a['departTimeReturn']) - Date.parse('01/01/2013 ' + b['departTimeReturn']);
          });
          this.returnflightarreyrightunique.sort((a, b) => {
            return <any>new Date(a['arrDateReturn']) - <any>new Date(b['arrDateReturn']);
            });

        } else {
          this.returnflightarreyrightunique = response
          this.returnflightarreyrightunique.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['departTimeReturn']) - Date.parse('01/01/2013 ' + b['departTimeReturn']);
          });
          this.returnflightarreyrightunique.sort((a, b) => {
            return <any>new Date(a['arrDateReturn']) - <any>new Date(b['arrDateReturn']);
            });
       
        }


        let sendFinalData = this.returnflightarry.filter(
          (v, i, a) =>
            a.findIndex(
              t =>
                (t.onwardFlightOption.flightlegs[0].flightNumber === v.onwardFlightOption.flightlegs[0].flightNumber)
                && ((t.onwardFlightOption.flightlegs[1]
                  && t.onwardFlightOption.flightlegs[1].flightNumber) === (v.onwardFlightOption.flightlegs[1]
                    && v.onwardFlightOption.flightlegs[1].flightNumber)) && ((t.onwardFlightOption.flightlegs[2]
                      && t.onwardFlightOption.flightlegs[2].flightNumber) === (v.onwardFlightOption.flightlegs[2]
                        && v.onwardFlightOption.flightlegs[2].flightNumber))
            ) === i
        );
       // //console.log('after uniques onward', sendFinalData);


        let sendFinalData1 = this.returnflightarry.filter(
          (v, i, a) =>
            a.findIndex(
              t =>
                (t.onwardFlightOption.flightlegs[0].flightNumber === v.onwardFlightOption.flightlegs[0].flightNumber)
                && ((t.onwardFlightOption.flightlegs[1] && t.onwardFlightOption.flightlegs[1].flightNumber) === (v.onwardFlightOption.flightlegs[1] && v.onwardFlightOption.flightlegs[1].flightNumber))
            ) !== i
        );
    //    //console.log('not uniques onward', sendFinalData1);
        if (sendFinalData.length > 0) {
          // //console.log('length is', sendFinalData.length)
          this.returnflightarrynew = sendFinalData
          this.returnflightarrynew.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['departTimeOnward']) - Date.parse('01/01/2013 ' + b['departTimeOnward']);
          });
         ////try using date
         this.returnflightarrynew.sort((a, b) => {
          return <any>new Date(a['arrDateOnward']) - <any>new Date(b['arrDateOnward']);
          });
////console.log('i m after date sorting',this.returnflightarrynew)
         ///
        } else {
          this.returnflightarrynew = response
          this.returnflightarrynew.sort(function (a, b) {
            return Date.parse('01/01/2013 ' + a['departTimeOnward']) - Date.parse('01/01/2013 ' + b['departTimeOnward']);
          });
          this.returnflightarrynew.sort((a, b) => {
            return <any>new Date(a['arrDateOnward']) - <any>new Date(b['arrDateOnward']);
            });

           this.returnflightarrynew.sort((a, b) => {
            return <any>new Date(a['arrDateOnward']) - <any>new Date(b['arrDateOnward']);
          });
        }

      }
    })

  
  }

  getsimilarflightmulti() {
    this.subscribe3 = this.flightService.getsimilarflightmulti().subscribe(response => {
      //console.log(response);

      if (response) {
        this.flightforfiltermulti = response
        this.displaymulti = true;
        this.multiflightarry = response
      }
    })

  }


  
  /////method to get selected flight from search result to similar flight page
  selectedflightOneWay;
  getReponse = false;
  getsingleflight() {
    this.flightService.getselectedFlight().subscribe((res) => {
      //console.log(res)
      if(res){
this.getReponse = true;
        this.selectedflight = res;
        this.selectedflight2 = res;
        //console.log('seleted flight on similar page',res)
        this.leftSideDepartingOnwardFlightNumbers = res['checkLegsOnwardFlight']
        //console.log(this.leftSideDepartingOnwardFlightNumbers )
        this.currentPrice = res['currentPrice'];
        let moreOpt = this.moreOptionResponse;
        let flight = this.selectedflight2;
        //console.log(moreOpt);
        var selectedReturn = [];
        if (moreOpt != undefined) {
          for (var k in moreOpt) {
            if (flight.onwardFlightOption && flight.onwardFlightOption.flightlegs.length == moreOpt[k].onwardFlightOption.flightlegs.length) {
              var matchflightlegs = false;
              for (var l in flight.onwardFlightOption.flightlegs) {
                if (moreOpt[k].onwardFlightOption.flightlegs[l].flightNumber == flight.onwardFlightOption.flightlegs[l].flightNumber && moreOpt[k].onwardFlightOption.flightlegs[l].carrier == flight.onwardFlightOption.flightlegs[l].carrier) {
                  matchflightlegs = true;
                }
                else {
                  matchflightlegs = false;
                  break;
                }
              }
              if (matchflightlegs) {
                selectedReturn.push(moreOpt[k].returnFlightOption);
              }
            }
          }
        }
        if(selectedReturn.length != 0){
        for (var ob in this.returnflightarreyrightunique) {
          this.returnflightarreyrightunique[ob]['canSelected'] = false
        }
    
        for (var o in this.returnflightarreyrightunique) {
          for (var r in selectedReturn) {
            var oflag = false;
            if (selectedReturn[r].flightlegs.length == this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs.length) {
              for (var j in this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs) {
                if (selectedReturn[r].flightlegs[j].flightNumber == this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs[j].flightNumber && selectedReturn[r].flightlegs[j].carrier == this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs[j].carrier) {
                  oflag = true;
                } else {
                  oflag = false;
                  break;
                }
              }
              if (oflag) {
                this.returnflightarreyrightunique[o]['canSelected'] = true;
              }
            }
          }
        }
        }
        
        // this.leftFlag = true;
  
        //flight key
        this.flightOptionKey = res.flightOptionKey
        /////////search key
        this.key = sessionStorage.getItem('searchKey');
  
        if (this.triptype == "oneway") {
          // this.displayfareoneway = this.selectedflight2.flightFare.totalBaseFare + this.selectedflight2.flightFare.totalTax + this.selectedflight2.flightFare.totalFees + this.selectedflight2.flightFare.markupPrice + this.selectedflight2.flightFare.serviceChargePrice - this.selectedflight2.flightFare.discountPrice
          // //console.log(this.displayfareoneway);
          // this.displayfareonewayCurrency = this.selectedflight2.flightFare.currency;

          if(res){
            this.setOnewfare(res)
          }else{}
        }
        if (this.triptype == "returnway") {
          this.setReturnWayfare(res);
          // this.returnwaycurreny = this.selectedflight2.onwardFlightOption.flightFare.currency;
          // this.returnwayprice =  this.selectedflight2.totalBaseFare + this.selectedflight2.totalTax + this.selectedflight2.totalFee + this.selectedflight2.markupPrice + this.selectedflight2.serviceChargePrice - this.selectedflight2.discountPrice;
        }
  
      }else{
        let countryCode = localStorage.getItem('countryCode').toLowerCase();
        //console.log(countryCode)
        let setLanguageSetting = 'en';
        //this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
        this.getReponse = false;
        //console.log('page refresh', res);
      }
    })

  }

  setOnewfare(res) {
    //console.log(res)
    //console.log('onew way fare')
    this.flightService.sendflightdetails(res);
    this.displayfareonewayCurrency = res.flightFare && res.flightFare.currency;
    this.displayfareoneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
    //console.log(this.displayfareoneway)
  }
  setReturnWayfare(res) {
//console.log(res)
    this.flightService.sendflightdetails(res);
    this.returnwaycurreny = res.onwardFlightOption.flightFare.currency;
    this.returnwayprice = res['totalBaseFare'] + res['totalTax'] + res['totalFee'] + res['markupPrice'] + res['serviceChargePrice'] - res['discountPrice'];
    //console.log(this.returnwayprice);
    //console.log(this.returnwaycurreny)
  }

  // setmultiCityFare(multiCity) {
  //   //console.log('multicity fare')

  //   this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
  //   this.multiCityCurrency = multiCity.flightFare.currency
  //   this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
  //   //console.log(this.multiflightFare)
  // }
  //////////////////similar option on click card get value
  currentclick: boolean = false
  status: any;
  flagCheck: boolean = false;
  valueReturn: any;
  oneWayIndex;
  oneWayAlreadySelected = true;
  similarOption(flight, i) {

    this.oneWayIndex = i

    this.currentclick = !this.currentclick;
    //console.log(this.currentclick);
    if(flight != this.selectedflight ){
      this.oneWayAlreadySelected = false;
    }
    if (i == this.status) {
      if (this.flagCheck == true) {
        //console.log(this.flagCheck);
        this.flagCheck = false;
      }
      else {
        this.flagCheck = true;
        //console.log(this.flagCheck);
      }
    }
    else {
      this.flagCheck = true;
    }
    this.status = i;
    // //console.log(this.status);
    //console.log(flight);
    ////select card 
    ///flight key
    this.flightOptionKeysimilar = flight.flightOptionKey
    /////////search key
    this.key = sessionStorage.getItem('searchKey')
    ///send selected flights to similar/confirm-flight component 
    //this.flightService.selectedFlight(flight);
    //console.log(this.key);
    //this.router.navigate(['/confirm-flight'])
  };
  //////////////////similar option on click card get value end


  //////////////////similar option on click card get value end
  value: any;
  val: boolean = true;
  sameIndex: any;
  flagreturn: boolean = false;
  returnIndex: any;
  newflag: boolean = false;
  leftFlag: any = false;
  rightIndex: any;
  getArrayOfOnward;
alreadySelected = true;

leftSideDepartingOnwardFlightNumbers;
rightSideReturnFlightNumbers;
  similarOptionreturn(flight, index) {
    
    // New Similar Option Logic 
    let moreOpt = this.moreOptionResponse;
    //console.log(moreOpt);
    if(flight.onwardFlightOption != this.selectedflight['onwardFlightOption'] ){
      this.alreadySelected = false;
      this.alreadySelectedReturn = false;
      this.leftSideDepartingOnwardFlightNumbers = '';
      this.rightSideReturnFlightNumbers = '';
    }
    var selectedReturn = [];
    if (moreOpt.length > 0) {
      for (var k in moreOpt) {
        if (flight.onwardFlightOption.flightlegs.length == moreOpt[k].onwardFlightOption.flightlegs.length) {
          var matchflightlegs = false;
          for (var l in flight.onwardFlightOption.flightlegs) {
            if (moreOpt[k].onwardFlightOption.flightlegs[l].flightNumber == flight.onwardFlightOption.flightlegs[l].flightNumber && moreOpt[k].onwardFlightOption.flightlegs[l].carrier == flight.onwardFlightOption.flightlegs[l].carrier) {
              matchflightlegs = true;
            }
            else {
              matchflightlegs = false;
              break;
            }
          }
          if (matchflightlegs) {
            selectedReturn.push(moreOpt[k].returnFlightOption);
          }
        }
      }
    }
    if(selectedReturn.length != 0){
    for (var ob in this.returnflightarreyrightunique) {
      this.returnflightarreyrightunique[ob]['canSelected'] = false
    }

    for (var o in this.returnflightarreyrightunique) {
      for (var r in selectedReturn) {
        var oflag = false;
        if (selectedReturn[r].flightlegs.length == this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs.length) {
          for (var j in this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs) {
            if (selectedReturn[r].flightlegs[j].flightNumber == this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs[j].flightNumber && selectedReturn[r].flightlegs[j].carrier == this.returnflightarreyrightunique[o]['returnFlightOption'].flightlegs[j].carrier) {
              oflag = true;
            } else {
              oflag = false;
              break;
            }
          }
          if (oflag) {
            this.returnflightarreyrightunique[o]['canSelected'] = true;
          }
        }
      }
    }
    }
   /// //console.log(selectedReturn);
   // //console.log(this.returnflightarreyrightunique);
   // New Similar Option Logic 

    // this.newflag = true;
    this.flagreturn = true;
    this.getArrayOfOnward = flight['checkLegsOnwardFlight'];
    this.clickedleftflightno = flight.onwardFlightOption.flightlegs[0].flightNumber;
    this.clickedleftflightnoatone = flight.onwardFlightOption.flightlegs[1] && flight.onwardFlightOption.flightlegs[1].flightNumber;
    this.rightflightnoatzero = flight.returnFlightOption.flightlegs[1] && flight.returnFlightOption.flightlegs[1].flightNumber;

    let ufa = flight.onwardFlightOption.flightlegs[0].flightNumber

    this.leftFlag = true;
    this.rightIndex = null;

    var cvv = this.returnflightarry.filter(function (flight) {
      return (
        flight.onwardflightno == ufa
      );
    });
    // //console.log('cvv', cvv);

    //smilar optn logi cned 

    // this.currentflightclick = !this.currentflightclick

    // //console.log("Left Index:" + index);
    this.value = index + 1;
    // this.val = false;

    this.returnIndex = index;
    this.clickeddepartflight = false;

    this.currentflightOptionKey = flight['flightOptionKey'];
    this.selectedflight = flight.onwardFlightOption;
    // //console.log(flight['flightOptionKey']);
    // //console.log(flight)

    let filter = this.returnflightarry.filter((res) => {
      return res['flightOptionKey'] == flight['flightOptionKey']
    }
    );

    this.leftSideDepartingOnwardFlightNumbers = filter[0]['checkLegsOnwardFlight'];
    this.rightSideReturnFlightNumbers = '';
    //console.log('left side', filter)
    this.keyreturn = sessionStorage.getItem('searchKey')
    // //console.log(this.key);


  }

  checkLegsSelected(legsArray) {
    if (this.getArrayOfOnward != undefined) {
      let leftFlightLegs = this.getArrayOfOnward;
      let rightFlightLegs = legsArray;


      if (leftFlightLegs.some(v => rightFlightLegs.includes(v))) {
        return true
      }
    }

  }

  flag: boolean = false;
  clickedrightindex;
  currentflightclick: boolean = false;
  flagreturnright: boolean = false;
  leftSideKey;
  alreadySelectedReturn = true;

  finalKeySendToServer;
  similarOptionreturnRight(flight, index) {
    //console.log(flight)
// //console.log(this.selectedflight)
    if(flight.returnFlightOption != this.selectedflight['returnFlightOption'] ){
      this.alreadySelectedReturn = false;
    }
    // if (this.leftFlag != true) {
    //   let snackBarRef11 = this._snackBar.open("PLease select Departure flight first", "", {
    //     duration: 1000
    //   });
    //   return;
    // }

    this.flagreturnright = true;
    //this.clickedrightindex = index;
    this.newkeyright = flight.flightOptionKey;
    //similar option logic wfh
    this.clickedrightflightno = flight.returnFlightOption.flightlegs[0].flightNumber
    // //console.log('clicked right flight no', this.clickedrightflightno);



    this.clikedrightflightoptionkey = flight.flightOptionKey;
    // //console.log('right side flight option key', this.clikedrightflightoptionkey)
    //smilar optn logi cned 

    /////
    let fno = this.clikedrightflightoptionkey.includes(this.clickedleftflightno)
    // //console.log('fno', fno);

    let filters = this.returnflightarry.filter((res) => {
      return res['flightOptionKey'] == flight['flightOptionKey']
    }
    )
    //console.log('right side', filters)

    this.currentflightclick = true;
    this.rightSideReturnFlightNumbers = filters[0]['checkLegsReturnFlight'];
this.leftSideKey = filters[0]['flightOptionKey']
let moreOpt = this.moreOptionResponse;
//console.log(moreOpt);
//console.log(this.leftSideDepartingOnwardFlightNumbers);
//console.log(this.rightSideReturnFlightNumbers)

let finalKey = moreOpt.find((res) => {
  return JSON.stringify(res['checkLegsOnwardFlight']) == JSON.stringify(this.leftSideDepartingOnwardFlightNumbers) && JSON.stringify(res['checkLegsReturnFlight']) == JSON.stringify(this.rightSideReturnFlightNumbers)
}
);

this.finalKeySendToServer = finalKey['flightOptionKey']
//console.log(this.finalKeySendToServer)
    // if (this.newflag != true) {
    //   let snackBarRef11 = this._snackBar.open("PLease select Departure flight first", "", {
    //     duration: 1000
    //   });
    // } else {

    // }
    this.rightIndex = index;
    // //console.log(this.rightIndex);
    // //console.log("right index:" + index);
 
    this.sameIndex = index;
    this.clickeddepartflight = true;
    this.returnflightoptkey = flight.flightOptionKey
    this.selectedflightx = flight.onwardFlightOption;
  }
  ////////////////proceed oneway
  proceed() {

    let countrycode = localStorage.getItem('countryCode').toLowerCase();
    //console.log('this.countrycode, this.countryInUrl',countrycode,this.countryInUrl);

    if(countrycode != this.countryInUrl){
      ////console.log('this.countrycode, this.countryInUrl',this.countrycode,this.countryInUrl);
    
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

    this.presentLoading();

    //console.log('Loading dismissed!');



    var fareitem = {
      "countryId": this.countryId,
      "curruencyCode": "AED",
      "flightOptionKey": this.currentclick == false ? this.flightOptionKey : this.flightOptionKeysimilar,
      "flightSearchKey": this.key,
      "flightSearchWidgetList": [
        {
          "cabinClass": this.ccData,
          "destination": this.finaldest,
          "onwardJourneyDate": this.departDate,
          "origin": this.finalorigin,
          "returnJourneyDate": "DEL"
        }
      ],
      "groupId": this.groupId,
      "noOfAdult": this.adult ? this.adult : 1,
      "noOfChild": this.children ? this.children : 0,
      "noOfInfant": this.infants ? this.infants : 0,
      "tripType": "oneway"
    }



    this.flightService.fareConfirmapi(fareitem).subscribe(res => {
      //console.log('request body return flight', res)
      if (res) {
        if(res['onwardFlightOption'] == null){
          this.flightService.selectedFlight(null);
        }else{
        this.flightService.selectedFlight(res);
        this.flightService.selectedFlightmulti('');
        }
        this.closeLoading();
        this.globalService.sendFareConfirmRequestToComponent(fareitem)

        this.sendDataToConfirmFlight();
        this.cookieService.delete('timerStart');


        let adult = this.adult ? this.adult : 1
        let onewaydepartDate =  moment(this.departDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        // let maskUrl = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.FlightOnwardCarrier+'/Oneway';
        // this.router.navigate([maskUrl]);
        this.FlightOnwardCabinClass == 'Firstclass' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;
         this.FlightOnwardCabinClass == 'FirstClass' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;
         this.FlightOnwardCabinClass == 'Premiumeconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;
         this.FlightOnwardCabinClass == 'PremiumEconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;

        let maskUrlforAdult = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.FlightOnwardCarrier+'/Oneway';
        let maskUrlforAdultChild = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.children+'Child'+'/'+this.FlightOnwardCarrier+'/Oneway';
        let maskUrlforAdultChildInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Oneway';
        let maskUrlforAdultInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+onewaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+adult+'Adult'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Oneway';

       // //console.log('adult,child,infant',this.newadult,this.children,this.infants);
 
 if(this.adult >= 1 && this.children == 0 && this.infants ==0){
   this.router.navigate([maskUrlforAdult]);
 
 //console.log('adult,child,infant',this.adult,this.children,this.infants)
 }
 if(this.adult >= 1 && this.children >= 1 && this.infants ==0){
   this.router.navigate([maskUrlforAdultChild]);
 
   //console.log('adult,child,infant',this.adult,this.children,this.infants)
 
 }if(this.adult >= 1 && this.children >= 1 && this.infants >=1){
   this.router.navigate([maskUrlforAdultChildInfant]);
 
   //console.log('adult,child,infant',this.adult,this.children,this.infants)
 
 }if(this.adult >= 1 && this.children == 0 && this.infants >=1){
  this.router.navigate([maskUrlforAdultInfant]);
  
  //console.log('adult,child,infant',this.adult,this.children,this.infants)
  
  }

      }
    });

  }

  proceedauto() {
    this.presentLoading();


    //console.log('Loading dismissed!');



    var fareitem = {
      "countryId": this.countryId,
      "curruencyCode": "AED",
      "flightOptionKey": this.flightOptionKey,
      "flightSearchKey": this.key,
      "flightSearchWidgetList": [
        {
          "cabinClass": this.ccData,
          "destination": this.finaldest,
          "onwardJourneyDate": this.reqdepartdate,
          "origin": this.finalorigin,
          "returnJourneyDate": "DEL"
        }
      ],
      "groupId": this.groupId,
      "noOfAdult": this.adult ? this.adult : 1,
      "noOfChild": this.children ? this.children : 0,
      "noOfInfant": this.infants ? this.infants : 0,
      "tripType": "oneway"
    }
    this.flightService.fareConfirmapi(fareitem).subscribe(res => {
      //console.log('request body return flight', res)
      if (res) {
        this.closeLoading();

        this.flightService.selectedFlight(res);
        this.flightService.selectedFlightmulti('');
        this.sendDataToConfirmFlight();
        this.cookieService.delete('timerStart');
        this.router.navigate(['/confirm-flight'])
      }
    });

  }




  ///////convert date
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

  getwidget() {
    this.flightService.getflightwidget().subscribe((res) => {
      this.flightwidget = res;
      //console.log(this.flightwidget);
    })

  }


  editflight() {

    this.router.navigate(['/search-flights']);
  }

  proceedmulti() {
    // this.bottomSheet.dismiss();


    this.presentLoading();

    //console.log(this.key);
    this.flightOptionKeyreturn = sessionStorage.getItem('flightOptionKey')
    //console.log(this.flightOptionKey);
    // "flightOptionKey": this.flightOptionKey,
    // "flightSearchKey": this.key,

    //this.flightwidget

    var fareconfirm = {
      "countryId": this.countryId,
      "curruencyCode": "AED",
      "flightOptionKey": this.flightOptionKey,
      "flightSearchKey": this.key,
      "flightSearchWidgetList": this.flightwidget,
      "groupId": this.groupId,
      "noOfAdult": this.adult ? this.adult : 1,
      "noOfChild": this.children ? this.children : 0,
      "noOfInfant": this.infants ? this.infants : 0,
      "tripType": "multicity"
    }

    this.flightService.fareConfirmapi(fareconfirm).subscribe(resnew => {
      //console.log('fareConfirmapi req body multicity', resnew)
      if (resnew) {
        if(resnew['onwardFlightOption'] == null){
          this.flightService.selectedFlightmulti(null);
        }else{
          this.flightService.selectedFlightmulti(resnew);
          this.flightService.selectedFlight('');
        }
        this.globalService.sendFareConfirmRequestToComponent(fareconfirm)
        this.closeLoading();
      
        this.sendDataToConfirmFlight()
        this.cookieService.delete('timerStart');
        this.router.navigate(['/confirm-flight'])

      }

    });
  }


  proceedreturnway() {


    let countrycode = localStorage.getItem('countryCode').toLowerCase();
    ////console.log('this.countrycode, this.countryInUrl',countrycode,this.countryInUrl);

    if(countrycode != this.countryInUrl){
     // //console.log('this.countrycode, this.countryInUrl',countrycode,this.countryInUrl);
    
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

    //console.log(this.leftFlag);
    //console.log(this.rightSideReturnFlightNumbers)
    
      if (this.leftFlag == true) {
        if(this.rightSideReturnFlightNumbers == ''){
          let snackBarRef11 = this._snackBar.open("Please select return flight ", "", {
            duration: 1000
          });
          return;
        }
       
      }
  

    this.presentLoading();

    this.flightOptionKeyreturn = sessionStorage.getItem('flightOptionKey')

    // //console.log(this.flightOptionKeyreturn);
    // //console.log(this.key);
    //newkeyright
// //console.log(this.leftSideKey);
// //console.log(this.currentflightclick)
// //console.log( this.flightOptionKeyreturn)
// //console.log(this.currentflightOptionKey)

//console.log(this.finalKeySendToServer)

    var fareitems = {
      "countryId": this.countryId,
      "curruencyCode": "AED",
      // "flightOptionKey": this.leftSideKey,
      "flightOptionKey": this.currentflightclick == false ? this.flightOptionKeyreturn : this.finalKeySendToServer,
      "flightSearchKey": this.key,
      "flightSearchWidgetList": [
        {
          "cabinClass": this.ccData,
          "destination": this.finaldest,
          "onwardJourneyDate": this.returnwaydepartDate,
          "origin": this.finalorigin,
          "returnJourneyDate": this.returnwayreturnDate
        }
      ],
      "groupId": this.groupId,
      "noOfAdult": this.adult ? this.adult : 1,
      "noOfChild": this.children ? this.children : 0,
      "noOfInfant": this.infants ? this.infants : 0,
      "tripType": "roundtrip"
    }
    //console.log('fare confirm body of  returnway from similar page', fareitems);
    //console.log('key1',this.flightOptionKeyreturn)
  
    //console.log('status of click is',  this.currentflightclick);

    //console.log('key2',this.leftSideKey);
    // var mydeparting = this.flightForm.get('returnwaydepartDate').value;
    // var myreturning = this.flightForm.get('returnwayreturnDate').value;
    this.flightService.fareConfirmapi(fareitems).subscribe(res => {
      //console.log(res)
      if (res) {
        if(res['roundTripFlightOption'] == null){
          this.flightService.selectedFlight(null);
        }else{
          this.flightService.selectedFlight(res);
        this.flightService.selectedFlightmulti('');
        }
        this.globalService.sendFareConfirmRequestToComponent(fareitems)
        this.closeLoading();

        
        this.sendDataToConfirmFlight();
        this.cookieService.delete('timerStart');
      //  this.router.navigate(['/confirm-flight'])

       // this.router.navigate(["/similarOption"+'/cheap-flights'+'/search']);
  
     //console.log('final dest',this.finaldest);
     //console.log('final org',this.finalorigin);
     //console.log(this.returnwaydepartDate);
     //console.log(this.returnwayreturnDate);
     let adultinfo = this.adult ? this.adult : 1
     let returnwaydepartDate =  moment(this.returnwaydepartDate,  "DD-MM-YYYY").format("YYYY-MM-DD");
     let returnwayreturnDate =  moment(this.returnwayreturnDate,  "DD-MM-YYYY").format("YYYY-MM-DD");
     //console.log(returnwaydepartDate);
     //console.log(returnwayreturnDate);
     this.FlightOnwardCabinClass == 'FirstClass' ? this.FlightOnwardCabinClass = 'First' : this.FlightOnwardCabinClass;
       this.FlightOnwardCabinClass == 'Premiumeconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;
       this.FlightOnwardCabinClass == 'PremiumEconomy' ? this.FlightOnwardCabinClass = 'Premium' : this.FlightOnwardCabinClass;

       this.FlightReturnCabinClass == 'FirstClass' ? this.FlightReturnCabinClass = 'First' : this.FlightReturnCabinClass;
       this.FlightReturnCabinClass == 'Premiumeconomy' ? this.FlightReturnCabinClass = 'Premium' : this.FlightReturnCabinClass;
       this.FlightReturnCabinClass == 'PremiumEconomy' ? this.FlightReturnCabinClass = 'Premium' : this.FlightReturnCabinClass;

       let maskUrlforAdult = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/Return'
     //
     //this.router.navigate([maskUrl]);

    // let maskUrlforAdult = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.FlightOnwardCarrier+'/Return'
     let maskUrlforAdultChild = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.children+'Child'+'/'+this.FlightOnwardCarrier+'/Return'
     let maskUrlforAdultChildInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.children+'Child'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Return'
     let maskUrlforAdultInfant = this.countryCode+'/'+this.language+'/flight-review/'+this.finalorigin+'-'+this.finaldest+'/'+returnwaydepartDate+'/'+this.FlightOnwardCabinClass+'/'+returnwayreturnDate+'/'+ this.FlightReturnCabinClass+'/'+adultinfo+'Adult'+'/'+this.infants+'Infant'+'/'+this.FlightOnwardCarrier+'/Return'



if(this.adult >= 1 && this.children == 0 && this.infants ==0){
this.router.navigate([maskUrlforAdult]);

////console.log('adult,child,infant',this.adult,this.children,this.infants)
}
if(this.adult >= 1 && this.children >= 1 && this.infants ==0){
this.router.navigate([maskUrlforAdultChild]);

////console.log('adult,child,infant',this.adult,this.children,this.infants)

}if(this.adult >= 1 && this.children >= 1 && this.infants >=1){
this.router.navigate([maskUrlforAdultChildInfant]);

// //console.log('adult,child,infant',this.adult,this.children,this.infants)

}if(this.adult >= 1 && this.children == 0 && this.infants >=1){
  this.router.navigate([maskUrlforAdultInfant]);
  
  //console.log('adult,child,infant',this.adult,this.children,this.infants)
  
  }

      }

    });

  }


  getselectedtravllersfromlocal() {
    this.seladult = localStorage.getItem('seladult');
    this.selchildren = localStorage.getItem('selchildren');
    this.selinfants = localStorage.getItem('selinfants');

  }

  sendDataToConfirmFlight(){
    this.flightService.sendSearchResultCard(true);
  }

  ngOnDestroy() {
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
    this.travSub.unsubscribe();

  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }


  odddata() {
    this.flightService.getoddata().subscribe(res => {
      //console.log('origin dest service',res);
      if (res) {


        this.finalorigin = res.returnwayOrigin;
        this.finaldest = res.returnwaydestination;


        var returnwayorigin = this.finalorigin;
        var returnwaydestination = this.finaldest;
        //console.log(returnwayorigin);
        //console.log(returnwaydestination);

        this.departDate = res.returnwaydepartDate;
        this.returnDate = res.returnwayreturnDate;

        this.myeconomyonward = res.myeconomyonward;
        this.myeconomyreturn = res.myeconomyreturn

        this.reqdepartdate = this.convertdepart(this.departDate);
        this.reqreturndate = this.convertreturn(this.returnDate)

        //console.log(this.reqdepartdate);
        //console.log(this.reqreturndate);
        let countryCodee = localStorage.getItem('countryCode');
        this.countryCode = countryCodee && countryCodee.toLowerCase();

        this.FlightOnwardCabinClass = localStorage.getItem('FlightOnwardCabinClass');
        this.FlightReturnCabinClass = localStorage.getItem('FlightReturnCabinClass');

        this.FlightReturnCabinClass =  this.FlightReturnCabinClass && this.FlightReturnCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        this.FlightReturnCabinClass = this.FlightReturnCabinClass && this.FlightReturnCabinClass.charAt(0).toUpperCase() + this.FlightReturnCabinClass.slice(1);
   
         this.FlightOnwardCabinClass =  this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
       this.FlightOnwardCabinClass = this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1)
      this.FlightOnwardCarrier = sessionStorage.getItem('FlightOnwardCarrier');

      }else{
        //console.log('no odd response may be from refresh');
        this.adult = 1;
         this.children = 0;
         this.infants =0;
        this.finalorigin = sessionStorage.getItem('refreshedOrigin');
        this.finaldest = sessionStorage.getItem('refreshedDest');
     let countryCodee = sessionStorage.getItem('countryCode');
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
     this.FlightOnwardCabinClass = this.FlightOnwardCabinClass && this.FlightOnwardCabinClass.charAt(0).toUpperCase() + this.FlightOnwardCabinClass.slice(1)
      }

    })

  }

}