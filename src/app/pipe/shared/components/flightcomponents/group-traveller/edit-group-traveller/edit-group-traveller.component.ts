import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { Subscription } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoadingController } from '@ionic/angular';
import { MatSnackBar , MatDialog, MatDialogRef} from '@angular/material';
import { OverlayService, LoadingOverlayRef } from 'src/app/services/overlay.service';
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { CropperModalComponent } from 'src/app/modules/flight-profile-module/cropper-modal/cropper-modal.component';
@Component({
  selector: "app-edit-group-traveller",
  templateUrl: "./edit-group-traveller.component.html",
  styleUrls: ["./edit-group-traveller.component.scss"]
})
export class EditGroupTravellerComponent implements OnInit, OnDestroy {
  userdetail: any;
 
  subscribe: Subscription;
  public text: string = "Remove";
  groupForm: FormGroup;
  uploadPhoto;
  groupname: any;
  groupimg: any;
  usertravller: any;
  groupid: any;
  subscribed: Subscription;
  loginMail: any;
  myfinalgroupid: any;
  loginemail: string;
  dummyimgfemale:any;
  dummyimg:any;
  Removeflag : any;
  ADDflag : any;

  flagremove:any;
  dummyuserimg: string;
  datacoming: boolean;
  adult_male_icon_dummy = 'assets/traveller_icons/male_adult.png';
  adult_female_icon_dummy = 'assets/traveller_icons/female_adult.png';

  child_male_icon_dummy = 'assets/traveller_icons/boy_child.png';
  child_female_icon_dummy = 'assets/traveller_icons/girl_child.png';

  infant_male_icon_dummy = 'assets/traveller_icons/boy_infant.png';
  infant_female_icon_dummy = 'assets/traveller_icons/girl_infant.png';
  defaultIcon= 'assets/icons/flights/flaticon.svg';
  fileNameDialogRef: MatDialogRef<CropperModalComponent>;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private profileControllerService: ProfileControllerService,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public loadingController: LoadingController,
    private snackBar: MatSnackBar,
    private overlayService: OverlayService
  ) {}
  

  ngOnInit() {
    this.dummyimg = 'assets/icons/flights/testimonials-male.png';
    this.dummyimgfemale = 'assets/icons/flights/femalenew.png';
    this.dummyuserimg = 'assets/icons/flights/group1.png'
    this.loginemail = localStorage.getItem('loginemail')
    this.loginMail = localStorage.getItem("loginemail");
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
   //  groupname: ["", Validators.required]
    });

    this.getselectedGroup();
    this.getAllTraveller();
    // this.getalltrvllers();
  }

  goBack() {
    this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
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


  editgroup() {
    // this.spinner.show();
    let groupnamedata = this.groupForm.get("groupname").value;

    let groupname = this.groupForm.get("groupname").value;
    let groupnames = groupnamedata.trim();
    console.log(groupname == "" );
    console.log(groupname == null);
    console.log(!groupname);
    if(groupname == "" || groupname == null || !groupname)
    {
      console.log(groupname);
      this.closeLoading();
      return;
    }
    if(this.flagremove < 1){
      let snackBarRef1 = this.snackBar.open(
        "Minimum 1 member requires to update a group",
        "",
        {
          duration: 1500,
        });
    }
   else{ 

    if (this.groupForm.invalid) {
      for (let i in this.groupForm.controls)
        this.groupForm.controls[i].markAsTouched();
    
      return;
    }
 else {

/////////
this.presentLoading();
this.addtravlleringroup();

     var editgroup = {
      groupId: this.groupid,
      groupName: groupnames,
      imageFilePath: this.imgURL != undefined ? this.imgURL : '',  // base 64 
      groupProfileImagePath: this.imgURL == undefined || this.imgURL == '' || this.imgURL == null ? this.groupimg : '', // url coming from Server
      userAlias: this.loginMail
    };
    console.log(editgroup);
    this.profileControllerService.editgroup(editgroup).subscribe(group => {
      console.log('on click of update button',group);
      this.closeLoading();
      this.snackBar.open(group["statusMessage"], "", {
        duration: 1000
      });
      if (group['status'] == 0) {
        
        this.profileControllerService.clearAllProfiletCache()
        this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
      }
    });

  }//

  }
  }

  ////
  public imagePath;
  imgURL: any;
  public message: string;
  flagForImage : any = false;
  uploadImage = false;
  ///////////upload groupimg
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
preview(files) {
//   if (files.length === 0)
//     return;

//   var mimeType = files[0].type;
//   if (mimeType.match(/image\/*/) == null) {
//     this.message = "Only images are supported.";
//     return;
//   }
//   var finalImageSize= Math.round(files[0].size / 1024);
//   console.log(Math.round(files[0].size / 1024));
//   if(finalImageSize > 2048)
//     {
//       this.flagForImage = true;
//       setTimeout(() => {
//        this.flagForImage = false;
//  }, 3000);
//       return;
//     }   
//   this.flagForImage = false;
//   var reader = new FileReader();
//   this.imagePath = files;
//   reader.readAsDataURL(files[0]); 
//   reader.onload = (_event) => { 
//     this.imgURL = reader.result; 
//     console.log(this.imgURL)
//   }

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

  // preview(files) {
  //    if (files.length === 0) return;

  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }

  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]);
  //   reader.onload = _event => {
  //     this.imgURL = reader.result;
  //   };
  // }

  ////

  getselectedGroup() {
    this.subscribe = this.profileControllerService
      .getgroupdata()
      .subscribe(groupdata => {
        let length = groupdata["userTraveller"];
          console.log('selected group details',groupdata);
          var data = groupdata;
          this.groupname = data["groupName"];
          this.groupimg = data["groupeImagePath"];
          this.usertravller = data["userTraveller"];
          console.log("remove traveller ", this.usertravller);
          this.flagremove =  this.usertravller.length;
          console.log("remove traveller count", this.flagremove);
          this.usertravller.forEach(element => {
            this.allActiveID.push({
              travellerId: element["travellerId"]
            });
          });
          console.log("remove traveler id", this.allActiveID);
          this.groupid = data["groupId"];
          this.groupForm.patchValue({
            groupname: this.groupname
          });
       this.datacoming = true;
      });
  }
  allActiveID = [];
  alltrveler;
  loadershow = []
  ADDtravellerId = [];
  RemovetravellerId = [];
  getAllTraveller() {
    this.loginMail = localStorage.getItem("loginemail");
    this.profileControllerService
      .getAllProfile(this.loginMail)
      .subscribe(profile => {
        this.alltrveler = profile["userDetails"]["userTraveller"];
        console.log('all trvller',this.alltrveler);
        const comparetravellerId = (obj1, obj2) => {
          return obj1.travellerId === obj2.travellerId;
        };
        let filterTravellerID = this.alltrveler.filter(b => {
          let indexFound = this.allActiveID.findIndex(a =>
            comparetravellerId(a, b)
          );
          return indexFound == -1;
        });
        console.log("add traveller", filterTravellerID);
        console.log("total traveller", this.alltrveler);
        this.alltrveler = filterTravellerID;
        this.loadershow = this.alltrveler;
      });
  }

  buttonText = "Add";
  addtravlleringroup() {
    console.log("In Add Traveller");
    var travlleringroup = {
      groupId: this.groupid,
      travellerIds: this.ADDtravellerId,
      userAlias: this.loginemail
    };
    console.log(travlleringroup);

    this.profileControllerService
      .addTravllerIngroup(travlleringroup)
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.removetravller();
          console.log(res);        
          this.spinner.hide();
        } else {
          alert("please create a group first to add your travller!!");
        }
      });
  }
  addactiveID(id) {
    console.log("addactive");
    this.ADDflag = id;
    // document.getElementById("btn-" + id).innerText = "Remove";
    document.getElementById("btn-" + id).innerHTML = "<ion-icon name='md-close' style='padding-right: 4px; font-size: 13px; padding-top: 2px;'></ion-icon> Remove";
    var btn =  document.getElementById("btn-" + id);
    btn.classList.remove("buttoncls");
    btn.classList.add("buttonRemovecls");
    this.spinner.hide();
  }
  removeactiveID(id) { 
    console.log("removeactive");
    this.Removeflag = id;
    // document.getElementById("btn-" + id).innerText = "Add";
    document.getElementById("btn-" + id).innerHTML = "<ion-icon name='md-add' style='font-size: 14px; padding: 1px 4px 0 0;'></ion-icon> Add";
    var btn =  document.getElementById("btn-" + id);
    btn.classList.remove("buttonRemovecls");
    btn.classList.add("buttoncls");
    this.spinner.hide();
  }
  buttonText2;
  currentID;

  toggleMe(id) {
    console.log(id);
    this.spinner.show();
    this.currentID = id;
    this.buttonText2 = document.getElementById("btn-" + id).innerText;
    console.log(this.buttonText2);
    if (this.buttonText2 == "Add") {
      console.log("addss");
      this.buttonText = 'Remove';
      var btn =  document.getElementById("btn-" + id);
      btn.classList.add("buttonRemovecls");
      this.ADDflag = id;
    //  this.addtravlleringroup();
    
      this.flagremove =this.flagremove+1;
      this.ADDtravellerId.push(id);
      this.RemovetravellerId.splice(
        this.RemovetravellerId.indexOf(id),
        1
      );
      console.log("add"+this.ADDtravellerId);
      console.log("remove"+this.RemovetravellerId);
      this.addactiveID(id);
    }

    if (this.buttonText2 == "Remove") {
      console.log(this.flagremove);
     if(this.flagremove <= 2)  
     {
      Swal.fire({
        title: 'Are you sure?',
        text: "Minimum two traveler require in a group Otherwise group will delete automatically.",
        icon: 'warning',
        customClass : {
          container:"swalcls"
        },
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        focusConfirm: false,
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        console.log(result.value == true);
        if(result.value == true) {
          this.deletegroup();
          Swal.fire(
            'Deleted!',
            'Your group has been deleted.',
            'success'
          )
         // this.getalltrvllers();
         
        }
        else
        {
          this.spinner.hide();
          return;
        }
         

      })
    } 
   else if(this.flagremove >= 1)
    {
      console.log("else"+this.flagremove);
      this.buttonText = 'Add';
      console.log("removessssss");
      var btn =  document.getElementById("btn-" + id);
      btn.classList.add("buttoncls");
      //this.removetravller(id);
      this.Removeflag = id;
      console.log("Removeflag"+ this.Removeflag);
      this.flagremove =this.flagremove-1;
      console.log("final"+this.flagremove);
      this.RemovetravellerId.push(this.Removeflag);
      this.ADDtravellerId.splice(
        this.ADDtravellerId.indexOf(this.Removeflag),
        1
      );
     console.log("add"+this.ADDtravellerId);
     console.log("remove"+this.RemovetravellerId);
     this.removeactiveID(id);
    }
    
      // document.getElementById("btn-" + id).innerText = 'ADD'
    }
  }

  afterremovegetupdate(data) {
    console.log(data);
    this.profileControllerService.sendgroupdata(data);
  }

  removetravller() {
    console.log("In Remove Traveller");
    var travlleringroup = {
      groupId: this.groupid,
      travellerIds: this.RemovetravellerId,
      userAlias: this.loginemail
    };
   
    this.profileControllerService
      .removetravllerIngroup(travlleringroup)
      .subscribe(res => {
        console.log('remove travller api',res);
        if (res) {
          


          // let allgroup = res["userDetails"]["travlerGroup"].filter(
          //   x => x.groupId == this.groupid
          // );
          // console.log(allgroup);
          // // this.afterremovegetupdate(allgroup[0]);
          // // this.getselectedGroup();

         // this.removeactiveID(travellerId);
          this.spinner.hide()
           console.log(res["userDetails"]["travlerGroup"])
           let allgroup = res["userDetails"]["travlerGroup"].filter(
            x => x.groupId == this.groupid
          );
          console.log(allgroup);

          // this.afterremovegetupdate(allgroup[0]);
          // this.getselectedGroup();

          
        } else {
        }
      });
    // this.getselectedGroup();
  }

  deletegroup() {
    this.profileControllerService.removegroup(this.groupid).subscribe(res => {
      console.log(res);
      if(res)
      this.profileControllerService.clearAllProfiletCache();
       this.router.navigate(["/myaccount/user-profile-form/myprofile"]);
      // this.userdetail = profile["userDetails"];
    });
  }
  

  //get all travller from main data to dsiplay in list

  getalltrvllers() {
    this.loginMail = localStorage.getItem("loginemail");
    this.profileControllerService.getAllProfile(this.loginemail).subscribe(profile => {
      console.log(profile);
      this.userdetail = profile["userDetails"];
    });
  }

  ////////method for add travller in created group--start////////////

  ///////method for add travller in created group--end////////////y[]

  ngOnDestroy() {
    this.subscribe.unsubscribe();
    // this.subscribed.unsubscribe();
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
  datata(){
    
  }

  
}
