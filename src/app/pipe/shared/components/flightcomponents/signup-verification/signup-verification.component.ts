import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-verification',
  templateUrl: './signup-verification.component.html',
  styleUrls: ['./signup-verification.component.scss'],
})
export class SignupVerificationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    alert('verified successfully');
    this.router.navigate(["/login"]);

  }

}
