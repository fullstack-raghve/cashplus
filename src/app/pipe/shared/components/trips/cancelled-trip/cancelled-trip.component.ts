import { Component, OnInit } from '@angular/core';
import { MytripService } from 'src/app/services/mytrip.service';

@Component({
  selector: 'app-cancelled-trip',
  templateUrl: './cancelled-trip.component.html',
  styleUrls: ['./cancelled-trip.component.scss'],
})
export class CancelledTripComponent implements OnInit {

  constructor(private mytripService:MytripService,) { }

  ngOnInit() {}

  loadNewdata(){
    this.mytripService.clearAllRecentTriptCache();
  }

}
