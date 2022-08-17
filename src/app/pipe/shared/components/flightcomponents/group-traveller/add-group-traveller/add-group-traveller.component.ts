import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { Subscription } from "rxjs";
import { Alert } from "selenium-webdriver";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import { LoadingController } from "@ionic/angular";
import { OverlayService } from 'src/app/services/overlay.service';
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { CropperModalComponent } from 'src/app/modules/flight-profile-module/cropper-modal/cropper-modal.component';

@Component({
  selector: "app-add-group-traveller",
  templateUrl: "./add-group-traveller.component.html",
  styleUrls: ["./add-group-traveller.component.scss"],
})
export class AddGroupTravellerComponent implements OnInit {
  public imagePath;
  imgURL: any;
  public message: string;
  groupname: any;
  groupimg: any;
  usertravller: any;
  groupid: any;
  subscribed: Subscription;
  text: any = "add";
  created = true;
  remove = "remove";
  groupForm: FormGroup;
  imagePreview: string;
  uploadPhoto;
  userdetail: any;
  cretedgroupd = [];
  groupids: any;
  myfinalgroupid: any;
  length: any;
  mymessage: string;
  finallength: any;
  dummyimg: any;
  loginemail: any;
  dummyimgfemale: any;
  adult_male_icon_dummy = "assets/traveller_icons/male_adult.png";
  adult_female_icon_dummy = "assets/traveller_icons/female_adult.png";

  child_male_icon_dummy = "assets/traveller_icons/boy_child.png";
  child_female_icon_dummy = "assets/traveller_icons/girl_child.png";

  infant_male_icon_dummy = "assets/traveller_icons/boy_infant.png";
  infant_female_icon_dummy = "assets/traveller_icons/girl_infant.png";
  defaultIcon= 'assets/icons/flights/flaticon.svg';
  fileNameDialogRef: MatDialogRef<CropperModalComponent>;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public loadingController: LoadingController,
    private fb: FormBuilder,
    private profileControllerService: ProfileControllerService,
    private _ref: ChangeDetectorRef,
    private overlayService: OverlayService
  ) {}
  ngOnInit() {
    this.createform();
   
    this.dummyimg = "assets/icons/flights/testimonials-male.png";
    this.dummyimgfemale = "assets/icons/flights/femalenew.png";

    this.loginemail = localStorage.getItem("loginemail");
    this.loadprofile();
  }

  createform() {
    this.groupForm = this.fb.group({
      groupname: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.maxLength({value:20 }),
            // RxwebValidators.minLength({value:1 })
          ],messageKey:"composeMessageKey"
        })
      ]
     // groupname: ["", Validators.required],
    });
  }

  goBack() {
    // this.router.navigate(['/view-profile-module']);
    this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
  } //gobackend

  selectedFile: File;

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  ///////////upload groupImgage

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
    console.log(files);
    // if (files.length === 0) return;

    // var mimeType = files[0].type;
    // if (mimeType.match(/image\/*/) == null) {
    //   this.message = "Only images are supported.";
    //   return;
    // }
    // var finalImageSize = Math.round(files[0].size / 1024);
    // console.log(Math.round(files[0].size / 1024));
    // if (finalImageSize > 2048) {
    //   this.flagForImage = true;
    //   setTimeout(() => {
    //     this.flagForImage = false;
    //   }, 3000);
    //   return;
    // }
    // this.flagForImage = false;
    // var reader = new FileReader();
    // this.imagePath = files;
    // reader.readAsDataURL(files[0]);
    // reader.onload = (_event) => {
    //   this.imgURL = reader.result;
    //   console.log(this.imgURL);
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
  ///end group-img

  ////////remove travller from list////////////

  removesingletravller(travllerid) {
    this.profileControllerService
      .removetravller(travllerid)
      .subscribe((res) => {
        console.log(res);
        //this.loadprofile()
      });
  }
  ////////remove travller from list--end////////////

  ////////method for add travller in created group--start////////////

  // ionViewWillEnter(){
  //   console.log('view')
  //   this.loadprofile();
  // }

  removetravller(travellerId) {
    var travlleringroup = {
      groupId: this.myfinalgroupid,
      travellerIds: [travellerId],
      userAlias: this.loginemail,
    };
    this.profileControllerService
      .removetravllerIngroup(travlleringroup)
      .subscribe((res) => {
        console.log(res);
        //   if(res){

        // let allgroup =  res['userDetails']['travlerGroup'].filter(x => x.groupId == this.groupid ) ;
        // console.log(allgroup)
        //    // this.getselectedGroup();
        //   }else{

        //   }
      });
    // this.getselectedGroup();
  }

  creategroup() {
    let length = this.travllerIdArray.length;
    console.log("trvller arry", length);
    if (length < 2) {
      let snackBarRef1 = this._snackBar.open(
        "Minimum 2 members requires to create a group",
        "",
        {
          duration: 1500,
        }
      );
    } else {
      this.creategroupfirst();
    }
  }

  validategroup(val){
    console.log('entered group name val trim',val.trim());

    console.log('entered group name leng',val.length);
    let finalgrouplength = val.replace(/\s/g, "");
    console.log('abc',finalgrouplength)
    console.log('abc11',finalgrouplength.length)
let length = finalgrouplength.length
          if(length<1){
            this.groupForm.controls['groupname'].setErrors({ 'incorrect': true});
              this.groupForm.controls['groupname'].markAsTouched();
            console.log('entered group name xx length',finalgrouplength.length);


            
    
          }else{
            console.log('your group name iss1',val);
          }
  }

  isSubmitted = false;
  creategroupfirst() {
    this.isSubmitted = true;
    console.log("clickeddd");
    console.log(this.groupForm.value);
    let filledvalue = this.groupForm.value

    if (this.groupForm.invalid) {
            this.groupForm.controls['groupname'].setErrors({ 'incorrect': true});

      for (let i in this.groupForm.controls)

        this.groupForm.controls[i].markAsTouched();

      return;
    } else {
      this.created = false;
      let groupnamedata = this.groupForm.get("groupname").value;
      let groupname = groupnamedata.trim();
    //  this.validategroup(groupnamedata);

//       console.log('entered group name val trim',groupname.trim());

//       console.log('entered group name leng',groupname.length);
// let finalgrouplength = groupname.replace(/\s/g, "");
// console.log('entered group name xx length',finalgrouplength.length);

   
console.log('entered group name val after trim',groupname);

      

      // this.spinner.show();
      this.presentLoading();
      var addgroupitem = {
        groupName: groupname,
        imageFilePath: this.imgURL,
        groupProfileImagePath: "",
        userAlias: this.loginemail,
      };

      console.log('group req body',addgroupitem);
      this.profileControllerService
        .addGroup(addgroupitem)
        .subscribe((group) => {
          console.log("res from add group api", group);

          let length = group["travellerGroup"]["userTraveller"];
          this.length = group["travellerGroup"]["userTraveller"];

          this.cretedgroupd = group["travellerGroup"];
          this.groupids = this.cretedgroupd;
          var getgroupid = this.groupids;
          console.log(typeof getgroupid);
          console.log("group id of created group", this.groupids);
          let finalid = getgroupid.groupId;
          this.myfinalgroupid = finalid;
          this._ref.markForCheck();

          if (group["statusMessage"] == "success") {
            this.addtravlleringroup();
          }
        });
    
    }
  }

  buttonText = "Add";
  buttonText2 = "Remove";
  travllerIdArray = [];
  /////////
  toggleMe(id, traveller) {
    traveller["travellerAdd"] = !traveller["travellerAdd"];
    console.log(traveller["travellerAdd"]);
    if (traveller["travellerAdd"] == false) {
      console.log("add");
      // this.addtravlleringroup(id);
      console.log("clicked id add", id);
      this.travllerIdArray.push(id);
      // traveller['travellerAdd'] == true
      console.log(this.travllerIdArray);
    } else {
      this.travllerIdArray.splice(this.travllerIdArray.indexOf(id), 1);
      //traveller['travellerAdd'] = false;
      console.log(this.travllerIdArray);
    }
  } ////////button text-concept end/////////////

  ///////method for add travller in created group--end////////////

  addtravlleringroup() {
    var travlleringroup = {
      groupId: this.myfinalgroupid,
      travellerIds: this.travllerIdArray,
      userAlias: this.loginemail,
    };

    console.log("req body", travlleringroup);

    this.profileControllerService
      .addTravllerIngroup(travlleringroup)
      .subscribe((res) => {
        this.closeLoading();

        let response = res;
        this._ref.markForCheck();

        console.log("res from add trvlr in group api", res);
        this._snackBar.open(res["statusMessage"], "", {
          duration: 1000,
        });
        this.profileControllerService.clearAllProfiletCache();
        //this.router.navigate(["/view-profile-module"]);
        this.router.navigate(["/myaccount/user-profile-form/myprofile"]);

        // let allgroup =  res['userDetails']['travlerGroup'].filter(x => x.travellerId == this.myfinalgroupid ) ;
        let allgroup = res["userDetails"]["travlerGroup"];
        let singlegroup = allgroup.filter(
          (x) => x.groupId == this.myfinalgroupid
        );
        console.log(singlegroup);
        let usertrvler = singlegroup[0];
        let finallength = usertrvler.userTraveller;
        this.finallength = finallength.length;
      });
  }

  ////get travller from profilemethod---start//////////
  loadprofile() {
    this.loginemail = localStorage.getItem("loginemail");
    var email = this.loginemail;
    this.profileControllerService.getAllProfile(email).subscribe((profile) => {
      console.log(profile);
      this.userdetail = profile["userDetails"];

      this.userdetail.userTraveller.forEach((element) => {
        element["travellerAdd"] = true;
      });

      console.log(this.userdetail);
    });
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
}
