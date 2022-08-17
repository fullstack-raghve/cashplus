import { Component, OnInit, ViewChild, Inject, ElementRef } from "@angular/core";
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from "@angular/material";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";
import { GlobalService } from "src/app/services/global.service";
import { Subscription } from "rxjs";
import { Router, NavigationEnd } from '@angular/router';
import * as moment from "moment";
@Component({
  selector: "app-onewaycalender",
  templateUrl: "./onewaycalender.component.html",
  styleUrls: ["./onewaycalender.component.scss"]
})
export class OnewaycalenderComponent implements OnInit {
  dateValue: any;
  maxDate;
  departDate;
  returnDate;
  dateData;
  minimumDate;
  monthDepart;
  mainDate;
  mainMonth;
  // minimumDate = new Date('Fri Dec 13 2019 00:00:00 GMT+0530 (India Standard Time)');
  // minimumDate = new Date('2020-01-01Z00:00:00:000');
  //localStorage.setItem('multidate',this.addresses[this.newindexorigin]['date']);
  @ViewChild("myCalendar") datePicker;
  mxDate = new Date();
  mltidate: string;
  multsub: Subscription;

  close() {
    this.datePicker.overlayVisible = false;
  }

  constructor(
    private bottomSheet: MatBottomSheet,
    private globalService: GlobalService,
    private sendDateService: SendTravllerDataService,
    private _bottomSheetRef: MatBottomSheetRef<OnewaycalenderComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private router: Router,
    private elRef: ElementRef,
  ) {
    this.mxDate.setDate(this.mxDate.getDate()-1);  
    this.mxDate.setMonth(this.mxDate.getMonth()+12);  
  }
  ngOnInit() {
    this.getHolidayList();
    this.getRouterDetails();
    this.multsub = this.globalService.getMultidate().subscribe(mdate => {
      console.log(mdate);
      this.mltidate = mdate;

      if (this.mltidate) {
        this.minimumDate = new Date(this.mltidate);
      } else {
        this.minimumDate = new Date();
      }
    });
    let DateForAll = localStorage.getItem("DateForAll"); 
     if(DateForAll){
       console.log(DateForAll); 
       let departDate = new Date(DateForAll);
       console.log(departDate);
        // this.dateValue = departDate;
        // this.dateData = departDate;
        // if( this.dateData)
        // this.monthDepart=(this.dateData).getMonth();
     
        this.mainDate =  departDate;
          console.log(this.mainDate);
        if(this.mainDate)
          this.mainMonth =(this.mainDate).getMonth();    
       this.setStyleIfRecentSearchClick();
     }
    // if (this.data) {
    //   console.log(this.data);
    //   let departDate = new Date(this.data["departure"]);
    //   console.log(departDate);
    //   this.dateValue = departDate;
    //   this.dateData = departDate;
    //   if( this.dateData)
    //    this.monthDepart=(this.dateData).getMonth();
    //   this.setStyleIfRecentSearchClick();
    // }
  }

  setStyleIfRecentSearchClick(){
    var allDivs: any;
    var allUnACtive: any;
    var hElement: HTMLElement = this.elRef.nativeElement;
    allDivs = hElement.getElementsByClassName('bgOneWayCalederBGActive');
    console.log(allDivs)
    allUnACtive = hElement.getElementsByClassName('ui-datepicker-current-day');
    let rangeClass;
    rangeClass = document.getElementsByClassName('rangeCalender');
   
      setTimeout(() => {
        if (allDivs.length != 0) {
        if (allDivs[0].classList.contains("bgOneWayCalederBGActive")) {
          allDivs[0]['parentElement'].classList.add('allSelectedDateBG');
          allDivs[0]['parentElement']['parentElement'].classList.add('allBorderRadiusRound');
          rangeClass[0].classList.add('setSecondClick');
        }
      }
      }, 5000);
  }
    
  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._bottomSheetRef.dismiss();
      }
    });
  }

  submit() {
    this._bottomSheetRef.dismiss({value:true});
    if(this.dateData == undefined)
    {
     let DateForAll = localStorage.getItem("DateForAll"); 
     if(DateForAll)
       console.log(DateForAll); 
       let departDate = new Date(DateForAll);
       this.dateData = departDate;
    }
    this.sendDateService.sendonewaycalenderdata(this.dateData);
   // this.sendDateService.sendonewaycalenderdata(this.dateData);
    localStorage.setItem('DateForAll',this.dateData);
    localStorage.setItem('ReturnDate',null);
  }

  dateRangeSelect(event, date) {
    //console.log(event);
    const full = event;
    // console.log(full);
    this.dateData = event;

    this.departDate = full[0];
    if( this.dateData)
       this.monthDepart=(this.dateData).getMonth();

       this.mainDate =   this.dateData;
       console.log(this.mainDate);
     if(this.mainDate)
       this.mainMonth =(this.mainDate).getMonth();    
       this.setStyleCalender();

  }

  setStyleCalender() {
    var allDivs: any;
    var allUnACtive: any;
    var hElement: HTMLElement = this.elRef.nativeElement;
    allDivs = hElement.getElementsByClassName('bgOneWayCalederBGActive');
    console.log(allDivs)
    allUnACtive = hElement.getElementsByClassName('ui-datepicker-current-day');
    Array.from(allUnACtive).forEach(function (element, i) {
      let index = element['classList'].value.split(/\b(\s)/);
      element['classList'].remove('allBorderRadiusRound')
      if (index.includes('CalenderstartDate')) {
        element['classList'].remove('CalenderstartDate', 'allBorderRadiusRound', 'allSelectedDateBG')
      }
    });

    let rangeClass;
    rangeClass = document.getElementsByClassName('oneWayCalendar');
    rangeClass[0].classList.remove('setSecondClick');

      setTimeout(() => {
        if (allDivs[0].classList.contains("bgOneWayCalederBGActive")) {
          allDivs[0]['parentElement'].classList.add('allSelectedDateBG');
          allDivs[0]['parentElement']['parentElement'].classList.add('allBorderRadiusRound');
          rangeClass[0].classList.add('setSecondClick');
        }
      }, 10);
  }


  
  tootipOptions = {
    'placement': 'top',
  }

  holidayList;
  modifiedHoliday = [];
  listOfAllHoliday = [];
  allHolidayListWithMonth = [];

  getHolidayList() {
    this.holidayList = JSON.parse(localStorage.getItem('currentCountryHoliday'));
    if(this.holidayList ==  null)
      return;
     
    this.holidayList.forEach(element => {
      let hDate = moment(element["holidayToDate"], "YYYY/MM/DD");
      this.modifiedHoliday.push({
        startHoliday: moment(element["holidayFromDate"], "YYYY/MM/DD").format("YYYY-MM-DD"),
        endHoliday: moment(element["holidayToDate"], "YYYY/MM/DD").format("YYYY-MM-DD"),
        holidayName: element['holidayName'],
        gapHoliday: this.allHolidaysArray(moment(element["holidayFromDate"], "YYYY/MM/DD").format("YYYY/MM/DD"), moment(element["holidayToDate"], "YYYY/MM/DD").format("YYYY/MM/DD")),
        monthHoliday:(Number(hDate.format('M')))
      })
    });

    this.modifiedHoliday.forEach((date, i) => {
      if (date) {
        this.listOfAllHoliday.push(...this.allHolidaysArray(date['startHoliday'], date['endHoliday']))
      }
    });

    this.listOfAllHoliday.forEach(element => {
      let hDate = moment(element, 'YYYY-MM-DD');
      this.allHolidayListWithMonth.push({
        monthN: (Number(hDate.format('M')) - 1),
        day: hDate.format('D'),
        year: hDate.format('YYYY')
      })
    });
    
    //console.log(this.modifiedHoliday);
    //console.log(this.listOfAllHoliday);
    //console.log(this.allHolidayListWithMonth)
  }

  delay: any;
  tooltip: HTMLElement;
  // Returns an array of dates between the two dates
  allHolidaysArray(startDate, endDate) {
    startDate = moment(startDate);
    endDate = moment(endDate);
    var now = startDate, dates = [];

    while (now.isBefore(endDate) || now.isSame(endDate)) {
      dates.push(now.format('YYYY-MM-DD'));
      now.add(1, 'days');
    }
    return dates;
  };


  getSelected(date) {
    if (this.allHolidayListWithMonth.some(holiday => holiday.monthN == date.month && holiday.day == date.day && holiday.year == date.year)) {
      return true;
    } else {
    }
  }
  currentHolidayInfo;
  holidayInfo(date) {
    let monthModified = date.month <= 9 ? `0${date.month + 1}` : date.month;
    let dayModified = date.day <= 9 ? `0${date.day}` : date.day;
    let currentdate = `${date.year}-${monthModified}-${dayModified}`;
    let tooltip;
    tooltip = document.getElementsByClassName('tooltip-show');

    console.log(currentdate);
    console.log(this.modifiedHoliday);

    let filterCurrentDateHoliday = this.modifiedHoliday.filter((res) => {
      if (res['gapHoliday'].includes(currentdate)) {
        return res;
      }
    });
    if (filterCurrentDateHoliday.length != 0) {
      this.currentHolidayInfo = filterCurrentDateHoliday[0];

      setTimeout(() => {
        console.log(tooltip);
        if (tooltip && tooltip['length'] != 0) {
          tooltip[0].classList.add('calenderTooltipClass');
        }
      }, 500);

      setTimeout(() => {
        if (tooltip && tooltip['length'] != 0) {
          tooltip[0].classList.remove('calenderTooltipClass');

        }
      }, 4000);
    } else {
      setTimeout(() => {
        console.log(tooltip);
        if (tooltip && tooltip['length'] != 0) {
          tooltip[0].classList.add('noToolTip');
        }
      }, 1);
      this.currentHolidayInfo = ''
    }

    console.log(filterCurrentDateHoliday)

  }


  ngOnDestroy() {
    this.multsub.unsubscribe();
    // localStorage.removeItem('multidate')
  }
}
