import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
@Pipe({
  name: 'recentDate'
})
export class RecentDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let convertDate = moment(value, "DD-MM-YYYY").format('DD MMM YYYY');
    return convertDate;
  }

}
