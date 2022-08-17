import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripsModuleRoutingModule } from './trips-module-routing.module';
import { TripsComponent } from './trips/trips.component';
import { SharedModule } from 'src/app/pipe/shared/shared-module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
@NgModule({
  declarations: [TripsComponent],
  imports: [
    CommonModule,
    TripsModuleRoutingModule,
    SharedModule,
    MatButtonToggleModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ]
})
export class TripsModuleModule { }
