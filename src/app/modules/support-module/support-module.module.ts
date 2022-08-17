import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupportModuleRoutingModule } from './support-module-routing.module';
import { SupportComponent } from './support/support.component';
import { SharedModule } from 'src/app/pipe/shared/shared-module';
import { MaterialModule } from '../../pipe/shared/material-module';
@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    SupportModuleRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SupportModuleModule { }
