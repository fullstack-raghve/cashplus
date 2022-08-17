import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multicitydates'
})
export class MulticitydatesPipe implements PipeTransform {
  depdate: any;
  arrivedate: any;
  data: string;

  transform(value: any,type?: any): any {
    //console.log(value)

    for(let i=0;i<value["optionSegmentBean"].length;i++){
      let flightlengsLength = value["optionSegmentBean"][i]['flightlegs'].length;
     // console.log(' flightlengsLength',flightlengsLength);
      let flightlengsLengthMinus = flightlengsLength-1;
      this.depdate =  value["optionSegmentBean"][i]['flightlegs'][0]['depDate'];
     // console.log('this.depdate',this.depdate)

      this.arrivedate =  value["optionSegmentBean"][i]['flightlegs'][flightlengsLengthMinus]['arrDate'];
// console.log(' this.depdate', this.depdate);
// console.log(' this.arrivedate',this.arrivedate);

let  date_diff_indays = this.datediff(this.depdate,this.arrivedate);
// console.log('date_diff_indays',date_diff_indays);

this.data = this.getresponse(date_diff_indays)
// console.log('data',this.data);
// console.log(this.data)


   
    }
    return this.data;

   
  }

///date difrence method
datediff(date1, date2) {
  let dt1 = new Date(date1);
  let dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

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
