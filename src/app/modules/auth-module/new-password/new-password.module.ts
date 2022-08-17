import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../pipe/shared/shared-module';
import { MaterialModule } from 'src/app/pipe/shared/material-module';
import { NewPasswordRoutingModule } from './new-password-routing.module';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ShowChangePasswordPopupComponent } from './show-change-password-popup/show-change-password-popup.component';
import {  RxReactiveFormsModule } from "@rxweb/reactive-form-validators"

@NgModule({
  declarations: [NewPasswordComponent, ShowChangePasswordPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NewPasswordRoutingModule,
    SharedModule,
    MaterialModule,
    RxReactiveFormsModule
  ],
  entryComponents:[
    ShowChangePasswordPopupComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NewPasswordModule { }
