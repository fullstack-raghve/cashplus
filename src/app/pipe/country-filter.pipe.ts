import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFilter'
})
export class CountryFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    //console.log('items',items);
   // console.log('searchText',searchText);

    if (!items) return [];
    if (!searchText) return items;
  
    return items.filter(item => {
     // console.log('item mmm',item);

      return Object.keys(item).some(key => {
     //   console.log('key',key);
       // console.log("final",String(item[key]).toLowerCase().includes(searchText.toLowerCase()));

        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
   }

}
