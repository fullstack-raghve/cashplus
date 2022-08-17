import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keypipe'
})
export class KeypipePipe implements PipeTransform {

 

//   transform(value: any, args: any[] = null): any {
//     //console.log(value)
//     //console.log(Object.keys(value))

//     return Object.keys(value)//.map(key => value[key]);
// }
transform(value, args:string[]):any {
  //console.log(value)
  let keys = [];

  let key = Object.keys(value);
  let values = Object.values(value)
  //console.log(values[0]);
  //console.log(key[0]);

  keys.push({
    main_key: key[0],
    value_main:values[0]
  });
  //console.log(keys)

  return `${key[0]} ${values[0]}`;
}
}
