import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";
@Component({
  selector: "app-recent-search",
  templateUrl: "./recent-search.component.html",
  styleUrls: ["./recent-search.component.scss"]
})
export class RecentSearchComponent implements OnInit {
  allResult = [];
  get_three_element;
  OriginDetails;
  destDetails;
  dateOneway;
  @Output() sendSearchDataAll = new EventEmitter();
  public search = {
    returnway: []
  };
  constructor(private route:ActivatedRoute) {}
  ngOnInit() {
    // this.allResult.push(JSON.parse(localStorage.getItem("resultSearch")));
    // if (this.allResult[0]["returnway"].length > 3) {
    //   let extractLastThree = this.allResult[0]["returnway"]
    //     .slice(
    //       this.allResult[0]["returnway"].length - 3,
    //       this.allResult[0]["returnway"].length
    //     )
    //     .reverse();
    //   this.get_three_element = extractLastThree;
    // } else {
    //   this.get_three_element = this.allResult[0]["returnway"];
    // }


    // this.allResult.push(JSON.parse(localStorage.getItem("resultSearch")));
    //   let extractLastThree = this.allResult[0]["returnway"].reverse();
    //   this.get_three_element = extractLastThree;
    //   console.log(this.get_three_element);


      this.route.queryParams.subscribe(
        (res)=>{
        if(res){
        // console.log(res);
        let getAllSearchResult = JSON.parse(localStorage.getItem("resultSearch"));
       // console.log(getAllSearchResult);
        let Mainresult = {'returnway':[]};
        //console.log( getAllSearchResult['returnway'].length);

        for(let i=0;i< getAllSearchResult['returnway'].length;i++)
        {
          //console.log(getAllSearchResult['returnway'][i]['flightSearch']['onwardJourneyDate']);
          var g1 =  moment().format("DD-MM-YYYY"); 
          var g2 =  moment(getAllSearchResult['returnway'][i]['flightSearch']['onwardJourneyDate'], "DD-MM-YYYY").format("DD-MM-YYYY"); 
         // var g3 =  moment(getAllSearchResult['returnway'][i]['flightSearch']['returnJourneyDate'], "DD-MM-YYYY").format("DD-MM-YYYY"); 
          //console.log(g1)   
          //console.log(g2)   
          let dateOflocal:any=g2.split('-');
          let Today:any =g1.split('-');
          // console.log(dateOflocal[0]+":" +dateOflocal[1]+":"+dateOflocal[2]);
          // console.log(Today[0]+":"+Today[1]+":"+Today[2]);
          let g3=+new Date(dateOflocal[2], dateOflocal[1],dateOflocal[0]) >= +new Date(Today[2], Today[1] ,Today[0]);
            // console.log(g3);
            if(g3 == true)
           {
            Mainresult["returnway"].push(getAllSearchResult['returnway'][i]);
           }
        }
        if (Mainresult == null || Mainresult['returnway'].length == 0 ) {
          return;
        }
        this.allResult.push(Mainresult);
        //this.allResult.push(JSON.parse(localStorage.getItem("resultSearch")));
       //  console.log(this.allResult);
        let length = this.allResult.length != 0 ? this.allResult[this.allResult.length -1] : [];
        // console.log(length['returnway'])
        this.get_three_element = length['returnway'].reverse();
        // console.log(this.get_three_element);
        }
        }
        )
  }

  sendSearchData(data) {
  //  console.log(data);
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

     //-----------
     this.dateOneway =  new Date(moment(data["flightSearch"]["onwardJourneyDate"], 'DD-MM-YYYY').format('YYYY-MM-DD'));
     localStorage.setItem('DateForAll', this.dateOneway);
     this.OriginDetails = [];
     this.destDetails = [];
     let obj={
      airportCode :data['flightSearch']['origin'],
      airportName :data['originAirportName']
    }
   // console.log(obj);
    this.OriginDetails.push(obj);   
    localStorage.setItem("OriginDataDetails",JSON.stringify(this.OriginDetails));
    let obj1={
      airportCode :data['flightSearch']['destination'],
      airportName :data['destinationAirportName']
    }
   // console.log(obj1);
    this.destDetails.push(obj1); 
    localStorage.setItem("DestinationDataDetails",JSON.stringify(this.destDetails));
    let cdata;
    if (data['flightSearch']['cabinClass'] === 1) {       
      cdata = "Economy";
    } else if (data['flightSearch']['cabinClass'] === 2) {       
      cdata =  "Premium Economy";
    } else if (data['flightSearch']['cabinClass'] === 3) {       
      cdata = "Business Class";
    } else if (data['flightSearch']['cabinClass'] === 4) {      
      cdata = "First Class";
    }
    var obj3=[cdata,data['flightSearch']['cabinClass']];
   // console.log(obj3);
    localStorage.setItem("EconomyData" ,JSON.stringify(obj3));
     //-----------
    this.sendSearchDataAll.emit(data);
  }
  clearAllSearch() {
    localStorage.removeItem("resultSearch");
    this.get_three_element = null;
    localStorage.setItem("resultSearch", JSON.stringify(this.search));
  }
  
}
