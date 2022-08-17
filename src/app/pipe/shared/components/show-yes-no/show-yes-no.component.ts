import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileControllerService } from 'src/app/services/profile-controller.service';
import { OverlayService } from 'src/app/services/overlay.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-show-yes-no',
  templateUrl: './show-yes-no.component.html',
  styleUrls: ['./show-yes-no.component.scss'],
})
export class ShowYesNoComponent implements OnInit {

  show_reset_password_res;
  response_resetpasword;
  verificationExpireLinkmsg = 'Verification link is no longer available. Re-send a new verification link and try again.';

  constructor(public dialogRef: MatDialogRef<ShowYesNoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private profileControllerService: ProfileControllerService,private overlayService: OverlayService) { }

  ngOnInit() {
    console.log(this.data);
    if(this.data['show_reset_password_res']){
      this.show_reset_password_res = true;
      this.response_resetpasword = this.data['response_reset_password']
    }else{
      this.show_reset_password_res = false;
     
    this.loginemail = localStorage.getItem('loginemail');
    }
    
  }
  loginemail;
  showLoader = false;
  deleCard() {
    this.overlayService.showLoader();
    const model = {
      "mathodId": this.data['cardId'],
      "userAlias": this.loginemail
    }
    this.profileControllerService.deletecard(model).subscribe((res) => {
      console.log(res);
      if (res['statusMessage'] == 'success') {
        this.showLoader = false;
        this.profileControllerService.clearAllProfiletCache();
        swal.fire("Card Delete Successfully",'', 'success');
        this.closeDialogue(true);
        this.overlayService.hideLoader();
      }
    },(err)=>{
      this.overlayService.hideLoader();
    });
  }

  cancelCard() {
    this.closeDialogue(false);
  }

  closeDialogue(condition){
    this.dialogRef.close(condition);
  }

}
