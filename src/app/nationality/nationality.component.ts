import { Component, OnInit, Inject, ChangeDetectorRef, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import * as country from "../constants/new-countries.constant";
import { OffsetTopDirective } from '../directives/offset-top.directive';
import { ScrollableDirective } from '../directives/scrollable.directive';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss'],
})
export class NationalityComponent implements OnInit, AfterViewInit {

  getFormControlname;
  @ViewChildren(OffsetTopDirective) listItems: QueryList<OffsetTopDirective>;
  @ViewChild(ScrollableDirective) list: ScrollableDirective;
 currentIndexCountry;
 searcKeyWord: FormGroup;
 selectedCountryCode;
 ifIsdCodeControl = false;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<NationalityComponent>, private http: HttpClient, private router: Router,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
   // console.log(this.data);
    if(this.data && this.data['formfield'] == "isdCode"){
      this.ifIsdCodeControl = true;
    }else{
      this.ifIsdCodeControl = false;
    }
    this.allCountryList = this.data['currentCountryList']
    this.initializeForm();
    this.getFormControlname = this.data['formfield'];
    this.selectedCountryCode = this.data['selectedCurrentValue'] ? this.data['selectedCurrentValue']: '';
   
    this.getAllNewCountry();
    this.searcKeyWord.valueChanges.subscribe(
      (res)=>{
        if(res['searchText'].length == 0){
           this.getSelectedCoountry();
        }
      }
    )
  }

  ngAfterViewInit() {
    this.getSelectedCoountry();
  }

  getSelectedCoountry(){
    if (this.data['selectedCurrentValue']) {
      console.log(this.data['selectedCurrentValue']);
      if(this.data['formfield'] == 'country' || this.data['formfield'] == 'isdCode' || this.data['formfield'] == 'nationality'){

        this.currentIndexCountry = this.allCountry.findIndex(country => country.phoneCode == this.data['selectedCurrentValue']);
        this.currentIndexCountry = this.allCountry.findIndex(country => country.phoneCode == this.data['selectedCurrentValue']);

      }else{
        this.currentIndexCountry = this.allCountry.findIndex(country => country.countryName == this.data['selectedCurrentValue']);
      }
     
      setTimeout(() => {
        this.list.scrollTop = this.listItems.find((_, i) => i == this.currentIndexCountry).offsetTop - 200
      }, 200);
    }
  }

  
  initializeForm() {
    this.searcKeyWord = this.formBuilder.group({
      searchText: ['']
    })
  }
  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._bottomSheetRef.dismiss();
      }
    });
  }

  allCountry;
  allCountryList: any;
  newCountryList = [];
  getAllNewCountry() {
    this.allCountryList.forEach(element => {
      this.newCountryList.push({
        countryCode: element["countryCode"],
        countryId: element["countryId"],
        countryName: element["countryName"],
        phoneCode: element['phoneCode'],
        // flagUrl: `assets/flags/4x3/${element.countryCode.toLowerCase()}.svg`
      });
    });
    this.allCountry = this.newCountryList;
  }
  closeCountryList() {
    this._bottomSheetRef.dismiss();
  }

  selectCountry(item) {
    this._bottomSheetRef.dismiss({
      currentCountrySelected: item,
      currentFieldSelected: this.getFormControlname
    });
  }
  clearText(){
    this.searcKeyWord.get('searchText').setValue('');
  }


}

// {
  // countryCode: "CZ"
  // countryId: 58
  // countryName: "Czech Republic"
  // phoneCode: "+420"
// }
