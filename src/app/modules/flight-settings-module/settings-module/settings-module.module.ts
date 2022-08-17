import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsModuleRoutingModule } from './settings-module-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { MaterialModule } from '../../../pipe/shared/material-module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsModuleRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModuleModule { }
