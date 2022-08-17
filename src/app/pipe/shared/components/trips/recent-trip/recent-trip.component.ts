import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { MytripService } from 'src/app/services/mytrip.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recent-trip',
  templateUrl: './recent-trip.component.html',
  styleUrls: ['./recent-trip.component.scss'],
})
export class RecentTripComponent implements OnInit,OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  loading = true;

  mytrips = [];
  subsribe: Subscription;
  loginemail: string;
    constructor(private mytripService:MytripService,private navCtrl: NgxNavigationWithDataComponent,private spinner: NgxSpinnerService,public loadingController: LoadingController,
      ) { }

  ngOnInit() {
    this.spinner.show();
    this.loginemail = localStorage.getItem('loginemail')
    this.getTrip();
  }
  ionViewWillEnter() {
   
  }

 

  getTrip(){

       this.subsribe  = this.mytripService.getAllRecentTrip(this.loginemail).subscribe(email =>{
           this.mytrips = email['myTripList'];
           this.loading = false;
           this.spinner.hide();
  
      });
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
    // this.subsribe.unsubscribe()
  }
}
