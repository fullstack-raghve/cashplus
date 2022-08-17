import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { DropdownModule } from 'primeng/dropdown';
import { GlobalService } from 'src/app/services/global.service';
import *  as  airportList from '../../../../../../assets/airportList.json';
import { OriginListModalComponent } from '../origin-list-modal/origin-list-modal.component';
import { OverlayService } from 'src/app/services/overlay.service';
@Component({
  selector: 'app-flight-preferances',
  templateUrl: './flight-preferances.component.html',
  styleUrls: ['./flight-preferances.component.scss'],
})
export class FlightPreferancesComponent implements OnInit {
  loginemail: string;
  airport: any;
  seatPreference: any;
  mealPreference: any;
  preferancesform: FormGroup;
  finalresponse = true;
  airportid: any;

  form: FormGroup = new FormGroup({});

  foods = [
    { value: 0, name: 'Veg' },
    { value: 1, name: 'Non Veg' },
    { value: 2, name: 'Baby Meal' }
  ]
  seats = [
    { value: 0, name: 'Window' },
    { value: 1, name: 'Aisle' }
  ]


  constructor(private router: Router,
    private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private _snackBar: MatSnackBar,
    private profileControllerService: ProfileControllerService, private globalService: GlobalService, private bottomSheet: MatBottomSheet,
    private overlayService: OverlayService) {


  }

  ngOnInit() {
   this.createForm();
    this.loginemail = localStorage.getItem('loginemail');
    this.allairport();
    this.getFlightPrefrenceUserdata();
  }


  get f() {
    return this.form.controls;
  }
  isSubmitted = false;


  createForm() {
    this.form = this.formBuilder.group({
      foodField: ['', [Validators.required]],
      seatField: ['', [Validators.required]],
      airport: ['', [Validators.required]]

    })
  }
  allAirportList = airportList;
  finalAirportList;
  allairport() {
    this.finalAirportList = this.allAirportList['default'];
    this.finalresponse = false;
  }

  submit() {
    this.isSubmitted = true;
    console.log(this.form.value);
      this.airportid = this.form.get('airport').value,
      this.seatPreference = this.form.get('seatField').value,
      this.mealPreference = this.form.get('foodField').value

    if (this.form.invalid) {
      console.log('invalid form')
      return;
    }
    this.myPrefrence();

  }

  myPrefrence() {
    this.presentLoading();
    const model = {

      "airportId": this.airportid['airportId'],
      "mealPreference": this.mealPreference,
      "seatPreference": this.seatPreference,
      "userAlias": this.loginemail
    }
    console.log('model', model);
    this.profileControllerService.saveuserprefrences(model).subscribe(res => {
      if(res){
        console.log('prefrence API res', res);
        this.closeLoading();
        if (res['statusMessage'] == 'success') {
          let snackBarRef1 = this._snackBar.open("Saved Successfully", "", {
            duration: 3000
          });
          this.form.reset();
          this.isSubmitted = false;
          this.getFlightPrefrenceUserdata();
        } else {
          let snackBarRef1 = this._snackBar.open("Some Technical Error", "", {
            duration: 3000
          });
  
        }
      }
     

    },(err)=>{
      this.closeLoading();
    });

  }

  getFlightPrefrenceUserdata(){
    this.profileControllerService.getUserprefrences(this.loginemail).subscribe(
      (res)=>{
        if(res){
          console.log(res)
          let selectedFood =  res['mealPreference'];
          let selectedSeat =  res['seatPreference'];
          let selectedAirport = this.finalAirportList.filter(
            c => c.airportId == res['airportId']
          );
         this.airport = selectedAirport;
         this.form.patchValue({
          foodField: selectedFood,
          seatField: selectedSeat,
          airport: selectedAirport[0]
        })
        }
       
// airportId: 1648
// mealPreference: 1
// seatPreference: 0
      }, (err)=>{
        console.log(err)
      }
    )
  }

  backTo() {
    this.router.navigate(["/myaccount/user-profile-form/myprofile"])
  }

  openAirportListModal() {
    let prefrences = {
      flightPrefrence: true
    }

    this.bottomSheet._openedBottomSheetRef = this.bottomSheet.open(
      OriginListModalComponent,
      {
        data: prefrences,
        backdropClass: "calender-backdrop",
        panelClass: "origin_destination",
      }
    );

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(
      (res) => {
        console.log(res)
        if (res != undefined) {
          this.airport = [res['data']];
          console.log(this.airport)
          this.form.patchValue({
            airport: res['data'],
          })
        }
      }
    );
  }

  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
}
