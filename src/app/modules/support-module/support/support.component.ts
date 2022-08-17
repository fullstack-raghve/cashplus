import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  selected = '+91';
  title: string = "Support"
  service: Subscription;
  servicedata: any;
  language: any;
  countries: any;
  dafaultcname: any;
  defaultcountryName: any;
  bresponse: any;
  branchCode: any;
  contactNo: any;
  supportform: FormGroup;
  countryCode: string;
  loading:boolean = true;
  branchEmailId: string;
  branchAddress: string;
  branchMob: string;

  constructor(private router:Router, private _snackBar: MatSnackBar,private globalService:GlobalService, private fb: FormBuilder) { }

  ngOnInit() {
    this.countryCode = localStorage.getItem('countryCode');
    this.countryCode = this.countryCode.toLowerCase()
    this.branchEmailId =  localStorage.getItem('branchEmailId');
    this.branchAddress =  localStorage.getItem('branchAddress');
    this.branchMob = localStorage.getItem('BranchcontactNo');
    console.log('branch email',this.branchEmailId);
    console.log('branch address',this.branchAddress)
    console.log('branch mob',this.branchMob)


    console.log('country code from support',this.countryCode)
    this.createform();

///this.loaddashboard();

  }
  ionViewWillEnter() {
    this.countryCode = localStorage.getItem('countryCode');
    this.countryCode = this.countryCode.toLowerCase()

    console.log("ion-enter from support");
  }

createform(){
  let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

this.supportform = this.fb.group({

  name: ["", Validators.required],
  email: ["", [Validators.required, Validators.pattern(emailregex)]],
  mobile : ["", Validators.required],
  subject:["", Validators.required],
  mssgarea: ["", Validators.required],
  enquiry:  ["", Validators.required],
  dialcode: ["", Validators.required]

})
}

submitform(){
  console.log( 'clicked')
  if (this.supportform.invalid) {
    for(let i in this.supportform.controls)
    this.supportform.controls[i].markAsTouched();

    return;
  }
  let snackBarRef11 = this._snackBar.open(
    "Submitted Successfully",
    "",
    {
      duration: 2000
    }
  );
  this.supportform.reset();

  //this.router.navigate(['/'])

  console.log( this.supportform.value)
}

  backTo(){
    // this.router.navigate(['/'])
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
let setLanguageSetting = 'en';
this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }
  loaddashboard(){

    this.service = this.globalService.getDashboard().subscribe(dash =>{
      this.loading = false;
     // console.log(dash);
      this.servicedata = dash['countryList']; 
     // this.bannerurl  = this.servicedata.bannerList
    ///////////////////////////////////////////////////////////////////////////// start
     this.language = dash['language'];
    this.countries = dash['countryList'];
    this.dafaultcname = this.countries.filter((res)=>{
       return res.defaultCountry == true
      }
    )
  //  console.log(this.dafaultcname[0]);
    this.defaultcountryName = this.dafaultcname[0].countryName;
    ////branch response detail of default country 
    
    this.bresponse = this.dafaultcname[0].branchResponse
 //   console.log(this.bresponse)
    this.branchCode = this.bresponse.branchCode;
    // this.branchCurrencyCode = this.bresponse.branchCurrencyCode;
    // this.branchId = this.bresponse.branchId;
    // this.countryCode = this.bresponse.countryCode;
    // this.groupId = this.bresponse.groupId;
    this.contactNo = this.bresponse.contactNo;
    //alert(this.contactNo)
localStorage.setItem('branchMob',this.contactNo)
     console.log(this.contactNo);
    })
    
    
    
      }

    

}
