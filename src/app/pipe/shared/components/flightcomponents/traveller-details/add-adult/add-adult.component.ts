import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  forwardRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  NG_VALUE_ACCESSOR,
  FormControl,
  NG_VALIDATORS,
  NgForm
} from "@angular/forms";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { AuthServices } from "src/app/services/auth.service";
import { PickTravellerComponent } from "../pick-traveller/pick-traveller.component";
import { MatBottomSheet, MatSnackBar } from "@angular/material";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { SelectAutocompleteComponent } from "mat-select-autocomplete";
import * as country from "../../../../../../constants/new-countries.constant";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import * as moment from "moment";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { GlobalService } from "src/app/services/global.service";
import { Subscription } from "rxjs";
import { NationalityComponent } from "src/app/nationality/nationality.component";
import { IonicSelectableComponent } from "ionic-selectable";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { GetCountryService } from "src/app/services/get-country.service";
import { createAutoCorrectedDatePipe } from 'src/app/pipe/shared/autoDatePipe';
import { FlightService } from "src/app/services/flight.service";
@Component({
  selector: "app-add-adult",
  templateUrl: "./add-adult.component.html",
  styleUrls: ["./add-adult.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddAdultComponent)
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddAdultComponent),
      multi: true
    }
  ]
})
export class AddAdultComponent implements OnInit {
  @Input() indexnew: number;
  @Input() adulttravller: any;

  @Input() indexadult;
  @Input() getdataadult;
  @Input() addAdultData: any;
  @Input()
  adultform: FormGroup;
  adultdetails: any;
  islogin: boolean;
  subscribe: any;
  currentindex: string;
  arrayItems: any;
  islogin1: string;
  newform: FormGroup;
  formGroup: FormGroup;
  travller: any;
  firstname: any;

  name1 = "ress";
  newindex: number;
  fname: any;
  adultcall: boolean;
  infantcall: boolean;
  childcall: boolean;
  newtravller: any;
  fnames: any;
  loggedTrue;

  brandId;
  public countryList = [];
  @ViewChild(SelectAutocompleteComponent)
  multiSelect: SelectAutocompleteComponent;

  before_12__years;
  matcher = new MyErrorStateMatcher();
  currentCountry;
  dateOnward: string;
  convertedOnward: string;
  next6month: string;
  next1month: string;
  next1day: string;
  returndate: string;
  convertedReturn: string;
  next1monthreturn: string;

  selectedTraveller;

  currentUserID;
  valAdult;
  adultindex;
  dataFlight;
  minDateOptions = { 'dd': 1, 'mm': 1, 'yy': 0, 'yyyy': new Date().getFullYear() - 100}
maxDateOptions = { 'dd': 31, 'mm': 12, 'yy': 99, 'yyyy': new Date().getFullYear() + 100}
dateMaskOptions;
char_limit_3_20 = ' should have minimum 3 and maximum 20 characters.'
phn_limit_7_11 = 'should have minimum 7 and maximum 11 digit.';

Char_max_length_20 = ' should have maximum 20 characters.';
PassengerDataArray;
totalLength = 0;
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private pservice: ProfileControllerService,
    private bottomSheet: MatBottomSheet,
    private sendTravllerDataService: SendTravllerDataService,
    private _authService: AuthServices,
    private globalservice: GlobalService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private countryService: GetCountryService,
    private snackBar: MatSnackBar,
    private flightService: FlightService
  ) {
    this.islogin = this._authService.loggedIn().valueOf();
  }
  dateSubscribtion: Subscription;
  ngOnInit() {
   //code for mendatory details
    this.valAdult=this.addAdultData;
    this.adultindex = this.indexadult;
    //console.log(this.adultindex);
    //console.log("Data from travllers page:-"+ JSON.stringify(this.valAdult));

    // this.valAdult['dobValidation'] = (this.valAdult['dobValidation']  == true || this.valAdult['passportValidation'] == true )? true:(this.valAdult['dobValidation'] == false ? false:true);
    // this.valAdult['passportValidation'] = this.valAdult['passportValidation'] == true ? true:(this.valAdult['passportValidation'] == false ? false:true);
    // this.valAdult['nationalityValidation'] = ( this.valAdult['nationalityValidation'] == true || this.valAdult['passportValidation'] == true )? true:(this.valAdult['nationalityValidation'] == false ? false:true);
     
    this.valAdult['dobValidation'] = this.valAdult['dobValidation'] == true ? true:(this.valAdult['dobValidation'] == false ? false:true); 
    this.valAdult['passportValidation'] = this.valAdult['passportValidation'] == true ? true:(this.valAdult['passportValidation'] == false ? false:true);
    this.valAdult['nationalityValidation'] =this.valAdult['nationalityValidation'] == true ? true:(this.valAdult['nationalityValidation'] == false ? false:true); 

    

    // console.log("dobValidation:-"+this.valAdult['dobValidation']);
    // console.log("passportValidation:-"+this.valAdult['passportValidation']);
    // console.log("nationalityValidation:-"+this.valAdult['nationalityValidation']);
  //-----------------------

  // this.dataFlight=this.valAdult['passengerLength'];
  this.dataFlight = 40;
  //console.log(this.dataFlight);


    this.currentUserID = localStorage.getItem('loginemail');
    // console.log(this.currentUserID)
    this.dateOnward = localStorage.getItem('returnwaydepartDate');
    this.returndate = localStorage.getItem('returnwayreturnDate');


    this.next1monthreturn = moment(this.convertedReturn, "DD/MM/YYYY").add(30, 'd').format("DD/MM/YYYY");
    // console.log(this.next1monthreturn);

    this.loggedTrue = localStorage.getItem("isLoggedIn");
    this.currentCountry = localStorage.getItem("countryId");
    this.getAllNewCountry();
    this.getReturnDate();
    this.createform();

    this.childcall = false;
    this.infantcall = false;
    this.adultcall = true;
    // this.getAllCountry();

    this.dateMaskOptions = {
      mask: [/\d/, /\d/, '/', /\d/, /\d/,'/', /\d/, /\d/,/\d/, /\d/],
      pipe: createAutoCorrectedDatePipe('dd mm yyyy', this.maxDateOptions, this.minDateOptions),
      placeholder: 'DD/MM/YYYY',
      pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      keepCharPositions: true,
      guide: false
  }
  this.get_hundred_years_back();
 
  }
  ngOnDestroy(): void {
    this.dateSubscribtion.unsubscribe();
  }
  journeyreturnDate;
  getReturnDate() {
    this.dateSubscribtion = this.globalservice.getReturnDate.subscribe(
      (res: any) => {
        // console.log(res);

        if (res) {
          //  console.log(res);
          this.getReturnJourneyDate = moment(res, "DD-MM-YYYY")
            .format("MM/DD/YYYY");
          this.journeyreturnDate = moment(res, "DD-MM-YYYY")
            .subtract(12, "y")
            .format("MM/DD/YYYY");
          // console.log("journeyReturnDate", this.journeyreturnDate);
        } else {
          this.journeyreturnDate = moment("29-06-2020")
            .subtract(12, "y")
            .format("MM/DD/YYYY");
        }
        // console.log("journeyReturnDate", this.journeyreturnDate);
      }
    );
  }
  warningDate;
  getReturnJourneyDate;
  iswarning = false;
  todayDate = moment().format("MM/DD/YYYY");
  getWarning(expiryDate) {
    let getReturnJournetDate =  moment(this.todayDate, "MM/DD/YYYY")
    .format("DD/MM/YYYY");
    this.warningDate = moment(this.todayDate, "MM/DD/YYYY")
      .add(6, "M")
      .format("DD/MM/YYYY");
    let compareDate = moment(expiryDate, "DD/MM/YYYY");
    let startDate = moment(getReturnJournetDate, "DD/MM/YYYY");
    let endDate = moment(this.warningDate, "DD/MM/YYYY");
    this.iswarning =  compareDate.isBetween(startDate, endDate);
    // console.log( 'Is warning', this.iswarning)
  }

  createform() {
    this.get_hundred_years_back();
    this.adultform = this.fb.group({
      tittle: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Title is required.'
          })]
        })
      ],
      firstName: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'First name is required.'
            }),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            // RxwebValidators.maxLength({value:20, message:''}),
          ]
        })
      ],
      lastName: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'Last name is required.'
            }),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            // RxwebValidators.maxLength({value:20, message:''}),
          ]
        })
      ],
      dob: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'Date of birth is required.'
            }),
            RxwebValidators.pattern({
              expression: { pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
              message: "Please enter valid date."
            }),
            RxwebValidators.maxDate({
              value: this.journeyreturnDate,
              message: `Adult age can't be less than 12 years`
            }),
            RxwebValidators.minDate({
              value: this.get_100_Back_years,
              message: `Adult age can't be more than 100 years`
            })
          ]
        })
      ],
      mobileNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Mobile number is required.'
          }), RxwebValidators.numeric(),  RxwebValidators.maxLength({value:11, message:''}),]
        })
      ],
      passportNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Passport no. is required.'
          }), RxwebValidators.alphaNumeric(),  RxwebValidators.maxLength({value:9, message:''}),]
        })
      ],
      passportExpiryDate: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'Passport expiry date is required.'
            }),
            RxwebValidators.pattern({
              expression: { pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
              message: "Please enter valid date."
            }),
            RxwebValidators.minDate({
              value:this.getReturnJourneyDate,
              message: `Passport should not be expired on journey date.`
            })
          ]
        })
      ],
      nationality: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'Nationality is required.'
            })
          ]
        })
      ],
      isdCode: [
        "",
        RxwebValidators.compose({ validators: [RxwebValidators.required({
          message:'ISD code is required.'
        })] })
      ],
      type: ["Adult"],
      userImage: [""],
      travellerid: [""],
      getIsTravellerSelected: [""],
      travellerDataNew:[""]
    });
    //code for mendatory details
    if(this.valAdult['dobValidation'] == false) 
    {
      //console.log('dob');
      this.adultform.get('dob').clearValidators();
    }
    if(this.valAdult['passportValidation'] == false)
    {
      //console.log('passportNo');
      this.adultform.get('passportNo').clearValidators();
      this.adultform.get('passportExpiryDate').clearValidators();
    } 
    if(this.valAdult['nationalityValidation'] ==  false)
    {
      //console.log('nationality');
      this.adultform.get('nationality').clearValidators();
    }
    if(this.adultindex > 0)
    {
       this.adultform.get('isdCode').clearValidators();
       this.adultform.get('mobileNo').clearValidators();
    }

  }

  onTouched: () => void = () => {};

  writeValue(v: any) {
    //console.log(v)
    if( v != null){ 
      if(v['passportExpiryDate'] == '' || v['passportExpiryDate'] == null || v['passportExpiryDate'] == 'Invalid date'){}
      else{
        if( v['passportExpiryDate']['length'] == 10){
          // console.log('selected');
          this.adultform.controls['passportExpiryDate'].markAsTouched();
        }
      }
      this.adultform.setValue(v, { emitEvent: true });
    }else{
      // this.adultform.get('tittle').setValue("");
      // this.adultform.get('userImage').setValue("");
      this.adultform.reset();
      // this.adultform.markAsPristine();
      this.adultform.get('tittle').setValue("");
      this.adultform.get('userImage').setValue("");
      // this.adultform.get('nationality').setValue(" ");
      // this.adultform.get('isdCode').setValue(" ");
      this.adultform.get('firstName').setValue("");
      this.adultform.get('lastName').setValue("");
    }
      
  }
  onChange: any = e => {
   //  console.log(e);
  };
  registerOnChange(fn: (v: any) => void) {
    this.adultform.valueChanges.subscribe(val => {       
      val["type"] = "A";
      if(val['travellerDataNew'] != "" && val['getIsTravellerSelected']) {
        // val['travellerDataNew'].title =  val["tittle"],
        // val['travellerDataNew'].dob = moment(val["dob"], "DD/MM/YYYY").format("YYYY-MM-DD"),
        // val['travellerDataNew'].firstName =  val["firstName"],
        // val['travellerDataNew'].lastName =  val["lastName"],
        // val['travellerDataNew'].mobileNo =  val["mobileNo"],
        // val['travellerDataNew'].isdCode =  val["isdCode"],
        // val['travellerDataNew'].nationality =  val["nationality"]["countryId"],
        // val['travellerDataNew'].passportExpireDate = moment(val["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD"),
        // val['travellerDataNew'].passportNo =  val["passportNo"],
        // val['travellerDataNew'].travellerId =  val["travellerid"],
        // val['travellerDataNew'].profileImagePath =  val["userImage"]
       }
       if(val['passportExpiryDate'] && val['passportExpiryDate']['length'] == 10){
        this.getWarning(val['passportExpiryDate']);
      }else{
        this.iswarning = false;
      }
        fn(val);
       //console.log(val);
       this.flightService.getPassengerDetails().subscribe(response => {
        //console.log('Data:', response); 
        this.PassengerDataArray = response; 
      });
         // console.log(this.PassengerDataArray.infantData[this.adultindex] + this.PassengerDataArray.infantData.length);
        if(this.PassengerDataArray.infantData[this.adultindex])
        {
          this.dataFlight = 50;
          if(this.PassengerDataArray.adultData[this.adultindex].firstName != null && this.PassengerDataArray.adultData[this.adultindex].firstName != '' && this.PassengerDataArray.infantData[this.adultindex] && this.PassengerDataArray.infantData[this.adultindex].firstName != '' && this.PassengerDataArray.infantData[this.adultindex].firstName != null) {
            this.totalLength = this.PassengerDataArray.adultData[this.adultindex].firstName.length + this.PassengerDataArray.adultData[this.adultindex].lastName.length + (this.PassengerDataArray.adultData[this.adultindex].tittle == 2 ? 4 : 3) +
            this.PassengerDataArray.infantData[this.adultindex].firstName.length + this.PassengerDataArray.infantData[this.adultindex].lastName.length + (this.PassengerDataArray.infantData[this.adultindex].tittle == 3 ? 4 : 6) + 10;

          }           
          else if(this.PassengerDataArray.adultData[this.adultindex].firstName != null && this.PassengerDataArray.adultData[this.adultindex].firstName != ''){       
          this.totalLength = this.PassengerDataArray.adultData[this.adultindex].firstName.length + this.PassengerDataArray.adultData[this.adultindex].lastName.length + (this.PassengerDataArray.adultData[this.adultindex].tittle == 2 ? 4 : 3) + 10 + 6;  //Sum of adult 's first name last name and title or infant's dob and title(10 chars + 6 chars)
          } 
        }
        else if(this.PassengerDataArray.adultData[this.adultindex].firstName != null && this.PassengerDataArray.adultData[this.adultindex].firstName != ''){       
          this.totalLength = this.PassengerDataArray.adultData[this.adultindex].firstName.length + this.PassengerDataArray.adultData[this.adultindex].lastName.length + (this.PassengerDataArray.adultData[this.adultindex].tittle == 2 ? 4 : 3);
        } 
       
     //   console.log("Length:"+this.dataFlight);        
      //  console.log("passenger's Total Length"+this.totalLength);      
    });
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  validate(form: any) {
    return this.adultform.valid ? null : { adult: { valid: false } };
  }

  

  getTittle(event, value) {
    this.adultform.get("tittle").setValue(value);
  }


  formFilled = false;
  checkedToggle = false;
  rememberTraveller(value: Event, form: NgForm) {
    value.preventDefault();
    if (form.valid) {
      this.checkedToggle = true;
      this.formFilled = false;
      if (
        !this.adultform.value["travellerid"] &&
        value["detail"]["checked"] == true
      ) {
        this.addTraveller();
      }
      if (value["detail"]["checked"] == false) {
        this.deleteTraveller(this.adultform.value["travellerid"]);
      }
    } else {
      this.formFilled = true;
    }
  }

 

  addTraveller() {
    let requestBody = {
      dob:this.valAdult['dobValidation'] == true?
        moment(this.adultform.value["dob"], "DD/MM/YYYY").format("YYYY-MM-DD"):null,
      passportExpireDate:this.valAdult['passportValidation'] == true?
        moment(this.adultform.value["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD"):null,
      passportNo: this.valAdult['passportValidation'] == true ? this.adultform.value["passportNo"] : null,
      email: this.currentUserID,
      firstName: this.adultform.value["firstName"].trim(),
      isdCode: this.adultform.value["isdCode"],
      lastName: this.adultform.value["lastName"].trim(),
      mobileNo: this.adultform.value["mobileNo"],
      nationality:this.valAdult['nationalityValidation']  ? this.adultform.value["nationality"]:null,
      title: this.adultform.value["tittle"],
      userAlias:this.currentUserID,

      passportIssuedCountry: this.adultform.value["nationality"],
      imageFilePath: "",
      state: "",
      frequentFlyerList: [],
      profileImagePath: '' ,
      address: "",
      pincode: "",
      city: "",
      country: "",
      travellerId: 0,
      isPrimaryTraveller: 0,
    };
    console.log(requestBody)
    this.pservice.addTravller(requestBody).subscribe(res => {
      this.snackBar.open(res["statusMessage"], "", {
        duration: 1500
      });

      if(res['statusCode'] == 0 && res['statusMessage'] == 'success'){
        this.pservice.clearAllProfiletCache();
        this.adultform.patchValue({
          travellerid: res["userTraveller"]["travellerId"]
        });
      }
    
    
    });
  }

  deleteTraveller(travellerId) {
    this.pservice.removetravller(travellerId).subscribe(res => {
      this.snackBar.open(res["statusMessage"], "", {
        duration: 1500
      });

      this.pservice.clearAllProfiletCache();

      if(res['statusCode'] == 0 && res['statusMessage'] == 'success'){
        this.adultform.patchValue({
          travellerid: ""
        });
      }
     
    });
  }

  allCountryList: any;
  newCountryList = [];
  getAllNewCountry() {
    this.allCountryList = country.countries;
    this.allCountryList.forEach(element => {
      this.newCountryList.push({
        countryCode: element["countryCode"],
        countryId: element["countryId"],
        countryName: element["countryName"],
        phoneCode: element['phoneCode']
      });
    });
  }


  updateTraveller() {
    let selectedTraveller = this.adultform.get('travellerDataNew').value;
    if(selectedTraveller != ""){
    let requestBody = {
    title: this.adultform.value["tittle"],
    dob:moment(this.adultform.value["dob"], "DD/MM/YYYY").format("YYYY-MM-DD")+"T00:00:00.000+0000",
    firstName: this.adultform.value["firstName"].trim(),
    lastName: this.adultform.value["lastName"].trim(),
    mobileNo: this.adultform.value["mobileNo"],
    isdCode: this.adultform.value["isdCode"],
    nationality: this.adultform.value["nationality"]["countryCode"],
    passportExpireDate:moment(this.adultform.value["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD")+"T00:00:00.000+0000",
    passportNo: this.adultform.value["passportNo"],
    travellerId: this.adultform.value["travellerid"],
    imageFilePath: this.adultform.value["userImage"],

      email: selectedTraveller["email"],
      address: selectedTraveller["address"],
      pincode: selectedTraveller["pinCode"],
      city: selectedTraveller["city"],
      country: selectedTraveller["country"],
      state: selectedTraveller["state"],
      passportIssuedCountry: selectedTraveller["passportIssuedCountry"],
      passportLastName: selectedTraveller.passportLastName,
      passportMiddleName: selectedTraveller.passportMiddleName,
      passportFirstName: selectedTraveller.passportFirstName,
      passportPath: selectedTraveller.passportImage,
      userAlias: this.currentUserID,
      frequentFlyerList: selectedTraveller['frequentFlyer'],
      visaList: selectedTraveller['visa'],
      isPrimaryTraveller: 0

    };
    }
  }

  get_100_Back_years;
  get_hundred_years_back() {
    this.get_100_Back_years= moment(this.todayDate, "MM/DD/YYYY")
      .subtract(100, "y")
      .format("MM/DD/YYYY");
  }
  modelValue;
  formControlName
  openCountryList(formfield, selectedvalue){
    let selectedCurrentValue;
    if(formfield == 'isdCode' && (selectedvalue != '' && selectedvalue != null) ){
      selectedCurrentValue = selectedvalue
    }else if(formfield == 'nationality' && (selectedvalue != '' && selectedvalue != null)){
      selectedCurrentValue = selectedvalue['phoneCode']
    }
    let sendCurrentData ={
      formfield:formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList:this.newCountryList
    }
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });
    
    this.bottomSheet._openedBottomSheetRef
    .afterDismissed()
    .subscribe((res)=>{
      if(res != undefined){
        if(res['currentFieldSelected'] == 'isdCode'){
          this.adultform.get('isdCode').setValue(res['currentCountrySelected']['phoneCode'])
        }else{
          this.adultform.get('nationality').setValue(res['currentCountrySelected']['countryId'])
        }
      }
     
      
    })
  }
}

// var newbody = {
//   address: address,
//   city: city,
//   country: this.countryValue,
//   dob: moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
//   email: email,
//   firstName: firstName,
//   frequentFlyerList: this.airline.value,
//   imageFilePath: this.imgURL,
//   isPrimaryTraveller: 0,
//   isdCode: code,
//   lastName: lastName,
//   mobileNo: mobileNo,
//   nationality: "string",

//   passportExpireDate: moment(passportExpireDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
//   passportNo: passportNo,
//   passportIssuedCountry: passportIssuedCountry['countryId'],
//   passportLastName: passportLastName,
//   passportMiddleName:passportMiddleName,
//   passportFirstName:passportFirstName,
//   passportPath:passportImage,

//   pincode: "1234",
//   state: this.stateValue,
//   title: title,
//   travellerId: 0,
//   userAlias: this.loginemail,

//   visaList: this.allVisaList

  
// };

// {
//   "address": "string",
//   "city": "string",
//   "country": 0,
//   "dob": "2020-02-25T05:22:05.577Z",
//   "email": "string",
//   "firstName": "string",
//   "frequentFlyerList": [
//     {
//       "airline": "string",
//       "frequentFlyerNumber": "string"
//     }
//   ],
//   "imageFilePath": "string",
//   "isPrimaryTraveller": 0,
//   "isdCode": "string",
//   "lastName": "string",
//   "mobileNo": "string",
//   "nationality": "string",
//   "passportExpireDate": "2020-02-25T05:22:05.577Z",
//   "passportFirstName": "string",
//   "passportIssuedCountry": 0,
//   "passportLastName": "string",
//   "passportMiddleName": "string",
//   "passportNo": "string",
//   "pincode": "string",
//   "state": 0,
//   "title": "string",
//   "travellerId": 0,
//   "userAlias": "string",
//   "visaList": [
//     {
//       "visNo": "string",
//       "visaExpiryDate": "2020-02-25T05:22:05.577Z",
//       "visaIssuedCountry": 0,
//       "visaType": "string"
//     }
//   ]
// }


