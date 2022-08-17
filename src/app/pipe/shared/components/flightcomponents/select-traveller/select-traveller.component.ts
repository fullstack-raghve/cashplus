import { Component, OnInit, Inject } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from "@angular/material/bottom-sheet";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import { Router, NavigationEnd } from '@angular/router';
export class Hero {
  constructor(
    public id: number,
    public name: string,
    public power: string,
    public alterEgo?: string
  ) {}
}
@Component({
  selector: "app-select-traveller",
  templateUrl: "./select-traveller.component.html",
  styleUrls: ["./select-traveller.component.scss"]
})
export class SelectTravellerComponent implements OnInit {
  adult: any = 1;
  children: any = 0;
  infants: any = 0;
  totalNumber = 9;
  adult_child: any;
  totalTraveller: any;
  adultinc = 0;
  adultdec = 1;
  childinc = 0;
  childdec= 1;
  infantsinc = 0;
  infantsdec = 1;
  helperArray: Array<any>;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private sendTravelerData: SendTravllerDataService,
    private _bottomSheetRef: MatBottomSheetRef<SelectTravellerComponent>,
    private router: Router
  ) {
    console.log("data", data);

  }

  submit() {
    this.adult_child = this.children + this.adult;
    this.totalTraveller = this.infants + this.adult_child;
    this.totalTraveller = this.infants + this.adult_child;
    console.log(
      "Adults:" +
        this.adult +
        " " +
        "children:" +
        this.children +
        " " +
        "infants:" +
        this.infants
    );
    console.log("Numbers of Traveller :" + this.totalTraveller);
    var trvllerfield =
      "adult:" +
      this.adult +
      " " +
      "children:" +
      this.children +
      " " +
      "infants:" +
      this.infants;
    var field = {
      adult: this.adult,
      children: this.children,
      infants: this.infants,
      type: this.data.type
    };
    console.log("Details of Traveller :" + JSON.stringify(field));
    localStorage.setItem("DataForTravellers" ,JSON.stringify(field));
    this.sendTravelerData.sendTravellerCountdate(field);
    this._bottomSheetRef.dismiss({
      data:field
    });
  }
  arrayObjectadult: any = [];
  arrayObjectchild: any = [];
  arrayObjectinfant: any = [];
  DataForTravellers : any;
  ngOnInit() {
    this.getRouterDetails();
    this.DataForTravellers = localStorage.getItem("DataForTravellers");
    let val = JSON.parse(this.DataForTravellers);
    console.log(val);
    
    if (val) {
      console.log('From Local storage');
      this.adult = val.adult
      this.children = val.children;
      this.infants = val.infants;
      var field = {
        adult: this.adult,
        children: this.children,
        infants: this.infants,
        type:val.type
      };
      this.sendTravelerData.sendtravllers(field);
      this.sendTravelerData.sendTravellerCountdate(field);
      if(this.adult + this.children < 9){
        this.adultinc = 0;
      }
      if(this.adult + this.children == 9)
      {
        this.adultinc = 1; 
        this.adultdec = 0; 
        this.childinc = 1;
      }   
      if(this.adult >1)
        this.adultdec = 0;
      if (this.infants < this.adult){
        this.infantsinc = 0;
        }
      if(this.children >0)
        this.childdec = 0;
      if(this.infants > 0)
        this.infantsdec = 0;
      if(this.infants == this.adult)
        this.infantsinc = 1;
    }
    else if(this.data) {
      console.log('intial');
      this.adult = this.data.adult
      this.children = this.data.child;
      this.infants = this.data.infant;
      var field = {
        adult: this.adult,
        children: this.children,
        infants: this.infants,
        type:this.data.type
      };
      this.sendTravelerData.sendtravllers(field);
      this.sendTravelerData.sendTravellerCountdate(field);
    }
  }

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._bottomSheetRef.dismiss();
      }
    });
  }

  adultincrement() {
    if (this.adult + this.children < 9){
      this.adult += 1;
      this.adultinc = 0;
    }
    if(this.adult + this.children == 9)
    {
      this.adultinc = 1; 
      this.adultdec = 0; 
      this.childinc = 1;
    }   
    if(this.adult >1)
      this.adultdec = 0;
    if (this.infants < this.adult){
      this.infantsinc = 0;
      }
  }

  adultdecrement() {
    if (this.adult > 1) {
    this.adult -= 1;
    this.adultdec = 0;
    this.adultinc = 0;
    this.childinc = 0; 
  }
  if(this.adult == 1)
  {
    this.adultdec = 1; 
    this.adultinc=0; 
  }
     

  if(this.adult < this.infants){
    //alert('equal')
    this.infants = 0;
  }
  if(this.adult == this.infants){
    //alert('equal')
    this.infantsinc = 1;
  }
  }

  childIncrement() {
    if(this.adult + this.children < 9) {
      this.children += 1;
      this.childinc = 0; 
  }
  if(this.adult + this.children == 9)
  {
    this.childinc = 1;
    this.adultinc = 1; 
    this.childdec = 0;
  }
 
  if(this.children >0)
    this.childdec = 0;
 
}

  childDecrement() {
    if (this.children > 0) {
    this.children -= 1;
    this.childdec = 0;
    this.childinc = 0; 
    this.adultinc = 0;
    }
    if(this.children == 0)
     this.childdec = 1;
  }
  infantsIncrement() {
  if (this.infants < this.adult){
      this.infants += 1;
      this.infantsinc = 0;
    }
  if(this.infants == this.adult)
     this.infantsinc = 1;
  if(this.infants >0)
    this.infantsdec = 0;
  }
  infantsDecrement() {
    if (this.infants > 0) {
    this.infants -= 1;
    this.infantsdec = 0;
    this.infantsinc = 1;
    }
   if(this.infants == 0)
    this.infantsdec = 1;
   if(this.infants < this.adult)
     this.infantsinc = 0;
    }
    
}
