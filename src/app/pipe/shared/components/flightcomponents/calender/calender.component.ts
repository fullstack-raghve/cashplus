import { Component, OnInit, ViewChild, Inject, ElementRef, ChangeDetectorRef, Renderer2 } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { SendTravllerDataService } from "src/app/services/send-travller-data.service";

import { Router, NavigationEnd } from '@angular/router';
import * as moment from "moment";
import { Calendar } from 'primeng/calendar';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: "app-calender",
  templateUrl: "./calender.component.html",
  styleUrls: ["./calender.component.scss"]
})
export class CalenderComponent implements OnInit {
  dateValue: any;
  maxDate;
  departDate;
  returnDate;
  dateData;
  minimumDate = new Date();
  clickRecent = false;
  monthDepart;
  monthReturn;
  value;
  fday;
  lday;
  lsday;
  @ViewChild("myCalendar") datePicker;

  @ViewChild("activeClass") activePara: HTMLElement;


  newmin: number;
  mxDate = new Date();
  dynamicmonth: string;

  close() {
    this.datePicker.overlayVisible = false;
  }

  constructor(
    private bottomSheet: MatBottomSheet,
    private sendDateService: SendTravllerDataService,
    private _bottomSheetRef: MatBottomSheetRef<CalenderComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private elRef: ElementRef,
    private router: Router,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    //console.log('gh', data);
    this.mxDate.setDate(this.mxDate.getDate() - 1);
    this.mxDate.setMonth(this.mxDate.getMonth() + 12);
  }
  ngOnInit() {
    this.dynamicmonth = '1'
    setTimeout(() => {
     
      this.dynamicmonth = '13';
      console.log('Alligator!!!!');
      console.log(this.dynamicmonth);

    }, 2000);
    this.getHolidayList();

    const firstDay = moment('2020-04-15 00:00', 'YYYY-MM-DD h:m').startOf('month').format('D')
    const lastDay = moment('2020-04-29 00:00', 'YYYY-MM-DD h:m').endOf('month').format('D');
    //console.log(firstDay);
   // console.log(lastDay);
    this.getRouterDetails();

  

    if (this.data) {
     // console.log(this.data);
      this.clickRecent = true;
      let departDate = new Date(this.data['departure']);
      let returnDate = new Date(this.data['returnWay']);
      //  console.log(departDate);
      //  console.log(returnDate);
      this.departDate = departDate;
      this.returnDate = returnDate;
      this.monthDepart = (this.departDate).getMonth();
      this.monthReturn = (this.returnDate).getMonth();
      this.dateValue = [departDate, returnDate];
   //   console.log(this.monthDepart)

      this.setStyleIfDataSelected();

    }

    let rangeCalender
    rangeCalender = document.getElementsByClassName('rangeCalender');
   // console.log(rangeCalender)
  }

  ngAfterViewInit(): void {
    
  }

  setStyleIfDataSelected() {
    let allDivs: any;
    let hElement: HTMLElement = this.elRef.nativeElement;
    allDivs = hElement.getElementsByClassName('activeBg');
    let rangeClass;
    rangeClass = document.getElementsByClassName('rangeCalender');
    setTimeout(() => {
      if (allDivs.length != 0) {


        if (allDivs[0].classList.contains("activeBg")) {
          allDivs[0]['parentElement']['parentElement'].classList.add('CalenderstartDate');
          rangeClass[0].classList.add('setSecondClick');
        }
        if (allDivs.length == 2) {
          if (allDivs[1].classList.contains("activeBg")) {
            allDivs[1]['parentElement']['parentElement'].classList.add('CalederendDate');
            rangeClass[0].classList.add('setSecondClick');
          }
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
    console.log('Done click')
    this._bottomSheetRef.dismiss();
    this.sendDateService.senddata(this.dateData);
   // console.log(this.dateData[0])
    localStorage.setItem('DateForAll', this.dateData[0]);
   // console.log(this.dateData[1])
    localStorage.setItem('ReturnDate',this.dateData[1]);
  }
  allACtiveCLass = [];
  dateRangeSelect(event, date) {
    // console.log(this.activePara)

    const full = event;
    this.dateData = event;
    this.convert(event[0]);
    this.departDate = full[0];
    this.returnDate = full[1];
    if (this.departDate) {
      this.monthDepart = (this.departDate).getMonth();
      // console.log(this.monthDepart);
    }
    if (this.returnDate) {
      this.monthReturn = (this.returnDate).getMonth();
      // console.log(this.monthReturn);
    }
    this.setStyleCalender();

  }

  setStyleCalender() {
    var allDivs: any;
    var allUnACtive: any;
    var hElement: HTMLElement = this.elRef.nativeElement;
    allDivs = hElement.getElementsByClassName('activeBg');
     // console.log(allDivs)
    allUnACtive = hElement.getElementsByClassName('ui-datepicker-current-day');
    Array.from(allUnACtive).forEach(function (element, i) {
      let index = element['classList'].value.split(/\b(\s)/);
      element['classList'].remove('allBorderRadiusRound')
      if (index.includes('CalenderstartDate')) {
        element['classList'].remove('CalenderstartDate', 'allBorderRadiusRound', 'allSelectedDateBG')
      }
      if (index.includes('CalederendDate')) {
        element['classList'].remove('CalederendDate', 'allBorderRadiusRound')
      }
    });
    let rangeClass;
    rangeClass = document.getElementsByClassName('rangeCalender');
    rangeClass[0].classList.remove('setSecondClick');
    setTimeout(() => {
     
      if (allDivs[0].classList.contains("activeBg")) {
  
        allDivs[0]['parentElement'].classList.add('allSelectedDateBG');
        allDivs[0]['parentElement']['parentElement'].classList.add('allBorderRadiusRound');
        rangeClass[0].classList.remove('setSecondClick');
      }
      if (allDivs.length >= 2) {
       
        if (allDivs[1].classList.contains("activeBg")) {
          allDivs[1]['parentElement']['parentElement'].classList.add('CalederendDate');
          allDivs[0]['parentElement']['parentElement'].classList.add('CalenderstartDate');
          allDivs[0]['parentElement']['parentElement'].classList.remove('allBorderRadiusRound');
          allDivs[0]['parentElement'].classList.remove('allSelectedDateBG');
          rangeClass[0].classList.add('setSecondClick');
        
        }
      }
    }, 10);
  }

  updateCalendarUI(calendar: Calendar) {
   // console.log(calendar)
    // calendar.populateYearOptions(/* year from */, /* year to */);
    // calendar.updateUI();
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  convert1(str1) {
    var date = new Date(str1),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  tootipOptions = {
    'placement': 'top',
    'tooltip-class': 'new-tooltip-class'
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
    
   // console.log(this.modifiedHoliday);
   // console.log(this.listOfAllHoliday);
   // console.log(this.allHolidayListWithMonth)
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
   lastday = function(y,m){
    return  new Date(y, m +1, 0).getDate();
    }
  getSelectedDays(date) {
    var allUnACtive: any;
    var hElement: HTMLElement = this.elRef.nativeElement;
    allUnACtive = hElement.getElementsByClassName('ui-datepicker-current-day');   
     let lday =  this.lastday(date.year,date.month);   
       if(date.day == lday)
         {
        if(this.returnDate && this.departDate)
        if(this.returnDate.getDate() !=lday && this.departDate.getDate() !=lday)     
        {
          setTimeout(function(){ 
            Array.from(allUnACtive).forEach(function (element, i) {       
            if(element['children'][0]['children'][0]) 
            {
             if(element['children'][0]['children'][0]['classList'][1])
              if(element['children'][0]['children'][0]['classList'][1] == 'secondmonthColor')
                element['classList'].add('bgcolorcls');  
            }                                        
        });
      }, 50);
        return true;
        }           
      } 
  }
  currentHolidayInfo;
  holidayInfo(date) {
    let monthModified = date.month <= 9 ? `0${date.month + 1}` : date.month;
    let dayModified = date.day <= 9 ? `0${date.day}` : date.day;
    let currentdate = `${date.year}-${monthModified}-${dayModified}`;
    let tooltip;
    tooltip = document.getElementsByClassName('tooltip-show');

   // console.log(currentdate);
   // console.log(this.modifiedHoliday);

    let filterCurrentDateHoliday = this.modifiedHoliday.filter((res) => {
      if (res['gapHoliday'].includes(currentdate)) {
        return res;
      }
    });
    if (filterCurrentDateHoliday.length != 0) {
      this.currentHolidayInfo = filterCurrentDateHoliday[0];

      setTimeout(() => {
      //  console.log(tooltip);
        if (tooltip && tooltip['length'] != 0) {
          tooltip[0].classList.add('calenderTooltipClass');
        }
      }, 1);

      setTimeout(() => {
        if (tooltip && tooltip['length'] != 0) {
          tooltip[0].classList.remove('calenderTooltipClass');

        }
      }, 4000);
    } else {
      this.currentHolidayInfo = ''
    }

  //  console.log(filterCurrentDateHoliday)

  }
 

}
// let selectedHoliday = modifiedHoliday.some((date)=>{
    //   let getDiffer = moment(`${dateget.year}/${dateget.month}/${dateget.day}`).isBetween(date['startHoliday'], date['endHoliday'], null, '[]'); //true
    //   console.log(getDiffer);
    // });
    // console.log(selectedHoliday);
    //     var check = moment('2014-07-28', 'YYYY/MM/DD');
    // var month = check.format('M');
    // var day   = check.format('D');
    // var year  = check.format('YYYY');
    // holiday = [
    //   {monthN: "5", day: "19", year: "2020"},
    //   {monthN: "5", day: "20", year: "2020"},
    //   {monthN: "5", day: "21", year: "2020"},
    //   {monthN: "7", day: "24", year: "2020"},
    //   {monthN: "8", day: "11", year: "2020"},
    //     ]