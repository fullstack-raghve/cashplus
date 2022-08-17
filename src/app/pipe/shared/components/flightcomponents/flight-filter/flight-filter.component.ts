import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { filter } from "rxjs/operators";
import * as moment from "moment";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { json } from '@rxweb/reactive-form-validators';
import { Router, NavigationEnd } from '@angular/router';
import { FlightService } from "src/app/services/flight.service";
import * as $ from 'jquery';
@Component({
  selector: "app-flight-filter",
  templateUrl: "./flight-filter.component.html",
  styleUrls: ["./flight-filter.component.scss"]
})
export class FlightFilterComponent implements OnInit {
  buttonColor;
  allData: any;
  isDisabled:boolean;
  masterSelected:boolean;
 // checklist:any;
  checkedList:any;
  formdata;
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
  nostopflight: any;
  twostopflight: any;
  oneStopflight: any;
  Filtered_Data: any;
  checkedList1: any;
  newName = [];
  localData: string;
  toggleLcc :any;
  isLccs: any;
  totalCheckedLength: any;
  totalgdsCheckedLength: any;
  GDScheckedList: any[];
  LCCcheckedList: any[];
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<FlightFilterComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private router: Router,
    private flightService: FlightService,
    private cd:ChangeDetectorRef
  ) {


   

   }
   arr = [];
  ngOnInit() {

      // console.log("before filter", this.data);
  this.getRouterDetails();
  this.checkedList1 = sessionStorage.getItem('checkedList1');
    this.localData = sessionStorage.getItem('Filtered_Data');
    this.Filtered_Data = JSON.parse(sessionStorage.getItem('Filtered_Data'));
    // console.log(this.localData);
    if(this.localData != null)
    {

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
        this.departTimeArray.push(element)
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
  // console.log('im from else to make disbled --1')
 // this.LccArray = [];
  //this.LccArray = [];

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
          Lcc :this.arr
      }
    }  
    

    // console.log( this.Filtered_Data);
    // console.log("before filter", this.data);
    this.getAllData();
    this.getCheckedItemList();
   this.getCheckedItemListGDS();
   this.getCheckedItemListLCC();

  }



  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._bottomSheetRef.dismiss();
      }
    });
  }

checkUncheckAll() {
  this.masterSelected = !this.masterSelected;
  for (var i = 0; i < this.checklist.length; i++) {
    this.checklist[i].isSelected = this.masterSelected;
  }
  this.getCheckedItemList();
  this.getCheckedItemListGDS();
  this.getCheckedItemListLCC();
  this.toggleLcc = 1;
  this.LccArray = [];
  this.LccArray.push("LccArray");
  this.LccArray.push("notLccArray");
}
isAllSelected(item) {
  item.isSelected =  !item.isSelected
  // console.log('one way')
  this.masterSelected = this.checklist.every(function(item:any) {
      return item.isSelected == true;
    })
  this.getCheckedItemList();
  this.getCheckedItemListGDS();
  this.getCheckedItemListLCC();
}

getCheckedItemList(){
  this.checkedList = [];
  for (var i = 0; i < this.checklist.length; i++) {
    if(this.checklist[i].isSelected)
    this.checkedList.push(this.checklist[i].platingCarrierName);
  }
  
  this.totalCheckedLength = this.checkedList;
  

  this.masterSelected = this.checklist.every(function(item:any) {
    return item.isSelected == true;
  });

if(this.checkedList.length == 0){
// console.log('from if no checked chkboxddd');
this.toggleLcc = 1;
//this.isDisabled = false; 
this.checklist.forEach((item) =>{
  item.isDisabled = false;
});
}
}

getCheckedItemListGDS(){
  this.GDScheckedList = [];
  for (var i = 0; i < this.checklist.length; i++) {
    if(this.checklist[i].flighttype == 'notLccArray')
    this.GDScheckedList.push(this.checklist[i].platingCarrierName);
  }
 
}
getCheckedItemListLCC(){
  this.LCCcheckedList = [];
  for (var i = 0; i < this.checklist.length; i++) {
    if(this.checklist[i].flighttype == 'LccArray')
    this.LCCcheckedList.push(this.checklist[i].platingCarrierName);
  }
 
}


////check uncheck checkboc code end


  getAllData() {
    this.allData = this.data['data'];
// console.log(this.allData);
    if (this.data['type'] == 'oneWay') {
      this.allData.map(res => {
        let flightLegsLength = res["flightlegs"].length;

        if (flightLegsLength == 1) {
          res.directTrip = "nostop";
          res.stopage = "nostop";
        }
        if (flightLegsLength == 2) {
          res.oneTrip = "oneStop";
          res.stopage = "oneStop";
        }
        if (flightLegsLength == 3) {
          res.twoTrip = "twostop";
          res.stopage = "twostop";
        }

         res["moneyRefund"] = res["flightFare"]["refundableInfo"] && res["flightFare"]["refundableInfo"].replace(/-/g, "").toUpperCase();
        
         res["moneyRefund"] = res["moneyRefund"] == 'SREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'SNONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'S-REFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'GAL-REFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'GALREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'S-NON-REFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'GAL-NON-REFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'GAL-NONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
         res["moneyRefund"] = res["moneyRefund"] == 'GALNONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
   
   
        res["departTime"] = res["flightlegs"][0]["depTime"];
        res["arrivalTime"] = res["flightlegs"][res["flightlegs"].length - 1]["arrTime"];
        res["allAirLines"] = res["platingCarrierName"];
        res["Lcc"]  = res["lccflight"] == true ? "LccArray" : "notLccArray";
        res["departHour"] = moment(res["departTime"], "hh:mm:ss  A").format("HH");
        res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss  A").format("HH");
       
        res['finalPrice'] = res["flightFare"]['t3Price'] - res["flightFare"]['discountPrice']
        parseInt(res['finalPrice'])
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
this.allData = this.data['data'].filter(function(flighdata){ 
  //console.log(flighdata)
  return flighdata.flightFare.totalBaseFare + flighdata.flightFare.totalTax + flighdata.flightFare.totalFees + flighdata.flightFare.markupPrice + flighdata.flightFare.serviceChargePrice - flighdata.flightFare.discountPrice > 0
});
  //////////////////////
      // console.log('these are lcc true flight',this.isLccs);
      // console.log('these are lcc true flight',this.isLccs.length);



 
if(this.checkedList1 != null &&  this.checkedList1.length>0){
// console.log('hello from if')
  // console.log(this.checkedList1);
  let data = JSON.parse(this.checkedList1);
// Here all the elements of the array is being printed.
for (let elements of data) {
// console.log(elements);
this.newName.push(elements);
}

// console.log(this.newName);


const map = new Map();
for (const item of this.allData) {
  if (!map.has(item.platingCarrierName)) {
    map.set(item.platingCarrierName, true);    // set any value to Map
    this.checklist.push({
      finalPrice: item.finalPrice,
      platingCarrierName: item.platingCarrierName,
      supplierCurrency:item.supplierCurrency,
      platingCarrier: item.platingCarrier,
      flighttype:item.Lcc,
      isSelected: this.newName.length>0 && this.newName.includes(item.platingCarrierName) ? true : false
     
    });
  }
}

}else{
  // console.log('hello from else')

  const map = new Map();
      for (const item of this.allData) {
        if (!map.has(item.platingCarrierName)) {
          map.set(item.platingCarrierName, true);    // set any value to Map
          this.checklist.push({
            finalPrice: item.finalPrice,
            platingCarrierName: item.platingCarrierName,
            supplierCurrency:item.supplierCurrency,
            platingCarrier: item.platingCarrier,
            flighttype:item.Lcc,

          //  isSelected :true
           
          });
        }
      }
      // console.log(this.checklist)
}


////////////////disabled chkboc when from locl code

if(this.Filtered_Data['Lcc'][0] == "notLccArray"){
  // console.log('im from if to make disbled --4')
  // console.log('type of chklist length',this.checklist.length)
//console.log('im from if to make disbled --4')
setTimeout(() => {
  // console.log('type of chklist length',this.checklist.length)
  this.checklist.map(element => {
    // console.log('fff',element)
      if(element.flighttype == "LccArray"){
        element['isDisabled'] = true;
      }
    });
    // console.log('cccccc',this.checklist);
    this.cd.detectChanges();
}, 1000);



        }else{
       

        }

   



//////////////end code

   
      // console.log('after adding variable', this.allData);

     
 

      ///every method //twostop
      this.oneStopflight =this.allData.filter(function(flight) {
    return (
          flight.stopage == "oneStop"
        );
      });
      // console.log('oneStop flights',this.oneStopflight);

      this.twostopflight =this.allData.filter(function(flight) {
        return (
              flight.stopage == "twostop"
            );
          });
          // console.log('twostop flights',this.twostopflight);

          this.nostopflight =this.allData.filter(function(flight) {
            return (
                  flight.stopage == "nostop"
                );
              });
              // console.log('nostop flights',this.nostopflight);
 

    }

  }


  

  filterPlainArray() {
    let condition = {
      stopage: this.stopageArray,
       moneyRefund: this.moneyRefundArray,
       departTime: this.departTimeArray,
       platingCarrierName: this.checkedList,
       Lcc:this.LccArray
      // platingCarrierName: this.checkedList1 && this.checkedList1.length != 0 ? this.checkedList1 : this.checkedList

    }; 
     ///console.log('req body of filter',condition);
    



    sessionStorage.setItem('Filtered_Data', JSON.stringify(condition));
    sessionStorage.setItem('checkedList1',JSON.stringify(this.checkedList));

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
     //console.log('after filterd', finalResult);

     //////////////////////remove flights with negative values
let finalresultPositive = finalResult.filter(function(flighdata){ 
  //console.log(flighdata)
  return flighdata.flightFare.totalBaseFare + flighdata.flightFare.totalTax + flighdata.flightFare.totalFees + flighdata.flightFare.markupPrice + flighdata.flightFare.serviceChargePrice - flighdata.flightFare.discountPrice > 0
});
  //////////////////////


    // this._bottomSheetRef.dismiss({
    //   data: finalResult
    // });

    this._bottomSheetRef.dismiss({
      data: finalresultPositive
    });
  }

  getStopageType(item) {
    if (item["click"] == false) {
      this.stopageArray.push(item["resName"]);
      item["click"] = true;
      //localStorage.setItem('click',item["click"]);
      sessionStorage.setItem('click',item["click"]);

    } else if (item["click"] == true) {
      this.stopageArray.splice(this.stopageArray.indexOf(item["resName"]), 1);
      item["click"] = false;
     // localStorage.setItem('click',item["click"]);
      sessionStorage.setItem('click',item["click"]);

    }
    let emptySet = new Set(this.stopageArray);
    this.stopageArray = Array.from(emptySet);
    // console.log("stop type", this.stopageArray);
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
      this.masterSelected = false;

      this.LccArray = [];
      this.LccArray.push("notLccArray");
      this.toggleLcc = 0;
      // console.log(this.LccArray);
      // console.log(this.LccArray);
      this.checkedList = [];
             ////make not lcc / gds cheked 
              this.checklist.forEach((item) =>{
                if(item.flighttype == 'notLccArray'){
                  item.isSelected = true;
                  this.checkedList.push(item.platingCarrierName);
                  //this.totalcheckgds.push(item.platingCarrierName);
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

              this.totalgdsCheckedLength=this.checkedList.length;
      
              // console.log('these are checked gds flights',xx);
              // console.log('these are platting carrer of gds flights',this.checkedList);
              // console.log('total gds checked  flight length',this.checkedList.length);
            //  console.log('total checked flight',this.totalCheckedLength);
              // console.log('total gds cheked flight', this.totalgdsCheckedLength);

              // console.log('total checked flight finall',this.checkedList);

              //localStorage.setItem('checkedList1',JSON.stringify(this.checkedList));
              sessionStorage.setItem('checkedList1',JSON.stringify(this.checkedList));

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
      // console.log(this.LccArray);
      this.checkedList = [];

      this.checklist.forEach((item) =>{
        item.isDisabled = false;
        if(item.flighttype == 'notLccArray'){
          item.isSelected = false;
         
        }
      });
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
    // console.log("Depart time ", this.departTimeArray);
  }

  // clearAll() {
  //   this.stopageArray = [];
  // }
  applyfinalclear(){
    this.clearAll();
  }

  clearAll() {
this.masterSelected = false;
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
    this.LccArray.push("LccArray");
    this.LccArray.push("notLccArray");
      this.toggleLcc = 1;
    this.Filtered_Data ={
      stopage: [],
      moneyRefund: [],
      departTime: [],
      platingCarrierName: [],
     Lcc :this.LccArray
     
  }

  ////on clear uncheck the checkbox-
  this.checklist.forEach((item) =>{
    item.isSelected = false;
  });
  this.checkedList = [];
  // console.log('total checked flight finall',this.checkedList);
  //this.isDisabled = false; 
  this.checklist.forEach((item) =>{
    item.isDisabled = false;
  });
  //: 
  localStorage.removeItem('Filtered_Data');
  localStorage.removeItem('checkedList1');

  sessionStorage.removeItem('Filtered_Data');
  sessionStorage.removeItem('checkedList1');
  if(this.checkedList.length == 0){
    // console.log('from if no checked chkboxddd');
    this.toggleLcc = 1;

    }
}

}