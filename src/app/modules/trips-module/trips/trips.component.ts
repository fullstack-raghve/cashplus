import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  upComing: boolean = false;
  recent: boolean = false;
  cancel: boolean = false;
  constructor(private router:Router,private location : Location) { }

  ngOnInit() {
    this.upComing = true;
  }
  backTo(){
    this.router.navigate(["/myaccount/user-profile-form/myprofile"]);

  // this.router.navigate(['/view-profile-module'])
    //this.location.back();

  }

  upComingTrip() {
    this.upComing = true;
    this.recent = false;
    this.cancel = false;
  }
  recentTrip() {
    this.upComing = false;
    this.recent = true;
    this.cancel = false;
  }
  cancellTrip() {
    this.upComing = false;
    this.recent = false;
    this.cancel = true;
  }
}
