import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  NgForm,
  NgModelGroup,
  Validators
} from "@angular/forms";
import { Subscription } from "rxjs";
import { SelectTravellerComponent } from "../select-traveller/select-traveller.component";
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MatBottomSheet } from "@angular/material";
import { OriginListModalComponent } from "../origin-list-modal/origin-list-modal.component";
import { DestinationListModalComponent } from "../destination-list-modal/destination-list-modal.component";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OriginDestinationService } from "src/app/services/origin-destination.service";
import { NavController, ModalController, AlertController } from "@ionic/angular";
import { GlobalService } from "src/app/services/global.service";
import { FlightService } from "src/app/services/flight.service";
import * as moment from "moment";
import { MulticityCalendarComponent } from '../multicity-calendar/multicity-calendar.component';
import { SafeResourceUrl } from '@angular/platform-browser';
import * as $ from 'jquery';
// import { AnyARecord } from 'dns';
class Econamy {
  public economyId: number;
  public economyType: string;
}
@Component({
  selector: "app-multicity",
  templateUrl: "./multicity.component.html",
  styleUrls: ["./multicity.component.scss"]
})
export class MulticityComponent implements OnInit, OnDestroy {
  @Input("destination") destination;
  @ViewChild("myCalendar") datePicker;
  @Input() widgetBannerMulti: SafeResourceUrl | boolean;
  flightForm: FormGroup;
  origindata: Subscription;
  originName: any;
  detinationdata: Subscription;
  detinationdata1: Subscription;
  destinationName: any;
  destinationName1: any;
  servicedatas: any;
  citys: any;
  language = 'en'
  odddatas: any;
  myeco: string;
  newindexorigin: any;
  indexsub: Subscription;
  newairportCode: any;
  newairportName: any;
  destnewairportCode: any;
  destnewairportName: any;
  multidate: string;
  converteddate: string;
  travellers: string;
  allAdult: any;
  allChild: any;
  allInfant: any;
  groupId: string;
  countryId: string;
  originlistfinal: any;
  destlistfinal: any;
  originlistfinal2: any;
  destlistfinal2: any;
  sendAdultCount: any;
  sendChildCount: any;
  sendInfantCount: any;
  adult: any;
  children: any;
  infants: any;
  adultdefault: any;
  travSub: Subscription;
  branchCurrencyCode: string;
  ccData;
  countryCode: string;
  multicityLastJourneyDate: any;
  OriginAirportCityName: any;
  DestinationAirportCityName: any;
  ctdetail:any;
  close() {
    this.datePicker.overlayVisible = false;
  }
  public multyWayform: FormGroup;
  multyWayCities: FormArray;
  message: any;
  total_traveller: any;
  dateValue: any;
  maxDate;
  range: string;
  fulldatefromcalender;
  airportCode;
  // totalTraveller:any={};
  footerYear = new Date().getFullYear();
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
  public start: Date = new Date();
  public end: Date = new Date();
  addReturningDate: any;
  departDate: any;
  destcode;
  origincode;
  OriginAirportCode: any;
  destinationiArportCode: any;
  subscription: Subscription;
  subscriptiondata: Subscription;
  dataModel: any;
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
  ////////////MULTINEW
  flightwidget:any
  UserData;
  originvalue;
  destvalue;
  datevalue;
  Dataorigin;
  Datadestination;
  DataOriginairportName;
  DataDestinationairportName;
  multicityDetails:any;
  webMulticity;
  name = "Angular";
  UserForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private router: Router,
    private sendTravelerData: SendTravllerDataService,
    private bottomSheet: MatBottomSheet,
    private originDestinationService: OriginDestinationService,
    private globalService: GlobalService,
    private flightService: FlightService,
    private _snackBar: MatSnackBar,
    private FB: FormBuilder
  ) {
    this.economies = [
      { economyId: 0, economyType: "Cabin Class" },
      { economyId: 1, economyType: "Economy" },
      { economyId: 2, economyType: "Premium Economy" },
      { economyId: 3, economyType: "Business Class" },
      { economyId: 4, economyType: "First Class" }
    ];
  
    let OriginDataDetails = localStorage.getItem("OriginDataDetails");
    let val=JSON.parse(OriginDataDetails);
    ////console.log(OriginDataDetails);
    let DestinationDataDetails = localStorage.getItem("DestinationDataDetails");
    let val1=JSON.parse(DestinationDataDetails);
    ////console.log(DestinationDataDetails);
   // let origin,destination,OriginairportName,DestinationairportName;
    if(val){
      this.Dataorigin = val[0].airportCode;
      this.DataOriginairportName = val[0].airportName;
    }
    if(val1){
      this.Datadestination = val1[0].airportCode;
      this.DataDestinationairportName =val1[0].airportName;
    }
    let calData=localStorage.getItem("DateForAll"); 
    if(calData){
       ////console.log("Data from local storage:"+ new Date(calData));
   }
   let EconomyData = localStorage.getItem("EconomyData");
   let DataEconomyData;
   if(EconomyData)
   {
     DataEconomyData = JSON.parse(EconomyData);
       this.ccData = DataEconomyData[1];
   }   
  //  else
  //      this.ccData = 1;
  // //console.log(this.ccData)
   let ctnames = localStorage.getItem("cityDetails"); 
   ////console.log("citynames:"+ ctnames);
   this.ctdetail = JSON.parse(ctnames);
   
   let MulticityData = localStorage.getItem("MulticityData"); 
 //  //console.log("MulticityData from LOcal storage:"+ MulticityData);
   this.multicityDetails = JSON.parse(MulticityData);
   
   if(this.multicityDetails){
   this.flightwidget= [];
   for(let i=0;i<this.multicityDetails.length;i++)
          {     
            if(i == 0){
            ////console.log(i+":"+this.flightwidget);
            var obj = {            
             origin: this.Dataorigin?this.Dataorigin:(this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin'] :'From'),
             destination:  this.Datadestination? this.Datadestination:(this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To'),
             OriginairportName : this.DataOriginairportName ? this.DataOriginairportName:(this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']: 'Select Origin'),
             DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:(this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination'),
             JourneyDate: calData ?  new Date(calData) :(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
             SelectedeconomyType: this.ccData ?this.ccData: (this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1)
             }
             this.flightwidget.push(obj);
            // //console.log(i+":--"+this.flightwidget);
             }
             if(i == 1){
               ////console.log(i+":"+this.flightwidget);
               var obj = {        
                 origin:this.Datadestination? this.Datadestination:(this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin']:'From'),
                 destination: this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To',
                 OriginairportName :this.DataDestinationairportName? this.DataDestinationairportName:(this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']:'Select Origin'),
                 DestinationairportName:  this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination',
                 JourneyDate: calData ? "" :(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
                 SelectedeconomyType: this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1
               }
                this.flightwidget.push(obj);
                ////console.log(i+":--"+this.flightwidget);
              }
            else if(i>1)
             {
              ////console.log(i+":"+this.flightwidget);
            var obj = {        
                   origin: this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin'] :'From',
                   destination: this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To',
                   OriginairportName : this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']: 'Select Origin',
                   DestinationairportName:  this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination',
                   JourneyDate:  calData ? "":(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
                   SelectedeconomyType: this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1
                 }
                this.flightwidget.push(obj);
                ////console.log(i+":--"+this.flightwidget);
             }
             ////console.log(this.flightwidget);
          }
  }
  else
  {
    this.flightwidget = [
      {
        origin: this.Dataorigin?this.Dataorigin: 'From',
        destination:  this.Datadestination? this.Datadestination:'To',
        OriginairportName : this.DataOriginairportName ? this.DataOriginairportName: 'Select Origin',
        DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:'Select Destination',
        JourneyDate: calData ? new Date(calData) : "" ,
        SelectedeconomyType: this.ccData ? this.ccData :1,
      },
      {
        origin:this.Datadestination? this.Datadestination: 'From',
        destination :'To',
        OriginairportName :this.DataDestinationairportName? this.DataDestinationairportName:  'Select Origin',
        DestinationairportName:"Select Destination",
        JourneyDate: "",
        SelectedeconomyType:1
      }
    ];
  }
  ////console.log("Final data for multicity:"+this.flightwidget);
    //service call of travller data //
    this.subscription = this.sendTravelerData.getmsg().subscribe(data => {
      //console.log(data);
      this.total_traveller = data.text;
    });
  }

  // end //
  ngOnInit() {
    this.getRouterDetails();
    let DataForTravellers = localStorage.getItem("DataForTravellers");
    this.groupId = localStorage.getItem("groupId");
    this.countryId = localStorage.getItem("countryId");
    this.branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
    let countryCodee = localStorage.getItem('countryCode');
    this.countryCode = countryCodee.toLowerCase();
    let val = JSON.parse(DataForTravellers);
    ////console.log(val);
    if(val)
    {
      this.allAdult = val.adult;
      this.allChild = val.children;
      this.allInfant = val.infants;
      this.total_traveller = val.adult + val.children + val.infants;
    }
    else{
      this.allAdult = 1;
      this.allChild = 0;
      this.allInfant = 0;
      this.total_traveller = 1;
    }
    ////console.log(this.total_traveller);
    
   // this.total_traveller = null;
    localStorage.removeItem("tripTyobjpe");
    this.calenderdata();
    
    this.multyWayform = this.FB.group({
      originairportCode: this.FB.control(this.originName),
      destinationairportCode: this.FB.control(this.destinationName),
      economy: this.FB.control(this.economy),
      departDate: this.FB.control(this.departDate),
      total_traveller: [""]
    });
    ////console.log( (this.multyWayform.value))
    this.indexsub = this.globalService.getindex().subscribe(index => {
     // //console.log(index);
      this.newindexorigin = index;
    });
    this.gettravllerfromservice();
    this.popularcity();
    localStorage.removeItem('checkedList1');
    localStorage.removeItem('Filtered_Data');
  } //init end //





 
  getValue() {
    //console.log(this.departingDate);
  }
  // on click bottom sheet modal for both origin an ddestination //
  openOriginList(i) {
    this.bottomSheet.open(OriginListModalComponent, {
      data:  '',
      backdropClass: "calender-backdrop",
      panelClass: "origin_destination"
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      if (res != undefined) {
       // //console.log("get origin component", res);
        localStorage.setItem("OriginDataDetails", res);
        sessionStorage.setItem("OriginDataDetails", res);

        for (let j = 0; j < this.flightwidget.length; j++) {
          if (j == i) {
            this.flightwidget[i].origin = res["data"]["airportCode"];
            this.flightwidget[i].OriginairportName = res["data"]["airportName"];
            this.flightwidget[i].originCityName = res["data"]["cityName"];
          }
          // if (i != 0) {
          //   this.flightwidget[i - 1].destination = res["data"]["airportCode"];
          //   this.flightwidget[i - 1].DestinationairportName =
          //     res["data"]["airportName"];
          // }
        }
        //console.log("After Origin flightwidget)" + this.flightwidget);
      this.OriginDetails = [];
      //console.log("After Swap flightwidget)", this.flightwidget);
      //console.log("multicity final)", this.flightwidget);
      //console.log("multicity final ka zero)", this.flightwidget[0]);


      let obj={
        airportCode :this.flightwidget[0]["origin"],
        airportName :this.flightwidget[0]["OriginairportName"] 
      }
      this.OriginDetails.push(obj);
     // //console.log(this.OriginDetails);
      localStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));
      sessionStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));


      let ctnames = localStorage.getItem("cityDetails"); 
      this.ctdetail = JSON.parse(ctnames);
      //console.log("citynames:"+  this.ctdetail);
    //  //console.log(this.flightwidget[0].originCityName);
    //  //console.log(this.flightwidget[0].destinationCityName);
      let citynames = {
        Origin :  this.flightwidget[0].originCityName ? this.flightwidget[0].originCityName :(this.ctdetail && this.ctdetail['Origin'] ? this.ctdetail['Origin']:''),
        Destination : this.flightwidget[0].destinationCityName ? this.flightwidget[0].destinationCityName :(this.ctdetail && this.ctdetail['Destination']?this.ctdetail['Destination']:'')
      }
      ////console.log(citynames);
      localStorage.setItem("cityDetails",JSON.stringify(citynames));
      sessionStorage.setItem("cityDetails",JSON.stringify(citynames));


      }
    });
  }
  openDestinationList(i) {
    // this.bottomSheet.open(OriginListModalComponent, {
      this.bottomSheet.open(DestinationListModalComponent, {
      data: '',
      backdropClass: "calender-backdrop",
      panelClass: "origin_destination"
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      if (res != undefined) {
       // //console.log("get destination component", res);
        localStorage.setItem("DestinationDataDetails", res);
        sessionStorage.setItem("DestinationDataDetails", res);

        for (let j = 0; j < this.flightwidget.length; j++) {
          if (j == i) {
            this.flightwidget[i].destination = res["data"]["airportCode"];
            this.flightwidget[i].DestinationairportName =res["data"]["airportName"];
            this.flightwidget[i].destinationCityName = res["data"]["cityName"];
          }
          if (i != this.flightwidget.length - 1) {
            this.flightwidget[i + 1].origin = res["data"]["airportCode"];
            this.flightwidget[i + 1].OriginairportName =
              res["data"]["airportName"];
              this.flightwidget[i + 1].destinationCityName = res["data"]["cityName"];
          }
        }
        //console.log(typeof this.flightwidget);
        
        this.destDetails = [];
        let obj1={
          airportCode :this.flightwidget[0]["destination"],
          airportName :this.flightwidget[0]["DestinationairportName"] 
        }
        this.destDetails.push(obj1);
        ////console.log(this.destDetails);
        localStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));
        sessionStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));

      let ctnames = localStorage.getItem("cityDetails"); 
      //console.log("citynames:"+ ctnames);
      this.ctdetail = JSON.parse(ctnames);
      //console.log(this.flightwidget[0].originCityName);
      //console.log(this.flightwidget[0].destinationCityName);

      let citynames = {
        Origin :  this.flightwidget[0].originCityName ? this.flightwidget[0].originCityName :(this.ctdetail && this.ctdetail['Origin'] ? this.ctdetail['Origin']:''),
        Destination : this.flightwidget[0].destinationCityName ? this.flightwidget[0].destinationCityName :(this.ctdetail && this.ctdetail['Destination']?this.ctdetail['Destination']:'')
      }
      //console.log(citynames);
      localStorage.setItem("cityDetails",JSON.stringify(citynames));
      sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

      }
    });
  }
  openTraveler() {
  
    let treVellerCount = {
      adult: this.sendAdultCount ?  this.sendAdultCount : 1,
      child: this.sendChildCount ? this.sendChildCount : 0,
      infant: this.sendInfantCount ? this.sendInfantCount :0,
      type:'multicity'
    };
    // data: this.isDataTrue == true ? treVellerCount : ""
    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(
      SelectTravellerComponent,
      {
        data: treVellerCount
      }
    );
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      if (res) {
        //console.log("close data");
        this.getAllTravellerDate();
      }
    });
  }


  
  openDestinationList1(event) {
    this.bottomSheet.open(OriginListModalComponent);
  }
  openCalender(i) {
    //console.log("i::::" + i);
    this.globalService.sendindex(i);
    this.flightService.sendflightwidget(this.flightwidget);
    this.bottomSheet.open(MulticityCalendarComponent, {
      data:'',
      "backdropClass": 'calender-backdrop',
      "panelClass":'city_panel_calender',
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      //console.log(res);
      if(res == undefined){
        return;
      }
      this.departDate = new Date(
        moment(this.convertdepart(this.departDate), "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        )
      );
      this.flightwidget[i].JourneyDate = this.departDate;
      //console.log(this.flightwidget[i].JourneyDate == "Invalid Date");
      if(this.flightwidget[i].JourneyDate == "Invalid Date")
      {
        this.flightwidget[i].JourneyDate = "";
        return;
      }
      //console.log("After calendar)" + JSON.stringify(this.flightwidget));
   
      if(i>0)
      {
        for(let j=0;j<i;j++)
        {                                  
         if(this.flightwidget[j].JourneyDate > this.flightwidget[i].JourneyDate)
           this.flightwidget[j].JourneyDate = this.flightwidget[i].JourneyDate;
         else if(!this.flightwidget[j].JourneyDate)
            this.flightwidget[j].JourneyDate = this.flightwidget[i].JourneyDate;
       
        }

        if(i < this.flightwidget.length-1) 
         if(this.flightwidget[i+1].JourneyDate!="")
           if(this.flightwidget[i+1].JourneyDate < this.flightwidget[i].JourneyDate)
            {
              this.flightwidget[i].JourneyDate = this.flightwidget[i+1].JourneyDate ;
                  let snackBarRef1 = this._snackBar.open("Invalid date", "", {
              duration: 1000
              });
            } 
      }
      else
      {
        for(let j=1;j<this.flightwidget.length;j++)
        {
          if(this.flightwidget[j].JourneyDate != "") 
            if(this.flightwidget[j].JourneyDate < this.flightwidget[i].JourneyDate)           
            {
              this.flightwidget[i].JourneyDate = this.flightwidget[j].JourneyDate ;
                let snackBarRef1 = this._snackBar.open("Invalid date", "", {
                      duration: 1000
                 });
                return;
            }
        }
      }
    
      //console.log("After calendar::::" + this.flightwidget);
      //console.log(this.flightwidget[i].JourneyDate);
      if(i == 0)
      {
       localStorage.setItem('DateForAll',(this.flightwidget[i].JourneyDate));
       localStorage.setItem('ReturnDate',null);
       //
       sessionStorage.setItem('DateForAll',(this.flightwidget[i].JourneyDate));
       sessionStorage.setItem('ReturnDate',null);
      }
       
    });
  }
  // convert date
  convertdepart(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
    // "onwardJourneyDate":"29-08-2019",
  }
  //For DropDown
  public CValue: String;
  onChange(CValue, i) {
    //console.log("Value of selected class" + CValue + "index" + i);
    this.flightwidget[i].SelectedeconomyType = CValue;
    //console.log("After selection" + JSON.stringify(this.flightwidget));
    let val;
       if (CValue == 1) {        
      val = "Economy";
    } 
     else  if (CValue == 2) {        
      val = "Premium Economy";
    }
     else if (CValue == 3) {        
      val = "Business Class";
    }
    else if (CValue == 4) {        
      val = "First Class";
    } 
    if(i == 0){
      var obj=[val,CValue];
      //console.log(obj);
      localStorage.setItem("EconomyData" ,JSON.stringify(obj));
      sessionStorage.setItem("EconomyData" ,JSON.stringify(obj));

    }   
  }
  destDetails = [];
  OriginDetails = [];
  swap(i) {

    //console.log("i::" + i);
    if(this.flightwidget[i].origin == "From")
    {
      let snackBarRef11 = this._snackBar.open(
        "Please Select Your Origin",
        "",
        {
          duration: 1000
        }
      );
      return;
    }
    if(this.flightwidget[i].destination == "To")
    {
      let snackBarRef11 = this._snackBar.open(
        "Please Select Your Destination",
        "",
        {
          duration: 1000
        }
      );
      return;
    }
    //console.log("Before Swap", this.flightwidget);
    const temp = this.flightwidget[i].origin;
        this.flightwidget[i].origin = this.flightwidget[i].destination;
        this.flightwidget[i].destination = temp;
        const temp1 = this.flightwidget[i].OriginairportName;
        this.flightwidget[i].OriginairportName = this.flightwidget[i].DestinationairportName;
        this.flightwidget[i].DestinationairportName = temp1;
    // for (let j = 0; j < this.flightwidget.length; j++) {
    //   if(this.flightwidget[i].origin == "From")
    //   {
    //     let snackBarRef11 = this._snackBar.open(
    //       "Please select Origin",
    //       "",
    //       {
    //         duration: 1000
    //       }
    //     );
    //     return;
    //   }
    //   if(this.flightwidget[i].destination == "To")
    //   {
    //     let snackBarRef11 = this._snackBar.open(
    //       "Please select Destination",
    //       "",
    //       {
    //         duration: 1000
    //       }
    //     );
    //     return;
    //   }
    //   if (j == i) {
    //     const temp = this.flightwidget[i].origin;
    //     this.flightwidget[i].origin = this.flightwidget[i].destination;
    //     this.flightwidget[i].destination = temp;
    //     const temp1 = this.flightwidget[i].OriginairportName;
    //     this.flightwidget[i].OriginairportName = this.flightwidget[i].DestinationairportName;
    //     this.flightwidget[i].DestinationairportName = temp1;
    //   }
    //   if (i == 0) {
    //     this.flightwidget[i + 1].origin = this.flightwidget[i].destination;
    //     this.flightwidget[i + 1].OriginairportName = this.flightwidget[i].DestinationairportName;
    //   } else if (i != this.flightwidget.length - 1) {
    //     this.flightwidget[i - 1].destination = this.flightwidget[i].origin;
    //     this.flightwidget[i - 1].DestinationairportName = this.flightwidget[i].OriginairportName;
    //     this.flightwidget[i + 1].origin = this.flightwidget[i].destination;
    //     this.flightwidget[i + 1].OriginairportName = this.flightwidget[i].DestinationairportName;
    //   } else {
    //     this.flightwidget[i - 1].destination = this.flightwidget[i].origin;
    //     this.flightwidget[i - 1].DestinationairportName = this.flightwidget[i].OriginairportName;
    //   }
      this.destDetails = [];
      this.OriginDetails = [];
      //console.log("After Swap flightwidget)", this.flightwidget);
      let obj={
        airportCode :this.flightwidget[0]["origin"],
        airportName :this.flightwidget[0]["OriginairportName"] 
      }
      this.OriginDetails.push(obj);
     // //console.log(this.OriginDetails);
      localStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));
      sessionStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));

      let obj1={
        airportCode :this.flightwidget[0]["destination"],
        airportName :this.flightwidget[0]["DestinationairportName"] 
      }
      this.destDetails.push(obj1);
      ////console.log(this.destDetails);
      localStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));
      sessionStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));

   // }
    //-----for multicity url
    if(i == 0){
     let ctnames = localStorage.getItem("cityDetails"); 
     //console.log("citynames:"+ ctnames);
     this.ctdetail = JSON.parse(ctnames);     
      //console.log(this.ctdetail)
      if(this.ctdetail != null)
      {
           let tp;
           tp = this.ctdetail['Origin'];
           this.ctdetail['Origin'] =  this.ctdetail['Destination'];
           this.ctdetail['Destination'] = tp;

          let citynames = {
            Origin :   this.ctdetail['Origin'] ?  this.ctdetail['Origin'] :'',
            Destination :  this.ctdetail['Destination']?   this.ctdetail['Destination']:''
          }
        // //console.log(citynames);
         localStorage.setItem("cityDetails",JSON.stringify(citynames));
         sessionStorage.setItem("cityDetails",JSON.stringify(citynames));

    }
    }
    //-----for multicity url
  }



  getTravellerDateCount: Subscription;
  getAllTravellerDate() {
    this.getTravellerDateCount = this.sendTravelerData.getTravellerCount.subscribe(
      res => {
        if (res) {
          //console.log(res);
          this.travellers = res;
          this.allAdult = res["adult"];
          this.allChild = res["children"];
          this.allInfant = res["infants"];
          this.total_traveller =
            res["adult"] + res["children"] + res["infants"];
         //////////////
         //////////////SEND THESE DATA ON OPEN

         this.sendAdultCount =  this.allAdult;
         this.sendChildCount =  this.allChild;
         this.sendInfantCount =  this.allInfant;
    
        }
      }
    );
  }

  //validation code if fields are empty
  openSnackBar(message: string, action: string) {
    let message2 = message;
    let action2 = action;
    // let mydeparting = departing;
    if (message2 == action2) {
      let snackBarRef11 = this._snackBar.open(
        "Origin and Destination can't be same",
        "",
        {
          duration: 1000
        }
      );
      setTimeout(() => {
        this.bottomSheet.open(DestinationListModalComponent);
      }, 1100);
    } else if (message2 == "") {
      let snackBarRef1 = this._snackBar.open("Please Select Your Origin", "", {
        duration: 1000
      });
    } else if (action2 == "") {
      let snackBarRef1 = this._snackBar.open("Please Select Your Destination", "", {
        duration: 1000
      });
    }
  }
  public addresses: any[] = [
    //To Remove
    {},
    {}
  ];


  addAddress() {
    this.flightwidget.push({
      origin:this.flightwidget[this.flightwidget.length - 1].destination != "To"? this.flightwidget[this.flightwidget.length - 1].destination : "From",
      destination: "To",
      OriginairportName: this.flightwidget[this.flightwidget.length - 1].DestinationairportName != "Select Destination" ? this.flightwidget[this.flightwidget.length - 1].DestinationairportName:"Select Origin",
      DestinationairportName:"Select Destination",
      SelectedeconomyType: 1,
      JourneyDate: ""
    });

  // addAddress() {
  //   this.flightwidget.push({
  //     origin:this.flightwidget[this.flightwidget.length - 1].destination != "To"? this.flightwidget[this.flightwidget.length - 1].destination : "From",
  //     destination: "",
  //     OriginairportName: this.flightwidget[this.flightwidget.length - 1].DestinationairportName,
  //     DestinationairportName: "",
  //     SelectedeconomyType: 1,
  //     JourneyDate: ""
  //   });
    this.addresses.push({
      originN: "",
      destN: "",
      dateN: "",
      classN: ""
    });
  }
  removeAddress() {
    //this.addresses.splice(1);
    let length = this.flightwidget.length;
    if (length > 2) {
      this.flightwidget.pop();
      localStorage.setItem("MulticityData" , JSON.stringify(this.flightwidget));
      sessionStorage.setItem("MulticityData" , JSON.stringify(this.flightwidget));

    } 
  }
  flightwidgetObj = [];
  ValidationFun() {
  ////console.log(this.flightwidgetObj);  
    this.flightwidgetObj = [];
  ////console.log("Final List to push:" + JSON.stringify(this.flightwidget));  
    for (let i = 0; i < this.flightwidget.length ; i++) {
      //console.log(this.flightwidget);
      if (this.flightwidget[i].origin == "From") {
        let snackBarRef11 = this._snackBar.open(
          "Please Select Your Origin",
          "",
          {
            duration: 1000
          }
        );        
        return false;
      }
      else if (this.flightwidget[i].destination == "To") {
        let snackBarRef11 = this._snackBar.open(
          "Please Select Your Destination",
          "",
          {
            duration: 1000
          }
        );        
        return false;
      }
     else if (this.flightwidget[i].origin == this.flightwidget[i].destination) {
        let snackBarRef11 = this._snackBar.open(
          "Origin and Destination can't be same",
          "",
          {
            duration: 1000
          }
        );
        // console.log(
        //   this.flightwidget[i].origin == this.flightwidget[i].destination
        // );
        return false;
      } else if (this.flightwidget[i].JourneyDate == "") {
        let snackBarRef11 = this._snackBar.open("Please Select Departing Date", "", {
          duration: 1000
        });
        //console.log(this.flightwidget[i].JourneyDate == "");
        return false;
      } else {
        let JD = this.convertdepart(this.flightwidget[i].JourneyDate);
     //   //console.log(JD);      
        this.flightwidgetObj.push({
          origin: this.flightwidget[i].origin,
          destination: this.flightwidget[i].destination,
          cabinClass: this.flightwidget[i].SelectedeconomyType,
          onwardJourneyDate: JD
        });
      }
    }
    //console.log(this.flightwidgetObj);
    return true;
  }
  multiFlight() {
  this.flightService.sendCardSate(true);

    localStorage.removeItem('bookingURL');

        sessionStorage.removeItem("affilatePartnerId");

   // this.flightService.sendpagerefresh('noRefresh');
   this.flightService.sendpagerefresh('noRefresh');

   localStorage.removeItem('UMOpaxinfoinfant');
   localStorage.removeItem('UMOonwrdate');
    localStorage.removeItem('UMOcabinclass');
    localStorage.removeItem('UMOpaxinfo');
  localStorage.removeItem('UMOpaxinfochild');
      localStorage.removeItem('UMOcabinclassreturn');

    localStorage.removeItem('returnwaydepartDate');
    localStorage.removeItem('returnwayreturnDate');
    //
    sessionStorage.removeItem('returnwaydepartDate');
    sessionStorage.removeItem('returnwayreturnDate');
    //
    localStorage.removeItem('checkedList1');
    localStorage.removeItem('serviceVendor');
    sessionStorage.removeItem('serviceVendor');

    localStorage.removeItem('returnwayreturnDate');
    localStorage.removeItem('tripType');
    localStorage.removeItem('tripround');
    //
    sessionStorage.removeItem('tripType');
    sessionStorage.removeItem('tripround');

    localStorage.removeItem('Filtered_Data');
    localStorage.removeItem('BOOKRN');
    localStorage.removeItem('checkedList1');
    localStorage.removeItem('Filtered_Data');
  


    
    
    let idx:any = 0
    localStorage.setItem('sortedBy','PriceLH');
    localStorage.setItem('currentindex',idx);
//
sessionStorage.setItem('sortedBy','PriceLH');
sessionStorage.setItem('currentindex',idx);

    let field = {
      adult: this.allAdult ? this.allAdult : 1,
      children: this.allChild ? this.allChild : 0,
      infants:  this.allInfant ? this.allInfant : 0,
      
    };
    this.sendTravelerData.sendtravllers(field);
    // if (this.travellers) {
    //   this.sendTravelerData.sendtravllers(this.travellers);
    // } else {
    //   let field = {
    //     adult: 1,
    //     children: 0,
    //     infants: 0
    //   };
    //   this.sendTravelerData.sendtravllers(field);
    // }
    localStorage.setItem("tripType", "multicity");
    sessionStorage.setItem("tripType", "multicity");

    let val = this.ValidationFun();
    ////console.log(val);
    //console.log(this.flightwidgetObj);
    if (val == true) {
      this.flightService.sendflightwidget(this.flightwidgetObj);
    //  console.warn(this.multyWayform.value);
      var reqbody1 = {
        currencyCode: this.branchCurrencyCode,
        flightSearchWidgetList: this.flightwidgetObj,
        noOfAdult: this.allAdult ? this.allAdult : 1,
        noOfChild: this.allChild ? this.allChild : 0,
        noOfInfant: this.allInfant ? this.allInfant : 0,
        tripType: "multicity",
        groupId: this.groupId,
        countryId: this.countryId
      };
      //console.log("Request Body of multicity",reqbody1);
     
      let lengthss = reqbody1.flightSearchWidgetList.length-1;
      //console.log("final last jurny date",reqbody1.flightSearchWidgetList[lengthss]['onwardJourneyDate']);
      //console.log("final first date",reqbody1.flightSearchWidgetList[0]['onwardJourneyDate']);

      this.multicityLastJourneyDate = reqbody1.flightSearchWidgetList[lengthss]['onwardJourneyDate']
      this.globalService.sendReturnDataDate(this.multicityLastJourneyDate);

      localStorage.setItem("returnwaydepartDate",reqbody1.flightSearchWidgetList[0]['onwardJourneyDate']);
      localStorage.setItem("returnwayreturnDate",this.multicityLastJourneyDate);
      ///
      sessionStorage.setItem("returnwaydepartDate",reqbody1.flightSearchWidgetList[0]['onwardJourneyDate']);
      sessionStorage.setItem("returnwayreturnDate",this.multicityLastJourneyDate);
      //-------------------

      this.flightService.getflights(reqbody1).subscribe(res => {
        //console.log(res);
        let sendDataToSerachComponent = {
          'response':res,
          'reqbody':reqbody1
        };
       // this.flightwidgetObj = [];
        let arrayFlight=[];
        arrayFlight=this.flightwidget;
        //console.log(arrayFlight);
        //console.log(this.flightwidget);
        //console.log(this.flightwidgetObj);
        this.flightwidget=[];
        for(let i=0;i<=arrayFlight.length-1;i++){
          var obj = {            
              origin:arrayFlight[i]? arrayFlight[i].origin:'From',
              destination: arrayFlight[i]? arrayFlight[i].destination:'To',
              OriginairportName :arrayFlight[i]? arrayFlight[i].OriginairportName :'Select Origin',
              DestinationairportName:arrayFlight[i]? arrayFlight[i].DestinationairportName:'Select Destination',
              JourneyDate: arrayFlight[i]? arrayFlight[i].JourneyDate:"",
              SelectedeconomyType: arrayFlight[i]? arrayFlight[i].SelectedeconomyType:1
            }
            if(obj.origin != 'From' || obj.destination != 'To')
               this.flightwidget.push(obj);
        }
        this.flightwidgetObj = [];
        ////console.log(this.flightwidget);
        localStorage.setItem("MulticityData" , JSON.stringify(this.flightwidget));
        ///sending API data to search result component
        sessionStorage.setItem("MulticityData" , JSON.stringify(this.flightwidget));

        this.flightService.sendonewaydata(sendDataToSerachComponent);

      });
      
               //WebEngage----------------------------------------------------------------
 
               var s = document.createElement("script");
               s.type = "text/javascript";
               s.src = "assets/js/webEngage.js";
               s.id = '_webengage_script_tag';
               $("head").append(s);
        
             //------------------webengage----------------------------------------------    

             let webdata =  sessionStorage.getItem("MulticityData");
             this.webMulticity = JSON.parse(webdata);
             //console.log(this.webMulticity)
             let webMultictyData = [];
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
                   date1: this.webMulticity && this.webMulticity[i] && this.webMulticity[i].JourneyDate ? this.webMulticity[i].JourneyDate : "",
                   departCabinClass:webcc 
                 }
                 webMultictyData.push(obj);
           }
           //console.log(webMultictyData);
           webengage.track("Search-Flight", {
             "Type"                  : "Multi-city Search",          			              			    
             "No of Adults"          : this.allAdult  ? this.allAdult  : 1+"Adult",
             "No of Children"        : this.allChild  ? this.allChild  : 0+"Child",
             "No of Infants"         : this.allInfant ? this.allInfant : 0+"Infant",
            //  "Aliance Airlines"      : " ",
            //  "Prefered Airlines"     : " ",          			    
             "Trips"  : [
             {
                       "Trip1"           :  [
                         {                 				            				    
                           "Origin Airport" 		   : webMultictyData[0].startingFrom,
                           "Origin Name"           : webMultictyData[0].startingFromCity,
                           "Destination Airport"   : webMultictyData[0].goingTo,
                           "Destination Name"      : webMultictyData[0].goingToCity,
                           "Departing Date"        : webMultictyData[0].date1,
                           "Depating Flight Class" : webMultictyData[0].departCabinClass,
                         },	
                       ],	
                       "Trip2"           :  [
                         { 
                           "Origin Airport" 	     : webMultictyData[1].startingFrom,
                           "Origin Name"           : webMultictyData[1].startingFromCity,
                           "Destination Airport"   : webMultictyData[1].goingTo,
                           "Destination Name"      : webMultictyData[1].goingToCity,
                           "Departing Date"        : webMultictyData[1].date1,
                           "Depating Flight Class" : webMultictyData[1].departCabinClass,
                         },	
                       ],	
                       "Trip3"           :  [
                         { 
                           "Origin Airport" 		   : webMultictyData[2].startingFrom,
                           "Origin Name"           : webMultictyData[2].startingFromCity,
                           "Destination Airport"   : webMultictyData[2].goingTo,
                           "Destination Name"      : webMultictyData[2].goingToCity,
                           "Departing Date"        : webMultictyData[2].date1,
                        "Depating Flight Class"    : webMultictyData[2].departCabinClass,
                         },	
                       ],	
                       "Trip4"           :  [
                         { 
                           "Origin Airport" 	     : webMultictyData[3].startingFrom,
                           "Origin Name"           : webMultictyData[3].startingFromCity,
                           "Destination Airport"   : webMultictyData[3].goingTo,
                           "Destination Name"      : webMultictyData[3].goingToCity,
                           "Departing Date"        : webMultictyData[3].date1,
                        "Depating Flight Class"    : webMultictyData[3].departCabinClass,
                         },	
                       ],	
                       "Trip5"           :  [
                         { 
                           "Origin Airport" 		   : webMultictyData[4].startingFrom,
                           "Origin Name"           : webMultictyData[4].startingFromCity,
                           "Destination Airport"   : webMultictyData[4].goingTo,
                           "Destination Name"      : webMultictyData[4].goingToCity,
                           "Departing Date"        : webMultictyData[4].date1,
                        "Depating Flight Class"    : webMultictyData[4].departCabinClass,
                         },	
                       ],	
                       "Trip6"           :  [
                         { 
                           "Origin Airport" 	     : webMultictyData[5].startingFrom,
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

       
      this.flightService.sendoddata('');
    //  this.router.navigate(["/searchresult"]);
        //console.log(this.ctdetail)
        this.OriginAirportCityName = this.flightwidget[0].originCityName ? this.flightwidget[0].originCityName.replace(/\s/g, '-') : (this.ctdetail && this.ctdetail['Origin'] ? this.ctdetail['Origin'].replace(/\s/g, '-'):'');
        this.DestinationAirportCityName = this.flightwidget[0].destinationCityName ? this.flightwidget[0].destinationCityName.replace(/\s/g, '-') : (this.ctdetail && this.ctdetail['Destination'] ? this.ctdetail['Destination'].replace(/\s/g, '-'):'');
        //console.log(this.OriginAirportCityName)
        //console.log(this.DestinationAirportCityName)
     //this.router.navigate( [this.countryCode+'/'+this.language+'/'+'cheap-flights/'+'search/'+'multi']);
    if(this.OriginAirportCityName && this.DestinationAirportCityName)
      this.router.navigate( [this.countryCode+'/'+this.language+'/'+'cheap-flights/'+'search/'+this.OriginAirportCityName+'-to-'+this.DestinationAirportCityName+'/'+this.flightwidget[0].origin+'-'+this.flightwidget[0].destination+'/Multi']);
    else
      this.router.navigate( [this.countryCode+'/'+this.language+'/'+'cheap-flights/'+'search/'+'Multi']);
    }

    


  }
  //////////////
  calenderdata() {
    this.subscriptiondata = this.sendTravelerData
      .getonewaycalenderdata()
      .subscribe(data2 => {
        this.fulldatefromcalender = data2.text2;
        this.departDate = this.fulldatefromcalender;
        ////console.log(data2);
        this.multyWayform.patchValue({
          returnwaydepartDate: this.fulldatefromcalender
        });
      });
  }
  removeDuplicatesJSON(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  popularcity() {
    this.servicedatas = this.globalService.getpopularcity(this.countryId).subscribe((popcity) => {
     // this.servicedatas = this.originDestinationService.getpopcity().subscribe((popcity)=>{

   // //console.log(popcity);
    let calData=localStorage.getItem("DateForAll"); 
    if(calData){
      // //console.log("Data from local storage:"+ new Date(calData));
   }

    if(popcity['statusMessage'] == 'success'){

     this.citys = popcity;
    // //console.log(this.citys);
     this.sendPopularCityList(popcity)
     let citynew = popcity['cityAndAirportDataList'];
     this.originlistfinal = citynew[1];
     this.destlistfinal =  citynew[2];
    //  this.originlistfinal2 = citynew[3];
     this.destlistfinal2 =  citynew[3];


    // this.flightwidget = [
    //   {
    //     origin: this.Dataorigin?this.Dataorigin: 'From',
    //     destination:  this.Datadestination? this.Datadestination:'To',
    //     OriginairportName : this.DataOriginairportName ? this.DataOriginairportName: 'Select Origin',
    //     DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:'Select Destination',
    //     JourneyDate: calData ? new Date(calData) : "" ,
    //     SelectedeconomyType: this.ccData
    //   },
    //   {
    //     origin: this.Datadestination? this.Datadestination: 'From',
    //     destination :'To',
    //     OriginairportName : this.DataDestinationairportName? this.DataDestinationairportName: 'Select Origin',
    //     DestinationairportName:"Select Destination",
    //     JourneyDate: "",
    //     SelectedeconomyType: 1
    //   }
    // ];
    //newForReload
    if(this.multicityDetails){
      this.flightwidget= [];
      for(let i=0;i<this.multicityDetails.length;i++)
      {     
        if(i == 0){
        ////console.log(i+":"+this.flightwidget);
        var obj = {            
         origin: this.Dataorigin?this.Dataorigin:(this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin'] :'From'),
         destination:  this.Datadestination? this.Datadestination:(this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To'),
         OriginairportName : this.DataOriginairportName ? this.DataOriginairportName:(this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']: 'Select Origin'),
         DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:(this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination'),
         JourneyDate: calData ?  new Date(calData) :(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
         SelectedeconomyType: this.ccData ?this.ccData: (this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1)
         }
         this.flightwidget.push(obj);
        // //console.log(i+":--"+this.flightwidget);
         }
         if(i == 1){
           ////console.log(i+":"+this.flightwidget);
           var obj = {        
             origin:this.Datadestination? this.Datadestination:(this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin']:'From'),
             destination: this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To',
             OriginairportName :this.DataDestinationairportName? this.DataDestinationairportName:(this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']:'Select Origin'),
             DestinationairportName:  this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination',
             JourneyDate: calData ? "" :(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
             SelectedeconomyType: this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1
           }
            this.flightwidget.push(obj);
            ////console.log(i+":--"+this.flightwidget);
          }
        else if(i>1)
         {
          ////console.log(i+":"+this.flightwidget);
        var obj = {        
               origin: this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin'] :'From',
               destination: this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To',
               OriginairportName : this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']: 'Select Origin',
               DestinationairportName:  this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination',
               JourneyDate:  calData ? "":(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
               SelectedeconomyType: this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1
             }
            this.flightwidget.push(obj);
            ////console.log(i+":--"+this.flightwidget);
         }
         ////console.log(this.flightwidget);
      }
     }
  else
  {
    this.flightwidget = [
      {
        origin: this.Dataorigin?this.Dataorigin: 'From',
        destination:  this.Datadestination? this.Datadestination:'To',
        OriginairportName : this.DataOriginairportName ? this.DataOriginairportName: 'Select Origin',
        DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:'Select Destination',
        JourneyDate: calData ? new Date(calData) : "" ,
        SelectedeconomyType: this.ccData ? this.ccData :1,
      },
      {
        origin:this.Datadestination? this.Datadestination: 'From',
        destination :'To',
        OriginairportName : this.DataDestinationairportName? this.DataDestinationairportName: 'Select Origin',
        DestinationairportName:"Select Destination",
        JourneyDate: "",
        SelectedeconomyType:1
      }
    ];
  }

    }else{
        this.sendPopularCityList({
          'popularCityRes':false
        })
      
        // this.flightwidget = [
        //   {
        //     origin: this.Dataorigin?this.Dataorigin: 'From',
        //     destination:  this.Datadestination? this.Datadestination:'To',
        //     OriginairportName : this.DataOriginairportName ? this.DataOriginairportName: 'Select Origin',
        //     DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:'Select Destination',
        //     JourneyDate: calData ? new Date(calData) : "" ,
        //     SelectedeconomyType: this.ccData
        //   },
        //   {
        //     origin: this.Datadestination? this.Datadestination: 'From',
        //     destination :'To',
        //     OriginairportName : this.DataDestinationairportName? this.DataDestinationairportName: 'Select Origin',
        //     DestinationairportName:"Select Destination",
        //     JourneyDate: "",
        //     SelectedeconomyType: 1
        //   }
        // ];
        if(this.multicityDetails){
          this.flightwidget= [];
          for(let i=0;i<this.multicityDetails.length;i++)
          {     
            if(i == 0){
            ////console.log(i+":"+this.flightwidget);
            var obj = {            
             origin: this.Dataorigin?this.Dataorigin:(this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin'] :'From'),
             destination:  this.Datadestination? this.Datadestination:(this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To'),
             OriginairportName : this.DataOriginairportName ? this.DataOriginairportName:(this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']: 'Select Origin'),
             DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:(this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination'),
             JourneyDate: calData ?  new Date(calData) :(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
             SelectedeconomyType: this.ccData ?this.ccData: (this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1)
             }
             this.flightwidget.push(obj);
            // //console.log(i+":--"+this.flightwidget);
             }
             if(i == 1){
               ////console.log(i+":"+this.flightwidget);
               var obj = {        
                 origin:this.Datadestination? this.Datadestination:(this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin']:'From'),
                 destination: this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To',
                 OriginairportName :this.DataDestinationairportName? this.DataDestinationairportName:(this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']:'Select Origin'),
                 DestinationairportName:  this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination',
                 JourneyDate: calData ? "" :(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
                 SelectedeconomyType: this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1
               }
                this.flightwidget.push(obj);
                ////console.log(i+":--"+this.flightwidget);
              }
            else if(i>1)
             {
              ////console.log(i+":"+this.flightwidget);
            var obj = {        
                   origin: this.multicityDetails[i]['origin'] ?this.multicityDetails[i]['origin'] :'From',
                   destination: this.multicityDetails[i]['destination'] ?this.multicityDetails[i]['destination']:'To',
                   OriginairportName : this.multicityDetails[i]['OriginairportName'] ?this.multicityDetails[i]['OriginairportName']: 'Select Origin',
                   DestinationairportName:  this.multicityDetails[i]['DestinationairportName'] ?this.multicityDetails[i]['DestinationairportName']:'Select Destination',
                   JourneyDate:  calData ? "":(this.multicityDetails[i]['JourneyDate'] ? new Date(this.multicityDetails[i]['JourneyDate']): "") ,
                   SelectedeconomyType: this.multicityDetails[i]['SelectedeconomyType'] ? this.multicityDetails[i]['SelectedeconomyType']:1
                 }
                this.flightwidget.push(obj);
                ////console.log(i+":--"+this.flightwidget);
             }
             ////console.log(this.flightwidget);
          }
         }
       else
       {
         this.flightwidget = [
           {
             origin: this.Dataorigin?this.Dataorigin: 'From',
             destination:  this.Datadestination? this.Datadestination:'To',
             OriginairportName : this.DataOriginairportName ? this.DataOriginairportName: 'Select Origin',
             DestinationairportName:  this.DataDestinationairportName? this.DataDestinationairportName:'Select Destination',
             JourneyDate: calData ? new Date(calData) : "" ,
             SelectedeconomyType: this.ccData ? this.ccData :1,
           },
           {
             origin: this.Datadestination? this.Datadestination:'From',
             destination :'To',
             OriginairportName : this.DataDestinationairportName? this.DataDestinationairportName: 'Select Origin',
             DestinationairportName:"Select Destination",
             JourneyDate: "",
             SelectedeconomyType: 1
           }
         ];
       }
     
    }
     });
 }

 sendPopularCityList(data) {
  this.originDestinationService.sendpopcity(data);
}

 getorigin(){
  this.originDestinationService.getOrigin().subscribe((res) => {
  //console.log('origin form origin modal',res)
  })
}
getdest(){
  this.originDestinationService.getDestination().subscribe((res) => {
    //console.log('destination form origin modal',res)
      })
}

routerEvent;
getRouterDetails() {
  this.flightwidgetObj = [];
 this.routerEvent = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      let element = (document.querySelector('ion-backdrop') as HTMLElement);
      ////console.log(element);
      if(element != null){
        element.click();
      }
    }
  });
}

gettravllerfromservice(){
  this.travSub =  this.sendTravelerData.gettravller().subscribe(res=>{
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
ngOnDestroy(): void {
  this.travSub.unsubscribe();
  this.subscription.unsubscribe();
  // this.origindata.unsubscribe();
  this.indexsub.unsubscribe();
  localStorage.removeItem("multidate");
  this.routerEvent.unsubscribe();
}
data(){
  
}
}
