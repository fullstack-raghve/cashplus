import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../pipe/shared/material-module';
import { AccountModuleRoutingModule } from './account-module-routing.module';

import { AccountComponent } from './account/account.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    AccountModuleRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,  
    MatInputModule,   
    MaterialModule,                                                                                                                                                                                                
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AccountModuleModule { 
 
}
