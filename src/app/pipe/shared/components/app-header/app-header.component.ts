import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  @Input() cnfinal;
  @Input() contactNonew;
  @Input() contactNo;
  @Input() contactNonew1;

  @Input() contactNox;
  //contactNo: string;


  constructor() { 
   
  }


  ngOnInit() {
  //  localStorage.setItem('contactNo',this.contactNo);
 // this.contactNo = localStorage.getItem('contactNo')
  }

}
