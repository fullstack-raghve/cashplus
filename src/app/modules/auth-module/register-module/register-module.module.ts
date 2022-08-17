import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterModuleRoutingModule } from './register-module-routing.module';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../../../pipe/shared/shared-module';

import { MaterialModule } from '../../../pipe/shared/material-module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterModuleRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RegisterModuleModule { }
