import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordModuleRoutingModule } from './forgot-password-module-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from '../../../pipe/shared/shared-module';
import { MaterialModule } from '../../../pipe/shared/material-module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordPopupComponent } from './forgot-password-popup/forgot-password-popup.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordModuleRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  // entryComponents:[
  //   ForgotPasswordPopupComponent
  // ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgotPasswordModuleModule { }
