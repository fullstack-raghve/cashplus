import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthServices } from "src/app/services/auth.service";
import * as moment from "moment";
import { FlightService } from "src/app/services/flight.service";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { IonicSelectableComponent } from "ionic-selectable";
import { NgxSpinnerService } from "ngx-spinner";
import * as country from "../../../../constants/new-countries.constant";
import { TooltipDirective } from "ng2-tooltip-directive";
import { CropperModalComponent } from "../../cropper-modal/cropper-modal.component";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MatBottomSheet,
} from "@angular/material";
import { createAutoCorrectedDatePipe } from "src/app/pipe/shared/autoDatePipe";
import { NationalityComponent } from "src/app/nationality/nationality.component";
import { LoadingController, IonContent } from "@ionic/angular";
import { OverlayService, LoadingOverlayRef } from 'src/app/services/overlay.service';
@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  public profileForm: FormGroup;
  selected = "+91";
  x: any;
  selected2 = "Emirates";
  subscribe: Subscription;
  travllerId: any;
  todayDate = moment().format("MM/DD/YYYY");
  titles = [
    { value: "0", name: "Mr." },
    { value: "1", name: "Ms." },
    { value: "2", name: "Mrs." },
    { value: "3", name: "Miss" },
    { value: "4", name: "Master" },
  ];
  statevalue: any;
  countryValue: any;
  isprimarytravllerValue: any;
  allairline: any;
  isprimarytravllerValue1: string;
  message: string;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  loginemail: string;
  currentCountry = localStorage.getItem("countryCode");
  someTooltip;
  fileNameDialogRef: MatDialogRef<CropperModalComponent>;
  @ViewChildren(TooltipDirective) tooltipDirective;

  char_limit_3_20 = ' should have minimum 3 and maximum 20 characters.'
  phn_limit_7_11 = 'should have minimum 7 and maximum 11 digit.'
  Char_max_length_20 = ' should have maximum 20 characters.'
  adult_male_icon_dummy = 'assets/traveller_icons/male_adult.png';
  adult_female_icon_dummy = 'assets/traveller_icons/female_adult.png';

  child_male_icon_dummy = 'assets/traveller_icons/boy_child.png';
  child_female_icon_dummy = 'assets/traveller_icons/girl_child.png';

  infant_male_icon_dummy = 'assets/traveller_icons/boy_infant.png';
  infant_female_icon_dummy = 'assets/traveller_icons/girl_infant.png';
  defaultIcon= 'assets/icons/flights/flaticon.svg';
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private FB: FormBuilder,
    private authServices: AuthServices,
    private snackBar: MatSnackBar,
    private flightService: FlightService,
    private pservice: ProfileControllerService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    public loadingController: LoadingController,
    private overlayService: OverlayService
  ) { }

  ngOnInit() {
    this.getAllNewCountry();
    this.loginemail = localStorage.getItem("loginemail");
    this.initializeEditForm();
    this.getSelectedtravller();

    this.isprimarytravllerValue1 = localStorage.getItem("isPrimaryTraveller");
    this.getAllAirline();
    // showWrningSameTraveller
    this.profileForm.valueChanges.subscribe((res) => {
      this.removeDuplicateValidation();
    })
    this.profileForm.get("passportExpireDate").valueChanges.subscribe((res) => {
      // console.log(res);
      if (res && res["length"] == 10) {
        console.log(res.length);
        this.getPassportWarning(res);
      } else {
        this.iswarning = false;
        console.log("less than 10");
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
    if (this.isprimarytravllerValue == 1) {
      this.profileForm.get("email").disable();
    } else {
    }

    this.getWarning();
  }

  titleSame = 'title is already exist';
  firstNameSame = 'first name is already exist';
  lastNameSame = 'last name is already exist';
  showWrningSameTraveller = false;
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

  initializeEditForm() {
    this.getWarning();

    this.profileForm = this.FB.group({
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
            // RxwebValidators.maxLength({value:20, message:''}),
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
            // RxwebValidators.maxLength({value:20, message:''}),
          ],
        }),
      ],
      // /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/
      email: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Email id is required.'
          }),
          RxwebValidators.pattern({
            expression: { pattern: /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/ },
            message: "Please enter valid email",
          }),RxwebValidators.maxLength({value:45, message:''}),],
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
      mobileNumber: [
        "",
        RxwebValidators.compose({
          validators: [RxwebValidators.required({
            message:'Mobile number is required.'
          }), RxwebValidators.numeric(), RxwebValidators.maxLength({value:11, message:''}),],
        }),
      ],
      // RxwebValidators.pattern({
      //   expression: { pattern: /^[a-zA-Z0-9\s,'-./]*$/ },
      //   message: "Please enter valid address",
      // }),
      address: [
        "",
        RxwebValidators.compose({
          validators: [ RxwebValidators.maxLength({value:250, message:''}),],
        }),
      ],
      pincode: [
        "",
        RxwebValidators.compose({
          validators: [ RxwebValidators.numeric(),  RxwebValidators.maxLength({value:8, message:''})],
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

      // frequentFlyerNumber: [
      //   "",
      //   RxwebValidators.compose({
      //     validators: [RxwebValidators.alphaNumeric()],
      //   }),
      // ],
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
          validators: [RxwebValidators.alphaNumeric(),  RxwebValidators.maxLength({value:9, message:''})],
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
      file: [],
      profileImagePath: [""]
    });
  }
  ngAfterViewInit() {
    this.someTooltip = this.tooltipDirective.find(
      (elem) => elem.id === "someTooltip"
    );
  }

  getAllAirline() {
    this.flightService.getAllAirline().subscribe((res) => {
      // console.log(res);
      this.allairline = res;
    });
  }

  getAllCountryList() {
    this.authServices
      .getData(environment.baseUrl + "/pwa/v1/country/getAllCountry")
      .subscribe(
        (res) => {
          this.allCountryList = res["countryList"];
          console.log("all country", this.allCountryList);

          this.allCountryList.forEach((element) => {
            this.newCountryList.push({
              countryCode: element["countryCode"],
              countryId: element["countryId"],
              countryName: element["countryName"],
            });
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onSelectState(value, item) {
    if (item.source.selected) {
      //  console.log("state id", value);
      this.statevalue = value;
    }
  }

  goBack() {
    this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
  }
  uploadPhoto() {
    // alert("ksldfhg")
  }

  initTechnologyFields(): FormGroup {
    return this.FB.group({
      airline: [""],
      frequentFlyerNumber: ["",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.alphaNumeric(),
            RxwebValidators.maxLength({value:20, message:''})
          ],
        })
      ],
    });
  }
  addPrefered() {
    if (this.profileForm.controls.preferedAirlines) {
      const control = <FormArray>this.profileForm.controls.preferedAirlines;
      control.push(this.initTechnologyFields());
    }
  }

  remove(i: number): void {
    const control = <FormArray>this.profileForm.controls.preferedAirlines;
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
    const control = <FormArray>this.profileForm.controls.visaInfo;
    control.push(this.initvisaInfoFields());
  }

  removeVisaInfo(j: number): void {
    const control = <FormArray>this.profileForm.controls.visaInfo;
    control.removeAt(j);
  }

  get preferedairline(): FormArray {
    return this.profileForm.get("preferedAirlines") as FormArray;
  }
  flagForImage: any = false;
  uploadImage = false;
  preview(files) {
    // if (files.length === 0) return;

    // var mimeType = files[0].type;
    // if (mimeType.match(/image\/*/) == null) {
    //   this.message = "Only images are supported.";
    //   return;
    // }
    // var finalImageSize= Math.round(files[0].size / 1024);
    // console.log(Math.round(files[0].size / 1024));
    // if(finalImageSize > 2048)
    //   {
    //     // let snackBarRef1 = this.snackBar.open('File is larger than 2 MB','',{
    //     //   duration:2000,
    //     // });
    //     this.flagForImage = true;
    //      setTimeout(() => {
    //       this.flagForImage = false;
    // }, 3000);
    //     console.log("size exeeded");
    //     return;
    //   }
    // this.flagForImage = false;
    // var reader = new FileReader();
    // this.imagePath = files;
    // reader.readAsDataURL(files[0]);
    // reader.onload = _event => {
    //   this.imgURL = reader.result;
    //   console.log(this.imgURL);
    //   this.uploadImage = true;
    // };
 
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

  travellerType;
  travellerTitle;
  travellerProfileImage;
  getSelectedtravller() {
    this.subscribe = this.pservice
      .getselectedtravllerdata()
      .subscribe((travller) => {
        console.log(travller);

        if (travller) {
          let travllerinfo = travller;
          this.travllerId = travllerinfo["travellerId"];
          this.isprimarytravllerValue = travllerinfo["isPrimaryTraveller"];
          if(travllerinfo["country"] != null){
            this.getAllStateList(travllerinfo["country"]);
          }
          // const toSelectPsspoprtCountry = this.newCountryList.find(
          //   c => c.countryId == travllerinfo.passportIssuedCountry
          // );

          // get all frequentFlyer list
          // console.log( travllerinfo["frequentFlyer"])
          let frequentFlyer = [];
          travllerinfo["frequentFlyer"].forEach((element) => {
            if (travllerinfo["frequentFlyer"].length != 0) {
              frequentFlyer.push({
                airline: element["airline"],
                frequentFlyerNumber: element["ffNumber"],
              });
            }
          });

          let reqBodyVisa = [];
          travllerinfo["visa"].forEach((element, i) => {
            if (travllerinfo["visa"].length != 0) {
              reqBodyVisa.push({
                visaNumber: element["visaNo"],
                visaExpiry:
                  element["visaExpDate"] != null
                    ? moment(element["visaExpDate"], "YYYY-MM-DD").format(
                      "DD/MM/YYYY"
                    )
                    : "",
                visaCountry: Number(element["country"]),
                visaTYpe: element["visaType"],
              });
            }
          });

          this.travellerTitle = travllerinfo["title"];
          this.travellerType = travllerinfo["travellerType"];
          this.travellerProfileImage = travllerinfo["profileImagePath"] == null ? "" : travllerinfo["profileImagePath"],

          this.profileForm.patchValue({
            title: travllerinfo["title"],
            username: [""],
            firstName: travllerinfo["firstName"],
            lastName: travllerinfo["lastName"],
            email: travllerinfo["email"],
            dob: moment(travllerinfo["dob"], "YYYY/MM/DD").format("DD/MM/YYYY"), //yy--mm-dd   -xd --dd/mm/yy
            dialcode: travllerinfo["isdCode"],
            mobileNumber: travllerinfo["mobileNumber"],
            pincode: travllerinfo["pinCode"],
            address: travllerinfo["address"],
            city: travllerinfo["city"],
            country: travllerinfo["country"],
            state: travllerinfo["state"],
            profileImagePath:
              travllerinfo["profileImagePath"] == null
                ? ""
                : travllerinfo["profileImagePath"],

            passportExpireDate:
              travllerinfo["passportExpireDate"] != null
                ? moment(
                  travllerinfo["passportExpireDate"],
                  "YYYY/MM/DD"
                ).format("DD/MM/YYYY")
                : "",
            passportNo: travllerinfo.passportNo,
            passportIssuedCountry: travllerinfo.passportIssuedCountry,
            passportLastName: travllerinfo.passportLastName,
            passportMiddleName: travllerinfo.passportMiddleName,
            passportFirstName: travllerinfo.passportFirstName,
            passportImage: travllerinfo.passportImage,
            // userNationalityPassport:toSelectPsspoprtCountry && toSelectPsspoprtCountry['countryName'] ?  toSelectPsspoprtCountry['countryName'] : null
          });

          this.getPassportWarning(
            this.profileForm.get("passportExpireDate").value
          );

          if (frequentFlyer.length != 0) {
            this.profileForm.setControl(
              "preferedAirlines",
              this.setPreferedAirline(frequentFlyer)
            );
          }

          if (reqBodyVisa.length != 0) {
            this.profileForm.setControl(
              "visaInfo",
              this.setVisaData(reqBodyVisa)
            );
          }
        }
      });
  }

  setVisaData(visaData): any {
    const formarray = new FormArray([]);
    visaData.forEach((visa) => {
      formarray.push(
        this.FB.group({
          visaExpiry: [visa["visaExpiry"],  RxwebValidators.compose({
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
          }),],
          visaNumber: [visa["visaNumber"], RxwebValidators.compose({
            validators: [RxwebValidators.alphaNumeric(), RxwebValidators.maxLength({value:20, message:''})],
          }),],
          visaCountry: visa["visaCountry"],
          visaTYpe: [visa["visaTYpe"], RxwebValidators.compose({
            validators: [RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed.",
            }), RxwebValidators.maxLength({value:20, message:''})],
          })],
          uploadDocumentDetails: [""],
          visaDoucmentName: [""],
          // visaIssuedNationality: visa["visaCountry"]
        })
      );
    });
    return formarray;
  }

  setPreferedAirline(airlineData): any {
    if (airlineData) {
      const formarray = new FormArray([]);
      airlineData.forEach((fly) => {
        formarray.push(
          this.FB.group({
            airline: [fly["airline"]],
            frequentFlyerNumber: [fly["frequentFlyerNumber"],
            RxwebValidators.compose({
              validators: [
                RxwebValidators.alphaNumeric(),
                RxwebValidators.maxLength({value:20, message:''})
              ],
            })],
          })
        );
      });
      return formarray;
    }
  }

  private markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsDirty();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  submitform() {
    console.log(this.profileForm);
    let titleLength = 0;
    if(Number(this.profileForm.get("title").value) == 0 || Number(this.profileForm.get("title").value) == 1)
       titleLength = 3;
    else if(Number(this.profileForm.get("title").value) == 2 || Number(this.profileForm.get("title").value) == 3)   
       titleLength = 4;
    else if(Number(this.profileForm.get("title").value) == 4)
       titleLength = 6;
    if(this.profileForm.valid && (this.profileForm.get("firstName").value.length + this.profileForm.get("lastName").value.length +  titleLength> 40))
    {
      console.log("Total length of first name,Last name , title:-", this.profileForm.get("firstName").value.length + this.profileForm.get("lastName").value.length +  titleLength);
      return;
    } 
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }
    
    this.presentLoading();
    this.getVisaIfno();

    let title = Number(this.profileForm.get("title").value);
    let firstName = this.profileForm.get("firstName").value.trim();
    let lastName = this.profileForm.get("lastName").value.trim();
    let address = this.profileForm.get("address").value;
    let city = this.profileForm.get("city").value;
    let email = this.profileForm.get("email").value;
    let mobileNumber = this.profileForm.get("mobileNumber").value;
    let isdcode = this.profileForm.get("dialcode").value;
    let imgurl = this.profileForm.get("profileImagePath").value;

    let dob = this.profileForm.get("dob").value;
    let pincode = this.profileForm.get("pincode").value;
    let passportExpireDate = this.profileForm.get("passportExpireDate").value;
    let passportNo = this.profileForm.get("passportNo").value;
    let passportIssuedCountry = this.profileForm.get("passportIssuedCountry")
      .value;
    let passportLastName = this.profileForm.get("passportLastName").value;
    let passportMiddleName = this.profileForm.get("passportMiddleName").value;
    let passportFirstName = this.profileForm.get("passportFirstName").value;
    let passportImage = this.profileForm.get("passportImage").value;
    let country = this.profileForm.get("country").value;
    let state = this.profileForm.get("state").value;
    var newbody1 = {
      address: address,
      city: city,
      country: country,

      dob: moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD"), //yy--mm-dd   -xd --dd/mm/yy
      email: email,
      firstName: firstName,
      frequentFlyerList: this.profileForm.get("preferedAirlines").value,
      imageFilePath: this.imgURL != undefined ? this.imgURL : "",
      profileImagePath: imgurl,

      isPrimaryTraveller: this.isprimarytravllerValue,
      isdCode: isdcode,
      lastName: lastName,
      mobileNo: mobileNumber,
      // nationality: "india",

      pincode: pincode,
      state: state,
      title: title,
      travellerId: this.travllerId,
      userAlias: this.loginemail,

      passportExpireDate:
        passportExpireDate != "" && passportExpireDate != null
          ? moment(passportExpireDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : "",
      passportNo: passportNo,
      passportIssuedCountry: passportIssuedCountry,
      passportLastName: passportLastName,
      passportMiddleName: passportMiddleName,
      passportFirstName: passportFirstName,

      visaList: this.allVisaList,
    };

    this.pservice.editprofile(newbody1).subscribe((res) => {
      console.log("edit profile res on submit", res);
      if (res) {
        this.closeLoading();
        if (res["statusMessage"] == 'Traveller Already Exist') {
          this.snackBar.open(res["statusMessage"], "", {
            duration: 1500,
          });
          this.setDuplicateWrning();
          return;
        } else {
          this.snackBar.open(res["statusMessage"], "", {
            duration: 1500,
          });
        }

        if (res["status"] == 0 && res["statusMessage"] == "success") {
          this.pservice.clearAllProfiletCache();
          this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
        }
      }
    });
  }


  setDuplicateWrning(){
    this.showWrningSameTraveller = true;
    this.profileForm.get("title").setErrors({
      'sameTitle': true
    });
    this.profileForm.get("firstName").setErrors({
      'sameFirstName': true
    });
    this.profileForm.get("lastName").setErrors({
      'sameLastName': true
    });
    this.showWrningSameTraveller = true;
     this.profileForm.get("firstName").markAsPristine();
     this.profileForm.get("title").markAsPristine();
     this.profileForm.get("lastName").markAsPristine();
  }
  removeDuplicateValidation() {
    let title = this.profileForm.get("title").dirty;
    let firstName = this.profileForm.get("firstName").dirty;
    let lastName = this.profileForm.get("lastName").dirty;
    if (this.showWrningSameTraveller) {
      if ((title || firstName || lastName)) {
        this.showWrningSameTraveller = false;
        this.profileForm.get("title").setErrors(null)
        this.profileForm.get("firstName").setErrors(null)
        this.profileForm.get("lastName").setErrors(null);
        this.profileForm.get("title").updateValueAndValidity();
        this.profileForm.get("firstName").updateValueAndValidity();
        this.profileForm.get("lastName").updateValueAndValidity();
      }
    }
  }

  @ViewChild(IonContent) resultContent: IonContent;
  scrollToElementById() {
    this.resultContent.scrollToTop(10);
  }

  presentLoading() {
    this.overlayService.showLoader();
  }
  closeLoading() {
    this.overlayService.hideLoader();
  }

  allVisaList = [];
  getVisaIfno() {
    this.allVisaList = [];
    this.profileForm.value["visaInfo"].forEach((element) => {
      this.allVisaList.push({
        visNo: element["visaNumber"],
        visaExpiryDate:
          element["visaExpiry"] != "" && element["visaExpiry"] != null
            ? moment(element["visaExpiry"], "DD/MM/YYYY").format("YYYY-MM-DD")
            : "",
        visaIssuedCountry: element["visaCountry"],
        visaType: element["visaTYpe"],
      });
    });
    console.log(this.allVisaList);
  }

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
        this.profileForm.patchValue({
          passportImage: this.passportImageURL,
          imageName: files[0].name,
        });
      };
    }
  }

  visDocuemnetsType(files, visaGroup: FormGroup, index) {
    console.log(files[0].name);
    console.log(visaGroup["controls"]);
    console.log(index);
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
  }

  selectCountry() {
    const toSelect = this.newCountryList.find(
      (c) => c.countryCode == this.currentCountry
    );
    this.profileForm.get("dialcode").setValue(toSelect["phoneCode"]);
  }

  getAllStateList(countryID) {
    this.authServices
      .getData(
        environment.baseUrl +
        "/pwa/v1/state/getAllStatesByCountryId/" +
        countryID
      )
      .subscribe(
        (res) => {
          if (res["stateList"] != null) {
            this.modifiedStateList = [];
            this.allStateList = res["stateList"];
            this.allStateList.forEach((element) => {
              this.modifiedStateList.push({
                countryId: element["stateId"],
                countryName: element["stateName"],
              });
            });
            // console.log(this.modifiedStateList)
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
      if (
        formfield == "country" &&
        selectedvalue != "" &&
        selectedvalue != null
      ) {
        this.showErrorIfStateSelect = false;
        const selectedCountry = this.newCountryList.find(
          (c) => c.countryId == selectedvalue
        );
        selectedCurrentValue = selectedCountry["phoneCode"];
      } else if (formfield == "state" && selectedvalue) {
        this.showErrorIfStateSelect = false;
        this.showErrorIfStateSelect = false;
        const selectedCountry = this.modifiedStateList.find(
          (c) => c.countryId == selectedvalue
        );
        selectedCurrentValue = selectedCountry["countryName"];
      } else if (
        formfield == "state" &&
        (this.profileForm.get("country").value == "" ||
          this.profileForm.get("country").value == null)
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
          if (
            res["currentCountrySelected"]["countryId"] !=
            this.profileForm.get("country").value
          ) {
            this.modifiedStateList = [];
            this.profileForm.get("state").setValue("");
            this.getAllStateList(res["currentCountrySelected"]["countryId"]);
            this.profileForm
              .get("country")
              .setValue(res["currentCountrySelected"]["countryId"]);
          }
        } else {
          this.profileForm
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
      if (
        formfield == "nationality" &&
        selectedvalue != "" &&
        selectedvalue != null
      ) {
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
          this.profileForm
            .get("passportIssuedCountry")
            .setValue(res["currentCountrySelected"]["countryId"]);
        }
      }
    });
  }

  onOpenNationalityVisa(formfield, selectedvalue, visaIndex) {
    let selectedCurrentValue;

    if (formfield != undefined) {
      if (
        formfield == "nationality" &&
        selectedvalue != "" &&
        selectedvalue != null
      ) {
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
          let visaFormGroup = this.profileForm.get("visaInfo") as FormArray;
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
          this.profileForm
            .get("dialcode")
            .setValue(res["currentCountrySelected"]["phoneCode"]);
        }
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribe.unsubscribe();
  }
  get_100_Back_years;
  getWarning() {
    this.get_100_Back_years = moment(this.todayDate, "MM/DD/YYYY")
      .subtract(100, "y")
      .format("MM/DD/YYYY");
  }

  clearform() {
    this.profileForm.reset();
    this.imgURL = "";
    // this.selectCountry();
    this.profileForm.get("profileImagePath").setValue("");
    this.uploadImage = false;
    this.showErrorIfStateSelect = false;
    console.log(this.profileForm.value);
    this.travellerTitle = null;
    this.travellerType = null;
    this.travellerProfileImage = null;
    if (this.isprimarytravllerValue == 1) {
      this.profileForm.get("email").patchValue(this.loginemail)
    }
    // this.loginemail
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
