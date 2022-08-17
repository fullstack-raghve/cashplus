import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagenotFoundModuleRoutingModule } from './pagenot-found-module-routing.module';
import { PagenotFoundComponent } from './pagenot-found/pagenot-found.component';

@NgModule({
  declarations: [PagenotFoundComponent],
  imports: [
    CommonModule,
    PagenotFoundModuleRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagenotFoundModuleModule { }
