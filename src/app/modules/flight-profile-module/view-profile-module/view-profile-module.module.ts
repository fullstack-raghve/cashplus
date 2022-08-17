import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewProfileModuleRoutingModule } from './view-profile-module-routing.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SharedModule } from 'src/app/pipe/shared/shared-module';
import { MaterialModule } from '../../../pipe/shared/material-module';

@NgModule({
  declarations: [ViewProfileComponent],
  imports: [
    CommonModule,
    ViewProfileModuleRoutingModule,
    SharedModule,
   MaterialModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewProfileModuleModule { }
