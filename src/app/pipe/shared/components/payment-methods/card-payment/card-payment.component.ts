import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef, AfterViewInit
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  NgForm,
} from "@angular/forms";
import { FlightService } from "src/app/services/flight.service";
import { Router } from "@angular/router";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription, Observable } from "rxjs";
import { FareDetailsComponent } from "../../flightcomponents/fare-details/fare-details.component";
import { MatBottomSheet } from "@angular/material";
import { environment } from "src/environments/environment";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import swal from "sweetalert2";
import Swal from "sweetalert2";
import { AuthServices } from "src/app/services/auth.service";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import {MatDialog} from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import { NationalityComponent } from 'src/app/nationality/nationality.component';
import * as country from "../../../../../constants/new-countries.constant";
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { FareRulesComponent } from '../../flightcomponents/fare-rules/fare-rules.component';
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import { OverlayService } from 'src/app/services/overlay.service';
// import { AbstractControl } from '@angular/forms';
// export function removeSpaces(control: AbstractControl) {
//   if (control && control.value && !control.value.replace(/\s/g, '').length) {
//     control.setValue('');
//   }
//   return null;
// }

@Component({
  selector: "app-card-payment",
  templateUrl: "./card-payment.component.html",
  styleUrls: ["./card-payment.component.scss"],
  providers: [MessageService],
})
export class CardPaymentComponent implements OnInit,AfterViewInit, OnDestroy {
  matcher = new MyErrorStateMatcher();

  @ViewChild("form") form: ElementRef;
  // TermUrl = 'http://203.122.41.147:8080/pwa/v1/book/bookingConfirmation/'
  // @Input() contactNox;

  @Input() threecc;
  @Input() bookandholdstatus;
  @Input() autoticketingDisable;
  todayDate = moment().format("MM/YYYY");
  myloading = true;

  sliderOpts = {
    zoom: false,
    slidesPerView: 3,
    direction: "horizontal",
  };
  newCard: boolean = false;
  oldCard: boolean = false;
  show: boolean;
  cvv: boolean;
  hide: any;
  subscribe: any;
  multiflight: any;
  cp: any;
  cprice: any;
  selectedflight2: any;
  selectedflight: any;
  selectedflightreturnway: any;
  branchCode: string;
  branchCurrencyCode: string;
  branchId: string;
  countryId: string;
  groupId: string;
  searchKey: string;
  selectedFlightOptionKey: string;
  subscriptiondata: any;
  fulldatefromcalender: any;
  departDate: any;
  returnDate: any;
  reqdepartdate: string;
  reqreturndate: string;
  pgPostURL: any;
  bookingRefNo: any;
  payReq: any;
  xid: any;
  returnURL: any;
  oldCardId :any;
  methodForm = "POST";
  @ViewChild("form") cardPayForm: any;
  travSub: Subscription;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;

  paymentform: FormGroup;
  paymentformcheckout: FormGroup;
  cardvaluefilled: any;
  cardnumber: any;
  cardname: any;
  expMonth: any;
  expYear: any;
  cvvNumber: any;
  typeofform: any;
  array = ['Amadeus','Indigo','Spice','Travelfusion','Galileo','Sabre'];
  paymentformthreeg: FormGroup;
  savecardform: FormGroup;
  threeG: any;
  address: any;
  cardholdername: any;
  country: any;
  email: any;
  phone: any;
  street: any;
  zipcode: any;
  state: any;
  city: any;
  fraudresponse: Object;
  splitform: any;
  cybersource: any;
  threeGpay: any;
  countryCode: any;
  checkoutform: any;
  tripType: string;
  isUccfTxn: any;
  isPercent: number;
  models: any;
  chargePercent: any;
  chargeAmt: any;
  surchargeAmount: any;
  actualFareTktPcc: any;
  amount: number;
  cardtype: string;
  value: any = "";
  idx: any;
  sum: any = 0;
  //$scope.value = '';
  //$scope.sum = 0;
  alt = false;
  isUccflight: any;
  cardid: string;
  @Input() allPassengers;
  serviceVendor: string;
  fareConfirmReqKey: any;
  loginemail: string;
  onwarddate: string;
  returndate: string;
  roundtrip: string;
  submitted: boolean;

  formGroup: FormGroup;
  titleAlert: string = "This field is required";
  post: any = "";
  displayfareoneway: number;
  islogin: string;
  dummyforms: FormGroup;
  surchargeAmount2: number;
  abc: number;
  percentCal: any;
  cardlist: any;
  splitmonth: any;
  splityear: any;
  savecardNumber: any;
  SavenameOnCard: any;
  dynamicCurrency: any;
  bankdetails: Object;
  expMonthsplit: any;
  expYearsplit: any;
  returnwaycurreny: any;
  searchPageURL: string;
  multiCityCurrency: any;
  multiflightFare: number;
  surchargeAmountnewx: any;
  totalCardLength: any;
  branchMob: string;
  branchEmailId: string;
  @Input() tncurl;
  onewayflight: any;
  fareConfirmReqKeyLocal: string;
  operatingCountry: any;
  uccftxncharge: any;
  isUccflightnew: any;
  isUccfTxnnew: any;
  fraudcallresponseCyber: Object;
  fraudresponseofSaveCheckout: Object;
  myamount: number;
  fareO: number;
  fareR: any;
  fareM: number;
  isuccfFinal: any;
  isUccflightFinal: any;
  multiflightFareNoceil: number;
  onewayfareNoceil: number;
  cpriceNoceil: any;
  isuccfTxnValue: any;
  isCardInValidchkout:boolean = false
  lengthfinal: any;
  cardname_max_length_40 = ' 40 characters are allowed!';
  ABCX = "ABCX"
  d1 = new Date();
  datevalue = this.d1.getTime() + this.ABCX
  phone_firsstPL: any;
  cardExpiryDateMask: Array<string | RegExp> = [/\d/, /\d/, "/", /\d/, /\d/];
  autoCorrectedDatePipe: any = createAutoCorrectedDatePipe("mm/yy");
  interswitchForm:FormGroup
  interSwitchServiceCharge: string;
  interSwitchsurchargeCap: string;
  currencyId: any;
  customerName: any;
  hash: any;
  paymentAmount: any;
  paymentNetworkTransactionID: any;
  productType: any;
  transactionID: any;
  todayDateiss = moment().format("YYYY-MM-DD");
  newCharge: number;
  dynamicPGID: number;
  backurl: string;
  ccd: any;
  affilatePartnerId: string;
  isAffBooking: string;
  beforeOCF_oneway: number;
  beforeOCF_roundtrip: number;
  beforeOCF_multicity: number;


  constructor(
    public dialog: MatDialog,
    private flightService: FlightService,
    private bottomSheetref: MatBottomSheet,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private authService: AuthServices,
    private sendTravelerData: SendTravllerDataService,
    private profileControllerService: ProfileControllerService,
    private snackBar: MatSnackBar,
    private messageService: MessageService,
    private cookieService: CookieService,
      private cd:ChangeDetectorRef,
    private elementRef:ElementRef,
    private overlayService: OverlayService 
  ) {
    this.tripType = sessionStorage.getItem("tripType");
  
    //  //console.log(this.tripType);
    
  }

  @ViewChild("myFormPost") myFormPost: ElementRef;
  ionViewWillEnter() {
   // this.geturl()
   this.closeLoading();
   
    ////console.log("i am ion view qill enter .>>card payment");
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogboxComponent);
    dialogRef.afterClosed().subscribe(result => {
   //   //console.log(`Dialog result: ${result}`);
    });
  }



  flag = 1;
  ngOnInit() {
    this.isAffBooking = sessionStorage.getItem('isAffBooking');
    this.searchPageURL = sessionStorage.getItem("searchPageURL");
    localStorage.removeItem("BOOKRN");
    sessionStorage.removeItem("BOOKRN");

    // //console.log('datevalue',this.datevalue);

    this.dummyform();
    //this.getAllCountryList();
    this.interswitchform()
    this.createthreegform();
    this.createform();
    this.createform2();
    this.savecardforms();
    this.islogin = localStorage.getItem("isLoggedIn");
    this.loginemail = sessionStorage.getItem("loginemail");
  //  //console.log(this.loginemail);
    this.onwarddate = sessionStorage.getItem("returnwaydepartDate");
    this.returndate = sessionStorage.getItem("returnwayreturnDate");
   // //console.log('onwarddate',this.onwarddate);
   // //console.log('returndate',this.returndate);
    this.tripType = sessionStorage.getItem("tripType");
   /// //console.log(this.tripType);

    this.branchMob = localStorage.getItem('BranchcontactNo');
    this.branchEmailId =  localStorage.getItem('branchEmailId');

    this.roundtrip = sessionStorage.getItem("tripround");
   // //console.log(this.roundtrip);

    this.isUccflight = sessionStorage.getItem("isUccflight");
    // this.selectedFlightOptionKey = localStorage.getItem('selectedFlightOptionKey')
   
    this.isuccfTxnValue =  sessionStorage.getItem('isuccfTxnValue');
    // //console.log('isuccfTxnValue',this.isuccfTxnValue);

       this.typeofform = this.threecc;
   // //console.log("type of form is", this.typeofform);
    this.cybersource = this.typeofform.includes("2C");
    this.threeGpay = this.typeofform.includes("1");
      this.checkoutform = this.typeofform.includes("235");


 // this.typeofform = '236-Interswitch';
 //this.typeofform = '2-Cyber Sourcex'
  //this.typeofform = '235-Checkout';
 //this.typeofform = '1-3G Pay';
 //this.typeofform = '1-3G Pay';
    this.getAllNewCountry();
    this.myloading = false;
    this.getsingleflight();

    this.getsingleflightmulti();
    this.newCard = true;
    //this.calenderdata();

    /////get flight
    this.branchCode = localStorage.getItem("branchCode");
   // //console.log(this.branchCode);
    this.branchCurrencyCode = localStorage.getItem("branchCurrencyCode");
    ////console.log(this.branchCurrencyCode);

    this.interSwitchServiceCharge =   sessionStorage.getItem("interSwitchServiceCharge");
   this.interSwitchsurchargeCap =   sessionStorage.getItem("interSwitchsurchargeCap");

   ////console.log('interSwitchServiceCharge>>>>>>>>',this.interSwitchServiceCharge);

  // //console.log('interSwitchsurchargeCap>>>>>>>>',this.interSwitchsurchargeCap);

    this.branchId = localStorage.getItem("branchId");
    this.groupId = localStorage.getItem("groupId");
    this.searchKey = sessionStorage.getItem("searchKey");
    this.countryId = localStorage.getItem("countryId");
    this.countryCode = localStorage.getItem("countryCode");
    this.ccd =  this.countryCode.toLowerCase();

   // this.validateBooking();
    this.fareConfirmReqKeyLocal = sessionStorage.getItem('fareConfirmReqKey');
   // //console.log('fareConfirmReqKeyLocal',this.fareConfirmReqKeyLocal);

    this.selectedFlightOptionKey = sessionStorage.getItem("selectedFlightOptionKey");
   // //console.log(this.selectedFlightOptionKey);

    this.serviceVendor = sessionStorage.getItem("serviceVendor");
    this.affilatePartnerId = sessionStorage.getItem("affilatePartnerId");
    this.findCard();
    this.checkvendor();

    this.gettravllerfromservice();

    this.validateBooking();

       let PassengersList = this.allPassengers;
    this.phone_firsstPL = PassengersList[0]['mobileNo'];

    //this.paymentform.get("newcardnumber").valueChanges.subscribe(x => {
     // //console.log('firstname value changed',x)
    //  //console.log()
   //})
  
  }
  
 

  ngAfterViewInit() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.innerHTML="//console.log('script added done');"; //inline script
    s.src = "https://h.online-metrix.net/fp/tags.js?org_id=1snn5n9w&amp;session_id=satguru_b2c1+datevalue";
    this.elementRef.nativeElement.appendChild(s);
   // //console.log(s);
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  dummyform() {
    this.dummyforms = this.fb.group({
      dname: [""],
      dmname: [""],
    });
  }

  savecardforms() {
    this.savecardform = this.fb.group({

      cvvnumber: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required(), RxwebValidators.numeric()]
        })
      ],

      // cvvnumber: [
      //   "",
      //   [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      // ],
      checkeboxxsave: ["", Validators.required],
    });
  }

  interswitchform(){
    this.interswitchForm = this.fb.group({
      
      cardname: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.maxLength({value:40, message:''}),

          ]
        })
      ],
      email: [
 "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Email id is required'
          }),
          RxwebValidators.pattern({
            expression: { pattern: /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/ },
            message: "Please enter valid email",
          }),
           RxwebValidators.maxLength({value:45, message:''}),
        ],
        }),
      ],
      phone: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Phone no. is required.'
          }), RxwebValidators.numeric(),  RxwebValidators.maxLength({value:12, message:''}),],
        }),
      ],
      checkeboxx: ["", Validators.required],

   
    });
  }

  createform() {
    this.paymentform = this.fb.group({
      //cardname: ["", Validators.required],
      cardname: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.maxLength({value:40, message:''}),

          ]
        })
      ],
  
      newcardnumber: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required(), RxwebValidators.numeric()]
        })
      ],
      // newcardnumber: [''],
      // expMonth: ['',[Validators.required,Validators.maxLength(2)]],
      expYear: ["", Validators.required],
      checkeboxx: ["", Validators.required],
  
      cvvNumber: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required(), RxwebValidators.numeric()]
        })
      ],
    });
  }

  createform2() {
    this.paymentformcheckout = this.fb.group({
      //cardname: ["", Validators.required],
      cardname: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.maxLength({value:40, message:''}),

          ]
        })
      ],
      newcardnumber: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required(), RxwebValidators.numeric()]
        })
      ],
      // newcardnumber: [''],
      //expMonth: ['',[Validators.required,Validators.maxLength(2)]],
      expYear: ["", Validators.required],
      checkeboxx: ["", Validators.required],
      cvvNumber: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required(), RxwebValidators.numeric()]
        })
      ],
    });
  }

  ////only numbers allowed

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ///////3-g pay form create code ----------
  createthreegform() {
    this.paymentformthreeg = this.fb.group({
      //cardholdername: ["", Validators.required],
      cardname: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.maxLength({value:40, message:''}),

          ]
        })
      ],
      email: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Email id is required'
          }),
          RxwebValidators.pattern({
            expression: { pattern: /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/ },
            message: "Please enter valid email",
          }),
           RxwebValidators.maxLength({value:45, message:''}),
        ],
        }),
      ],
      // phone: [
      //   "",
      //   RxwebValidators.compose({
      //     validators: [RxwebValidators.required(),
      //        RxwebValidators.numeric(), 
      //        RxwebValidators.maxLength({value:10}),]
      //   })
      // ],
      // email:['',Validators.required],
     // phone: ["", Validators.required],
     // address: ["", Validators.required],
     phone: [
      "",
      RxwebValidators.compose({
        validators: [RxwebValidators.required({
          message:'Phone no. is required.'
        }), RxwebValidators.numeric(),  RxwebValidators.maxLength({value:12, message:''}),],
      }),
    ],
     address: [
      "",
      RxwebValidators.compose({
        validators: [
          RxwebValidators.required(),
          RxwebValidators.maxLength({value:250, message:''})],
      }),
    ],
    zipcode: [
      "",
      RxwebValidators.compose({
        validators: [
          RxwebValidators.required(),
          RxwebValidators.numeric(), 
           RxwebValidators.maxLength({value:8, message:''})]
       
      }),
    ],
    city: [
      "",
      RxwebValidators.compose({
        validators: [
          RxwebValidators.required(),
          RxwebValidators.pattern({
            expression: { alpha: /^[a-zA-Z ]*$/ },
            message: "Only alphabets are allowed.",
          }),
          RxwebValidators.maxLength({value:25, message:''})
        ],
      }),
    ],
      street: ["", Validators.required],
      country: ["", Validators.required],
     // zipcode: ["", Validators.required],
     // city: ["", Validators.required],
     // state: ["", Validators.required],
      state: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed.",
            }),
            RxwebValidators.maxLength({value:25, message:''})
          ],
        }),
      ],
      checkeboxxneww: ["", Validators.required],
    });
  }

 

  ///get selected flight ------
newCradboolean:boolean = true;

  addnewCard() {
this.newCradboolean = true;
this.paymentform.reset();
this.paymentformcheckout.reset();
this.multiflightFare = this.fareM;
this.cprice =  this.fareR;
this.displayfareoneway = this.fareO;
localStorage.removeItem('surchargeAmount');
this.surchargeAmount = 0;

    this.newCard = true;
    this.oldCard = false;
    this.savecardclick = false;
    this.oldCardClick = false;
  }
  savecardclick: boolean = false;
  oldCardClick = false;
  oldCardDetails(data) {
    this.newCradboolean = false;

    this.oldCardId = data.paymentMethodId;
    this.savecardclick = true;
this.oldCardClick = true;
    this.newCard = false;
    this.oldCard = true;
    ////console.log("on click of card", data);
    this.savecardNumber = data.originalCardNumber;
    this.SavenameOnCard = data.nameOnCard;
    let expireDate = data.expireDate;
    let splitdate = expireDate.split("-");
    this.splityear = splitdate[0];
    this.splitmonth = splitdate[1];

    // //console.log("on click card-yr", this.splityear);
    // //console.log("on click card-mont", this.splitmonth);
    // //console.log("on click card-cardno", this.savecardNumber);
    // //console.log("on click card holder name", this.SavenameOnCard);
    
    this.updateForSave(this.savecardNumber);
  }

  getsingleflightmulti() {
    this.subscribe = this.flightService
      .getselectedFlightmulti()
      .subscribe(res => {
        if (res) {
          this.fareConfirmReqKey = res["fareConfirmReqKey"];
          ////console.log('multicity selected flight',res);
          this.multiflight = res["onwardFlightOption"];
          this.cp = res["currentPrice"];
          if (this.tripType == "multicity") {
            this.selectedflight = res["onwardFlightOption"];
            this.setmultiCityFare(res["onwardFlightOption"])
            // this.multiCityCurrency = this.multiflight.flightFare.currency
            // this.multiflightFare = this.multiflight.flightFare.totalBaseFare + this.multiflight.flightFare.totalTax + this.multiflight.flightFare.totalFees + this.multiflight.flightFare.markupPrice + this.multiflight.flightFare.serviceChargePrice - this.multiflight.flightFare.discountPrice
          }

        } else {
        }
      });
  }
  ///////////make payment of cyber  source form ----if 2 cyber  source

  ///chekout - paymentgetwaid --235      /////cyber soruce -2

  get f() {
    return this.paymentform.controls;
  }

  checking() {}
  checkoutFormAndSavcheckout() {
    ////console.log("click on save card");
   // //console.log(this.sessisionTimeOut());
    if (!this.sessisionTimeOut()) {
      this.sessionTimeOutPopupShow();
    } else {
      if (this.savecardclick) {
       // //console.log("from if part");

        this.checkoutFormfromave();
      } else {
      //  //console.log("from else part");
        this.checkoutForm();
      }
    }
  }

  cyberSourceFormAndSavecybersource() {
   // //console.log("click on save card");
   // //console.log(this.sessisionTimeOut());
    this.sessisionTimeOut();
    if (!this.sessisionTimeOut()) {
      this.sessionTimeOutPopupShow();
    } else {
      if (this.savecardclick) {
       // //console.log("from if part");

        this.cybersorcecontinuefromsave();
      } else {
      //  //console.log("from else part");
        this.cyberSourceForm();
      }
    }
  }

  // values = '';

  // onKey(event: any) {
  //   this.values += event.target.value;
  //   alert('vv');
  // }
//////////strt update method - cyber source
//////////strt update method - cyber source

valued = '';
onKey(event: any) { 
  this.valued = event.target.value;
  ////console.log('card entered',this.valued);
if( this.valued != '' && this.valued.length>12 && !this.paymentform.controls.newcardnumber.hasError('numeric') && !this.paymentformcheckout.controls.newcardnumber.hasError('numeric')){
 ///this.valued = value;

 setTimeout(() => {
   
 

  this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  this.surchargeAmountnewx = 0;
  this.surchargeAmount = 0;
  localStorage.removeItem('surchargeAmount');

  ////console.log(this.valued);
  
  this.flightService.checkfraudcard(this.valued).subscribe((res) => {
   // //console.log("checkfraudcard response-is this card fraud", res);
    this.fraudresponse = res;
    if (res == false) {


////////////////////////

if(this.typeofform == '2-Cyber Source'){
 
  this.paymentform.get('newcardnumber').setErrors(null)
  this.isCardInValid = false;
  ////console.log("now vaild untoched markAsPristinevv null>>cybersource");
}if(this.typeofform == '235-Checkout'){

  this.paymentformcheckout.get('newcardnumber').setErrors(null)

  this.isCardInValidchkout = false;
 // //console.log("now vaild untoched >>chkout");
}

/////////////////////

      ////console.log(this.valued);

      this.detectCardType(this.valued);
    //  //console.log(this.valued);

      this.cardIds(this.cardid);
      if(this.typeofform == '2-Cyber Source'){
       this.dynamicPGID = 2;
      }else{
        this.dynamicPGID = 235;
      }
      var body = {
        cardId: this.cardid,
        cardType: 1,
        pgId: this.dynamicPGID,
        branchId: this.branchId,
      };
      this.flightService.calculateSurcharge(body).subscribe((res) => {
      //  //console.log('calculateSurcharge api',res);
        if (res) {
          if(res['statusMessage'] == 'Pg Data is not Available'){
            this.isPercent = 5;
          }else{
            this.models = res["models"][0];
            this.isPercent = this.models.isPercent;
            this.chargePercent = this.models.chargePercent;
            this.chargeAmt = this.models.chargeAmt;
            //this.isPercent = this.models.isPercent ? this.models.isPercent : 3;
  
            // //console.log('is perecnt >>>>',this.isPercent);
            // //console.log('chargePercent >>>',this.chargePercent);
            // //console.log('chargeAmt>>',this.chargeAmt);
            // //console.log('value of uccfTxn -cyberssource >>',this.isuccfFinal);
          }
          // this.models = res["models"][0];
          // this.isPercent = this.models.isPercent;
          // this.chargePercent = this.models.chargePercent;
          // this.chargeAmt = this.models.chargeAmt;

          // //console.log('is perecnt >>>>',this.isPercent);
          // //console.log('chargePercent >>>',this.chargePercent);
          // //console.log('chargeAmt>>',this.chargeAmt);
          // //console.log('value of uccfTxn -cyberssource >>',this.isuccfFinal);

//************
if (this.isPercent == 0) {
  ////console.log('i m from is percent zero')
  if (this.isuccfTxnValue != 'false') {
    // uccf true
    if (this.tripType == "oneway" || this.tripType == "multicity") {
      this.myamount =
      parseFloat(this.selectedflight.flightFare.t3Price) +
      parseFloat(this.selectedflight.flightFare.markupPrice) +
      parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
      parseFloat(this.selectedflight.flightFare.discountPrice) -
      parseFloat(this.selectedflight.flightFare.actualTotalFare);
     // //console.log(this.myamount);

      if ((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && ( this.myamount < 0 || this.myamount == 0)) {

          ///auto ticketing case
          if(this.autoticketingDisable ==false){

            this.myamount = this.chargeAmt;
            this.surchargeAmount = this.chargeAmt;
            this.surchargeAmountnewx =  this.surchargeAmount;
            ////console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
           // //console.log('surchrge - autoticketing enable case')
           // this.setFinalFare();
           this.multiflightFare = this.fareM;
             this.cprice =  this.fareR;
             this.displayfareoneway = this.fareO;
             ///localStorage.removeItem('surchargeAmount');
             //  //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
             //  //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
              ////add uccf in online fee >>start
            
              this.surchargeAmount =  this.surchargeAmount;
                  /// add uccf in online fee >>end
                  localStorage.setItem('surchargeAmount',this.surchargeAmount);
               this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
               this.displayfareoneway = Math.ceil(this.displayfareoneway);
               this.multiflightFare = this.multiflightFare + this.surchargeAmount;
               this.multiflightFare= Math.ceil(this.multiflightFare);

          }else{

         
         
        this.surchargeAmount = 0;
        this.surchargeAmountnewx = this.surchargeAmount;
        ////console.log('surchargeAmount for >>>>>', this.surchargeAmount)
     // this.setFinalFare();


     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       ////console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
      // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
     // //console.log( "uccfinal>>" , uccftxnchargefinal  );
     // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
      }//auto
      }else if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.myamount > 0 ){
        //new condition added on 26april21
//this.surchargeAmount = 0;
this.surchargeAmount = this.chargeAmt; //added on 30 april 21

this.surchargeAmountnewx = this.surchargeAmount;

this.multiflightFare = this.fareM;
this.cprice = this.fareR;
this.displayfareoneway = this.fareO;

let uccftxncharge = this.uccftxncharge;
let uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
this.surchargeAmount = this.surchargeAmount + uccftxnchargefinal;
localStorage.setItem('surchargeAmount',this.surchargeAmount);
this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
this.displayfareoneway = Math.ceil(this.displayfareoneway);
this.multiflightFare = this.multiflightFare + this.surchargeAmount;
this.multiflightFare= Math.ceil(this.multiflightFare);

}    else {
        this.surchargeAmount = this.chargeAmt;
        this.surchargeAmountnewx = this.surchargeAmount;
 

    this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
      // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
      // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
     // //console.log( "uccfinal>>" , uccftxnchargefinal  );
     // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

      }
     // this.setFinalFare();
   } else {

    ///////////////////////////////////Retunway>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    this.myamount =
      parseFloat(this.selectedflightreturnway.t3Price) +
      parseFloat(this.selectedflightreturnway.markupPrice) +
      parseFloat(this.selectedflightreturnway.serviceChargePrice) -
      parseFloat(this.selectedflightreturnway.discountPrice) -
      parseFloat(this.selectedflightreturnway.actualTotalFare);
      ////console.log('roundtrip myamount>>>>',this.myamount);

      if ((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && ( this.myamount < 0 || this.myamount == 0)) {

///auto ticketing case
if(this.autoticketingDisable ==false){

  ////console.log('surchrge - autoticketing enable case')

  this.surchargeAmount = this.chargeAmt;
      this.surchargeAmountnewx =  this.surchargeAmount;
      ////console.log('surchargeAmount>>>>>',this.surchargeAmount)
      //this.setFinalFare();
      this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
    
      this.surchargeAmount =  this.surchargeAmount ;
    
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
          this.cprice = this.cprice+this.surchargeAmount;
          this.cprice = Math.ceil(this.cprice);

       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

}else{



      this.surchargeAmount = 0;
      this.surchargeAmountnewx =  this.surchargeAmount
     // this.setFinalFare();
     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
      // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
      // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
     // //console.log( "uccfinal>>" , uccftxnchargefinal  );
     // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
          this.cprice = this.cprice+this.surchargeAmount;
          this.cprice = Math.ceil(this.cprice);

       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
      }
   }
   else if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.myamount > 0 ){
    //new condition added on 26april21
//this.surchargeAmount = 0; 
this.surchargeAmount = this.chargeAmt; //added on 30 april 21
this.surchargeAmountnewx = this.surchargeAmount;

this.multiflightFare = this.fareM;
this.cprice = this.fareR;
this.displayfareoneway = this.fareO;

let uccftxncharge = this.uccftxncharge;
let uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
this.surchargeAmount = this.surchargeAmount + uccftxnchargefinal;
localStorage.setItem('surchargeAmount',this.surchargeAmount);

this.cprice = this.cprice+this.surchargeAmount;
          this.cprice = Math.ceil(this.cprice);

}  
   else{
      this.surchargeAmount = this.chargeAmt;
      this.surchargeAmountnewx =  this.surchargeAmount;
     // //console.log('surchargeAmount>>>>>',this.surchargeAmount)
      //this.setFinalFare();
      this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
     //  //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
     //  //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
    //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
     // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);

          this.cprice = this.cprice+this.surchargeAmount;
          this.cprice = Math.ceil(this.cprice);

      
    }
  } ///////////////////////////////////Retunway  end>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
  } ////else of is uccf////////////
  else {
    this.myamount = this.chargeAmt;
    this.surchargeAmount = this.chargeAmt;
    this.surchargeAmountnewx =  this.surchargeAmount;
    ////console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
   // this.setFinalFare();
   this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
    //   //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
     //  //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
     // //console.log( "uccfinal>>" , uccftxnchargefinal  );
     // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
          this.cprice = this.cprice+this.surchargeAmount;
          this.cprice = Math.ceil(this.cprice);

       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
  }

  }else if (this.isPercent == 1) {

if (this.tripType == "oneway" || this.tripType == "multicity") {  
  this.amount =
    parseFloat(this.selectedflight.flightFare.markupPrice) +
    parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
    parseFloat(this.selectedflight.flightFare.discountPrice);
    ////console.log('this.amount oneway,multicty',this.amount);
    if (this.selectedflight.currencyRate > 0) {
      this.actualFareTktPcc =
        this.selectedflight.flightFare.actualTotalFare *
        this.selectedflight.currencyRate;
    } else {
      this.actualFareTktPcc =
        parseFloat(this.selectedflight.flightFare.totalBaseFare) +
        parseFloat(this.selectedflight.flightFare.totalTax) +
        parseFloat(
          this.selectedflight.flightFare.totalFee != undefined
            ? this.selectedflight.flightFare.totalFee
            : this.selectedflight.flightFare.totalFees
        );
    }
    //if (this.amount > 0 && !this.isuccfFinal) {
      if (this.amount > 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc + this.amount;


     // //console.log('amount>>',this.amount)
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
     // //console.log( "surchargeAmount>>" , this.surchargeAmount  );
      this.surchargeAmountnewx =  this.surchargeAmount;
     // //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
     // this.setFinalFare();
  
     this.multiflightFare = this.fareM;
       this.cprice =  this.fareR;
       this.displayfareoneway = this.fareO;
       ///localStorage.removeItem('surchargeAmount');
         ////console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
         ////console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
     
        this.surchargeAmount =  this.surchargeAmount ;
       // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
            /// add uccf in online fee >>end
            localStorage.setItem('surchargeAmount',this.surchargeAmount);
         this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
         this.displayfareoneway = Math.ceil(this.displayfareoneway);
         this.multiflightFare = this.multiflightFare + this.surchargeAmount;
         this.multiflightFare= Math.ceil(this.multiflightFare);

  
    } else if (this.amount < 0 || this.amount == 0) {
      // booking.uccfTxnCharge = 0;
     // if( this.serviceVendor == "Amadeus"  && this.isuccfFinal){
      if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.isuccfTxnValue == 'true'){
       
        if(this.autoticketingDisable ==false){
          this.amount = this.actualFareTktPcc + this.amount;

        //  //console.log('amount>>',this.amount)
          this.surchargeAmount = (this.amount * this.chargePercent) / 100;
        //  //console.log( "surchargeAmount>>" , this.surchargeAmount  );
          this.surchargeAmountnewx =  this.surchargeAmount;
        //  //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
         // this.setFinalFare();
        // //console.log('surchrge - autoticketing enable case')

         this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           
           
            this.surchargeAmount =  this.surchargeAmount;
          //  //console.log( "surchargeAmount >>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);

        }else{
          this.amount = 0; 

        //  //console.log('amount>>',this.amount)
          this.surchargeAmount = (this.amount * this.chargePercent) / 100;
        //  //console.log( "surchargeAmount>>" , this.surchargeAmount  );
          this.surchargeAmountnewx =  this.surchargeAmount;
         // //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
         // this.setFinalFare();
      
         this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           ///localStorage.removeItem('surchargeAmount');
           //  //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
           //  //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            ////add uccf in online fee >>start
            let uccftxncharge =    this.uccftxncharge;
            let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
           // //console.log( "uccfinal>>" , uccftxnchargefinal  );
           // //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);

        }

       
        
      }else{
        this.amount = this.actualFareTktPcc + this.amount;

       // //console.log('amount>>',this.amount)
        this.surchargeAmount = (this.amount * this.chargePercent) / 100;
        ////console.log( "surchargeAmount>>" , this.surchargeAmount  );
        this.surchargeAmountnewx =  this.surchargeAmount;
        ////console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
       // this.setFinalFare();
    
       this.multiflightFare = this.fareM;
         this.cprice =  this.fareR;
         this.displayfareoneway = this.fareO;
         ///localStorage.removeItem('surchargeAmount');
          // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
           ////console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
          ////add uccf in online fee >>start
         // let uccftxncharge =    this.uccftxncharge;
       //  let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
          this.surchargeAmount =  this.surchargeAmount ;
          ////console.log( "uccfinal>>" , uccftxnchargefinal  );
          ////console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
              /// add uccf in online fee >>end
              localStorage.setItem('surchargeAmount',this.surchargeAmount);
           this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
           this.displayfareoneway = Math.ceil(this.displayfareoneway);
           this.multiflightFare = this.multiflightFare + this.surchargeAmount;
           this.multiflightFare= Math.ceil(this.multiflightFare);

      }

    }
     else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc;

      ////console.log('amount>>',this.amount)
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      ////console.log( "surchargeAmount>>" , this.surchargeAmount  );
      this.surchargeAmountnewx =  this.surchargeAmount;
      ////console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
     // this.setFinalFare();
  
     this.multiflightFare = this.fareM;
       this.cprice =  this.fareR;
       this.displayfareoneway = this.fareO;
       ///localStorage.removeItem('surchargeAmount');
        // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
        // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
        ////add uccf in online fee >>start
      
        this.surchargeAmount =  this.surchargeAmount;
        
        ////console.log( "surchargeAmount>>" , this.surchargeAmount);
            /// add uccf in online fee >>end
            localStorage.setItem('surchargeAmount',this.surchargeAmount);
         this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
         this.displayfareoneway = Math.ceil(this.displayfareoneway);
         this.multiflightFare = this.multiflightFare + this.surchargeAmount;
         this.multiflightFare= Math.ceil(this.multiflightFare);

      
    }else if(this.amount>0 && this.isuccfTxnValue == 'true'){
    // this.amount = 0; 25may
     

     //  //console.log('amount for uccftxn true>>>>',this.amount);
       this.surchargeAmount = (this.amount * this.chargePercent) / 100;
     this.surchargeAmountnewx =  this.surchargeAmount;
      // //console.log('surchargeAmount before adding uccf>>>>',this.surchargeAmount);
      
      
           this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
      //        //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
      //        //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
           let uccftxncharge =    this.uccftxncharge;
            let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
           //console.log( "surchargeAmount after adding uccf>>" , this.surchargeAmount);
            localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);
             
      
    }
    ////amount>0 ,uccftxnvalue ==true >>>end
   

  }///oneway-mutlcity end
  else{  ////code for retunway ............................strt
       this.amount =
       parseFloat(this.selectedflightreturnway.markupPrice) +
       parseFloat(this.selectedflightreturnway.serviceChargePrice) -
       parseFloat(this.selectedflightreturnway.discountPrice);
      // //console.log('this.amount>>>retunway is percent1>>>>>>>>',this.amount);
/////currency rate block start

if (this.selectedflightreturnway.currencyRate > 0) {
this.actualFareTktPcc =
  this.selectedflightreturnway.actualTotalFare *
  this.selectedflightreturnway.currencyRate;
} else {
this.actualFareTktPcc =
  parseFloat(this.selectedflightreturnway.totalBaseFare) +
  parseFloat(this.selectedflightreturnway.totalTax) +
  parseFloat(
    this.selectedflightreturnway.totalFee != undefined
      ? this.selectedflightreturnway.totalFee
      : this.selectedflightreturnway.totalFees
  );
}
/////currency rate block end

////amount>0 ,uccftxnvalue ==false >>>start
if (this.amount > 0 && this.isuccfTxnValue == 'false') {
this.amount = this.actualFareTktPcc + this.amount;


//////console.log('amount >>>>',this.amount);
this.surchargeAmount = (this.amount * this.chargePercent) / 100;
this.surchargeAmountnewx =  this.surchargeAmount;
////console.log('surchargeAmount >>>>',this.surchargeAmount);

//this.setFinalFare();

     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       ////console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       ////console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
     // let uccftxncharge =    this.uccftxncharge;
      //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount;
    //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
      ////console.log( "surchargeAmount >>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);


} ////amount>0 ,uccftxnvalue ==false >>>end

////amount<0 ,amount = 0 >>>start
else if (this.amount < 0 || this.amount == 0) {
  // booking.uccfTxnCharge = 0;
  if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.isuccfTxnValue == 'true'){
    if(this.autoticketingDisable ==false){
      this.amount = this.actualFareTktPcc + this.amount;
      // //console.log('amount >>>>',this.amount);
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      this.surchargeAmountnewx =  this.surchargeAmount;
      ////console.log('surchargeAmount >>>>',this.surchargeAmount);
      ////console.log('surchrge - autoticketing enable case')

      //this.setFinalFare();
      
           this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           ///localStorage.removeItem('surchargeAmount');
             ////console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
            // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            ////add uccf in online fee >>start
           // let uccftxncharge =    this.uccftxncharge;
            //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount;
          //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
          //  //console.log( "surchargeAmount >>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);
             this.cprice = this.cprice + this.surchargeAmount ;
             this.cprice =  Math.ceil(this.cprice);
      

    }else{
      this.amount = 0; 
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      this.surchargeAmountnewx =  this.surchargeAmount;
      ////console.log('surchargeAmount >>>>',this.surchargeAmount);
      
      //this.setFinalFare();
      
           this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           ///localStorage.removeItem('surchargeAmount');
           //  //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
           //  //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            ////add uccf in online fee >>start
            let uccftxncharge =    this.uccftxncharge;
            let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
           // //console.log( "uccfinal>>" , uccftxnchargefinal  );
           // //console.log( "surchargeAmount >>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);
             this.cprice = this.cprice + this.surchargeAmount ;
             this.cprice =  Math.ceil(this.cprice);
    }

  }else{
    this.amount = this.actualFareTktPcc + this.amount;

   // //console.log('amount >>>>',this.amount);
    this.surchargeAmount = (this.amount * this.chargePercent) / 100;
    this.surchargeAmountnewx =  this.surchargeAmount;
    ////console.log('surchargeAmount >>>>',this.surchargeAmount);
    
    //this.setFinalFare();
    
         this.multiflightFare = this.fareM;
         this.cprice =  this.fareR;
         this.displayfareoneway = this.fareO;
         ///localStorage.removeItem('surchargeAmount');
          // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
          // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
          ////add uccf in online fee >>start
         // let uccftxncharge =    this.uccftxncharge;
          //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
          this.surchargeAmount =  this.surchargeAmount;
        //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
         // //console.log( "surchargeAmount >>" , this.surchargeAmount);
              /// add uccf in online fee >>end
              localStorage.setItem('surchargeAmount',this.surchargeAmount);
           this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
           this.displayfareoneway = Math.ceil(this.displayfareoneway);
           this.multiflightFare = this.multiflightFare + this.surchargeAmount;
           this.multiflightFare= Math.ceil(this.multiflightFare);
           this.cprice = this.cprice + this.surchargeAmount ;
           this.cprice =  Math.ceil(this.cprice);
    
    
  }

}////amount<0 ,amount = 0 >>>end

////amount=0 ,uccftxnvalue ==false >>>start
else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
this.amount = this.actualFareTktPcc;

////console.log('amount >>>>',this.amount);
this.surchargeAmount = (this.amount * this.chargePercent) / 100;
this.surchargeAmountnewx =  this.surchargeAmount;
////console.log('surchargeAmount >>>>',this.surchargeAmount);

//this.setFinalFare();

     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       ////console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       ////console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
     // let uccftxncharge =    this.uccftxncharge;
      //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount;
    //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
      ////console.log( "surchargeAmount >>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);


}////amount=0 ,uccftxnvalue ==false >>>end


else if(this.amount>0 && this.isuccfTxnValue == 'true'){
////console.log('amount is greater thn zero');
//this.amount = 0;//25may

 // //console.log('amount for uccftxn true>>>>',this.amount);
  this.surchargeAmount = (this.amount * this.chargePercent) / 100;
  this.surchargeAmountnewx =  this.surchargeAmount;
 // //console.log('surchargeAmount before adding uccf>>>>',this.surchargeAmount);
  
  
       this.multiflightFare = this.fareM;
       this.cprice =  this.fareR;
       this.displayfareoneway = this.fareO;
       //  //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
      //   //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
       let uccftxncharge =    this.uccftxncharge;
        let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
        this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
     //   //console.log( "surchargeAmount after adding uccf>>" , this.surchargeAmount);
        localStorage.setItem('surchargeAmount',this.surchargeAmount);

         this.cprice = this.cprice + this.surchargeAmount ;
         this.cprice =  Math.ceil(this.cprice);
  ////amount>0 ,uccftxnvalue ==true >>>end20april
}//21april21


  }///retunway end

}///chrge percent close 


else {////when not amt not percent
 // alert('i am from else');


  this.surchargeAmount = 0;
this.surchargeAmountnewx =  this.surchargeAmount;
this.surchargeAmountnewx =  this.surchargeAmountnewx ? this.surchargeAmountnewx : 0;

   ///auto ticketing case
   if(this.autoticketingDisable ==false){

    
    this.surchargeAmountnewx =  this.surchargeAmount;
    //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
    //console.log('surchrge - autoticketing enable case')
   // this.setFinalFare();
   this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
      // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       ////console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
    
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);

  }else{






  this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
    //   //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
   //    //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
    //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
    //  //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);

}
}////when not amt not percent end


/////////////////end perxc


        }
      });

    
     
    }else{

      
     
     // //console.log("Please eneter a valid card number");
 
   

    this.multiflightFare = this.fareM;
    this.cprice =  this.fareR;
    this.displayfareoneway = this.fareO;
    localStorage.removeItem('surchargeAmount');
    this.surchargeAmountnewx = 0;
    this.surchargeAmount2 = 0;
    this.surchargeAmount = 0;


    if(this.typeofform == '2-Cyber Source'){
      this.paymentform.controls['newcardnumber'].setErrors({ 'incorrect': true});
      this.paymentform.controls['newcardnumber'].markAsTouched();
      this.isCardInValid = true;
     // //console.log("Please eneter a valid card number >>cybersource");
    }if(this.typeofform == '235-Checkout'){
      this.paymentformcheckout.controls['newcardnumber'].setErrors({ 'incorrect': true});
      this.paymentformcheckout.controls['newcardnumber'].markAsTouched();
      this.isCardInValidchkout = true;
     // //console.log("Please eneter a valid card number >>chkout");
    }

    }
  });
}, 1000);
}else{
  /////
  this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  localStorage.removeItem('surchargeAmount');
  this.surchargeAmountnewx = 0;
  this.surchargeAmount2 = 0;
  this.surchargeAmount = 0;
  // this.cprice =  Number(localStorage.getItem('cpo'));
  // this.displayfareoneway =  Number(localStorage.getItem('cpr'));
  // this.multiflightFare =  Number(localStorage.getItem('cpm'));
  ////console.log('few error conditions not matched');




 }

 
}


 ////--cal surcharge checkout end

 ///on click save card
 updateForSave(value) { 
if( value != '' ){

  ////console.log('this is save card no',value)

  this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  this.surchargeAmountnewx = 0;
  this.surchargeAmount = 0;
  localStorage.removeItem('surchargeAmount');

  this.flightService.checkfraudcard(value).subscribe((res) => {
    ////console.log("checkfraudcard response-is this card fraud", res);
    this.fraudresponse = res;
    if (res == false) {
     // //console.log(value);

      this.detectCardType(value);
    //  //console.log(value);

      if(this.typeofform == '2-Cyber Source'){
        this.dynamicPGID = 2;
       }else{
         this.dynamicPGID = 235;
       }

      this.cardIds(this.cardid)
      var body = {
        cardId: this.cardid,
        cardType: 1,
        pgId: this.dynamicPGID,
        branchId: this.branchId,
      };
      this.flightService.calculateSurcharge(body).subscribe((res) => {
        //console.log('calculateSurcharge api',res);
        if (res) {
          if(res['statusMessage'] == 'Pg Data is not Available'){
            this.isPercent = 5;
          }else{
            this.models = res["models"][0];
            this.isPercent = this.models.isPercent;
            this.chargePercent = this.models.chargePercent;
            this.chargeAmt = this.models.chargeAmt;
           // this.isPercent = this.models.isPercent ? this.models.isPercent : 3;
  
            //console.log('is perecnt >>>>',this.isPercent);
            //console.log('chargePercent >>>',this.chargePercent);
            //console.log('chargeAmt>>',this.chargeAmt);
            //console.log('value of uccfTxn -cyberssource >>',this.isuccfFinal);
          }

          // this.models = res["models"][0];
          // this.isPercent = this.models.isPercent;
          // this.chargePercent = this.models.chargePercent;
          // this.chargeAmt = this.models.chargeAmt;

          // //console.log('is perecnt >>>>',this.isPercent);
          // //console.log('chargePercent >>>',this.chargePercent);
          // //console.log('chargeAmt>>',this.chargeAmt);
          // //console.log('value of uccfTxn -cyberssource >>',this.isuccfFinal);

//************
if (this.isPercent == 0) {
  //console.log('i m from is percent zero')
  if (this.isuccfTxnValue != 'false') {
   // alert('is percent zero and uccfflight false' )
    // uccf true
    if (this.tripType == "oneway" || this.tripType == "multicity") {
      this.myamount =
      parseFloat(this.selectedflight.flightFare.t3Price) +
      parseFloat(this.selectedflight.flightFare.markupPrice) +
      parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
      parseFloat(this.selectedflight.flightFare.discountPrice) -
      parseFloat(this.selectedflight.flightFare.actualTotalFare);
      //console.log(this.myamount);

      if ((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && ( this.myamount < 0 || this.myamount == 0)) {

          ///auto ticketing case
          if(this.autoticketingDisable ==false){

            this.myamount = this.chargeAmt;
            this.surchargeAmount = this.chargeAmt;
            this.surchargeAmountnewx =  this.surchargeAmount;
            //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
            //console.log('surchrge - autoticketing enable case')

           // this.setFinalFare();
           this.multiflightFare = this.fareM;
             this.cprice =  this.fareR;
             this.displayfareoneway = this.fareO;
             ///localStorage.removeItem('surchargeAmount');
               //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
               //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
              ////add uccf in online fee >>start
            
              this.surchargeAmount =  this.surchargeAmount;
                  /// add uccf in online fee >>end
                  localStorage.setItem('surchargeAmount',this.surchargeAmount);
               this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
               this.displayfareoneway = Math.ceil(this.displayfareoneway);
               this.multiflightFare = this.multiflightFare + this.surchargeAmount;
               this.multiflightFare= Math.ceil(this.multiflightFare);

          }else{

         
         
        this.surchargeAmount = 0;
        this.surchargeAmountnewx = this.surchargeAmount;
        //console.log('surchargeAmount>>>>>', this.surchargeAmount)
     // this.setFinalFare();


     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
      //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
      }//auto
       }  
       else if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.myamount > 0 ){
        //new condition added on 26april21
    //this.surchargeAmount = 0;
    this.surchargeAmount = this.chargeAmt; //added on 30 april 21

    this.surchargeAmountnewx = this.surchargeAmount;
    
    this.multiflightFare = this.fareM;
    this.cprice = this.fareR;
    this.displayfareoneway = this.fareO;
    
    let uccftxncharge = this.uccftxncharge;
    let uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
    this.surchargeAmount = this.surchargeAmount + uccftxnchargefinal;
    localStorage.setItem('surchargeAmount',this.surchargeAmount);
    
    

              this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
              this.displayfareoneway = Math.ceil(this.displayfareoneway);
              this.multiflightFare = this.multiflightFare + this.surchargeAmount;
              this.multiflightFare= Math.ceil(this.multiflightFare);
    
    }
       else {
        this.surchargeAmount = this.chargeAmt;
        this.surchargeAmountnewx = this.surchargeAmount;
        //console.log('surchargeAmount>>>>>', this.surchargeAmount)
    //  this.setFinalFare();

    this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
      //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

      }
     // this.setFinalFare();
   } else {

    ///////////////////////////////////Retunway>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    this.myamount =
      parseFloat(this.selectedflightreturnway.t3Price) +
      parseFloat(this.selectedflightreturnway.markupPrice) +
      parseFloat(this.selectedflightreturnway.serviceChargePrice) -
      parseFloat(this.selectedflightreturnway.discountPrice) -
      parseFloat(this.selectedflightreturnway.actualTotalFare);
      //console.log('roundtrip myamount>>>>',this.myamount);

      if ((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && ( this.myamount < 0 || this.myamount == 0)) {

///auto ticketing case
if(this.autoticketingDisable ==false){


  this.surchargeAmount = this.chargeAmt;
      this.surchargeAmountnewx =  this.surchargeAmount;
      //console.log('surchargeAmount>>>>>',this.surchargeAmount);
      //console.log('surchrge - autoticketing enable case')

      //this.setFinalFare();
      this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
    
      this.surchargeAmount =  this.surchargeAmount ;
    
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);

}else{



      this.surchargeAmount = 0;
      this.surchargeAmountnewx =  this.surchargeAmount
     // this.setFinalFare();
     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
      //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);
      }
   }
   else if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.myamount > 0 ){
    //new condition added on 26april21
//this.surchargeAmount = 0;
this.surchargeAmount = this.chargeAmt; //added on 30 april 21

this.surchargeAmountnewx = this.surchargeAmount;

this.multiflightFare = this.fareM;
this.cprice = this.fareR;
this.displayfareoneway = this.fareO;

let uccftxncharge = this.uccftxncharge;
let uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
this.surchargeAmount = this.surchargeAmount + uccftxnchargefinal;
localStorage.setItem('surchargeAmount',this.surchargeAmount);

this.cprice = this.cprice+this.surchargeAmount;
          this.cprice = Math.ceil(this.cprice);

}
   else{
      this.surchargeAmount = this.chargeAmt;
      this.surchargeAmountnewx =  this.surchargeAmount;
      //console.log('surchargeAmount>>>>>',this.surchargeAmount)
      //this.setFinalFare();
      this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
      //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);
    }
  } ///////////////////////////////////Retunway  end>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
  } ////else of is uccf////////////
  else {
    this.myamount = this.chargeAmt;
    this.surchargeAmount = this.chargeAmt;
    this.surchargeAmountnewx =  this.surchargeAmount;
    //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
   // this.setFinalFare();
   this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
      //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);

       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);
  }

  }else if (this.isPercent == 1) {

if (this.tripType == "oneway" || this.tripType == "multicity") {  
  this.amount =
    parseFloat(this.selectedflight.flightFare.markupPrice) +
    parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
    parseFloat(this.selectedflight.flightFare.discountPrice);
   // //console.log('this.amount oneway,multicty',this.amount);
    if (this.selectedflight.currencyRate > 0) {
      this.actualFareTktPcc =
        this.selectedflight.flightFare.actualTotalFare *
        this.selectedflight.currencyRate;
    } else {
      this.actualFareTktPcc =
        parseFloat(this.selectedflight.flightFare.totalBaseFare) +
        parseFloat(this.selectedflight.flightFare.totalTax) +
        parseFloat(
          this.selectedflight.flightFare.totalFee != undefined
            ? this.selectedflight.flightFare.totalFee
            : this.selectedflight.flightFare.totalFees
        );
    }
    //if (this.amount > 0 && !this.isuccfFinal) {
      if (this.amount > 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc + this.amount;


     // //console.log('amount>>',this.amount)
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
    //  //console.log( "surchargeAmount>>" , this.surchargeAmount  );
      this.surchargeAmountnewx =  this.surchargeAmount;
    //  //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
     // this.setFinalFare();
  
     this.multiflightFare = this.fareM;
       this.cprice =  this.fareR;
       this.displayfareoneway = this.fareO;
       ///localStorage.removeItem('surchargeAmount');
        // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
        // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
     
        this.surchargeAmount =  this.surchargeAmount ;
      //  //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
            /// add uccf in online fee >>end
            localStorage.setItem('surchargeAmount',this.surchargeAmount);
         this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
         this.displayfareoneway = Math.ceil(this.displayfareoneway);
         this.multiflightFare = this.multiflightFare + this.surchargeAmount;
         this.multiflightFare= Math.ceil(this.multiflightFare);

  
    } else if (this.amount < 0 || this.amount == 0) {
      // booking.uccfTxnCharge = 0;
     // if( this.serviceVendor == "Amadeus"  && this.isuccfFinal){
      if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo") && this.isuccfTxnValue == 'true'){
       
        if(this.autoticketingDisable == false){
          this.amount = this.actualFareTktPcc + this.amount;

          //console.log('amount>>',this.amount)
          this.surchargeAmount = (this.amount * this.chargePercent) / 100;
          //console.log( "surchargeAmount>>" , this.surchargeAmount  );
          this.surchargeAmountnewx =  this.surchargeAmount;
          //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
         // this.setFinalFare();
         //console.log('surchrge - autoticketing enable case')

         this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           
           
            this.surchargeAmount =  this.surchargeAmount;
            //console.log( "surchargeAmount >>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);

        }else{
          this.amount = 0; 

          //console.log('amount>>',this.amount)
          this.surchargeAmount = (this.amount * this.chargePercent) / 100;
          //console.log( "surchargeAmount>>" , this.surchargeAmount  );
          this.surchargeAmountnewx =  this.surchargeAmount;
          //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
         // this.setFinalFare();
      
         this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           ///localStorage.removeItem('surchargeAmount');
             //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
             //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            ////add uccf in online fee >>start
            let uccftxncharge =    this.uccftxncharge;
            let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
            //console.log( "uccfinal>>" , uccftxnchargefinal  );
            //console.log( "surchargeAmount + uccfinal save card>>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);

        }

       
        
      }else{
        this.amount = this.actualFareTktPcc + this.amount;

        //console.log('amount>>',this.amount)
        this.surchargeAmount = (this.amount * this.chargePercent) / 100;
        //console.log( "surchargeAmount>>" , this.surchargeAmount  );
        this.surchargeAmountnewx =  this.surchargeAmount;
        //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
       // this.setFinalFare();
    
       this.multiflightFare = this.fareM;
         this.cprice =  this.fareR;
         this.displayfareoneway = this.fareO;
         ///localStorage.removeItem('surchargeAmount');
           //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
           //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
          ////add uccf in online fee >>start
         // let uccftxncharge =    this.uccftxncharge;
       //  let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
          this.surchargeAmount =  this.surchargeAmount ;
          ////console.log( "uccfinal>>" , uccftxnchargefinal  );
          //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
              /// add uccf in online fee >>end
              localStorage.setItem('surchargeAmount',this.surchargeAmount);
           this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
           this.displayfareoneway = Math.ceil(this.displayfareoneway);
           this.multiflightFare = this.multiflightFare + this.surchargeAmount;
           this.multiflightFare= Math.ceil(this.multiflightFare);

      }

    }
     else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc;

      //console.log('amount>>',this.amount)
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      //console.log( "surchargeAmount>>" , this.surchargeAmount  );
      this.surchargeAmountnewx =  this.surchargeAmount;
      //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
     // this.setFinalFare();
  
     this.multiflightFare = this.fareM;
       this.cprice =  this.fareR;
       this.displayfareoneway = this.fareO;
       ///localStorage.removeItem('surchargeAmount');
         //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
         //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
        ////add uccf in online fee >>start
      
        this.surchargeAmount =  this.surchargeAmount;
        
        //console.log( "surchargeAmount>>" , this.surchargeAmount);
            /// add uccf in online fee >>end
            localStorage.setItem('surchargeAmount',this.surchargeAmount);
         this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
         this.displayfareoneway = Math.ceil(this.displayfareoneway);
         this.multiflightFare = this.multiflightFare + this.surchargeAmount;
         this.multiflightFare= Math.ceil(this.multiflightFare);

      
    }
    else if(this.amount>0 && this.isuccfTxnValue == 'true'){
      //this.amount = 0; 25may
        this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      this.surchargeAmountnewx =  this.surchargeAmount;
      //  //console.log('surchargeAmount before adding uccf>>>>',this.surchargeAmount);
       
       
            this.multiflightFare = this.fareM;
            this.cprice =  this.fareR;
            this.displayfareoneway = this.fareO;
       //        //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //        //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            let uccftxncharge =    this.uccftxncharge;
             let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
             this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
        //    //console.log( "surchargeAmount after adding uccf>>" , this.surchargeAmount);
             localStorage.setItem('surchargeAmount',this.surchargeAmount);
              this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
              this.displayfareoneway = Math.ceil(this.displayfareoneway);
              this.multiflightFare = this.multiflightFare + this.surchargeAmount;
              this.multiflightFare= Math.ceil(this.multiflightFare);
              
       
     }//21april21

   

  }else{
    ////code for retunway ............................strt
       this.amount =
       parseFloat(this.selectedflightreturnway.markupPrice) +
       parseFloat(this.selectedflightreturnway.serviceChargePrice) -
       parseFloat(this.selectedflightreturnway.discountPrice);
       //console.log('this.amount>>>retunway is percent1>>>>>>>>',this.amount);

if (this.selectedflightreturnway.currencyRate > 0) {
this.actualFareTktPcc =
  this.selectedflightreturnway.actualTotalFare *
  this.selectedflightreturnway.currencyRate;
} else {
this.actualFareTktPcc =
  parseFloat(this.selectedflightreturnway.totalBaseFare) +
  parseFloat(this.selectedflightreturnway.totalTax) +
  parseFloat(
    this.selectedflightreturnway.totalFee != undefined
      ? this.selectedflightreturnway.totalFee
      : this.selectedflightreturnway.totalFees
  );
}

if (this.amount > 0 && this.isuccfTxnValue == 'false') {
this.amount = this.actualFareTktPcc + this.amount;


//console.log('amount >>>>',this.amount);
this.surchargeAmount = (this.amount * this.chargePercent) / 100;
this.surchargeAmountnewx =  this.surchargeAmount;
//console.log('surchargeAmount >>>>',this.surchargeAmount);

//this.setFinalFare();

     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
     // let uccftxncharge =    this.uccftxncharge;
      //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount;
    //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount >>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);


} else if (this.amount < 0 || this.amount == 0) {
  // booking.uccfTxnCharge = 0;
  if((this.serviceVendor == "Amadeus" || this.serviceVendor == "Sabre" || this.serviceVendor == "Galileo")   && this.isuccfTxnValue == 'true'){
    if(this.autoticketingDisable == false){
      this.amount = this.actualFareTktPcc + this.amount;
      // //console.log('amount >>>>',this.amount);
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      this.surchargeAmountnewx =  this.surchargeAmount;
      //console.log('surchargeAmount >>>>',this.surchargeAmount);
      //console.log('surchrge - autoticketing enable case')

      //this.setFinalFare();
      
           this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           ///localStorage.removeItem('surchargeAmount');
             //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
             //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            ////add uccf in online fee >>start
           // let uccftxncharge =    this.uccftxncharge;
            //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount;
          //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
            //console.log( "surchargeAmount >>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);
             this.cprice = this.cprice + this.surchargeAmount ;
             this.cprice =  Math.ceil(this.cprice);
      

    }else{
      this.amount = 0; 
      this.surchargeAmount = (this.amount * this.chargePercent) / 100;
      this.surchargeAmountnewx =  this.surchargeAmount;
      //console.log('surchargeAmount >>>>',this.surchargeAmount);
      
      //this.setFinalFare();
      
           this.multiflightFare = this.fareM;
           this.cprice =  this.fareR;
           this.displayfareoneway = this.fareO;
           ///localStorage.removeItem('surchargeAmount');
             //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
             //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
            ////add uccf in online fee >>start
            let uccftxncharge =    this.uccftxncharge;
            let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
            this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
            //console.log( "uccfinal>>" , uccftxnchargefinal  );
            //console.log( "surchargeAmount >>" , this.surchargeAmount);
                /// add uccf in online fee >>end
                localStorage.setItem('surchargeAmount',this.surchargeAmount);
             this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
             this.displayfareoneway = Math.ceil(this.displayfareoneway);
             this.multiflightFare = this.multiflightFare + this.surchargeAmount;
             this.multiflightFare= Math.ceil(this.multiflightFare);
             this.cprice = this.cprice + this.surchargeAmount ;
             this.cprice =  Math.ceil(this.cprice);
    }

  }else{
    this.amount = this.actualFareTktPcc + this.amount;

    //console.log('amount >>>>',this.amount);
    this.surchargeAmount = (this.amount * this.chargePercent) / 100;
    this.surchargeAmountnewx =  this.surchargeAmount;
    //console.log('surchargeAmount >>>>',this.surchargeAmount);
    
    //this.setFinalFare();
    
         this.multiflightFare = this.fareM;
         this.cprice =  this.fareR;
         this.displayfareoneway = this.fareO;
         ///localStorage.removeItem('surchargeAmount');
           //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
           //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
          ////add uccf in online fee >>start
         // let uccftxncharge =    this.uccftxncharge;
          //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
          this.surchargeAmount =  this.surchargeAmount;
        //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
          //console.log( "surchargeAmount >>" , this.surchargeAmount);
              /// add uccf in online fee >>end
              localStorage.setItem('surchargeAmount',this.surchargeAmount);
           this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
           this.displayfareoneway = Math.ceil(this.displayfareoneway);
           this.multiflightFare = this.multiflightFare + this.surchargeAmount;
           this.multiflightFare= Math.ceil(this.multiflightFare);
           this.cprice = this.cprice + this.surchargeAmount ;
           this.cprice =  Math.ceil(this.cprice);
    
    
  }

}
else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
this.amount = this.actualFareTktPcc;

//console.log('amount >>>>',this.amount);
this.surchargeAmount = (this.amount * this.chargePercent) / 100;
this.surchargeAmountnewx =  this.surchargeAmount;
//console.log('surchargeAmount >>>>',this.surchargeAmount);

//this.setFinalFare();

     this.multiflightFare = this.fareM;
     this.cprice =  this.fareR;
     this.displayfareoneway = this.fareO;
     ///localStorage.removeItem('surchargeAmount');
       //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
      ////add uccf in online fee >>start
     // let uccftxncharge =    this.uccftxncharge;
      //let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount;
    //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
      //console.log( "surchargeAmount >>" , this.surchargeAmount);
          /// add uccf in online fee >>end
          localStorage.setItem('surchargeAmount',this.surchargeAmount);
       this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
       this.displayfareoneway = Math.ceil(this.displayfareoneway);
       this.multiflightFare = this.multiflightFare + this.surchargeAmount;
       this.multiflightFare= Math.ceil(this.multiflightFare);
       this.cprice = this.cprice + this.surchargeAmount ;
       this.cprice =  Math.ceil(this.cprice);


}else if(this.amount>0 && this.isuccfTxnValue == 'true'){
  //this.amount = 0;//25may

  ////console.log('amount for uccftxn true>>>>',this.amount);
  this.surchargeAmount = (this.amount * this.chargePercent) / 100;
  this.surchargeAmountnewx =  this.surchargeAmount;
  ////console.log('surchargeAmount before adding uccf>>>>',this.surchargeAmount);
  
  
       this.multiflightFare = this.fareM;
       this.cprice =  this.fareR;
       this.displayfareoneway = this.fareO;
         ////console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
         ////console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
       let uccftxncharge =    this.uccftxncharge;
        let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
        this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
        ////console.log( "surchargeAmount after adding uccf>>" , this.surchargeAmount);
        localStorage.setItem('surchargeAmount',this.surchargeAmount);

         this.cprice = this.cprice + this.surchargeAmount ;
         this.cprice =  Math.ceil(this.cprice);
  ////amount>0 ,uccftxnvalue ==true >>>end20april
}

//////////////////cal surcharge of retunrway neww -3juluy  enndddd

/////////////////returnway ed.....................
  }
} else {
  // alert('i am from else');
 
 
   this.surchargeAmount = 0;
 this.surchargeAmountnewx =  this.surchargeAmount;
 this.surchargeAmountnewx =  this.surchargeAmountnewx ? this.surchargeAmountnewx : 0;
 
    ///auto ticketing case
    if(this.autoticketingDisable ==false){
 
     
     this.surchargeAmountnewx =  this.surchargeAmount;
    // //console.log('surchargeAmount nonuccf>>>>', this.surchargeAmount);
    // //console.log('surchrge - autoticketing enable case')
    // this.setFinalFare();
    this.multiflightFare = this.fareM;
      this.cprice =  this.fareR;
      this.displayfareoneway = this.fareO;
      ///localStorage.removeItem('surchargeAmount');
       // //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
       // //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);
       ////add uccf in online fee >>start
     
           /// add uccf in online fee >>end
           localStorage.setItem('surchargeAmount',this.surchargeAmount);
        this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
        this.displayfareoneway = Math.ceil(this.displayfareoneway);
        this.multiflightFare = this.multiflightFare + this.surchargeAmount;
        this.multiflightFare= Math.ceil(this.multiflightFare);
 
        this.cprice = this.cprice + this.surchargeAmount ;
        this.cprice =  Math.ceil(this.cprice);
 
   }else{
 
 
 
   this.multiflightFare = this.fareM;
      this.cprice =  this.fareR;
      this.displayfareoneway = this.fareO;

       ////add uccf in online fee >>start
       let uccftxncharge =    this.uccftxncharge;
       let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
       this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
     //  //console.log( "uccfinal>>" , uccftxnchargefinal  );
     //  //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
           /// add uccf in online fee >>end
           localStorage.setItem('surchargeAmount',this.surchargeAmount);
        this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
        this.displayfareoneway = Math.ceil(this.displayfareoneway);
        this.multiflightFare = this.multiflightFare + this.surchargeAmount;
        this.multiflightFare= Math.ceil(this.multiflightFare);
        this.cprice = this.cprice + this.surchargeAmount ;
        this.cprice =  Math.ceil(this.cprice);
 
 }
 }

/////////////////end perxc


        }
      });

    
     
    }else{

      
     
      ////console.log("Please eneter a valid card number");
 
   

    this.multiflightFare = this.fareM;
    this.cprice =  this.fareR;
    this.displayfareoneway = this.fareO;
    localStorage.removeItem('surchargeAmount');


  
    }
  });

}else{
  
   this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  localStorage.removeItem('surchargeAmount');
  
 }

 }
//////////end update method - cyber source


/////////update checkout end---------
setFinalFare(){
  if (this.tripType == "oneway" || this.tripType == "multicity") {

    this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
  ///localStorage.removeItem('surchargeAmount');
    //console.log('surchrge amount set fianl fare>>>>>>>',this.surchargeAmount);
    //console.log('surchrge amount2 set fianl fare>>>>>>>',this.surchargeAmountnewx);

   ////add uccf in online fee >>start
   let uccftxncharge =    this.uccftxncharge;
   let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
   this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
   //console.log( "uccfinal>>" , uccftxnchargefinal  );
 
   //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
 
       /// add uccf in online fee >>end
       localStorage.setItem('surchargeAmount',this.surchargeAmount);

    this.displayfareoneway = this.displayfareoneway + this.surchargeAmount;
  
    this.displayfareoneway = Math.ceil(this.displayfareoneway);
  
    this.multiflightFare = this.multiflightFare + this.surchargeAmount;
  
    this.multiflightFare= Math.ceil(this.multiflightFare);


  }
  if(this.tripType == 'returnway'){
  
    this.multiflightFare = this.fareM;
  this.cprice =  this.fareR;
  this.displayfareoneway = this.fareO;
 // localStorage.removeItem('surchargeAmount');
  

    //console.log('set final method call-retunrway')
      ////add uccf in online fee >>start
      let uccftxncharge =    this.uccftxncharge;
      let  uccftxnchargefinal = uccftxncharge ? uccftxncharge : 0;
      this.surchargeAmount =  this.surchargeAmount + uccftxnchargefinal;
      //console.log( "uccfinal>>" , uccftxnchargefinal  );
    
      //console.log( "surchargeAmount + uccfinal>>" , this.surchargeAmount);
    
          /// add uccf in online fee >>end
    localStorage.setItem('surchargeAmount',this.surchargeAmount);
    this.cprice = this.cprice + this.surchargeAmount ;
    this.cprice =  Math.ceil(this.cprice); 

  }

}

///3gpay full name chekc staty

 
fullnamethreeG:boolean;
checkfullnamethreeG(value: string) { 

  if(value != ''){

if(this.paymentformthreeg.controls.cardname.hasError('alpha')){
//console.log('alpha errr');
this.multiflightFare = this.fareM;
this.cprice =  this.fareR;
this.displayfareoneway = this.fareO;
localStorage.removeItem('surchargeAmount');
this.surchargeAmountnewx = 0;
this.surchargeAmount2 = 0;
this.surchargeAmount = 0;
}else{



//   var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
// if(!regName.test(value)){
// //console.log('Invalid name given.');
//   this.fullnamethreeG = true;
//   this.paymentformthreeg.controls['cardname'].setErrors({ 'incorrect': true});
//   this.paymentformthreeg.controls['cardname'].markAsTouched();
//   //console.log('this.fullname ENTERED',this.fullnamethreeG);

// }else{
// this.fullnamethreeG = false;

// //console.log('Valid name given.');
// //console.log('this.fullname',this.fullnamethreeG);

// }

let cardnamevalue = this.paymentformthreeg.controls['cardname'].value;
let cardnamevalue_split = cardnamevalue.split(" ");
let cardnamevalue_split_zero = cardnamevalue_split[0];
let cardnamevalue_split_one = cardnamevalue_split[1];
//console.log('cardnamevalue_after split>>>',cardnamevalue_split)

//console.log('cardnamevalue_split_zero',cardnamevalue_split_zero)
//console.log('cardnamevalue_split_one',cardnamevalue_split_one)
//  //console.log('cardnamevalue_split_one length',cardnamevalue_split_one && cardnamevalue_split_one.length)

// var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
// if(!regName.test(value)){
if(cardnamevalue_split_one == undefined){

//console.log('Invalid name given.');
 this.fullnamethreeG = true;
 this.paymentformthreeg.controls['cardname'].setErrors({ 'incorrect': true});
 this.paymentformthreeg.controls['cardname'].markAsTouched();
// //console.log('this.fullname',this.fullnamecheckout);
this.multiflightFare = this.fareM;
this.cprice =  this.fareR;
this.displayfareoneway = this.fareO;
localStorage.removeItem('surchargeAmount');
this.surchargeAmountnewx = 0;
this.surchargeAmount2 = 0;
this.surchargeAmount = 0;

}else{
if(cardnamevalue_split_one.length<1){
 this.fullnamethreeG = true;
 this.paymentformthreeg.controls['cardname'].setErrors({ 'incorrect': true});
 this.paymentformthreeg.controls['cardname'].markAsTouched();
 this.multiflightFare = this.fareM;
 this.cprice =  this.fareR;
 this.displayfareoneway = this.fareO;
 localStorage.removeItem('surchargeAmount');
 this.surchargeAmountnewx = 0;
 this.surchargeAmount2 = 0;
 this.surchargeAmount = 0;
}else{


this.fullnamethreeG = false;
this.threegpaySurcharge_oneway();
//console.log('Valid name given 3gpay.');

}
}
}
}else{

}



}

////3gpay full name chek end


 
    fullnamecyber:boolean;
    checkfullnameCyber(value: string) { 
  
      if(value != ''){

if(this.paymentform.controls.cardname.hasError('alpha') || this.paymentform.controls.cardname.hasError('required')){
//console.log('alpha errr');

// this.multiflightFare = this.fareM;
// this.cprice =  this.fareR;
// this.displayfareoneway = this.fareO;
// localStorage.removeItem('surchargeAmount');
// this.surchargeAmountnewx = 0;
// this.surchargeAmount2 = 0;
// this.surchargeAmount = 0;

}else{



  //     var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  // if(!regName.test(value)){
  //   //console.log('Invalid name given.');
  //     this.fullnamecyber = true;
  //     this.paymentform.controls['cardname'].setErrors({ 'incorrect': true});
  //     this.paymentform.controls['cardname'].markAsTouched();
  //     //console.log('this.fullname',this.fullnamecyber);
  
  // }else{
  //   this.fullnamecyber = false;
  
  //   //console.log('Valid name given.');
  //   //console.log('this.fullname',this.fullnamecyber);
  
  // }



  let cardnamevalue = this.paymentform.controls['cardname'].value;
  let cardnamevalue_split = cardnamevalue.split(" ");
  let cardnamevalue_split_zero = cardnamevalue_split[0];
  let cardnamevalue_split_one = cardnamevalue_split[1];
  //console.log('cardnamevalue_after split>>>',cardnamevalue_split)

  //console.log('cardnamevalue_split_zero',cardnamevalue_split_zero)
  //console.log('cardnamevalue_split_one',cardnamevalue_split_one)

 if(cardnamevalue_split_one == undefined){

 //console.log('Invalid name given.');
   this.fullnamecyber = true;
   this.paymentform.controls['cardname'].setErrors({ 'incorrect': true});
   this.paymentform.controls['cardname'].markAsTouched();
   ////console.log('this.fullname',this.fullnamecheckout);

  //  this.multiflightFare = this.fareM;
  //  this.cprice =  this.fareR;
  //  this.displayfareoneway = this.fareO;
  //  localStorage.removeItem('surchargeAmount');
  //  this.surchargeAmountnewx = 0;
  //  this.surchargeAmount2 = 0;
  //  this.surchargeAmount = 0;

}else{
 if(cardnamevalue_split_one.length<1){
   this.fullnamecyber = true;
   this.paymentform.controls['cardname'].setErrors({ 'incorrect': true});
   this.paymentform.controls['cardname'].markAsTouched();
  //  this.multiflightFare = this.fareM;
  //  this.cprice =  this.fareR;
  //  this.displayfareoneway = this.fareO;
  //  localStorage.removeItem('surchargeAmount');
  //  this.surchargeAmountnewx = 0;
  //  this.surchargeAmount2 = 0;
  //  this.surchargeAmount = 0;
 }else{


 this.fullnamecyber = false;

}
}


}
}else{

}



    }


    fullnamecheckout:boolean;
    checkfullnameCheckout(value: string) { 
  
      if(this.paymentformcheckout.controls['cardname'].hasError('alpha') || this.paymentformcheckout.controls['cardname'].hasError('required')){
 //console.log('errrr');
// this.multiflightFare = this.fareM;
// this.cprice =  this.fareR;
// this.displayfareoneway = this.fareO;
// localStorage.removeItem('surchargeAmount');
// this.surchargeAmountnewx = 0;
// this.surchargeAmount2 = 0;
// this.surchargeAmount = 0;
      }else{

     let cardnamevalue = this.paymentformcheckout.controls['cardname'].value;
     let cardnamevalue_split = cardnamevalue.split(" ");
     let cardnamevalue_split_zero = cardnamevalue_split[0];
     let cardnamevalue_split_one = cardnamevalue_split[1];
     //console.log('cardnamevalue_after split>>>',cardnamevalue_split)

     //console.log('cardnamevalue_split_zero',cardnamevalue_split_zero)
     //console.log('cardnamevalue_split_one',cardnamevalue_split_one)
    //  //console.log('cardnamevalue_split_one length',cardnamevalue_split_one && cardnamevalue_split_one.length)

     // var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  // if(!regName.test(value)){
    if(cardnamevalue_split_one == undefined){

    //console.log('Invalid name given.');
      this.fullnamecheckout = true;
      this.paymentformcheckout.controls['cardname'].setErrors({ 'incorrect': true});
      this.paymentformcheckout.controls['cardname'].markAsTouched();
      //console.log('this.fullname',this.fullnamecheckout);
      // this.multiflightFare = this.fareM;
      // this.cprice =  this.fareR;
      // this.displayfareoneway = this.fareO;
      // localStorage.removeItem('surchargeAmount');
      // this.surchargeAmountnewx = 0;
      // this.surchargeAmount2 = 0;
      // this.surchargeAmount = 0;
  
  }else{
    if(cardnamevalue_split_one.length<1){
      this.fullnamecheckout = true;
      this.paymentformcheckout.controls['cardname'].setErrors({ 'incorrect': true});
      this.paymentformcheckout.controls['cardname'].markAsTouched();
      // this.multiflightFare = this.fareM;
      // this.cprice =  this.fareR;
      // this.displayfareoneway = this.fareO;
      // localStorage.removeItem('surchargeAmount');
      // this.surchargeAmountnewx = 0;
      // this.surchargeAmount2 = 0;
      // this.surchargeAmount = 0;
    }else{

   
    this.fullnamecheckout = false;
  
    //console.log('Valid name given.');
    //console.log('this.fullname',this.fullnamecheckout);
  }
  }
}
    }

  isSubmtted = false;
  termcondition: boolean;
  mytime;
  isDisabled: boolean = false;
  
  cyberSourceForm() {
   // //console.log('i am from cyber click');

    this.isSubmtted = true;

    let val = this.paymentform.controls["checkeboxx"].value;

    //console.log(val);
    if (!val) {
      //alert('Please accept terms and conditions');
      this.termcondition = true;
    } else {
      this.termcondition = false;
    }

    if (this.paymentform.invalid) {
      for (let i in this.paymentform.controls)
        this.paymentform.controls[i].markAsTouched();

      return;
    }

    this.isDisabled = true;


    this.presentLoading();
    this.mytime = 60000;
    ////console.log('i am from my time');

    //console.log(this.paymentform.value);
    // //console.log(this.paymentformthreeg.value);

    this.cardvaluefilled = this.paymentform.value;
    this.cardnumber = this.cardvaluefilled.newcardnumber;
    this.cardname = this.cardvaluefilled.cardname;
    // this.expMonth = this.cardvaluefilled.expMonth;
    //let expyr = this.cardvaluefilled.expYear;
    let expyr     = moment(this.cardvaluefilled.expYear, "MM/YY").format("MM/YYYY");
    let splitexpyr = expyr.split("/");
    this.expMonth = splitexpyr[0];
    this.expYear = splitexpyr[1];
    this.cvvNumber = this.cardvaluefilled.cvvNumber;

    //console.log(this.cardnumber);
    //console.log(this.cardname);
    //console.log("split month", this.expMonth);
    //console.log("split year", this.expYear);


    let spltname = this.cardname.split(" ")
    let fname = spltname[0];
    let lname = spltname[1];
  

  
    ///check fraud card

 
   

        /////call payment
        var reqbody = {
          affilatePartnerId:this.affilatePartnerId,
          isBookAndHold: false,
          autoTicketingDisabling:this.autoticketingDisable,
          branchCode: this.branchCode,
          branchCurrencyConversionToUSD: 0,
          branchCurruency: this.branchCurrencyCode,
          groupId: this.groupId,
          countryId: this.countryId,
          surchargeAmount: this.surchargeAmountnewx ? this.surchargeAmountnewx:0,
          countryCode: this.countryCode,
          conversionRate: 0,
          noOfAdult: this.adult ? this.adult : 1,
          noOfChild: this.children ? this.children : 0,
          noOfInfant: this.infants ? this.infants : 0,
          onwardJourneyDate: this.onwarddate,
          passengerList: this.allPassengers,
          returnJourneyDate: this.returndate ? this.returndate : "null",
          selectedFlightOptionKey: this.selectedFlightOptionKey,
          tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
          userAlias: this.loginemail ? this.loginemail : this.loginemail,
          userCurruency: this.branchCurrencyCode,
          userSelectedCurrency:this.branchCurrencyCode,
          bookingRequestBean: {
            productType: 0,
            modeOfPayment: 3,
            paymentGatewayId: 2,
            cardNumber: this.cardnumber,
            cardHolderName: this.cardname,
            cvvNumber: this.cvvNumber,
            expMonth: this.expMonth,
            expYear: this.expYear,
            street: "1295 Charleston Road",
            state: "CA",
            country: "US",
            zip: "94043",
            address: "noida",
            city: "Mountain view",
            f_name: fname,
            l_name: lname,
            email: this.loginemail,
            payMobileNumber: this.phone_firsstPL,
            phoneNumber: this.phone_firsstPL,
            isUccflight:this.isUccflightFinal,      // raghve
            uccfCharge: this.uccftxncharge,   // raghve
            isUccfTxn:this.isuccfFinal,        // raghve
            deviceFingerPrintID:this.datevalue // raghve
           


          },
        };
       // //console.log("flight book req body", reqbody);
   //  debugger
        this.flightService.flightbook(reqbody).subscribe((res) => {
          //console.log(res);

          if (res["statusMessage"] == "Some Technical Error") {
            this.swalPopup();

          }
          if (
            res["statusMessage"] == "Selected Flight option not found in cache"
          ) {
            this.swalPopup();

          }
          if (res["statusMessage"] == "Your Card Details are not authorized. Please try again with different Card") {
            //alert('APIs Technical Error');
            swal.fire(
              "Invalid Card Details",
              "Please try again with different Card",
              "error"
            );
            //this.router.navigate([this.searchPageURL]);
          }
          if ((res["statusMessage"] == "null" || res["statusMessage"] == null) && !res["bookingRefNo"]) {
            this.swalPopup();

            this.closeLoading();
          }

          this.pgPostURL = res["pgPostURL"];
          //   localStorage.setItem('pgPostURL',res['pgPostURL']);
          //console.log("pgPostURL", res["pgPostURL"]);

          this.payReq = res["payReq"];
          this.xid = res["xid"];
          //console.log("return url ----", res["returnURL"]);
          //  localStorage.setItem('returnURL',res['returnURL']);
          this.returnURL = res["returnURL"];
          this.bookingRefNo = res["bookingRefNo"];
          
          // alert(this.returnURL);
          //  alert(this.pgPostURL);

      

          if (res["paymentGatewayId"] == "235") {
            this.methodForm = "GET";
          } else {
            this.methodForm = "POST";
          }

          if (this.pgPostURL) {
            setTimeout(() => {
              this.myFormPost.nativeElement.submit();
              //console.log(this.myFormPost);
            }, 10);
            //console.log(this.myFormPost);

           // this.closeLoading();
            //debugger
            //this.router.navigate(['./booking-confirmation']);

            // debugger
          } else {
            if (this.bookingRefNo) {
              //console.log(this.bookingRefNo);
              this.closeLoading();
              localStorage.setItem("BOOKRN", this.bookingRefNo);
              sessionStorage.setItem("BOOKRN", this.bookingRefNo);

              this.flightService.sendbookingRefNo(this.bookingRefNo);
              this.router.navigate(["./booking-confirmation"]);
            }
          }
        });
     

  }

  //isSubmtted4 = false;
  termconditionsave: boolean;
  cybersorcecontinuefromsave() {
    //alert('cyber sorce')
    //this.isSubmtted4 = true;

    let val = this.savecardform.controls["checkeboxxsave"].value;

    //console.log(val);
    if (!val) {
      //alert('Please accept terms and conditions');
      this.termconditionsave = true;
    } else {
      this.termconditionsave = false;
    }

    if (this.savecardform.invalid) {
      for (let i in this.savecardform.controls)
        this.savecardform.controls[i].markAsTouched();

      return;
    }

    //console.log(this.savecardform.value);

    ///this.cardnumber  = "4000000000000051";
    this.cardnumber = this.savecardNumber;
    this.cardname = this.SavenameOnCard;
    this.cvvNumber = this.savecardform.controls["cvvnumber"].value;
    this.expMonth = this.splitmonth;
    this.expYear = this.splityear;

    //console.log("from save cyber", this.cardnumber);
    //console.log("from save cyber", this.cardname);
    //console.log("from save cyber", this.cvvNumber);
    //console.log("from save cyber", this.expMonth);
    //console.log("from save cyber", this.expYear);

    let spltname = this.cardname.split(" ")
    let fname = spltname[0];
    let lname = spltname[1];
    this.isDisabled = true;

    this.presentLoading();
    
    this.mytime = 60000;
      //  this.fareRecheckOnPay();

        /////call payment
        var reqbody = {
          affilatePartnerId:this.affilatePartnerId,
          isBookAndHold: false,
          autoTicketingDisabling:this.autoticketingDisable,
          branchCode: this.branchCode,
          branchCurrencyConversionToUSD: 0,
          branchCurruency: this.branchCurrencyCode,
          groupId: this.groupId,
          countryId: this.countryId,
          surchargeAmount: this.surchargeAmountnewx,
          countryCode: this.countryCode,
          conversionRate: 0,
          noOfAdult: this.adult ? this.adult : 1,
          noOfChild: this.children ? this.children : 0,
          noOfInfant: this.infants ? this.infants : 0,
          onwardJourneyDate: this.onwarddate,
          passengerList: this.allPassengers,
          returnJourneyDate: this.returndate ? this.returndate : "null",
          selectedFlightOptionKey: this.selectedFlightOptionKey,
          tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
          userAlias: this.loginemail ? this.loginemail : this.loginemail,
          userCurruency: this.branchCurrencyCode,
          userSelectedCurrency:this.branchCurrencyCode,
          bookingRequestBean: {
            productType: 0,
            modeOfPayment: 3,
            paymentGatewayId: 2,
            cardNumber: this.cardnumber,
            cardHolderName: this.cardname,
            cvvNumber: this.cvvNumber,
            expMonth: this.expMonth,
            expYear: this.expYear,
            street: "1295 Charleston Road",
            state: "CA",
            country: "US",
            zip: "94043",
            address: "noida",
            city: "Mountain view",
            f_name: fname,
            l_name: lname,
            email: this.loginemail ? this.loginemail : this.loginemail,
            payMobileNumber: this.phone_firsstPL,
            phoneNumber: this.phone_firsstPL,
            isUccflight: this.isUccflightFinal,       // raghve
            uccfCharge: this.uccftxncharge,    // raghve
            isUccfTxn: this.isuccfFinal,         // raghve
            deviceFingerPrintID:this.datevalue // raghve
            


          },
        };
        //console.log("flight book req body", reqbody);
        //debugger
        this.flightService.flightbook(reqbody).subscribe((res) => {
          //console.log(res);

          if (res["statusMessage"] == "Some Technical Error") {
            this.swalPopup();

          }
          if (res["statusMessage"] == null && !res["bookingRefNo"]) {
            this.swalPopup();

          }
          if (
            res["statusMessage"] == "Selected Flight option not found in cache"
          ) {
            this.swalPopup();

          }

          this.pgPostURL = res["pgPostURL"];
          //   localStorage.setItem('pgPostURL',res['pgPostURL']);
          //console.log("pgPostURL", res["pgPostURL"]);

          this.payReq = res["payReq"];
          this.xid = res["xid"];
          //console.log("return url ----", res["returnURL"]);
          //  localStorage.setItem('returnURL',res['returnURL']);
          this.returnURL = res["returnURL"];
          this.bookingRefNo = res["bookingRefNo"];
          // alert(this.returnURL);
          //  alert(this.pgPostURL);

    
          if (res["paymentGatewayId"] == "235") {
            this.methodForm = "GET";
          } else {
            this.methodForm = "POST";
          }

          if (this.pgPostURL) {
            setTimeout(() => {
              this.myFormPost.nativeElement.submit();
              //console.log(this.myFormPost);
            }, 10);
            //console.log(this.myFormPost);

           // this.closeLoading();
          
          } else {
            if (this.bookingRefNo) {
              //console.log(this.bookingRefNo);
              this.closeLoading();
              localStorage.setItem("BOOKRN", this.bookingRefNo);
              sessionStorage.setItem("BOOKRN", this.bookingRefNo);

              this.flightService.sendbookingRefNo(this.bookingRefNo);
              this.router.navigate(["./booking-confirmation"]);
            }
  
          }
        });
      
   
  

    ///end fraud card call
  }

  //////checkout form code
  isSubmtted3 = false;
  termconditions: boolean;
  checkoutboolean:boolean = false;
  checkoutForm() {
    //alert('checkout')

    this.isSubmtted3 = true;

    let val = this.paymentformcheckout.controls["checkeboxx"].value;

    //console.log(val);
    if (!val) {
      //alert('Please accept terms and conditions');
      this.termconditions = true;
    } else {
      this.termconditions = false;
    }

    if (this.paymentformcheckout.invalid) {
      for (let i in this.paymentformcheckout.controls)
        this.paymentformcheckout.controls[i].markAsTouched();

      return;
    }
this.checkoutboolean = true;
    this.presentLoading();
    this.mytime = 60000;
    //console.log(this.paymentformcheckout.value);
    // //console.log(this.paymentformthreeg.value);

    this.cardvaluefilled = this.paymentformcheckout.value;
    this.cardnumber = this.cardvaluefilled.newcardnumber;
    this.cardname = this.cardvaluefilled.cardname;
    
    this.cvvNumber = this.cardvaluefilled.cvvNumber;



    //console.log(this.cardnumber);
    //console.log(this.cardname);


    let spltname = this.cardname.split(" ")
    let fname = spltname[0];
    let lname = spltname[1];
    let expyr     = moment(this.cardvaluefilled.expYear, "MM/YY").format("MM/YYYY");

    ////console.log(expYears);
    let splitexpYears = expyr.split("/");
    this.expYearsplit = splitexpYears[1];
    // this.expMonth = this.cardvaluefilled.expMonth;
    this.expMonthsplit = splitexpYears[0];
    //console.log(this.expYearsplit + "" + this.expMonthsplit);



    

   
    
        var reqbody = {
          affilatePartnerId:this.affilatePartnerId,
          isBookAndHold: false,
          autoTicketingDisabling:this.autoticketingDisable,
          branchCode: this.branchCode,
          branchCurrencyConversionToUSD: 0,
          branchCurruency: this.branchCurrencyCode,
          groupId: this.groupId,
          countryId: this.countryId,
          surchargeAmount: this.surchargeAmountnewx,
          countryCode: this.countryCode,
          conversionRate: 0,
          noOfAdult: this.adult ? this.adult : 1,
          noOfChild: this.children ? this.children : 0,
          noOfInfant: this.infants ? this.infants : 0,
          onwardJourneyDate: this.onwarddate,
          passengerList: this.allPassengers,
          returnJourneyDate: this.returndate ? this.returndate : "null",
          selectedFlightOptionKey: this.selectedFlightOptionKey,
          tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
          userAlias: this.loginemail ? this.loginemail : this.loginemail,
          userCurruency: this.branchCurrencyCode,
          userSelectedCurrency:this.branchCurrencyCode,
          bookingRequestBean: {
            productType: 0,
            modeOfPayment: 3,
            paymentGatewayId: 235,
            cardNumber: this.cardnumber,
            cardHolderName: this.cardname,
            cvvNumber: this.cvvNumber,
            expMonth: this.expMonthsplit,
            expYear: this.expYearsplit,
            street: "1295 Charleston Road",
            state: "CA",
            country: "US",
            zip: "94043",
            address: "noida",
            city: "Mountain view",
            f_name: fname,
            l_name: lname,
            email: this.loginemail,
            payMobileNumber: this.phone_firsstPL,
            phoneNumber: this.phone_firsstPL,
            isUccflight: this.isUccflightFinal,        //gaurav
            uccfCharge: this.uccftxncharge,    //gaurav
            isUccfTxn: this.isuccfFinal,         
            deviceFingerPrintID:this.datevalue // raghve
            


          },
        };
        //console.log("flight book req body", reqbody);
        this.flightService.flightbook(reqbody).subscribe((res) => {
          //console.log(res);
      //  debugger
          if (res["statusMessage"] == "Some Technical Error") {
            this.swalPopup();

          }
          if (
            res["statusMessage"] == "Selected Flight option not found in cache"
          ) {
            this.swalPopup();

          }

          this.pgPostURL = res["pgPostURL"];
          //   localStorage.setItem('pgPostURL',res['pgPostURL']);
          //console.log("pgPostURL", res["pgPostURL"]);

          this.payReq = res["payReq"];
          this.xid = res["xid"];
          //console.log("return url ----", res["returnURL"]);
          //  localStorage.setItem('returnURL',res['returnURL']);
          this.returnURL = res["returnURL"];
          this.bookingRefNo = res["bookingRefNo"];
          // alert(this.returnURL);
          //  alert(this.pgPostURL);


          if (res["paymentGatewayId"] == "235") {
            this.methodForm = "GET";
            //console.log('i m from GET -Checkout method');
          } else {
            this.methodForm = "POST";
            //console.log('i m from POST -Checkout method');

          }

          if (this.pgPostURL) {
            //console.log(this.myFormPost);
            setTimeout(() => {
              window.open(this.pgPostURL,"_self")
            }, 10);

         
           
          } else {
           
          if (this.bookingRefNo) {
            //console.log(this.bookingRefNo);
           // this.closeLoading();
            localStorage.setItem("BOOKRN", this.bookingRefNo);
            sessionStorage.setItem("BOOKRN", this.bookingRefNo);

            this.flightService.sendbookingRefNo(this.bookingRefNo);
            this.router.navigate(["./booking-confirmation"]);
          }
          }
        });
      }
       

    ///end fraud card call

    //4000000000000051
    //"cardNumber":"5200000000000007",
    //"cardNumber":"4242424242424242",
  

  ////checkout code end
  checkouttermconditionsave: boolean;

  checkoutFormfromave() {

    let val = this.savecardform.controls["checkeboxxsave"].value;

    //console.log(val);
    if (!val) {
      this.termconditionsave = true;
    } else {
      this.termconditionsave = false;
    }

    if (this.savecardform.invalid) {
      for (let i in this.savecardform.controls)
        this.savecardform.controls[i].markAsTouched();

      return;
    }

    //console.log(this.savecardform.value);

    this.cardnumber = this.savecardNumber;
    this.cardname = this.SavenameOnCard;
    this.cvvNumber = this.savecardform.controls["cvvnumber"].value;
    this.expMonth = this.splitmonth;
    this.expYear = this.splityear;


    let spltname = this.cardname.split(" ")
    let fname = spltname[0];
    let lname = spltname[1];
    // //console.log("for checkout", this.cardnumber);
    // //console.log("for checkout", this.cardname);
    // //console.log("for checkout", this.cvvNumber);
    // //console.log("for checkout", this.expMonth);
    // //console.log("for checkout", this.expYear);
    this.checkoutboolean = true;

    this.presentLoading();
    this.mytime = 60000;
 
        /////call payment
        var reqbody = {
          affilatePartnerId:this.affilatePartnerId,
          isBookAndHold: false,
          autoTicketingDisabling:this.autoticketingDisable,
          branchCode: this.branchCode,
          branchCurrencyConversionToUSD: 0,
          branchCurruency: this.branchCurrencyCode,
          groupId: this.groupId,
          countryId: this.countryId,
          surchargeAmount: this.surchargeAmountnewx,
          countryCode: this.countryCode,
          conversionRate: 0,
          noOfAdult: this.adult ? this.adult : 1,
          noOfChild: this.children ? this.children : 0,
          noOfInfant: this.infants ? this.infants : 0,
          onwardJourneyDate: this.onwarddate,
          passengerList: this.allPassengers,
          returnJourneyDate: this.returndate ? this.returndate : "null",
          selectedFlightOptionKey: this.selectedFlightOptionKey,
          tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
          userAlias: this.loginemail ? this.loginemail : this.loginemail,
          userCurruency: this.branchCurrencyCode,
          userSelectedCurrency: this.branchCurrencyCode,
          bookingRequestBean: {
            productType: 0,
            modeOfPayment: 3,
            paymentGatewayId: 235,
            cardNumber: this.cardnumber,
            cardHolderName: this.cardname,
            cvvNumber: this.cvvNumber,
            expMonth: this.expMonth,
            expYear: this.expYear,
            street: "1295 Charleston Road",
            state: "CA",
            country: "US",
            zip: "94043",
            address: "noida",
            city: "Mountain view",
            f_name: fname,
            l_name: lname,
            email:  this.loginemail,
            payMobileNumber: this.phone_firsstPL,
            phoneNumber: this.phone_firsstPL,
            isUccflight: this.isUccflightFinal,        //gaurav
            uccfCharge: this.uccftxncharge,    //gaurav
            isUccfTxn: this.isuccfFinal,         
            deviceFingerPrintID:this.datevalue // raghve
            


          },
        };
        //console.log("flight book req body", reqbody);
        this.flightService.flightbook(reqbody).subscribe((res) => {
          //console.log(res);
      // debugger
          if (res["statusMessage"] == "Some Technical Error") {
            this.swalPopup();

          }
          if (
            res["statusMessage"] == "Selected Flight option not found in cache"
          ) {
            this.swalPopup();

          }

          this.pgPostURL = res["pgPostURL"];
          //   localStorage.setItem('pgPostURL',res['pgPostURL']);
          //console.log("pgPostURL", res["pgPostURL"]);

          this.payReq = res["payReq"];
          this.xid = res["xid"];
          //console.log("return url ----", res["returnURL"]);
          //  localStorage.setItem('returnURL',res['returnURL']);
          this.returnURL = res["returnURL"];
          this.bookingRefNo = res["bookingRefNo"];
          // alert(this.returnURL);
          //  alert(this.pgPostURL);

       

          if (res["paymentGatewayId"] == "235") {
            this.methodForm = "GET";
          } else {
            this.methodForm = "POST";
          }

          if (this.pgPostURL) {
            //console.log(this.myFormPost);
            setTimeout(() => {
              window.open(this.pgPostURL,"_self")
            }, 10);

         
           
          } else {
            if (this.bookingRefNo) {
              //console.log(this.bookingRefNo);
           //   this.closeLoading();
              localStorage.setItem("BOOKRN", this.bookingRefNo);
              sessionStorage.setItem("BOOKRN", this.bookingRefNo);

              this.flightService.sendbookingRefNo(this.bookingRefNo);
              this.router.navigate(["./booking-confirmation"]);
            }
          }
        });
     
  
  

    ///end fraud card call

    //4000000000000051
    //"cardNumber":"5200000000000007",
    //"cardNumber":"4242424242424242",
  }


  fullnameinterswitch:boolean;
    checkfullnameinterswitch(value: string) { 
  
      if(this.interswitchForm.controls['cardname'].hasError('alpha') || this.interswitchForm.controls['cardname'].hasError('required')){
//console.log('errrr');
this.multiflightFare = this.fareM;
this.cprice =  this.fareR;
this.displayfareoneway = this.fareO;
localStorage.removeItem('surchargeAmount');
this.surchargeAmountnewx = 0;
this.surchargeAmount2 = 0;
this.surchargeAmount = 0;
this.newCharge = 0;

      }else{

     let cardnamevalue = this.interswitchForm.controls['cardname'].value;
     let cardnamevalue_split = cardnamevalue.split(" ");
     let cardnamevalue_split_zero = cardnamevalue_split[0];
     let cardnamevalue_split_one = cardnamevalue_split[1];
     //console.log('cardnamevalue_after split>>>',cardnamevalue_split)

     //console.log('cardnamevalue_split_zero',cardnamevalue_split_zero)
     //console.log('cardnamevalue_split_one',cardnamevalue_split_one)
    //  //console.log('cardnamevalue_split_one length',cardnamevalue_split_one && cardnamevalue_split_one.length)

     // var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  // if(!regName.test(value)){
    if(cardnamevalue_split_one == undefined){

    //console.log('Invalid name given.');
      this.fullnameinterswitch = true;
      this.interswitchForm.controls['cardname'].setErrors({ 'incorrect': true});
      this.interswitchForm.controls['cardname'].markAsTouched();
      //console.log('this.fullname',this.fullnamecheckout);
      this.multiflightFare = this.fareM;
      this.cprice =  this.fareR;
      this.displayfareoneway = this.fareO;
      localStorage.removeItem('surchargeAmount');
      this.surchargeAmountnewx = 0;
  this.surchargeAmount2 = 0;
  this.surchargeAmount = 0;
  this.newCharge = 0;

  
  }else{
    if(cardnamevalue_split_one.length<1){
      this.fullnameinterswitch = true;
      this.interswitchForm.controls['cardname'].setErrors({ 'incorrect': true});
      this.interswitchForm.controls['cardname'].markAsTouched();
      this.multiflightFare = this.fareM;
      this.cprice =  this.fareR;
      this.displayfareoneway = this.fareO;
      localStorage.removeItem('surchargeAmount');
      this.surchargeAmountnewx = 0;
      this.surchargeAmount2 = 0;
      this.surchargeAmount = 0;
      this.newCharge = 0;
    }else{

      this.interswitchSurcharge();
    this.fullnameinterswitch = false;
  
    //console.log('Valid name given.');
   // //console.log('this.fullname',this.fullnamecheckout);
  }
  }
}
    }
interBoolean:boolean = false
  termconditions_interswitch = false;
  interswitch(){


    

    let val = this.interswitchForm.controls["checkeboxx"].value;

    //console.log(val);
    if (!val) {
      this.termconditions_interswitch = true;
    } else {
      this.termconditions_interswitch = false;
    }


    //console.log('i m from is');
    if (this.interswitchForm.invalid) {
      for (let i in this.interswitchForm.controls)
        this.interswitchForm.controls[i].markAsTouched();

      return;
    }
    let cardname = this.interswitchForm.controls["cardname"].value;
    let spltname = cardname.split(" ")
    let fname = spltname[0];
    let lname = spltname[1];
    this.interBoolean =  true;
    this.presentLoading();
    this.mytime = 60000;
    /////call payment
    var reqbody = {
      affilatePartnerId:this.affilatePartnerId,
      isBookAndHold: false,
      autoTicketingDisabling:this.autoticketingDisable,
      branchCode: this.branchCode,
      branchCurrencyConversionToUSD: 0,
      branchCurruency: this.branchCurrencyCode,
      groupId: this.groupId,
      countryId: this.countryId,
      surchargeAmount: this.surchargeAmount2 ? this.surchargeAmount2:0,
      countryCode: this.countryCode,
      conversionRate: 0,
      noOfAdult: this.adult ? this.adult : 1,
      noOfChild: this.children ? this.children : 0,
      noOfInfant: this.infants ? this.infants : 0,
      onwardJourneyDate: this.onwarddate,
      passengerList: this.allPassengers,
      returnJourneyDate: this.returndate ? this.returndate : "null",
      selectedFlightOptionKey: this.selectedFlightOptionKey,
      tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
      userAlias: this.loginemail ? this.loginemail : this.loginemail,
      userCurruency: this.branchCurrencyCode,
      userSelectedCurrency: this.branchCurrencyCode,
      bookingRequestBean: {
        productType: 0,
        modeOfPayment: 3,
        paymentGatewayId: 236,
        cardNumber: null,
        cardHolderName: this.interswitchForm.controls["cardname"].value,
       cvvNumber: null,
       expMonth: null,
      expYear: null,
        street: "1295 Charleston Road",
        state: "CA",
        country: "US",
        zip: "94043",
        address: "noida",
        city: "Mountain view",
        f_name: fname,
        l_name: lname,
        email: this.loginemail,
        payMobileNumber: this.phone_firsstPL,
        phoneNumber: this.phone_firsstPL,
        isUccflight:this.isUccflightFinal,      // raghve
        uccfCharge: this.uccftxncharge,   // raghve
        isUccfTxn:this.isuccfFinal
        // raghve
      },
    };
    //console.log("flight book req body of interswitch", reqbody);
    this.flightService.flightbook(reqbody).subscribe((res) => {
//console.log('res of interswitch',res);


this.bookingRefNo = res["bookingRefNo"];
this.pgPostURL = res["pgPostURL"];         
this.returnURL = res["returnURL"];        
this.currencyId = res["currencyId"];
this.customerName = res["customerName"];
this.hash = res["hash"];
this.paymentAmount = res["paymentAmount"];
this.paymentNetworkTransactionID = res["paymentNetworkTransactionID"];
this.productType = res["productType"];
this.transactionID = res["transactionID"];

//this.closeLoading();

//debugger


if (res["statusMessage"] == "Some Technical Error") {
  this.swalPopup();

}
if (
  res["statusMessage"] == "Selected Flight option not found in cache"
) {
  this.closeLoading();
  this.swalPopup();

}


if (res["paymentGatewayId"] == "235") {
  this.methodForm = "GET";
} else {
  this.methodForm = "POST";
}

if (this.pgPostURL) {
  setTimeout(() => {
    this.myFormPost.nativeElement.submit();
    //console.log(this.myFormPost);
  }, 10);
  //console.log(this.myFormPost);

  //this.closeLoading();
  //debugger
  //this.router.navigate(['./booking-confirmation']);

  // debugger
} else {
  if (this.bookingRefNo) {
    //console.log(this.bookingRefNo);
    this.closeLoading();
    localStorage.setItem("BOOKRN", this.bookingRefNo);
    sessionStorage.setItem("BOOKRN", this.bookingRefNo);

    this.flightService.sendbookingRefNo(this.bookingRefNo);
    this.router.navigate(["./booking-confirmation"]);
  }
}


    })

  }


/////select country popup --start

allCountry;
allCountryList: any;
newCountryList = [];
getAllNewCountry() {
  this.allCountryList = country.countries;
  this.allCountryList.forEach(element => {
    this.newCountryList.push({
      countryCode: element["countryCode"],
      countryId: element["countryId"],
      countryName: element["countryName"],
      phoneCode: element['phoneCode'],
    });
  });
  this.allCountry = this.newCountryList;
  
}


onSelectCountrynew(formfield, selectedvalue){
  let selectedCurrentValue;


  if(formfield != undefined){
  if(formfield == 'country' && selectedvalue ){
    
    const selectedCountry = this.newCountryList.find(
      c => c.countryCode == selectedvalue
    );
    selectedCurrentValue = selectedCountry['phoneCode'];

  }
}
  let sendCurrentData ={
    formfield:formfield,
    selectedCurrentValue: selectedCurrentValue,
    currentCountryList: this.newCountryList
  }
  this.bottomSheet.open(NationalityComponent, {
    data: sendCurrentData,
    panelClass: "countryList",
  });

 
  
  this.bottomSheet._openedBottomSheetRef
  .afterDismissed()
  .subscribe((res)=>{
    //console.log('res of selected country',res['currentCountrySelected']['countryCode'])
    if(res != undefined){
      if(res['currentFieldSelected'] == 'country'){
        this.paymentformthreeg.get('country').setValue(res['currentCountrySelected']['countryCode']);
        //console.log('form field val is', this.paymentformthreeg.get('country').value)

      }
    }
   
    
  })
}




////select country popup -end



  ///////////make payment of 3g pay form ----if 3g pay form
  isSubmtted1 = false;
  termconditions1 = false;
  isthreegBoolean:boolean = false;
  threegpayForm() {
    this.sessisionTimeOut();
    //console.log(!this.sessisionTimeOut());
    if (!this.sessisionTimeOut()) {
      this.sessionTimeOutPopupShow();
    } else {
      this.isSubmtted1 = true;
      let valx = this.paymentformthreeg.controls["checkeboxxneww"].valueChanges;
      //console.log(valx);

      let val = this.paymentformthreeg.controls["checkeboxxneww"].value;

      //console.log(val);
      if (!val) {
        this.termconditions1 = true;
      } else {
        this.termconditions1 = false;
      }

      if (this.paymentformthreeg.invalid) {
        for (let i in this.paymentformthreeg.controls)
          this.paymentformthreeg.controls[i].markAsTouched();

        return;
      }

      this.isthreegBoolean = true;

      this.presentLoading();
      this.mytime = 60000;
    //  this.fareRecheckOnPay();
      // //console.log(this.paymentform.value);
      //console.log(this.paymentformthreeg.value);

      this.threeG = this.paymentformthreeg.value;

      this.address = this.threeG.address;
      this.cardholdername =this.paymentformthreeg.get('cardname').value;
      this.country = this.threeG.country;
      this.email = this.threeG.email;
      this.phone = this.threeG.phone;
      this.state = this.threeG.state;
      this.street = this.threeG.street;
      this.zipcode = this.threeG.zipcode;
      this.city = this.threeG.city;
     /////split naame

    let filledname = this.cardholdername.split(" ");
    let fnameis = filledname[0];
    let lnameis = filledname[1];
     ////

     // isBookAndHold: this.bookandholdstatus,
      var reqbody = {
        affilatePartnerId:this.affilatePartnerId,
        autoTicketingDisabling:this.autoticketingDisable,
        isBookAndHold: false,
        branchCode: this.branchCode,
        branchCurrencyConversionToUSD: 0,
        branchCurruency: this.branchCurrencyCode,
        groupId: this.groupId,
        countryId: this.countryId,
        countryCode: this.countryCode,
        surchargeAmount: this.surchargeAmount2,
        conversionRate: 0,
        noOfAdult: this.adult ? this.adult : 1,
        noOfChild: this.children ? this.children : 0,
        noOfInfant: this.infants ? this.infants : 0,
        onwardJourneyDate: this.onwarddate,
        passengerList: this.allPassengers,
        returnJourneyDate: this.returndate ? this.returndate : "null",
        selectedFlightOptionKey: this.selectedFlightOptionKey,
        tripType: this.tripType == "returnway" ? "roundtrip" : this.tripType,
        userAlias: this.loginemail,
        userCurruency: this.branchCurrencyCode,
        userSelectedCurrency: this.branchCurrencyCode,
        bookingRequestBean: {
          productType: 0,
          modeOfPayment: 3,
          paymentGatewayId: 1,
          cardHolderName: this.cardholdername,
          street: this.street,
          state: this.state,
          country:  this.paymentformthreeg.get('country').value,
          zip: this.zipcode,
          address: this.address,
          city: this.city,
          f_name: fnameis,
          l_name: lnameis,
          email: this.email,
          payMobileNumber: this.phone,
          phoneNumber: this.phone
          

        },
      };
      //console.log("3g pay req body :----", reqbody);

      this.flightService.flightbook(reqbody).subscribe((res) => {
        //console.log("3g pay response :", res);

        if (res["statusMessage"] != "success") {
          // swal.fire(
          //   "Can't proceed with selected flight",
          //   "Please select another flight",
          //   "error"
          // );
          // this.redirecTo();

          this.swalPopup();
        }

        this.pgPostURL = res["pgPostURL"];
        this.payReq = res["payReq"];
        this.xid = res["xid"];
        this.returnURL = res["returnURL"];
        this.bookingRefNo = res["bookingRefNo"];
        // localStorage.setItem('bookingRefNo',this.bookingRefNo);
     

        if (res["paymentGatewayId"] == "235") {
          this.methodForm = "GET";
        } else {
          this.methodForm = "POST";
        }

        //this.router.navigate(['/this.pgPostURL'])

        if (this.pgPostURL) {
          // alert('url coming');
          // window.location.href= this.pgPostURL;
          // window.location.replace(this.pgPostURL?"+this.payReq");
          setTimeout(() => {
            this.myFormPost.nativeElement.submit();
            //console.log(this.myFormPost);
          }, 10);
          //console.log(this.myFormPost);
          // this.myFormPost.nativeElement.submit()
          //this.form.nativeElement.submit();
        ///  this.closeLoading();
          //commenting on 19feb
          //this.router.navigate(['./booking-confirmation']);

          //this.submitForm()
        } else {
             if (this.bookingRefNo) {
          //console.log(this.bookingRefNo);
          localStorage.setItem("BOOKRN", this.bookingRefNo);
          sessionStorage.setItem("BOOKRN", this.bookingRefNo);

          this.flightService.sendbookingRefNo(this.bookingRefNo);
        }
        }
      });
    }
  }


  swalPopup() {

 
     const swalWithBootstrapButtons = Swal.mixin({
       customClass : {
         container:"swalForCOD"
         },
      
     })
     
     swalWithBootstrapButtons.fire({
       allowOutsideClick: false,
       customClass : {
         container:"swalForBack"
         },
       title: "Can't proceed with selected flight",
       text: "Please select another flight",
       icon: 'error',
     //  showCancelButton: true,

       confirmButtonText: 'OK',
       reverseButtons: false
     }).then((result) => {
       if (result.value == true) {
            
        this.redirecTo();
 //console.log('cliked on ok')
         
       } else if (
         result.dismiss === Swal.DismissReason.cancel
       ) {
        // this.router.navigate(["./booking-confirmation"]);
 
 
       }
     })
 
 
    
   
    
   
 }

  /////end 3g pay form

  getsingleflight() {
    this.subscribe = this.flightService.getselectedFlight().subscribe((res) => {
      if (res) {
        //console.log(res);

        // this.cprice =  res['currentPrice'];
        this.fareConfirmReqKey = res["fareConfirmReqKey"];
        ////console.log("fare confirm req.key" + this.fareConfirmReqKey);
       /// localStorage.setItem("fareConfirmReqKey", this.fareConfirmReqKey);
        ///response -oneway start
        this.selectedflight2 = res["onwardFlightOption"];
        this.selectedflight = res["onwardFlightOption"];
        ////console.log("Selected 2" + this.selectedflight2);
       
        this.selectedflightreturnway = res["roundTripFlightOption"];
        if (this.tripType == "returnway") {

          this.returnwaycurreny =  res["roundTripFlightOption"]['onwardFlightOption']['flightFare']['currency'];

  
          this.setReturnWayfare(res);
         

        }
        ///response --returnway  end
        if (this.tripType == "oneway") {
       this.onewayflight  = res;

         
          this.setOnewfare(res["onwardFlightOption"])
          this.dynamicCurrency = this.selectedflight2.flightFare.currency;
       
         
        }
 
      }
      
      else {
       //console.log('no response on payment paege')
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
    //console.log('onew way fare')
    this.displayfareoneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
    this.beforeOCF_oneway = res.flightFare.totalBaseFare + res.flightFare.totalTax + res.flightFare.totalFees + res.flightFare.markupPrice + res.flightFare.serviceChargePrice - res.flightFare.discountPrice;
    this.flightService.sendflightdetails(res);
    //console.log(this.displayfareoneway);
    this.onewayfareNoceil = this.displayfareoneway;

    //this.displayfareoneway = Math.ceil(this.displayfareoneway);
    this.fareO =  this.displayfareoneway;
    let onewayfare:any = this.displayfareoneway
    localStorage.setItem('cpo',onewayfare);
    //this.lowprice(this.displayfareoneway);
  }
  setReturnWayfare(res) {

    this.flightService.sendflightdetails(res['roundTripFlightOption']);
    this.cprice = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
    this.beforeOCF_roundtrip = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];

    ////console.log(this.cprice);
    this.cpriceNoceil = this.cprice;
    //this.cprice = Math.ceil(this.cprice);
    this.fareR =  this.cprice;
    //this.threegpaySurcharge_oneway();
   // this.interswitchSurcharge();

    localStorage.setItem('cpr',this.cprice);
    //this.lowpriceR(this.cprice);

  }

  setmultiCityFare(multiCity) {
   // //console.log('multicity fare')

    this.flightService.sendflightdetails(multiCity['onwardFlightOption']);
    this.multiCityCurrency = multiCity.flightFare.currency
    this.multiflightFare = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;
    this.beforeOCF_multicity = multiCity.flightFare.totalBaseFare + multiCity.flightFare.totalTax + multiCity.flightFare.totalFees + multiCity.flightFare.markupPrice + multiCity.flightFare.serviceChargePrice - multiCity.flightFare.discountPrice;

    ////console.log(this.multiflightFare);
    this.multiflightFareNoceil = this.multiflightFare;
    
   // this.multiflightFare = Math.ceil(this.multiflightFare);


    this.fareM =  this.multiflightFare;

    let multifare:any = this.multiflightFare;
    localStorage.setItem('cpm',multifare);

    
    //this.interswitchSurcharge();

   // this.lowpriceM(this.multiflightFare);

  }



  submitForm() {
    // this.form.nativeElement.submit();
    //console.log(this.form);
    this.form.nativeElement.submit();
  }
  onsubmit(value) {
    //console.log(value);
  }
  // calenderdata() {

  //   this.subscriptiondata = this.sendTravelerData.getdata().subscribe(data2 => {
  //     //console.log(data2)
  //     this.fulldatefromcalender = data2.text2;
  //     this.departDate = this.fulldatefromcalender[0]
  //     this.returnDate = this.fulldatefromcalender[1]
  //     //console.log("depart" +  this.fulldatefromcalender[0]);
  //     //console.log("return" +  this.fulldatefromcalender[1]);

  //     //console.log(this.convertdepart(this.departDate));
  //     //console.log(this.convertreturn(this.returnDate))

  // this.reqdepartdate = this.convertdepart(this.departDate);
  // this.reqreturndate = this.convertreturn(this.returnDate);

  // //console.log(this.reqdepartdate)
  // //console.log(this.reqreturndate)

  //   });
  // }

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

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //  this.subscriptiondata.unsubscribe();
    this.travSub.unsubscribe();
  }

  gettravllerfromservice() {
    this.travSub = this.sendTravelerData.gettravller().subscribe((res) => {
      //console.log(res);
      var info = res["trvllerfield"];
      this.adultdefault = res.adult;
      this.adult = info.adult;
      this.children = info.children;
      this.infants = info.infants;

      //console.log(this.adult);
      //console.log(this.children);
      //console.log(this.infants);
    });
  }

  setButtonClose = false;
  closePopup() {
    this.bottomSheet.dismiss();
    this.setButtonClose = false;
  }
  fareDetails() {
    this.surchargeAmount = this.surchargeAmount ? this.surchargeAmount :  this.newCharge;
    //this.newCharge = this.newCharge ? this.newCharge : this.surchargeAmount;
  //  //console.log('surchargeAmount---newCharge',this.newCharge);
    this.setButtonClose = true;
    this.bottomSheetref.open(FareDetailsComponent, {
      panelClass: "fare-class",
      backdropClass: "fare-backdrop",
      data: this.surchargeAmount ? this.surchargeAmount : 'cyber'
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
    //  //console.log(res);
      this.setButtonClose = false;
    });
  }

  makePayment() {}

  isValidcard: boolean = false;

  detectCardType(cardnumber) {
   // //console.log(cardnumber);
    let re = {
      //
      1: /^4[0-9]{12}(?:[0-9]{3})?$/, //visa
      2: /^5[1-5][0-9]{14}$/, //mastercard
      3: /^3[47][0-9]{13}$/, //amex
      4: /^6(?:011|5[0-9]{2})[0-9]{12}$/, //discover
      5: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, //diners
      6: /^(?:2131|1800|35\d{3})\d{11}$/, //jcb
      7: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/, //maestro
      8: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/, //electron
      9: /^(5019)\d+$/, //dankort
      10: /^(636)\d+$/, //interpayment
      11: /^(62|88)\d+$/, //unionpay
      12: /^(6061|6062|6063|6064|6065|6066|6067|6068|6069|607|608)\d+$/, //rupay
    };
    let keys;
    for (var key in re) {
      if (re[key].test(cardnumber)) {
       // //console.log(cardnumber);
       
        this.cardid = key;
        this.isValidcard = true;

     
        return key;
        
        
      }else {
        
      
      
      } 
    }
    
  }


isCardInValid:boolean;
 cardIds(id){
  
  let cardid = +id;
  if(cardid>0 && cardid<13){
   
  this.isCardInValid = false;
  this.isCardInValidchkout = false;
  //console.log('card id is range 1-12',id);
  //console.log("Valid card..good");
  }else{
    //console.log('card id is not in range 1-12',id);

    if(this.typeofform == '2-Cyber Source'){
      this.paymentform.controls['newcardnumber'].setErrors({ 'incorrect': true});
      this.paymentform.controls['newcardnumber'].markAsTouched();
      this.isCardInValid = true;
     // //console.log("Please eneter a valid card number >>cybersource");
    }if(this.typeofform == '235-Checkout'){
      this.paymentformcheckout.controls['newcardnumber'].setErrors({ 'incorrect': true});
      this.paymentformcheckout.controls['newcardnumber'].markAsTouched();
      this.isCardInValidchkout = true;
     // //console.log("Please eneter a valid card number >>chkout");
    }
   


  }
 }

  checkvendor() {

    this.array.includes(this.serviceVendor) ?  this.fareCheck() : '';
  }

  checkSeat() {
    var reqbody = {
      fareConfirmRequestKey: this.fareConfirmReqKeyLocal,
      selectedFlightOptionKey: this.selectedFlightOptionKey,
    };
    this.flightService.seatAvailability(reqbody).subscribe((res) => {
      //console.log(res);
      let mssg = res["statusMessage"];
      if (mssg == "success") {
       // //console.log("seat is available");
    



      } else {
        


////

Swal.fire({
  allowOutsideClick: false,
  title: 'Seat is not available in selected flight!',
  text: "Please select another flight.",
  icon: 'error',
  customClass : {
    container:"swalForBack"
    },
  confirmButtonColor: "#FECE24",
  confirmButtonText: 'OK'
}).then((result) => {
  ////console.log(result.value == true);
  if (result.value == true) {
   // this.router.navigate([this.searchPageURL]);
   this.redirecTo();
  }
});
//


      }
    });
  }


  
  fareCheck() {
          //console.log("i am from fareCheck");

    var reqbody = {
      fareConfirmRequestKey: this.fareConfirmReqKeyLocal,
      selectedFlightOptionKey: this.selectedFlightOptionKey,
      passengerList:this.allPassengers
     // branchId:this.branchId;
    };
  //  //console.log('req body of check fareCheck',reqbody)

    this.flightService.fareRecheck(reqbody).subscribe((res) => {
     this.flightPopUp(res);
      let mssg1 = res["statusMessage"];
     
     

      this.uccftxncharge = res["uccfTxnCharge"];   //gaurav
      this.isUccflightFinal = res["isUccflight"]; 
      this.isuccfFinal = res["uccfTxn"];
     
        if (this.tripType == "oneway") {
          let resOnward = res['onwardFlightOption']
         let onewayfarerechk = resOnward.flightFare.totalBaseFare + resOnward.flightFare.totalTax + resOnward.flightFare.totalFees + resOnward.flightFare.markupPrice + resOnward.flightFare.serviceChargePrice - resOnward.flightFare.discountPrice;
         this.fareBreakupO(res);
        // //console.log('fare rechk fare oneway >>>>>>>>>>>', onewayfarerechk);
        if(onewayfarerechk){
          if(this.beforeOCF_oneway != onewayfarerechk){
           // //console.log('fare not equal >oneway')

            this.displayfareoneway = onewayfarerechk;
           }
        }
        


         this.lowprice(onewayfarerechk)
        }
        if (this.tripType == "multicity") {
          let resOnward = res['onwardFlightOption']
         let displayfaremultirechk = resOnward.flightFare.totalBaseFare + resOnward.flightFare.totalTax + resOnward.flightFare.totalFees + resOnward.flightFare.markupPrice + resOnward.flightFare.serviceChargePrice - resOnward.flightFare.discountPrice;
        //  //console.log('fare rechk fare multicity >>>>>>>>>>>', displayfaremultirechk)
        this.fareBreakupM(res);

          if(displayfaremultirechk){
            if(this.beforeOCF_multicity != displayfaremultirechk){
              this.multiflightFare = displayfaremultirechk;
             }
          }
        
          this.lowpriceM(displayfaremultirechk);

        }
        if (this.tripType == "returnway") {
         let  displayfarereturnwayrechk  = res['roundTripFlightOption']['totalBaseFare'] + res['roundTripFlightOption']['totalTax'] + res['roundTripFlightOption']['totalFee'] + res['roundTripFlightOption']['markupPrice'] + res['roundTripFlightOption']['serviceChargePrice'] - res['roundTripFlightOption']['discountPrice'];
         ////console.log('fare rechk fare returnnway >>>>>>>>>', displayfarereturnwayrechk)
         this.fareBreakupR(res);

         if(displayfarereturnwayrechk){
          if(this.beforeOCF_roundtrip != displayfarereturnwayrechk){
          //  //console.log('fare not equal >roundtrip')
            this.cprice = displayfarereturnwayrechk;
           }
        }
        
         this.lowpriceR(displayfarereturnwayrechk);

        }
     
     // }
    });
  }

fareBreakupO(res){
  let resOnward = res['onwardFlightOption']
   
  let totalfare = resOnward.flightFare.t3Price - resOnward.flightFare.discountPrice;
  let oneway_fare = totalfare-resOnward.flightFare.totalTax;
  let oneway_tax = resOnward.flightFare.totalTax;
  const fareBreak = {
    fare: oneway_fare,
    texNfee: oneway_tax
  }
  this.flightService.sendfareBreakup(fareBreak);
  //console.log('Fare oneway on recheck>>>>>>>>>>>',  oneway_fare);
  //console.log('Taxes & Fees oneway on recheck>>>>>>>>>>>', oneway_tax);
}
fareBreakupR(res){
  let response = res['roundTripFlightOption'];
  let roundtrip_tax = response.totalTax;
    let afterdiscount = response.t3Price - response.discountPrice;
    let totalfare = afterdiscount - roundtrip_tax;
   // //console.log(this.totalfare);
    ////console.log('roundtrip_totalfare -- returnway',totalfare);
    const fareBreak = {
      fare: totalfare,
      texNfee: roundtrip_tax
    }
    this.flightService.sendfareBreakup(fareBreak);
        //console.log('roundtrip_tax -- returnway',roundtrip_tax)
        //console.log('roundtrip_totalfare -- returnway',totalfare);

}
fareBreakupM(res){
  let resOnward = res['onwardFlightOption']
   
  let totalfare = resOnward.flightFare.t3Price - resOnward.flightFare.discountPrice;
  let oneway_fare = totalfare-resOnward.flightFare.totalTax;
  let oneway_tax = resOnward.flightFare.totalTax;
  const fareBreak = {
    fare: oneway_fare,
    texNfee: oneway_tax
  }
  this.flightService.sendfareBreakup(fareBreak);
  //console.log('Fare multicity on recheck>>>>>>>>>>>',  oneway_fare);
  //console.log('Taxes & multicity oneway on recheck>>>>>>>>>>>', oneway_tax);
}

  
  lowprice(displayfareoneway){

    if (displayfareoneway<1) {
      //alert('APIs Technical Error');
      swal.fire(
        "This flight is no more available",
        "Please select another flight",
        "error"
      );
      this.redirecTo();
      //this.router.navigate([this.searchPageURL]);
    }
  }
  lowpriceR(displayfareoneway){

    if (displayfareoneway<1) {
      //alert('APIs Technical Error');
      swal.fire(
        "This flight is no more available",
        "Please select another flight",
        "error"
      );
      this.redirecTo();
     // this.router.navigate([this.searchPageURL]);
    }
  }

  lowpriceM(displayfareoneway){

    if (displayfareoneway<1) {
      //alert('APIs Technical Error');
      swal.fire(
        "This flight is no more available",
        "Please select another flight",
        "error"
      );
      this.redirecTo();
     // this.router.navigate([this.searchPageURL]);
    }
  }

 fareRecheckOnPay(){
    if ( this.serviceVendor == "Amadeus" || this.serviceVendor == "Galelio" || this.serviceVendor == "Indigo" || this.serviceVendor == "Spice") {
    //  //console.log("service vendor is for farerecheck" + this.serviceVendor);
     ///////////////
     var reqmodal = {
      fareConfirmRequestKey: this.fareConfirmReqKeyLocal,
      selectedFlightOptionKey: this.selectedFlightOptionKey,
    };
     this.flightService.fareRecheck(reqmodal).subscribe((res) => {
     // //console.log("fareRecheck API Response", res);
     // //console.log("fare status is eqal or not", res["fareStatus"]);

    });
     //////////////
    }

  

 }


  threeGsurcharge() {
    //   booking.addingSurchargeThreeG = function() {
    //     booking.surchargeAmount = 0;
    //     booking.surchageArr[0] = 0;
    //     booking.uccfTxnCharge = uccfTxnCharge;
    // if(booking.isMarkDown=="true"){
    //         booking.uccfTxnCharge = 0;
    //     }
    //     if(booking.conversionRateTktPcc > 0){
    //         booking.actualFareTktPcc = (booking.flight.flightFare.actualTotalFare * booking.conversionRateTktPcc);
    //     } else {
    //         booking.actualFareTktPcc = parseFloat(booking.flight.flightFare.totalBaseFare) + parseFloat(booking.flight.flightFare.totalTax) + parseFloat((booking.flight.flightFare.totalFee!=undefined ? booking.flight.flightFare.totalFee : booking.flight.flightFare.totalFees));
    //     }
    //     booking.surchageArr[0] = 0;
    //     booking.percentCal = threeGServiceCharge;
    //     booking.abc = parseFloat(booking.flight.flightFare.markupPrice) + parseFloat(booking.flight.flightFare.serviceChargePrice) +parseFloat(booking.baggageValue) + parseFloat(booking.mealValue) + parseFloat(booking.seatValue) - parseFloat(booking.flight.flightFare.discountPrice);
    //     if(booking.abc > 0 && false == booking.isUccfTxn) {
    //         booking.abc = parseFloat(booking.actualFareTktPcc) + booking.abc;
    //     } else if (booking.abc < 0) {
    //         booking.uccfTxnCharge = 0;
    //         booking.abc = parseFloat(booking.actualFareTktPcc) + booking.abc;
    //     } else if(booking.abc == 0 && false == booking.isUccfTxn) {
    //         booking.abc = parseFloat(booking.actualFareTktPcc);
    //     }
    //     booking.surchargeAmount = (booking.abc * booking.percentCal) / 100;
    //     booking.surchageArr[0] = booking.surchargeAmount;
    // }
  }

  addingSurchargeThreeG() {
    this.surchargeAmount2 = 0;
    //booking.surchageArr[0] = 0;
    // booking.uccfTxnCharge = uccfTxnCharge;
    // if(booking.isMarkDown=="true"){
    //       booking.uccfTxnCharge = 0;
    //   }
  //  //console.log("surcharge from 3g pay", this.surchargeAmount2);
    if (this.selectedflight.currencyRate > 0) {
      this.actualFareTktPcc =
        this.selectedflight.flightFare.actualTotalFare *
        this.selectedflight.currencyRate;
    } else {
      this.actualFareTktPcc =
        parseFloat(this.selectedflight.flightFare.totalBaseFare) +
        parseFloat(this.selectedflight.flight.flightFare.totalTax) +
        parseFloat(
          this.selectedflight.flightFare.totalFee != undefined
            ? this.selectedflight.flightFare.totalFee
            : this.selectedflight.flight.flightFare.totalFees
        );
    }

    //booking.surchageArr[0] = 0;
    this.percentCal = this.selectedflight.threeGServiceCharge;

///ram sir


// var sameAirline=false;
// if(operatingCountry!=null && operatingCountry.toLowerCase()=='za'){
// if(booking.tripType == 'OneWay' || booking.tripType == 'MultiCity'){
// for(var legs=0; legs<booking.flight.onwardsflightLegs.length;legs++){
// if(booking.flight.onwardsflightLegs[legs].carrier=='JE' || booking.flight.onwardsflightLegs[legs].carrier=='4Z'){
// sameAirline=true;
// }else
// sameAirline=false;
// }

// }else if(booking.tripType == 'RoundTrip'){
// for(var legs=0; legs<booking.flight.onwardsflightLegs.length;legs++){
// if(booking.flight.onwardsflightLegs[legs].carrier=='JE' || booking.flight.onwardsflightLegs[legs].carrier=='4Z'){
// sameAirline=true;
// }else
// sameAirline=false;
// }
// for(var legs=0; legs<booking.flight.returnflightLegs.length;legs++){
// if(booking.flight.returnflightLegs[legs].carrier=='JE' || booking.flight.returnflightLegs[legs].carrier=='4Z'){
// sameAirline=true;
// }else
// sameAirline=false;
// }

// }
// if(sameAirline==true)
// booking.percentCal='2.5';
// }

///

    this.amount =
      parseFloat(this.selectedflight.flightFare.markupPrice) +
      parseFloat(this.selectedflight.flightFare.serviceChargePrice) +
      parseFloat(this.selectedflight.baggageValue) +
      parseFloat(this.selectedflight.mealValue) +
      parseFloat(this.selectedflight.seatValue) -
      parseFloat(this.selectedflight.flightFare.discountPrice);

    if (this.amount > 0 && false == this.selectedflight.isUccfTxn) {
      this.amount =
        parseFloat(this.selectedflight.actualFareTktPcc) + this.amount;
    } else if (this.amount < 0) {
      // booking.uccfTxnCharge = 0;
      this.amount = parseFloat(this.actualFareTktPcc) + this.amount;
    } else if (this.amount == 0 && false == this.selectedflight.isUccfTxn) {
      this.amount = parseFloat(this.actualFareTktPcc);
    }
   /// //console.log("surchargeAmount2 frpm 3gpay", this.surchargeAmount2);

   // //console.log("surchargeAmount2 frpm 3gpay", this.surchargeAmount2);

    this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

   // //console.log("surchargeAmount2 frpm 3gpay", this.surchargeAmount2);
  }




  sameAirline:boolean = false;
  threegpaySurcharge_oneway(){
    if(this.typeofform == '1-3G Pay'){

     this.isuccfTxnValue =  sessionStorage.getItem('isuccfTxnValue');
    // //console.log('isuccfTxnValue',this.isuccfTxnValue);

    if (this.tripType == "oneway") {

    
      let threeGPayServiceCharge = sessionStorage.getItem('threeGPayServiceCharge');
    //  //console.log('threeGPayServiceCharge from loccal',threeGPayServiceCharge)
      this.percentCal = threeGPayServiceCharge;

    this.surchargeAmount2 = 0;
   

  //  //console.log("surcharge from 3g pay", this.surchargeAmount2);
    ////console.log("surcharge from 3g pay --selectedflight oneway", this.selectedflight);

    if (this.selectedflight.currencyRate > 0) {
      this.actualFareTktPcc =
        this.selectedflight.flightFare.actualTotalFare *
        this.selectedflight.currencyRate;
      //  //console.log("actualFareTktPcc oneway curencyrate>0>>>>>>", this.actualFareTktPcc);

    } else {
      this.actualFareTktPcc =
        parseFloat(this.selectedflight.flightFare.totalBaseFare) +
        parseFloat(this.selectedflight.flightFare.totalTax) +
        parseFloat(
          this.selectedflight.flightFare.totalFee != undefined
            ? this.selectedflight.flightFare.totalFee
            : this.selectedflight.flightFare.totalFees
        );

       // //console.log("actualFareTktPcc oneway curencyrate<0>>>>>>", this.actualFareTktPcc);


    }


this.amount =
parseFloat(this.selectedflight.flightFare.markupPrice) +
parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
parseFloat(this.selectedflight.flightFare.discountPrice);
////console.log('amount oneway>>3gpay>>',this.amount);


    // this.amount =
    //   parseFloat(this.selectedflight.flightFare.markupPrice) +
    //   parseFloat(this.selectedflight.flightFare.serviceChargePrice) +
    //   parseFloat(this.selectedflight.flightFare.discountPrice);

    //   //console.log('amount 3gpay manually cal',this.amount)

    if (this.amount > 0 &&  this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc + this.amount;
    ///  //console.log('amount is greater thn zero and uccftxn is false.--oneway>>>',this.amount,this.isuccfTxnValue);
    } else if (this.amount < 0) {
      // booking.uccfTxnCharge = 0;
      this.amount = this.actualFareTktPcc + this.amount;
    //  //console.log('amount is less thn zero--oneway>>>',this.amount);

    } else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc;
    //  //console.log('amount is  zero and uccftxn is false.--oneway>>>',this.amount,this.isuccfTxnValue);

    }

    // //console.log("final amount & percentCal", this.amount, this.percentCal);

    this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

   // //console.log("this.surchargeAmount2  3gpay >>final", this.surchargeAmount2);
    this.newCharge = this.surchargeAmount2;

    if(this.tripType == 'oneway'){
      let ocf:any =  this.surchargeAmount2;
      localStorage.setItem('surchargeAmount',ocf);
   //   //console.log( "price on foooter before ocf" , this.displayfareoneway  );
  
      this.displayfareoneway = this.onewayfareNoceil  + ocf ;
      //this.displayfareoneway  = Math.ceil(this.displayfareoneway );
  
      
    }
   

  

    ///else of trip type
  }
  if(this.tripType== 'returnway'){
///////////////////////surchrge for retunway start
////console.log('this is selctd flight of returnway',this.selectedflightreturnway);
let threeGPayServiceCharge = sessionStorage.getItem('threeGPayServiceCharge');
////console.log('threeGPayServiceCharge from loccal',threeGPayServiceCharge)
this.percentCal = threeGPayServiceCharge;
  
    this.surchargeAmount2 = 0;
  

    if (this.selectedflightreturnway.currencyRate > 0) {
      this.actualFareTktPcc =
        this.selectedflightreturnway.actualTotalFare *
        this.selectedflightreturnway.currencyRate;
       /// //console.log("surcharge from 3g pay --actualFareTktPcc retunway", this.actualFareTktPcc);

    } else {
      this.actualFareTktPcc =
        parseFloat(this.selectedflightreturnway.totalBaseFare) +
        parseFloat(this.selectedflightreturnway.totalTax) +
        parseFloat(
          this.selectedflightreturnway.totalFee != undefined
            ? this.selectedflightreturnway.totalFee
            : this.selectedflightreturnway.totalFees
        );

        /////console.log("surcharge from 3g pay --actualFareTktPcc retunway", this.actualFareTktPcc);

    }

    

   


// var sameAirline=false;
// if(this.operatingCountry!=null && this.operatingCountry.toLowerCase()=='in'){
//   //console.log("operatingCountry", this.operatingCountry.toLowerCase());

// if(this.tripType== 'returnway'){
// for(let i=0; i<this.selectedflightreturnway.onwardFlightOption.flightlegs.length;i++){
//   //console.log("carrier onward>>>>", this.selectedflightreturnway.onwardFlightOption.flightlegs[i].carrier);

// if(this.selectedflightreturnway.onwardFlightOption.flightlegs[i].carrier=='6E' || this.selectedflightreturnway.onwardFlightOption.flightlegs[i].carrier=='UK'){
//   this.sameAirline=true;
// }else{
//   this.sameAirline=false;

// }
// }
// for(let j=0; j<this.selectedflightreturnway.returnFlightOption.flightlegs.length;j++){
//   //console.log("carrier return>>>>", this.selectedflightreturnway.returnFlightOption.flightlegs[j].carrier);

// if(this.selectedflightreturnway.returnFlightOption.flightlegs[j].carrier=='6E' || this.selectedflightreturnway.returnFlightOption.flightlegs[j].carrier=='UK'){
//   this.sameAirline=true;
// }else{
//   this.sameAirline=false;
// }

// }



// }

// if(this.sameAirline){
//   //console.log("sameAirline value for returnway..>>>", this.sameAirline);
//   this.percentCal='2.5';
//   //console.log('per cal for sg/6E-UK',this.percentCal)
// }else{
//   let threeGPayServiceCharge = localStorage.getItem('threeGPayServiceCharge');
// //console.log('threeGPayServiceCharge from loccal',threeGPayServiceCharge)
// this.percentCal = threeGPayServiceCharge;
// //console.log("surcharge from 3g pay --percentCal retunway", this.percentCal);
// }




// }



this.amount =
parseFloat(this.selectedflightreturnway.markupPrice) +
parseFloat(this.selectedflightreturnway.serviceChargePrice) -
parseFloat(this.selectedflightreturnway.discountPrice);
////console.log('this.amount returnway',this.amount); 


    if (this.amount > 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc + this.amount;
     //   //console.log('amount is greater thn zero and uccftxn is false.--retunway>>>',this.amount,this.isuccfTxnValue);
    } else if (this.amount < 0) {
      // booking.uccfTxnCharge = 0;
      this.amount = this.actualFareTktPcc + this.amount;
      ////console.log('amount is less thn zero--retunr>>>',this.amount);

    } else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
      this.amount = this.actualFareTktPcc;
      ////console.log('amount is  zero and uccftxn is false.---return>>>',this.amount,this.isuccfTxnValue);
    }

    // //console.log("amount & percentCal for retunway", this.amount,this.percentCal);

    this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

    ////console.log("this.surchargeAmount2  3gpay >>final retunrway", this.surchargeAmount2);

    this.newCharge = this.surchargeAmount2;


    let ocf:any =  this.surchargeAmount2;
    localStorage.setItem('surchargeAmount',ocf);
   // //console.log( "price on foooter before ocf" , this.cpriceNoceil );

    this.cprice = this.cpriceNoceil + ocf ;
    //this.cprice = Math.ceil(this.cprice);


  }


////////////////////////multicity start

if (this.tripType == "multicity") {

    

  let threeGPayServiceCharge = sessionStorage.getItem('threeGPayServiceCharge');
/////console.log('threeGPayServiceCharge from loccal',threeGPayServiceCharge)
this.percentCal = threeGPayServiceCharge;

  this.surchargeAmount2 = 0;
 

 // //console.log("surcharge from 3g pay", this.surchargeAmount2);
  ////console.log("surcharge from 3g pay --selectedflight multicity", this.selectedflight);

  if (this.selectedflight.currencyRate > 0) {
    this.actualFareTktPcc =
      this.selectedflight.flightFare.actualTotalFare *
      this.selectedflight.currencyRate;
    //  //console.log("actualFareTktPcc multicty curencyrate>0>>>>>>", this.actualFareTktPcc);

  } else {
    this.actualFareTktPcc =
      parseFloat(this.selectedflight.flightFare.totalBaseFare) +
      parseFloat(this.selectedflight.flightFare.totalTax) +
      parseFloat(
        this.selectedflight.flightFare.totalFee != undefined
          ? this.selectedflight.flightFare.totalFee
          : this.selectedflight.flightFare.totalFees
      );

     // //console.log("actualFareTktPcc multicty curencyrate<0>>>>>>", this.actualFareTktPcc);


  }

 
// var sameAirline=false;
// if(this.operatingCountry!=null && this.operatingCountry.toLowerCase()=='in'){
// //console.log("operatingCountry iss from if", this.operatingCountry.toLowerCase());

// if(this.tripType == 'multicity'){

//   for(let i = 0;i<this.selectedflight.optionSegmentBean.length;i++){
//     //console.log('this.selectedflight.optionSegmentBean>>>',this.selectedflight.optionSegmentBean)
//     for(let j = 0;j<this.selectedflight.optionSegmentBean[i].flightlegs.length;j++){
   
//       //console.log("carrier >>>>", this.selectedflight.optionSegmentBean[i].flightlegs[j].carrier);


//       if(this.selectedflight.optionSegmentBean[i].flightlegs[j].carrier=='6E' || this.selectedflight.optionSegmentBean[i].flightlegs[j].carrier=='UK'){
//         this.sameAirline=true;
//         //console.log("sameAirline", this.sameAirline);
        
//         }else{
//           this.sameAirline=false;
//           //console.log("sameAirline", this.sameAirline);
//         }

//     }

//   }



// }
// if(this.sameAirline){
//   //console.log("sameAirline value for oneway..>>>", this.sameAirline);
//   this.percentCal='2.5';
//   //console.log('per cal for sg/6E-UK',this.percentCal)
// }else{
//   let threeGPayServiceCharge = localStorage.getItem('threeGPayServiceCharge');
// //console.log('threeGPayServiceCharge from loccal',threeGPayServiceCharge)
// this.percentCal = threeGPayServiceCharge;
// //console.log("surcharge from 3g pay --percentCal onewaay", this.percentCal);
// }

// }

///

this.amount =
parseFloat(this.selectedflight.flightFare.markupPrice) +
parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
parseFloat(this.selectedflight.flightFare.discountPrice);
////console.log('this.amount',this.amount);


  // this.amount =
  //   parseFloat(this.selectedflight.flightFare.markupPrice) +
  //   parseFloat(this.selectedflight.flightFare.serviceChargePrice) +
  //   parseFloat(this.selectedflight.flightFare.discountPrice);

  //   //console.log('amount 3gpay manually cal',this.amount)

  if (this.amount > 0 && this.isuccfTxnValue == 'false') {
    this.amount = this.actualFareTktPcc + this.amount;

     // //console.log('amount is greater thn zero and uccftxn is false.--multicity>>>',this.amount,this.isuccfTxnValue);
  } else if (this.amount < 0) {
    // booking.uccfTxnCharge = 0;
    this.amount =  this.actualFareTktPcc + this.amount;
    ////console.log('amount is less thn zero--multicity>>>',this.amount);

  } else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
    this.amount = this.actualFareTktPcc;
    ////console.log('amount is  zero and uccftxn is false.--multicity>>>',this.amount,this.isuccfTxnValue);
  }

   ////console.log("final amount & percentCal", this.amount, this.percentCal);

  this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

  ////console.log("this.surchargeAmount2  3gpay >>final", this.surchargeAmount2);

   this.newCharge = this.surchargeAmount2 ;

  if(this.tripType == 'multicity'){
    let ocf:any =  this.surchargeAmount2;
    localStorage.setItem('surchargeAmount',ocf);
    ////console.log( "price on foooter before ocf" , this.multiflightFare  );

    this.multiflightFare = this.multiflightFareNoceil  + ocf ;
    //this.multiflightFare  = Math.ceil(this.multiflightFare );

    ////console.log( "surchargeAmount retunway" , this.surchargeAmount  );
  }



  ///else of trip type
}



/////multicity end



  }
}



interswitchSurcharge(){
////console.log('i am from interswitch surcharge');
  this.interSwitchServiceCharge =   sessionStorage.getItem("interSwitchServiceCharge");
  this.interSwitchsurchargeCap =   sessionStorage.getItem("interSwitchsurchargeCap");

  ////console.log('interSwitchServiceCharge>>>>>>>>',this.interSwitchServiceCharge);

  ////console.log('interSwitchsurchargeCap>>>>>>>>',this.interSwitchsurchargeCap);
  this.percentCal = this.interSwitchServiceCharge;
  

  if(this.typeofform == '236-Interswitch' && this.percentCal != 'undefined'){

   this.isuccfTxnValue =  sessionStorage.getItem('isuccfTxnValue');
  // //console.log('isuccfTxnValue',this.isuccfTxnValue);

  if (this.tripType == "oneway") {

  this.surchargeAmount2 = 0;

  ////console.log("selcted flight >>ISW", this.selectedflight);

  if (this.selectedflight.currencyRate > 0) {
    this.actualFareTktPcc =
      this.selectedflight.flightFare.actualTotalFare *
      this.selectedflight.currencyRate;
      ////console.log("actualFareTktPcc oneway curencyrate>0>>>>>>", this.actualFareTktPcc);

  } else {
    this.actualFareTktPcc =
      parseFloat(this.selectedflight.flightFare.totalBaseFare) +
      parseFloat(this.selectedflight.flightFare.totalTax) +
      parseFloat(
        this.selectedflight.flightFare.totalFee != undefined
          ? this.selectedflight.flightFare.totalFee
          : this.selectedflight.flightFare.totalFees
      );

     // //console.log("actualFareTktPcc oneway curencyrate<0>>>>>>", this.actualFareTktPcc);


  }


this.amount =
parseFloat(this.selectedflight.flightFare.markupPrice) +
parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
parseFloat(this.selectedflight.flightFare.discountPrice);
////console.log('amount oneway>>ISW>>',this.amount);


  // this.amount =
  //   parseFloat(this.selectedflight.flightFare.markupPrice) +
  //   parseFloat(this.selectedflight.flightFare.serviceChargePrice) +
  //   parseFloat(this.selectedflight.flightFare.discountPrice);

  //   //console.log('amount 3gpay manually cal',this.amount)

  if (this.amount > 0 &&  this.isuccfTxnValue == 'false') {
    this.amount = this.actualFareTktPcc + this.amount;
    ////console.log('amount is greater thn zero and uccftxn is false.--oneway>>>',this.amount,this.isuccfTxnValue);
  } else if (this.amount < 0) {
    // booking.uccfTxnCharge = 0;
    this.amount = this.actualFareTktPcc + this.amount;
    ////console.log('amount is less thn zero--oneway>>>',this.amount);

  } else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
    this.amount = this.actualFareTktPcc;
   // //console.log('amount is  zero and uccftxn is false.--oneway>>>',this.amount,this.isuccfTxnValue);

  }

   ////console.log("final amount & percentCal", this.amount, this.percentCal);

  this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

  ////console.log("this.surchargeAmount2  ISW >>final", this.surchargeAmount2);
 // this.surchargeAmount = this.surchargeAmount2;
this.newCharge = this.surchargeAmount2;
  //////FOR ISW ONE MORE CONDITION
  if(this.surchargeAmount2 > +this.interSwitchsurchargeCap){
    this.surchargeAmount2 =  +this.interSwitchsurchargeCap;
  //  //console.log('surchrge is greater then cap');
   // //console.log('surchrge is greater then cap then equl to cap',this.surchargeAmount2);
    this.surchargeAmount = this.surchargeAmount2;
    this.newCharge = this.surchargeAmount2;

    }

   // //console.log('final surchrhe is ,surchargeAmount,newCharge', this.newCharge)
  ///END


  
    let ocf:any =  this.surchargeAmount2;
    localStorage.setItem('surchargeAmount',ocf);
    ////console.log( "price on foooter before ocf" , this.displayfareoneway );

    this.displayfareoneway = this.onewayfareNoceil  + ocf ;
    this.displayfareoneway  = Math.ceil(this.displayfareoneway);

    
  
 



  ///else of trip type
}
if(this.tripType== 'returnway'){
///////////////////////surchrge for retunway start


  this.surchargeAmount2 = 0;


  if (this.selectedflightreturnway.currencyRate > 0) {
    this.actualFareTktPcc =
      this.selectedflightreturnway.actualTotalFare *
      this.selectedflightreturnway.currencyRate;
      ////console.log("surcharge from 3g pay --actualFareTktPcc retunway", this.actualFareTktPcc);

  } else {
    this.actualFareTktPcc =
      parseFloat(this.selectedflightreturnway.totalBaseFare) +
      parseFloat(this.selectedflightreturnway.totalTax) +
      parseFloat(
        this.selectedflightreturnway.totalFee != undefined
          ? this.selectedflightreturnway.totalFee
          : this.selectedflightreturnway.totalFees
      );

      ////console.log("surcharge from 3g pay --actualFareTktPcc retunway", this.actualFareTktPcc);

  }

  


this.amount =
parseFloat(this.selectedflightreturnway.markupPrice) +
parseFloat(this.selectedflightreturnway.serviceChargePrice) -
parseFloat(this.selectedflightreturnway.discountPrice);
////console.log('this.amount returnway',this.amount); 


  if (this.amount > 0 && this.isuccfTxnValue == 'false') {
    this.amount = this.actualFareTktPcc + this.amount;
    //  //console.log('amount is greater thn zero and uccftxn is false.--retunway>>>',this.amount,this.isuccfTxnValue);
  } else if (this.amount < 0) {
    // booking.uccfTxnCharge = 0;
    this.amount = this.actualFareTktPcc + this.amount;
   // //console.log('amount is less thn zero--retunr>>>',this.amount);

  } else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
    this.amount = this.actualFareTktPcc;
   // //console.log('amount is  zero and uccftxn is false.---return>>>',this.amount,this.isuccfTxnValue);
  }

  // //console.log("amount & percentCal for retunway isw", this.amount,this.percentCal);

  this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

  ////console.log("this.surchargeAmount2  isw >>final retunrway", this.surchargeAmount2);
  this.newCharge = this.surchargeAmount2;


   //////FOR ISW ONE MORE CONDITION
   if(this.surchargeAmount2 > +this.interSwitchsurchargeCap){
    this.surchargeAmount2 =  +this.interSwitchsurchargeCap;
    ////console.log('surchrge is greater then cap');
    ////console.log('surchrge is greater then cap then equl to cap',this.surchargeAmount2);
   
    this.newCharge = this.surchargeAmount2;

    }
    ////console.log('final surchrhe is ,surchargeAmount',  this.newCharge)


  ///END


  let ocf:any =  this.surchargeAmount2;
  localStorage.setItem('surchargeAmount',ocf);
  ////console.log( "price on foooter before ocf" , this.cpriceNoceil );

  this.cprice = this.cpriceNoceil + ocf ;
  this.cprice = Math.ceil(this.cprice);


}


////////////////////////multicity start

if (this.tripType == "multicity") {

  

this.surchargeAmount2 = 0;


////console.log("surcharge from isw --selectedflight multicity", this.selectedflight);

if (this.selectedflight.currencyRate > 0) {
  this.actualFareTktPcc =
    this.selectedflight.flightFare.actualTotalFare *
    this.selectedflight.currencyRate;
   // //console.log("actualFareTktPcc multicty curencyrate>0>>>>>>", this.actualFareTktPcc);

} else {
  this.actualFareTktPcc =
    parseFloat(this.selectedflight.flightFare.totalBaseFare) +
    parseFloat(this.selectedflight.flightFare.totalTax) +
    parseFloat(
      this.selectedflight.flightFare.totalFee != undefined
        ? this.selectedflight.flightFare.totalFee
        : this.selectedflight.flightFare.totalFees
    );

   // //console.log("actualFareTktPcc multicty curencyrate<0>>>>>>", this.actualFareTktPcc);


}




this.amount =
parseFloat(this.selectedflight.flightFare.markupPrice) +
parseFloat(this.selectedflight.flightFare.serviceChargePrice) -
parseFloat(this.selectedflight.flightFare.discountPrice);
////console.log('this.amount',this.amount);


// this.amount =
//   parseFloat(this.selectedflight.flightFare.markupPrice) +
//   parseFloat(this.selectedflight.flightFare.serviceChargePrice) +
//   parseFloat(this.selectedflight.flightFare.discountPrice);

//   //console.log('amount 3gpay manually cal',this.amount)

if (this.amount > 0 && this.isuccfTxnValue == 'false') {
  this.amount = this.actualFareTktPcc + this.amount;

    ////console.log('amount is greater thn zero and uccftxn is false.--multicity>>>',this.amount,this.isuccfTxnValue);
} else if (this.amount < 0) {
  // booking.uccfTxnCharge = 0;
  this.amount =  this.actualFareTktPcc + this.amount;
  ////console.log('amount is less thn zero--multicity>>>',this.amount);

} else if (this.amount == 0 && this.isuccfTxnValue == 'false') {
  this.amount = this.actualFareTktPcc;
  ////console.log('amount is  zero and uccftxn is false.--multicity>>>',this.amount,this.isuccfTxnValue);
}

 ////console.log("final amount & percentCal", this.amount, this.percentCal);

this.surchargeAmount2 = (this.amount * this.percentCal) / 100;

////console.log("this.surchargeAmount2  isw  >>final", this.surchargeAmount2);
this.newCharge = this.surchargeAmount2;


 //////FOR ISW ONE MORE CONDITION
 if(this.surchargeAmount2 > +this.interSwitchsurchargeCap){
  this.surchargeAmount2 =  +this.interSwitchsurchargeCap;
  ////console.log('surchrge is greater then cap');
  ////console.log('surchrge is greater then cap then equl to cap',this.surchargeAmount2);
  this.newCharge = this.surchargeAmount2;

  }
  ////console.log('final surchrhe is ,surchargeAmount',  this.newCharge)


///END




  let ocf:any =  this.surchargeAmount2;
  localStorage.setItem('surchargeAmount',ocf);
  ////console.log( "price on foooter before ocf" , this.multiflightFare  );

  this.multiflightFare = this.multiflightFareNoceil  + ocf ;
  this.multiflightFare  = Math.ceil(this.multiflightFare );

  ////console.log( "surchargeAmount retunway" , this.surchargeAmount);




///else of trip type
}



/////multicity end



}
}


  // loadingLoader: boolean = true;
  // allCountryList;
  // getAllCountryList() {
  //   this.authService
  //     .getData(environment.baseUrl + "/pwa/v1/country/getAllCountry")
  //     .subscribe(
  //       (res) => {
  //         this.allCountryList = res["countryList"];
  //         // //console.log("all country", this.allCountryList);
  //         this.loadingLoader = false;
  //         this.myloading = false;
  //       },
  //       (err) => {
  //         //console.log(err);
  //       }
  //     );
  // }
  countryValue;
  onSelectCountry(value, item) {
    if (item.source.selected) {
      this.countryValue = value;
      //this.getAllStateList(value);
    }
  }

cardlistVar:boolean = false;
  findCard() {
    this.loginemail = sessionStorage.getItem("loginemail");
    this.profileControllerService
      .getAllProfile(this.loginemail)
      .subscribe((res) => {
   
      this.cardlist = res["userDetails"] && res["userDetails"]["paymentMethod"];
      this.totalCardLength = this.cardlist && this.cardlist.length;
        this.cardlistVar = true;
/////////////////////////////////////////////////
this.cardlist.map(res=>{
  res['finalDate'] = moment(res['expireDate'], "YYYY-MM-DD").format("YYYY-MM");
  const fourdigit = res['originalCardNumber'].slice(-4);
  res['maskedNumber'] = fourdigit.padStart( res['originalCardNumber'].length,'*');
      });

      this.cardlist = this.cardlist.filter(res =>{
        return moment(res['finalDate']).format('YYYY-MM') >= moment(this.todayDateiss).format('YYYY-MM');
      });

//////////////////////////
       this.profileControllerService.clearAllProfiletCache();
      });
  }
  chkouttoglebutton:boolean = false;

  checkedToggle = false;
  savecyberform(form: NgForm) {
    this.checkedToggle = true;

    this.chkouttoglebutton = !this.chkouttoglebutton;
    if(this.chkouttoglebutton && 
      this.paymentform.controls.newcardnumber.valid 
      && this.paymentform.controls.cardname.valid 
      && this.paymentform.controls.expYear.valid 
      && this.paymentform.controls.cvvNumber.valid
      ){
        ////console.log('togling codn-cyber')

      

    this.cardvaluefilled = this.paymentform.value;
    this.cardnumber = this.cardvaluefilled.newcardnumber;
    this.cardname = this.cardvaluefilled.cardname;
    let expYears = this.cardvaluefilled.expYear;
    let splitexpYears = expYears.split("/");
    this.expYear = splitexpYears[1];
    // this.expMonth = this.cardvaluefilled.expMonth;
    this.expMonth = splitexpYears[0];
    this.cvvNumber = this.cardvaluefilled.cvvNumber;

    

  
    this.detectCardType(this.cardnumber);

    if (this.isValidcard) {
      ////console.log('cards length is',this.totalCardLength)
////addcrdlength start
if(this.totalCardLength>=5){
  let snackBarRef1 = this.snackBar.open("User can add maximum 5 cards.", "", {
    duration: 1500
  });
}else{
  this.presentLoading();
      const data = {
        cardNumber: this.cardnumber,
        cardOption: 0,
        cardType: this.cardid,
        expireDate: moment(this.cardvaluefilled.expYear, "MM/YY").format(
          "YYYY-MM-DD"
        ),
        isDefaultPayment: 0,
        nameOnCard: this.cardname,
        userAlias: this.loginemail,
      };
    //  //console.log("req body is", data);

      this.profileControllerService.addcard(data).subscribe((res) => {
      //  //console.log(res);
        this.checkedTogglenew = false;

        if (res["statusMessage"] == "success") {
         // this.cardlist = res["user"]["paymentMethod"];
         // //console.log('these are total card',this.cardlist)
          //this.totalCardLength = this.cardlist.length;
          this.findCard();
          this.closeLoading();
          // swal.fire("Card Saved Successfully", 'Good Job', 'success');
          this.profileControllerService.clearAllProfiletCache();
         
          let snackBarRef1 = this.snackBar.open("Card saved successfully", "", {
            duration:  1500
          });

          // this.bottomSheet.dismiss();
        } else {
          this.closeLoading();
         
          let snackBarRef1 = this.snackBar.open("Some Technical Error!", "", {
            duration:  1500
          });

          // this.bottomSheet.dismiss();
        }
      });

    }////addcard length end


    

    } else {
      this.checkedTogglenew = false;

     
      let snackBarRef1 = this.snackBar.open("Please try after some time!", "", {
        duration: 1500
      });
    }


  }else{
   // //console.log('untogling codn-cyber')
    if(this.chkouttoglebutton){
      let snackBarRef1 = this.snackBar.open("Please fill all fields correctly to save the card!", "", {
        duration: 1500
      }); 
  
    }else{
      
    }
    
  }


  }




  checked : boolean = false;

 
  add(val){
    this.checked = !this.checked;


  }

  addCardValidation(){
    this.cardvaluefilled = this.paymentform.value;
    let expYears = this.cardvaluefilled.expYear;
   // //console.log(expYears);
    let splitexpYears  = expYears.split('/')
    let expYear = splitexpYears[1]
    // this.expMonth = this.cardvaluefilled.expMonth;
    let expMonth = splitexpYears[0];
    ////console.log(expMonth + "" +expYear);
    var d = new Date();
    var n = d.getMonth();
    var y = d.getFullYear();  
   //  //console.log(n+1);
   //  //console.log(y);
    if(y < expYear)
    {
      this.flagdate = false;
     // //console.log("year");
    }
    else if(y >= expYear)
    {
      //console.log(y >= expYear);
      if(n+1 >= expMonth)
      {
        this.flagdate = true;
        return;
      }     
      else
        this.flagdate = false;    
       // //console.log(this.flagdate);
    }
    
    }



chkouttoglebtn:boolean = false;
  checkedTogglenew = false;
  savechekoutform(form: NgForm) {

 
    this.chkouttoglebtn = !this.chkouttoglebtn;



    if(this.chkouttoglebtn && 
      this.paymentformcheckout.controls.newcardnumber.valid 
      && this.paymentformcheckout.controls.cardname.valid 
      && this.paymentformcheckout.controls.expYear.valid 
      && this.paymentformcheckout.controls.cvvNumber.valid
      ){

  
    this.cardvaluefilled = this.paymentformcheckout.value;
    this.cardnumber = this.cardvaluefilled.newcardnumber;
    this.cardname = this.cardvaluefilled.cardname;
    let expYears = this.cardvaluefilled.expYear;
    let splitexpYears = expYears.split("/");
    this.expYear = splitexpYears[1];
    // this.expMonth = this.cardvaluefilled.expMonth;
    this.expMonth = splitexpYears[0];
    this.cvvNumber = this.cardvaluefilled.cvvNumber;

   

  
    this.detectCardType(this.cardnumber);

    ////addcrdlength start
if(this.totalCardLength>=5){
  let snackBarRef1 = this.snackBar.open("User can add maximum 5 cards.", "", {
    duration: 1500
  });
}else{



    if (this.isValidcard) {


      this.presentLoading();
      const data = {
        cardNumber: this.cardnumber,
        cardOption: 0,
        cardType: this.cardid,
        expireDate: moment(this.cardvaluefilled.expYear, "MM/YY").format(
          "YYYY-MM-DD"
        ),
        isDefaultPayment: 0,
        nameOnCard: this.cardname,
        userAlias: this.loginemail,
      };

      this.profileControllerService.addcard(data).subscribe((res) => {
        this.checkedTogglenew = false;

        if (res["statusMessage"] == "success") {
          this.findCard();
          this.closeLoading();
         
          let snackBarRef1 = this.snackBar.open("Card Saved Successfully.", "", {
            duration: 1500
          });
          // this.bottomSheet.dismiss();
        } else {
          this.closeLoading();
          let snackBarRef1 = this.snackBar.open("Please try after some time.", "", {
            duration: 1500
          });
  
        }
      });
    } else {
      this.checkedTogglenew = false;
      let snackBarRef1 = this.snackBar.open("Please try after some time.", "", {
        duration: 1500
      });
      
    }
  }

  }else{

    if(this.chkouttoglebtn ){
      let snackBarRef1 = this.snackBar.open("Please fill all fields correctly to save the card!", "", {
        duration: 1500
      }); 
  
    }else{
      
    }
    
    
  

    

    }
  }
  flagdate: boolean = false;

  val() {
    this.cardvaluefilled = this.paymentformcheckout.value;
    this.cardnumber = this.cardvaluefilled.newcardnumber;
    this.cardname = this.cardvaluefilled.cardname;
    let expYears = this.cardvaluefilled.expYear;

    // let expYears = this.addcard.controls['date'].value;
    ////console.log(expYears);
    let splitexpYears = expYears.split("/");
    let expYear = splitexpYears[1];
    // this.expMonth = this.cardvaluefilled.expMonth;
    let expMonth = splitexpYears[0];
    ////console.log(expMonth + "" + expYear);
    var d = new Date();
    var n = d.getMonth();
    var y = d.getFullYear();
    // //console.log(n + 1);
    // //console.log(y);
    if (y < expYear) {
      this.flagdate = false;
     // //console.log("year");
    } else if (y >= expYear) {
     // //console.log(y >= expYear);
      if (n + 1 >= expMonth) {
        this.flagdate = true;
        return;
      } else this.flagdate = false;
     // //console.log(this.flagdate);
    }
  }
   get25yearsNext:any;
  invaliddateformat:boolean =false;
  isCardExpired:boolean
  isCardExpiredchkout:boolean = false

  invaliddatechkout:boolean = false
dateValidate(entereddate){
  ////console.log('entered date',entereddate)
   this.get25yearsNext = moment(this.todayDate, "MM/YYYY").add(12, "y").format("MM/YYYY");
  ////console.log('get25yearsNext',this.get25yearsNext)

  let  get25yearsNext_Split = this.get25yearsNext.split("/");
    let get25yearsNextMonth:any = get25yearsNext_Split[0];
    let get25yearsNextYear:any = get25yearsNext_Split[1];

 

 if(this.typeofform == '2-Cyber Source'){
  let entereddateee =  this.paymentform.controls['expYear'].value;
  ////console.log('length >cybr',entereddateee.length)
  this.lengthfinal =  entereddateee.length;
 }
 
 if(this.typeofform == '235-Checkout'){
  let entereddateee =  this.paymentformcheckout.controls['expYear'].value;
  ////console.log('length >chkout',entereddateee.length)
  this.lengthfinal  =  entereddateee.length;
 }

 if(entereddate !=''){
 // //console.log('filled')

 if(this.lengthfinal>4){

 

 let convertdate = moment(entereddate,'MM/YY').format('MM/YYYY');

 let entereddateSplit = convertdate.split("/");
 let entereddateMonth:any = entereddateSplit[0];
 let entereddateYear:any = entereddateSplit[1];

    let todayDateSplit = this.todayDate.split("/");
    let todayDateMonth:any = todayDateSplit[0];
    let todayDateYear:any = todayDateSplit[1];

  if(+new Date(entereddateYear, entereddateMonth) >= +new Date(todayDateYear, todayDateMonth) && +new Date(entereddateYear, entereddateMonth) <= +new Date(get25yearsNextYear, 12)){
  this.isCardExpired = false;
}else{
  


  if(this.typeofform == '2-Cyber Source'){
    this.isCardExpired = true;
    this.paymentform.controls['expYear'].setErrors({ 'incorrect': true});
    this.paymentform.controls['expYear'].markAsTouched();
   ////console.log("INvalid date >>cybersource");
  }if(this.typeofform == '235-Checkout'){
    this.isCardExpiredchkout = true;
    this.paymentformcheckout.controls['expYear'].setErrors({ 'incorrect': true});
    this.paymentformcheckout.controls['expYear'].markAsTouched();
   // //console.log("INvalid date >>chkout");
  }

}
}else{
  

  
  if(this.typeofform == '2-Cyber Source'){
    this.invaliddateformat = true;
    this.paymentform.controls['expYear'].setErrors({ 'incorrect': true});
    this.paymentform.controls['expYear'].markAsTouched();
    ////console.log("Please eneter a valid date>>cybersource");
  }if(this.typeofform == '235-Checkout'){
    this.invaliddatechkout = true;
    this.paymentformcheckout.controls['expYear'].setErrors({ 'incorrect': true});
    this.paymentformcheckout.controls['expYear'].markAsTouched();
    ////console.log("Please eneter a valid date >>chkout");
  }


}
 ////console.log('is enterd date big',entereddate);
}else{
  ////console.log('empty')

 }
}



trackByFn(index: number, card: any) {
  return index;//card.cardType;
}


flightPopUp(res){
  let fareStatus = res['fareStatus']
  let errorListLength = res['errorList'] && res['errorList'].length;
  // if(fareStatus==null || errorListLength>0){

  // }
  if((fareStatus==null && errorListLength>0) && (errorListLength !=undefined)){
   // //console.log('errorListLength',errorListLength);
  
  ///////
  
  Swal.fire({
  allowOutsideClick: false,
  title: 'Sorry, This flight is no more available for booking!',
  text: "Please select another flight.",
  icon: 'error',
  customClass : {
  container:"swalForBack"
  },
  confirmButtonColor: "#FECE24",
  confirmButtonText: 'OK'
  }).then((result) => {
  ////console.log(result.value == true);
  if (result.value == true) {
    this.redirecTo();
 // this.router.navigate([this.searchPageURL]);
  ////console.log('clicked ok');
  
  }
  });
  
  
    return;
  }else{
    ////console.log('i m from else');
  
  }
}








openTC(){
   window.open(this.tncurl, "_blank");

}

  sessisionTimeOut(): boolean {
    let isTimerCookie: any = this.cookieService.check("timerStart");
    //let isTimerCookie: any = true;
    //let isTimerCookie: any = this.cookieService.check("timerStart");

    ////console.log("is cookie", isTimerCookie);
    return isTimerCookie;
  }


  editflight() {
    let isAffBooking = sessionStorage.getItem('isAffBooking');
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';

    if(isAffBooking =='true'){
      let setLanguageSetting = 'en';
      //let defaultcountryCode = sessionStorage.getItem('defaultcountryCode').toLowerCase();
      let countryCode = localStorage.getItem('currentCountryName').toLowerCase();
    let SettingCountryCodeUppercase = localStorage.getItem('SettingCountryCode');
    let SettingCountryCode = SettingCountryCodeUppercase && SettingCountryCodeUppercase.toLowerCase();
    
    if(countryCode == SettingCountryCode &&  SettingCountryCode){
      this.router.navigate([countryCode + "/" + setLanguageSetting]);
      //('current country,and setting country are same or no setting counrty')
    
    }else{
      this.router.navigate([SettingCountryCode + "/" + setLanguageSetting]);
    ////console.log('current country,and setting country not same')
    }
      sessionStorage.removeItem('booking-type');
      sessionStorage.removeItem('isAffBooking');
     // this.isAffBooking = sessionStorage.getItem('isAffBooking');
    
    }else{
      //this.router.navigate([countryCode + "/" + setLanguageSetting]);
      this.router.navigate([countryCode + "/" + setLanguageSetting + '/search-flights']);
    }

   

  }

  redirecTo(){
    let isAffBooking = sessionStorage.getItem('isAffBooking');

    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';

    if(isAffBooking =='true'){

      let currentCountryName = localStorage.getItem('currentCountryName')
      let selectedCountryCode = localStorage.getItem('selectedCountryCode');
    
    if(selectedCountryCode){
      let x = selectedCountryCode.toLowerCase();
      let a = x + '/' + setLanguageSetting;
      window.location.replace(a);
     // this.router.navigate([x + "/" + setLanguageSetting]);
    
    }else{
      let y = currentCountryName.toLowerCase();

      let b = y + '/' + setLanguageSetting;
      window.location.replace(b);
           // this.router.navigate([y + "/" + setLanguageSetting]);

    
    }
    
      sessionStorage.removeItem('booking-type');
      sessionStorage.removeItem('isAffBooking');
    ////console.log('seat popup clicked aff case');
    } else{
      this.router.navigate([this.searchPageURL]);
    
    }
    
  }

  


  validateBooking(){
   let data = {     
        "countryId": this.countryId,
        "groupId": this.groupId,
        "productType": 0,
        "serviceVendor": this.serviceVendor
      }
    
this.flightService.validateBoking(data).subscribe((res)=>{
////console.log('validatebooking>>is live credentilal---',res);
if(res){
  
  if(res['bookingFlag'] == false){


/////popup --start
let setLanguageSetting = 'en';
//let ccd = 'in'
this.backurl = this.ccd  + "/" + setLanguageSetting

const swalWithBootstrapButtons = Swal.mixin({
customClass : {
  container:"swalForCOD"
  },

})

swalWithBootstrapButtons.fire({
allowOutsideClick: false,
customClass : {
  container:"swalForBack"
  },
title: 'This is a live booking.',
text: "Are you sure you want to continue?",
icon: 'warning',
showCancelButton: true,
cancelButtonText: 'Cancel',
confirmButtonText: 'OK',
reverseButtons: false
}).then((result) => {
if (result.value == true) {
     
  if (this.serviceVendor == "Amadeus") {
   // //console.log("service vendor is for checkSeat" + this.serviceVendor);
    this.checkSeat();
  }
//localStorage.removeItem('bookingURL');
////console.log('closedd');

  
} else if (
  result.dismiss === Swal.DismissReason.cancel
) {
 // window.location.replace(this.backurl);

  this.router.navigate([this.backurl]);


}
})



///popup --end

  }else{
    if (this.serviceVendor == "Amadeus") {
     // //console.log("service vendor is for checkSeat" + this.serviceVendor);
      this.checkSeat();
    }
  }

}
})

  }
}

