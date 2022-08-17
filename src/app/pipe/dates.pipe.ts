import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'dates'
})
export class DatesPipe implements PipeTransform {
  depdate: any;
  arrivedate: any;

  transform(value: any,type?: any): any {
    //console.log(value)
      if(type == 'oneway'){
        let  lengthh = value["flightlegs"].length-1; 
        this.depdate = value['flightlegs'][0].depDate; 
        this.arrivedate = value["flightlegs"][lengthh].arrDate;
      }
      if(type == 'onewaysimilr'){
        let  lengthh = value["flightlegs"].length-1; 
        this.depdate = value['flightlegs'][0].depDate; 
        this.arrivedate = value["flightlegs"][lengthh].arrDate;
      }
      if(type == 'returnwayonward'){
      //  let  lengthh = value["flightlegs"].length-1; 
        this.depdate = value.depDateOnward; 
        this.arrivedate = value.arrDateOnward;
      }
      if(type == 'returnwayreturn'){
        //  let  lengthh = value["flightlegs"].length-1; 
          this.depdate = value.depDateReturn; 
          this.arrivedate = value.arrDateReturn;
        }
        if(type == 'returnwayonwardsim'){
        //  console.log('i m from similar page -onward')
         // console.log('value',value);
            this.depdate = value.depDateOnward; 
            this.arrivedate = value.arrDateOnward;
           // console.log('left side dep date',this.depdate);
           // console.log('left side arrv date',this.depdate);

          }
          if(type == 'returnwayreturnsim'){
            //  let  lengthh = value["flightlegs"].length-1; 
              this.depdate = value.depDateReturn; 
              this.arrivedate = value.arrDateReturn;
            }

    let  date_diff_indays = this.datediff(this.depdate,this.arrivedate);
   // console.log('diffrence is',date_diff_indays)
    let comparedate = this.compare(this.arrivedate,this.depdate);
 
   let data = this.getresponse(date_diff_indays)
 // console.log('data',data)
 return data;
//return date_diff_indays;
  }

  compare(arrivedate, depdate) {
    let momentArrival:any = moment(arrivedate,"YYYY-MM-DD").format("YYYY-MM-DD");
    let momentDepart:any = moment(depdate,"YYYY-MM-DD").format("YYYY-MM-DD");
   
    if (momentArrival > momentDepart) return 1;
    else if (momentArrival < momentDepart)  return 2;
    else return 0;
}


///date difrence method
 datediff(date1, date2) {
  let dt1 = new Date(date1);
  let dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }
 // console.log(date_diff_indays('2020-05-28', '2020-05-27'));
 // console.log(date_diff_indays('2020-04-27', '2020-04-29'));


///

getresponse(response) {
  if (response == 1) { 
    return '+1'; 
  } else if (response == 2) { 
    return '+2'; 
  } else if (response == 3) { 
    return '+3'; 
  } else if (response == -1) { 
    return '-1'; 
  } else if (response == -2) { 
    return '-2'; 
  }else if (response == -3) { 
    return '-3'; 
  }

  return;
}

}
