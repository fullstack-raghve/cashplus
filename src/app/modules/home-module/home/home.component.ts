import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef, ElementRef } from "@angular/core";
import { IonSlides } from "@ionic/angular";
import { GlobalService } from "src/app/services/global.service";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import { Input } from "@syncfusion/ej2-inputs";
import { HttpClient } from '@angular/common/http';
import { OriginDestinationService } from 'src/app/services/origin-destination.service';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { NavController } from '@ionic/angular';
import { RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { FlightService } from "src/app/services/flight.service";
import { OverlayService } from "src/app/services/overlay.service";
import * as $ from 'jquery';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("myFormPost") myFormPost: ElementRef;
  @ViewChild("slides") Slides: IonSlides;
  bannerurl: any;
  array: any;
  bannerToShow: any;
  servicedata: any;
  countryId: any;
  servicedata2: any;
  array2: any;
  bannerToShow2: any;
  menuurl: any;
  bannerToShownew: any;
  service: Subscription;
  language: any;
  countries: any;
  dafaultcname: any;
  defaultcountryName: any;
  bresponse: any;
  branchCode: any;
  branchCurrencyCode: any;
  branchId: any;
  countryCode: any;
  groupId: any;
  defaultbanner: any;
  banner1: any;
  banner2: any;
  banner3: any;
  servicx: Subscription;
  //bannerimg = this.array.bannerList;
  showMe: boolean;
  contactNo: any;
  settingdata: any;
  settingcountry: any;
  settingcountrynew: any;
  newcountryidfromsetting: any;
  newdataofsetting: any;
  dafaultcnamesetting: any;
  bresponsenew: any;
  newbanner: any;
  bnneronhtml: any;
  contactNonew: any;
  cname: string;
  currency: string;
  localstorgecountry: any;
  socialMediaList: any;
  fburl: any;
  socialMedianame: any;
  socialname: any;
  socialMediaUrl: any;
  airportId: any;
  airportCode: any;
  airportName: any;
  airportId1: any;
  airportCode1: any;
  airportNam1: any;
  settingdataCountry: string;
  productMapDetails: any;
  dffcnn: any;
  finalproductdetails: any;
  sliderdata: any;
  leftBanner: any;
  rightBanner: any;
  settingmoduleurl: string;
  previoueurl: any;
  branchName: any;
  branchEmailId: any;
  branchAddress: any;
  countryName: any;
  loading = true;
  public offerLeftBanner: SafeResourceUrl;
  ccd: any;
  affmoderesponse: any;
  checkMode: string;
  urlccode: string;

  prev() {
    this.Slides.slidePrev();
  }

  nextSlide() {
    this.Slides.slideNext();
  }
  sliderOpts = {
    zoom: false,
    slidesPerView: 4.5,
    spaceBetween: 10
  };
  currentScreenOrientation: string;

  constructor(private globalService: GlobalService,
    private http: HttpClient,
    private location: Location,
    private spinner: NgxSpinnerService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private screenOrientation: ScreenOrientation,
    private profileControllerService: ProfileControllerService,
    private cd: ChangeDetectorRef,
    public navCtrl: NavController,
    private ods: OriginDestinationService,
    private flightService: FlightService,
    private overlayService: OverlayService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef) {


    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        //  //console.log("Orientation Changed"+this.screenOrientation.type);
        this.currentScreenOrientation = this.screenOrientation.type;
      }
    );
    //  this.setPortrait()

  }

  ngOnInit() {
    let myurl = this.router.url
    var countycodeInurl_splits = myurl.split('/');
    this.urlccode = countycodeInurl_splits[1];
    this.urlccode = this.urlccode.toUpperCase();

    this.getAffData();
    this.checkMode = sessionStorage.getItem('booking-type');

    // this.setPortrait();
    //console.log('i m from init dashobard');
    this.noBack();

    localStorage.removeItem('passengersList');
    localStorage.removeItem('selectedFlightOptionKey');
    localStorage.removeItem('searchKey');
    localStorage.removeItem('fareConfirmReqKey');
    localStorage.removeItem('flightOptionKey');
    localStorage.removeItem('returnwaydepartDate');
    localStorage.removeItem('returnwayreturnDate');
    // localStorage.removeItem('DataForTravellers');
    localStorage.removeItem('getDataFromGuestLogin');
    localStorage.removeItem('surchargeAmount')
    this.dashboardWillLoad();
    //this.dashboardWillLoad();
    this.loading = false;
  }





  ngAfterViewInit() {
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.scrollTo(0, 10);
        // //console.log('yes')
      }, 1);
      setTimeout(function () {
        window.scrollTo(0, 10);
        // //console.log('no')
      }, 0);
    });
    //webengage
    //  var s = document.createElement("script");
    //  s.type = "text/javascript";
    //  s.innerHTML="//console.log('script added done');"; //inline script
    //  s.id='_webengage_script_tag';
    //  s.src = "assets/js/webEngage.js";
    //  this.elementRef.nativeElement.appendChild(s);
    //  webengage.track("Home Page Viewed PWA", {
    // });
  }
  ionViewWillEnter() {
    //console.log('i m from ionViewWillEnter dashobard');
    this.noBack();
    localStorage.removeItem('reloadTrip');
    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        //  //console.log('previous url',e[0].urlAfterRedirects); // previous url
        this.previoueurl = e[0].urlAfterRedirects;
      });

    if (this.previoueurl == '/settings-module') {
      // //console.log('i m from init from url if statement');


      this.dashboardWillLoad();
    }




    // //console.log("ion-enter");
  }
  noBack() {
    ////
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };

    ///
  }
  globalvar: boolean = false;

  dashboardWillLoad() {
    let localSettingsCurrency = localStorage.getItem("SettingsCurrency");
    let localSettingsLanguage = localStorage.getItem("SettingsLanguage");
    this.settingdataCountry = localStorage.getItem("SettingCountryCode");

    //console.log('checkMode',this.checkMode);
    if (this.checkMode != 'affiliate') {
 //console.log('this is not affmode');
      this.settingdataCountry != null ? this.getsettingdata() : this.loaddashboard();
// if(this.settingdataCountry != null){
//   this.getsettingdata()
// }else{
//   this.loaddashboard()
// }
    } else {

       //console.log('this is affmode')
    }

  }



  loaddashboard() {

    this.spinner.show();
    localStorage.removeItem("branchCode");
    localStorage.removeItem("branchCurrencyCode");
    localStorage.removeItem("branchId");
    localStorage.removeItem("groupId");
    localStorage.removeItem("countryId");
    localStorage.removeItem("currentCountryName");
    this.service = this.globalService.getDashboard().subscribe(dash => {
      //console.log('get dashboard id', dash);
      this.servicedata = dash['countryList'];
      ///////////////////////////////////////////////////////////////////////////// start
      this.language = dash['language'];
      this.countries = dash['countryList'];
      let urlCC = this.urlccode;
      if (this.urlccode) {
        this.dafaultcname = this.countries.filter((res) => {
          //   return res.defaultCountry == true
          return res.countryCode == urlCC;
        }
        )
        ////console.log('if>>',this.dafaultcname[0]);
        this.dafaultcname[0] == undefined ? this.ByDefault() : ''
        //console.log('if--  country is in url>>');
        //console.log('urlCC',urlCC);


      } else {
        this.dafaultcname = this.countries.filter((res) => {
          return res.defaultCountry == true
        }
        )
       //console.log('else -- no country in url>>');

      }

       //console.log(this.dafaultcname[0]);
      this.defaultcountryName = this.dafaultcname[0].countryName;
      ////branch response detail of default country 
      localStorage.setItem('countryName', this.defaultcountryName)

      this.countryId = this.dafaultcname[0].countryId;
       //console.log('country id is', this.countryId);
      localStorage.setItem("countryId", this.countryId);
      this.getsocialmedia();

      this.bresponse = this.dafaultcname[0].branchResponse;
      if (this.bresponse) {
        //console.log('branch response present>>>');

        this.dataInLocal(this.bresponse);

        this.globalService.getDashboardByid(this.countryId).subscribe(bycountryid => {
          //console.log('get dashboard  from setting selected country id', bycountryid);
          //console.log('countryId>>>', this.countryId);

          this.newdataofsetting = bycountryid["countryList"];

          this.dafaultcnamesetting = this.newdataofsetting.filter(res => {
            return res.defaultCountry == true;
          });

          this.bresponse = this.dafaultcnamesetting[0].branchResponse;
          this.dffcnn = this.dafaultcnamesetting[0].countryCode;

          if (this.dafaultcnamesetting[0].productMap != null) {
            let mapData = this.dafaultcnamesetting[0].productMap;
            const dffcnns: any = this.dafaultcnamesetting[0].countryCode;

            this.productMapDetails = this.dafaultcnamesetting[0].productMap;

            let data = this.productMapDetails
            for (var prop in data) {
              let finaldata = data[prop];
              this.finalproductdetails = finaldata;
            }

          } else {
            this.finalproductdetails = 'noProductMap';
          }
          this.spinner.hide()
        });

      } else {

        //console.log('branch response nott present>>>');
        this.loafromUrl();

      }



    });
  }

  ByDefault() {
    //console.log('i am from ByDefault()>>');

    this.dafaultcname = this.countries.filter((res) => {
      return res.defaultCountry == true
    }
    )
    ////console.log('ByDefault when wrong country in url>>',this.dafaultcname[0]);
    this.defaultcountryName = this.dafaultcname[0].countryName;
    let dcc = this.dafaultcname[0].countryCode;
    let dccfinal = dcc.toLowerCase();;

    ////branch response detail of default country 
    localStorage.setItem('countryName', this.defaultcountryName)

    this.countryId = this.dafaultcname[0].countryId;
    ////console.log('country id is', this.countryId);
    localStorage.setItem("countryId", this.countryId);
    this.getsocialmedia();

    this.bresponse = this.dafaultcname[0].branchResponse;
    this.dataInLocal(this.bresponse);

    this.globalService.getDashboardByid(this.countryId).subscribe(bycountryid => {
      ////console.log('get dashboard  from setting selected country id',bycountryid);

      this.newdataofsetting = bycountryid["countryList"];

      this.dafaultcnamesetting = this.newdataofsetting.filter(res => {
        return res.defaultCountry == true;
      });

      this.bresponse = this.dafaultcnamesetting[0].branchResponse;
      this.dffcnn = this.dafaultcnamesetting[0].countryCode;

      if (this.dafaultcnamesetting[0].productMap != null) {
        let mapData = this.dafaultcnamesetting[0].productMap;
        const dffcnns: any = this.dafaultcnamesetting[0].countryCode;

        this.productMapDetails = this.dafaultcnamesetting[0].productMap;

        let data = this.productMapDetails
        for (var prop in data) {
          let finaldata = data[prop];
          this.finalproductdetails = finaldata;
        }

      } else {
        this.finalproductdetails = 'noProductMap';
      }
      this.router.navigate([
        dccfinal + "/" + 'en'
      ]);
      this.spinner.hide();
    });

  }

  loafromUrl() {
  

    this.globalService.getDashboardByid(this.countryId).subscribe(bycountryid => {
      //console.log('get dashboard  from url country code', bycountryid);

      this.newdataofsetting = bycountryid["countryList"];

      this.dafaultcnamesetting = this.newdataofsetting.filter(res => {
        return res.defaultCountry == true;
      });

      this.bresponse = this.dafaultcnamesetting[0].branchResponse;
      this.dffcnn = this.dafaultcnamesetting[0].countryCode;
      this.dataInLocal(this.bresponse);

      if (this.dafaultcnamesetting[0].productMap != null) {
        let mapData = this.dafaultcnamesetting[0].productMap;
        const dffcnns: any = this.dafaultcnamesetting[0].countryCode;

        this.productMapDetails = this.dafaultcnamesetting[0].productMap;

        let data = this.productMapDetails
        for (var prop in data) {
          let finaldata = data[prop];
          this.finalproductdetails = finaldata;
        }

      } else {
        this.finalproductdetails = 'noProductMap';
      }
      this.spinner.hide()
    });



  }

  dataInLocal(x) {
    this.bresponse = x;

    this.branchCode = this.bresponse.branchCode;
    this.branchCurrencyCode = this.bresponse.branchCurrencyCode;
    this.branchId = this.bresponse.branchId;
    this.countryCode = this.bresponse.countryCode;
    this.groupId = this.bresponse.groupId;
    this.contactNo = this.bresponse.contactNo;
    this.branchName = this.bresponse.branchName;
    this.branchEmailId = this.bresponse.branchEmailId;
    this.branchAddress = this.bresponse.branchAddress;
    this.getdashboardbanner();
    //set in local all the branch,group code and id-//////////////////////////////////////////////////
    localStorage.setItem("SettingsCurrency", this.branchCurrencyCode);
    localStorage.setItem("SettingsLanguage", 'English');
    localStorage.setItem("selectedCountry", this.dafaultcname[0]['countryName']);
    localStorage.setItem("selectedCountryCode", this.countryCode);

    ////
    localStorage.setItem('branchCode', this.branchCode);
    localStorage.setItem('branchCurrencyCode', this.branchCurrencyCode);
    localStorage.setItem('branchId', this.branchId);
    localStorage.setItem('groupId', this.groupId);
    localStorage.setItem('countryCode', this.countryCode);
    localStorage.setItem('branchName', this.branchName);
    localStorage.setItem('branchEmailId', this.branchEmailId);
    localStorage.setItem('branchAddress', this.branchAddress);
    localStorage.setItem('BranchcontactNo', this.contactNo);
    localStorage.setItem('currentCountryName', this.dafaultcname[0]['countryCode'])

    this.defaultbanner = this.dafaultcname[0].bannerList;
    this.banner1 = this.defaultbanner && this.defaultbanner[0]
    this.array = this.servicedata[0]
    this.bannerToShow = this.array.bannerList;
    this.bannerToShownew = this.bannerToShow != null ? this.bannerToShow[1] : '';
    this.bnneronhtml = this.dafaultcname[0].bannerList && this.dafaultcname[0].bannerList[0];
    if (this.dafaultcname[0].holidaysList && this.dafaultcname[0].holidaysList.length != 0) {
      localStorage.setItem("currentCountryHoliday", JSON.stringify(this.dafaultcname[0].holidaysList))
    }
  }

  settingData() {
    localStorage.setItem("SettingsCurrency", 'x');
    localStorage.setItem("SettingsLanguage", 'English');
    localStorage.setItem("selectedCountry", 'x');
  }



  isSocialIcon = false;
  getsocialmedia() {
    this.globalService.getsocialmedia(this.countryId).subscribe(res => {
      // //console.log('check socail meida icons',res);
      if (res['statusMessage'] == 'success') {

        this.socialMediaList = res["socialMediaList"];
        // //console.log(this.socialMediaList);
        this.socialMediaUrlnew = this.socialMediaUrl;
        this.isSocialIcon = true;
        // //console.log('at 0',this.socialMediaList[0]);
        // //console.log('at 1',this.socialMediaList[1]);
        // //console.log('at 2',this.socialMediaList[2])
        // //console.log('at 3',this.socialMediaList[3])
        // //console.log(this.socialMediaList);

        this.fburl = this.socialMediaList.socialMediaUrl;
      }

    });
  }
  socialMediaUrlnew = []
  opensocial(type): void {
    this.socialMedianame = type;
    //alert(this.socialMedianame);

    this.socialname = this.socialMediaList.filter(res => {
      return res.socialMediaType == type;
    });

    this.socialMediaUrl = this.socialname[0].socialMediaUrl;
    // //console.log(this.socialMediaUrl);




    //et url = 'https://www.facebook.com/'
    //window.location.replace(this.socialMediaUrl);
    window.open(this.socialMediaUrl, "_blank");
  }


  getAffData() {
    this.flightService.getaffdata().subscribe((res) => {
     // //console.log('getaffdata>>>', res);

      this.affmoderesponse = res;
      if (this.affmoderesponse) {
        //this.presentLoading();
        ////console.log('loaidng start>>>');

      } else {
        //  this.closeLoading();
        ////console.log('loaidng end>>>');

      }

    });

  }

  ///stting data on save button
  presentLoading() {
    this.overlayService.showLoader();
  }
  closeLoading() {
    this.overlayService.hideLoader();
  }

  getsettingdata() {
////console.log('i am from setting dashbrd method');
    this.spinner.show();

    this.globalService.getDashboard().subscribe(dash => {
      this.servicedata = dash['countryList'];
      // this.bannerurl  = this.servicedata.bannerList
      ///////////////////////////////////////////////////////////////////////////// start
      this.language = dash['language'];
      this.countries = dash['countryList'];

      this.settingcountry = this.settingdataCountry;

      let SettingCountryCode = localStorage.getItem('SettingCountryCode')

      this.settingcountrynew = this.countries.filter(res => {
        // return res.countryName == this.settingcountry;
        return res.countryCode == SettingCountryCode;
      });
     /// //console.log('loaded dashbord accr to setting', this.settingcountrynew);
      // //console.log('filtered country on basis of selected country',this.settingcountrynew);

      if (this.settingcountrynew && this.settingcountrynew[0].holidaysList && this.settingcountrynew[0].holidaysList.length != 0 && this.settingcountrynew[0].holidaysList != undefined) {
        localStorage.setItem("currentCountryHoliday", JSON.stringify(this.settingcountrynew[0].holidaysList))
      }

      this.countryId = this.settingcountrynew[0].countryId;
      localStorage.setItem("countryId", this.countryId);
      this.getsocialmedia();
      this.globalService.getDashboardByid(this.countryId).subscribe(bycountryid => {


        this.newdataofsetting = bycountryid["countryList"];

        this.dafaultcnamesetting = this.newdataofsetting.filter(res => {
          return res.defaultCountry == true;
        });


        // //console.log(this.dafaultcnamesetting)
        if (this.dafaultcnamesetting.length != 0) {
          if (this.dafaultcnamesetting[0].bannerList != null) {
            this.bnneronhtml = this.dafaultcnamesetting[0].bannerList[0];
           /// //console.log('i m bner console 2', this.bnneronhtml)
          } else {
           /// //console.log('no banner')
          }
          // bnneronhtml
        }
        this.bresponse = this.dafaultcnamesetting[0].branchResponse;
        //  //console.log('this is branch of that country',this.bresponse);
        this.dffcnn = this.dafaultcnamesetting[0].countryCode;
        this.defaultcountryName = this.dafaultcnamesetting[0].countryName;
        localStorage.setItem('countryName', this.defaultcountryName)




        if (this.dafaultcnamesetting[0].productMap != null) {
          //  //console.log('prodct map coming -if -widget-localsetting');
          let mapData = this.dafaultcnamesetting[0].productMap;
          const dffcnns: any = this.dafaultcnamesetting[0].countryCode;

          this.productMapDetails = this.dafaultcnamesetting[0].productMap;

          //  //console.log(this.productMapDetails);

          let data = this.productMapDetails
          for (var prop in data) {
            let finaldata = data[prop];
            //  //console.log('finaldata of product list',finaldata);
            this.finalproductdetails = finaldata;
          }

        } else {
          //  //console.log('prodct map not coming -else -widget-localsetting');

          this.finalproductdetails = 'noProductMap';

        }
        this.spinner.hide()
        ////

        //////////////////////////set parameter in local of branch 
        this.countryCode = this.bresponse.countryCode;
        this.branchCode = this.bresponse.branchCode;
        this.branchCurrencyCode = this.bresponse.branchCurrencyCode;
        this.branchId = this.bresponse.branchId;
        this.countryCode = this.bresponse.countryCode;
        this.groupId = this.bresponse.groupId;
        this.contactNo = this.bresponse.contactNo;
        this.branchName = this.bresponse.branchName;
        this.branchEmailId = this.bresponse.branchEmailId;
        this.branchAddress = this.bresponse.branchAddress;
        this.getdashboardbanner();
        //alert(this.contactNo)
        //set in local all the branch,group code and id-//////////////////////////////////////////////////
        localStorage.setItem('branchCode', this.branchCode);
        localStorage.setItem('branchName', this.branchName);
        localStorage.setItem('branchCurrencyCode', this.branchCurrencyCode);
        localStorage.setItem('branchId', this.branchId);
        localStorage.setItem('groupId', this.groupId);
        localStorage.setItem('countryCode', this.countryCode);
        localStorage.setItem('SettingCountryCode', this.countryCode);
        localStorage.setItem('BranchcontactNo', this.contactNo);
        localStorage.setItem('branchEmailId', this.branchEmailId);
        localStorage.setItem('branchAddress', this.branchAddress);

      });

    });
  }

  bannerlarry = [];
  getdashboardbanner() {
    this.globalService.getdashboardBanner(this.countryCode).subscribe((res: any) => {
      if (res['statusMessage'] == 'success') {
        let data = res;


        if (res.bannerMap.offerBanner.length > 0) {
          let lBanner = res.bannerMap.offerBanner[0];
          this.offerLeftBanner = this.sanitizer.bypassSecurityTrustResourceUrl(lBanner);
        }
        if (res.widgetBanner.length > 0) {
          window.localStorage.setItem('widgetBanner', res.widgetBanner[0]);
        } else {
          window.localStorage.removeItem('widgetBanner');
        }
        for (var prop in data) {
          var value = data[prop];
          this.leftBanner = value.leftBanner;
          this.rightBanner = value.rightBanner;

        }


      }
    })
  }


}