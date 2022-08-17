import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "moreOption"
})
export class MoreOptionPipe implements PipeTransform {
  selectedFlightPrice: any;
  flightOptionKey: any;
  SelectedplatingCarrierName: any;

  transform(value: any, totalData?: any, type?: any): any {
    if (type == "oneway") {
      // this.selectedFlightPrice = value.flightFare.t3Price;
      this.selectedFlightPrice = value.flightFare.totalBaseFare + value.flightFare.totalTax + value.flightFare.totalFees + value.flightFare.markupPrice + value.flightFare.serviceChargePrice - value.flightFare.discountPrice;

      var price = this.selectedFlightPrice;

       this.SelectedplatingCarrierName = value.platingCarrier;
      var carriercompany = this.SelectedplatingCarrierName;
      var filteredflight = totalData.filter(function(flight) {
        return (
          flight.flightFare.totalBaseFare + flight.flightFare.totalTax + flight.flightFare.totalFees + flight.flightFare.markupPrice + flight.flightFare.serviceChargePrice-flight.flightFare.discountPrice == price &&
          flight.platingCarrier == carriercompany
        );
      });
   //   console.log(filteredflight);
      return filteredflight.length > 1 ? true : false;
    }

    if (type == "returnway") {
      var priceselectedreturn = value.t3Price;
      var selectedreturnCarreronward =
        value.onwardFlightOption.marketingCarrier;
      var selectedreturnCarrerreturn =
        value.returnFlightOption.marketingCarrier;

      var returnwayfilterflight = totalData.filter(function(flight) {
        return (
          flight.t3Price == priceselectedreturn &&
          flight.onwardFlightOption.marketingCarrier ==
            selectedreturnCarreronward &&
          flight.returnFlightOption.marketingCarrier ==
            selectedreturnCarrerreturn
        );
      });
    //  console.log(returnwayfilterflight);
      return returnwayfilterflight.length > 1 ? true : false;
    }
  }
}
