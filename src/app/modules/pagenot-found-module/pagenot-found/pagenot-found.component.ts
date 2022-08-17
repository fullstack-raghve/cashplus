import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-pagenot-found',
  templateUrl: './pagenot-found.component.html',
  styleUrls: ['./pagenot-found.component.scss'],
})
export class PagenotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}
  editflight(){
    // this.router.navigate(['/']);
    let countryCode = localStorage.getItem('countryCode').toLowerCase();
let setLanguageSetting = 'en';
this.router.navigate([countryCode + "/" + setLanguageSetting]);
  }
  backTo(){
  }
}
