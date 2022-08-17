import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  ElementRef, Input
} from "@angular/core";
import { NavController, ModalController, IonSelect } from "@ionic/angular";
import {
  FormGroup,
  FormControl,
  NgForm,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { SelectTravellerComponent } from "../select-traveller/select-traveller.component";
import {
  Router,
  NavigationExtras,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
} from "@angular/router";
import { MatBottomSheet } from "@angular/material";
import { OriginListModalComponent } from "../origin-list-modal/origin-list-modal.component";
import { DestinationListModalComponent } from "../destination-list-modal/destination-list-modal.component";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { Subscription, Subscriber } from "rxjs";
import { CalenderComponent } from "../calender/calender.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OriginDestinationService } from "src/app/services/origin-destination.service";
import { GlobalService } from "src/app/services/global.service";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { FlightService } from "src/app/services/flight.service";
import * as moment from "moment";
import { validateConfig } from "@angular/router/src/config";
import { ConnectionService } from "ng-connection-service";
import { Location } from "@angular/common";
import { SafeResourceUrl } from '@angular/platform-browser';
import * as $ from 'jquery';
class Econamy {
  public economyId: number;
  public economyType: string;
}
@Component({
  selector: "app-returnway",
  templateUrl: "./returnway.component.html",
  styleUrls: ["./returnway.component.scss"],
})
export class ReturnwayComponent implements OnInit, OnDestroy {
  @Input() widgetBannerReturn: SafeResourceUrl | boolean;
  @ViewChild("myCalendar") datePicker;
  @ViewChild("mySelect") selectRef: IonSelect;
  private subscriptions: Subscription[] = [];
  origindata: Subscription;
  originName: any;
  detinationdata: Subscription;
  destinationName: any;
  xy: any[];
  vv: any;
  returnwayorigin: any;
  returnwayDestination: any;
  servicedata: Subscription;
  pcity = [];
  citys: any;
  citys2: Object;
  recentflight: any;
  flightarr = {};
  finalorigin: any;
  finaldest: any;
  datesonward: string;
  datesreturn: string;
  infantshedr: any;
  childrenhedr: any;
  adulthedr: any;
  adultdefault: any;
  finaladult: any;
  reqdepartdate: any;
  reqreturndate: any;
  odddatas: any;
  info: any;
  travellers: any;
  countryId: string;
  data: any;
  selctedcabinclassonward: number;
  selctedcabinclassreturn: number;
  originlistfinal: any;
  destlistfinal: any;
  isConnected = true;
  status = "ONLINE";
  FlagForCC: boolean = true;
  countryCode: string;
  OriginAirportCityName: string;
  DestinationAirportCityName: string;
  LocalstorageReturnway:{}
  close() {
    this.datePicker.overlayVisible = false;
  }
  airportList = [];
  flightForm: FormGroup;
  message: any;
  total_traveller: any;
  dateValue: any;
  maxDate;
  range: string;
  fulldatefromcalender;
  airportCode;
  language = "en";
  // totalTraveller:any={};
  public today: Date = new Date();
  public currentYear: number = this.today.getFullYear();
  public currentMonth: number = this.today.getMonth();
  public currentDay: number = this.today.getDate();
  public minDate: Object = new Date(
    this.currentYear,
    this.currentMonth,
    this.currentDay
  );
  // public maxDate: Object = new Date(this.currentYear, this.currentMonth, this.currentDay);

  minimumDate = new Date();
  footerYear = new Date().getFullYear();
  public start: Date = new Date();
  public end: Date = new Date();
  addReturningDate: any;
  departDate: any;
  returnDate: any;
  destcode;
  origincode;
  OriginAirportCode: any;
  destinationiArportCode: any;
  subscription: Subscription;
  subscriptiondata: Subscription;
  servicedatas: Subscription;

  Country: any;
  airPortName: any;
  AirDetails: any;
  airDetails: string;
  economies: Econamy[];
  economy: Econamy[];
  economy1: Econamy[];
  Traveller: any;
  DestinationairportName;
  DestinationairportCode;
  DestinationcountryIdValue;
  OriginairportName;
  OriginairportCode;
  OrigincountryIdValue;
  public departingDate;

  getCountryId = Number(localStorage.getItem("countryId"));
  getCountryGroupId = Number(localStorage.getItem("groupId"));
  branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
  flagOrigin: any;
  flagDestination: any;

  constructor(
    public navCtrl: NavController,
    private flightService: FlightService,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private sendTravelerData: SendTravllerDataService,
    private bottomSheet: MatBottomSheet,
    private originDestinationService: OriginDestinationService,
    private globalService: GlobalService,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private connectionService: ConnectionService
  ) {
    this.economies = [
      { economyId: 0, economyType: "Cabin Class" },
      { economyId: 1, economyType: "Economy" },
      { economyId: 2, economyType: "Premium Economy" },
      { economyId: 3, economyType: "Business Class" },
      { economyId: 4, economyType: "First Class" },
    ];
    /////load methods
    // this.loadAirport();
    this.createForm();
    this.connectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        // console.log(this.status);
        //  this.dialog.alert('network was Disconnected:-()');
        let snackBarRef1 = this._snackBar.open("You are in ONLINE", "", {
          duration: 1000,
        });
      } else {
        this.status = "OFFLINE";
        //  alert("You are in OFFLINE")
        // console.log(this.status);
        //this.dialog.alert('network was Disconnected:-()');
        let snackBarRef1 = this._snackBar.open("You are in OFFLINE", "", {
          duration: 1000,
        });
      }
    });
    //this.destinationData();
    //  this.originData();
    // this.travllerdata();
    let OriginDataDetails = localStorage.getItem("OriginDataDetails");

    let val, val1;
    if (OriginDataDetails != null) val = JSON.parse(OriginDataDetails);
    let DestinationDataDetails = localStorage.getItem("DestinationDataDetails");

    if (DestinationDataDetails != null)
      val1 = JSON.parse(DestinationDataDetails);

    // let origin,destination,OriginairportName,DestinationairportName;
    if (val) {
      this.originName = [];
      this.originName.airportCode = val[0].airportCode;
      this.returnwayorigin = this.originName.airportCode;
      this.originName.airportName = val[0].airportName;

      this.flightForm.patchValue({
        returnwayOrigin: this.returnwayorigin,
      });
      this.flagOrigin = 2;
    } else this.flagOrigin = 1;
    if (val1) {
      this.destinationName = [];
      this.destinationName.airportCode = val1[0].airportCode;
      this.returnwayDestination = this.destinationName.airportCode;
      this.flightForm.patchValue({
        returnwaydestination: this.returnwayDestination,
      });
      this.flagDestination = 2;
      this.destinationName.airportName = val1[0].airportName;
    } else this.flagDestination = 1;
  }

  openSelect() {
    if (this.selectRef) {
      this.selectRef.open();
    }
  }

  closeSelect() {
    this.selectRef.ionCancel;
  }

  ngOnInit() {
    let x = this.router.url;
    this.getRouterDetails();
    localStorage.removeItem("returnwaydepartDate");
    localStorage.removeItem("returnwayreturnDate");

    sessionStorage.removeItem("returnwaydepartDate");
    sessionStorage.removeItem("returnwayreturnDate");

    localStorage.removeItem("checkedList1");
    localStorage.removeItem("serviceVendor");
    localStorage.removeItem("tripType");
    localStorage.removeItem("tripround");
    //
    sessionStorage.removeItem("serviceVendor");
    sessionStorage.removeItem("tripType");
    sessionStorage.removeItem("tripround");

    localStorage.removeItem("Filtered_Data");
    localStorage.removeItem("BOOKRN");

    // this.flagOrigin = 1;
    // this.flagDestination =1 ;

    this.countryId = localStorage.getItem("countryId");

    setTimeout(() => {
      const ionSelects = document.querySelectorAll("ion-select");
      // console.log(ionSelects)
      ionSelects.forEach((sel, i) => {
        // console.log(ionSelects[i])
        // ionSelects[i].shadowRoot.querySelectorAll('.select-icon').se
        // ['lastElementChild']['previousElementSibling']['lastElementChild'].setAttribute('style', 'display: none;'))
        // .querySelector('.select-icon-inner').setAttribute('style', 'display: none;')
      });
    }, 2000);

    localStorage.removeItem("tripType");
    let localData = JSON.parse(localStorage.getItem("resultSearch"));

    localStorage.setItem("resultSearch", JSON.stringify(this.search));
    sessionStorage.setItem("resultSearch", JSON.stringify(this.search));

    if (localData != null) {
      let allsearch =
        localData["returnway"].length != 0 ? localData : this.search;

      localStorage.setItem("resultSearch", JSON.stringify(allsearch));
      sessionStorage.setItem("resultSearch", JSON.stringify(allsearch));

    }

    // this.getRecentfly();
    this.selectedClass();
    // this.gettravllerfromservice();
    ///--------------------------
    let DataForTravellers = localStorage.getItem("DataForTravellers");
    let val = JSON.parse(DataForTravellers);

    if (val) {
      this.allAdult = val.adult;
      this.allChild = val.children;
      this.allInfant = val.infants;
      this.total_traveller = val.adult + val.children + val.infants;
    } else {
      this.allAdult = 1;
      this.allChild = 0;
      this.allInfant = 0;
      this.total_traveller = 1;
    }
    ///--------------------------
    // this.getAllTravellerDate();
    this.popularcity();

    this.getSessionOriginValue();
    this.getSessionDestinationValue();
    //  this.setFormValue();
    this.calenderdata();

    // this.departDate = this.fulldatefromcalender[0]
    // this.returnDate = this.fulldatefromcalender[1]
    this.flightForm.patchValue({
      returnwayOrigin: this.returnwayorigin,
      returnwaydestination: this.returnwayDestination,
      travellerfield: this.total_traveller,
      returnwaydepartDate: this.departDate,
      returnwayreturnDate: this.returnDate,
    });

    localStorage.removeItem("tripType");
    //this.total_traveller = 1;

    this.travellers = "";

    // this.getorigin();
    // this.getdest();
  }
  ionViewDidEnter() {}
  // this.elRef['nativeElement']['offsetParent']['offsetParent']['offsetParent']['offsetParent']['offsetParent']['nextElementSibling']['firstElementChild'].style.opacity = "1";
  ionViewWillEnter() {
    // this.ngOnInit();
    let localData = JSON.parse(localStorage.getItem("resultSearch"));
    localStorage.setItem("resultSearch", JSON.stringify(this.search));
    sessionStorage.setItem("resultSearch", JSON.stringify(this.search));

    if (localData != null) {
      let allsearch =
        localData["returnway"].length != 0 ? localData : this.search;
      localStorage.setItem("resultSearch", JSON.stringify(allsearch));
      sessionStorage.setItem("resultSearch", JSON.stringify(allsearch));

    }
  }

  ionViewWillLeave() {}
  ionViewDidLeave() {}
  ionViewWillUnload() {}

  selectedClass() {
    let EconomyData = localStorage.getItem("EconomyData");
    let DataEconomyData, ccData;
    if (EconomyData) {
      DataEconomyData = JSON.parse(EconomyData);
      ccData = DataEconomyData[0];
    } else ccData = "Economy";

    //for return cc
    let returnccData = localStorage.getItem("ReturnCC");
    let valforreturncc;
   // console.log(returnccData);

    if(returnccData) {
     let returnccValue = JSON.parse(returnccData);
      valforreturncc = returnccValue[0];
    } 
    else 
       valforreturncc = "Economy";
   // console.log("Local storage Economy Returnway:" + valforreturncc);

    this.flightForm.get("myeconomyonward").patchValue(ccData);
    this.flightForm.get("myeconomyreturn").patchValue(valforreturncc);

    this.flightForm.controls["myeconomyonward"].valueChanges.subscribe(
      (data) => {
        if (this.FlagForCC == true) {
          this.flightForm.get("myeconomyreturn").patchValue(data);
          this.FlagForCC = false;
        }
        // alert(data);

        this.data = data;

        if (this.data === "Economy") {
          this.selctedcabinclassonward = 1;
        } else if (this.data === "Premium Economy") {
          this.selctedcabinclassonward = 2;
        } else if (this.data === "Business Class") {
          this.selctedcabinclassonward = 3;
        } else if (this.data === "First Class") {
          this.selctedcabinclassonward = 4;
        } else {
        }
        var obj = [this.data, this.selctedcabinclassonward];
       // console.log(obj);
        localStorage.setItem("EconomyData", JSON.stringify(obj));
        sessionStorage.setItem("EconomyData", JSON.stringify(obj));

      }
    );

    this.flightForm.controls["myeconomyreturn"].valueChanges.subscribe(
      (data) => {
        this.closeSelect();
        this.data = data;
        if (this.data === "Economy") {
          this.selctedcabinclassreturn = 1;
        } else if (this.data === "Premium Economy") {
          this.selctedcabinclassreturn = 2;
        } else if (this.data === "Business Class") {
          this.selctedcabinclassreturn = 3;
        } else if (this.data === "First Class") {
          this.selctedcabinclassreturn = 4;
        } else {
        }
        var returncc = [this.data, this.selctedcabinclassreturn];
        //console.log(returncc);
        localStorage.setItem("ReturnCC", JSON.stringify(returncc));
        sessionStorage.setItem("ReturnCC", JSON.stringify(returncc));

      }
    );
  }

  ////form code reactive --

  createForm() {
    this.flightForm = this.formBuilder.group({
      returnwayOrigin: ["", Validators.required],
      returnwaydestination: ["", Validators.required],
      returnwaydepartDate: ["", Validators.required],
      returnwayreturnDate: ["", Validators.required],
      travellerfield: ["", Validators.required],
      myeconomyonward: ["", Validators.required],
      myeconomyreturn: ["", Validators.required],
    });
  }
  sendAdultCount;
  sendChildCount;
  sendInfantCount;
  isDataTrue = false;
  getSearchData(data) {
    if (data) {
      this.isDataTrue = true;
    }

    //console.log(data);
    let totalNumberTraveller = data["adult"] + data["infants"] + data["child"];
    this.total_traveller = totalNumberTraveller;

    // Code to select cabin class on recent search
    if (data["flightSearch"]["cabinClass"])
      if (data["flightSearch"]["cabinClass"] == 1) {
        // console.log(data);
        this.selctedcabinclassonward = 1;
        this.flightForm.get("myeconomyonward").patchValue("Economy");
      } else if (data["flightSearch"]["cabinClass"] == 2) {
        // console.log(data);
        this.selctedcabinclassonward = 2;
        this.flightForm.get("myeconomyonward").patchValue("Premium Economy");
      } else if (data["flightSearch"]["cabinClass"] == 3) {
        // console.log(data);
        this.selctedcabinclassonward = 3;
        this.flightForm.get("myeconomyonward").patchValue("Business Class");
      } else if (data["flightSearch"]["cabinClass"] == 4) {
        // console.log(data);
        this.selctedcabinclassonward = 4;
        this.flightForm.get("myeconomyonward").patchValue("First Class");
      }

    if (data["flightSearchReturn"])
      if (data["flightSearch"]["cabinClass"] == 1) {
        this.selctedcabinclassreturn = 1;
        this.flightForm.get("myeconomyreturn").patchValue("Economy");
      } else if (data["flightSearchReturn"] == 2) {
        this.selctedcabinclassreturn = 2;
        this.flightForm.get("myeconomyreturn").patchValue("Premium Economy");
      } else if (data["flightSearchReturn"] == 3) {
        this.selctedcabinclassreturn = 3;
        this.flightForm.get("myeconomyreturn").patchValue("Business Class");
      } else if (data["flightSearchReturn"] == 4) {
        this.selctedcabinclassreturn = 4;
        this.flightForm.get("myeconomyreturn").patchValue("First Class");
      }

    // ----------------------------

    this.sendAdultCount = data["adult"];
    this.sendChildCount = data["child"];
    this.sendInfantCount = data["infants"];

    this.allAdult = data["adult"];
    this.allChild = data["child"];
    this.allInfant = data["infants"];

    this.departDate = new Date(
      moment(data["flightSearch"]["onwardJourneyDate"], "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      )
    );
    this.returnDate = new Date(
      moment(data["flightSearch"]["returnJourneyDate"], "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      )
    );

    this.originName = []; // --------------
    this.originName.airportCode = data["flightSearch"]["origin"];

    this.destinationName = []; // --------------
    this.destinationName.airportCode = data["flightSearch"]["destination"];
    // this.originName.airportCode.hard = 'From';
    // this.destinationName.airportCode = 'To';
    this.originName.airportName = data["originAirportName"];
    this.destinationName.airportName = data["destinationAirportName"];

    this.flightForm.patchValue({
      returnwayOrigin: data["flightSearch"]["origin"],
      returnwaydestination: data["flightSearch"]["destination"],
      travellerfield: this.total_traveller,
      returnwaydepartDate: data["flightSearch"]["onwardJourneyDate"],
      returnwayreturnDate: data["flightSearch"]["returnJourneyDate"],
    });
    // console.log(this.flightForm);
    setTimeout(() => {
      this.returnwayFlight();
    }, 500);

    // console.log(this.apidataorigin);
    // console.log(this.apidataDestination);
  }

  flight: any = {};
  allResultSearch = [];
  returnwayFlight() {

    
 this.flightService.sendCardSate(true);
    localStorage.removeItem('bookingURL');
    sessionStorage.removeItem("affilatePartnerId");


    this.flightService.sendpagerefresh("noRefresh");
    localStorage.removeItem("BOOKRN");
    localStorage.removeItem('UMOpaxinfoinfant');
    localStorage.removeItem('UMOonwrdate');
     localStorage.removeItem('UMOcabinclass');
     localStorage.removeItem('UMOpaxinfo');
   localStorage.removeItem('UMOpaxinfochild');
      localStorage.removeItem('UMOcabinclassreturn');

    let countryCodee = localStorage.getItem("countryCode");
    this.countryCode = countryCodee.toLowerCase();

    this.OriginAirportCityName = localStorage.getItem("OriginAirportCityName");
    this.DestinationAirportCityName = localStorage.getItem(
      "DestinationAirportCityName"
    );

    let idx: any = 0;
    localStorage.setItem("sortedBy", "PriceLH");
    localStorage.setItem("currentindex", idx);
//
    sessionStorage.setItem("sortedBy", "PriceLH");
    sessionStorage.setItem("currentindex", idx);

    localStorage.setItem(
      "returnwaydepartDate",
      this.flightForm.get("returnwaydepartDate").value
    );
    localStorage.setItem(
      "returnwayreturnDate",
      this.flightForm.get("returnwayreturnDate").value
    );
    localStorage.setItem("tripround", "roundtrip");
//
sessionStorage.setItem(
  "returnwaydepartDate",
  this.flightForm.get("returnwaydepartDate").value
);
sessionStorage.setItem(
  "returnwayreturnDate",
  this.flightForm.get("returnwayreturnDate").value
);
sessionStorage.setItem("tripround", "roundtrip");


    let field = {
      adult: this.allAdult,
      children: this.allChild,
      infants: this.allInfant,
      // type: this.data.type
    };
    //console.log(field)
    this.sendTravelerData.sendtravllers(field);
    localStorage.setItem("tripType", "returnway");
//
sessionStorage.setItem("tripType", "returnway");

    //send origin /dest in another comp for fareconfirm api
    //  console.warn(this.flightForm.value);
    let itemDatas = this.flightForm.value;


    let localData = JSON.parse(localStorage.getItem("resultSearch"));

    localStorage.setItem("resultSearch", JSON.stringify(this.search));
    sessionStorage.setItem("resultSearch", JSON.stringify(this.search));

    if (localData != null) {
      let allsearch =
        localData["returnway"].length != 0 ? localData : this.search;

      localStorage.setItem("resultSearch", JSON.stringify(allsearch));
      sessionStorage.setItem("resultSearch", JSON.stringify(allsearch));

    }
    // console.log(this.flightForm.get("returnwaydepartDate").value);
    // console.log(this.flightForm.get("returnwayreturnDate").value);

    var flagOrigin = this.flightForm.get("returnwayOrigin").value;

    var flagDestination = this.flightForm.get("returnwaydestination").value;

    var mydeparting = this.flightForm.get("returnwaydepartDate").value;
    var myreturning = this.flightForm.get("returnwayreturnDate").value;
    this.sendReturnDate(myreturning);
    if (this.flagOrigin == 1) {
      let snackBarRef1 = this._snackBar.open("Please Select Your Origin", "", {
        duration: 1000,
      });
    } else if (this.flagDestination == 1) {
      let snackBarRef1 = this._snackBar.open("Please Select Your Destination", "", {
        duration: 1000,
      });
    } else if (flagOrigin == flagDestination) {
      let snackBarRef11 = this._snackBar.open(
        "Origin and Destination can't be same",
        "",
        {
          duration: 1000,
        }
      );
      // setTimeout(() => {
      //   this.bottomSheet.open(DestinationListModalComponent);
      // }, 1100);
    } else if (mydeparting == null) {
      //alert('undefined');
      let snackBarRef1 = this._snackBar.open(
        "Please Select Departing Date",
        "",
        {
          duration: 1000,
        }
      );
    } else if (myreturning == null) {
      let snackBarRef1 = this._snackBar.open(
        "Please Select Returning Date",
        "",
        {
          duration: 1000,
        }
      );
    } else if (
      myreturning != null &&
      mydeparting != null &&
      flagOrigin != null &&
      flagDestination != null
    ) {
      let calData = localStorage.getItem("DateForAll");
      let ReturnDate = localStorage.getItem("ReturnDate");
      //console.log(calData);     
      if (calData) {
        this.departDate = new Date(calData);
        this.reqdepartdate = this.convertdepart(this.departDate);
        this.flightForm.patchValue({
          returnwaydepartDate: moment(this.departDate).format("DD-MM-YYYY"),
        });
      }
     // console.log(moment(this.departDate).format("DD-MM-YYYY")); 
       if(ReturnDate && ReturnDate != "null")
         {
         // console.log("Return Date from local storage:"+ReturnDate);       
          this.returnDate =  new Date(ReturnDate);    
          this.reqreturndate = this.convertdepart(this.returnDate);
          this.flightForm.patchValue({
            returnwayreturnDate: moment(this.returnDate).format("DD-MM-YYYY")
          });
         }
        //Cabinclass data------------
         let EconomyData = localStorage.getItem("EconomyData");
         let DataEconomyData, cconward;
         if (EconomyData) {
           DataEconomyData = JSON.parse(EconomyData);
           cconward = DataEconomyData[1];
         } else cconward = 1;
     
         //for return cc
         let returnccData = localStorage.getItem("ReturnCC");
         let ccreturn;
         //console.log(returnccData);
     
         if(returnccData) {
          let returnccValue = JSON.parse(returnccData);
          ccreturn = returnccValue[1];
         } 
         else 
         ccreturn = 1;
        // console.log("Local storage Economy:-" + "onwards:"+cconward+"return:"+ccreturn);
     
         //-------------
      // console.warn(this.flightForm.value);
      var myData = this.flightForm.value;
      this.odddatas = this.flightForm.value;
      this.flightService.sendoddata(this.odddatas);

      this.finalorigin = myData.returnwayOrigin;
      this.finaldest = myData.returnwaydestination;
     // console.log(this.finalorigin);
     // console.log(this.finaldest);

      var returnwayorigin = this.finalorigin;
      var returnwaydestination = this.finaldest;

      var reqbody = {
        currencyCode: this.branchCurrencyCode,

        flightSearchWidgetList: [
          {
            origin: returnwayorigin,
            destination: returnwaydestination,
            cabinClass: this.selctedcabinclassonward
              ? this.selctedcabinclassonward
              : cconward,
            onwardJourneyDate: this.flightForm.get("returnwaydepartDate").value,
            returnJourneyDate: this.flightForm.get("returnwayreturnDate").value,
          },
          {
            origin: returnwaydestination,
            destination: returnwayorigin,
            cabinClass: this.selctedcabinclassreturn
              ? this.selctedcabinclassreturn
              : ccreturn,
            onwardJourneyDate: this.flightForm.get("returnwayreturnDate").value,
           // returnJourneyDate: "",
          },
        ],

        noOfAdult: this.allAdult ? this.allAdult : 1,
        noOfChild: this.allChild ? this.allChild : 0,
        noOfInfant: this.allInfant ? this.allInfant : 0,

        tripType: "roundtrip",
        groupId: this.getCountryGroupId,
        countryId: this.getCountryId,
      };
      let allSearchData = {};
      allSearchData["flightSearch"] = reqbody["flightSearchWidgetList"][0];
      allSearchData["flightSearchReturn"] = this.selctedcabinclassreturn
        ? this.selctedcabinclassreturn
        : 1;
      allSearchData["adult"] = reqbody["noOfAdult"];
      allSearchData["child"] = reqbody["noOfChild"];
      allSearchData["infants"] = reqbody["noOfInfant"];
      allSearchData["originAirportName"] = this.originName.airportName;
      allSearchData[
        "destinationAirportName"
      ] = this.destinationName.airportName;

//////send travlerr data in case aff >> 4march-start
// let field = {
//   adult: this.allAdult ? this.allAdult : 1,
//   children: this.allChild ? this.allChild : 0,
//   infants: this.allInfant ? this.allInfant : 0,
// };
// this.sendTravelerData.sendTravellerCountdate(field);



/////4march-end


      // console.log(reqbody);
      this.sendRequestBody = allSearchData;
     // console.log(this.sendRequestBody);
      // getCountryId /getCountryId
      this.SaveDataToLocalStorage();
      this.flightService.getflights(reqbody).subscribe((res) => {
        // console.log(res);
        let sendDataToSerachComponent = {
          response: res,
          reqbody: reqbody,
        };
        this.flightService.sendonewaydata(sendDataToSerachComponent);
      });
     
 localStorage.setItem('returnwaydepartDate',this.flightForm.get("returnwaydepartDate").value);
 localStorage.setItem('returnwayreturnDate',this.flightForm.get("returnwayreturnDate").value);
 //
 sessionStorage.setItem('returnwaydepartDate',this.flightForm.get("returnwaydepartDate").value);
 sessionStorage.setItem('returnwayreturnDate',this.flightForm.get("returnwayreturnDate").value);

      let ctnames = localStorage.getItem("cityDetails");       
      let ctdetail = JSON.parse(ctnames);
      //console.log("citynames:"+ JSON.stringify(ctdetail));

      this.OriginAirportCityName = ctdetail['Origin']; 
      this.DestinationAirportCityName = ctdetail['Destination'];
      this.OriginAirportCityName = this.OriginAirportCityName.replace(
        /\s/g,
        "-"
      );
      this.DestinationAirportCityName = this.DestinationAirportCityName.replace(
        /\s/g,
        "-"
      );

      this.router.navigate([
        this.countryCode +
          "/" +
          this.language +
          "/" +
          "cheap-flights/" +
          "search/" +
          this.OriginAirportCityName +
          "-to-" +
          this.DestinationAirportCityName +
          "/" +
          this.finalorigin +
          "-" +
          this.finaldest +
          "/Return",
      ]);
    }
     
        //WebEngage----------------------------------------------------------------
 
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "assets/js/webEngage.js";
        s.id = '_webengage_script_tag';
        $("head").append(s);
 
          webengage.track('Search-Flight', {
            "Type" 			   		      : "Round Trip",
            "Origin Airport"        : this.originName.airportName,
            "Origin Name"      	   	: returnwayorigin,
            "Destination Airport"   : this.destinationName.airportName,
            "Destination Name" 		  : returnwaydestination,
            "Departing Date"   	  	: this.flightForm.get("returnwaydepartDate").value + "T00:00:00.000Z",
            "Arrival Date"  	    	: this.flightForm.get("returnwayreturnDate").value + "T00:00:00.000Z",
            "Depating Flight Class" : this.flightForm.get("myeconomyonward").value,
            "Arrival Flight Class"  : this.flightForm.get("myeconomyreturn").value,
            "No of Adults"          : this.allAdult ? this.allAdult : 1+"Adult",
            "No of Children"        : this.allChild ? this.allChild : 0+"Child",
            "No of Infants"         : this.allInfant ? this.allInfant : 0+"Infant",
            "Aliance Airlines"		  : "",
            "Prefered Airlines"		  : "",

         });
       //----------------------------------------------------------------


  }
  public search = {
    returnway: [],
  };
  sendRequestBody;
  SaveDataToLocalStorage() {
    let restoreSearchData = JSON.parse(localStorage.getItem("resultSearch"));
    //-- code for url 
    //console.log(restoreSearchData)
    //console.log(this.sendRequestBody);
    let ctnames = localStorage.getItem("cityDetails");
    let ctdetail;
    if(ctnames) 
      ctdetail = JSON.parse(ctnames);     
   // console.log(ctdetail);
    this.LocalstorageReturnway = {};
    this.LocalstorageReturnway["flightSearch"] = this.sendRequestBody["flightSearch"];
    this.LocalstorageReturnway["flightSearchReturn"] = this.selctedcabinclassreturn? this.selctedcabinclassreturn: 1;
    this.LocalstorageReturnway["adult"] = this.sendRequestBody["adult"];
    this.LocalstorageReturnway["child"] = this.sendRequestBody["child"];
    this.LocalstorageReturnway["infants"] = this.sendRequestBody["infants"];
    this.LocalstorageReturnway["originAirportName"] = this.originName.airportName;
    this.LocalstorageReturnway["destinationAirportName"] = this.destinationName.airportName;
    this.LocalstorageReturnway["OriginCityName"] =  ctdetail['Origin'] ;
    this.LocalstorageReturnway["destinationCityName"] = ctdetail['Destination'];
   // console.log(this.LocalstorageReturnway);
 //-----------------
    if(restoreSearchData) {
      if (restoreSearchData["returnway"].length != 0) {
        for (var i = 0; i < restoreSearchData["returnway"].length; i++) {
          if (JSON.stringify(restoreSearchData["returnway"][i]) === JSON.stringify(this.LocalstorageReturnway))
          {
            return;
            //restoreSearchData["returnway"].push(...restoreSearchData["returnway"].splice(0, i));
          }
          // return;
        }
      }
      if (restoreSearchData["returnway"].length < 3) {
        restoreSearchData.returnway.push(this.LocalstorageReturnway);
        localStorage.setItem("resultSearch", JSON.stringify(restoreSearchData));
        sessionStorage.setItem("resultSearch", JSON.stringify(restoreSearchData));

      } else {
        for (var i = 1; i < restoreSearchData["returnway"].length; i++) {
          restoreSearchData["returnway"][i - 1] =
            restoreSearchData["returnway"][i];
        }
        // restoreSearchData.oneway.push(this.sendRequestBody);
        restoreSearchData["returnway"][restoreSearchData["returnway"].length - 1] = this.LocalstorageReturnway;
        localStorage.setItem("resultSearch", JSON.stringify(restoreSearchData));
        sessionStorage.setItem("resultSearch", JSON.stringify(restoreSearchData));

      }
    }
  }
  // end //
  sendReturnDate(data) {
    this.globalService.sendReturnDataDate(data);
  }
  gettravllerfromservice() {
    this.sendTravelerData.gettravller().subscribe((res) => {
      // console.log(res);
      if (res) {
        this.info = res["trvllerfield"];
        this.adultdefault = res.adult;
        // this.adulthedr = this.info.adult;
        // this.childrenhedr = this.info.children;
        // this.infantshedr = this.info.infants;
        // console.log(this.adulthedr);
        // console.log(this.childrenhedr);
        // console.log(this.infantshedr);
      }

      if (this.adulthedr != this.adultdefault) {
        this.finaladult = this.adulthedr;
      } else {
        this.finaladult = this.adultdefault;
      }
    });
  }

  disableDate(ev) {
    // console.log(this.start);
    // console.log(this.end);
  }
  getdatesinformat() {
    var event1 = new Date(this.fulldatefromcalender[0]);
    var event2 = new Date(this.fulldatefromcalender[1]);

    let date1 = JSON.stringify(event1);
    this.datesonward = date1.slice(1, 11);

    let date2 = JSON.stringify(event2);
    this.datesreturn = date2.slice(1, 11);
  }

  popularcity() {
    this.servicedatas = this.globalService
      .getpopularcity(this.countryId)
      .subscribe(
        (popcity) => {
          if (popcity["statusMessage"] == "success") {
            this.citys = popcity;

            this.sendPopularCityList(popcity);
            let citynew = popcity["cityAndAirportDataList"];

            // citynew[1].airportCode  = "from";
            // citynew[2].airportCode  = "to";
            // citynew[1].airportName  = "select origin";
            // citynew[2].airportName  = "select destination";

            this.originlistfinal = citynew[1];
            this.destlistfinal = citynew[2];

            //   this.originlistfinal = citynew[1];
            //   this.destlistfinal =  citynew[2];

            //    this.originName = this.originlistfinal;
            //    this.destinationName = this.destlistfinal;

            //  this.flightForm.patchValue({
            //   returnwayOrigin: this.originlistfinal.airportCode
            // });

            //  this.flightForm.patchValue({
            //   returnwaydestination: this.destlistfinal.airportCode
            // });
          } else {
            this.sendPopularCityList({
              popularCityRes: false,
            });
          }
        },
        (err) => {
          this.sendPopularCityList({
            popularCityRes: false,
          });
        }
      );
  }
  getorigin() {
    this.originDestinationService.getOrigin().subscribe((res) => {
      if (res) {
        this.originName = res;
        this.returnwayorigin = this.originName.airportCode;
        this.flightForm.patchValue({
          returnwayOrigin: this.returnwayorigin,
        });
        this.flagOrigin = 2;
      }
    });
  }
  getdest() {
    this.originDestinationService.getDestination().subscribe((res) => {
      if (res) {
        this.destinationName = res;
        this.returnwayDestination = this.destinationName.airportCode;
        this.flightForm.patchValue({
          returnwaydestination: this.returnwayDestination,
        });
        this.flagDestination = 2;
      }
    });
  }

  sendPopularCityList(data) {
    this.originDestinationService.sendpopcity(data);
  }

  // private apidataorigin = {
  //   airportId: 2,
  //   airportCode: "DXB",
  //   airportName: "Dubai International Airport"
  // };

  // private apidataDestination = {
  //   airportId: 3,
  //   airportCode: "SIN",
  //   airportName: "Singapore Changi Airport"
  // };

  // destinationData() {
  //   this.destinationName = this.apidataDestination;
  //   this.returnwayDestination = this.destinationName.airportCode;
  //   this.flightForm.patchValue({
  //     returnwaydestination: this.returnwayDestination
  //   });

  // }

  // originData() {
  //   this.originName = this.apidataorigin;
  //   this.returnwayorigin = this.originName.airportCode;
  //   this.flightForm.patchValue({
  //     returnwayOrigin: this.returnwayorigin
  //   });
  // console.log(this.apidataorigin);
  // console.log(this.apidataDestination);
  // this.origindata = this.originDestinationService
  //   .getOrigin()
  //   .subscribe(org => {
  //     console.log(org);
  //     this.originName = org;
  //     this.returnwayorigin = this.originName.airportCode;
  //     this.flightForm.patchValue({
  //       returnwayOrigin: this.returnwayorigin
  //     });
  //   });
  //}
  getTravellerDateCount: Subscription;
  allInfant;
  allChild;
  allAdult;
  getAllTravellerDate(travellerDtaa) {
    this.getTravellerDateCount = this.sendTravelerData.getTravellerCount.subscribe(
      (res) => {
        if (res) {
          // console.log(res);
          this.sendAdultCount;
          this.travellers = res;
          this.allAdult = res["adult"];
          this.allChild = res["children"];
          this.allInfant = res["infants"];
          this.total_traveller =
            res["adult"] + res["children"] + res["infants"];

          ///send these travller when someone opem sheet

          this.sendAdultCount = this.allAdult;
          this.sendChildCount = this.allChild;
          this.sendInfantCount = this.allInfant;
        }
      }
    );
  }

  travllerdata() {
    this.subscription = this.sendTravelerData.getmsg().subscribe((data) => {
      //console.log(data);
      this.total_traveller = data.text;
      // console.log(this.total_traveller)
    });
  }

  calenderdata() {
    let calData = localStorage.getItem("DateForAll");
    let ReturnDate = localStorage.getItem("ReturnDate");
    //console.log(calData);     
    if (calData) {
      this.departDate = new Date(calData);
      this.reqdepartdate = this.convertdepart(this.departDate);
      this.flightForm.patchValue({
        returnwaydepartDate: moment(this.departDate).format("DD-MM-YYYY"),
      });
    }
    //console.log(moment(this.departDate).format("DD-MM-YYYY")); 
     if(ReturnDate && ReturnDate != "null")
       {
        //console.log("Return Date from local storage:"+ReturnDate);       
        this.returnDate =  new Date(ReturnDate);    
        this.reqreturndate = this.convertdepart(this.returnDate);
        this.flightForm.patchValue({
          returnwayreturnDate: moment(this.returnDate).format("DD-MM-YYYY")
        });
       }
    this.subscriptiondata = this.sendTravelerData
      .getdata()
      .subscribe((data2) => {
        this.fulldatefromcalender = data2.text2;
        this.departDate = this.fulldatefromcalender[0];
        this.returnDate = this.fulldatefromcalender[1];

        this.reqdepartdate = this.convertdepart(this.departDate);
        this.reqreturndate = this.convertdepart(this.returnDate);
        this.flightForm.patchValue({
          returnwaydepartDate: moment(this.fulldatefromcalender[0]).format(
            "DD-MM-YYYY"
          ),
          returnwayreturnDate: moment(this.fulldatefromcalender[1]).format(
            "DD-MM-YYYY"
          ),
        });
        //  console.log(this.fulldatefromcalender);
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

  // on click bottom sheet modal for both origin an ddestination //
  OriginDetails = [];
  openOriginList(event) {
    this.OriginDetails = [];
    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(
      OriginListModalComponent,
      {
        data: "",
        backdropClass: "calender-backdrop",
        panelClass: "origin_destination",
      }
    );

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      if (res != undefined) {
        this.originName = res["data"];
        this.returnwayorigin = this.originName.airportCode;
        this.flightForm.patchValue({
          returnwayOrigin: this.returnwayorigin,
        });
        this.flagOrigin = 2;
        let obj = {
          airportCode: this.returnwayorigin,
          airportName: this.originName.airportName,
        };
        this.OriginDetails.push(obj);
        localStorage.setItem(
          "OriginDataDetails",
          JSON.stringify(this.OriginDetails)
        );
        sessionStorage.setItem(
          "OriginDataDetails",
          JSON.stringify(this.OriginDetails)
        );
        
        //console.log("Origin city name:"+this.originName.cityName)

        //--------------For multiciy url
        let ctnames = localStorage.getItem("cityDetails"); 
        let ctdetail = JSON.parse(ctnames);
        //console.log("citynames:"+ ctdetail);
        let citynames = {
          Origin :  this.originName.cityName ? this.originName.cityName :(ctdetail && ctdetail['Origin'] ? ctdetail['Origin']:''),
          Destination : ctdetail &&  ctdetail['Destination']?ctdetail['Destination']:''
        }
        //console.log(citynames);
        localStorage.setItem("cityDetails",JSON.stringify(citynames));
        sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

          //---------------

 

      }
    });
    if (this.router.url == "/") {
      // this.bottomSheet.dismiss();
    }

    // this.globalService.sendapiOrigin(this.citys);
  }
  destDetails = [];
  openDestinationList(event) {
    this.destDetails = [];
    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(
      DestinationListModalComponent,
      {
        data: "",
        backdropClass: "calender-backdrop",
        panelClass: "origin_destination",
      }
    );

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      if (res != undefined) {
        //  console.log("get return component", res);
        this.destinationName = res["data"];
        this.returnwayDestination = this.destinationName.airportCode;
        this.flightForm.patchValue({
          returnwaydestination: this.returnwayDestination,
        });
        this.flagDestination = 2;
        let obj = {
          airportCode: this.destinationName.airportCode,
          airportName: this.destinationName.airportName,
        };
        this.destDetails.push(obj);
        localStorage.setItem(
          "DestinationDataDetails",
          JSON.stringify(this.destDetails)
        );
        sessionStorage.setItem(
          "DestinationDataDetails",
          JSON.stringify(this.destDetails)
        );
        
        //--------------For multiciy url
        let ctnames = localStorage.getItem("cityDetails"); 
        let ctdetail = JSON.parse(ctnames);
        //console.log("citynames:"+ ctdetail);
        let citynames = {
          Origin :ctdetail &&  ctdetail['Origin'] ? ctdetail['Origin']:'',
          Destination : this.destinationName.cityName ? this.destinationName.cityName :(ctdetail && ctdetail['Destination']?ctdetail['Destination']:'')
        }
       // console.log(citynames);
        localStorage.setItem("cityDetails",JSON.stringify(citynames));
          //---------------
       sessionStorage.setItem("cityDetails",JSON.stringify(citynames));



      }
    });

    if (this.router.url == "/") {
      // this.bottomSheet.dismiss();
    }

    // this.bottomSheet.open(DestinationListModalComponent);
    // this.globalService.sendapidest(this.citys);
    //console.log(this.citys)
  }

  // popularcity() {
  //   this.servicedatas = this.globalService
  //     .getpopularcity(this.countryId)
  //     .subscribe(popcity => {
  //       this.citys = popcity;
  //       this.citys2 = popcity;

  //       this.pcity = this.citys;
  //     });
  // }

  ngOnDestroy() {
    this.servicedatas.unsubscribe();
    // this.routerEvent.unsubscribe();
  }

  openTraveler() {
    let treVellerCount = {
      adult: this.sendAdultCount ? this.sendAdultCount : 1,
      child: this.sendChildCount ? this.sendChildCount : 0,
      infant: this.sendInfantCount ? this.sendInfantCount : 0,
      type: "returnway",
    };
    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(
      SelectTravellerComponent,
      {
        data: treVellerCount,
      }
    );

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      if (res) {
        this.getAllTravellerDate(res);
      }
    });

    if (this.router.url == "/") {
      // this.bottomSheet.dismiss();
    }
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

  // END //
  openCl() {
    let sendDates = {
      departure: moment(
        this.flightForm.get("returnwaydepartDate").value,
        "DD-MM-YYYY"
      ).format("YYYY-MM-DD"),
      returnWay: moment(
        this.flightForm.get("returnwayreturnDate").value,
        "DD-MM-YYYY"
      ).format("YYYY-MM-DD"),
      sendCondition: this.isDataTrue == true ? "clicked" : "",
    };
    this.bottomSheet.open(CalenderComponent, {
      data: this.isDataTrue == true ? sendDates : "",
      backdropClass: "calender-backdrop",
      panelClass: "city_panel_calender",
    });

    if (this.router.url == "/") {
      // this.bottomSheet.dismiss();
    }
  }

  swipe() {
    this.destDetails = [];
    this.OriginDetails = [];
    const temp = this.originName;
    this.originName = this.destinationName;
    this.destinationName = temp;

    this.flightForm.patchValue({
      returnwayOrigin: this.originName["airportCode"],
    });
    //  console.log(this.originName["airportCode"]);
    this.flightForm.patchValue({
      returnwaydestination: this.destinationName["airportCode"],
    });
    //  console.log(this.destinationName);
    let obj = {
      airportCode: this.originName["airportCode"],
      airportName: this.originName["airportName"],
    };
    this.OriginDetails.push(obj);
    // console.log(this.OriginDetails);
    localStorage.setItem(
      "OriginDataDetails",
      JSON.stringify(this.OriginDetails)
    );
    sessionStorage.setItem(
      "OriginDataDetails",
      JSON.stringify(this.OriginDetails)
    );
    let obj1 = {
      airportCode: this.destinationName["airportCode"],
      airportName: this.destinationName["airportName"],
    };
    this.destDetails.push(obj1);
    localStorage.setItem(
      "DestinationDataDetails",
      JSON.stringify(this.destDetails)
    );
    sessionStorage.setItem(
      "DestinationDataDetails",
      JSON.stringify(this.destDetails)
    );
   
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
        // console.log(citynames);
         localStorage.setItem("cityDetails",JSON.stringify(citynames));
         sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

        }
      //-------------------

  }

  //validation code if fields are empty
  openSnackBar1(
    message: string,
    action: string,
    departing: string,
    returning: string
  ) {
    let message2 = message;
    let action2 = action;

    let mydeparting = departing;
    let myreturning = returning;
  }

  loadAirport() {
    this.globalService.getOrigin().subscribe((fdata) => {
      // console.log(fdata);
      this.airportList = fdata["airportList"];
    });
    this.xy = this.airportList.filter((it) => it.airportName.includes("ae"));
  }

  selectEmployee(myeconomy) {
    alert("kkk");
  }
  routerEvent;
  getRouterDetails() {
    this.routerEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let element = document.querySelector("ion-backdrop") as HTMLElement;
        // console.log(element);
        if (element != null) {
          element.click();
        }
      }
    });
  }
}
