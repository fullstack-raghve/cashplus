import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { PasswordModuleRoutingModule } from './password-module-routing.module';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { MaterialModule } from '../../../pipe/shared/material-module';
@NgModule({
  declarations: [PasswordChangeComponent],
  imports: [
    CommonModule,
    PasswordModuleRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PasswordModuleModule { }
