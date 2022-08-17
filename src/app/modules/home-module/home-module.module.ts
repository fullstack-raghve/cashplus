import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomeModuleRoutingModule } from './home-module-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../pipe/shared/shared-module';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from 'src/app/pipe/shared/material-module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    HomeModuleRoutingModule,
    SharedModule,
    MaterialModule,
    NgxSpinnerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeModuleModule { 
 
}
