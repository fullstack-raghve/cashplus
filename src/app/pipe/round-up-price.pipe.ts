import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundUpPrice'
})
export class RoundUpPricePipe implements PipeTransform {
  public priceRoundUp;
  transform(value: any, args?: any): any {
    let priceValue = Math.ceil(value);
    this.priceWithCommas(priceValue);
    return this.priceRoundUp;
  }

  priceWithCommas(price) {
    var parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.priceRoundUp = parts.join(".");
  }
}
