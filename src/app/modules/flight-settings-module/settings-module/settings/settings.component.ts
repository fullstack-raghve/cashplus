import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "src/app/services/global.service";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { windowWhen } from 'rxjs/operators';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit, OnDestroy {
  title: string = "Settings";
  settingForm: FormGroup;
  bannerurl: any;
  array: any;
  bannerToShow: any;
  servicedata: any;
  countryId: any;
  servicedata2: any;
  array2: any;
  bannerToShow2: any;
  menuurl: any;
  bannerToShownew: any;
  service: Subscription;
  language: any;
  countries: any;
  defaultcountry: any;
  defaultcountryName: any;
  dafaultcname: any;
  bresponse: any;
  branchCode: any;
  branchCurrencyCode: any;
  branchId: any;
  countryCode: any;
  groupId: any;
  aed: string;
  settingdata: any;
  cname: any;
  currency: any;
  cookieValue: string;
  SettingsCname: any;
  SettingsCurrency: any;
  SettingsLanguage: any;
  localSettingsCurrency: string;
  localSettingsCname: string;
  CurrencyCode = [];
  selected :any;
  ccode: string;
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private profileControllerService: ProfileControllerService,
    private globalService: GlobalService
  ) {}
  ngOnInit() {
    this.creatform();
    this.loaddashboard();
    let countryCode = localStorage.getItem('countryCode');
    this.ccode = countryCode;
    //console.log(countryCode)
    if(countryCode != null){
      this.setCountryCodeToURL = countryCode.toLowerCase();
    }
  }
 
  getCurrencyCodeByCOuntryId(id){
    //console.log("id is:-"+id);
    this.CurrencyCode = [];
    this.globalService.getDashboardByid(id).subscribe(res => {
     //console.log(res["countryList"].length);
     for(var i=0;i<res["countryList"].length;i++)
    {     
      if(res["countryList"][i].countryId == id)
      {
        this.CurrencyCode.push({countryId :res["countryList"][i]["branchResponse"]["branchCurrencyCode"]},{countryId : "USD"})
        this.selected = res["countryList"][i]["branchResponse"]["branchCurrencyCode"];
        this.settingForm.patchValue({
          currency: this.selected
        });
        break;
      }     
    } 
     //console.log(this.CurrencyCode);
     //console.log(this.selected)
    });
  }
  
  login() {
    sessionStorage.removeItem('booking-type');

    //console.log(this.settingForm.value);
    this.profileControllerService.sendCurrentUrlToComponent3(this.router.url);
    this.settingdata = this.settingForm.value;

    this.globalService.sendsettingdata(this.settingdata);

    this.SettingsCname = this.settingdata.country;
    this.SettingsCurrency = this.settingdata.currency;
    this.SettingsLanguage = this.settingdata.language;

    ///on submit form set these value in local for next time visit --we have to show user to these field
    //console.log(this.settingdata["country"]);
    //console.log(this.settingdata["currency"]);
    localStorage.setItem("selectedCountry", this.settingdata["country"]);

    localStorage.setItem("SettingsCurrency", this.SettingsCurrency);
    localStorage.setItem("SettingsLanguage", this.SettingsLanguage);

    const getUrlGa = window.localStorage.getItem("gaURL");

    if (this.setCountryCodeToURL == "ae") {              // UAE
      window.localStorage.setItem("gaTagCode", "UA-60319074-20");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-20";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ng") {      // Nigeria
      window.localStorage.setItem("gaTagCode", "UA-60319074-21");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-21";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "gh") {      // Ghana
      window.localStorage.setItem("gaTagCode", "UA-60319074-22");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-22";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "sa") {       // Saudi Arabia
      window.localStorage.setItem("gaTagCode", "UA-60319074-38");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-38";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ke") {      // Kenya
      window.localStorage.setItem("gaTagCode", "UA-60319074-39");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-39";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "za") {      // South Africa
      window.localStorage.setItem("gaTagCode", "UA-60319074-40");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-40";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ma") {      // Morroco
      window.localStorage.setItem("gaTagCode", "UA-60319074-41");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-41";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "tz") {      // Tanzania
      window.localStorage.setItem("gaTagCode", "UA-60319074-42");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-42";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "mu") {      // Mauritius
      window.localStorage.setItem("gaTagCode", "UA-60319074-43");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-43";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ug") {      // Uganda
      window.localStorage.setItem("gaTagCode", "UA-60319074-44");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-44";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "cd") {      // DRC
      window.localStorage.setItem("gaTagCode", "UA-60319074-45");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-45";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "zw") {      // Zimbabwe
      window.localStorage.setItem("gaTagCode", "UA-60319074-46");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-46";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "mw") {      // Malawi
      window.localStorage.setItem("gaTagCode", "UA-60319074-47");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-47";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "rw") {      // Rwanda
      window.localStorage.setItem("gaTagCode", "UA-60319074-48");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-48";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "sn") {      // Snegal
      window.localStorage.setItem("gaTagCode", "UA-60319074-49");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-49";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ci") {      // Ivory Coast
      window.localStorage.setItem("gaTagCode", "UA-60319074-50");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-50";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ga") {      // Gabon
      window.localStorage.setItem("gaTagCode", "UA-60319074-51");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-51";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "td") {      // Chad
      window.localStorage.setItem("gaTagCode", "UA-60319074-52");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-52";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "gm") {      // Gambia
      window.localStorage.setItem("gaTagCode", "UA-60319074-53");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-53";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "ml") {      // Mali
      window.localStorage.setItem("gaTagCode", "UA-60319074-54");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-54";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "gn") {      // Guinea
      window.localStorage.setItem("gaTagCode", "UA-60319074-55");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-55";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "gw") {      // Guinea Bissau
      window.localStorage.setItem("gaTagCode", "UA-60319074-56");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-56";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "my") {      // Malaysia
      window.localStorage.setItem("gaTagCode", "UA-60319074-57");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-57";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "sg") {      // Singapore
      window.localStorage.setItem("gaTagCode", "UA-60319074-58");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-58";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "us") {      // USA
      window.localStorage.setItem("gaTagCode", "UA-60319074-59");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-59";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "cn") {      // Canada
      window.localStorage.setItem("gaTagCode", "UA-60319074-60");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-60";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    } else if (this.setCountryCodeToURL == "bi") {      // Burundi
      window.localStorage.setItem("gaTagCode", "UA-60319074-61");
      const gA = "https://www.googletagmanager.com/gtag/js?id=UA-60319074-61";
      this.replacejscssfile(getUrlGa, gA, "js");
      window.localStorage.setItem("gaURL", gA);
    }

    this.router.navigate([
      this.setCountryCodeToURL +
        "/" +
        this.setLanguageSetting
    ]);
  }
  bindCurrencyCode(val){
    //console.log(val);
  }
  creatform() {
    this.settingForm = this.fb.group({
      language: ["", Validators.required],
      country: ["", Validators.required],
      currency: ["", Validators.required]
    });
  }
  selectedCountryName;
  getCountryDataFormLocalStorage(id) {
    //console.log(id)
    let localSettingsCurrency = localStorage.getItem("SettingsCurrency");
    let localSettingsLanguage = localStorage.getItem("SettingsLanguage");
    let selectedCountry = localStorage.getItem("selectedCountry");
    //console.log(localSettingsCurrency);      
    if(localSettingsCurrency != "undefined")
      this.CurrencyCode.push({countryId :localSettingsCurrency},{countryId : "USD"})     
    else
       this.getCurrencyCodeByCOuntryId(id);
    this.settingForm.patchValue({
      language: localSettingsLanguage,
      country: selectedCountry,
      currency:localSettingsCurrency 
    });
  }

 setCountryCodeToURL;
 setLanguageSetting = 'en';
  bindCurrency(val){
    //console.log(val.value)
    let id;
    for(var i=0;i<this.countries.length;i++)
    {
      if(this.countries[i].countryName == val.value){
         id=this.countries[i].countryId;
         //console.log(this.countries[i]);
         this.setCountryCodeToURL = this.countries[i].countryCode.toLowerCase();
         //console.log(this.setCountryCodeToURL )
        
      }
      // if(this.setCountryCodeToURL == 'ng'){
      //   //alert("india")
      //   window.open('https://www.travelwings.com.ng/Nigeria/index.aspx');
      // }
      // if(this.setCountryCodeToURL == 'gh'){
      //   //alert("india")
      //   window.open('https://www.travelwings.com.gh/ghana/index.aspx');
      // }
     
    }
     this.getCurrencyCodeByCOuntryId(id);
  }

isloading = true;
  loaddashboard() {

    this.service = this.globalService.getDashboard().subscribe(dash => {
      //console.log("Load Dash",dash);
      this.isloading = false;
      this.language = dash["language"];
      this.countries = dash["countryList"];

      this.dafaultcname = this.countries.filter(res => {
       return res.defaultCountry == true;
       // return res.countryCode == ccode;
      });
      this.defaultcountryName = this.dafaultcname[0]["countryName"];

      this.bresponse = this.dafaultcname[0].branchResponse;
      this.branchCode = this.bresponse.branchCode;
      this.branchCurrencyCode = this.bresponse.branchCurrencyCode;
      this.branchId = this.bresponse.branchId;
      this.countryCode = this.bresponse.countryCode;
      this.groupId = this.bresponse.groupId;
      var countryid = this.dafaultcname[0].countryId;
      //console.log("countryid :"+countryid)
   
      if (dash) {
        let selectedCountry = localStorage.getItem("selectedCountry");
        if (selectedCountry != null) {
          //console.log("not null")
          this.getCountryDataFormLocalStorage(countryid);
        } else {
          //console.log("null")
          this.getCurrencyCodeByCOuntryId(countryid);
          this.settingForm.patchValue({
            language: this.language,
            country: this.defaultcountryName,
            currency: this.selected 
          });
          //console.log("currency :"+this.selected)
          localStorage.setItem("selectedCountry",this.settingForm.get("country").value);
          localStorage.setItem("SettingsCurrency", this.selected);
          localStorage.setItem("SettingsLanguage", this.language);
        }
      }

      this.servicedata = dash["countryList"];
      this.array = this.servicedata[0];
    });
  }
  ngOnDestroy() {
    this.service.unsubscribe();
  }

  backTo() {
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
    let setLanguageSetting = 'en';
    this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }

  // For google Analytics
  createjscssfile(filename, filetype) {
    if (filetype == "js") {
      //if filename is a external JavaScript file
      var fileref = document.createElement("script");
      fileref.setAttribute("type", "text/javascript");
      fileref.setAttribute("src", filename);
    }
    return fileref;
  }

  public replacejscssfile(oldfilename, newfilename, filetype) {
    var targetelement =
      filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
    var targetattr =
      filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) {
      if (
        allsuspects[i] &&
        allsuspects[i].getAttribute(targetattr) != null &&
        allsuspects[i].getAttribute(targetattr).indexOf(oldfilename) != -1
      ) {
        var newelement = this.createjscssfile(newfilename, filetype);
        allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
      }
    }
  }
}
