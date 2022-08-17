import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTravellerComponent } from './add-traveller/add-traveller.component';

const routes: Routes = [
  {
    path:'',
    component:AddTravellerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTravellerModuleRoutingModule { }
