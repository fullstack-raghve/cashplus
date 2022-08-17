import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { Location } from '@angular/common';
import { Subscription, forkJoin } from 'rxjs';
import { AuthServices } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { MytripService } from 'src/app/services/mytrip.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"]
})
export class ViewProfileComponent implements OnInit {
  userdetail: any;
  filteruser: any;
  filtereduser: any;
  loading = true;
  loadingnew = false;
dummyimg:any;
groupimg:any;
  sliderOpts = {
    zoom: false,
    slidesPerView: 3,
    spaceBetween: 5
  };
  loginemail: string;
  dummyimgfemale: string;

  adult_male_icon_dummy = 'assets/traveller_icons/male_adult.png';
  adult_female_icon_dummy = 'assets/traveller_icons/female_adult.png';

  child_male_icon_dummy = 'assets/traveller_icons/boy_child.png';
  child_female_icon_dummy = 'assets/traveller_icons/girl_child.png';

  infant_male_icon_dummy = 'assets/traveller_icons/boy_infant.png';
  infant_female_icon_dummy = 'assets/traveller_icons/girl_infant.png';

  defaultIcon= 'assets/icons/flights/flaticon.svg';
  userDetailsSubscription:Subscription;
  ifUpdateChangeSubscription:Subscription;
  isUpdateAnyInProfile;
  isLogin;
  constructor(
    private router: Router,
    private profileControllerService: ProfileControllerService,
    private _authServices: AuthServices,
    private mytripService:MytripService,
    private globalService: GlobalService,
  ) {}

 
  ngOnInit() {
    localStorage.removeItem('getDataFromGuestLogin');
    this.dummyimg = 'assets/icons/flights/testimonials-male.png';
    this.dummyimgfemale = 'assets/icons/flights/femalenew.png';
    this.groupimg = 'assets/icons/flights/group1.png'
    this.loginemail = localStorage.getItem("loginemail");
   
  }
 
  ionViewWillEnter() {
    this.isLogin = this._authServices.loggedIn();
    this.loginemail = localStorage.getItem("loginemail");

   
  // console.log(this.isLogin)
    if(this.loginemail != null){
      this.isAnyUpdate();
      this.getUserDetails();
     
    }
  }

  getUserDetails(){
    
    this.userDetailsSubscription = this.profileControllerService.getUserProfileDetails
    .pipe(take(1))
    .subscribe(
      (profile)=>{
        if(this.isUpdateAnyInProfile && this.isUpdateAnyInProfile == true){
          console.log('load profile if any change or update')
          this.loadprofile();
        }else{
          if(profile){
            console.log('load cache data ===> ',profile)
            this.userdetail = profile["userDetails"];
            let trvllers = this.userdetail["userTraveller"];
            var filteruser = trvllers.filter(function(hero) {
              return hero.isPrimaryTraveller == 1;
            });
            this.filtereduser = filteruser[0];
            console.log(this.filtereduser)
            this.loading = false;
          }else{
            console.log('load first time profile')
            this.loadprofile();
          }
        }
       
      }
    )
  }

  isAnyUpdate(){
    this.ifUpdateChangeSubscription = this.profileControllerService.getProfileUpdateVariable
    .pipe(take(1))
    .subscribe(
      (res:any)=>{
        if(res){
          console.log('any update', res)
          this.isUpdateAnyInProfile = res
        }
         
      }
    )
  }

  backTo() {
    // this.router.navigate(["/"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }
  trips() {
    
    //this.router.navigate(["/trips-module"]);
    this.router.navigate(["/myaccount/user-profile-form/myprofile/trips"]);
  }
  addTraveller() {
   // this.router.navigate(["/add-traveller"]);
   this.router.navigate(['myaccount/user-profile-form/myprofile/add-travller']);

  }

  addTravellerGroup() {
    this.router.navigate(["/addgroup-traveller"]);
  }

  // edit traveller group //
  editTravellerGroup() {
    this.router.navigate(["/editgroup-traveller"]);
  }
  preferances() {
    //this.router.navigate(["/preferances"]);
    this.router.navigate(["/myaccount/user-profile-form/myprofile/preferances"]);

  }

  //, images
  uploadPhoto() {
    alert("Please Upload your Photo");
  }
 
  loadprofile() {
    this.profileControllerService
      .getAllProfile(this.loginemail)
      .pipe(take(1))
      .subscribe(profile => {
        console.log(profile)
        this.loadingnew = true;

        ///set login false and remove token on this mssg
        var mssg = profile["statusMessage"];
        if (mssg === "please login first to access the data") {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("token");
          this.profileControllerService.clearAllProfiletCache();
          this.router.navigate(["/login"]);
        } else {
        }

        var mssg = profile["statusMessage"];
        if (mssg === "Session timeout Please login again") {
          alert("Session timeout Please login again");
          this.router.navigate(["/login"]);
          this.profileControllerService.clearAllProfiletCache();
        } else {
        }

        if(profile['status'] == 0 && profile['statusMessage'] == 'success'){
          // this.profileControllerService.sendCurrentProfileUSerDetails(profile);
          // this.profileControllerService.sendIfProfileUpdate(false);
          this.isUpdateAnyInProfile = false;
          this.userdetail = profile["userDetails"];
          let trvllers = this.userdetail["userTraveller"];
          this.AsynChronousCallAllTrip();
          //// filter prfoile
          var filteruser = trvllers.filter(function(hero) {
            return hero.isPrimaryTraveller == 1;
          });
          this.filtereduser = filteruser[0];
          console.log('primary trvller 1 user',this.filtereduser)
        }

       
        this.loading = false;

      });


  }

  editProfile() {
    localStorage.setItem('isPrimaryTraveller','1')
    this.profileControllerService.sendselectedtravllerdata(this.filtereduser);
    //this.router.navigate(["/edit-profile-module"]);
    this.router.navigate(['myaccount/user-profile-form/myprofile/edit-travller']);

  }

  imgsList = [
    {
      imgurl: "assets/icons/flights/traveller.png",
      name: "RAM"
    },
    {
      imgurl: "assets/icons/flights/traveller2.png",
      name: "RAMYA"
    },

    {
      imgurl: "assets/icons/flights/traveller.png",
      name: "GOUDA"
    },
    {
      imgurl: "assets/icons/flights/traveller2.png",
      name: "RARE"
    },
    {
      imgurl: "assets/icons/flights/traveller.png",
      name: "UI"
    },
    {
      imgurl: "assets/icons/flights/traveller.png",
      name: "RAMAHAU"
    }
  ];

  //on click group icon/pic
  getGroup(group) {
    // alert('clicked');
    //send group data to edit page
    this.profileControllerService.sendgroupdata(group);

    // console.log(group);

    this.router.navigate(["/editgroup-traveller"]);
  }

  ////get selected travller on pic click
  getselectedtravller(traveller) {
    this.profileControllerService.sendselectedtravllerdata(traveller);

     console.log(traveller);

    //this.router.navigate(["/edit-profile-module"]);
    this.router.navigate(['myaccount/user-profile-form/myprofile/edit-travller']);

  }

  goBack() {
    // this.router.navigate(["/"]);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }

  deleteTraveller(traveller) {
    // console.log(traveller)
    this.profileControllerService
      .removetravller(traveller["travellerId"])
      .subscribe(res => {
        // console.log(res);
      });

    // this.profileControllerService
    // .removegroup(traveller["groupId"])
    // .subscribe(res => {
    //   console.log(res);
    // });
  }

payment(){
  //this.router.navigate(["/payment-option"]);
  this.router.navigate(['/myaccount/user-profile-form/myprofile/payment']);

}

ngOnDestroy(): void {
  this.userDetailsSubscription.unsubscribe();
  this.ifUpdateChangeSubscription.unsubscribe();
}


AsynChronousCallAllTrip(){
  let getUpcomingTripCall =  this.mytripService.getAllupcomingTrip(this.loginemail)
  let getRecentTripCall = this.mytripService.getAllRecentTrip(this.loginemail);
  forkJoin([getUpcomingTripCall, getRecentTripCall]).subscribe(results => {
     console.log('forkJoin combined results',results)
  });
 }


}
