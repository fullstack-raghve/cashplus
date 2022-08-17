import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from "@angular/core";
import { IonicSelectableComponent } from "ionic-selectable";
import { MatBottomSheet, MatSnackBar } from "@angular/material";
import { OriginListModalComponent } from "../origin-list-modal/origin-list-modal.component";
import { DestinationListModalComponent } from "../destination-list-modal/destination-list-modal.component";
import { SelectTravellerComponent } from "../select-traveller/select-traveller.component";
import { CalenderComponent } from "../calender/calender.component";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { Subscription } from "rxjs";
import { OriginDestinationService } from "src/app/services/origin-destination.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { GlobalService } from "src/app/services/global.service";
import { Router, NavigationEnd } from "@angular/router";
import { FlightService } from "src/app/services/flight.service";
import { OnewaycalenderComponent } from "../onewaycalender/onewaycalender.component";
import * as moment from "moment";
import { ConnectionService } from 'ng-connection-service';
import { SafeResourceUrl } from '@angular/platform-browser';
import * as $ from 'jquery';
// import { Select } from '@ionic/angular';
// import { Events } from '@ionic/angular';
// import { IonSelect } from '@ionic/angular';

class Economy {
  public economyId: number;
  public economyType: string;
}

@Component({
  selector: "app-oneway",
  templateUrl: "./oneway.component.html",
  styleUrls: ["./oneway.component.scss"],

})
export class OnewayComponent implements OnInit, OnDestroy {
  @Input() widgetBannerOneway: SafeResourceUrl | boolean;
  total_traveller: any;
  flightForm: FormGroup;
  origindata: Subscription;
  originName: any;
  detinationdata: Subscription;
  destinationName: any;
  xy: any[];
  vv: any;
  language = 'en'
  // Way2
  public finalo: any;

  returnwayorigin: any;
  returnwayDestination: any;
  onewayorigindata: Subscription;
  onewaydetinationdata: Subscription;
  totalTraveller;
  econamyId;
  public start: Date = new Date();
  public end: Date = new Date();
  airPortName: any;
  OriginAirportCode: any;
  destinationiArportCode: any;
  economies: Economy[];
  economy: any;
  economy1: any;
  addReturningDate: any;
  subscriptiondata: Subscription;
  fulldatefromcalender: any;
  departDate: any;
  returnDate: any;
  subscription: Subscription;
  airportList = [];
  onewayoriginName: any;
  onewaydestinationName: any;
  DestinationairportName;
  DestinationairportCode;
  DestinationcountryIdValue;
  OriginairportName;
  OriginairportCode;
  OrigincountryIdValue;
  citys: Object;
  servicedatas: Subscription;
  finald: any;
  finaldest: any;
  finalorigin: any;
  reqdepartdate: string;
  data: any;
  selctedcabinclass: number;
  odddatas: any;
  footerYear = new Date().getFullYear();
  getCountryId = Number(localStorage.getItem("countryId"));
  getCountryGroupId = Number(localStorage.getItem("groupId"));
  branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
  adult: any;
  child: any;
  infant: any;
  travellers: string;
  countryId: string;
  originlist: any;
  destinationlist: any;
  originlistfinal: any;
  destlistfinal: any;
  flagOriginOneway: any;
  flagDestinationOneway: any;
  // @ViewChild('countryList') countrySelectRef: IonSelect;
  // @ViewChild('countryList') selectRef: Select;
  status = 'ONLINE';
  isConnected = true;
  OriginAirportCityName: string;
  DestinationAirportCityName: string;
  countryCode: string;
  Localstoragevalues={};
  constructor(
    private bottomSheet: MatBottomSheet,
    private connectionService: ConnectionService,
    private sendTravelerData: SendTravllerDataService,
    private originDestinationService: OriginDestinationService,
    private _snackBar: MatSnackBar,
    private globalService: GlobalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private ref: ChangeDetectorRef
  ) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        // //console.log(this.status);
        // this.dialog.alert('network was Disconnected:-()');
        let snackBarRef1 = this._snackBar.open("You are in ONLINE", "", {
          duration: 1000
        });
      }
      else {
        this.status = "OFFLINE";
        // alert("You are in OFFLINE")
        // //console.log(this.status);
        // this.dialog.alert('network was Disconnected:-()');
        let snackBarRef1 = this._snackBar.open("You are in OFFLINE", "", {
          duration: 1000
        });
      }
    })

    this.economies = [
      { economyId: 1, economyType: 'Cabin Class' },
      { economyId: 2, economyType: 'Economy' },
      { economyId: 3, economyType: 'Premium Economy' },
      { economyId: 4, economyType: 'Business Class' },
      { economyId: 5, economyType: 'First Class' },
    ];
    this.createForm();

    this.countryId = localStorage.getItem('countryId')
    // //console.log('country id is' + this.countryId)
    // this.travllerdata();

    this.travellers = null;
  ///////////////
  let OriginDataDetails = localStorage.getItem("OriginDataDetails");
 
  let val,val1;
  if(OriginDataDetails != null)
   val=JSON.parse(OriginDataDetails);
  let DestinationDataDetails = localStorage.getItem("DestinationDataDetails");

  if(DestinationDataDetails != null)
    val1=JSON.parse(DestinationDataDetails);
  
 // let origin,destination,OriginairportName,DestinationairportName;
  if(val){
    this.originName = [];
        this.originName.airportCode= val[0].airportCode;
        this.returnwayorigin = this.originName.airportCode;
        this.originName.airportName = val[0].airportName
        
        this.flightForm.patchValue({
          returnwayOrigin: this.returnwayorigin
        });
        this.flagOriginOneway = 2;
  }
  else
   this.flagOriginOneway = 1;
  if(val1){
    this.destinationName = [];
    this.destinationName.airportCode = val1[0].airportCode;
    this.returnwayDestination = this.destinationName.airportCode;
    this.flightForm.patchValue({
      returnwaydestination: this.returnwayDestination
    });
    this.flagDestinationOneway = 2;
    this.destinationName.airportName =val1[0].airportName;
   
  }
   else
    this.flagDestinationOneway = 1;
  ////////////////
  }
  public search = {
    oneway: []
  };
  ngOnInit() {
    this.getRouterDetails();
    this.ref.detectChanges();
   
    localStorage.removeItem('serviceVendor');
    localStorage.removeItem('BOOKRN');
    localStorage.removeItem('returnwaydepartDate');
    localStorage.removeItem('returnwayreturnDate');
    localStorage.removeItem('tripType');
    localStorage.removeItem('tripround');

    sessionStorage.removeItem('serviceVendor');
    //localStorage.removeItem('BOOKRN');
    sessionStorage.removeItem('returnwaydepartDate');
    sessionStorage.removeItem('returnwayreturnDate');
    sessionStorage.removeItem('tripType');
    sessionStorage.removeItem('tripround');

    // this.flagOriginOneway = 1;
    // this.flagDestinationOneway = 1;
    this.popularcity();
    /////load methods


    localStorage.removeItem('tripType');
    sessionStorage.removeItem('tripType');


    let localData = JSON.parse(localStorage.getItem("resultSearchOneWay"));
    localStorage.setItem("resultSearchOneWay", JSON.stringify(this.search));
    sessionStorage.setItem("resultSearchOneWay", JSON.stringify(this.search));

    ////console.log(localData)
    if (localData != null) {
      let allsearch = localData["oneway"].length != 0 ? localData : this.search;
      localStorage.setItem("resultSearchOneWay", JSON.stringify(allsearch));
      sessionStorage.setItem("resultSearchOneWay", JSON.stringify(allsearch));

    }

    let DataForTravellers = localStorage.getItem("DataForTravellers");
    let val = JSON.parse(DataForTravellers);
  
    if (val) {
      this.allAdult = val.adult;
      this.allChild = val.children;
      this.allInfant = val.infants;
      this.total_traveller = val.adult + val.children + val.infants;
    }
    else {
      this.allAdult = 1;
      this.allChild = 0;
      this.allInfant = 0;
      this.total_traveller = 1;
    }
    
    
    this.selectedClass();
       this.calenderdata();



    // this.getAllTravellerDate();
    //this.total_traveller = 1;
    //this.getpocityfromHome();

    // this.getorigin();
    // this.getdest();
// setTimeout(() => {
//   this.autoopen();

// }, 500);
  }


  // displayCountry1() {
  // this.selectRef.open();
  // alert('clciked open');
  // }
  // displayCountry2(){
  // this.selectRef.cls();
  // alert('clciked open');
  // }

  ngOnDestroy(): void {
    this.subscriptiondata.unsubscribe();
    this.servicedatas.unsubscribe();
    //this.getTravellerDateCount.unsubscribe();
    this.routerEvent.unsubscribe();
  }



  // getpocityfromHome(){
  // this.originDestinationService.getpopcity().subscribe((res)=>{
  // //console.log(res);
  // this.originlist = res['cityAndAirportDataList'][0];
  // this.destinationlist = res['cityAndAirportDataList'][1]

  // //console.log(this.originlist);
  // //console.log(this.destinationlist);

  // })
  // }



  popularcity() {
    this.servicedatas = this.globalService.getpopularcity(this.countryId).subscribe((popcity) => {
      // this.servicedatas = this.originDestinationService.getpopcity().subscribe((popcity)=>{

     

      if (popcity['statusMessage'] == 'success') {

        this.citys = popcity;
        this.sendPopularCityList(popcity)
        let citynew = popcity['cityAndAirportDataList'];
        this.originlistfinal = citynew[1];
        this.destlistfinal = citynew[2];

       
        //  this.originName = this.originlistfinal;
        //  this.destinationName = this.destlistfinal;

        //  this.flightForm.patchValue({
        //  returnwayOrigin: this.originlistfinal.airportCode
        //  });

        //  this.flightForm.patchValue({
        //  returnwaydestination: this.destlistfinal.airportCode
        //  });

      } else {
        this.sendPopularCityList({
          'popularCityRes':false
        })
      }



    }, (err)=>{
      this.sendPopularCityList({
        'popularCityRes':false
      })
    });
  }
  sendPopularCityList(data) {
    this.originDestinationService.sendpopcity(data);
  }
  //  private apidataorigin = {
  //  airportId: 2,
  //  airportCode: "DXB",
  //  airportName: "Dubai International Airport"
  //  };

  //  private apidataDestination = {
  //  airportId: 3,
  //  airportCode: "SIN",
  //  airportName: "Singapore Changi Airport"
  //  };

  openSnackBar() {
    //
  }
  public departingDate;

  OriginDetails = [];
  destDetails = [];
  getorigin() {
    this.OriginDetails = [];
    this.originDestinationService.getOrigin().subscribe((res) => {
      
      if (res) {
        this.originName = res;
        this.returnwayorigin = this.originName.airportCode;
        
        this.flightForm.patchValue({
          returnwayOrigin: this.returnwayorigin
        });
        this.flagOriginOneway = 2;
      }
    })
  }
  getdest() {
    this.destDetails = [];
    this.originDestinationService.getDestination().subscribe((res) => {
     
      if (res) {
        this.destinationName = res;
        this.returnwayDestination = this.destinationName.airportCode;
        this.flightForm.patchValue({
          returnwaydestination: this.returnwayDestination
        });
        this.flagDestinationOneway = 2;
      }      
    })
  }

  openOriginList(event) {
    // const bottomSheetRef = bottomSheet.open(HobbitSheet, {
    // data: { names: ['Frodo', 'Bilbo'] },
    // });
    this.OriginDetails = [];
    this.bottomSheet.open(OriginListModalComponent, {
      data: '',
      "backdropClass": 'calender-backdrop',
      "panelClass": 'origin_destination'
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      if (res != undefined) {
        
        this.originName = res["data"];
        this.returnwayorigin = this.originName.airportCode;
        this.flightForm.patchValue({
          returnwayOrigin: this.returnwayorigin
        });
        this.flagOriginOneway = 2;
        let obj={
          airportCode :this.returnwayorigin,
          airportName :this.originName.airportName
        }
        //console.log(obj)
        this.OriginDetails.push(obj);
       
        localStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));
        sessionStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));

        //console.log("Origin city name:"+this.originName.cityName)

     
      //--------------For multiciy url
      let ctnames = localStorage.getItem("cityDetails");       
      let ctdetail = JSON.parse(ctnames);
      //console.log("citynames:"+ ctdetail);
      let citynames = {
        Origin :  this.originName.cityName ? this.originName.cityName :(ctdetail && ctdetail['Origin'] ? ctdetail['Origin']:''),
        Destination :ctdetail && ctdetail['Destination']?ctdetail['Destination']:''
      }
      //console.log(citynames);
      localStorage.setItem("cityDetails",JSON.stringify(citynames));
      sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

        //---------------
      }

    });

    this.globalService.sendapiOrigin(this.citys);
  

    if (this.router.url == '/') {
      // this.bottomSheet.dismiss();
    }

  }

  openDestinationList(event) {
    this.destDetails = [];
    this.bottomSheet.open(
      DestinationListModalComponent, {
      data: '',
      "backdropClass": 'calender-backdrop',
      "panelClass": 'origin_destination'
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      if (res != undefined) {
        
        this.destinationName = res["data"];
        this.returnwayDestination = this.destinationName.airportCode;
        this.flightForm.patchValue({
          returnwaydestination: this.returnwayDestination
        });
        this.flagDestinationOneway = 2;
        let obj={
          airportCode :this.destinationName.airportCode,
          airportName :this.destinationName.airportName
        }
        this.destDetails.push(obj);
      
        localStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));
        sessionStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));

       // //console.log("destinationName city name:"+this.destinationName.cityName)
       
        //--------------For multiciy url
        let ctnames = localStorage.getItem("cityDetails");        
        let ctdetail = JSON.parse(ctnames);
        //console.log("citynames:"+ ctdetail);
        let citynames = {
          Origin : ctdetail && ctdetail['Origin'] ? ctdetail['Origin']:'',
          Destination : this.destinationName.cityName ? this.destinationName.cityName :(ctdetail && ctdetail['Destination']?ctdetail['Destination']:'')
        }
        ////console.log(citynames);
        localStorage.setItem("cityDetails",JSON.stringify(citynames));
        sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

          //---------------

      }
    });

    if (this.router.url == '/') {
      // this.bottomSheet.dismiss();
    }


    // this.bottomSheet.open(DestinationListModalComponent);
    // this.globalService.sendapidest(this.citys);
    ////console.log(this.citys)
  }
  getSessionDestinationValue() {
    this.DestinationairportName = localStorage.getItem(
      "Destination Airport Name"
    );
    this.DestinationairportCode = localStorage.getItem(
      "Destination Airport Code"
    );
    this.DestinationcountryIdValue = localStorage.getItem(
      "Destination countryID"
    );
  }
  getSessionOriginValue() {
    this.OriginairportName = localStorage.getItem("Origin Airport Name");
    this.OriginairportCode = localStorage.getItem("Origin Airport Code");
    this.OrigincountryIdValue = localStorage.getItem("Origin countryID");
  }
  econamyChange(event) {
    this.economy = event;
    this.economy1 = this.economy;
  }
  econamyChange1(event) {
    this.economy1 = event;
  }

  swipe() {
    this.destDetails = [];
    this.OriginDetails = [];

    const temp = this.originName;
    this.originName = this.destinationName;
    this.destinationName = temp;
    
    this.flightForm.patchValue({
      returnwayOrigin: this.originName["airportCode"]
    });
    this.flightForm.patchValue({
      returnwaydestination: this.destinationName["airportCode"]
    });
    let obj={
      airportCode :this.originName["airportCode"],
      airportName :this.originName["airportName"] 
    }
    this.OriginDetails.push(obj);
    localStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));
    sessionStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));

    let obj1={
      airportCode :this.destinationName["airportCode"],
      airportName :this.destinationName["airportName"] 
    }
    this.destDetails.push(obj1);
    localStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));
    sessionStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));

     //------for multicity url
     let ctnames = localStorage.getItem("cityDetails"); 
     let ctdetail = JSON.parse(ctnames);     
     //console.log(ctdetail);
      if(ctdetail != null)
      {
           let tp;
           tp = ctdetail['Origin'];
           ctdetail['Origin'] =  ctdetail['Destination'];
           ctdetail['Destination'] = tp;

          let citynames = {
            Origin :   ctdetail['Origin'] ?  ctdetail['Origin'] :'',
            Destination :  ctdetail['Destination']?   ctdetail['Destination']:''
          }
         ////console.log(citynames);
         localStorage.setItem("cityDetails",JSON.stringify(citynames));
         sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

    }
      //-------------------

  }
  somethingChanged(ev) {
    var x = document.getElementsByClassName("e-apply");
    var spliceText = ev.text;
    this.departingDate = spliceText.slice(0, 9);
    this.addReturningDate = spliceText.slice(12, 21);
  }
  // openTraveler() {
  // let treVellerCount = {
  // adult: this.sendAdultCount,
  // child: this.sendChildCount,
  // infant: this.sendInfantCount
  // };
  // this.bottomSheet.open(SelectTravellerComponent, {
  // data: this.isDataTrue == true ? treVellerCount : ""
  // });
  // }
  openTraveler() {
    let treVellerCount = {
      adult: this.sendAdultCount ? this.sendAdultCount : 1,
      child: this.sendChildCount ? this.sendChildCount : 0,
      infant: this.sendInfantCount ? this.sendInfantCount : 0,
      type: 'oneway'
    };
    // data: this.isDataTrue == true ? treVellerCount : ""
    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(SelectTravellerComponent, {
      data: treVellerCount
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      if (res) {
        this.getAllTravellerDate();
      }
    });
    if (this.router.url == '/') {
      // this.bottomSheet.dismiss();
    }

  }
//  autoopen(){
//    this.openCl();
//  }

  openCl() {
    let sendDates = {
      departure: moment(this.flightForm.get('returnwaydepartDate').value, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    };
    // this.globalService.sendMultidate("");

    this.bottomSheet.open(OnewaycalenderComponent, {
      data: this.isDataTrue == true ? sendDates : "",
      "backdropClass": 'calender-backdrop',
      "panelClass":'city_panel_calender',
    });

    if (this.router.url == '/') {
      // this.bottomSheet.dismiss();
    }

  }

  // travllerdata() {
  // this.subscription = this.sendTravelerData.getmsg().subscribe(data => {
  // this.total_traveller = data.text;
  // //console.log(this.total_traveller);
  // this.flightForm.patchValue({
  // travellerfield: this.total_traveller,
  // returnwaydepartDate: this.departDate,
  // returnwayreturnDate: this.returnDate
  // });

  // ////console.log(this.flightForm.value)
  // });
  // }




  //  destinationData() {
  //  this.destinationName = this.apidataDestination;
  //  this.returnwayDestination = this.apidataDestination.airportCode;
  //  this.flightForm.patchValue({
  //  returnwaydestination: this.returnwayDestination
  //  });

  //  }

  //  originData() {
  //  this.originName = this.apidataorigin;
  //  this.returnwayorigin = this.apidataorigin.airportCode;
  //  this.flightForm.patchValue({
  //  returnwayOrigin: this.returnwayorigin
  //  });

  //  }

  createForm() {
    this.flightForm = this.formBuilder.group({
      returnwayOrigin: ["", Validators.required],
      returnwaydestination: ["", Validators.required],
      returnwaydepartDate: ["", Validators.required],
      economy: ["", Validators.required],
      travellerfield: ["", Validators.required],
      myeconomyonward: ["", Validators.required]
    });
  }
  loadAirport() {
    this.globalService.getOrigin().subscribe(fdata => {
      // //console.log(fdata);
      this.airportList = fdata["airportList"];
    });
    this.xy = this.airportList.filter(it => it.airportName.includes("ae"));
    // //console.log(this.xy);
  }

  calenderdata() {
    
    let calData = localStorage.getItem("DateForAll");
    if (calData) {
      this.departDate = new Date(calData);
      this.reqdepartdate = this.convertdepart(this.departDate);
      this.flightForm.patchValue({
        returnwaydepartDate: this.reqdepartdate
      });
    }

    this.subscriptiondata = this.sendTravelerData
      .getonewaycalenderdata()
      .subscribe(data2 => {
        ////console.log(data2);
        if(data2 == undefined)
         return;
        this.fulldatefromcalender = data2.text2;
        this.departDate = this.fulldatefromcalender;
        //this.returnDate = this.fulldatefromcalender[1]
        this.reqdepartdate = this.convertdepart(this.departDate);

        // //console.log(this.reqdepartdate);
        this.flightForm.patchValue({
          returnwaydepartDate: this.reqdepartdate
          //returnwayreturnDate: this.fulldatefromcalender[1]
        });
        // //console.log(this.fulldatefromcalender);
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


  gettravller() {
    this.sendTravelerData.gettravller().subscribe(res => {
     
      var y = res["trvllerfield"];
   
      this.adult = y.adult;
      this.child = y.child;
      this.infant = y.infant;
      // var x: Object = res["trvllerfield"];
      // //console.log(x);
    

      // this.var = res["adult"];
      // //console.log(this.var);
    });
  }



  onewayFlight() {
this.flightService.sendCardSate(true);
    
    let idx: any = 0
    localStorage.setItem('sortedBy', 'PriceLH');
    localStorage.setItem('currentindex', idx);

    sessionStorage.setItem('sortedBy', 'PriceLH');
    sessionStorage.setItem('currentindex', idx);
    
    sessionStorage.removeItem('booking-type');
    sessionStorage.removeItem("affilatePartnerId");
    localStorage.removeItem("BOOKRN");
    localStorage.removeItem('bookingURL');
     localStorage.removeItem('UMOpaxinfoinfant');
     localStorage.removeItem('UMOonwrdate');
      localStorage.removeItem('UMOcabinclass');
      localStorage.removeItem('UMOcabinclassreturn');
      localStorage.removeItem('UMOpaxinfo');
    localStorage.removeItem('UMOpaxinfochild');

    localStorage.setItem('returnwaydepartDate', this.flightForm.get("returnwaydepartDate").value);
    sessionStorage.setItem('returnwaydepartDate', this.flightForm.get("returnwaydepartDate").value);

    this.OriginAirportCityName = localStorage.getItem("OriginAirportCityName");
    this.DestinationAirportCityName = localStorage.getItem("DestinationAirportCityName");
   let countryCodee = localStorage.getItem('countryCode');
   this.countryCode = countryCodee && countryCodee.toLowerCase();
   this.flightService.sendpagerefresh('noRefresh');
    let field = {
      adult: this.allAdult,
      children: this.allChild,
      infants: this.allInfant,
      // type: this.data.type
    };
    this.sendTravelerData.sendtravllers(field);
    //console.log('this data we are sending to travller page',field);
    // this.triptype = localStorage.getItem('tripType');
    localStorage.setItem('tripType', 'oneway');
    localStorage.setItem('sortbyprice', 'true');
    sessionStorage.setItem('tripType', 'oneway');

    sessionStorage.setItem('TripType', 'Oneway');
    sessionStorage.setItem('sortbyprice', 'true');

    
    let localData = JSON.parse(localStorage.getItem("resultSearchOneWay"));
 
    localStorage.setItem("resultSearchOneWay", JSON.stringify(this.search));
    sessionStorage.setItem("resultSearchOneWay", JSON.stringify(this.search));

    if (localData != null) {
      let allsearch =
        localData["oneway"].length != 0 ? localData : this.search;
     
      localStorage.setItem("resultSearchOneWay", JSON.stringify(allsearch));
      sessionStorage.setItem("resultSearchOneWay", JSON.stringify(allsearch));

    }
    let onewaydata = this.flightForm.value;
    var flagOriginOneway = this.flightForm.get("returnwayOrigin").value;
    var flagDestinationOneway = this.flightForm.get("returnwaydestination").value;
    var mydeparting = this.flightForm.get("returnwaydepartDate").value;
     if (this.flagOriginOneway == 1) {
      // alert("empty");
      let snackBarRef1 = this._snackBar.open("Please Select Your Origin", "", {
        duration: 1000
      });
    } else if (this.flagDestinationOneway == 1) {
      let snackBarRef1 = this._snackBar.open("Please Select Your Destination", "", {
        duration: 1000
      });
    }
     else if (flagOriginOneway == flagDestinationOneway) {
      let snackBarRef11 = this._snackBar.open(
        "Origin and Destination can't be same",
        "",
        {
          duration: 1000
        }
      );
      // setTimeout(() => {
      // this.bottomSheet.open(DestinationListModalComponent);
      // }, 1100);
    }
     else if (mydeparting == "") {
      //alert('undefined');
      let snackBarRef1 = this._snackBar.open(
        "Please Select Departing Date",
        "",
        {
          duration: 1000
        }
      );
    } else if (mydeparting != null && flagOriginOneway != null && flagDestinationOneway != null) {
      // alert('done;');

      ///////////////////////////////////////////////////// validation code end////

     
      var myData = this.flightForm.value;
      this.odddatas = this.flightForm.value;
      this.finalorigin = myData.returnwayOrigin;
      this.finaldest = myData.returnwaydestination;

      var onwayorigin = this.finalorigin;
      var onwaydestination = this.finaldest;
////console.log("flight forms oneway values",this.flightForm.value)
//this.flightForm.get("myeconomyonward").value
////console.log("cabin class",this.flightForm.get("myeconomyonward").value)

////make cabin class dynmic
if (this.flightForm.get("myeconomyonward").value == "Economy") {
         
  this.selctedcabinclass = 1;
} else if (this.flightForm.get("myeconomyonward").value == "Premium Economy") {
   
  this.selctedcabinclass = 2;
} else if (this.flightForm.get("myeconomyonward").value == "Business Class") {
   
  this.selctedcabinclass = 3;
} else if (this.flightForm.get("myeconomyonward").value == "First Class") {
   
  this.selctedcabinclass = 4;
} else {
}

 
    //-----------------WebEngage-----------------------------------------

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/js/webEngage.js";
    s.id = '_webengage_script_tag';
    $("head").append(s);
    // webengage.track('Search-Flight', {
    //      "Type"   : "oneway",
    //      "Origin Airport"     : 'Del',
    //      "Origin Name"       : 'Delhi',
    //      "Destination Airport" : 'Bom',
    //      "Destination Name" : 'Bombay',
    //      "Departing Date"   : new Date("2021-01-22T00:00:00.000Z"),
    //      "Depating Flight Class" : "e",
    //      "No of Adults"     : 1+"Adult",
    //      "No of Children"   : 1+"Child",
    //      "No of Infants"     : 1+"Infant",
    //      "Aliance Airlines" : "",
    //      "Prefered Airlines" : "",
    //   });
    
      webengage.track('Search-Flight', {
        "Type"                  : "oneway",
        "Origin Airport"        : this.originName.airportName,
        "Origin Name"           : onwayorigin,
        "Destination Airport"   : this.destinationName.airportName,
        "Destination Name"      : onwaydestination,
        "Departing Date"        : this.flightForm.get("returnwaydepartDate").value + "T00:00:00.000Z",
        "Depating Flight Class" : this.flightForm.get("myeconomyonward").value,
        "No of Adults"          : this.allAdult ? this.allAdult : 1+"Adult",
        "No of Children"        : this.allChild ? this.allChild : 0+"Child",
        "No of Infants"         : this.allInfant ? this.allInfant : 0+"Infant",
        "Aliance Airlines"      : "",
        "Prefered Airlines"     : "",
     });

   //----------------------------------------------------------------

      var reqbody = {
        currencyCode: this.branchCurrencyCode,

        flightSearchWidgetList: [
          {
            origin: onwayorigin,
            destination: onwaydestination,
            cabinClass: this.selctedcabinclass ? this.selctedcabinclass : 1,
            onwardJourneyDate: this.flightForm.get("returnwaydepartDate").value,
          }
        ],
        noOfAdult: this.allAdult ? this.allAdult : 1,
        noOfChild: this.allChild ? this.allChild : 0,
        noOfInfant: this.allInfant ? this.allInfant : 0,
        tripType: "oneway",
        groupId: this.getCountryGroupId,
        countryId: this.getCountryId
      };

      let allSearchData = {};
      allSearchData["flightSearch"] = reqbody["flightSearchWidgetList"][0];
      allSearchData["adult"] = reqbody["noOfAdult"];
      allSearchData["child"] = reqbody["noOfChild"];
      allSearchData["infants"] = reqbody["noOfInfant"];
      allSearchData["originAirportName"] = this.originName.airportName;
      allSearchData["destinationAirportName"] = this.destinationName.airportName;
//////send travlerr data in case aff >> 4march-start
// let field = {
//   adult: this.allAdult ? this.allAdult : 1,
//   children: this.allChild ? this.allChild : 0,
//   infants: this.allInfant ? this.allInfant : 0,
//   type: this.data.type
// };
// this.sendTravelerData.sendTravellerCountdate(field);



/////4march-end
    
      this.sendRequestBody = allSearchData;

      this.SaveDataToLocalStorage();
      var myreturning = this.flightForm.get("returnwaydepartDate").value;
      this.sendReturnDate(myreturning);
      this.flightService.getflights(reqbody).subscribe(res => {
        //console.log(res);
        let sendDataToSerachComponent = {
          'response': res,
          'reqbody': reqbody
        };
        
        ///sending API data to search result component
        this.flightService.sendonewaydata(sendDataToSerachComponent);
       
        
      });
      ///sending filled data to search result component
      this.flightService.sendflightformdata(myData);

      //send origin /dest in another comp for fareconfirm api
      //console.log('odddatas>>>>',this.odddatas);
      this.flightService.sendoddata(this.odddatas);

      //this.router.navigate(["/searchresult"]);

      let ctnames = localStorage.getItem("cityDetails");       
      let ctdetail = JSON.parse(ctnames);
      //console.log("citynames:"+ JSON.stringify(ctdetail));

      this.OriginAirportCityName = ctdetail['Origin']; 
      this.DestinationAirportCityName = ctdetail['Destination'];

      localStorage.setItem("OriginAirportCityName", this.OriginAirportCityName);
      localStorage.setItem("DestinationAirportCityName", this.DestinationAirportCityName);
 
      sessionStorage.setItem("OriginAirportCityName", this.OriginAirportCityName);
      sessionStorage.setItem("DestinationAirportCityName", this.DestinationAirportCityName);
 
     // //console.log("Final City Names:"+ this.OriginAirportCityName +":"+ this.DestinationAirportCityName);

      this.OriginAirportCityName =  this.OriginAirportCityName.replace(/\s/g, '-');
      this.DestinationAirportCityName =  this.DestinationAirportCityName.replace(/\s/g, '-');    
      this.router.navigate( [this.countryCode+'/'+this.language+'/'+'cheap-flights/'+'search/'+  this.OriginAirportCityName +'-to-'+ this.DestinationAirportCityName +'/'+this.finalorigin+'-'+this.finaldest+'/Oneway']);
      ////////////////////////////////////////////////////////
    }

  }
  getTravellerDateCount: Subscription;
  allInfant;
  allChild;
  allAdult;
  getAllTravellerDate() {
    this.getTravellerDateCount = this.sendTravelerData.getTravellerCount.subscribe(
      res => {
        if (res) {
        
          this.travellers = res;
          this.allAdult = res["adult"];
          this.allChild = res["children"];
          this.allInfant = res["infants"];
          this.total_traveller = res["adult"] + res["children"] + res["infants"]
          //////////////SEND THESE DATA ON OPEN
          this.sendAdultCount = this.allAdult;
          this.sendChildCount = this.allChild;
          this.sendInfantCount = this.allInfant;
        }
      }
    );
  }
  selectedClass() {
    let EconomyData = localStorage.getItem("EconomyData");
    let DataEconomyData,ccData;
    if(EconomyData)
    {
      DataEconomyData = JSON.parse(EconomyData);
        ccData = DataEconomyData[0];
    }   
    else
        ccData = "Economy";
     
    ////console.log("Local storage Economy:"+ccData);

    this.flightForm.get("myeconomyonward").patchValue(ccData);
    this.flightForm.controls["myeconomyonward"].valueChanges.subscribe(data => {

      this.data = data;
      if (this.data === "Economy") {
         
        this.selctedcabinclass = 1;
      } else if (this.data === "Premium Economy") {
         
        this.selctedcabinclass = 2;
      } else if (this.data === "Business Class") {
         
        this.selctedcabinclass = 3;
      } else if (this.data === "First Class") {
         
        this.selctedcabinclass = 4;
      } else {
      }
      var obj=[this.data,this.selctedcabinclass];
     // //console.log(obj);
      localStorage.setItem("EconomyData" ,JSON.stringify(obj));
      sessionStorage.setItem("EconomyData" ,JSON.stringify(obj));

    });


  }
  sendRequestBody;

  SaveDataToLocalStorage() {
    let restoreSearchData = JSON.parse(localStorage.getItem("resultSearchOneWay"));
    //console.log(restoreSearchData)
    //console.log(this.sendRequestBody);
    let ctnames = localStorage.getItem("cityDetails");
    let ctdetail;
    if(ctnames) 
      ctdetail = JSON.parse(ctnames);     
    //console.log(ctdetail);
    this.Localstoragevalues = {};
    this.Localstoragevalues["flightSearch"] = this.sendRequestBody["flightSearch"];
    this.Localstoragevalues["adult"] = this.sendRequestBody["adult"];
    this.Localstoragevalues["child"] = this.sendRequestBody["child"];
    this.Localstoragevalues["infants"] = this.sendRequestBody["infants"];
    this.Localstoragevalues["originAirportName"] = this.originName.airportName;
    this.Localstoragevalues["destinationAirportName"] = this.destinationName.airportName;
    this.Localstoragevalues["OriginCityName"] =  ctdetail['Origin'] ;
    this.Localstoragevalues["destinationCityName"] = ctdetail['Destination'];
    //console.log(this.Localstoragevalues);
    if (restoreSearchData) {
      if (restoreSearchData["oneway"].length != 0) {
        //console.log(restoreSearchData["oneway"]);
        for (var i = 0; i < restoreSearchData["oneway"].length; i++) {
          if (JSON.stringify(restoreSearchData["oneway"][i]) === JSON.stringify(this.Localstoragevalues))
           {
            //  restoreSearchData["oneway"].splice(i, 1);
            //  restoreSearchData["oneway"].unshift(restoreSearchData["oneway"][i]);
            //  restoreSearchData["oneway"].push(...restoreSearchData["oneway"].splice(0, i));
            // //console.log(restoreSearchData["oneway"]);
            return;
           } 
        }
      }
      if (restoreSearchData["oneway"].length < 3) {
        ////console.log(restoreSearchData["oneway"]);
        restoreSearchData.oneway.push(this.Localstoragevalues);
        localStorage.setItem("resultSearchOneWay", JSON.stringify(restoreSearchData));
        sessionStorage.setItem("resultSearchOneWay", JSON.stringify(restoreSearchData));

      }
      else {
        //console.log(restoreSearchData["oneway"]);
        for (var i = 1; i < restoreSearchData["oneway"].length; i++) {
          restoreSearchData["oneway"][i - 1] = restoreSearchData["oneway"][i];
        }
        restoreSearchData["oneway"][restoreSearchData["oneway"].length - 1] = this.Localstoragevalues;
        //console.log(restoreSearchData["oneway"]);
        localStorage.setItem("resultSearchOneWay", JSON.stringify(restoreSearchData));
        sessionStorage.setItem("resultSearchOneWay", JSON.stringify(restoreSearchData));

      }
    }
  }
  sendAdultCount;
  sendChildCount;
  sendInfantCount;
  isDataTrue = false;
  getSearchData(data) {
    if (data) {
      this.isDataTrue = true;
    }

  
    let totalNumberTravellet = data["adult"] + data["infants"] + data["child"];
    this.total_traveller = totalNumberTravellet;

    this.sendAdultCount = data["adult"];
    this.sendChildCount = data["child"];
    this.sendInfantCount = data["infants"];

    this.allAdult = data["adult"];
    this.allChild = data["child"];
    this.allInfant = data["infants"];
    this.departDate = new Date(moment(data["flightSearch"]["onwardJourneyDate"], 'DD-MM-YYYY').format('YYYY-MM-DD'));
    this.returnDate = new Date(moment(data["flightSearch"]["returnJourneyDate"], 'DD-MM-YYYY').format('YYYY-MM-DD'));
    this.originName = [];  // --------------
    this.originName.airportCode = data["flightSearch"]["origin"];
    this.destinationName = []; // --------------
    this.destinationName.airportCode = data["flightSearch"]["destination"];

    this.originName.airportName = data["originAirportName"];
    this.destinationName.airportName = data["destinationAirportName"];

    this.flightForm.patchValue({
      returnwayOrigin: data["flightSearch"]["origin"],
      returnwaydestination: data["flightSearch"]["destination"],
      travellerfield: this.total_traveller,
      returnwaydepartDate: data["flightSearch"]["onwardJourneyDate"],
      returnwayreturnDate: data["flightSearch"]["returnJourneyDate"],
    });
    if (data["flightSearch"]["cabinClass"])
      if (data["flightSearch"]["cabinClass"] == 1) {
         
        this.selctedcabinclass = 1;
        this.flightForm.get("myeconomyonward").patchValue("Economy");
      } else if (data["flightSearch"]["cabinClass"] == 2) {
         
        this.selctedcabinclass = 2;
        this.flightForm.get("myeconomyonward").patchValue("Premium Economy");
      } else if (data["flightSearch"]["cabinClass"] == 3) {
         
        this.selctedcabinclass = 3;
        this.flightForm.get("myeconomyonward").patchValue("Business Class");
      } else if (data["flightSearch"]["cabinClass"] == 4) {
         
        this.selctedcabinclass = 4;
        this.flightForm.get("myeconomyonward").patchValue("First Class");
      }

    // //console.log(this.flightForm);
    setTimeout(()=>{ 
      this.onewayFlight();
  },500);
   
    //  //console.log(this.apidataorigin);
    //  //console.log(this.apidataDestination);
  }
  sendReturnDate(data) {
    this.globalService.sendReturnDataDate(data);
  }
  routerEvent;
  getRouterDetails() {
   this.routerEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let element = (document.querySelector('ion-backdrop') as HTMLElement);
        // //console.log(element);
        if(element != null){
          element.click();
        }
      }
    });
  }
}


