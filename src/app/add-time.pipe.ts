import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
@Pipe({
  name: "addTime"
})
export class AddTimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
 // console.log(value);
    var allLegsTime = [];

    for (let i = 0; i < value.length; i++) {
      let makeTIme = moment(value[i].journeyDuration, "hh:mm:ss").format(
        "hh:mm:ss"
      );
      allLegsTime.push(makeTIme);
    }
    //console.log(allLegsTime);

    function zeroPad(num) {
      var str = String(num);
      if (str.length < 2) {
        return "0" + str;
      }

      return str;
    }
    function totalTimeString(timeStrings) {
      var totals = timeStrings.reduce(
        function(a, timeString) {
          var parts = timeString.split(":");
          var temp;
          if (parts.length > 0) {
            temp = Number(parts.pop()) + a.seconds;
            a.seconds = temp % 60;
            if (parts.length > 0) {
              temp = Number(parts.pop()) + a.minutes + (temp - a.seconds) / 60;
              a.minutes = temp % 60;
              a.hours = a.hours + (temp - a.minutes) / 60;
              if (parts.length > 0) {
                a.hours += Number(parts.pop());
              }
            }
          }

          return a;
        },
        {
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      );

      return [
        zeroPad(totals.hours),
        zeroPad(totals.minutes),
        zeroPad(totals.seconds)
      ].join(":");
    }

     var finalResult = totalTimeString(allLegsTime);
    // console.log("all legs array", allLegsTime);
   // console.log("final", finalResult);
    let splitAllresult = finalResult.split(":");
    var finalArrayResult;

     if (Number(splitAllresult[0]) >= 9) {
      finalArrayResult = `${splitAllresult[0]}h  ${splitAllresult[1]}m `;
    } else {
      finalArrayResult = `${splitAllresult[0].slice(1)}h  ${
        splitAllresult[1]
      }m `;
    }

    return finalArrayResult;
  }
}
