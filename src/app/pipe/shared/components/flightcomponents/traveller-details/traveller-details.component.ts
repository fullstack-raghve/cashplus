import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ViewChildren,
  QueryList,
  Inject,
  ElementRef,
  Renderer2
} from "@angular/core";
import {
  MatBottomSheet,
  MAT_BOTTOM_SHEET_DATA,
  MatExpansionPanel,
  MatDialog
} from "@angular/material";
import { Router, NavigationEnd } from "@angular/router";
import { PickTravellerComponent } from "./pick-traveller/pick-traveller.component";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { AuthServices } from "src/app/services/auth.service";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { FlightService } from "src/app/services/flight.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { setIndex } from "@ionic-native/core/decorators/common";
import { ModalController } from "@ionic/angular";
import { GuestLoginComponent } from "../../common shared component/guest-login/guest-login.component";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { Subscription, from } from "rxjs";
import { AddAdultComponent } from "./add-adult/add-adult.component";
import swal from 'sweetalert2';

import {
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  NgForm,
  Validators
} from "@angular/forms";
import { copyStyles } from "@angular/animations/browser/src/util";
import { FareDetailsComponent } from "../fare-details/fare-details.component";
import * as moment from "moment";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { concatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import * as country from "../../../../../constants/new-countries.constant";
import { ViewportScroller } from '@angular/common';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
interface Contact {
  name: string;
  age: number;
  email: string;
}

@Component({
  selector: "app-traveller-details",
  templateUrl: "./traveller-details.component.html",
  styleUrls: ["./traveller-details.component.scss"]
})
export class TravellerDetailsComponent implements OnInit {
  helperArray: Array<any> = [];
  helperArrayinfant: Array<any> = [];
  language = 'en'
  userdetail: any;
  // messageToChild: string
  messageToChild = "hjhjhjhj";
  islogin: any;
  //helperArray: Array<any>;
  helperArraychild: Array<any> = [];
  sliderOpts = {
    zoom: false,
    slidesPerView: 3.8,
    spaceBetween: 0,
  };
  show = false;
  hide: any;
  returwaydata: any;
  groups: any;
  seladult: string;
  selchildren: string;
  selinfants: string;
  var: any;
  loading = true;

  adult: any;
  child: any;
  infant: any;
  adultdefault: any;
  children: any;
  infants: any;
  adultnew: any;
  subscribe: any;
  selectedflight2: any;
  selectedflightreturnway: any;
  selectedflight: any;
  infantshedr: any;
  childrenhedr: any;
  adulthedr: any;
  finalorigin: any;
  finaldest: any;
  myeconomyonward: any;
  myeconomyreturn: any;
  departDate: any;
  returnDate: any;
  test: any;
  adulttravller: any;
  newtravller: any;
  multiflight: any;
  cp: any;
  branchCode: any;
  cprice: any;
  contacts: Observable<Contact[]>;
  infnt: {};
  indexSub: Subscription;
  newinfant: any;
  getindexinfant: any;
  indexSubinfant: Subscription;
  getindexadult: any;
  indexSubadult: Subscription;
  newadult = "";
  getindexchild: any;
  indexSubchild: Subscription;
  newchild: any;
  travSub: Subscription;
  obj;
  addAdultData;
  addchildData;
  addinfantData;
  dataobj;
  imgsList = [
    {
      imgurl: "assets/icons/flights/group1.png",
      name: "RAM"
    },
    {
      imgurl: "assets/icons/flights/group2.png",
      name: "RAMYA"
    },

    {
      imgurl: "assets/icons/flights/group1.png",
      name: "GOUDA"
    },
    {
      imgurl: "assets/icons/flights/group2.png",
      name: "RARE"
    },
    {
      imgurl: "assets/icons/flights/group1.png",
      name: "UI"
    },
    {
      imgurl: "assets/icons/flights/group2.png",
      name: "RAMAHAU"
    }
  ];
  currentCountry;
  @ViewChild(AddAdultComponent) private adultComponent: AddAdultComponent;
  loginemail: string;
  tripType: string;
  displayfareoneway: number;
  returnwaycurreny: any;
  confirFlightPageURL: string;
  refreshedDest: string;
  refreshedOrigin: string;
  returnwayreturnDate: string;
  returnwaydepartDate: string;
  FlightOnwardCarrier: string;
  FlightReturnCabinClass: string;
  FlightOnwardCabinClass: string;
  countryCode: string;
  multiCityCurrency: any;
  multiflightFare: number;

  constructor(
    private bottomSheet: MatBottomSheet,
    public modalController: ModalController,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd: ChangeDetectorRef,
    private flightService: FlightService,
    private sendTravelerData: SendTravllerDataService,
    private _authService: AuthServices,
    private router: Router,
    private profileControllerService: ProfileControllerService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private vps: ViewportScroller,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cookieService: CookieService,
    public dialog: MatDialog,
  ) {
    ////console.log('i am from construtor >>vvimp1');

   // this.router.events.subscribe(event => {
    ////console.log('i am from construtor >>vvimp2');
    //this.gettravllerfromservice();
    //this.addAdultDataArrray();
    //this.addChildDataArrray();
    //this.addInfantDataArrray();

   // this.formInizialize();
 // });
  }

  getIndex;

  adultFormGroup: FormGroup;
  cars = [
    {
      firstName: "",
      lastName: "",
      dob: "",
      mobileNo: "",
      passportNo: "",
      edate: "",
      nationality: ""
    },
    {
      firstName: "",
      lastName: "",
      dob: "",
      mobileNo: "",
      passportNo: "",
      edate: "",
      nationality: ""
    },
    {
      firstName: "",
      lastName: "",
      dob: "",
      mobileNo: "",
      passportNo: "",
      edate: "",
      nationality: ""
    }
  ];
  public adultArray = [];
  public ChildArray = [];
  public infantArray = [];
  profileLoad = true;
  dummMaleImage = 'assets/icons/flights/testimonials-male.png';
  dummyFemaleImage = 'assets/icons/flights/femalenew.png';

  adult_male_icon_dummy = 'assets/traveller_icons/male_adult.png';
  adult_female_icon_dummy = 'assets/traveller_icons/female_adult.png';

  child_male_icon_dummy = 'assets/traveller_icons/boy_child.png';
  child_female_icon_dummy = 'assets/traveller_icons/girl_child.png';

  infant_male_icon_dummy = 'assets/traveller_icons/boy_infant.png';
  infant_female_icon_dummy = 'assets/traveller_icons/girl_infant.png';

ngOnInit() {
  
    //code for mendatory fields
    this.flightService.getDataFromTraveller().subscribe(response => {
      ////console.log('DataFromTravller:', response);
      let data = response;
      this.obj={
        "statusCode": data['statusCode'], 
        "statusMessage": data['statusMessage'],
        "passportValidation":data['passportValidation'] ,
        "nationalityValidation": data['nationalityValidation'],
        "dobValidation": data['dobValidation'] ,
        // "passengerLength":data['passengerLength']
      }
    }); 
    //console.log('FinalDataForTravller:'+ JSON.stringify(this.obj));
   //---------------------
   // this.dataobj = this.obj.passengerLength;
   this.dataobj = 40;
    ////console.log(this.dataobj);



  this.searchPageURL = sessionStorage.getItem("searchPageURL");
  localStorage.removeItem('surchargeAmount');
  localStorage.removeItem('cpo');
  localStorage.removeItem('cpm');
  localStorage.removeItem('cpr');
    this.getRouterDetails();
      let travllerDetailsUrl = this.router.url.substr(1);
      localStorage.setItem('travllerDetailsUrl',travllerDetailsUrl);
    this.confirFlightPageURL = sessionStorage.getItem('confirFlightPageURL');
    this.loginemail = localStorage.getItem('loginemail')
    this.tripType = sessionStorage.getItem('tripType');
    this.islogin = JSON.parse(localStorage.getItem("isLoggedIn"));

    this.getAllCountryList();
    this.currentCountry = localStorage.getItem("countryId");
    this.branchCode = localStorage.getItem("branchCode");
    this.infnt = new Array(3);


    this.gettravllerfromservice();

    this.addAdultDataArrray();
    this.addChildDataArrray();
    this.addInfantDataArrray();

    this.formInizialize();
    //let confirFlightPageURL = this.router.url.substr(1);
   

    this.adultFormGroup.valueChanges.subscribe(
      (res)=>{
        ////console.log(res)
        this.flightService.sendPassengerDetails(res);   //For Validation of Name
        if(this.isSubmtted == true){
          this.getWarnigForm();
        }
      });
  }

 

  ionViewWillEnter() {

    //console.log('i am from ion view entr >>vvimp5');
 
    this.loginemail = localStorage.getItem('loginemail')
    localStorage.removeItem('surchargeAmount');
  localStorage.removeItem('cpo');
  localStorage.removeItem('cpm');
  localStorage.removeItem('cpr');

    this.tripType = sessionStorage.getItem('tripType');
    this.islogin = JSON.parse(localStorage.getItem("isLoggedIn"));
    this.getsingleflightmulti();
    this.getsingleflight();
    this.loadprofile();
  }

  ngAfterViewInit(): void {
    // //console.log('view iniy')
  }

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.closePopup();
      }
    });
  }

  addAdultDataArrray() {
    if (this.adult > 1) {
      for (var i = 1; i <= this.adult; i++) {
        this.helperArray.push({
          adult: i,
          data: ""
        });
      }
    } else {
      for (var i = 1; i <= 1; i++) {
        this.helperArray.push({
          adult: i,
          data: ""
        });
      }
    }
    this.pushFormArrayBody(this.helperArray, this.adultArray);
  }

  addChildDataArrray() {
    if (this.childrenhedr >= 1) {
      for (var i = 1; i <= this.childrenhedr; i++) {
        this.helperArraychild.push({
          child: i
        });
      }
    } else {
      for (var i = 1; i < 1; i++) {
        this.helperArraychild.push({
          child: i
        });
      }
    }
    // //console.log('child array',this.helperArraychild)
    this.pushFormArrayBody(this.helperArraychild, this.ChildArray);
  }

  addInfantDataArrray() {
    if (this.infantshedr >= 1) {
      for (var i = 1; i <= this.infantshedr; i++) {
        this.helperArrayinfant.push({
          infant: i
        });
      }
    } else {
      for (var i = 1; i < 1; i++) {
        this.helperArrayinfant.push({
          infant: i
        });
      }
    }

    // //console.log('infant array',this.helperArrayinfant)
    this.pushFormArrayBody(this.helperArrayinfant, this.infantArray);
  }

  pushFormArrayBody(mainArray: any[], groupArray: any[]) {
    mainArray.forEach(res => {
      groupArray.push({
        firstName: "",
        lastName: "",
        dob: "",
        mobileNo: "",
        passportNo: "",
        passportExpiryDate: "",
        nationality: "",
        isdCode: "",
        tittle: "",
        type: "",
        userImage: "",
        travellerid: "",
        getIsTravellerSelected: "",
        travellerDataNew: ""
      });
    });
    return groupArray;
  }

  totalNoOfTraveller;
  formInizialize() {
    // //console.log('form inialize')
    this.adultFormGroup = this.setUpForm(
      this.adultArray,
      this.ChildArray,
      this.infantArray
    );
    // //console.log(this.adultFormGroup);
  }

  setUpForm(adult: any[], child: any[], infant: any[]) {
    // //console.log('form inialize start')s
    return new FormGroup({
      adultData: new FormArray(
        adult.map(adu => this.createFormControlBody(adu))
      ),
      childData: new FormArray(
        child.map(chil => this.createFormControlBody(chil))
      ),
      infantData: new FormArray(
        infant.map(inf => this.createFormControlBody(inf))
      )
    });
  }

  
  createFormControlBody(car: any) {
    // //console.log('added control')
    return new FormControl(
      {
        firstName: car.firstName,
        lastName: car.lastName,
        dob: car.dob,
        mobileNo: car.mobileNo,
        passportNo: car.passportNo,
        passportExpiryDate: car.passportExpiryDate,
        nationality: car.nationality,
        isdCode: car.isdCode,
        tittle: car.tittle,
        type: car.type,
        userImage: car.userImage,
        travellerid: car.travellerid,
        getIsTravellerSelected: car.getIsTravellerSelected,
        travellerDataNew: car.travellerDataNew
      },
      Validators.required
    );
  }


  currentIndexTraveller;
  travellerType;
  travellerOpen(index, travellerType, id) {
    this.currentIndexTraveller = index;
    this.travellerType = travellerType;
    // //console.log(`scrolling to ${id}`); 

  //  setTimeout(() => {
  //   this.scrollToElementById(id);
  //  }, 500);
  }


  scrollToElementById(id: any) {
    const element = this.__getElementById(id);
    this.scrollToElement(element);
  }

  private __getElementById(id: any) {
    // //console.log("element id : ", id);
    const element = <HTMLElement>document.querySelector(`#${id}`);
    return element;
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({behavior:"smooth", block: 'start', });
  }


  currentSelectedGroupID;
  searchPageURL;
  groupDetails(group) {
    
    let isTimerCookie:any = this.cookieService.check('timerStart');
    // //console.log('is cookie',isTimerCookie)
  if(isTimerCookie == false){
    this.sessionTimeOutPopupShow();
      // swal.fire('', 'Session timeout !!').then(
      //   (res) => {
      //     // //console.log(res);
      //     if(res['value']){
      //       this.router.navigate([this.searchPageURL])
      //     }
      //   }
      // )
    }
    else{
    // //console.log(group["userTraveller"]);
    this.currentSelectedGroupID = group['groupId'];
    let adultArr = [];
    let childArr = [];
    let infantArr = [];
    group["userTraveller"].filter(res => {
      if (res.travellerType == "Adult" || ((res.title ==  null || res.title ==  '') && (res.travellerType == null || res.title ==  '') && res.isPrimaryTraveller == 1)) {
        adultArr.push(res);
      }
      if (res.travellerType == "child" && this.ChildArray.length) {
        childArr.push(res);
      }
      if (res.travellerType == "Infant" && this.infantArray.length) {
        infantArr.push(res);
      }
    });
    // //console.log(adultArr);
    // //console.log(childArr);
    // //console.log(infantArr);
    // adultArr.length == this.adultArray.length ||
    // childArr.length == this.ChildArray.length ||
    // infantArr.length == this.infantArray.length

  
    this.adultFormGroup.reset();
    if (adultArr.length != 0) {
      let adultForm = this.adultFormGroup.get("adultData") as FormArray;
      // adultForm.reset();
      adultArr.forEach((travller, i) => {

        adultForm.controls[i].patchValue({

          firstName: travller.firstName,
          lastName: travller.lastName,
          dob: moment(travller.dob, "YYYY/MM/DD").format("DD/MM/YYYY"),
          mobileNo: travller.mobileNumber,
          passportNo: travller.passportNo,
          passportExpiryDate: moment(travller.passportExpireDate, "YYYY/MM/DD").format("DD/MM/YYYY"),
          nationality:
            travller.passportIssuedCountry != null && travller.passportIssuedCountry != 0
              ? travller.passportIssuedCountry
              : null,
          isdCode: travller.isdCode,
          tittle: travller.title,
          type: travller.travellerType,
          userImage: travller.profileImagePath,
          travellerid: travller.travellerId,
          getIsTravellerSelected: true,
          travellerDataNew: travller

        });
      });
    }
    if (childArr.length != 0) {
      let adultForm = this.adultFormGroup.get("childData") as FormArray;
      // adultForm.reset();
      childArr.forEach((child, i) => {
        adultForm.controls[i].patchValue({
          firstName: child.firstName,
          lastName: child.lastName,
          dob: moment(child.dob, "YYYY/MM/DD").format("DD/MM/YYYY"),
          mobileNo: child.mobileNumber,
          passportNo: child.passportNo,
          passportExpiryDate: moment(child.passportExpireDate, "YYYY/MM/DD").format("DD/MM/YYYY"),
          nationality:
          child.passportIssuedCountry != null && child.passportIssuedCountry != 0
              ? child.passportIssuedCountry
              : null,
          isdCode: child.isdCode,
          tittle: child.title,
          type: child.travellerType,
          userImage: child.profileImagePath,
          travellerid: child.travellerId,
          getIsTravellerSelected: true,
          travellerDataNew: child
        });
      });
    }
    if (infantArr.length != 0) {
      let infantForm = this.adultFormGroup.get("infantData") as FormArray;
      infantForm.reset();
      infantArr.forEach((infant, i) => {
        infantForm.controls[i].patchValue({
          firstName: infant.firstName,
          lastName: infant.lastName,
          dob: moment(infant.dob, "YYYY/MM/DD").format("DD/MM/YYYY"),
          mobileNo: infant.mobileNumber,
          passportNo: infant.passportNo,
          passportExpiryDate: moment(infant.passportExpireDate, "YYYY/MM/DD").format("DD/MM/YYYY"),
          nationality:
            infant.passportIssuedCountry != null &&  infant.passportIssuedCountry != 0
              ? infant.passportIssuedCountry
              : null,
          isdCode: infant.isdCode,
          tittle: infant.title,
          type: infant.travellerType,
          userImage: infant.profileImagePath,
          travellerid: infant.travellerId,
          getIsTravellerSelected: true,
          travellerDataNew: infant
        });
      });
    }

    this.getWarnigForm();

    this.cd.markForCheck();
    this.isSubmtted = true;
  }
  }

  getWarnigForm(){
    let allFormControl = [];
      Object.values(this.adultFormGroup.controls).forEach(key => {
        allFormControl.push(key);
      });
      let allFormData = allFormControl.map(res => {
        res.controls.map((respons, i) => {
          if (res.controls[i].invalid) {
            res.controls[i].markAsDirty();
          }
        });
      });
    let formdata = this.adultFormGroup['value'];
    if(formdata['adultData']){
      formdata['adultData'].forEach((element,i) => {

         if(element['tittle'] == "" &&
          element['firstName'] == "" &&
          element['lastName'] == "" && 
          element['dob'] == null && 
          element['isdCode'] == null && 
          element['mobileNo'] == null && 
          element['passportNo'] ==  null && 
          element['passportExpiryDate'] == null && 
          element['nationality'] == null ){
            element['isValue'] = false;
          }
          else if(element['tittle'] != "" ||
          element['firstName'] != "" ||
          element['lastName'] != "" || 
          element['dob'] == null || 
          element['isdCode'] == null || 
          element['mobileNo'] == null || 
          element['passportNo'] ==  null || 
          element['passportExpiryDate'] == null || 
          element['nationality'] == null ){
            element['isValue'] = true;
          }
         
      });
    }
    if(formdata['childData'] && this.ChildArray.length != 0){
      formdata['childData'].forEach((element,i) => {
       
        if(element['tittle'] == "" &&
        element['firstName'] == "" &&
        element['lastName'] == "" && 
        element['dob'] == null && 
        element['isdCode'] == null && 
        element['mobileNo'] == null && 
        element['passportNo'] ==  null && 
        element['passportExpiryDate'] == null && 
        element['nationality'] == null ){
          element['isValue'] = false;
        }
        else if(element['tittle'] != "" ||
          element['firstName'] != "" ||
          element['lastName'] != "" || 
          element['dob'] == null || 
          element['isdCode'] == null || 
          element['mobileNo'] == null || 
          element['passportNo'] ==  null || 
          element['passportExpiryDate'] == null || 
          element['nationality'] == null ){
            element['isValue'] = true;
          }
       
      });
    }
    if(formdata['infantData'] && this.infantArray.length != 0){
      formdata['infantData'].forEach((element,i) => {
       
        if(element['tittle'] == "" &&
        element['firstName'] == "" &&
        element['lastName'] == "" && 
        element['dob'] == null && 
        element['isdCode'] == null && 
        element['mobileNo'] == null && 
        element['passportNo'] ==  null && 
        element['passportExpiryDate'] == null && 
        element['nationality'] == null ){
          element['isValue'] = false;
        }
        else if(element['tittle'] != "" ||
        element['firstName'] != "" ||
        element['lastName'] != "" || 
        element['dob'] == null || 
        element['isdCode'] == null || 
        element['mobileNo'] == null || 
        element['passportNo'] ==  null || 
        element['passportExpiryDate'] == null || 
        element['nationality'] == null ){
          element['isValue'] = true;
        }
      });
    }
  }

  isSubmtted = false;
  getAllUpdatedTravellerData = [];
  allFormData:any = '';
  continue_adult(form: NgForm) {
    this.bottomSheet.dismiss();
    this.isSubmtted = true;
  
    ///raghve 6
     let isTimerCookie:any = this.cookieService.check('timerStart');
  //  let isTimerCookie:any = true;
 
      if(isTimerCookie == false){
        this.sessionTimeOutPopupShow();
      }else{
    if (!form.valid) {
      this.getWarnigForm();
    } else {            
      //console.log("form value", form.value);
      let adultDataArray:any = '';
      let childDataArray:any = '';
      let infantDataArray:any = '';

      adultDataArray = form.value["adultData"];
      childDataArray = form.value["childData"];
      infantDataArray = form.value["infantData"];
      

      for(let i=0;i<adultDataArray.length;i++)
        {
             if(infantDataArray.length > 0 && infantDataArray[i])
             { 
                      if(adultDataArray[i].firstName.length + adultDataArray[i].lastName.length + (adultDataArray[i].tittle == 2 ? 4 : 3) +
                      infantDataArray[i].firstName.length + infantDataArray[i].lastName.length + (infantDataArray[i].tittle == 3 ? 4 : 6) + 10 > 50)
                      {
                        ////console.log(this.dataobj);
                        return;
                      }
             }
             else if(adultDataArray[i].firstName.length + adultDataArray[i].lastName.length + (adultDataArray[i].tittle == 2 ? 4 : 3) > this.dataobj)
              {
                //console.log("Return");
                return;
              } 
       }     
      if(childDataArray.length > 0)
      {
        for(let i=0;i<childDataArray.length;i++)
        {
          if(childDataArray[i].firstName.length + childDataArray[i].lastName.length + (childDataArray[i].tittle ==  3 ? 4 : 6) > this.dataobj)
          {
            //console.log("Return"+this.dataobj);
            return;
          } 
        }               
      }


      this.allFormData = [
        ...adultDataArray,
        ...childDataArray,
        ...infantDataArray
      ];

      this.getAllUpdatedTravellerData = [];
    
      this.allFormData.forEach(element => {
        let freQuentArray = [];
        let visaArray = [];
        if (element['travellerDataNew'] != '' && element['travellerDataNew'] != null) {
          if(element['travellerDataNew']['frequentFlyer'] && element['travellerDataNew']['frequentFlyer']['length'] != 0){
            element['travellerDataNew']['frequentFlyer'].forEach(element => {
              freQuentArray.push({
                'airline':element['airline'],
              'frequentFlyerNumber' : element['ffNumber']
              })
            });
          }

          if( element['travellerDataNew']['visa']  &&  element['travellerDataNew']['visa']['length'] != 0){
            element['travellerDataNew']['visa'].forEach(visa => {
              visaArray.push({
                visaIssuedCountry: visa['visaIssuedCountry'],
                visNo: visa['visaNo'],
                visaExpiryDate:visa['visaExpDate'],
                visaType:  visa['visaType'],
              })
            });
          }
          let allParameter = {};

          allParameter = {
            title: Number(element["tittle"]),
            dob: moment(element["dob"], "DD/MM/YYYY").format("YYYY-MM-DD"),
            firstName: element["firstName"].trim(),
            lastName: element["lastName"].trim(),
            mobileNo: element["mobileNo"],
            isdCode: element["isdCode"],
            passportIssuedCountry: element["nationality"],
            passportExpireDate:  moment(element["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD"),
            passportNo: element["passportNo"],
            travellerId: element["travellerid"],
            profileImagePath: element["userImage"],
            imageFilePath: null,

            isPrimaryTraveller: element['travellerDataNew']['isPrimaryTraveller'],
            email: element['travellerDataNew']["email"],
            address: element['travellerDataNew']["address"],
            pincode: element['travellerDataNew']["pinCode"],
            city: element['travellerDataNew']["city"],
            country: element['travellerDataNew']["country"],
            state: element['travellerDataNew']["state"],
            passportLastName: element['travellerDataNew'].passportLastName,
            passportMiddleName: element['travellerDataNew'].passportMiddleName,
            passportFirstName: element['travellerDataNew'].passportFirstName,
            userAlias: this.loginemail,
            frequentFlyerList: freQuentArray,
            visaList: visaArray,
          };
           //console.log(allParameter)
          this.getAllUpdatedTravellerData.push(allParameter);
        }
      });
      // //console.log(this.getAllUpdatedTravellerData)

      this.updateAllData(this.getAllUpdatedTravellerData).subscribe(
        (res) => {
          // //console.log(res);
        }
      )

      this.allFormData.forEach(element => {
        element.travellerid = element.travellerid != "" ? element.travellerid : 0;
        element.firstName = element.firstName.trim();
        element.lastName = element.lastName.trim();
      });
      //console.log('travller details final', this.allFormData);

     // localStorage.setItem('passengersList', JSON.stringify(this.allFormData));
      sessionStorage.setItem('passengersList', JSON.stringify(this.allFormData));

      this.router.navigate(["/payment-methods"]);
    
      this.profileControllerService.clearAllProfiletCache();




    }
  }
  }
  updateAllData(allOfflineData: number[]): Observable<any[]> {
    return from(allOfflineData).pipe(
      concatMap(
        data => <Observable<any[]>>this.profileControllerService.editprofile(data))
    )
  }


  getAllTravellerCount;
  gettravllerfromservice() {
    this.travSub = this.sendTravelerData.gettravller().subscribe(res => {
      //console.log('total traveller >>> vvimp',res)
      if (res["trvllerfield"]) {
        var info = res["trvllerfield"];
        this.getAllTravellerCount = info;
        this.adult = info.adult;
        this.adulthedr = info.adult;
        this.childrenhedr = info.children;
        this.infantshedr = info.infants;
      }
    });
  }
  getReponse = true;
  getsingleflight() {
    this.subscribe = this.flightService.getselectedFlight().subscribe(res => {
      // //console.log(res)
      if (res) {
        this.selectedflight2 = res["onwardFlightOption"];
        this.getReponse = true;
        this.selectedflight = res["onwardFlightOption"] != null ? true : false;
        this.selectedflightreturnway = res["roundTripFlightOption"] != null ? true : false;
        ///response --returnway  end
        // if (this.tripType == "returnway") {
        //   this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice']

        // }

        // if (this.tripType == "oneway") {
        //   this.displayfareoneway = this.selectedflight2.flightFare.totalBaseFare + this.selectedflight2.flightFare.totalTax + this.selectedflight2.flightFare.totalFees + this.selectedflight2.flightFare.markupPrice + this.selectedflight2.flightFare.serviceChargePrice - this.selectedflight2.flightFare.discountPrice
        //   // //console.log(this.displayfareoneway)
        // }

        if (this.tripType == "oneway") {
          this.setOnewfare(res["onwardFlightOption"])
        }
        if (this.tripType == "returnway") {
          this.returnwaycurreny =  res["roundTripFlightOption"]['onwardFlightOption']['flightFare']['currency'];
         
          this.setReturnWayfare(res);
        }

      } 
      else if (res == 'multicity') { }
      else {
        let countryCode = localStorage.getItem('countryCode').toLowerCase();
        //console.log(countryCode)
        let setLanguageSetting = 'en';
        this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
        this.getReponse = false;
        //console.log('page refresh', res);
      }
    });
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

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result)
      if (result) {
        if (this.tripType == "oneway") {
          this.setOnewfare(result["onwardFlightOption"])
          this.flightService.selectedFlight(result);
          this.flightService.sendsimilarflightmulti("");
        }
        if (this.tripType == "returnway") {
          this.setReturnWayfare(result);
          this.flightService.selectedFlight(result);
          this.flightService.sendsimilarflightmulti("");
        }
        if (this.tripType == "multicity") {
          this.flightService.selectedFlightmulti(result);
          this.setmultiCityFare(result["onwardFlightOption"]);
          this.flightService.selectedFlight('multicity');
        }
      }

    });
  }


  setOnewfare(res) {
    // //console.log('onew way fare')
    this.displayfareoneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
    this.flightService.sendflightdetails(res);
   // //console.log(this.displayfareoneway);
  }
  setReturnWayfare(res) {

    this.flightService.sendflightdetails(res['roundTripFlightOption']);
    this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
   // //console.log(this.cprice)
  }

  setmultiCityFare(multiCity) {
    // //console.log('multicity fare')
    // this.flightService.selectedFlightmulti(multiCity['onwardFlightOption']);
    this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
    this.multiCityCurrency = multiCity.flightFare.currency
    this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
     // //console.log(this.multiflightFare)
  }


  backTo() {
    this.router.navigate([this.confirFlightPageURL]);
  }

  allGroupdata = [];
  loadprofile() {
    this.loginemail = localStorage.getItem('loginemail')
    this.profileLoad = this.isClosePopup ? false: true;
    // //console.log(this.loginemail)
    if (this.islogin == true) {
      this.profileControllerService.getAllProfile(this.loginemail).subscribe(profile => {
        // //console.log(profile);
        if (profile) {
          let loginalert = profile["statusMessage"];
          this.loading = false;
          this.profileLoad = false;
          var mssg = profile["statusMessage"];
          if (mssg == "please login first to access the data" || mssg == "Session timeout Please login again") {
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("token");
            this.profileControllerService.clearAllProfiletCache();
            swal.fire(  {
              text: "Session timeout please login again!",
              allowOutsideClick: false,
              confirmButtonText: 'OK'
            }).then(
              (res) => {
                // //console.log(res)
                if (res['value'])
                  this.openGuestLogin();
              }
            );
          }

          var mssg = profile["statusMessage"];
          if (mssg === "Session timeout Please login again") {
            alert("Session timeout Please login again");
            this.profileControllerService.clearAllProfiletCache();
            this.openGuestLogin();
          }
          this.groups = profile["travlerGroup"];
          this.userdetail = profile["userDetails"];


          if (this.userdetail['travlerGroup']) {
            this.allGroupdata = [];
            this.userdetail['travlerGroup'].forEach(currentGroupDetail => {
              var adult=0,child=0,infa=0;
              currentGroupDetail["userTraveller"].forEach(res => {
                if (res.travellerType == "Adult" || ((res.title ==  null || res.title ==  '') && (res.travellerType == null || res.title ==  '') && res.isPrimaryTraveller == 1)) {
                  adult++;
                }
                if (res.travellerType == "child") {
                  child++;
                }
                if (res.travellerType == "Infant") {
                  infa++;
                }
              });
              
              if(this.getAllTravellerCount != undefined) {
                ////console.log(this.getAllTravellerCount)
                ////console.log(this.getAllTravellerCount['adult'] + this.getAllTravellerCount['children'] + this.getAllTravellerCount['infants'])
                if(this.getAllTravellerCount['adult'] + this.getAllTravellerCount['children'] + this.getAllTravellerCount['infants'] <= 1)                  
                {
                  return;
                }
                else if(adult<=this.getAllTravellerCount.adult && child<=this.getAllTravellerCount.children && infa<=this.getAllTravellerCount.infants ){
                  this.allGroupdata.push(currentGroupDetail);
                }
              }
            });
          }

          // //console.log(this.allGroupdata)
          // this.cd.detectChanges();
        }
      }, (err) => {
        this.loading = false;
        this.profileLoad = false;
      });
    } else {
      this.loading = false;
      this.profileLoad = false;
    }
  }

  isClosePopup = false;
  async openGuestLogin() {
    const modal = await this.modalController.create({
      component: GuestLoginComponent,
      backdropDismiss: false,
      showBackdrop: true,
      cssClass: 'new_guest_login',
      componentProps: {
        'sessionTimeOutTrue': true
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        if(data){
           this.isClosePopup = true;
           this.loadprofile();
           let allDivs;
           allDivs = document.getElementsByClassName('cdk-overlay-container');
           if(allDivs && allDivs['length'] != 0){
             allDivs[0].classList.remove('zindexNegative');
           }
        }
        
      });
    return await modal.present();
  }



  getsingleflightmulti() {
    this.subscribe = this.flightService
      .getselectedFlightmulti()
      .subscribe(res => {
        if (res) {
          // //console.log(res);
          this.multiflight = res["onwardFlightOption"];
          this.cp = res["currentPrice"];
          if (this.tripType == "multicity") {
            this.setmultiCityFare(res["onwardFlightOption"])
          }

        } else {
        }
      });
  }
  

  currentIndex;
  panelOpenState = false;
  SelectedAdultArrayArray = [];
  SelectedChildArrayArray = [];
  SelectedInfantArrayArray = [];
  travellerTypeCurrent;
  isTravellerID;
  currentTravellerID;
  opensheet(i, trevellerType, matExpansionPanel: MatExpansionPanel, allControls) {
    let isTimerCookie:any = this.cookieService.check('timerStart');
   
  if(isTimerCookie == false){
      // swal.fire('', 'Session timeout !!').then(
      //   (res) => {
      //     if(res['value']){
      //       this.router.navigate([this.searchPageURL])
      //     }
      //   }
      // )
      this.sessionTimeOutPopupShow();
    }else{
    if (this.islogin == true) {
      if (matExpansionPanel["expanded"] == true) {
        // //console.log(matExpansionPanel["expanded"]);
        this.travellerTypeCurrent = '';
        this.isTravellerID = '';
        this.currentTravellerID = '';
        if (trevellerType == "Adult") {
          this.SelectedAdultArrayArray = [];
          allControls.forEach(element => {
            
            this.SelectedAdultArrayArray.push(element['value']['travellerid'] != null ? element['value']['travellerid'] : '')
          });
          // //console.log(this.SelectedAdultArrayArray);
        }
        if (trevellerType == "child") {
          this.SelectedChildArrayArray = [];
          allControls.forEach(element => {
            this.SelectedChildArrayArray.push(element['value']['travellerid'] != null ? element['value']['travellerid'] : '')
          });
          //  //console.log(this.SelectedChildArrayArray);
        }
        if (trevellerType == "Infant") {
          this.SelectedInfantArrayArray = [];
          allControls.forEach(element => {
            this.SelectedInfantArrayArray.push(element['value']['travellerid'] != null ? element['value']['travellerid'] : '')
          });
          //  //console.log(this.SelectedInfantArrayArray);
        }

        this.currentIndex = i;
        let IsTravellerIdNumber = typeof allControls[i]['value']['travellerid'] == "number";
        this.isTravellerID = IsTravellerIdNumber
        this.currentTravellerID = allControls[i]['value']['travellerid'] != '' ? allControls[i]['value']['travellerid'] : ''
        // //console.log(this.isTravellerID);
        // //console.log('current traveller id', this.currentTravellerID)
        
        let sendTravllerIndex = {
          index: i,
          travllerType: trevellerType,
          seletedAdultArray: this.SelectedAdultArrayArray.length != 0 ? this.SelectedAdultArrayArray : [],
          seletedChildtArray: this.SelectedChildArrayArray.length != 0 ? this.SelectedChildArrayArray : [],
          seletedInfanttArray: this.SelectedInfantArrayArray.length != 0 ? this.SelectedInfantArrayArray : [],
          currentTravllerId:this.currentTravellerID
        };
        this.travellerTypeCurrent = trevellerType

        this.bottomSheet.open(PickTravellerComponent, {
          data: sendTravllerIndex
        });

        this.bottomSheet._openedBottomSheetRef
          .afterDismissed()
          .subscribe(res => {
            // //console.log(res)
            if (res) {
              this.getindexadult = res["currentID"];

              if (this.travellerTypeCurrent == 'Adult') {
                this.getSelectedtravlleradultfromPT(res['add']);
              }
              else if (this.travellerTypeCurrent == 'child') {
                this.getchilddatafromPT(res['add'])
              } else if (this.travellerTypeCurrent == 'Infant') {
                this.getInfantdatafromPT(res['add']);
              }

              

              // //console.log(res);
              // if(res['selectedAdultArray']){
              //   this.SelectedAdultArrayArray = res['selectedAdultArray'];
              // }
              // if(res['selectedChildArray']){
              //   this.SelectedChildArrayArray = res['selectedChildArray'];
              // }
              // if(res['selectedInfantArray']){
              //   this.SelectedInfantArrayArray = res['selectedInfantArray'];
              // }
            }
          });
      }
    }
  }
  }

  sendTravellerData;
  getSelectedtravlleradultfromPT(add) {
    if (add) {
      // //console.log(this.isTravellerID)
      if (this.isTravellerID) {
        let adultForm = this.adultFormGroup.get("adultData") as FormArray;
        if (this.currentIndex != undefined) {
          // //console.log(this.currentIndex);
          adultForm.controls[this.currentIndex].reset();
        }
      }
    } else {
      this.subscribe = this.profileControllerService
        .getselectedtravllerdataadult()
        .subscribe(travller => {
          if (travller != '') {
            this.newadult = travller;
            let adultForm = this.adultFormGroup.get("adultData") as FormArray;
            if (this.currentIndex != undefined) {
              // //console.log(this.currentIndex);
              adultForm.controls[this.currentIndex].patchValue({
                tittle: travller.title == 4 ? '0':travller.title == 3 ? '1': travller.title ,
                firstName: travller.firstName,
                lastName: travller.lastName,
                dob: moment(travller.dob, "YYYY/MM/DD").format("DD/MM/YYYY"),
                mobileNo: travller.mobileNumber,
                passportNo: travller.passportNo,
                passportExpiryDate: moment(travller.passportExpireDate, "YYYY/MM/DD").format("DD/MM/YYYY"),
                nationality:
                  travller.passportIssuedCountry != null && travller.passportIssuedCountry != 0
                    ? travller.passportIssuedCountry
                    : null,
                isdCode: travller.isdCode,
              
                type: travller.travellerType,
                userImage: travller.profileImagePath == null ? '' : travller.profileImagePath,
                travellerid: travller.travellerId,
                getIsTravellerSelected: true,
                travellerDataNew: travller
              });

              this.subscribe.unsubscribe();
              // //console.log(adultForm.controls[this.currentIndex])
            }
            // this.cd.markForCheck();
          }
        });
    }
  }

  getInfantdatafromPT(add) {
    if (add) {
      // //console.log(this.isTravellerID)
      if (this.isTravellerID) {
        let infantData = this.adultFormGroup.get("infantData") as FormArray;
        // //console.log(this.currentIndex);
        if (this.currentIndex != undefined) {
          infantData.controls[this.currentIndex].reset();
        }
      }
    } else {
      this.subscribe = this.profileControllerService
        .getselectedtravllerinfant()
        .subscribe(infant => {
          if (infant != "") {
            // //console.log(infant);
            this.newinfant = infant;
            let infantData = this.adultFormGroup.get("infantData") as FormArray;
            // //console.log(this.currentIndex);
            if (this.currentIndex != undefined) {
              infantData.controls[this.currentIndex].patchValue({
                tittle: infant.title == 0 ? '4' : infant.title == 1 || infant.title == 2 ? '3' : infant.title ,
                firstName: infant.firstName,
                lastName: infant.lastName,
                dob: moment(infant.dob, "YYYY/MM/DD").format("DD/MM/YYYY"),
                mobileNo: infant.mobileNumber,
                passportNo: infant.passportNo,
                passportExpiryDate: moment(infant.passportExpireDate, "YYYY/MM/DD").format("DD/MM/YYYY"),
                nationality:
                  infant.passportIssuedCountry != null && infant.passportIssuedCountry != 0
                    ? infant.passportIssuedCountry
                    : null,
                isdCode: infant.isdCode,
               
                type: infant.travellerType,
                userImage: infant.profileImagePath == null ? '': infant.profileImagePath, 
                travellerid: infant.travellerId,
                getIsTravellerSelected: true,
                travellerDataNew: infant
              });
              this.subscribe.unsubscribe();
            }
          }
        });
    }
  }

  getchilddatafromPT(add) {
    if (add) {
      // //console.log(this.isTravellerID)
      if (this.isTravellerID) {
        let childData = this.adultFormGroup.get("childData") as FormArray;
        // //console.log(this.currentIndex);
        if (this.currentIndex != undefined) {
          childData.controls[this.currentIndex].reset();
        }
      }
    } else {
      this.subscribe = this.profileControllerService
        .getselectedtravllerchild()
        .subscribe(child => {
          if (child != "") {
            // //console.log(child);
            this.newchild = child;
            let childData = this.adultFormGroup.get("childData") as FormArray;
            // //console.log(this.currentIndex);
            if (this.currentIndex != undefined) {
              childData.controls[this.currentIndex].patchValue({
                firstName: child.firstName,
                lastName: child.lastName,
                dob: moment(child.dob, "YYYY/MM/DD").format("DD/MM/YYYY"),
                mobileNo: child.mobileNumber,
                passportNo: child.passportNo,
                passportExpiryDate: moment(child.passportExpireDate, "YYYY/MM/DD").format("DD/MM/YYYY"),
                nationality:
                  child.passportIssuedCountry != null && child.passportIssuedCountry != 0
                    ? child.passportIssuedCountry
                    : null,
                isdCode: child.isdCode,
                tittle: child.title == 0 ? '4' : child.title == 1 || child.title == 2 ? '3' : child.title ,
                type: child.travellerType,
                userImage: child.profileImagePath,
                travellerid: child.travellerId == null ? '': child.travellerId,
                getIsTravellerSelected: true,
                travellerDataNew: child
              });
              this.subscribe.unsubscribe();
            }
            // //console.log(childData);
          }
        });
    }
  }

  allCountryList: any;
  newCountryList = [];
  getAllCountryList() {
    this.allCountryList = country.countries;
    // //console.log(this.allCountryList)
    this.allCountryList.forEach(element => {
      this.newCountryList.push({
        countryCode: element["countryCode"],
        countryId: element["countryId"],
        countryName: element["countryName"],
        phoneCode: element['phoneCode']
      });
    });
  }

  getSelectedCountry(id) {
    let currentCounrt = this.newCountryList.filter(res => {
      return res["countryId"] == id;
    });
    return currentCounrt[0]['countryId'];
  }
 
  ngOnDestroy(): void {
    this.travSub.unsubscribe();
    this.subscribe.unsubscribe();
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
      // //console.log(res);
      this.setButtonClose = false;
    });
  }


  // editflight() {
  //   let countryCode = localStorage.getItem('countryCode').toLowerCase();
  //   let setLanguageSetting = 'en';
  //   this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
  // }


  editflight() {
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
    
    } else{
      //this.router.navigate([countryCode + "/" + setLanguageSetting]);
      this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
    }

   

  }

}



  // checkScroll() {
      
  //   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  //   //console.log('[scroll]', scrollPosition);
    
  //   if (scrollPosition >= this.topPosToStartShowing) {
  //     // this.isShow = true;
  //   } else {
  //     // this.isShow = false;
  //   }
  // }