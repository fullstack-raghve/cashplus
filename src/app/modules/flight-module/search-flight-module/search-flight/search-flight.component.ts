import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Location } from '@angular/common';
// import { NavController } from '@ionic/angular';
import { MatBottomSheet } from '@angular/material';
import { NavController } from '@ionic/angular';
import { filter, shareReplay } from 'rxjs/operators';
import { OriginDestinationService } from 'src/app/services/origin-destination.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { HostListener } from '@angular/core';
import * as $ from 'jquery';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

class Port {
  public id: number;
  public name: string;
}
@Component({
  selector: 'app-search-flight',
  templateUrl: './search-flight.component.html',
   styleUrls: ['./search-flight.component.scss'],
})
export class SearchFlightComponent implements OnInit,OnDestroy {
  public start: Date = new Date("10/07/2017");
  public end: Date = new Date("11/25/2017");
  returnWay: boolean = false;
  multicity: boolean = false;
  oneWay: boolean = false;  
count = 0;
  alterback: boolean = false; //for alter back
  appback:boolean = true; // App header back arrow

  public widgetBannerSafeUrl: SafeResourceUrl | boolean = false;
  // @ViewChild('countryList') selectRef: Select;


  constructor(private router: Router, private bottomSheet: MatBottomSheet,
    private location: Location,public navCtrl: NavController,  private _origindesi:OriginDestinationService, 
    private globalService: GlobalService, private sanitizer: DomSanitizer ) {
      this._origindesi.alterback.subscribe(res =>{
        this.alterback = res;
      })            
      this._origindesi.appback.subscribe(res =>{
        this.appback = res;})
  } 

  private history = [];
  selectedRelaod:Subscription;
  ngOnInit() {
  //   var s = document.createElement("script");
  //   s.type = "text/javascript";
  //   s.src = "assets/js/webEngage.js";
  //   s.id = '_webengage_script_tag';
  //   $("head").append(s);
  //   webengage.track("Home Page Viewed PWA", {
  //   });
  //  //console.log('search flight on inittttt');
    this.selectedTripType();
    this.sanatizeIframe();
   // this.doback();
  }

  doback(){
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
    
      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage;                            //Webkit, Safari, Chrome
    });
  }

  ionViewWillEnter() {
    //console.log('search flight will enter');
    // this.selectedTripType();
  }

  selectedTripType(){
    //console.log('yes');
    //this.location.subscribe(x => //console.log(x));
    this.selectedRelaod = this.globalService.getsendSelectedFlightReload.subscribe(
      (res)=>{
        //console.log(res)
        // if(res){
        //   localStorage.removeItem('reloadTrip');
        // }
      }
    )
    let getRelaodTrip = localStorage.getItem('reloadTrip');
    if(getRelaodTrip == null){
      this.returnWayTrip();
    }
    if(getRelaodTrip == 'returnway'){
      this.returnWayTrip();
    }
    if(getRelaodTrip == 'oneway'){
      this.oneWayTrip();
    }
    if(getRelaodTrip == 'multicity'){
      this.multicityTrip();
    }
  }

  // localStorage.removeItem('reloadTrip');

 
  returnWayTrip() {
    this.returnWay = true;
    this.oneWay = false;
    this.multicity = false;
    localStorage.setItem("TripType", "Returnway");
    localStorage.setItem('reloadTrip', 'returnway' );
    // this.router.navigate( ['/search-flights'], { queryParams: { path: "Returnway"} } )

    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights'],{ queryParams: { path: "Returnway"}});
  }
  oneWayTrip() {
    this.returnWay = false;
    this.oneWay = true;
    this.multicity = false;
    localStorage.setItem("TripType", "Oneway");
    localStorage.setItem('reloadTrip', 'oneway' );
    // this.router.navigate(['/search-flights'], { queryParams: { path: "Oneway"} })

    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights'],{queryParams: { path: "Oneway"}});
  }
  multicityTrip() {
    this.returnWay = false;
    this.oneWay = false;
    this.multicity = true;
    // this.router.navigate(['/search-flights'], { queryParams: { path: "Multicity"} });
    localStorage.setItem('reloadTrip', 'multicity' );

    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights'],{ queryParams: { path: "Multicity"}});
  }
 
  @HostListener('window:popstate', ['$event'])

  onPopState(event) {
    //alert('hello');
this.backTo();
}


  backTo() {
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
    // localStorage.removeItem("DateForAll");
    // localStorage.removeItem("OriginDataDetails");
    // localStorage.removeItem("DestinationDataDetails");
    // localStorage.removeItem("EconomyData");
    //this.location.back();
  }
  altback(){    
    sessionStorage.removeItem('booking-type');
    // this.router.navigate(["/searchresult"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
    
  }

  getallAiport(){
   this.globalService.getAllAirportList().subscribe();
  }

  public sanatizeIframe() {
    let banner = window.localStorage.getItem('widgetBanner')|| false;
    //console.log(banner);
    if(banner) {
      this.widgetBannerSafeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(banner);
    }
  }

  ngOnDestroy(){
  this._origindesi.alterback.next(false);
  this._origindesi.appback.next(true);
  this.selectedRelaod.unsubscribe();
  }

  

}
