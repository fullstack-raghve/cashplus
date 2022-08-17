import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSnackBar } from '@angular/material';
import { AddCardComponent } from '../add-card/add-card.component';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowYesNoComponent } from '../../show-yes-no/show-yes-no.component';
import * as moment from 'moment';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss'],
})
export class PaymentOptionComponent implements OnInit {
  loginemail: string;
  cardlist = [];
  cardid: string;
  cardLoding;
  totalcardlength: number;
  todayDate = moment().format("YYYY-MM-DD");

  constructor(private bottomSheet: MatBottomSheet, private cd: ChangeDetectorRef, private router: Router, private spinner: NgxSpinnerService, private profileControllerService: ProfileControllerService,
    public dialog: MatDialog, private _snackBar: MatSnackBar,) { }

  ngOnInit() {
    this.cardLoding = true;
    this.loginemail = localStorage.getItem('loginemail');
    this.findCard();
  }


  findCard() {
    this.loginemail = localStorage.getItem('loginemail');
    this.profileControllerService.getAllProfile(this.loginemail).subscribe((res) => {
      if (res) {
        this.cardLoding = false;
       // console.log('profile api', res)
       // console.log(res['userDetails']['paymentMethod']);
        this.cardlist = res['userDetails']['paymentMethod'];
        this.totalcardlength = this.cardlist.length;
       // console.log('cards length is',this.totalcardlength);

      this.cardlist.map(res=>{
  res['finalDate'] = moment(res['expireDate'], "YYYY-MM-DD").format("YYYY-MM");
  const fourdigit = res['originalCardNumber'].slice(-4);
  res['maskedNumber'] = fourdigit.padStart( res['originalCardNumber'].length,'*');

      });

      this.cardlist = this.cardlist.filter(res =>{
        return moment(res['finalDate']).format('YYYY-MM') >= moment(this.todayDate).format('YYYY-MM');
      })
      console.log('list', this.cardlist)
        this.cd.markForCheck();
      }
    });
  }

  trackByFn(index: number, card: any) {
    return index;//card.cardType;
}


  addcard() {

    if(this.totalcardlength>=5){
      let snackBarRef1 = this._snackBar.open("User can add maximum 5 cards", "", {
        duration: 1500
      });

    }else{    
    this.bottomSheet.open(AddCardComponent);
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res => {
      this.findCard();
    });
  }
  }

  delete(data) {
    let paymentMethodId = data.paymentMethodId;
    const dialogRef = this.dialog.open(ShowYesNoComponent, {
      data: { cardId: paymentMethodId },
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      width:'90%',
      maxWidth:'unset'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.findCard();
      }
    });

  }

  back() {
    this.router.navigate(["/myaccount/user-profile-form/myprofile"]);

  }
  carddetails(card) {
    // console.log(card)
  }



}
