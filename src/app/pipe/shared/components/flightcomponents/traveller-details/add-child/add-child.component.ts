import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  forwardRef
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  NgForm
} from "@angular/forms";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { PickTravellerComponent } from "../pick-traveller/pick-traveller.component";
import { MatBottomSheet, MatSnackBar } from "@angular/material";
import { AuthServices } from "src/app/services/auth.service";
import * as moment from "moment";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { Subscription } from "rxjs";
import { GlobalService } from "src/app/services/global.service";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import * as country from "../../../../../../constants/new-countries.constant";
import { environment } from 'src/environments/environment';
import { IonicSelectableComponent } from 'ionic-selectable';
import { HttpClient } from '@angular/common/http';
import { createAutoCorrectedDatePipe } from 'src/app/pipe/shared/autoDatePipe';
import { NationalityComponent } from 'src/app/nationality/nationality.component';

@Component({
  selector: "app-add-child",
  templateUrl: "./add-child.component.html",
  styleUrls: ["./add-child.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddChildComponent)
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddChildComponent),
      multi: true
    }
  ]
})
export class AddChildComponent implements OnInit {
  @Input() indexchild;
  @Input() getdatachild;
  @Input() addchildData: any;
  childform: FormGroup;
  adultdetails: any;
  islogin: boolean;
  subscribe: any;
  childcall: boolean;
  adultcall: boolean;
  infantcall: boolean;
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
  valChild;
  dataFlight;
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private pservice: ProfileControllerService,
    private bottomSheet: MatBottomSheet,
    private sendTravllerDataService: SendTravllerDataService,
    private _authService: AuthServices,
    private globalservice: GlobalService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
   //code for mendatory fields
    this.valChild=this.addchildData;
    console.log("Data from travllers page:-"+ JSON.stringify(this.valChild));
    
    // this.valChild['dobValidation'] = (this.valChild['dobValidation'] == true ||this.valChild['passportValidation'] == true) ? true:(this.valChild['dobValidation'] == false ? false:true);
    // this.valChild['passportValidation'] = this.valChild['passportValidation'] == true ? true:(this.valChild['passportValidation'] == false ? false:true);
    // this.valChild['nationalityValidation'] = (this.valChild['nationalityValidation'] == true || this.valChild['passportValidation'] == true )? true:(this.valChild['nationalityValidation'] == false ? false:true);
     
     this.valChild['dobValidation'] = this.valChild['dobValidation'] == true ? true:( this.valChild['dobValidation'] == false ? false:true); 
     this.valChild['passportValidation'] = this.valChild['passportValidation'] == true ? true:( this.valChild['passportValidation'] == false ? false:true);
     this.valChild['nationalityValidation'] = this.valChild['nationalityValidation'] == true ? true:( this.valChild['nationalityValidation'] == false ? false:true); 
    // console.log("dobValidation:-"+this.valChild['dobValidation']);
    // console.log("passportValidation:-"+this.valChild['passportValidation']);
    // console.log("nationalityValidation:-"+this.valChild['nationalityValidation']);
   //----------------------------
    
  //  this.dataFlight= this.valChild['passengerLength'];
   this.dataFlight = 40;
   console.log(this.dataFlight);

    this.currentUserID = localStorage.getItem('loginemail');
    this.loggedTrue = localStorage.getItem("isLoggedIn");
    this.currentCountry = localStorage.getItem("countryId");
    this.getReturnDate();
    this.createform();
    this.childcall = true;
    this.infantcall = false;
    this.adultcall = false;
    this.islogin = this._authService.loggedIn().valueOf();
    // this.cd.markForCheck();
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
  get_two_years_date;
  getReturnDate() {
    this.dateSubscribtion = this.globalservice.getReturnDate.subscribe(
      (res: any) => {
        if (res) {
          this.getReturnJourneyDate = moment(res, "DD-MM-YYYY")
            .format("MM/DD/YYYY");

          this.journeyreturnDate = moment(res, "DD-MM-YYYY")
            .subtract(2, "y")
            .format("MM/DD/YYYY");
          this.get_two_years_date = moment(this.journeyreturnDate)
            .subtract(1, "d")
            .format("MM/DD/YYYY");

          this.getMinimumAgeChild = moment(this.journeyreturnDate)
            .subtract(10, "y")
            .format("MM/DD/YYYY");
        } else {
          this.journeyreturnDate = moment("11/29/2019")
            .subtract(2, "y")
            .format("MM/DD/YYYY");
          this.get_two_years_date = moment(this.journeyreturnDate)
            .subtract(1, "d")
            .format("MM/DD/YYYY");

          this.getMinimumAgeChild = moment(this.journeyreturnDate)
            .subtract(10, "y")
            .format("MM/DD/YYYY");
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
    this.iswarning = compareDate.isBetween(startDate, endDate);
  }


  createform() {
    this.childform = this.fb.group({
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
              value: this.get_two_years_date,
              message: `Child age should 2-12 years`
            }),
            RxwebValidators.minDate({
              value: this.getMinimumAgeChild,
              message: `Child age should 2-12 years`
            })
          ]
        })
      ],
      mobileNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Mobile number is required.'
          }), RxwebValidators.numeric(), RxwebValidators.maxLength({value:11, message:''}),]
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
              value: this.getReturnJourneyDate,
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
      type: ["child"],
      userImage: [""],
      travellerid: [""],
      getIsTravellerSelected: [""],
      travellerDataNew: [""]
    });
    // if(this.valChild['dobValidation'] == false) 
    // {
    //   console.log('dob');
    //   this.childform.get('dob').clearValidators();
    // }
    if(this.valChild['passportValidation'] == false)
    {
      //console.log('passportNo');
      this.childform.get('passportNo').clearValidators();
      this.childform.get('passportExpiryDate').clearValidators();
    } 
    if(this.valChild['nationalityValidation'] ==  false)
    {
      //console.log('nationality');
      this.childform.get('nationality').clearValidators();
    }
      this.childform.get('isdCode').clearValidators();
      this.childform.get('mobileNo').clearValidators();
  }

  onTouched: () => void = () => { };

  writeValue(v: any) {
    console.log(v)
    if (v != null) {
      if(v['passportExpiryDate'] == '' || v['passportExpiryDate'] == null || v['passportExpiryDate'] == 'Invalid date'){}
      else{
        if(v['passportExpiryDate']['length'] == 10){
          // console.log(v['passportExpiryDate']);
          this.childform.controls['passportExpiryDate'].markAsTouched();
        }
      }
      this.childform.setValue(v, { emitEvent: true });
    } else {
      // this.childform.get('tittle').setValue("");
      // this.childform.get('userImage').setValue("");
      this.childform.reset();
      this.childform.get('tittle').setValue("");
      this.childform.get('userImage').setValue("");
      // this.childform.get('nationality').setValue(" ");
      // this.childform.get('isdCode').setValue(" ");
      this.childform.get('firstName').setValue("");
      this.childform.get('lastName').setValue("");
      // this.getSelectedCountry();
    }
  }

  registerOnChange(fn: (v: any) => void) {
    this.childform.valueChanges.subscribe(val => {
      val["type"] = "C";
      if (val['travellerDataNew'] != "" && val['getIsTravellerSelected']) {
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
    });
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.childform.valid ? null : { child: { valid: false } };
  }
  getTittle(event, value) {
    this.childform.get("tittle").setValue(value);
  }


  formFilled = false;
  checkedToggle = false;
  rememberTraveller(value: Event, form: NgForm) {
    value.preventDefault();
    if (form.valid) {
      this.checkedToggle = true;
      this.formFilled = false;
      if (
        !this.childform.value["travellerid"] &&
        value["detail"]["checked"] == true
      ) {
        this.addTraveller();
      }
      if (value["detail"]["checked"] == false) {
        this.deleteTraveller(this.childform.value["travellerid"]);
      }
    } else {
      this.formFilled = true;
    }
  }

  addTraveller() {
    let requestBody = {
      dob:this.valChild['dobValidation'] == true ?
        moment(this.childform.value["dob"], "DD/MM/YYYY").format("YYYY-MM-DD") + "T00:00:00.000+0000":null,
      passportExpireDate:this.valChild['passportValidation'] == true ?
        moment(this.childform.value["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD") + "T00:00:00.000+0000":null,
      passportNo:this.valChild['passportValidation'] == true ? this.childform.value["passportNo"] :null,
      email: this.currentUserID,
      firstName: this.childform.value["firstName"].trim(),
      // isdCode: this.childform.value["isdCode"],
      // mobileNo: this.childform.value["mobileNo"],
      isdCode :null,
      mobileNo :null,
      lastName: this.childform.value["lastName"].trim(),    
      nationality:this.valChild['nationalityValidation'] ==  true ? this.childform.value["nationality"] : null,
      title: this.childform.value["tittle"],
      userAlias: this.currentUserID,
      passportIssuedCountry: this.childform.value["nationality"],
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
        this.childform.patchValue({
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
        this.childform.patchValue({
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

  getSelectedCountry() {
    let currentCounrt = this.newCountryList.filter(res => {
      return res["countryId"] == this.currentCountry;
    });
    this.childform.patchValue({
      nationality: currentCounrt[0]
    });
  }
  portChange(event: { component: IonicSelectableComponent; value: any }) {
  }
  updateTraveller(selectedTraveller) {
    let requestBody = {
      title: this.childform.value["tittle"],
      address: selectedTraveller["address"],
      pincode: selectedTraveller["pinCode"],
      city: selectedTraveller["city"],
      country: selectedTraveller["country"],
      dob:
        moment(this.childform.value["dob"], "DD/MM/YYYY").format("YYYY-MM-DD") + "T00:00:00.000+0000",
      email: selectedTraveller["email"],
      firstName: this.childform.value["firstName"].trim(),
      lastName: this.childform.value["lastName"].trim(),
      // mobileNo: this.childform.value["mobileNo"],
      // isdCode: this.childform.value["isdCode"],
      isdCode :null,
      mobileNo :null,
      nationality: this.childform.value["nationality"]["countryCode"],
      state: selectedTraveller["state"],

      passportExpireDate:
        moment(this.childform.value["passportExpiryDate"], "DD/MM/YYYY").format("YYYY-MM-DD") + "T00:00:00.000+0000",
      passportNo: this.childform.value["passportNo"],
      passportIssuedCountry: selectedTraveller["passportIssuedCountry"],
      passportLastName: selectedTraveller.passportLastName,
      passportMiddleName: selectedTraveller.passportMiddleName,
      passportFirstName: selectedTraveller.passportFirstName,
      passportPath: selectedTraveller.passportImage,

      travellerId: this.childform.value["travellerid"],
      userAlias: this.currentUserID,
      imageFilePath: this.childform.value["userImage"],

      frequentFlyerList: selectedTraveller['frequentFlyer'],
      visaList: selectedTraveller['visa'],

      isPrimaryTraveller: 0


    };
 
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
          this.childform.get('isdCode').setValue(res['currentCountrySelected']['phoneCode'])
        }else{
          this.childform.get('nationality').setValue(res['currentCountrySelected']['countryId'])
        }
      }
     
      
    })
  }
}


// private markFormGroupTouched(form: FormGroup) {
//   Object.values(form.controls).forEach(control => {
//     control.markAsDirty();

//     if ((control as any).controls) {
//       this.markFormGroupTouched(control as FormGroup);
//     }
//   });
// }