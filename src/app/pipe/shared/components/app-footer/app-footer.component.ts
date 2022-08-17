import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent implements OnInit {
  footerYear = new Date().getFullYear()
  constructor(private router: Router) { }

  ngOnInit() {

  }

  toSupport(){
this.router.navigate(['/support-module']);
  }

}
