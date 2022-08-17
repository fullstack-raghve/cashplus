import { Component, OnInit } from '@angular/core';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import swal from 'sweetalert2';
import * as moment from "moment";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { MyErrorStateMatcher } from "src/app/pipe/shared/errorState";
import { FlightService } from 'src/app/services/flight.service';
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import { OverlayService } from 'src/app/services/overlay.service';



@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class AddCardComponent implements OnInit {
  loginemail: string;
  addcard: FormGroup;
  cardid: string;
  cardidnew: any;

  cnum: any;
  errtext: string;
  flagdate:boolean = false;
  matcher = new MyErrorStateMatcher();
  todate
  mmYYdate: string;
  minDateOptions = { dd: 1, mm: 1, yy: 0, yyyy: 1900 };
  maxDateOptions = { dd: 31, mm: 12, yy: 99, yyyy: 2020 };
  dateMaskOptions;
  todayDate = moment().format("MM/YYYY");
  get25yearsNext: any;
  formatted_date: string;
  fraudresponse: any;
  cardname_max_length_40 = ' 40 characters are allowed!';
  cardExpiryDateMask: Array<string | RegExp> = [/\d/, /\d/, "/", /\d/, /\d/];
  autoCorrectedDatePipe: any = createAutoCorrectedDatePipe("mm/yy");


    constructor(private profileControllerService : ProfileControllerService,
      private overlayService: OverlayService,private flightService: FlightService,private _snackBar: MatSnackBar,private bottomSheet: MatBottomSheet,private spinner: NgxSpinnerService,private formBuilder : FormBuilder) { }

  ngOnInit() {
    

  //  get30yearsNext;
   
      this.get25yearsNext = moment(this.todayDate, "MM/YYYY").add(12, "y").format("MM/YYYY");
    console.log('get25yearsNext',this.get25yearsNext)

     this.loginemail = localStorage.getItem('loginemail');

this.createform();

this.dateMaskOptions = {
  mask: [/\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],

  placeholder: "DD/MM/YYYY",
  pattern: /^\d{2}\/\d{2}\/\d{4}$/,
  keepCharPositions: true,
  guide: false,
};
  }
  presentLoading() {
    this.overlayService.showLoader();
  }

  closeLoading() {
    this.overlayService.hideLoader();
  }
  

  createform(){
 
    this.addcard = this.formBuilder.group({
     cardnumber: [
      "",
      RxwebValidators.compose({
        validators: [RxwebValidators.required(), RxwebValidators.numeric()]
      })
    ],
    
      name: [
        "",
        RxwebValidators.compose({
          validators: [
            RxwebValidators.required(),
            RxwebValidators.pattern({
              expression: { alpha: /^[a-zA-Z ]*$/ },
              message: "Only alphabets are allowed."
            }),
            RxwebValidators.maxLength({value:40, message:''}),

          ]
        })
      ],
   
   
    mydate: [
      "",
      RxwebValidators.compose({
        validators: [RxwebValidators.required()]
      })
    ],

    });
  }


  valued = '';

  fullnamecheckout:boolean;
  checkfullnameval(value: string) { 

    if(this.addcard.controls['name'].hasError('alpha') || this.addcard.controls['name'].hasError('required')){
console.log('errrr')
    }else{

   let cardnamevalue = this.addcard.controls['name'].value;
   let cardnamevalue_split = cardnamevalue.split(" ");
   let cardnamevalue_split_zero = cardnamevalue_split[0];
   let cardnamevalue_split_one = cardnamevalue_split[1];
   console.log('cardnamevalue_after split>>>',cardnamevalue_split)

   console.log('cardnamevalue_split_zero',cardnamevalue_split_zero)
   console.log('cardnamevalue_split_one',cardnamevalue_split_one)
  //  console.log('cardnamevalue_split_one length',cardnamevalue_split_one && cardnamevalue_split_one.length)

   // var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
// if(!regName.test(value)){
  if(cardnamevalue_split_one == undefined){

  console.log('Invalid name given.');
    this.fullnamecheckout = true;
    this.addcard.controls['name'].setErrors({ 'incorrect': true});
    this.addcard.controls['name'].markAsTouched();
    console.log('this.fullname',this.fullnamecheckout);

}else{
  if(cardnamevalue_split_one.length<1){
    this.fullnamecheckout = true;
    this.addcard.controls['name'].setErrors({ 'incorrect': true});
    this.addcard.controls['name'].markAsTouched();
  }else{

 
  this.fullnamecheckout = false;

  console.log('Valid name given.');
  console.log('this.fullname',this.fullnamecheckout);
}
}
}
  }



customCheck:boolean = false;
  validatecard(value){

    this.flightService.checkfraudcard(value).subscribe((res) => {
      console.log("checkfraudcard response-is this card fraud", res);
      this.fraudresponse = res;
      if (res == false) {
        this.detectCardType(value);

      }else{
        this.customCheck = true;
        this.addcard.controls['cardnumber'].setErrors({ 'incorrect': true});
        this.addcard.controls['cardnumber'].markAsTouched();
      }
    });

  }



  invaliddateformat:boolean =false;
  isCardExpired:boolean
  dateValidate(){
    //console.log('key up/blur working')
   let entereddate =  this.addcard.controls['mydate'].value;
   console.log('lll',entereddate.length)
   let length =  entereddate.length
   if(entereddate !=''){
   // console.log('filled')
  if(length>4){

  
    let convertdate = moment(entereddate,'MM/YY').format('MM/YYYY');
    console.log('enter date >>>',entereddate," converted date>>>",convertdate);
   //console.log('entereddate',entereddate);
   //console.log('todayDate',this.todayDate);
   let entereddateSplit = convertdate.split("/");
   let entereddateMonth:any = entereddateSplit[0];
   let entereddateYear:any = entereddateSplit[1];
  
      let todayDateSplit = this.todayDate.split("/");
      let todayDateMonth:any = todayDateSplit[0];
      let todayDateYear:any = todayDateSplit[1];

    let  get25yearsNext_Split = this.get25yearsNext.split("/");
    let get25yearsNextMonth:any = get25yearsNext_Split[0];
    let get25yearsNextYear:any = get25yearsNext_Split[1];

  
  //console.log('is enterd date big',+new Date(entereddateYear, entereddateMonth) >= +new Date(todayDateYear, todayDateMonth));
  if(+new Date(entereddateYear, entereddateMonth) >= +new Date(todayDateYear, todayDateMonth) && +new Date(entereddateYear, entereddateMonth) <= +new Date(get25yearsNextYear, 12)){
    this.isCardExpired = false;
  }else{
    this.addcard.controls['mydate'].setErrors({ 'incorrect': true});
    this.addcard.controls['mydate'].markAsTouched();
    this.isCardExpired = true;
  
  // console.log('card is already expired');
  }

}else{
  this.invaliddateformat = true;

  this.addcard.controls['mydate'].setErrors({ 'incorrect': true});
  this.addcard.controls['mydate'].markAsTouched();
    // alert('enter date in given format');
     console.log('enter date in given format');
  }

}
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
 
  }

  done(){
       console.log(this.addcard.value);

     if (this.addcard.invalid) {
      for(let i in this.addcard.controls)
      this.addcard.controls[i].markAsTouched();
  
      return;
    }
   // this.val();
 
    console.log(this.addcard.value);
    console.log(this.addcard.controls['cardnumber'].value);
    // moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD")
        // moment(this.addcard.controls['date'].value, "DD/MM/YYYY").format("YYYY-MM-DD")

        this.cnum = this.addcard.controls['cardnumber'].value;

        this.detectCardType(this.cnum);

        if(this.isValidcard){
          //this.spinner.show();

          this.presentLoading();

          const data = {
            "cardNumber": this.addcard.controls['cardnumber'].value,
            "cardOption": 0,
            "cardType": this.cardid,
            "expireDate": moment(this.addcard.controls['mydate'].value, "MM/YY").format("YYYY-MM-DD"),
            "isDefaultPayment": 0,
            "nameOnCard": this.addcard.controls['name'].value,
            "userAlias": this.loginemail
          }
          console.log('req body is',data)
          
              this.profileControllerService.addcard(data).subscribe((res) =>{
                console.log(res)
            
              if(res['statusMessage'] == 'success'){
              //  this.spinner.hide();
              this.closeLoading();
                swal.fire("Card Saved Successfully", '', 'success');
          
                this.bottomSheet.dismiss();
                this.profileControllerService.clearAllProfiletCache()
              }else{
                this.closeLoading();
                swal.fire("Some error", 'Please try after some time', 'error');
          
                this.bottomSheet.dismiss();
              }
              })
          
        }else{
          this.errtext = 'Invalid Card';
          let snackBarRef1 = this._snackBar.open("Invalid Card Number!", "", {
            duration: 1500
          });
          console.log(this.errtext)
        }



      }

isValidcard:boolean = false;
      detectCardType(cardnumber){
        console.log(cardnumber);
        let re = {
          //      

//        1: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,  //electron
//        3: /^(5019)\d+$/, //dankort
//        4: /^(636)\d+$/, //interpayment
//        5: /^(62|88)\d+$/, //unionpay
1: /^4[0-9]{12}(?:[0-9]{3})?$/, //visa
2: /^5[1-5][0-9]{14}$/, //mastercard
3: /^3[47][0-9]{13}$/, //amex
4: /^6(?:011|5[0-9]{2})[0-9]{12}$/, //discover
5: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, //diners
6: /^(?:2131|1800|35\d{3})\d{11}$/, //jcb
7: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,//maestro
//        12: /^(6061|6062|6063|6064|6065|6066|6067|6068|6069|607|608)\d+$/   //rupay

              
             }
          
    let keys;
         for(var key in re) {
             if(re[key].test(cardnumber)) {
               console.log(cardnumber)	
                 //keys =key
                 this.cardid = key;
                 this.cardidnew = key;
                 this.isValidcard = true;
                 console.log('card id is '+this.cardid)  	 
              
                 if(this.cardidnew<13 && this.cardidnew>0){
                   console.log('card is matching ');
                 }else{ 
                //  this.isValidcard = true;
                 // this.addcard.controls['cardnumber'].setErrors({ 'incorrect': true});
                 // this.addcard.controls['cardnumber'].markAsTouched();
                  console.log('card is not matching ');
                }

                // return key
                 
             }
             else{
             // this.isValidcard = true;
              ///this.addcard.controls['cardnumber'].setErrors({ 'incorrect': true});
             // this.addcard.controls['cardnumber'].markAsTouched();
          //     alert('Invalid Card')
          //  swal.fire("Invalid Card Details", 'Please Enter a Valid Card Details', 'error');
    
             console.log('card no.is not matching our regex');
           ///  this.isValidcard = false;
           //  this.spinner.hide();  	 
    ///
            }
         }
     };
  
oldregx(){
  let re = {
  1: /^4[0-9]{12}(?:[0-9]{3})?$/, //visa
  2: /^5[1-5][0-9]{14}$/, //mastercard
  3: /^3[47][0-9]{13}$/, //amex
  4: /^6(?:011|5[0-9]{2})[0-9]{12}$/,     //discover
  5: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, //diners
  6: /^(?:2131|1800|35\d{3})\d{11}$/, //jcb        
  7: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,//maestro                
  8: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,  //electron
  9: /^(5019)\d+$/, //dankort
  10: /^(636)\d+$/, //interpayment
  11: /^(62|88)\d+$/, //unionpay
  12: /^(6061|6062|6063|6064|6065|6066|6067|6068|6069|607|608)\d+$/   //rupay
  }
}

}


