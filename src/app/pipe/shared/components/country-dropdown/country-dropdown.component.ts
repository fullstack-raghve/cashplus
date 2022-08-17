import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators, FormBuilder, ControlValueAccessor } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as country from "../../../../constants/countries.constant";
@Component({
  selector: 'app-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CountryDropdownComponent)
    },
  ]
})
export class CountryDropdownComponent implements OnInit,ControlValueAccessor, OnDestroy {

  onChange: (val: string) => void;
  onTouched: () => void;

  /** list of banks */
  // protected banks: Bank[] = BANKS;

  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect') singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  allCountry =[];
  copyAllCOuntry =  country.countries;
currentCountry = localStorage.getItem('countryCode')
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllCountry();
    this.createform();
    // load the initial bank list
    // console.log(this.allCountry)
    this.filteredBanks.next(this.allCountry.slice());
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
      // this.change(toSelect['countryCode'])
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getAllCountry() {
    this.copyAllCOuntry.forEach(res => {
      this.allCountry.push({
        countryCode: res.dial_code,
        countryName: res.name,
        value: res.code.toLowerCase(),
        countrycodename: res.dial_code + ' '+ res.name,
        without_plus: res.dial_code.substr(1),
        // flagUrl: `https://lipis.github.io/flag-icon-css/flags/4x3/${res.code.toLowerCase()}.svg`
        flagUrl: `assets/flags/4x3/${res.code.toLowerCase()}.svg`
      });
    });
  }

  protected filterBanks() {
    if (!this.allCountry) {
      return;
    }
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.allCountry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
  // console.log(this.allCountry)
    this.filteredBanks.next(
      this.allCountry.filter(bank => 
        bank.countrycodename.toLowerCase().indexOf(search) == 0 ||
        bank.value.toLowerCase().indexOf(search) == 0 ||
        bank.countryName.toLowerCase().indexOf(search) == 0 ||  bank.without_plus.toLowerCase().indexOf(search) == 0)
    );
  
  }
  countryForm:FormGroup;

  createform() {
    this.countryForm = this.fb.group({
      countryCode: ["", Validators.required],
    });
  }
  touch() {
    this.onTouched();
  }

  change(val: any) {
    console.log('value',val)
    this.onChange(val);
  }

  writeValue(value: string) {
    console.log(`write value ${value}`);
  if(value){
    const toSelect = this.allCountry.find(
      c => c.countryCode == value
    );
    this.bankCtrl.setValue(toSelect);
  }
  // else{
  //   const toSelect = this.allCountry.find(
  //     c => c.value == this.currentCountry
  //   );
  //   this.bankCtrl.setValue(toSelect);
  // }
    
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
    console.log('onChange')
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
    console.log('onTouched')
  }

  setDisabledState() { }

   flagUrl(value): string {
    //  console.log(value)
    return `https://lipis.github.io/flag-icon-css/flags/4x3/${value.toLowerCase()}.svg`;
  }
}
