import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  NgForm,
} from "@angular/forms";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import * as moment from "moment";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { AuthService } from "angularx-social-login";
import { AuthServices } from "src/app/services/auth.service";
import { environment } from "src/environments/environment";
import { FlightService } from "src/app/services/flight.service";
import { MatSnackBar, MatBottomSheet, MatExpansionPanel, MatDialog, MatDialogRef } from "@angular/material";
import { Location } from "@angular/common";
import { Subscription } from "rxjs";
import { IonicSelectableComponent } from "ionic-selectable";
import * as country from "../../../../constants/new-countries.constant";
import { NgxSpinnerService } from "ngx-spinner";
import { createAutoCorrectedDatePipe } from "src/app/pipe/shared/autoDatePipe";
import { NationalityComponent } from "src/app/nationality/nationality.component";
import { LoadingController } from "@ionic/angular";
import { OverlayService } from 'src/app/services/overlay.service';
import { CropperModalComponent } from 'src/app/modules/flight-profile-module/cropper-modal/cropper-modal.component';

@Component({
  selector: "app-add-traveller",
  templateUrl: "./add-traveller.component.html",
  styleUrls: ["./add-traveller.component.scss"],
})
export class AddTravellerComponent implements OnInit {
  userdetail: any;
  public imagePath;
  imgURL: any;
  public message: string;
  public travellerForm: FormGroup;
  selected = "+91";
  todayDate = moment().format("MM/DD/YYYY");
  getCountryID;
  countryValue: any;
  stateValue: any;
  loginemail: string;
  allairline: Object;
  currentCountry;
  getvalu;

  char_limit_3_20 = ' should have minimum 3 and maximum 20 characters.'
  phn_limit_7_11 = 'should have minimum 7 and maximum 11 digit.';

  Char_max_length_20 = ' should have maximum 20 characters.'

  titleSame = 'title is already exist';
  firstNameSame = 'first name is already exist';
  lastNameSame = 'last name is already exist';
  showWrningSameTraveller = false;
  fileNameDialogRef: MatDialogRef<CropperModalComponent>;

  constructor(
    private router: Router,
    private FB: FormBuilder,
    private profileControllerService: ProfileControllerService,
    private authService: AuthServices,
    private flightService: FlightService,
    private snackBar: MatSnackBar,
    private location: Location,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    public loadingController: LoadingController,
    private overlayService: OverlayService,
    public dialog: MatDialog

  ) { }
  copyAllCOuntry = country.countries;
  ngOnInit() {
    this.loginemail = localStorage.getItem("loginemail");
    this.currentCountry = localStorage.getItem("countryCode");
    this.createTravellerForm();
    this.getAllNewCountry();

    this.getAllAirline();
    this.getTravellerDetailsUrl();

    this.getWarning();
    this.travellerForm.valueChanges.subscribe((res) => {
      this.removeDuplicateValidation();
    })

    this.travellerForm
      .get("passportExpireDate")
      .valueChanges.subscribe((res) => {
        if (res && res["length"] == 10) {
          this.getPassportWarning(res);
        } else {
          this.iswarning = false;
        }
      });

    this.dateMaskOptions = {
      mask: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
      pipe: createAutoCorrectedDatePipe(
        "dd mm",
        this.maxDateOptions,
        this.minDateOptions
      ),
      placeholder: "DD/MM/YYYY",
      pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      keepCharPositions: true,
      guide: false,
    };
  }
  ngOnDestroy(): void {
    this.subscribtionTravellerDetails.unsubscribe();
  }

  createTravellerForm() {
    this.getWarning();
    this.travellerForm = this.FB.group({
      title: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Title is required.'
          })],
        }),
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
              message: "Only alphabets are allowed.",
            }),
            //RxwebValidators.maxLength({value:20, message:''}),
          ],
        }),
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
              message: "Only alphabets are allowed.",
            }),
            //RxwebValidators.maxLength({value:20, message:''}),
          ],
        }),
      ],
      // /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/
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
      dob: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required({
              message:'Date of birth is required.'
            }),
            RxwebValidators.pattern({
              expression: { pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
              message: "Please enter valid date",
            }),
            RxwebValidators.maxDate({
              value: this.todayDate,
              message: `Please enter valid date`,
            }),
            RxwebValidators.minDate({
              value: this.get_100_Back_years,
              message: `Traveller age can't be more than 100 years`,
            }),
          ],
        }),
      ],
      mbNo: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Mobile number is required.'
          }), RxwebValidators.numeric(),  RxwebValidators.maxLength({value:11, message:''}),],
        }),
      ],
      // RxwebValidators.pattern({
      //   expression: { pattern: /^[a-zA-Z0-9\s,'-./]*$/ },
      //   message: "Please enter valid address",
      // }),
      address: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.maxLength({value:250, message:''})],
        }),
      ],
      pincode: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.numeric(),  RxwebValidators.maxLength({value:8, message:''})]
         
        }),
      ],
      city: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed.",
            }),
            RxwebValidators.maxLength({value:25, message:''})
          ],
        }),
      ],
      country: [
        "",
        RxwebValidators.compose({
          validators: [],
        }),
      ],

      state: [
        "",
        RxwebValidators.compose({
          validators: [],
        }),
      ],
      dialcode: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'ISD code is required.'
          })],
        }),
      ],
      passportFirstName: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed.",
            }),
          ],
        }),
      ],
      passportMiddleName: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed.",
            }),
          ],
        }),
      ],
      passportLastName: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed.",
            }),
          ],
        }),
      ],
      userNationalityPassport: [""],
      passportIssuedCountry: [""],
      passportNo: ["",
        RxwebValidators.compose({
          validators: [RxwebValidators.alphaNumeric(),
            RxwebValidators.maxLength({value:9, message:''})],
        }),],
      passportExpireDate: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.pattern({
              expression: { pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
              message: "Please enter valid date",
            }),
            RxwebValidators.minDate({
              value: this.todayDate,
              message: `Passport is expired`,
            }),
          ],
        }),
      ],
      passportImage: [""],

      preferedAirlines: this.FB.array([this.initTechnologyFields()]),
      visaInfo: this.FB.array([this.initvisaInfoFields()]),
      imageName: [""],
    });
  }

  getAllAirline() {
    this.flightService.getAllAirline().subscribe((res) => {
      this.allairline = res;
    });
  }


  previousUrlTravellerDetails;
  subscribtionTravellerDetails: Subscription;
  getTravellerDetailsUrl() {
    this.subscribtionTravellerDetails = this.profileControllerService.getCurrentURL.subscribe(
      (res) => {
        this.previousUrlTravellerDetails = res;
      }
    );
  }

  goBack() {
    if (this.previousUrlTravellerDetails) {
      this.router.navigate([this.previousUrlTravellerDetails]);
    } else {
      this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
    }
    // this.location.back();
  }

  initTechnologyFields(): FormGroup {
    return this.FB.group({
      airline: [""],
      frequentFlyerNumber: ["", RxwebValidators.compose({
        validators: [RxwebValidators.alphaNumeric(), RxwebValidators.maxLength({value:20, message:''})],
      }),],
    });
  }
  addPrefered() {
    if (this.travellerForm.controls.preferedAirlines) {
      const control = <FormArray>this.travellerForm.controls.preferedAirlines;
      control.push(this.initTechnologyFields());
    }
  }

  remove(i: number): void {
    const control = <FormArray>this.travellerForm.controls.preferedAirlines;
    control.removeAt(i);
  }

  initvisaInfoFields(): FormGroup {
    return this.FB.group({
      visaCountry: [""],
      visaNumber: ["", RxwebValidators.compose({
        validators: [RxwebValidators.alphaNumeric(), RxwebValidators.maxLength({value:20, message:''})],
      }),],
      visaExpiry: [
        "",
        RxwebValidators.compose({
          validators: [

            RxwebValidators.pattern({
              expression: { pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
              message: "Please enter valid date",
            }),
            RxwebValidators.minDate({
              value: this.todayDate,
              message: `Visa is expired`,
            }),
          ],
        }),
      ],
      visaTYpe: ["", RxwebValidators.compose({
        validators: [RxwebValidators.pattern({
          expression: { alpha: /^[a-zA-Z ]*$/ },
          message: "Only alphabets are allowed.",
        }), RxwebValidators.maxLength({value:20, message:''})],
      }),],
      uploadDocumentDetails: [""],
      visaDoucmentName: [""],
      visaIssuedNationality: [""],
    });
  }
  addvisaInfo() {
    const control = <FormArray>this.travellerForm.controls.visaInfo;
    control.push(this.initvisaInfoFields());
  }

  removeVisaInfo(j: number): void {
    const control = <FormArray>this.travellerForm.controls.visaInfo;
    control.removeAt(j);
  }
  matcher = new MyErrorStateMatcher();

  get airline(): FormArray {
    return this.travellerForm.get("preferedAirlines") as FormArray;
  }

  setPreset() {
    this.airline.patchValue(["LA", "MTV"]);
  }

  allVisaList = [];
  getVisaIfno() {
    this.allVisaList = [];
    this.travellerForm.value["visaInfo"].forEach((element) => {
      this.allVisaList.push({
        visNo: element["visaNumber"],
        visaExpiryDate:
          element["visaExpiry"] != ""
            ? moment(element["visaExpiry"], "DD/MM/YYYY").format("YYYY-MM-DD")
            : "",
        visaIssuedCountry: element["visaCountry"],
        visaType: element["visaTYpe"],
      });
    });
  }

  // private markFormGroupTouched(form: FormGroup) {
  //   Object.values(form.controls).forEach(control => {
  //     control.markAsTouched();
  //     this.markFormGroupTouched(control as FormGroup);
  //   });
  // }

  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  
  //ImageUpload
  Imageclick() {
    this.fileNameDialogRef = this.dialog.open(CropperModalComponent, {
      panelClass: "cropperModal",
      backdropClass: "alert-password-back-drop",
      width: "100%",
      maxWidth: "95vw",
    });

    this.fileNameDialogRef.afterClosed().subscribe((name) => {
      console.log(name);
      this.preview(name);
    });
  }

  flagForImage: any = false;
  uploadImage = false;
  preview(files) {
    console.log(files.data.length)
    if(files.data.length > 0)
    {
      this.imgURL = files.data;
      console.log(this.imgURL);
      this.uploadImage = true;
    }
    else
     return;  
  }



  //flagForImage: any = false;
  // preview(files) {
  //   if (files.length === 0) return;

  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }
  //   var finalImageSize = Math.round(files[0].size / 1024);
  //   if (finalImageSize > 2048) {
  //     this.flagForImage = true;
  //     setTimeout(() => {
  //       this.flagForImage = false;
  //     }, 3000);
  //     return;
  //   }
  //   this.flagForImage = false;
  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]);
  //   reader.onload = (_event) => {
  //     this.imgURL = reader.result;
  //   };
  // }






  passportImageMessage = false;
  passportImageURL;
  imageName;
  onPassportUploadDocuments(files: FileList) {
    console.log(files[0].name);
    if (files.length === 0) return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.passportImageMessage = true;
      return;
    } else {
      this.passportImageMessage = false;
      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.passportImageURL = reader.result;
        this.travellerForm.patchValue({
          passportImage: this.passportImageURL,
          imageName: files[0].name,
        });
      };
    }
  }

  visDocuemnetsType(files, visaGroup: FormGroup, index) {
    if (files.length === 0) return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        visaGroup["controls"][index].patchValue({
          visaDoucmentName: files[0].name,
          uploadDocumentDetails: reader.result,
        });
      };
    }
  }

  allCountry;
  allCountryList: any;
  newCountryList = [];
  getAllNewCountry() {
    this.allCountryList = country.countries;
    this.allCountryList.forEach((element) => {
      this.newCountryList.push({
        countryCode: element["countryCode"],
        countryId: element["countryId"],
        countryName: element["countryName"],
        phoneCode: element["phoneCode"],
      });
    });
    this.allCountry = this.newCountryList;
    this.selectCountry();
  }

  selectCountry() {
    const toSelect = this.newCountryList.find(
      (c) => c.countryCode == this.currentCountry
    );
    this.travellerForm.get("dialcode").setValue(toSelect["phoneCode"]);
  }

  getAllStateList(countryID) {
    this.authService
      .getData(
        environment.baseUrl +
        "/pwa/v1/state/getAllStatesByCountryId/" +
        countryID
      )
      .subscribe(
        (res) => {
          if (res["stateList"].length != 0) {
            this.modifiedStateList = [];
            this.allStateList = res["stateList"];
            this.allStateList.forEach((element) => {
              this.modifiedStateList.push({
                countryId: element["stateId"],
                countryName: element["stateName"],
              });
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  modelValue;
  formControlName;
  allStateList;
  modifiedStateList = [];
  showErrorIfStateSelect = false;
  onSelectCountry(formfield, selectedvalue) {
    let selectedCurrentValue;

    if (formfield != undefined) {
      if (formfield == "country" && selectedvalue) {
        this.showErrorIfStateSelect = false;
        const selectedCountry = this.newCountryList.find(
          (c) => c.countryId == selectedvalue
        );
        selectedCurrentValue = selectedCountry["phoneCode"];
      } else if (formfield == "state" && selectedvalue) {
        this.showErrorIfStateSelect = false;
        const selectedCountry = this.modifiedStateList.find(
          (c) => c.countryId == selectedvalue
        );
        selectedCurrentValue = selectedCountry["countryName"];
      } else if (
        formfield == "state" &&
        (this.travellerForm.get("country").value == "" ||
          this.travellerForm.get("country").value == null)
      ) {
        this.showErrorIfStateSelect = true;
        return;
      } else if (formfield == "state" && this.modifiedStateList.length == 0) {
        return;
      }
    }
    let sendCurrentData = {
      formfield: formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList:
        formfield == "country" ? this.newCountryList : this.modifiedStateList,
    };
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      if (res != undefined) {
        if (res["currentFieldSelected"] == "country") {
          this.modifiedStateList = [];
          this.travellerForm.get("state").setValue("");
          this.travellerForm
            .get("country")
            .setValue(res["currentCountrySelected"]["countryId"]);
          this.getAllStateList(this.travellerForm.get("country").value);
        } else {
          this.travellerForm
            .get("state")
            .setValue(res["currentCountrySelected"]["countryId"]);
          this.showErrorIfStateSelect = false;
        }
      }
    });
  }

  onOpenNationalityPassport(formfield, selectedvalue) {
    let selectedCurrentValue;
    if (formfield != undefined) {
      if (formfield == "nationality" && selectedvalue) {
        this.showErrorIfStateSelect = false;
        const selectedCountry = this.newCountryList.find(
          (c) => c.countryId == selectedvalue
        );
        selectedCurrentValue = selectedCountry["phoneCode"];
      }
    }
    let sendCurrentData = {
      formfield: formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList: this.newCountryList,
    };
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      console.log(res);
      if (res != undefined) {
        if (res["currentFieldSelected"] == "nationality") {
          this.travellerForm
            .get("passportIssuedCountry")
            .setValue(res["currentCountrySelected"]["countryId"]);
        }
      }
    });
  }

  onOpenNationalityVisa(formfield, selectedvalue, visaIndex) {
    let selectedCurrentValue;

    if (formfield != undefined) {
      if (formfield == "nationality" && selectedvalue) {
        const selectedCountry = this.newCountryList.find(
          (c) => c.countryId == selectedvalue["visaCountry"]
        );
        console.log(selectedCountry);
        selectedCurrentValue =
          selectedCountry != undefined ? selectedCountry["phoneCode"] : "";
      }
    }
    let sendCurrentData = {
      formfield: formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList: this.newCountryList,
    };
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      console.log(res);
      if (res != undefined) {
        if (res["currentFieldSelected"] == "nationality") {
          let visaFormGroup = this.travellerForm.get("visaInfo") as FormArray;
          visaFormGroup.controls[visaIndex].patchValue({
            visaCountry: res["currentCountrySelected"]["countryId"],
          });
        }
      }
    });
  }

  onchangeOfIsdCode(formfield, selectedvalue) {
    let selectedCurrentValue;
    console.log(selectedvalue);
    if (formfield != undefined) {
      if (
        formfield == "isdCode" &&
        (selectedvalue != "" || selectedvalue != null)
      ) {
        selectedCurrentValue = selectedvalue;
      }
    }
    let sendCurrentData = {
      formfield: formfield,
      selectedCurrentValue: selectedCurrentValue,
      currentCountryList: this.newCountryList,
    };
    this.bottomSheet.open(NationalityComponent, {
      data: sendCurrentData,
      panelClass: "countryList",
    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((res) => {
      console.log(res);
      if (res != undefined) {
        if (res["currentFieldSelected"] == "isdCode") {
          this.travellerForm
            .get("dialcode")
            .setValue(res["currentCountrySelected"]["phoneCode"]);
        }
      }
    });
  }

  addtravller() {
    console.log(this.travellerForm);
    let titleLength = 0;
    if(Number(this.travellerForm.get("title").value) == 0 || Number(this.travellerForm.get("title").value) == 1)
       titleLength = 3;
    else if(Number(this.travellerForm.get("title").value) == 2 || Number(this.travellerForm.get("title").value) == 3)   
       titleLength = 4;
    else if(Number(this.travellerForm.get("title").value) == 4)
       titleLength = 6;
    if(this.travellerForm.valid && (this.travellerForm.get("firstName").value.length + this.travellerForm.get("lastName").value.length +  titleLength> 40))
    {
      console.log("Total length of first name,Last name , title:-", this.travellerForm.get("firstName").value.length + this.travellerForm.get("lastName").value.length +  titleLength);
      return;
    } 
    if (this.travellerForm.invalid) {
      this.markFormGroupTouched(this.travellerForm);
      // let formControl:any;
      // for ( formControl in this.travellerForm.controls) {
      //   if(this.travellerForm.controls[formControl].invalid){
      //     this.travellerForm.controls[formControl].markAsDirty();
      //     break;
      //   }
      // }
    } else {
      this.presentLoading();
      // this.spinner.show();
      let address = this.travellerForm.get("address").value;
      let city = this.travellerForm.get("city").value;
      let email = this.travellerForm.get("email").value;
      let firstName = this.travellerForm.get("firstName").value.trim();
      let lastName = this.travellerForm.get("lastName").value.trim();
      let title = Number(this.travellerForm.get("title").value);
      let code = this.travellerForm.get("dialcode").value;
      let dob = this.travellerForm.get("dob").value;
      let mobileNo = this.travellerForm.get("mbNo").value;
      let pincode = this.travellerForm.get("pincode").value;

      let passportFirstName = this.travellerForm.get("passportFirstName").value;
      let passportMiddleName = this.travellerForm.get("passportMiddleName")
        .value;
      let passportLastName = this.travellerForm.get("passportLastName").value;
      let passportIssuedCountry = this.travellerForm.get(
        "passportIssuedCountry"
      ).value;
      let passportNo = this.travellerForm.get("passportNo").value;
      let passportExpireDate = this.travellerForm.get("passportExpireDate")
        .value;
      let passportImage = this.travellerForm.get("passportImage").value;
      let nationality = this.travellerForm.get("userNationalityPassport").value;
      let country = this.travellerForm.get("country").value;
      let state = this.travellerForm.get("state").value;
      this.getVisaIfno();

      var newbody = {
        address: address,
        city: city,
        country: country,
        dob: moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
        email: email,
        firstName: firstName,
        frequentFlyerList: this.airline.value,
        imageFilePath: this.imgURL ? this.imgURL : null,
        profileImagePath: "",
        isPrimaryTraveller: 0,
        isdCode: code,
        lastName: lastName,
        mobileNo: mobileNo,
        nationality: passportIssuedCountry,
        passportExpireDate:
          passportExpireDate != ""
            ? moment(passportExpireDate, "DD/MM/YYYY").format("YYYY-MM-DD")
            : "",
        passportNo: passportNo,
        passportIssuedCountry: passportIssuedCountry,
        passportLastName: passportLastName,
        passportMiddleName: passportMiddleName,
        passportFirstName: passportFirstName,
        passportPath: passportImage,

        pincode: pincode,
        state: state,
        title: title,
        travellerId: 0,
        userAlias: this.loginemail,
        visaList: this.allVisaList,
      };

      console.log(newbody);
      this.profileControllerService
        .addTravller(newbody)
        .subscribe((travller) => {
          console.log("add travller reaponse from API", newbody);
          if (travller) {
            this.closeLoading();
            
            console.log(this.previousUrlTravellerDetails);
            if (this.previousUrlTravellerDetails) {
              this.profileControllerService.clearAllProfiletCache();
              this.router.navigate([this.previousUrlTravellerDetails]);
            } else {

              if (travller["statusMessage"] == 'Traveller Already Exist') {
                this.snackBar.open(travller["statusMessage"], "", {
                  duration: 1500,
                });
                this.setDuplicateWrning();
                return;
              }else{
                this.snackBar.open(travller["statusMessage"], "", {
                  duration: 1000,
                });
              }
              this.profileControllerService.clearAllProfiletCache();
              if (travller["statusCode"] == 0) {
                this.router.navigate([
                  "/myaccount/user-profile-form/myprofile",
                ]);
              }
            }
          }
        });
    }
  }

  
  setDuplicateWrning(){
    this.showWrningSameTraveller = true;
    this.travellerForm.get("title").setErrors({
      'sameTitle': true
    });
    this.travellerForm.get("firstName").setErrors({
      'sameFirstName': true
    });
    this.travellerForm.get("lastName").setErrors({
      'sameLastName': true
    });
    this.showWrningSameTraveller = true;
     this.travellerForm.get("firstName").markAsPristine();
     this.travellerForm.get("title").markAsPristine();
     this.travellerForm.get("lastName").markAsPristine();
  }
  removeDuplicateValidation() {
    let title = this.travellerForm.get("title").dirty;
    let firstName = this.travellerForm.get("firstName").dirty;
    let lastName = this.travellerForm.get("lastName").dirty;
    if (this.showWrningSameTraveller) {
      if ((title || firstName || lastName)) {
        this.showWrningSameTraveller = false;
        this.travellerForm.get("title").setErrors(null)
        this.travellerForm.get("firstName").setErrors(null)
        this.travellerForm.get("lastName").setErrors(null);
        this.travellerForm.get("title").updateValueAndValidity();
        this.travellerForm.get("firstName").updateValueAndValidity();
        this.travellerForm.get("lastName").updateValueAndValidity();
      }
    }
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }

  get_100_Back_years;
  getWarning() {
    this.get_100_Back_years = moment(this.todayDate, "MM/DD/YYYY")
      .subtract(100, "y")
      .format("MM/DD/YYYY");
  }

  clearform() {
    this.travellerForm.reset();
    this.imgURL = "";
    this.uploadImage = false;
    // this.selectCountry();
    this.showErrorIfStateSelect = false;
  }

  minDateOptions = { dd: 1, mm: 1, yy: 0, yyyy: 1900 };
  maxDateOptions = { dd: 31, mm: 12, yy: 99, yyyy: 2020 };
  dateMaskOptions;

  warningDate;
  getReturnJourneyDate;
  iswarning = false;
  getPassportWarning(expiryDate) {
    let getReturnJournetDate = moment(this.todayDate, "MM/DD/YYYY").format(
      "DD/MM/YYYY"
    );
    this.warningDate = moment(this.todayDate, "MM/DD/YYYY")
      .add(6, "M")
      .format("DD/MM/YYYY");
    let compareDate = moment(expiryDate, "DD/MM/YYYY");
    let startDate = moment(getReturnJournetDate, "DD/MM/YYYY");
    let endDate = moment(this.warningDate, "DD/MM/YYYY");
    this.iswarning = compareDate.isBetween(startDate, endDate);
  }

  getVisaWarnigExpiry(expiryDate){
    let getReturnJournetDate = moment(this.todayDate, "MM/DD/YYYY").format(
      "DD/MM/YYYY"
    );
    this.warningDate = moment(this.todayDate, "MM/DD/YYYY")
      .add(6, "M")
      .format("DD/MM/YYYY");
    let compareDate = moment(expiryDate, "DD/MM/YYYY");
    let startDate = moment(getReturnJournetDate, "DD/MM/YYYY");
    let endDate = moment(this.warningDate, "DD/MM/YYYY");
    return compareDate.isBetween(startDate, endDate);
  }
}

// onCloseNationlity(event){
//   this.show_loader_nationlity = false;
// }

// show_loader_nationlity = false;
// onNationalityPassport(event: { component: IonicSelectableComponent; value: any }) {
//   console.log("country:", event);
//   this.show_loader_nationlity = false;
//   this.travellerForm.get('userNationalityPassport').setValue(event['value']['countryName']);
// }
// onNationalityVisa(event: { component: IonicSelectableComponent; value: any }, getFormControlName:FormGroup) {
//   console.log("country:", event);
//   console.log(getFormControlName.value);
//   getFormControlName.get('visaIssuedNationality').setValue(event['value']['countryName']);
// }

// visaNumberIndex;
// showLoderVisaNationality;
// onOpenVisaNationality(index){
//   this.visaNumberIndex = index;
//   this.showLoderVisaNationality = true;
// }
// onCloseNationlityVisa(index){
//   this.visaNumberIndex = index;
//   this.showLoderVisaNationality = false;
// }

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
