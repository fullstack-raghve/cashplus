import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkTravellerCount'
})
export class CheckTravellerCountPipe implements PipeTransform {

  transform(currentGroupDetail: any, totalTravellerCount?: any): any {
    console.log(totalTravellerCount);
    let adultArr = [];
    let childArr = [];
    let infantArr = [];
    currentGroupDetail["userTraveller"].filter(res => {
      if (res.travellerType == "Adult") {
        adultArr.push(res);
      }
      if (res.travellerType == "Child") {
        childArr.push(res);
      }
      if (res.travellerType == "Infant") {
        infantArr.push(res);
      }
    });
if(totalTravellerCount != undefined){
  
  if(totalTravellerCount.adult >=  adultArr.length 
    && totalTravellerCount.children >= childArr.length
    && totalTravellerCount.infants >= infantArr.length){
      console.log('yes');
      return true;
  }else{
    console.log('more than');
    return false;
  }
}

  }

}

// console.log(currentGroupDetail);
//     let adultArr = [];
//     let childArr = [];
//     let infantArr = [];
//     currentGroupDetail["userTraveller"].filter(res => {
//       if (res.travellerType == "Adult") {
//         adultArr.push(res);
//       }
//       if (res.travellerType == "Child") {
//         childArr.push(res);
//       }
//       if (res.travellerType == "Infant") {
//         infantArr.push(res);
//       }
//     });

//     if(totalTravellerCount.adult.length >  adultArr.length 
//       && totalTravellerCount.children.length  > childArr.length
//       && totalTravellerCount.infants.length > infantArr.length){

//         if ( adultArr.length == totalTravellerCount.adult.length 
//           && childArr.length == totalTravellerCount.children.length 
//           && infantArr.length == totalTravellerCount.infants.length
//         ) {
//           console.log('yes')
//         }else{
//           console.log('no equal')
//         }
//     }else{
//       console.log('more than')
//     }
//     return true;
