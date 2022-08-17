import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  forwardRef
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  NgForm
} from "@angular/forms";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { PickTravellerComponent } from "../pick-traveller/pick-traveller.component";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { MatBottomSheet, MatSnackBar } from "@angular/material";
import { AuthServices } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { GlobalService } from "src/app/services/global.service";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IonicSelectableComponent } from "ionic-selectable";
import * as country from "../../../../../../constants/new-countries.constant";
import { createAutoCorrectedDatePipe } from 'src/app/pipe/shared/autoDatePipe';
import { NationalityComponent } from 'src/app/nationality/nationality.component';
import { FlightService } from 'src/app/services/flight.service';
@Component({
  selector: "app-add-infant",
  templateUrl: "./add-infant.component.html",
  styleUrls: ["./add-infant.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddInfantComponent)
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddInfantComponent),
      multi: true
    }
  ]
})
export class AddInfantComponent implements OnInit {
  // @Input('data') data;
  // @Input() index;
  @Input() indexinfant: string;
  @Input() getdatainfant: any;
  helperArray: Array<any> = [];
  @Input() getData: any;
  @Input() addinfantData: any;
  addInfantform: FormGroup;
  adultdetails: any;
  islogin: boolean;
  subscribe: any;
  infantcall: boolean;
  adultcall: boolean;
  childcall: boolean;
  newindex: any;
  matcher = new MyErrorStateMatcher();
  loggedTrue: string;
  selectedTraveller: any;
  currentUserID: any;
  currentCountry;
  minDateOptions = { 'dd': 1, 'mm': 1, 'yy': 0, 'yyyy': new Date().getFullYear() - 100}
  maxDateOptions = { 'dd': 31, 'mm': 12, 'yy': 99, 'yyyy': new Date().getFullYear() + 100}
  dateMaskOptions;
  char_limit_3_20 = ' should have minimum 3 and maximum 20 characters.'
  phn_limit_7_11 = 'should have minimum 7 and maximum 11 digit.'
  Char_max_length_20 = ' should have maximum 20 characters.';
  valInfant;
  InfantIndex; 
  PassengerDataArray;
  totalLength;
  dataFlight;
  constructor(
    private fb: FormBuilder,
    private globalservice: GlobalService,
    private cd: ChangeDetectorRef,
    private pservice: ProfileControllerService,
    private bottomSheet: MatBottomSheet,
    private sendTravllerDataService: SendTravllerDataService,
    private _authService: AuthServices,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private flightService: FlightService
  ) {}

  ngOnInit() {
    this.InfantIndex = this.indexinfant;
    //code for mendatory fields
    this.valInfant=this.addinfantData;
    console.log("Data from travllers page:-"+ JSON.stringify(this.valInfant));

    // this.valInfant['dobValidation'] = (this.valInfant['dobValidation'] == true || this.valInfant['passportValidation'] == true) ? true:(this.valInfant['dobValidation'] == false ? false:true);
    // this.valInfant['passportValidation'] = this.valInfant['passportValidation'] == true ? true:(this.valInfant['passportValidation'] == false ? false:true);
    // this.valInfant['nationalityValidation'] = ( this.valInfant['nationalityValidation'] == true || this.valInfant['passportValidation'] == true) ? true:(this.valInfant['nationalityValidation'] == false ? false:true);
     
     
   this.valInfant['dobValidation'] =this.valInfant['dobValidation'] == true ? true:(this.valInfant['dobValidation'] == false ? false:true); 
   this.valInfant['passportValidation'] =this.valInfant['passportValidation'] == true ? true:(this.valInfant['passportValidation'] == false ? false:true);
   this.valInfant['nationalityValidation'] =this.valInfant['nationalityValidation'] == true ? true:(this.valInfant['nationalityValidation'] == false ? false:true); 
    // console.log("dobValidation:-"+this.valInfant['dobValidation']);
    // console.log("passportValidation:-"+this.valInfant['passportValidation']);
    // console.log("nationalityValidation:-"+this.valInfant['nationalityValidation']);
    //------------------
    
   // this.dataFlight=this.valInfant['passengerLength'];
   this.dataFlight = 40;
    console.log(this.dataFlight);


    this.currentUserID = localStorage.getItem('loginemail');
    this.infantcall = true;
    this.childcall = false;
    this.adultcall = false;
    this.loggedTrue = localStorage.getItem("isLoggedIn");
    this.currentCountry = localStorage.getItem("countryId");

    this.islogin = this._authService.loggedIn().valueOf();
    // this.cd.markForCheck();
    this.getSelectedtravller();
    this.getReturnDate();
    this.createform();
    this.getAllNewCountry();
    this.dateMaskOptions = {
      mask: [/\d/, /\d/, '/', /\d/, /\d/,'/', /\d/, /\d/,/\d/, /\d/],
      pipe: createAutoCorrectedDatePipe('dd mm yyyy', this.maxDateOptions, this.minDateOptions),
      placeholder: 'DD/MM/YYYY',
      pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      keepCharPositions: true,
      guide: false
  }
  }
  ngOnDestroy(): void {
    this.dateSubscribtion.unsubscribe();
  }

  journeyreturnDate;
  dateSubscribtion: Subscription;
  getMinimumAgeChild;
  getReturnDate() {
    this.dateSubscribtion = this.globalservice.getReturnDate.subscribe(
      (res: any) => {
        if (res) {
          // this.journeyreturnDate =  moment(res, 'DD-MM-YYYY').subtract(2, "y").format("MM/DD/YYYY");
          this.getReturnJourneyDate = moment(res, "DD-MM-YYYY")
          .format("MM/DD/YYYY");
          this.journeyreturnDate = moment(res, "DD-MM-YYYY")
            .subtract(2, "y")
            .format("MM/DD/YYYY");
          this.getMinimumAgeChild = moment(this.journeyreturnDate)
            .add(2, "y")
            .format("MM/DD/YYYY");
        } else {
          this.journeyreturnDate = moment("07/01/2020")
            .subtract(2, "y")
            .format("DD/MM/YYYY");
          this.getMinimumAgeChild = moment(this.journeyreturnDate)
            .add(2, "y")
            .format("DD/MM/YYYY");
         
        }
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
  }

  createform() {
    this.addInfantform = this.fb.group({
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
            RxwebValidators.minDate({
              value: this.journeyreturnDate,
              message: `Infant age should 0-2 years`
            }),
            RxwebValidators.maxDate({
              value: this.getMinimumAgeChild,
              message: `Infant age should 0-2 years`
            })
          ]
        })
      ],
      mobileNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Mobile number is required.'
          }), RxwebValidators.numeric(), RxwebValidators.maxLength({value:11, message:''})]
        })
      ],
      passportNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Passport no. is required.'
          }), RxwebValidators.alphaNumeric(), RxwebValidators.maxLength({value:9, message:''})]
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
            }),
          ]
        })
      ],
      isdCode: [
        "+91",
        RxwebValidators.compose({ validators: [RxwebValidators.required({
          message:'ISD code is required.'
        })] })
      ],
      type: ["Infant"],
      userImage: [""],
      travellerid: [""],
      getIsTravellerSelected: [""],
      travellerDataNew:[""]
    });
     //code for mendatory fields
    // if(this.valInfant['dobValidation'] == false) 
    // {
    //   console.log('dob');
    //   this.addInfantform.get('dob').clearValidators();
    // }
    if(this.valInfant['passportValidation'] == false)
    {
      //console.log('passportNo');
      this.addInfantform.get('passportNo').clearValidators();
      this.addInfantform.get('passportExpiryDate').clearValidators();
    } 
    if(this.valInfant['nationalityValidation'] ==  false)
    {
      //console.log('nationality');
      this.addInfantform.get('nationality').clearValidators();
    }
    this.addInfantform.get('isdCode').clearValidators();
    this.addInfantform.get('mobileNo').clearValidators();
  }

  onTouched: () => void = () => {};
  writeValue(v: any) {
    if( v != null){
      if(v['passportExpiryDate'] == '' || v['passportExpiryDate'] == null || v['passportExpiryDate'] == 'Invalid date'){}
      else{
        if(v['passportExpiryDate']['length'] == 10){
          // console.log(v['passportExpiryDate']);
          this.addInfantform.controls['passportExpiryDate'].markAsTouched();
        }
      }
      this.addInfantform.setValue(v, { emitEvent: true });
    }else{
      // this.addInfantform.get('tittle').setValue("");
      // this.addInfantform.get('userImage').setValue("");
      this.addInfantform.reset();
      this.addInfantform.get('tittle').setValue("");
      this.addInfantform.get('userImage').setValue("");
      // this.addInfantform.get('nationality').setValue(" ");
      // this.addInfantform.get('isdCode').setValue(" ");
      this.addInfantform.get('firstName').setValue("");
      this.addInfantform.get('lastName').setValue("");
      // this.getSelectedCountry();
    }
  }

  registerOnChange(fn: (v: any) => void) {
    this.flightService.getPassengerDetails().subscribe(response => {
      //console.log('Data:', response); 
      this.PassengerDataArray = response;
    });
    this.addInfantform.valueChanges.subscribe(val => { 
      val["type"] = "I";
      fn(val);
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

     
      this.dataFlight = 50;  
      if(this.PassengerDataArray.infantData[this.InfantIndex].firstName != '' && this.PassengerDataArray.infantData[this.InfantIndex].firstName != null)
      this.totalLength = this.PassengerDataArray.adultData[this.InfantIndex].firstName.length + this.PassengerDataArray.adultData[this.InfantIndex].lastName.length + (this.PassengerDataArray.adultData[this.InfantIndex].tittle == 2 ? 4 : 3) +
         this.PassengerDataArray.infantData[this.InfantIndex].firstName.length + this.PassengerDataArray.infantData[this.InfantIndex].lastName.length + (this.PassengerDataArray.infantData[this.InfantIndex].tittle == 3 ? 4 : 6) + 10;      
         console.log("Length:"+this.dataFlight);        
         console.log("passenger's Total Length"+this.totalLength);  
        });
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.addInfantform.valid ? null : { infant: { valid: false } };
  }
  getTittle(event, value) {
    this.addInfantform.get("tittle").setValue(value);
  }



  getSelectedtravller() {
    this.subscribe = this.pservice
      .getselectedtravllerinfant()
      .subscribe(travller => {
        if (travller) {
          this.checkedToggle = false;
          this.selectedTraveller = travller
        }
      });
  }
  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  formFilled = false;
  checkedToggle = false;
  rememberTraveller(value: Event, form: NgForm) {
    value.preventDefault();
    if (form.valid) {
      this.checkedToggle = true;
      this.formFilled = false;
      if (
        !this.addInfantform.value["travellerid"] &&
        value["detail"]["checked"] == true
      ) {
        this.addTraveller();
      }
      if (value["detail"]["checked"] == false) {
        this.deleteTraveller(this.addInfantform.value["travellerid"]);
      }
    } else {
      this.formFilled = true;
    }
  }

  addTraveller() {
    let requestBody = {
      dob:this.valInfant['dobValidation'] == true ?
        moment(this.addInfantform.value["dob"], "DD/MM/YYYY").format("YYYY-MM-DD")+"T00:00:00.000+0000":null,
      passportExpireDate:this.valInfant['passportValidation'] == true?
        moment(this.addInfantform.value["passportExpiryDate"],"DD/MM/YYYY").format("YYYY-MM-DD")+"T00:00:00.000+0000":null,
      passportNo:this.valInfant['passportValidation']== true ? this.addInfantform.value["passportNo"]:null,
      email: this.currentUserID,
      firstName: this.addInfantform.value["firstName"].trim(),
      lastName: this.addInfantform.value["lastName"].trim(),
      // isdCode: this.addInfantform.value["isdCode"],
      // mobileNo: this.addInfantform.value["mobileNo"],
      isdCode:null,
      mobileNo: null,
      nationality:this.valInfant['nationalityValidation'] ==  true? this.addInfantform.value["nationality"]:null,
      title: this.addInfantform.value["tittle"],
      userAlias: this.currentUserID,
      passportIssuedCountry: this.addInfantform.value["nationality"],
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
        this.addInfantform.patchValue({
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
        this.addInfantform.patchValue({
          travellerid: ""
        });
      }
    });
  }

  travellerDataNew ={};
  getAllDetailsCurrentTraveller(){
    if(this.addInfantform.valid && this.addInfantform.get('getIsTravellerSelected').value){
      let getAllAdultTarveller = JSON.parse(localStorage.getItem('infantTraveller'));
      let currentId = this.addInfantform.value.travellerid;
      let getSelectedTraveller = getAllAdultTarveller.filter(function(item){
        return item.travellerId == currentId
      });
      if(getSelectedTraveller.length != 0){
        this.updateTraveller(getSelectedTraveller[0]);
      }
      
    }
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
  


  updateTraveller(selectedTraveller) {
    let requestBody = {
      title: this.addInfantform.value["tittle"],
      address: selectedTraveller["address"],
      pincode: selectedTraveller["pinCode"],
      city: selectedTraveller["city"],
      country: selectedTraveller["country"],
      dob:
        moment(this.addInfantform.value["dob"], "DD/MM/YYYY").format("YYYY-MM-DD")+"T00:00:00.000+0000",
      email: selectedTraveller["email"],
      firstName: this.addInfantform.value["firstName"].trim(),
      lastName: this.addInfantform.value["lastName"].trim(),
      // mobileNo: this.addInfantform.value["mobileNo"],
      // isdCode: this.addInfantform.value["isdCode"],
      isdCode:null,
      mobileNo: null,
      nationality: this.addInfantform.value["nationality"]["countryCode"],
      state: selectedTraveller["state"],
      passportExpireDate:
        moment(this.addInfantform.value["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD")+"T00:00:00.000+0000",
      passportNo: this.addInfantform.value["passportNo"],
      passportIssuedCountry: selectedTraveller["passportIssuedCountry"],
      passportLastName: selectedTraveller.passportLastName,
      passportMiddleName: selectedTraveller.passportMiddleName,
      passportFirstName: selectedTraveller.passportFirstName,
      passportPath: selectedTraveller.passportImage,

      travellerId: this.addInfantform.value["travellerid"],
      userAlias: this.currentUserID,
      imageFilePath: this.addInfantform.value["userImage"],

      frequentFlyerList: selectedTraveller['frequentFlyer'],
      visaList: selectedTraveller['visa'],

      isPrimaryTraveller: 0

    
    };
    this.travellerDataNew = requestBody;

  }

  modelValue;
  formControlName
  openCountryList(formfield, selectedvalue){
    console.log(selectedvalue)
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
          this.addInfantform.get('isdCode').setValue(res['currentCountrySelected']['phoneCode'])
        }else{
          this.addInfantform.get('nationality').setValue(res['currentCountrySelected']['countryId'])
        }
      }
     
      
    })
  }
}
