import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'similarOption'
})
export class SimilarOptionPipe implements PipeTransform {

  transform(value: any, clikedkey?: any,type?:any): any {
    console.log(value);
   console.log(clikedkey);
   console.log(type);
   if(value == clikedkey){
     return
   }

  }

}
