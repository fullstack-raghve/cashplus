import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { filter } from "rxjs/operators";
import * as moment from "moment";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { Router, NavigationEnd } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-filter-returnway',
  templateUrl: './filter-returnway.component.html',
  styleUrls: ['./filter-returnway.component.scss'],
})
export class FilterReturnwayComponent implements OnInit {
    buttonColor;
    allData: any;
    isDisabled:boolean;

    masterSelected:boolean;
   // checklist:any;
    checkedList = [];
  
    stopageArray = [];
    departTimeArray = [];
    moneyRefundArray = [];
    allAirLinesArray = [];
    LccArray = ["LccArray" , "notLccArray"];
    stopageTypes = [
      {
        name: "Direct",
        resName: "nostop",
        click: false
      },
      {
        stopNo: "1",
        name: "Stop",
        resName: "oneStop",
        click: false
      },
      {
        stopNo: "2+",
        name: "Stop",
        resName: "twostop",
        click: false
      }
    ];
  
    moneyRefundFare = [
      {
        name: "Refundable",
        resName: "REFUNDABLE",
        click: false,
        imageUrl: "assets/icons/flights/Refundable_icon.svg"
      },
      {
        name: "Non-Refundable",
        resName: "NONREFUNDABLE",
        click: false,
        imageUrl: "assets/icons/flights/non_refundable_icon.svg"
      }
    ];
  
    allAirLinesTimeDepart = [
      {
        startTime: "3:00",
        endTime: "9:00",
        departTime: "morning",
        click: false,
        imageURL: "assets/icons/flights/filter_morning_svg.svg"
      },
      {
        startTime: "9:00",
        endTime: "15:00",
        departTime: "afternoon",
        click: false,
        imageURL: "assets/icons/flights/filter_day.svg"
      },
      {
        startTime: "15:00",
        endTime: "21:00",
        departTime: "evening",
        click: false,
        imageURL: "assets/icons/flights/filter_evening_svg.svg"
      },
      {
        startTime: "21:00",
        endTime: "3:00",
        departTime: "night",
        click: false,
        imageURL: "assets/icons/flights/filter_night_svg.svg"
      }
    ];
  repeatedFlight = [];
  checklist = [];
  oneStopflight: any;
  twostopflight: any;
  nostopflight: any;
  localconditions: string;
  checkedList1: string;
  newName = [];
  totalAirlines = [];
 
  localData: string;
  Filtered_Data: any;
  toggleLcc :any = 1;
  isLccs: any;
  userselctedflight: any[];
    constructor(
      private _bottomSheetRef: MatBottomSheetRef<FilterReturnwayComponent>,
      @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
      private router:Router,
      private cd:ChangeDetectorRef
    ) {
  
  
      
  
     }
     arr = [];
    ngOnInit() {
     
     this.getRouterDetails();
     this.checkedList1 = sessionStorage.getItem('checkedList1');
      this.localData = sessionStorage.getItem('Filtered_Data');      
      if(this.localData != null)
      {
        this.Filtered_Data = JSON.parse(sessionStorage.getItem('Filtered_Data'));
      
/////////////////////these  conditions are to show button hightlight after apply filter -- from local storre--///
        if (this.Filtered_Data['moneyRefund'].length != 0) {
          this.moneyRefundFare.forEach((element, i) => {
            this.Filtered_Data['moneyRefund'].forEach(element => {
              if (this.moneyRefundFare[i]['resName'] == element) {
                this.moneyRefundFare[i]['click'] = true;
                this.moneyRefundArray.push(element)
              }
            });
          });
        }
        if (this.Filtered_Data['stopage'].length != 0) {
          this.stopageTypes.forEach((element, i) => {
            this.Filtered_Data['stopage'].forEach(element => {
              if (this.stopageTypes[i]['resName'] == element) {
                this.stopageTypes[i]['click'] = true;
                this.stopageArray.push(element)
              }
            });
          });
        }

        if (this.Filtered_Data['departTime'].length != 0) {
          this.allAirLinesTimeDepart.forEach((element, i) => {
            this.Filtered_Data['departTime'].forEach(element => {
              if (this.allAirLinesTimeDepart[i]['departTime'] == element) {
                this.allAirLinesTimeDepart[i]['click'] = true;
                this.departTimeArray.push(element);
              }
            });
          });
        }

        if(this.Filtered_Data['Lcc'][0] == "notLccArray"){
        this.toggleLcc = 0;
       // console.log('im from if to make disbled --1')
        this.LccArray = [];
       // this.LccArray.push("LccArray");
        this.LccArray.push("notLccArray");

        }else{
        this.toggleLcc = 1;      
       

        }
      }
      else
      {
      this.arr.push("LccArray");
      this.arr.push("notLccArray");
     // console.log( this.arr);
        this.Filtered_Data ={
            stopage: [],
            moneyRefund: [],
            departTime: [],
            platingCarrierName: [],
            Lcc :this.arr
        }
      } 

      // this.masterSelected = true;
  
      this.getAllData();

      //based on flight name from local apply condition to check/uncheck checkboxes
if(this.checkedList1 != null &&  this.checkedList1.length>0){
  
   let data = JSON.parse(this.checkedList1); 
  // Here all the elements of the array is being printed. 
  for (let elements of data) { 
 
  this.newName.push(elements);
  }
  
  

  //this code is for to filter low cost price object of diffrent company
const map = new Map();
for (const item of this.allData) {
  if (!map.has(item.companyname)) {
    map.set(item.companyname, true);    // set any value to Map
    this.checklist.push({
      finalPrice: item.finalPrice,
      platingCarrier: item.companyname,
      currency:item.currency,
      pg:item.platingCarrier,
      imgname:item.imgname,
      flighttype:item.Lcc,
      isSelected: this.newName.length>0 && this.newName.includes(item.companyname) ? true : false
    });
  }
}

  
  }else{
 
//this code is for to filter low cost price object of diffrent company
const map = new Map();
for (const item of this.allData) {
  if (!map.has(item.companyname)) {
    map.set(item.companyname, true);    // set any value to Map
    this.checklist.push({
      finalPrice: item.finalPrice,
      platingCarrier: item.companyname,
      currency:item.currency,
      pg:item.platingCarrier,
      imgname:item.imgname,
      flighttype:item.Lcc,
      isSelected:false
    });
  }
}
  }
      this.getCheckedItemList();
  
    }

    getRouterDetails() {
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this._bottomSheetRef.dismiss();
        }
      });
    }
  
  
  ////check uncheck checkbox code start
  checkUncheckAll() {
    this.masterSelected = !this.masterSelected
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
    this.toggleLcc = 1;
    this.LccArray = [];
    this.LccArray.push("LccArray");
    this.LccArray.push("notLccArray");
  }
  isAllSelected(item) {
    item.isSelected =  !item.isSelected
    //console.log('return way')
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }
  
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i].platingCarrier);
    }
   
    this.userselctedflight = this.checkedList;

     this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })

      if(this.checkedList.length == 0){
        //console.log('from if no checked chkboxddd');
        this.toggleLcc = 1;
        this.checklist.forEach((item) =>{
          item.isDisabled = false;
        });
        this.LccArray = [];
          this.LccArray.push("LccArray");
          this.LccArray.push("notLccArray");
        }
  }
  
  
  ////check uncheck checkboc code end
  
  
    getAllData() {
      this.allData = this.data['data'];
      //console.log('this is total data of retrnway',this.allData);
  
      if (this.data['type'] == 'return') {
        this.allData.map(res =>{

         // res["companyname"] = res['onwardFlightOption']["platingCarrierName"];
         res["companyname"] = res['onwardFlightOption']["flightlegs"][0].carrier!=res['returnFlightOption']["flightlegs"][0].carrier ? 'Multiple Airline' : res['onwardFlightOption']["platingCarrierName"];
         // res['imgname'] = res['onwardFlightOption']['platingCarrier'];
        res['imgname'] = res['onwardFlightOption']["flightlegs"][0].carrier!=res['returnFlightOption']["flightlegs"][0].carrier ? 'multiple' : res['onwardFlightOption']["platingCarrier"];

       let flightLegsLengthreturn = res['returnFlightOption']["flightlegs"].length;
       let flightLegsLengthonward = res['onwardFlightOption']["flightlegs"].length;
   
       res["Lcc"]  = res['onwardFlightOption']['lccflight'] == true  ? "LccArray" : "notLccArray";

      res["moneyRefund"] = res['returnFlightOption']["flightFare"]["refundableInfo"] && res['returnFlightOption']["flightFare"]["refundableInfo"].replace(/-/g, "").toUpperCase();

      res["moneyRefund"] = res["moneyRefund"] == 'SREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'SNONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'S-REFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'GAL-REFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'GALREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'S-NON-REFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'GAL-NON-REFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'GAL-NONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
      res["moneyRefund"] = res["moneyRefund"] == 'GALNONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];


      res['finalPrice'] = res['t3Price'] - res['discountPrice'];
      parseInt(res['finalPrice'])

        if (flightLegsLengthreturn == 1 ||  flightLegsLengthonward == 1) {
            res.directTrip = "nostop";
            res.stopage = "nostop";
          }
          if (flightLegsLengthreturn == 2 || flightLegsLengthonward == 2) {
            res.oneTrip = "oneStop";
            res.stopage = "oneStop";
          }
          if (flightLegsLengthreturn == 3 || flightLegsLengthonward == 3) {
            res.twoTrip = "twostop";
            res.stopage = "twostop";
          }

        res["departTime"] = res['onwardFlightOption']["flightlegs"][0]["depTime"];
        res["arrivalTime"] = res['returnFlightOption']["flightlegs"][res['returnFlightOption']["flightlegs"].length - 1]["arrTime"];
        res["allAirLines"] = res["platingCarrier"];

        res["departHour"] = moment(res["departTime"], "hh:mm:ss  A").format("HH");
        res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss  A").format("HH");

          if (res["departHour"] >= 3 && res["departHour"] < 9) {
            res["departTime"] = "morning";
          } else if (res["departHour"] >= 9 && res["departHour"] < 15) {
            res["departTime"] = "afternoon";
          } else if (res["departHour"] >= 15 && res["departHour"] < 21) {
            res["departTime"] = "evening";
          } else if (res["departHour"] >= 21 && res["departHour"] < 24) {
            res["departTime"] = "night";
          } else if (res["departHour"] >= 0 && res["departHour"] < 3) {
            res["departTime"] = "night";
          }

        });
  
  
       this.allData.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });

    this.isLccs =  this.allData.filter((res) =>{
      return res.Lcc == "LccArray";
    })

    //////////////////////remove flights with negative values
    this.allData = this.allData.filter(function(flighdata){ 
  //console.log(flighdata)
  return  flighdata.totalBaseFare + flighdata.totalTax + flighdata.totalFee + flighdata.markupPrice + flighdata.serviceChargePrice - flighdata.discountPrice > 0
});
  //  console.log('these are lcc true flight',this.isLccs);
    //console.log('these are lcc true flight',this.isLccs.length);

    //console.log('this is data of checklist',this.checklist);

 if(this.Filtered_Data['Lcc'][0] == "notLccArray"){
  //('im from if to make disbled --4')
  //console.log('type of chklist length',this.checklist.length)
//console.log('im from if to make disbled --4')
setTimeout(() => {
  //console.log('type of chklist length',this.checklist.length)
  this.checklist.map(element => {
   // console.log('fff',element)
      if(element.flighttype == "LccArray"){
        element['isDisabled'] = true;
      }
    });
    //console.log('cccccc',this.checklist);
    this.cd.detectChanges();
}, 1000);



        }else{
       

        }

   


        for (var i = 0; i < this.checklist.length; i++) {
         
          this.totalAirlines.push(this.checklist[i].platingCarrier);
          //this.checkedList.push(this.checklist[i].platingCarrier);
        }


/////button hide show on basis of length

      ///every method //twostop
      this.oneStopflight =this.allData.filter(function(flight) {
        return (
              flight.stopage == "oneStop" 
            );
          });
    
          this.twostopflight =this.allData.filter(function(flight) {
            return (
                  flight.stopage == "twostop" 
                );
              });
    
              this.nostopflight =this.allData.filter(function(flight) {
                return (
                      flight.stopage == "nostop" 
                    );
                  });




      }
  
    }
  
    filterPlainArray() {
    //  let dd = this.checkedList
      let condition:any = {
         stopage: this.stopageArray,
         moneyRefund: this.moneyRefundArray,
         departTime: this.departTimeArray,
         //companyname: this.checkedList,
         companyname: this.checkedList.length>0 ? this.checkedList : this.totalAirlines,
         Lcc:this.LccArray

      };
      
     // console.log('req body of filter',condition);
     

   

      sessionStorage.setItem('userselectedflight',JSON.stringify(this.userselctedflight));
      sessionStorage.setItem('condition',condition);
      sessionStorage.setItem('checkedList1',JSON.stringify(this.checkedList));
      sessionStorage.setItem('Filtered_Data', JSON.stringify(condition));
      



      const filterKeys = Object.keys(condition);
      return this.allData.filter(eachObj => {
        return filterKeys.every(eachKey => {
          if (!condition[eachKey].length) {
            return true; // passing an empty filter means that filter is ignored.
          }
          return condition[eachKey].includes(eachObj[eachKey]);
        });
      });
    }
  
    callFinalMethod(): void {
      let finalResult = this.filterPlainArray();
     // console.log('after final  filterd ', finalResult);

     
//////////////////////remove flights with negative values
let finalResultPostive = finalResult.filter(function(flighdata){ 
  //console.log(flighdata)
  return  flighdata.totalBaseFare + flighdata.totalTax + flighdata.totalFee + flighdata.markupPrice + flighdata.serviceChargePrice - flighdata.discountPrice > 0
});
  
      // this._bottomSheetRef.dismiss({
      //   data: finalResult
      // });

      this._bottomSheetRef.dismiss({
        data: finalResultPostive
      });
    }
  
    getStopageType(item) {
      if (item["click"] == false) {
        this.stopageArray.push(item["resName"]);
        item["click"] = true;
      } else if (item["click"] == true) {
        this.stopageArray.splice(this.stopageArray.indexOf(item["resName"]), 1);
        item["click"] = false;
      }
      let emptySet = new Set(this.stopageArray);
      this.stopageArray = Array.from(emptySet);
      //console.log("stop type", this.stopageArray);
    }
  
    getMoneyType(item) {
      if (item["click"] == false) {
        this.moneyRefundArray.push(item["resName"]);
        item["click"] = true;
      } else if (item["click"] == true) {
        this.moneyRefundArray.splice(
          this.moneyRefundArray.indexOf(item["resName"]),
          1
        );
        item["click"] = false;
      }
      let emptySet = new Set(this.moneyRefundArray);
      this.moneyRefundArray = Array.from(emptySet);
     // console.log("money refund ", this.moneyRefundArray);
    }

    getLcc(){


      if(this.toggleLcc == 1)
      {
//console.log('i m from 1')

        this.masterSelected = false;

        this.LccArray = [];
        this.LccArray.push("notLccArray");
        this.toggleLcc = 0;
        //console.log(this.LccArray);
this.checkedList = [];
       ////make not lcc / gds cheked 
        this.checklist.forEach((item) =>{
          if(item.flighttype == 'notLccArray'){
            item.isSelected = true;
            this.checkedList.push(item.platingCarrier);
          }else{
            item.isDisabled = true;
          }
        });

             ////make  lcc uncheked
             this.checklist.forEach((item) =>{
              if(item.flighttype == 'LccArray'){
                item.isSelected = false;
               // this.checkedList.push(item.platingCarrier);
              }
            });

      let xx =   this.checklist.filter((items) =>{
         return items.flighttype == 'notLccArray'
        });

       // console.log('these are checked gds flights',xx);
       // console.log('these are platting carrer of gds flights',this.checkedList)
       sessionStorage.setItem('checkedList1',JSON.stringify(this.checkedList));

        // this.checkedList = [];
        // for (var i = 0; i < this.checklist.length; i++) {
        //   if(this.checklist[i].isSelected = true)
        //   this.checkedList.push(this.checklist[i].platingCarrier);
        // }
        // console.log('i am from lcc',this.checkedList);

      }
      else
      {
        
this.checkedList = [];
       // this.LccArray.push("notLccArray");
      //  this.LccArray.splice(
      //   this.LccArray.indexOf("notLccArray"),
      //   1
      // );
      this.LccArray = [];
      this.LccArray.push("LccArray");
      this.LccArray.push("notLccArray");
        this.toggleLcc = 1;
        //console.log(this.LccArray);

               ////make not lcc un-checkedcheked 

        this.checklist.forEach((item) =>{
          item.isDisabled = false;

          if(item.flighttype == 'notLccArray'){
            item.isSelected = false;
           
          }
        });
      
      //  localStorage.setItem('checkedList1',JSON.stringify(this.checkedList));

      }
  
    }


    getDepartTime(item) {
      if (item["click"] == false) {
        this.departTimeArray.push(item["departTime"]);
        item["click"] = true;
      } else if (item["click"] == true) {
        this.departTimeArray.splice(
          this.departTimeArray.indexOf(item["departTime"]),
          1
        );
        item["click"] = false;
      }
      let emptySet = new Set(this.departTimeArray);
      this.departTimeArray = Array.from(emptySet);
      //console.log("Depart time ", this.departTimeArray);
    }
  
    
  
    clearAll() {
      //this.masterSelected =  false;

      this.masterSelected = false;

this.checklist.forEach((item) =>{
  item.isSelected = false;
});

      // alert();
      this.stopageTypes.forEach((item) =>{
        item.click = false;
      });
      this.moneyRefundFare.forEach((item) =>{
       item.click = false;
     });
     this.allAirLinesTimeDepart.forEach((item) =>{
       item.click = false;
     })
      
       localStorage.removeItem('click');
       sessionStorage.removeItem('click');

       this.stopageArray = [];
       this.departTimeArray = [];
       this.moneyRefundArray = [];
       this.allAirLinesArray = [];
       this.LccArray = [];
      //  this.LccArray.splice(
      //   this.LccArray.indexOf("notLccArray"),1);
        this.LccArray.push("LccArray");
        this.LccArray.push("notLccArray");

        this.toggleLcc = 1;
        this.Filtered_Data = {
          stopage: [],
          moneyRefund: [],
          departTime: [],
          platingCarrierName: [],
          Lcc :this.LccArray
     }
     this.checkedList = [];

     this.checklist.forEach((item) =>{
      item.isDisabled = false;
    });
     localStorage.removeItem('Filtered_Data');
     localStorage.removeItem('checkedList1');

     sessionStorage.removeItem('Filtered_Data');
     sessionStorage.removeItem('checkedList1');
   }




   
  
  }
  
