import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";

@Component({
  selector: "app-recent-search-one-way",
  templateUrl: "./recent-search-one-way.component.html",
  styleUrls: ["./recent-search-one-way.component.scss"]
})
export class RecentSearchOneWayComponent implements OnInit {
  allResult = [];
  get_three_element;
  dateOneway;
  OriginDetails;
  destDetails;
  @Output() sendSearchDataAll = new EventEmitter();
  public search = {
    oneway: []
  };
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    // this.allResult.push(JSON.parse(localStorage.getItem("resultSearchOneWay")));
    //   let extractLastThree = this.allResult[0]["oneway"].reverse();
    //   this.get_three_element = extractLastThree;


    this.route.queryParams.subscribe(
      (res) => {
        if (res) {
         // console.log(res);
          let getAllSearchResult = JSON.parse(localStorage.getItem("resultSearchOneWay"));
        //  console.log(getAllSearchResult);
          let Mainresult = {'oneway':[]};
         // console.log( getAllSearchResult['oneway'].length);

          for(let i=0;i< getAllSearchResult['oneway'].length;i++)
          {
           // console.log(getAllSearchResult['oneway'][i]['flightSearch']['onwardJourneyDate']);
            var g1 =  moment().format("DD-MM-YYYY"); 
            var g2 =  moment(getAllSearchResult['oneway'][i]['flightSearch']['onwardJourneyDate'], "DD-MM-YYYY").format("DD-MM-YYYY"); 
            // console.log(g1)  
            // console.log(g2)          
           //  console.log(g3) 
             let dateOflocal:any=g2.split('-');
             let Today:any =g1.split('-');
            // console.log(dateOflocal[0]+":" +dateOflocal[1]+":"+dateOflocal[2]);
            // console.log(Today[0]+":"+Today[1]+":"+Today[2]);
             let g3=+new Date(dateOflocal[2], dateOflocal[1],dateOflocal[0]) >= +new Date(Today[2], Today[1] ,Today[0]);
           //  console.log(g3);
             if(g3 == true)
             {
              Mainresult["oneway"].push(getAllSearchResult['oneway'][i]);
             }
          }
          
          // console.log(getAllSearchResult);
          // if (getAllSearchResult == null || getAllSearchResult['oneway'].length == 0 ) {
          //     return;
          // }
          // this.allResult.push(getAllSearchResult);
          if (Mainresult == null || Mainresult['oneway'].length == 0 ) {
            return;
          }
          this.allResult.push(Mainresult);
          ///console.log(this.allResult)
      
          let length = this.allResult.length != 0 ? this.allResult[this.allResult.length - 1] : [];
        //  console.log(length['oneway'])
          this.get_three_element = length['oneway'].reverse();
          // console.log(this.get_three_element);
        }
      }
    )

   // console.log(this.get_three_element);

  }

  sendSearchData(data) {
   // console.log(data)
    this.dateOneway = new Date(moment(data["flightSearch"]["onwardJourneyDate"], 'DD-MM-YYYY').format('YYYY-MM-DD'));
    localStorage.setItem('DateForAll', this.dateOneway);
    //----City Name code----
    let ctnames = localStorage.getItem("cityDetails");       
      let ctdetail = JSON.parse(ctnames);
     // console.log("citynames:"+ JSON.stringify(ctdetail));
      let citynames = {
        Origin :  data.OriginCityName ?data.OriginCityName  :(ctdetail && ctdetail['Origin'] ? ctdetail['Origin']:''),
        Destination :data.destinationCityName ?data.destinationCityName:(ctdetail && ctdetail['Destination']?ctdetail['Destination']:'')
      }
      //console.log(citynames);
      localStorage.setItem("cityDetails",JSON.stringify(citynames));
   //-------------
    this.OriginDetails = [];
    this.destDetails = [];
    //-----------
    let obj = {
      airportCode: data['flightSearch']['origin'],
      airportName: data['originAirportName']
    }
   // console.log(obj);
    this.OriginDetails.push(obj);
    localStorage.setItem("OriginDataDetails", JSON.stringify(this.OriginDetails));
    let obj1 = {
      airportCode: data['flightSearch']['destination'],
      airportName: data['destinationAirportName']
    }
   // console.log(obj1);
    this.destDetails.push(obj1);
    localStorage.setItem("DestinationDataDetails", JSON.stringify(this.destDetails));
    let cdata;
    if (data['flightSearch']['cabinClass'] === 1) {
      cdata = "Economy";
    } else if (data['flightSearch']['cabinClass'] === 2) {
      cdata = "Premium Economy";
    } else if (data['flightSearch']['cabinClass'] === 3) {
      cdata = "Business Class";
    } else if (data['flightSearch']['cabinClass'] === 4) {
      cdata = "First Class";
    }
    var obj3 = [cdata, data['flightSearch']['cabinClass']];
   // console.log(obj3);
    localStorage.setItem("EconomyData", JSON.stringify(obj3));
    //-----------
    this.sendSearchDataAll.emit(data);
  }
  clearAllSearch() {
    localStorage.removeItem("resultSearchOneWay");
    this.get_three_element = null;
    localStorage.setItem("resultSearchOneWay", JSON.stringify(this.search));
  }
  ionViewWillEnter() {
    // this.ngOnInit();
    // console.log("resultSearchOneWay");
  }
  ionViewDidEnter() {
    // console.log("resultSearchOneWay");
  }
  ionViewWillLeave() {
    // console.log("resultSearchOneWay");
  }
  ionViewDidLeave() {
    // console.log("resultSearchOneWay");
  }
      ionViewDidLoad() {
       // ///console.log('ionViewWillUnload')
  }
}
