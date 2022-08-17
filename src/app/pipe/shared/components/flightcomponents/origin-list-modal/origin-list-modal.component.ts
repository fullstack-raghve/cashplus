// import { Component, OnInit } from '@angular/core';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject
} from "@angular/core";

import { Observable, Subscription, Subject } from "rxjs";
import { IonicSelectableComponent } from "ionic-selectable";
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from "@angular/material";
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  tap,
  takeUntil
} from "rxjs/operators";
import { fromEvent } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router, NavigationEnd } from "@angular/router";
import { OriginDestinationService } from "src/app/services/origin-destination.service";
import { GlobalService } from "src/app/services/global.service";
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import  *  as  airportList  from  '../../../../../../assets/airportList.json';
import { environment } from 'src/environments/environment';
class Origin {
  public location?: string;
  public airportId: number;
  public airportCode: string;
  public airportName: string;
  public status: number;
  public cityId: number;
  public countryID: number;
  public creationTime: string;
  public createdBy: number;
  public lastUpdatedBy: number;
  public lastModTime: string;
  public approvalStatus: number;
  public approvalDate: string;
  public approvalRemarks: string;
  public approvalBy: number;
}


@Component({
  selector: "app-origin-list-modal",
  templateUrl: "./origin-list-modal.component.html",
  styleUrls: ["./origin-list-modal.component.scss"]
})
export class OriginListModalComponent implements OnInit, OnDestroy {
  @ViewChild("airportSearchInput") airportSearchInput: ElementRef;

  searchText = true;
  airPortName: any;
  origins: Origin[];
  origin: Origin;
  filteredItems: any;
  airportCode: string;
  allitem: any;
  originsnew: [];
  items1 = [];
  items2 = [];
  airportlist1;
  servicedata: Subscription;
  searchAirport;
  finaldata: any;
  airportListx;
  vv3 = [];
  pcity = [];
  apiResponse: any;
  isSearching: boolean;
  selectedorigin: any;

  searcKeyWord: FormGroup;
  prefrencesFlightData;
  constructor(
    private location: Location,
    private router: Router,
    private cd: ChangeDetectorRef,
    private httpClient: HttpClient,
    private globalService: GlobalService,
    private originDestinationService: OriginDestinationService,
    private _bottomSheetRef: MatBottomSheetRef<OriginListModalComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) {
    console.log('het data', data);
    this.isSearching = false;
    this.apiResponse = [];
    this.moreitem();
  }
  getlist() {
    return this.origins;
  }
  moreitem() {
    //
  }

  allAirPortListfromServer;
  nullAirportList = false;
  airportItem = airportList;
  items = [];
  ngOnInit() {
    if(this.data && this.data['flightPrefrence']){
      this.prefrencesFlightData = this.data['flightPrefrence'];
      console.log(this.prefrencesFlightData)
    }
    // this.getallAiport();
    // let getAllAirport = JSON.parse(localStorage.getItem('allAirPort'));
    // if(getAllAirport == null){
    //   this.getallAiport();
    // }else{
    //   this.allAirPortListfromServer = getAllAirport;
    // }
    this.initializeForm();
    this.getAllPopularCity();
    this.getRouterDetails();
    // console.log(this.searcKeyWord.value);

    this.searcKeyWord.valueChanges.pipe(
      map((event: any) => {
        if (this.searcKeyWord.value.searchInput == '') {
          this.pcity = [];
          this.searchText = true;
          this.pcity = this.getAllAirport;
          this.nullAirportList = false;
          this.isSearching = false;
          if(this.pcity == undefined){
            this.nopopcity = true;
          }else{
            this.nopopcity = false;
          }
          this.cd.markForCheck();

        } else {
          if (this.searcKeyWord.value.searchInput.length > 2) {
            this.isSearching = true;
            this.nullAirportList = false;
            this.pcity = [];
            this.searchText = false;
            this.nopopcity = false;
          } else {
            this.isSearching = false;
            this.nopopcity = false;
          }

        }
        return event.searchInput;
      }),
      // if character length greater then 2
      filter(res => res.length > 2),
      // Time in milliseconds between key events
      // debounceTime(200),
      // If previous query is diffent from current
      // distinctUntilChanged()
    )
      .subscribe((text: string) => {
        // console.log(text);
        this.pcity = [];
        this.isSearching = true;
        this.nullAirportList = false;
        this.nopopcity = false;
        var requestArray =text.split(' ');
        this.items = [];
        // console.log(this.allAirPortListfromServer)
        let airportData = this.filterAirportList(this.airportItem['default'],text );
        // let airportData = this.filterAirportList(this.allAirPortListfromServer,text );
        for (var i = 0, len = airportData.length; i < len; i++){
          var airport= false;
          var city=false;
          var country=false;
          var airportCode=false;

          var airportArray=airportData[i].airportName.split(' ');
          for(var l in airportArray){
            for(var jl in requestArray){
              airport =airportArray[l].toLowerCase().startsWith(requestArray[jl].toLowerCase());
            }
            if(airport)
              break;
            
          }
          airportCode=airportData[i].airportCode.toLowerCase().indexOf(text.toLowerCase()) > -1;

          var cityArray=airportData[i].cityName.split(' ');
          for(var m in cityArray){
            for(var jm in requestArray){
              city = cityArray[m].toLowerCase().startsWith(requestArray[jm].toLowerCase());
            }
            if(city)
              break;
          }

          var countryArray=airportData[i].countryName.split(' ');
          for(var n in countryArray){
            for(var jn in requestArray){
              country = countryArray[n].toLowerCase().startsWith(requestArray[jn].toLowerCase());
            }
            if(country)
              break;
          }
          if ( airportCode || airport|| city || country ) 
						{
              this.items.push({
							  airportName : airportData[i].airportName,
							  cityName: airportData[i].cityName,
							  airportCode: airportData[i].airportCode,
							  updatedCountryName: airportData[i].updatedCountryName,
                stationType:airportData[i].stationType,
                countryName: airportData[i].countryName,
                airportId: airportData[i].airportId,
							});
            }

            if(airportCode){
              let itemsLen=this.items.length;
              // if(this.items.length>=2){
                let first=this.items[0];
                this.items[0]=this.items[itemsLen-1];
                this.items[itemsLen-1]=first;
              // }
            }
        }

        // console.log(this.items)


        let res = {
          airportList: this.items
        };

        this.nullAirportList = false;
            this.isSearching = false;
            this.nopopcity = false;
            if (res['airportList'] != null) {
              this.searchText = false;
              if ((this.pcity = [])) {
                this.pcity = res["airportList"];
                // console.log('popular city on search', this.pcity)
                this.nullAirportList = false;
                this.isSearching = false;
              }
              this.nopopcity = false;
              this.cd.markForCheck();
              this.isSearching = false;
              this.apiResponse = res;
            } else {
              if (this.searcKeyWord.value.searchInput == "") {
                this.pcity = [];
                this.searchText = true;
                this.nullAirportList = false;
                this.isSearching = false;
                this.pcity = this.getAllAirport;
                // console.log(this.pcity);
                this.cd.markForCheck();
                
                if(this.pcity == undefined){
                  this.nopopcity = true;
                }else{
                  this.nopopcity = false;
                }

              } else {
                // console.log('null result ')
                this.nullAirportList = true;
                this.isSearching = false;
                this.searchText = false;
                this.cd.markForCheck();
              }


            }

      });

  }

  getallAiport(){
    this.globalService.getAllAirportList()
    .subscribe(
      (res)=>{
        this.allAirPortListfromServer = res['airportList'];
        // localStorage.setItem('allAirPort',JSON.stringify(res['airportList']) );
      }
    )
  }
  
   filterAirportList(items: any, searchText: any): any[] {
    if (!items) return [];
    if (!searchText) return items;
  
    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item['airportCode']).toLowerCase().includes(searchText.toLowerCase()) || String(item['cityName']).toLowerCase().includes(searchText.toLowerCase()) || String(item['airportName']).toLowerCase().includes(searchText.toLowerCase()) || String(item['countryName']).toLowerCase().includes(searchText.toLowerCase());
        // if(searchText.length <= 3){
        //   return String(item['airportCode']).toLowerCase().includes(searchText.toLowerCase());
        // }else{
          // return String(item['cityName']).toLowerCase().includes(searchText.toLowerCase()) || String(item['airportName']).toLowerCase().includes(searchText.toLowerCase()) || String(item['countryName']).toLowerCase().includes(searchText.toLowerCase()) ||  String(item['airportCode']).toLowerCase().includes(searchText.toLowerCase());
        // }
      });
    });
   }

  initializeForm() {
    this.searcKeyWord = this.formBuilder.group({
      searchInput: ['']
    })
  }

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._bottomSheetRef.dismiss();
      }
    });
  }

  getOrigins() {
    this.globalService.getapiOrigin().subscribe(data => {
      console.log(data);

      for (var prop in data) {
        this.finaldata = data[prop];
        console.log(prop, ": ", this.finaldata);
        this.items2.push(this.finaldata);
      }
    });
  }
  onSelect(origin) {
    if(this.prefrencesFlightData == true){
      this._bottomSheetRef.dismiss({
        data: origin
      });
      return;
    }
    // console.log('on select origin', origin);
    this.selectedorigin = origin;
    this.originDestinationService.sendOrigin(this.selectedorigin);
    let OriginAirportCityName = origin.cityName
    localStorage.setItem("OriginAirportCityName", OriginAirportCityName);
    ////localStorage.setItem("Origin Airport Code", origin.airportCode);
    //localStorage.setItem("Origin countryID", origin.countryID);
    // console.log(origin);
    this._bottomSheetRef.dismiss({
      data: origin
    });
    //this.servicedata.unsubscribe();
  }

  ngOnDestroy() {
    this.popularCitySubcribe.unsubscribe();
  }


  search() {
    this.origins = this.origins.filter(res => {
      return res.airportCode
        .toLocaleLowerCase()
        .match(this.airportCode.toLocaleLowerCase());
    });
  }
  backTo() {
    this._bottomSheetRef.dismiss();
  }

  popularCitySubcribe: Subscription;
  getAllAirport;
  nopopcity = false;

  getAllPopularCity() {
    this.isSearching = true;

    this.popularCitySubcribe = this.originDestinationService.getpopcity().subscribe(
      (res) => {
        if (res['cityAndAirportDataList'] == null) {
          this.nopopcity = true;
          this.isSearching = false;
        }
        if (res['statusMessage'] == 'success') {
          this.isSearching = false;
          this.getAllAirport = res['cityAndAirportDataList'];
          this.pcity = res['cityAndAirportDataList'];
          // console.log('popular city response', res);
          this.nopopcity = false;
        } else if (res['popularCityRes'] == false) {
          this.isSearching = false;

        }

      }, (err) => {
        this.isSearching = false;
        console.log(err);
      }
    )
  }


  datat(){
    
  }
}

  