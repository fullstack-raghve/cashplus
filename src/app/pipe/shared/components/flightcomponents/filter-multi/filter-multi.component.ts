import { Component, OnInit, Inject } from "@angular/core";
import { filter } from "rxjs/operators";
import * as moment from "moment";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-filter-multi',
  templateUrl: './filter-multi.component.html',
  styleUrls: ['./filter-multi.component.scss'],
})
export class FilterMultiComponent implements OnInit {
  buttonColor;
  allData: any;

  masterSelected: boolean;
  // checklist:any;
  checkedList: any;

  stopageArray = [];

  departTimeArray = [];
  moneyRefundArray = [];
  allAirLinesArray = [];
  LccArray = ["LccArray", "notLccArray"];
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
  toggleLcc: any = 1;
  isLccs: any;
  lenth0: number;
  lenth1: number;
  lenth2: number;
  lenth3: number;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<FilterMultiComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private router: Router
  ) {




  }
  arr = [];
  // ngOnInit() {
  //   console.log("before filter", this.data);
  // this.getRouterDetails();

  //   this.localData = localStorage.getItem('Filtered_Data');
  //   this.Filtered_Data = JSON.parse(localStorage.getItem('Filtered_Data'));
  //   console.log(this.localData);
  //   if(this.localData != null)
  //   {

  //       if(this.Filtered_Data &&  this.Filtered_Data.Lcc[0] == "notLccArray") 
  //        this.toggleLcc = 0;
  //                else
  //        this.toggleLcc = 1;        
  //   }
  //   else
  //   {
  //     this.arr.push("LccArray");
  //     this.arr.push("notLccArray");
  //     console.log( this.arr);
  //     this.Filtered_Data ={
  //         stopage: [],
  //         moneyRefund: [],
  //         departTime: [],
  //         Lcc :this.arr
  //     }
  //   }  
  //   this.checkedList1 = localStorage.getItem('checkedList1')

  //   console.log( this.Filtered_Data);
  //   console.log("before filter", this.data);
  //   this.getAllData();
  //   this.getCheckedItemList();

  // }
  ngOnInit() {
    this.getRouterDetails();
    this.checkedList1 = sessionStorage.getItem('checkedList1');
    this.localData = sessionStorage.getItem('Filtered_Data');
    if (this.localData != null) {
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
              console.log(this.departTimeArray);
            }
          });
        });
      }

      if (this.Filtered_Data && this.Filtered_Data.Lcc[0] == "notLccArray")
        this.toggleLcc = 0;
      else
        this.toggleLcc = 1;

    }
    else {
      this.arr.push("LccArray");
      this.arr.push("notLccArray");
      console.log(this.arr);
      this.Filtered_Data = {
        stopage: [],
        moneyRefund: [],
        departTime: [],
        platingCarrierName: [],
        Lcc: this.arr
      }
    }

    // this.masterSelected = true;

    this.getAllData();

    // //based on flight name from local apply condition to check/uncheck checkboxes
    // if (this.checkedList1 != null && this.checkedList1.length > 0) {
    //   // console.log('hello from if')
    //   // console.log(this.checkedList1);
    //   let data = this.checkedList1;
    //   // Here all the elements of the array is being printed. 
    //   for (let elements of data) {
    //     console.log(elements);
    //     this.newName.push(elements);
    //   }

    //   // console.log(this.newName);


    //   //this code is for to filter low cost price object of diffrent company
    //   const map = new Map();
    //   for (const item of this.allData) {
    //     if (!map.has(item.companyname)) {
    //       map.set(item.companyname, true);    // set any value to Map
    //       this.checklist.push({
    //         finalPrice: item.finalPrice,
    //         platingCarrier: item.companyname,
    //         currency: item.currency,
    //         pg: item.platingCarrier,
    //         imgname: item.imgname,
    //         flighttype: item.Lcc,
    //         isSelected: this.newName.length > 0 && this.newName.includes(item.companyname) ? true : false,
    //         optionSegmentBean: item.optionSegmentBean
    //       });
    //     }
    //   }


    // } else {

    //   //this code is for to filter low cost price object of diffrent company
    //   const map = new Map();
    //   for (const item of this.allData) {
    //     if (!map.has(item.companyname)) {
    //       map.set(item.companyname, true);    // set any value to Map
    //       this.checklist.push({
    //         finalPrice: item.finalPrice,
    //         platingCarrier: item.companyname,
    //         currency: item.currency,
    //         pg: item.platingCarrier,
    //         imgname: item.imgname,
    //         flighttype: item.Lcc,
    //         isSelected: false,
    //         optionSegmentBean: item.optionSegmentBean
    //       });
    //     }
    //   }
    // }
    this.getCheckedItemList();

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
  }
  isAllSelected(item) {
    console.log(item)
    item.isSelected = !item.isSelected
    console.log('one way')
    this.masterSelected = this.checklist.every(function (item: any) {
      if (item.isSelected == true)
        item["click"] = true;
      else
        item["click"] = false;
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {

  


    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      // console.log(this.checklist[i])
      // console.log(this.checklist[i].click)
      if (this.checklist[i].isSelected) {
        this.checklist[i]["click"] = true;
        this.checkedList.push(this.checklist[i].platingCarrier);
      }

    }
    // this.checkedList = JSON.parse(this.checkedList);
    console.log(this.checkedList);
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
  }


  ////check uncheck checkboc code end
  getd() {
    if (this.checkedList1 != null && this.checkedList1.length > 0) {
      // console.log('hello from if')
      // console.log(this.checkedList1);
      let data = JSON.parse(this.checkedList1); 
      // Here all the elements of the array is being printed.
      for (let elements of data) {
        if (elements)
          this.newName.push(elements);
      }

      // console.log(this.newName);


      const map = new Map();
      for (const item of this.allData) {
        if (!map.has(item.companyname)) {
          map.set(item.companyname, true);    // set any value to Map
          this.checklist.push({
            finalPrice: item.finalPrice,
            platingCarrier: item.companyname,
            currency: item.supplierCurrency,
            pg: item.platingCarrier,
            imgname: item.imgname,
            flighttype: item.Lcc,
            isSelected: this.newName.length > 0 && this.newName.includes(item.companyname) ? true : false,
            optionSegmentBean: item.optionSegmentBean
          });
        }
      }

    } else {
      // console.log('hello from else')

      const map = new Map();
      for (const item of this.allData) {
        if (!map.has(item.companyname)) {
          map.set(item.companyname, true);    // set any value to Map
          this.checklist.push({
            finalPrice: item.finalPrice,
            platingCarrier: item.companyname,
            currency: item.supplierCurrency,
            pg: item.platingCarrier,
            imgname: item.imgname,
            flighttype: item.Lcc,
            isSelected: this.newName.length > 0 && this.newName.includes(item.companyname) ? true : false,
            optionSegmentBean: item.optionSegmentBean

          });
        }
      }
      console.log(this.checklist)
    }
  }

  getAllData() {
    this.allData = this.data['data'];
    console.log(this.allData);
    if (this.data['type'] == 'multicity') {
      this.allData.map(res => {
        //let flightLegsLength = res["flightlegs"].length;

        // if (flightLegsLength == 1) {
        //   res.directTrip = "nostop";
        //   res.stopage = "nostop";
        // }
        // if (flightLegsLength == 2) {
        //   res.oneTrip = "oneStop";
        //   res.stopage = "oneStop";
        // }
        // if (flightLegsLength == 3) {
        //   res.twoTrip = "twostop";
        //   res.stopage = "twostop";
        // }




        res["moneyRefund"] = res["flightFare"]["refundableInfo"].replace(/-/g, "").toUpperCase();
        
        res["moneyRefund"] = res["moneyRefund"] == 'SREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'SNONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'S-REFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'GAL-REFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'GALREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'S-NON-REFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'GAL-NON-REFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'GAL-NONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
        res["moneyRefund"] = res["moneyRefund"] == 'GALNONREFUNDABLE' ? res["moneyRefund"] = 'NONREFUNDABLE' : res["moneyRefund"];
  
  
  

        res['finalPrice'] = res['flightFare']['t3Price'] - res['flightFare']['discountPrice'];
        res["departTime"] = res['optionSegmentBean'][0]["flightlegs"][0]["depTime"];
        res["arrivalTime"] = res['optionSegmentBean'][res['optionSegmentBean'].length - 1]["flightlegs"][["flightlegs"].length - 1]["arrTime"];
        res["departHour"] = moment(res["departTime"], "hh:mm:ss A").format("HH");
        res["arivalHour"] = moment(res["arrivalTime"], "hh:mm:ss A").format("HH");
        res["Lcc"]  = res['lccflight'] == true  ? "LccArray" : "notLccArray";

        res["companyname"] = res['optionSegmentBean'][0]["flightlegs"][0].carrier!=res['optionSegmentBean'][1]["flightlegs"][0].carrier ? 'Multiple_Airline' : res["platingCarrierName"];
        res['imgname'] = res['optionSegmentBean'][0]["flightlegs"][0].carrier!=res['optionSegmentBean'][1]["flightlegs"][0].carrier ? 'multiple' : res["platingCarrier"];

        // res["platingCarrierName"] = res['optionSegmentBean'][0]["flightlegs"][0].carrier!=res['optionSegmentBean'][1]["flightlegs"][0].carrier ? 'Multiple Airline' : res["platingCarrierName"];

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

        ///code for stoppage 

      //  console.log(res['optionSegmentBean'][0]["flightlegs"].length)
      //  console.log(res['optionSegmentBean'][0]["flightlegs"].length-1)
        if (res['optionSegmentBean'][0]["flightlegs"].length - 1 == 0) {
        //  console.log(res['optionSegmentBean'][0]["flightlegs"].length - 1)
          this.lenth0 = res['optionSegmentBean'][0]["flightlegs"].length - 1;

        }
        if (res['optionSegmentBean'][1]["flightlegs"].length - 1) {
        //  console.log(res['optionSegmentBean'][1]["flightlegs"].length - 1)
          this.lenth1 = res['optionSegmentBean'][1]["flightlegs"].length - 1;

        }
        if (res['optionSegmentBean'][2] && res['optionSegmentBean'][2]["flightlegs"].length - 1) {
        //  console.log(res['optionSegmentBean'][2]["flightlegs"].length - 1)
          this.lenth2 = res['optionSegmentBean'][2]["flightlegs"].length - 1;

        }
        if (res['optionSegmentBean'][3] && res['optionSegmentBean'][3]["flightlegs"].length - 1) {
        //  console.log(res['optionSegmentBean'][3]["flightlegs"].length - 1)
          this.lenth3 = res['optionSegmentBean'][3]["flightlegs"].length - 1;

        }
        // if(res['optionSegmentBean'][4] && res['optionSegmentBean'][4]["flightlegs"].length-1){
        //   this.lenth3 = res['optionSegmentBean'][3]["flightlegs"].length-1;

        // }

        // let lenth4 = res['optionSegmentBean'][4]["flightlegs"].length-1;

        // let lenth5 = res['optionSegmentBean'][5]["flightlegs"].length-1;


        if (this.lenth0 == 0 || this.lenth1 == 0) {
       //   console.log(this.lenth0)
          res.directTrip = "nostop";
          res.stopage = "nostop";
        }
        if (this.lenth0 == 1 || this.lenth1 == 1) {
        //  console.log(this.lenth1)
          res.oneTrip = "oneStop";
          res.stopage = "oneStop";
        }
        if (this.lenth0 == 2 || this.lenth1 == 2) {
        //  console.log(this.lenth0)
          res.twoTrip = "twostop";
          res.stopage = "twostop";
        }
      })




      this.allData.sort(function (a, b) { return a['finalPrice'] - b['finalPrice'] });

      this.isLccs = this.allData.filter((res) => {
        return res.Lcc == "LccArray";
      })
      // console.log('these are lcc true flight', this.isLccs);
      console.log('these are lcc true flight', this.isLccs.length);

                //////////////////////remove flights with negative values
                this.allData = this.allData.filter(function(flighdata){ 
                  //console.log(flighdata)
                  return flighdata.flightFare.totalBaseFare + flighdata.flightFare.totalTax + flighdata.flightFare.totalFees + flighdata.flightFare.markupPrice + flighdata.flightFare.serviceChargePrice - flighdata.flightFare.discountPrice > 0
                });
                
                         //////////////////////


      this.getd();


     




      ///every method //twostop
      this.oneStopflight = this.allData.filter(function (flight) {
        return (
          flight.stopage == "oneStop"
        );
      });
      console.log('oneStop flights', this.oneStopflight);

      this.twostopflight = this.allData.filter(function (flight) {
        return (
          flight.stopage == "twostop"
        );
      });
      console.log('twostop flights', this.twostopflight);

      this.nostopflight = this.allData.filter(function (flight) {
        return (
          flight.stopage == "nostop"
        );
      });
      console.log('nostop flights', this.nostopflight);
      console.log('after adding variable', this.allData);


    }

  }

  filterPlainArray() {
    let condition = {
      stopage: this.stopageArray,
      moneyRefund: this.moneyRefundArray,
      departTime: this.departTimeArray,
      companyname: this.checkedList,
      Lcc: this.LccArray
      // platingCarrierName: this.checkedList1 && this.checkedList1.length != 0 ? this.checkedList1 : this.checkedList

    };
    let condition2 = {
      stopage: this.stopageArray,
      moneyRefund: this.moneyRefundArray,
      departTime: this.departTimeArray,
      Lcc: this.LccArray

    };

    console.log(condition);
    // console.log(this.allData)

    sessionStorage.setItem('Filtered_Data', JSON.stringify(condition));

    sessionStorage.setItem('checkedList1', JSON.stringify(this.checkedList));

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
    console.log('after filterd', finalResult);

       //////////////////////remove flights with negative values
       let finalResultMulticity = finalResult.filter(function(flighdata){ 
        //console.log(flighdata)
        return flighdata.flightFare.totalBaseFare + flighdata.flightFare.totalTax + flighdata.flightFare.totalFees + flighdata.flightFare.markupPrice + flighdata.flightFare.serviceChargePrice - flighdata.flightFare.discountPrice > 0
      });
      
               //////////////////////

    this._bottomSheetRef.dismiss({
      data: finalResultMulticity,
    });

    // this._bottomSheetRef.dismiss({
    //   data: finalResult,
    // });
  }

  getStopageType(item) {
    if (item["click"] == false) {
      this.stopageArray.push(item["resName"]);
      item["click"] = true;
      sessionStorage.setItem('click', item["click"]);
    } else if (item["click"] == true) {
      this.stopageArray.splice(this.stopageArray.indexOf(item["resName"]), 1);
      item["click"] = false;
      sessionStorage.setItem('click', item["click"]);
    }
    let emptySet = new Set(this.stopageArray);
    this.stopageArray = Array.from(emptySet);
    console.log("stop type", this.stopageArray);
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
    console.log("money refund ", this.moneyRefundArray);
  }
  getLcc() {
    if (this.toggleLcc == 1) {

      this.LccArray = [];
      this.LccArray.push("notLccArray");
      this.toggleLcc = 0;
      console.log(this.LccArray);
    }
    else {
      // this.LccArray.push("notLccArray");
      //  this.LccArray.splice(
      //   this.LccArray.indexOf("notLccArray"),
      //   1
      // );
      this.LccArray = [];
      this.LccArray.push("LccArray");
      this.LccArray.push("notLccArray");
      this.toggleLcc = 1;
      console.log(this.LccArray);
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
    console.log("Depart time ", this.departTimeArray);
  }

  clearAll() {
    this.masterSelected = false;
    this.checklist.forEach((item) =>{
      item.isSelected = false;
    });

    this.stopageTypes.forEach((item) => {
      item.click = false;
    });
    this.moneyRefundFare.forEach((item) => {
      item.click = false;
    });
    this.allAirLinesTimeDepart.forEach((item) => {
      item.click = false;
    })

    localStorage.removeItem('click');
    sessionStorage.removeItem('click');

    this.stopageArray = [];
    this.departTimeArray = [];
    this.moneyRefundArray = [];
    this.allAirLinesArray = [];
    // this.LccArray.splice(
    //this.LccArray.indexOf("notLccArray"),1);
    // this.LccArray.push("LccArray");
    // this.LccArray.push("notLccArray");
    this.toggleLcc = 1;
    this.Filtered_Data = {
      stopage: [],
      moneyRefund: [],
      departTime: [],
      // platingCarrierName: [],
      Lcc: this.LccArray,
      companyname: []
    }

    ////on clear uncheck the checkbox-

    this.checkedList = [];
    // for (var i = 0; i < this.checklist.length; i++) {
    //   if(this.checklist[i].isSelected)
    //   this.checkedList.push(this.checklist[i].platingCarrierName);
    // }
    // this.checkedList = JSON.stringify(this.checkedList);
    // console.log(this.checkedList);
    this.checklist.every(function (item: any) {
      return item.isSelected == false;
    })

    /////end

    localStorage.removeItem('Filtered_Data');
    sessionStorage.removeItem('Filtered_Data');

    console.log(this.Filtered_Data);
    //localStorage.removeItem('checkedList1')
  }

}