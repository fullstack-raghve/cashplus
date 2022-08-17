import { Component, OnInit, OnDestroy } from '@angular/core';
import { MytripService } from 'src/app/services/mytrip.service';
import { Subscription } from 'rxjs';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';

@Component({
  selector: 'app-up-coming-trip',
  templateUrl: './up-coming-trip.component.html',
  styleUrls: ['./up-coming-trip.component.scss'],
})
export class UpComingTripComponent implements OnInit,OnDestroy {
  loading = true;

  mytrips:any = [];
  subsribe: Subscription;
  loginemail: string;
  constructor(private mytripService:MytripService,public navCtrl: NgxNavigationWithDataComponent,
    ) { }

  ngOnInit() {
this.loginemail = localStorage.getItem('loginemail')
    this.getTrip();
  }


  

  getTrip(){
   // var email = 'mahendra@yopmail.com' 
  this.subsribe =  this.mytripService.getAllupcomingTrip(this.loginemail).subscribe(upcoming =>{
    console.log(upcoming)
       this.mytrips = upcoming['myTripList'];
       this.loading = false;
       console.log('mytrips', this.mytrips)

    })
  }


  tripdetail(upcomingtrip){
   
let id = upcomingtrip.bookingId;
let triptype = upcomingtrip.tripType;
console.log('booking id is',id);
console.log('trip type is',triptype);
    this.navCtrl.navigate("/trip-detail", { mydata: id,triptypes: triptype});
    let detailsTr = {
      orderid: id,
      triptype: triptype
    }
    localStorage.setItem('trdetails', JSON.stringify(detailsTr));
  }
  ngOnDestroy(){
    this.subsribe.unsubscribe()
  }

}
