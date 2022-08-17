import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTravellerModuleRoutingModule } from './add-traveller-module-routing.module';
import { SharedModule } from 'src/app/pipe/shared/shared-module';
import { AddTravellerComponent } from './add-traveller/add-traveller.component';
import { MaterialModule } from '../../../pipe/shared/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
import { IonicSelectableModule } from 'ionic-selectable';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [AddTravellerComponent],
  imports: [
    CommonModule,
    AddTravellerModuleRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(options),
    IonicSelectableModule,
    TooltipModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AddTravellerModuleModule { 
 
}
