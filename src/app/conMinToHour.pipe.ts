import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
@Pipe({
  name: "conMinToHour"
})
export class conMinToHour implements PipeTransform {
  transform(value: any, ...args: any[]) {
  //console.log(value);
  var hrs = ~~(value / 3600);
  var mins = ~~((value % 3600) / 60);
  var secs = ~~value % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + "h " + (secs < 10 ? "0" : "");
  ret += "" + secs + "m";
  return ret;
  }
 
}
