import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';


import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { AppFooterComponent } from "./components/app-footer/app-footer.component";
import { AppWidgetComponent } from "./components/app-widget/app-widget.component";
import { AppFixedFooterComponent } from "./components/app-fixed-footer/app-fixed-footer.component";
import { AppOffersComponent } from "./components/app-offers/app-offers.component";
import { ReturnwayComponent } from "./components/flightcomponents/returnway/returnway.component";
import { MulticityComponent } from "./components/flightcomponents/multicity/multicity.component"
import { OnewayComponent } from './components/flightcomponents/oneway/oneway.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatSelectModule, MatFormFieldModule } from '@angular/material';
import { UpComingTripComponent } from './components/trips/up-coming-trip/up-coming-trip.component';
import { RecentTripComponent } from './components/trips/recent-trip/recent-trip.component';
import { CancelledTripComponent } from './components/trips/cancelled-trip/cancelled-trip.component';
import { TripDetailComponent } from './components/trips/trip-detail/trip-detail.component'
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CountryDropdownComponent } from './components/country-dropdown/country-dropdown.component';
//import { ViewProfileComponent } from '../modules/flight-profile-module/view-profile/view-profile.component';

//import { EditProfileComponent } from '../modules/flight-profile-module/profile/edit-profile/edit-profile.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RecentSearchComponent } from './components/flightcomponents/recent-search/recent-search.component';
import { RecentSearchOneWayComponent } from './components/flightcomponents/recent-search-one-way/recent-search-one-way.component';
import { MoreOptionPipe } from '../more-option.pipe';
import { TextlimitPipe } from '../textlimit.pipe';
import { SignupVerificationComponent } from './components/flightcomponents/signup-verification/signup-verification.component';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { RecentDatePipe } from '../recent-date.pipe';
import { TextMaskModule } from 'angular2-text-mask';
import { NoArrowDirective } from 'src/app/directives/no-arrow.directive';
import { TripFormFieldDirective } from 'src/app/directives/trip-form-field.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ShowYesNoComponent } from './components/show-yes-no/show-yes-no.component';
import { SessionTimeoutComponent } from './components/session-timeout/session-timeout.component';
import { VerifyEmailComponent } from 'src/app/verify-email/verify-email.component';
import { EmailVerifyPopupComponent } from './components/email-verify-popup/email-verify-popup.component';
import { RoundUpPricePipe } from '../round-up-price.pipe';
@NgModule({
  imports: [
    IonicModule,
    CalendarModule,
    CommonModule,
    FormsModule,
    IonicSelectableModule,
    DateRangePickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MaterialModule,
    FieldsetModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    TextMaskModule,
    OverlayModule
  ],
  exports: [
    AppHeaderComponent,
    AppFooterComponent,
    AppWidgetComponent,
    AppFixedFooterComponent,
    AppOffersComponent,
    ReturnwayComponent,
    OnewayComponent,
    MulticityComponent,
    UpComingTripComponent,
    RecentTripComponent,
    CancelledTripComponent,
    SnackBarComponent,
    TripDetailComponent,
   // ViewProfileComponent,
  //  EditProfileComponent,
  CountryDropdownComponent,
  RecentSearchComponent,
  RecentSearchOneWayComponent,
  MoreOptionPipe,
  TextlimitPipe,
  SignupVerificationComponent,
  TooltipDirective,
  TextMaskModule,
  TripFormFieldDirective,
  VerifyEmailComponent,
  EmailVerifyPopupComponent,
  RoundUpPricePipe
  // LoaderComponent
  ],
  entryComponents: [
    SnackBarComponent,
    LoaderComponent,
    ShowYesNoComponent,
    SessionTimeoutComponent,
    EmailVerifyPopupComponent
  ],
  providers: [

  ],
  declarations: [
    AppHeaderComponent,
    AppFooterComponent,
    AppWidgetComponent,
    AppFixedFooterComponent,
    AppOffersComponent,
    ReturnwayComponent,
    OnewayComponent,
    MulticityComponent,
    UpComingTripComponent,
    RecentTripComponent,
    CancelledTripComponent,
  //  ViewProfileComponent,
   // EditProfileComponent,
   SnackBarComponent,
   CountryDropdownComponent,
   RecentSearchComponent,
   RecentSearchOneWayComponent,
   MoreOptionPipe,
   TextlimitPipe,
   SignupVerificationComponent,
   TripDetailComponent,
   TooltipDirective,
   RecentDatePipe,
   NoArrowDirective,
   TripFormFieldDirective,
   LoaderComponent,
   ShowYesNoComponent,
   SessionTimeoutComponent,
   VerifyEmailComponent,
   EmailVerifyPopupComponent,
   RoundUpPricePipe

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
