import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
//import {HttpClientModule} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {ConfirmationService} from 'primeng/api';


import { ServiceUrl } from './constants/serviceUrl';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectTravellerComponent } from './pipe/shared/components/flightcomponents/select-traveller/select-traveller.component'
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './pipe/shared/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OriginListModalComponent } from './pipe/shared/components/flightcomponents/origin-list-modal/origin-list-modal.component';
import { DestinationListModalComponent } from './pipe/shared/components/flightcomponents/destination-list-modal/destination-list-modal.component';
import { CalendarModule } from 'primeng/calendar';
import { SearchresultComponent } from './pipe/shared/components/flightcomponents/searchresult/searchresult.component';
import { AppSettingsComponent } from './pipe/shared/components/app-settings/app-settings.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastModule } from 'primeng/toast';
// import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider, SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, AuthService } from 'angularx-social-login';
import { CalenderComponent } from './pipe/shared/components/flightcomponents/calender/calender.component';
import { AuthServices } from './services/auth.service';
import { AuthInterceptors } from "./services/auth.interceptor";
import { OnewaycalenderComponent} from './pipe/shared/components/flightcomponents/onewaycalender/onewaycalender.component'
import { PriceFilterComponent } from './pipe/shared/components/flightcomponents/price-filter/price-filter.component';
import { FlightFilterComponent } from './pipe/shared/components/flightcomponents/flight-filter/flight-filter.component';
import { SimilarOptionComponent } from './pipe/shared/components/flightcomponents/similar-option/similar-option.component';
import { FareDetailsComponent } from './pipe/shared/components/flightcomponents/fare-details/fare-details.component';
import { ConfirmFlightComponent } from './pipe/shared/components/flightcomponents/confirm-flight/confirm-flight.component';
import { BaggageDetailsComponent } from './pipe/shared/components/flightcomponents/baggage-details/baggage-details.component';
import { FareRulesComponent } from './pipe/shared/components/flightcomponents/fare-rules/fare-rules.component';
import { FareRuleComponent } from './pipe/shared/components/flightcomponents/fare-rule/fare-rule.component';
import { AddGroupTravellerComponent } from './pipe/shared/components/flightcomponents/group-traveller/add-group-traveller/add-group-traveller.component';
import { GuestLoginComponent } from './pipe/shared/components/common shared component/guest-login/guest-login.component';
import { FlightPreferancesComponent } from './pipe/shared/components/flightcomponents/flight-preferances/flight-preferances.component';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { UserLoginComponent } from './pipe/shared/components/common shared component/user-login/user-login.component';
import { TravellerDetailsComponent } from './pipe/shared/components/flightcomponents/traveller-details/traveller-details.component';
import { PickTravellerComponent } from './pipe/shared/components/flightcomponents/traveller-details/pick-traveller/pick-traveller.component';
import { EditGroupTravellerComponent } from './pipe/shared/components/flightcomponents/group-traveller/edit-group-traveller/edit-group-traveller.component';
import { AddTravellerDetailsComponent } from './pipe/shared/components/flightcomponents/traveller-details/add-traveller-details/add-traveller-details.component';
import { PaymentTypesComponent } from './pipe/shared/components/payment-methods/payment-types/payment-types.component';
import { CashOnDeliveryComponent } from './pipe/shared/components/payment-methods/cash-on-delivery/cash-on-delivery.component';
import { CardPaymentComponent } from './pipe/shared/components/payment-methods/card-payment/card-payment.component';
import { ExchangeHouseComponent } from './pipe/shared/components/payment-methods/exchange-house/exchange-house.component';
import { BankDepositComponent } from './pipe/shared/components/payment-methods/bank-deposit/bank-deposit.component';

import { MatDialogModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule } from '@angular/material';
import { AddAdultComponent } from './pipe/shared/components/flightcomponents/traveller-details/add-adult/add-adult.component';
import { AddChildComponent } from './pipe/shared/components/flightcomponents/traveller-details/add-child/add-child.component';
import { AddInfantComponent } from './pipe/shared/components/flightcomponents/traveller-details/add-infant/add-infant.component';
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { MobilePayComponent } from './pipe/shared/components/payment-methods/mobile-pay/mobile-pay.component';
import { BookingConfirmationComponent } from './pipe/shared/components/payment-methods/booking-confirmation/booking-confirmation.component';
import {DropdownModule} from 'primeng/dropdown';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { RxFormBuilder, RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { TooltipsModule } from 'ionic-tooltips';

//import { CountryDropdownComponent } from './shared/components/country-dropdown/country-dropdown.component';
import { DiscountPipe } from './pipe/discount.pipe';
import { SharedModule } from './pipe/shared/shared-module';
import { TopHeaderComponent } from './pipe/shared/components/flightcomponents/top-header/top-header.component';
import { AddTimePipe } from './add-time.pipe';
import { SimilarOptionPipe } from './pipe/similar-option.pipe';
import { NationalityComponent } from './nationality/nationality.component';
import { GetCountryService } from './services/get-country.service';
import { MulticityCalendarComponent } from './pipe/shared/components/flightcomponents/multicity-calendar/multicity-calendar.component';
import { FilterReturnwayComponent } from './pipe/shared/components/flightcomponents/filter-returnway/filter-returnway.component';
import { FilterMultiComponent } from './pipe/shared/components/flightcomponents/filter-multi/filter-multi.component';
import { ConfirmingBookingComponent } from './pipe/shared/components/flightcomponents/confirming-booking/confirming-booking.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { KeypipePipe } from './pipe/keypipe.pipe';
import { PaymentOptionComponent } from './pipe/shared/components/flightcomponents/payment-option/payment-option.component';
// import {ConnectionServiceModule} from 'ng-connection-service';
import {ConnectionServiceModule } from 'ng-connection-service';
import { AddCardComponent } from './pipe/shared/components/flightcomponents/add-card/add-card.component';
import { NewGuestForgotComponent } from './pipe/shared/components/common shared component/new-guest-forgot/new-guest-forgot.component';
import { NewGuestSignUpComponent } from './pipe/shared/components/common shared component/new-guest-sign-up/new-guest-sign-up.component';
import { ForgotPasswordPopupComponent } from './modules/auth-module/forgot-password-module/forgot-password-popup/forgot-password-popup.component';
import { DatesPipe } from './pipe/dates.pipe';
import { CheckTravellerCountPipe } from './pipe/shared/components/flightcomponents/traveller-details/check-traveller-count.pipe';
import { StringLimitPipe } from './pipe/shared/components/flightcomponents/traveller-details/string-limit.pipe';
// import { NewGuestLoginComponent } from './shared/components/common shared component/new-guest-login/new-guest-login.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropperModalComponent } from './modules/flight-profile-module/cropper-modal/cropper-modal.component';
import { CountryFilterPipe } from './pipe/country-filter.pipe';
import { OffsetTopDirective } from './directives/offset-top.directive';
import { ScrollableDirective } from './directives/scrollable.directive';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { MulticitydatesPipe } from './pipe/multicitydates.pipe';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DialogboxComponent } from './pipe/shared/components/payment-methods/dialogbox/dialogbox.component';
import { CodCollectCashComponent } from './pipe/shared/components/payment-methods/cod-collect-cash/cod-collect-cash.component';
// import { EmbedVideo } from 'ngx-embed-video';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RoundUpPricePipe } from './pipe/round-up-price.pipe';
import { TextMaskModule } from 'angular2-text-mask';
import { TabViewModule } from 'primeng/tabview';
import { DisablebuttonDirective } from './directives/disablebutton.directive';
import { QuickTellerComponent } from './pipe/shared/components/payment-methods/quick-teller/quick-teller.component';
import { CashPlusComponent } from './pipe/shared/components/payment-methods/cash-plus/cash-plus.component';
import { CommonComponent } from './pipe/shared/components/flightcomponents/common/common.component';
import { conMinToHour } from './conMinToHour.pipe';
import { addspace } from './addspace.pipe';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
   //provider: new GoogleLoginProvider('397784686886-oc8ant51otfnnusr5lqhdkcitcp6qpig.apps.googleusercontent.com') //prod
     provider: new GoogleLoginProvider('889411308724-ab04cq5576vldod7rak68rvd0pc97mrh.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebookloginKey) // prod
  }

]);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    SelectTravellerComponent,
    OriginListModalComponent,
    DestinationListModalComponent,
    CalenderComponent,
    SearchresultComponent,
    AppSettingsComponent,
    PriceFilterComponent,
    FlightFilterComponent,
    OnewaycalenderComponent,
    SimilarOptionComponent,
   FareDetailsComponent,
   ConfirmFlightComponent,
   BaggageDetailsComponent,
   FareRulesComponent,
   FareRuleComponent,
   AddGroupTravellerComponent,
   EditGroupTravellerComponent,
   GuestLoginComponent,
   FlightPreferancesComponent,
   UserLoginComponent,
   TravellerDetailsComponent,
   PickTravellerComponent,
   AddTravellerDetailsComponent,
   PaymentTypesComponent,
   CashOnDeliveryComponent,
   CardPaymentComponent,
   DialogboxComponent,
   ExchangeHouseComponent,
   BankDepositComponent,
   AddAdultComponent,
   AddChildComponent,
   AddInfantComponent,
   MobilePayComponent,
   BookingConfirmationComponent,
   CodCollectCashComponent,
   //CountryDropdownComponent,
   DiscountPipe,
   TopHeaderComponent,
   AddTimePipe,
   SimilarOptionPipe,
   NationalityComponent,
   MulticityCalendarComponent,
   FilterReturnwayComponent,
   FilterMultiComponent,
   ConfirmingBookingComponent,
  //  TooltipDirective,
   AutofocusDirective,
  KeypipePipe,
  PaymentOptionComponent,
  AddCardComponent,
  NewGuestForgotComponent,
  NewGuestSignUpComponent,
  ForgotPasswordPopupComponent,
  DatesPipe,
  CheckTravellerCountPipe,
  StringLimitPipe,
  CropperModalComponent,
  CountryFilterPipe,
  OffsetTopDirective,
  ScrollableDirective,
  MulticitydatesPipe,
  DisablebuttonDirective,
  QuickTellerComponent,
  CashPlusComponent,
  CommonComponent,
  conMinToHour,
  addspace
  ],

  entryComponents: [
    SelectTravellerComponent, PriceFilterComponent,FlightFilterComponent,
    OriginListModalComponent,
     DestinationListModalComponent, 
     DialogboxComponent,
     CalenderComponent,
    SearchresultComponent,
    AppSettingsComponent,
    OnewaycalenderComponent,
    SimilarOptionComponent,
   FareDetailsComponent,
   ConfirmFlightComponent,
   BaggageDetailsComponent,
   FareRulesComponent,
   FareRuleComponent,
   AddGroupTravellerComponent,
   EditGroupTravellerComponent,
   GuestLoginComponent,
   FlightPreferancesComponent,
   UserLoginComponent,
   TravellerDetailsComponent,
   PickTravellerComponent,
   AddTravellerDetailsComponent,
   PaymentTypesComponent,
   CashOnDeliveryComponent,
   CardPaymentComponent,
   
   ExchangeHouseComponent,
   BankDepositComponent,
   NationalityComponent,
   MulticityCalendarComponent,
   FilterReturnwayComponent,
   FilterMultiComponent,
   AddCardComponent,
   NewGuestForgotComponent,
  NewGuestSignUpComponent,
  ForgotPasswordPopupComponent,
  CropperModalComponent,
  QuickTellerComponent
  ],
 
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
   SharedModule,
    Ng2SearchPipeModule,
    FieldsetModule,
    CalendarModule,
    IonicSelectableModule,
    IonicModule.forRoot({ swipeBackEnabled: false }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DateRangePickerModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    MatDialogModule,
    MatBottomSheetModule,
    NgxSpinnerModule,
    ToastModule,
    SelectAutocompleteModule,
    DropdownModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMaskModule.forRoot(options),
    NgxMatSelectSearchModule,
    ConnectionServiceModule,
    TooltipsModule.forRoot(),
    TooltipModule,
    ImageCropperModule,
    ConfirmDialogModule,
    ButtonModule,
    MessagesModule,
    TextMaskModule,
    TabViewModule,
    
    // EmbedVideo.forRoot()
  ],

  providers: [
    ConfirmationService,
    StatusBar,
    CookieService,
    ServiceUrl,
    AuthService,
    NgxNavigationWithDataComponent,
    ScreenOrientation,
    SplashScreen,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    
   
    AuthServices,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
   {provide: LocationStrategy, useClass: PathLocationStrategy},
    RxFormBuilder,
    GetCountryService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
