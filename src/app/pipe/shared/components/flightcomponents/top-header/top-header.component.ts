import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SendTravllerDataService } from 'src/app/services/send-travller-data.service';
import { FlightService } from 'src/app/services/flight.service';
import * as moment from "moment";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss'],
})
export class TopHeaderComponent implements OnInit, OnDestroy {
   
  triptype: string;
  adultdefault: any;
  adult: any;
  children: any;
  infants: any;
  travSub: Subscription;
  returnDate: any;
  departDate: any;
  myeconomyonward: any;
  myeconomyreturn: any;
  finaldest: any;
  finalorigin: any;
  dd1: any;
  dd2: any;
  multisub: Subscription;
  headerData: Subscription;
  multiheaderdata = [];
  multicityOnwardatee: Date;
  tripTypeParam: any;
  dateonwrdd: string;
  rdis: any;
  ddis: any;


  constructor(private sendTravllerDataService: SendTravllerDataService, private activatedroute: ActivatedRoute,
    private flightService: FlightService,private router:Router, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.adult = '';
    this.children = '';
    this.infants = '';
    this.triptype = sessionStorage.getItem('tripType');
    //console.log('trip type from top header', this.triptype);
this.getdate();
    this.odddata();
    this.gettravllerfromservice();
    this.getMultictyfield();
  }
getdate(){
  this.flightService.getheaderdate().subscribe((res)=>{
//console.log('date on header for unmask url',res)
  });
}



  gettravllerfromservice() {

    this.travSub = this.sendTravllerDataService.gettravller().subscribe((res) => {
      if (res) {
        //console.log('travllers data on header page', res);
        //  //console.log(res['trvllerfield']);
        if (res['trvllerfield']) {
          this.adultdefault = res['trvllerfield']["adult"];
          this.adult = res['trvllerfield']["adult"];
          this.children = res['trvllerfield']["children"];
          this.infants = res['trvllerfield']["infants"];
        }
        // this.total_traveller = res["adult"] + res["children"] + res["infants"]
      }
    }
    );

  }







  odddata() {
    //console.log('top header with no>>mask url');
    this.dateonwrdd = localStorage.getItem('UMOonwrdate');
    //console.log('dateonwrd',this.dateonwrdd);

   this.headerData = this.flightService.getoddata().subscribe(res => {
      //console.log('TOP HEADER PAGE RES ODD', res);
      if (res != '') {

        this.ddis = res['returnwaydepartDate'];
        this.rdis = res['returnwayreturnDate'];
        //console.log(`onward is ${this.ddis} and return is ${this.rdis}`)

        this.departDate = new Date(moment(this.ddis,'DD-MM-YYYY').format('YYYY-MM-DD'));
        this.returnDate = new Date(moment(this.rdis,'DD-MM-YYYY').format('YYYY-MM-DD'));

        this.finalorigin = res.returnwayOrigin;
        this.finaldest = res.returnwaydestination;

        this.myeconomyonward = res.myeconomyonward;
        this.myeconomyreturn = res.myeconomyreturn;


        this.returnclassOnwrd(this.myeconomyonward);
        this.returnclassReturn(this.myeconomyreturn);


       // let departdate = this.convertdepart(res.returnwaydepartDate);
     //   let returndate = this.convertreturn(res.returnwayreturnDate)
        this.cd.markForCheck();
       //console.log('i m from top header if part>>click lets fly btn');
      } else {
        //console.log('top header else u refreshed');

        this.tripTypeParam = this.activatedroute.snapshot.paramMap.get('tripType');
        //console.log(' this.triptype', this.tripTypeParam);
        if (this.tripTypeParam == 'Oneway') {
          this.triptype = 'oneway';
          //console.log(' this.triptype', this.tripTypeParam);
          this.activatedroute.paramMap.subscribe(params => {
            let countryCode = params.get("countryCode");
            let fullcity = params.get("originCity-:destinationCity");
            let fullcitySplit = fullcity.split('-');

            this.finalorigin = fullcitySplit[0];
            this.finaldest = fullcitySplit[1];
            // //console.log('this.finalorigin',this.finalorigin);
            // //console.log('this.finaldest',this.finaldest)
          });
        }
        if (this.tripTypeParam == 'Return') {
          this.triptype = 'returnway';
          //console.log(' this.triptype', this.tripTypeParam);
          this.activatedroute.paramMap.subscribe(params => {
            let countryCode = params.get("countryCode");
            let fullcity = params.get("originCity-:destinationCity");
            //console.log('full city', fullcity)
            let fullcitySplit = fullcity.split('-');

            this.finalorigin = fullcitySplit[0];
            this.finaldest = fullcitySplit[1];
            // //console.log('this.finalorigin',this.finalorigin);
            // //console.log('this.finaldest',this.finaldest)
            let xx = localStorage.getItem('UMOcabinclassreturn');
            this.myeconomyreturn = xx;
            this.returnclassReturn(this.myeconomyreturn);


            let retundt = localStorage.getItem('UMOreturndate');
            //console.log(retundt)
            if(retundt != null){
             // //console.log('if')

              this.returnDate = moment(retundt, 'DD-MM-YYYY').format('YYYY-MM-DD');

            }else{
              this.returnDate = moment(this.rdis,'DD-MM-YYYY').format('YYYY-MM-DD');
             // //console.log('else');
              //console.log('this.returnDate',this.returnDate)

              
            }

          });
        }
        if (this.tripTypeParam == null) {
          //console.log('trip is null')

          this.finalorigin = localStorage.getItem('refreshedOrigin');
          this.finaldest = localStorage.getItem('refreshedDest');
          // //console.log('this.finalorigin',this.finalorigin);
          ////console.log('this.finaldest',this.finaldest)
          let xx = localStorage.getItem('UMOcabinclassreturn');
          this.myeconomyreturn = xx;
          this.returnclassReturn(this.myeconomyreturn);


          let retundt = localStorage.getItem('UMOreturndate');
          //console.log(retundt)
          this.returnDate = moment(retundt, 'DD-MM-YYYY').format('YYYY-MM-DD');

        }

////
// let searchpageurl = this.router.url.substr(1);

// if(searchpageurl.includes('Adult')){
//   //console.log('top header with adult>>unmask url')
//   let dateonwrdd = localStorage.getItem('returnwaydepartDate');
//   //console.log('dateonwrd');
//   let dateonwrd = moment(dateonwrdd, "DD-MM-YYYY").format("YYYY-MM-DD");
//   this.departDate = dateonwrd;

//  let onwrdcabinclass = localStorage.getItem('myeconomyonward');
//  //console.log('onwrdcabinclass');
//  this.myeconomyonward = onwrdcabinclass;
//  this.myeconomyreturn = 'Economy';
 
  
//  }else{

if( this.dateonwrdd !=null){
 
  this.departDate = moment( this.dateonwrdd, "DD-MM-YYYY").format("YYYY-MM-DD");
  //this.departDate = dateonwrd;
  let onwrdcabinclass = localStorage.getItem('myeconomyonward');
 //console.log('onwrdcabinclass');
 this.myeconomyonward = onwrdcabinclass;
 this.returnclassOnwrd(this.myeconomyonward);

}else{
  this.departDate = moment(new Date(), "DD-MM-YYYY").add(15, 'days').format("YYYY-MM-DD");
  this.returnDate = moment(new Date(), "DD-MM-YYYY").add(22, 'days').format("YYYY-MM-DD");
 
  this.myeconomyonward =  'Economy';
  this.myeconomyreturn = 'Economy';
}
 


 

      }



    })

  }


  returnclassOnwrd(classOnwrd){
    //console.log(classOnwrd)
if(classOnwrd == 'Premium' || classOnwrd == 'PREMIUM'){
this.myeconomyonward = 'Premium Economy';
}else if(classOnwrd == 'Business' || classOnwrd == 'BUSINESS'){
  this.myeconomyonward = 'Business Class'

}else if(classOnwrd == 'FirstClass' ||  classOnwrd == 'First'){
  this.myeconomyonward = 'First Class';

}
  }

  returnclassReturn(classOnwrd){
     //console.log(classOnwrd)
    if(classOnwrd == 'Premium' || classOnwrd == 'PREMIUM'){
    this.myeconomyreturn = 'Premium Economy';
    }else if(classOnwrd == 'Business' || classOnwrd == 'BUSINESS'){
      this.myeconomyreturn = 'Business Class'
    
    }else if(classOnwrd == 'FirstClass' ||  classOnwrd == 'First'){
      this.myeconomyreturn = 'First Class';
    
    }
      }
    


  getMultictyfield() {
    this.multisub = this.flightService.getflightwidget().subscribe((res) => {
      //console.log('multicity ', res);
      if (res != '') {


        this.multiheaderdata = res;

        let multicityOnwardate = res[0]['onwardJourneyDate'];
        this.multicityOnwardatee = new Date(moment(multicityOnwardate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
      }
    })
  }



  ngOnDestroy(): void {
    this.travSub.unsubscribe();
    this.headerData.unsubscribe();
    // this.multisub.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  convertdepart(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
    // "onwardJourneyDate":"29-08-2019",

  }
  convertreturn(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
    // "onwardJourneyDate":"29-08-2019",

  }
}
