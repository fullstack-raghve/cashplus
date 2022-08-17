import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProfileModuleRoutingModule } from './edit-profile-module-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MaterialModule } from '../../../pipe/shared/material-module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/pipe/shared/shared-module';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxSpinnerModule } from "ngx-spinner";
import { TooltipModule } from 'ng2-tooltip-directive';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    EditProfileModuleRoutingModule,
    MaterialModule,
    MatFormFieldModule,
    FormsModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    NgxSpinnerModule,
    TooltipModule,
    NgxMaskModule.forRoot(options),
    IonicSelectableModule,
  ],

  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class EditProfileModuleModule {

 }
