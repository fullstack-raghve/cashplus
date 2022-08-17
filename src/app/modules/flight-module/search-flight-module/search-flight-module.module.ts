import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchFlightModuleRoutingModule } from './search-flight-module-routing.module';
import { SearchFlightComponent } from './search-flight/search-flight.component';
import { SharedModule } from '../../../pipe/shared/shared-module';
// import { IonicSelectableModule } from 'ionic-selectable';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatDialogModule, MatBottomSheetModule } from '@angular/material';
@NgModule({
  declarations: [SearchFlightComponent],
  imports: [
    CommonModule,
    SearchFlightModuleRoutingModule,
    SharedModule,
    DateRangePickerModule,
    MatDialogModule,
    MatBottomSheetModule
    
    // IonicSelectableModule
  ],
  providers:[
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SearchFlightModuleModule { }
