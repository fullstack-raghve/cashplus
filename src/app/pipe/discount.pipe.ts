import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount'
})
export class DiscountPipe implements PipeTransform {

  transform(value: any, args?: any): any {
   // console.log(value);
   // console.log(args)

    
    let afterdiscount = (value/args)*100;
    //console.log(afterdiscount);
    return afterdiscount;
  }

}
