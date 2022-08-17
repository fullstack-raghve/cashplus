import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-traveller-details',
  templateUrl: './add-traveller-details.component.html',
  styleUrls: ['./add-traveller-details.component.scss'],
})
export class AddTravellerDetailsComponent implements OnInit {
  returwaydata:any
  selected = '+91';
  constructor(private router:Router) { }

  ngOnInit() {}
  countinue(){
    this.router.navigate(['/payment-methods'])
  }
  backTo(){

  }
  fareDetails(){
    
  }
}
