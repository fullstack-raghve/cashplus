import { NgModule,
  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightlistModuleRoutingModule } from './flightlist-module-routing.module';
import { FlightListComponent } from './flight-list/flight-list.component';
import { SharedModule } from '../../../pipe/shared/shared-module';

import { MaterialModule } from '../../../pipe/shared/material-module';

@NgModule({
  declarations: [FlightListComponent],
  imports: [
    CommonModule,
    FlightlistModuleRoutingModule,
    SharedModule,
    MaterialModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightlistModuleModule { }
