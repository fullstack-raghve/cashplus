import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  Inject
} from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatSnackBar } from "@angular/material";
import { Router, NavigationEnd } from "@angular/router";
import { ProfileControllerService } from "src/app/services/profile-controller.service";
import { Subscription } from "rxjs";
import swal from 'sweetalert2';
import { ModalController } from '@ionic/angular';
import { GuestLoginComponent } from '../../../common shared component/guest-login/guest-login.component';
@Component({
  selector: "app-pick-traveller",
  templateUrl: "./pick-traveller.component.html",
  styleUrls: ["./pick-traveller.component.scss"]
})
export class PickTravellerComponent implements OnInit, OnDestroy {
  adultcall: boolean;
  childcall: boolean;
  infantcall: boolean;
  userdetail: any;
  filteruser: any;
  filtereduser: any;
  loading = true;

  sliderOpts = {
    zoom: false,
    slidesPerView: 3,
    spaceBetween: 5
  };
  finaltrvller: any;
  adultsubscribe: Subscription;
  chilsubscribe: Subscription;
  infantsubscribe: Subscription;
  filteradult: any;
  filterchild: any;
  filterinfant: any;
sendCurrentID;
  loginemail: string;
  constructor(
    private bottomSheetRef: MatBottomSheetRef,
    private cd: ChangeDetectorRef,
    private router: Router,
    private _snackBar: MatSnackBar,
    private profileControllerService: ProfileControllerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public modalController: ModalController,
  ) {}
  getAllData = this.data;
  currentIndex;
  selectedAdultIdArray;
childArray;
InfantArray;
dummMaleImage;
dummyFemaleImage;
dummyimg:any;
selectedTravellerId;

adult_male_icon_dummy = 'assets/traveller_icons/male_adult.png';
  adult_female_icon_dummy = 'assets/traveller_icons/female_adult.png';

  child_male_icon_dummy = 'assets/traveller_icons/boy_child.png';
  child_female_icon_dummy = 'assets/traveller_icons/girl_child.png';

  infant_male_icon_dummy = 'assets/traveller_icons/boy_infant.png';
  infant_female_icon_dummy = 'assets/traveller_icons/girl_infant.png';

  defaultIcon= 'assets/icons/flights/flaticon.svg';
  ngOnInit() {
    this.getRouterDetails();
    this.dummyimg = 'assets/icons/flights/testimonials-male.png';
    this.dummMaleImage = 'assets/icons/flights/testimonials-male.png';
    this.dummyFemaleImage = 'assets/icons/flights/femalenew.png';
    this.loginemail =  localStorage.getItem('loginemail')

   if(this.data != null){
    this.sendCurrentID = this.data['index'];
    //console.log(this.sendCurrentID)

    this.selectedAdultIdArray = this.data['seletedAdultArray']
    this.childArray = this.data['seletedChildtArray']
    this.InfantArray = this.data['seletedInfanttArray'];
    this.selectedTravellerId = this.data['currentTravllerId']
   }
    this.loadprofile();
    this.getCalls();
  }

  ionViewWillEnter() {

  }

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.bottomSheetRef.dismiss();
      }
    });
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

  
  addTravellerDetails() {
    this.bottomSheetRef.dismiss({
      'add':true,
      currentID: this.sendCurrentID,
    });
    // this.profileControllerService.sendCurrentUrlToComponent(this.router.url)
  }

  getCalls() {
    this.adultsubscribe = this.profileControllerService
      .getcall()
      .subscribe(res => {
        // //console.log(res);

        this.adultcall = res;
        this.cd.markForCheck();
      });
    this.chilsubscribe = this.profileControllerService
      .getcall1()
      .subscribe(res => {
        // //console.log(res);
        this.childcall = res;
      });
    this.infantsubscribe = this.profileControllerService
      .getcall2()
      .subscribe(res => {
        // //console.log(res);

        this.infantcall = res;
      });
  }

  ngOnDestroy(): void {
    this.adultsubscribe.unsubscribe();
    this.chilsubscribe.unsubscribe();
    this.infantsubscribe.unsubscribe();
    // //console.log("unsubscribed");
  }

allTravellerData;

  loadprofile() {
    this.profileControllerService.getAllProfile(this.loginemail).subscribe(profile => {
      if(profile){
        //console.log(profile);
       
        var mssg = profile["statusMessage"];
        if (mssg == "please login first to access the data" || mssg == "Session timeout Please login again") {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("token");
          this.profileControllerService.clearAllProfiletCache();
          swal.fire('', 'Session timeout please login again!').then(
            (res) => {
              if (res['value'])
                this.openGuestLogin();
            }
          );
        }
  
        this.userdetail = profile["userDetails"];
        let trvllers = this.userdetail["userTraveller"];
        this.cd.markForCheck();
  
        let travellerType = this.getAllData["travllerType"];
        this.allTravellerData= trvllers.filter(function(adult) {
          if(travellerType == 'Adult'){
            return adult.travellerType == travellerType || ((adult.title ==  null || adult.title ==  '') && (adult.travellerType == null || adult.title ==  '') && adult.isPrimaryTraveller == 1);
          }
          return adult.travellerType == travellerType;
          
        });
        // //console.log("traveller type", travellerType);
        // //console.log('all data by fiter',this.allTravellerData);
        this.allTravellerData.forEach(element => {
         delete element['currentlySelected'];
         delete element['alreadySelected'];
        });
        this.loading = false;
        if(this.selectedAdultIdArray.length != 0){
          //  let result = this.allTravellerData.filter( el => (-1 == this.selectedAdultIdArray.indexOf(el.travellerId)) );
  
          this.allTravellerData.forEach((trav,i) => {
            if(this.selectedAdultIdArray.length != 0){
              if(trav.travellerId ==  this.selectedTravellerId){
                trav['currentlySelected'] = true;
              }
              if(this.selectedAdultIdArray.includes(trav.travellerId)){
                trav['alreadySelected'] = true;
              }
            }
          });
  
          //  //console.log(this.allTravellerData)
        }
       if(this.childArray.length != 0){
  
        this.allTravellerData.forEach((trav,i) => {
          if(this.childArray.length != 0){
            if(trav.travellerId ==  this.selectedTravellerId){
              trav['currentlySelected'] = true;
            }
            if(this.childArray.includes(trav.travellerId)){
              trav['alreadySelected'] = true;
            }
          }
        });
  
  
          // let result = this.allTravellerData.filter( el => (-1 == this.childArray.indexOf(el.travellerId)) );
          // this.allTravellerData = result;
       }
       if(this.InfantArray.length != 0){
        this.allTravellerData.forEach((trav,i) => {
          if(this.InfantArray.length != 0){
            if(trav.travellerId ==  this.selectedTravellerId){
              trav['currentlySelected'] = true;
            }
            if(this.InfantArray.includes(trav.travellerId)){
              trav['alreadySelected'] = true;
            }
          }
        });
        // let result = this.allTravellerData.filter( el => (-1 == this.InfantArray.indexOf(el.travellerId)) );
        // // //console.log(result);
     }
  
        var filteruser = trvllers.filter(function(hero) {
          return hero.isPrimaryTraveller == 1;
        });
        this.filtereduser = filteruser[0];
        this.finaltrvller = trvllers;
      }
    });
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
        // //console.log(data);
        // //console.log(data.data.dismissed);
        if(data){
           this.isClosePopup = true;
           this.loadprofile();
        }
        
      });
    return await modal.present();
  }



  getAge() {
    const getAge1 = birthDate =>
      Math.floor((+new Date() - new Date(birthDate).getTime()) / 3.15576e10);

    // today is 2018-06-13
    // //console.log(getAge1(age))
    //let getage = getAge1(age)

    //   const ages = [];
    //  var newage =  ages.push(getage,)

    //  //console.log(ages)
    //     let olderThan12 = ages.filter((age) => age > 12);
    //     //console.log(olderThan12);
  }

  selectedItem;

  getselectedtravlleradult(traveller) {
    //console.log(traveller);
    this.selectedItem = traveller;
    if(traveller['travellerType'] == 'Adult'){
      this.selectedAdultIdArray.push(traveller['travellerId']);
      // //console.log(this.selectedAdultIdArray)
      this.profileControllerService.sendselectedtravllerdataadult(traveller);
      this.bottomSheetRef.dismiss({
        currentID: this.sendCurrentID,
        add:false
        // selectedAdultArray:this.selectedAdultIdArray
      });
    }
    if(traveller['travellerType'] == 'child'){
      this.childArray.push(traveller['travellerId']);
      // //console.log(this.childArray)
      this.profileControllerService.sendselectedtravllerchild(traveller);
      this.bottomSheetRef.dismiss({
        currentID: this.sendCurrentID,
        add:false
        // selectedChildArray:this.childArray
      });
    }
    if(traveller['travellerType'] == 'Infant'){
      this.InfantArray.push(traveller['travellerId']);
      // //console.log(this.InfantArray)
      this.profileControllerService.sendselectedtravllerinfant(traveller);
      this.bottomSheetRef.dismiss({
        currentID: this.sendCurrentID,
        add:false
        // selectedInfantArray:this.InfantArray
      });
    }
    if((traveller.title ==  null || traveller.title ==  '') && (traveller.travellerType == null || traveller.travellerType == '') && traveller.isPrimaryTraveller == 1){
      //console.log('no title',traveller);
      this.selectedAdultIdArray.push(traveller['travellerId']);
      // //console.log(this.selectedAdultIdArray)
      this.profileControllerService.sendselectedtravllerdataadult(traveller);
      this.bottomSheetRef.dismiss({
        currentID: this.sendCurrentID,
        add:false
        // selectedAdultArray:this.selectedAdultIdArray
      });
    }
  }

  getselectedtravllerinfant(infant) {
    this.profileControllerService.sendselectedtravllerinfant(infant);
  }

  getselectedtravllerchild(child) {
    this.profileControllerService.sendselectedtravllerchild(child);
  }
}
