import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { trigger, transition, animate, style } from '@angular/animations'
import { FlightService } from 'src/app/services/flight.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
})
export class PriceFilterComponent implements OnInit {
price:boolean;
duration:boolean;
deparure:boolean;
arrival:boolean;
  sortbyprice: string;
  triptype: string;
  sortBy: any;
  index: any;
  sortedby: string;
  currentindex: string;
  constructor(private matBottomSheet:MatBottomSheet,
    private flightService : FlightService,
    private _bottomSheetRef: MatBottomSheetRef<PriceFilterComponent>,
    private router:Router

    ) { }

  ngOnInit() {
this.getRouterDetails();
    this.currentindex = localStorage.getItem('currentindex');

    this.price = true;
    this.deparure = true;
    // console.log(this.byprice)
    this.sortBy = ''
   this.sortbyprice =  localStorage.getItem('sortbyprice');

   this.sortedby = localStorage.getItem('sortedBy');

       console.log(this.sortbyprice);

this.triptype = localStorage.getItem('tripType');
    
    animations: [
      trigger('slideInOut', [
        transition(':enter', [
          style({transform: 'translateY(-100%)'}),
          animate('200ms ease-in', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [
          animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
        ])
      ])
    ]
  }

  getRouterDetails() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._bottomSheetRef.dismiss();
      }
    });
  }

  filteritem = [
{
  id:1,
  name:'Price'
},
{
  id:2,
  name:'Duration'
},
{
  id:3,
  name:'Departure'
},
{
  id:4,
  name:'Arrival'
}
  ]

byprice:boolean = true;

  editProduct(item,i){
  this.index = i;
  localStorage.setItem('currentindex',this.index);

    console.log(item.name);
    let reqbody = {
      "triptype": this.triptype,
      "sortBy": item.name
   
     }


     if(item.name == 'Price'){

      if(this.sortedby == 'PriceLH'){
        localStorage.setItem('sortedBy','PriceHL');

      }else{
        localStorage.setItem('sortedBy','PriceLH');
      }
     console.log('clicked on price');

   }else if(item.name == 'Duration'){


    if(this.sortedby == 'DurationLH'){
      localStorage.setItem('sortedBy','DurationHL');

    }else{
      localStorage.setItem('sortedBy','DurationLH');
    }

    console.log('clicked on Duration');


   }else if(item.name == 'Arrival'){



    if(this.sortedby == 'ArrivalLH'){
      localStorage.setItem('sortedBy','ArrivalHL');

    }else{
      localStorage.setItem('sortedBy','ArrivalLH');
    }


    console.log('clicked on Arrival');


   }else if(item.name == 'Departure'){

    if(this.sortedby == 'DepartureLH'){
      localStorage.setItem('sortedBy','DepartureHL');

    }else{
      localStorage.setItem('sortedBy','DepartureLH');
    }

    console.log('clicked on Departure');


   }else{

   }

     this._bottomSheetRef.dismiss({
      data:reqbody
    });


 


//  if(item.name == 'Price'){
//      this.byprice = !this.byprice;
//      this.sortBy = 'Price'
//   }else if(item.name == 'Duration'){
//        this.sortBy = 'Duration'
//     }else if(item.name == 'Arrival'){

//    this.sortBy = 'Arrival'

//    }else if(item.name == 'Deparure'){
//   this.sortBy = 'Deparure'
//   }else{

//   }

 
  }
}
