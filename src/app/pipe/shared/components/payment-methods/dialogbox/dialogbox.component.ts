import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss'],
})

export class DialogboxComponent {
  constructor(private dialogRef: MatDialogRef<DialogboxComponent>){
    dialogRef.disableClose = true;
  }




  ngOnInit() {}

}
