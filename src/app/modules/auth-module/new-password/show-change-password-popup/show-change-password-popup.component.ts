import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-show-change-password-popup",
  templateUrl: "./show-change-password-popup.component.html",
  styleUrls: ["./show-change-password-popup.component.scss"]
})
export class ShowChangePasswordPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShowChangePasswordPopupComponent>,
    private router: Router
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {}

  closePopup() {
    this.dialogRef.close();
    this.router.navigate(["/login"]);
  }
}
