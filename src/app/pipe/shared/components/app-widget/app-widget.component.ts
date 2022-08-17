import { Component, OnInit, OnDestroy,OnChanges, Input } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { GlobalService } from 'src/app/services/global.service';
import { Subscriber, Subscription } from 'rxjs';
import { FlightService } from 'src/app/services/flight.service';
@Component({
  selector: 'app-widget',
  templateUrl: './app-widget.component.html',
  styleUrls: ['./app-widget.component.scss'],
})
export class AppWidgetComponent implements OnChanges, OnInit,OnDestroy {
@Input() productMap;

  bannerurl: any;
  array: any;
  bannerToShow: any;
  servicedata:any;
  countryId: any;
  servicedata2: any;
  array2: any;
  bannerToShow2: any;
  menuurl: any;
  finaldata: any;
  navlist =[];
  val1: any;
  activitiesurl: any;
  holidaysurl: any;
  cruisesurl: any;
  offersurl: any;
  service: Subscription;

  ///

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
  ///

  offer_url = 'ContentMobile/'
  
  sliderOpts = {
    zoom: false,
    slidesPerView:3.5,
    spaceBetween: 2
    // breakpoints: {
    //   360: {
    //     spaceBetween: 1,
    //     slidesPerView:2.8,
    //   },
    // }
    };

    sliderOptsnew = {
      zoom: false,
      slidesPerView: 4.5,
      spaceBetween: 2
      };
  modules = [{
    id: 1,
    modulename: 'Flights',
    link: '/search-flights',
    iconurl: 'assets/homePageIcons/Home_Flight_icon.svg'
  }
  // {
  //   id: 2,
  //   modulename: 'Hotels',
  //   link: '/page-not-found',
  //   iconurl: 'assets/homePageIcons/Home_hotel_icon.svg'
  // }

  

  
  // {
  //   id: 3,
  //   modulename: 'Holidays',
  //   link: '/page-not-found',
  //   iconurl: 'assets/icon/holy.png'

  // }
  // {
  //   id: 4,
  //   modulename: 'Cruises',
  //   link: '/page-not-found',
  //  iconurl: 'assets/icon/icon2.png'


  // },
  // {
  //   id: 5,
  //   modulename: 'Activitites',
  //   link: '/https://www.code-sample.com/',
  // iconurl: 'assets/icon/hotel.png'

  // },
  // {
  //   id: 6,
  //   modulename: 'Offers',
  //   link: '/page-not-found',
  //   iconurl: 'assets/icon/holy.png'

  // }
];

onlyflight = [{
  id: 1,
  modulename: 'Flights',
  link: '/search-flights',
  iconurl: 'assets/homePageIcons/Home_Flight_icon.svg'
}
]
  //settingdataCountry: string;
  defaultbanner: any;
  banner1: any;
  bannerToShownew: any;
  countrycode: any;
  nomenuWillshow: boolean;
  productMapurls: string;
  isflightonly: boolean;
  hotelurl: any;

urlNew = 'https://storage.googleapis.com/b2c-production/static/html/staticPages/ae/Assets/Image/newtag.png'

  constructor(private router: Router,
    private flightservice:FlightService,
    private globalService:GlobalService) {
 

   }
   ngOnChanges()	{
    let datass = this.productMap
   // this.dashboardWillLoad();

   if(this.productMap != 'noProductMap'){
    this.menuurl = this.productMap;
    let data = this.menuurl
    for (var prop in data) {
     this.finaldata = data[prop]
     this.navlist.push(this.finaldata);
     var mydata = this.navlist
     }
     for(prop in mydata) {
       if(data.hasOwnProperty(prop)) {
           var value = data[prop];
           this.hotelurl = value.Hotel
            this.activitiesurl = value.Activities;
             this.holidaysurl = value.Holidays;
             this.cruisesurl = value.Cruises;
             this.offersurl = value.Offers;
           
             this.isflightonly = false;

         }
   }
  }else{
    this.productMapurls = 'noProductMap'
    this.isflightonly = true;
  }

   }


  ngOnInit() {
  
   // this.loaddashboard();
   //this.dashboardWillLoad();


  }
ngOnDestroy(){

 // this.service.unsubscribe();
}


ionViewWillEnter() {
  console.log('ion view will enter');
}



      dashboardWillLoad(){
        let localSettingsCurrency = localStorage.getItem("SettingsCurrency");
        let localSettingsLanguage = localStorage.getItem("SettingsLanguage");
        this.settingdataCountry = localStorage.getItem("selectedCountry");
      
      
      
        if (this.settingdataCountry != null) {
          this.getsettingdata();
      
        }else{
    
          this.loaddashboard();
      
        }
      }
    
///stting data on save button



  loaddashboard() {
  
    this.service = this.globalService.getDashboard().subscribe(dash => {
      
      this.servicedata = dash['countryList']; 
    this.countries = dash['countryList'];
    this.dafaultcname = this.countries.filter((res)=>{
       return res.defaultCountry == true
      }
    )
    this.defaultcountryName = this.dafaultcname[0].countryName;
    this.countryId = this.dafaultcname[0].countryId;
       let id  = +this.countryId;

      this.globalService.getDashboardByid(id).subscribe(bycountryid => {
        this.servicedata2 = dash["countryList"];

////////////////////find true country in get dashboard by id
let dfcountry = this.servicedata2.filter((res)=>{
  return res.defaultCountry == true
 }
)


this.countrycode = dfcountry[0].countryCode;
/////product map of this final default country;


let productMap = dfcountry[0]['productMap'];



let productsUrl  = productMap.this.countrycode;


let newproductsUrl = productsUrl[0];

        // this.array2 = this.servicedata2[0];
        // this.menuurl =  this.array2.productMap != null ? this.array2.productMap.IN : '';
        // console.log('navigation url',this.menuurl);
      });
    });
  }

  getsettingdata() {
     this.globalService.getDashboard().subscribe(dash => {
       //console.log('get dashboard',dash);
       this.servicedata = dash['countryList']; 
  
      this.language = dash['language'];
     this.countries = dash['countryList'];
   
           this.settingcountry = this.settingdataCountry;
   
   
           this.settingcountrynew = this.countries.filter(res => {
             return res.countryName == this.settingcountry;
           });
   
           this.countryId = this.settingcountrynew[0].countryId;
          // console.log('country id is',this.countryId);
           this.globalService.getDashboardByid(this.countryId).subscribe(bycountryid => {
               //this.spinner.hide();
   
               this.newdataofsetting = bycountryid["countryList"];
   
               this.dafaultcnamesetting = this.newdataofsetting.filter(res => {
                 return res.defaultCountry == true;
               });
   
               // this.bresponse = this.dafaultcnamesetting[0].branchResponse;
               // console.log('this is branch of that country',this.bresponse);
               
  let productMap = this.dafaultcnamesetting[0].productMap;

  

  if(productMap != null){
    this.nomenuWillshow = true;

  }else{

    this.nomenuWillshow = false;

  }
   
             });
         
       });
     }
     
     gotmyflight(){
      let countryCode = localStorage.getItem('countryCode').toLowerCase();
      let setLanguageSetting = 'en';
      this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
      this.flightservice.clearTnc();
     }
     gotohotel(){
      this.router.navigate(['/page-not-found'])

     }
      gotoholiday(){
        window.open(this.holidaysurl)

      }
    gotoactivities(){
      // let Newactvityurl = 'https://travelwings.tripadmit.com/'
     window.open(this.activitiesurl)
    //  window.open(Newactvityurl)
    }
    gotooffers(){
      window.open(this.offersurl)

    }
    gotocruise(){
      window.open(this.cruisesurl)

    }

  searchWidget(x){
   
    this.router.navigate([x.link]);
  }
}
