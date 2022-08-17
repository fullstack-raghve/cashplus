import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FlightService } from 'src/app/services/flight.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-confirming-booking',
  templateUrl: './confirming-booking.component.html',
  styleUrls: ['./confirming-booking.component.scss'],
})
export class ConfirmingBookingComponent implements OnInit {
  bookingRefNo;

  constructor(private activatedRoute: ActivatedRoute,
    private flightService: FlightService,private router:Router,private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
   this.getURLParameter();

  }


  getURLParameter() {
    this.bookingRefNo = this.activatedRoute.snapshot.queryParams.idValue;

    console.log(this.bookingRefNo);
   // this.verifyPasswordCode(this.getId);
   localStorage.setItem('bookingRefNo',this.bookingRefNo);

   if(this.bookingRefNo){
    console.log(this.bookingRefNo);
   // this.spinner.hide();
  
    this.flightService.sendbookingRefNo(this.bookingRefNo);

    this.router.navigate(['./booking-confirmation']);
    this.spinner.hide();

  }

  }

}
