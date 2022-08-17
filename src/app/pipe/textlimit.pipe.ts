import { Pipe, PipeTransform } from '@angular/core';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';

@Pipe({
  name: 'textlimit'
})
export class TextlimitPipe implements PipeTransform {

  transform(value: any, limit: number): any {
  
    // console.log(value.length)
   if(value.length>limit){
    return value.substring(0, limit) + '...';
  }
  return value;
  }
}
