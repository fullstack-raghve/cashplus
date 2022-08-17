import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { MytripService } from 'src/app/services/mytrip.service';
import { FlightService } from 'src/app/services/flight.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss'],
})
export class TripDetailComponent implements OnInit, OnDestroy {
  flightDetails: any;
  bookingdetail: Object;
  passengerDetails: any;
  fareDetails: any;
  adultDetail: any;
  childDetail: any;
  infantDetail: any;
  bookingStatus: any;
  adulttotal: any;
  childtotal: any;
  infantttotal: any;
  grandtotal: any;
  subscribebooking: Subscription;
  tripType: any;
  finalArrayResult: any;
  onlineConvinenceFees: any;

  currentTripId;
  tripIdLocalstorage;
  showtripdetails = false;
  constructor(private navCtrl: NgxNavigationWithDataComponent, private flightService: FlightService, private mytripService: MytripService, private router: Router) { }

  ngOnInit() {}
 
  ionViewWillEnter() {
    this.getTripVariables()
    this.getBookingDetails();
  }

  getTripVariables() {
    this.showtripdetails = false;
    this.currentTripId = this.navCtrl.get('mydata');
    this.tripType = this.navCtrl.get('triptypes');
    if (this.currentTripId == undefined) {
      this.tripIdLocalstorage = JSON.parse(localStorage.getItem('trdetails'));
      this.currentTripId = this.tripIdLocalstorage['orderid'];
      this.tripType = this.tripIdLocalstorage['triptype'];
    }
  }

  getBookingDetails() {
    this.subscribebooking = this.flightService.getBookingDetail(this.currentTripId).subscribe(res => {
      console.log(res);
      if (res['statusMessage'] == 'success') {
        this.showtripdetails = true;
      }

      this.bookingdetail = res;
      this.flightDetails = res['flightDetails'];
      this.passengerDetails = res['passengerDetails'];
      this.fareDetails = res['fareDetails'];
      this.adultDetail = res['fareDetails']['adultDetailConfirmationModel'];
      this.childDetail = res['fareDetails']['childDetailConfirmationModel'];
      this.infantDetail = res['fareDetails']['infantDetailConfirmationModel'];
      this.bookingStatus = res['bookingStatus'];
      this.onlineConvinenceFees = this.fareDetails.onlineConvinenceFees;
      this.onlineConvinenceFees = this.onlineConvinenceFees ? this.onlineConvinenceFees : 0;
      console.log('onlineConvinenceFees', this.onlineConvinenceFees);
      // console.log(this.passengerDetails.ticketNo);
      // console.log(res['passengerDetails']['ticketNo'])
      // console.log(this.flightDetails[0]['legList'][0].journeyDuration);
      // console.log(this.flightDetails[0]['legList'])



      //-----------------------
      // console.log(this.adultDetail);
      // console.log(this.childDetail);
      // console.log(this.infantDetail);
      // console.log(this.bookingStatus);
      // console.log(this.adultDetail.length);
      // console.log(this.adultDetail[0]["adultTotal"]);
      // console.log(this.adultDetail[0]["feeNTaxes"]);
      if (this.adultDetail.length != 0) {
        this.adulttotal = this.adultDetail.length * this.adultDetail[0]["flightFare"] + this.adultDetail.length * this.adultDetail[0]["feeNTaxes"] + this.adultDetail.length * this.adultDetail[0]["fees"];;
        //  let adultdiscount = this.adultDetail.length*this.fareDetails.discount;
        //  this.adulttotal = this.adulttotal - adultdiscount
        //  console.log('adultdiscount',adultdiscount);

        // console.log('adult total', this.adulttotal);
      }
      if (this.childDetail.length != 0) {
        this.childtotal = this.childDetail.length * this.childDetail[0]["flightFare"] + this.childDetail.length * this.childDetail[0]["feeNTaxes"] + this.childDetail.length * this.childDetail[0]["fees"];

        //   let childdiscount = this.childDetail.length*this.fareDetails.discount;
        //   this.childtotal = this.childtotal - childdiscount
        //  console.log('childdiscount',childdiscount);

        // console.log('child total', this.childtotal)


      }
      if (this.infantDetail.length != 0) {
        this.infantttotal = this.infantDetail.length * this.infantDetail[0]["flightFare"] + this.infantDetail.length * this.infantDetail[0]["feeNTaxes"] + this.infantDetail.length * this.infantDetail[0]["fees"];
        // let infantdiscount = this.infantDetail.length*this.fareDetails.discount;
        // this.infantttotal = this.infantttotal - infantdiscount
        // console.log('infantdiscount',infantdiscount)

        // console.log('infant total', this.infantttotal)

      }
      this.grandtotal = this.adulttotal + (this.childtotal ? this.childtotal : 0) + (this.infantttotal ? this.infantttotal : 0);
      this.grandtotal = this.grandtotal + this.onlineConvinenceFees;
      this.grandtotal = this.grandtotal - this.fareDetails.discount;
      this.grandtotal = Math.ceil(this.grandtotal);
      console.log('final total', this.grandtotal);
      // console.log(this.flightDetails);
      // console.log(this.passengerDetails);

      //calculation for grand total of adult ,child & infant


    })
  }
  ngOnDestroy(): void {
    this.subscribebooking.unsubscribe();
  }

  backTo() {
    this.router.navigate(['/myaccount/user-profile-form/myprofile/trips']);
  }

}

