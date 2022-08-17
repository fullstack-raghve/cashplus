import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
@Pipe({
  name: "addspace"
})
export class addspace implements PipeTransform {
  transform(value: any, args?: any): any {
  // console.log(value);
   //var str = '20h5m';
   function hasWhiteSpace(value) {
     return value.indexOf(' ') >= 0;
   }
   //console.log(hasWhiteSpace(value))
   if(hasWhiteSpace(value) != true)
   {
      var array = value.split("h").join("h ");
      return array;
   }
   else
   {
      return value;
   } 
  }
}
