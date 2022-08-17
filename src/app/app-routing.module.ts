import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SearchresultComponent } from './pipe/shared/components/flightcomponents/searchresult/searchresult.component';

import { AppSettingsComponent } from './pipe/shared/components/app-settings/app-settings.component';
import { AuthGuard } from './guard/auth.guard';
import { SimilarOptionComponent } from './pipe/shared/components/flightcomponents/similar-option/similar-option.component';
import { ConfirmFlightComponent } from './pipe/shared/components/flightcomponents/confirm-flight/confirm-flight.component';
import { BaggageDetailsComponent } from './pipe/shared/components/flightcomponents/baggage-details/baggage-details.component';
import { FareRulesComponent } from './pipe/shared/components/flightcomponents/fare-rules/fare-rules.component';
import { FareRuleComponent } from './pipe/shared/components/flightcomponents/fare-rule/fare-rule.component';


import { FlightPreferancesComponent } from './pipe/shared/components/flightcomponents/flight-preferances/flight-preferances.component';
import { TravellerDetailsComponent } from './pipe/shared/components/flightcomponents/traveller-details/traveller-details.component';
import { AddGroupTravellerComponent } from './pipe/shared/components/flightcomponents/group-traveller/add-group-traveller/add-group-traveller.component';
import { EditGroupTravellerComponent } from './pipe/shared/components/flightcomponents/group-traveller/edit-group-traveller/edit-group-traveller.component';
import { AddTravellerDetailsComponent } from './pipe/shared/components/flightcomponents/traveller-details/add-traveller-details/add-traveller-details.component';
import { PaymentTypesComponent } from './pipe/shared/components/payment-methods/payment-types/payment-types.component';
import { CardPaymentComponent } from './pipe/shared/components/payment-methods/card-payment/card-payment.component';
import { BankDepositComponent } from './pipe/shared/components/payment-methods/bank-deposit/bank-deposit.component';
import { BookingConfirmationComponent } from './pipe/shared/components/payment-methods/booking-confirmation/booking-confirmation.component';
import { ConfirmingBookingComponent } from './pipe/shared/components/flightcomponents/confirming-booking/confirming-booking.component';
import { TripDetailComponent } from './pipe/shared/components/trips/trip-detail/trip-detail.component';
import { PaymentOptionComponent } from './pipe/shared/components/flightcomponents/payment-option/payment-option.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { CodCollectCashComponent } from './pipe/shared/components/payment-methods/cod-collect-cash/cod-collect-cash.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CommonComponent } from './pipe/shared/components/flightcomponents/common/common.component';


const routes: Routes = [
  
      {
        path: ':homePageCountryid/:language',
        loadChildren: './modules/home-module/home-module.module#HomeModuleModule',
      },
      {
        path: ':homePageCountryid/:language/search-flights',
        loadChildren: './modules/flight-module/search-flight-module/search-flight-module.module#SearchFlightModuleModule'
      },
 
  {
    path:'account-module',
    loadChildren: './modules/account-module/account-module.module#AccountModuleModule'

  },
  {
    path: 'login',
    loadChildren: './modules/auth-module/login-module/login-module.module#LoginModuleModule',
  },
  {
    path: 'resetpassword',
    loadChildren: './modules/auth-module/new-password/new-password.module#NewPasswordModule',

  },
  {
    path: 'register',
    loadChildren: './modules/auth-module/register-module/register-module.module#RegisterModuleModule'
  },
  {
    path:'myaccount/:user-profile-form/:myprofile',
    canActivate: [AuthGuard],
    loadChildren: './modules/flight-profile-module/view-profile-module/view-profile-module.module#ViewProfileModuleModule',


  },
  {
    path: 'myaccount/user-profile-form/myprofile/edit-travller',
    loadChildren: './modules/flight-profile-module/edit-profile-module/edit-profile-module.module#EditProfileModuleModule'
  },

{
  path: 'myaccount/user-profile-form/myprofile/add-travller',
  loadChildren: './modules/flight-traveller-module/add-traveller-module/add-traveller-module.module#AddTravellerModuleModule'
},

   {
    path: 'settings-module',
    loadChildren: './modules/flight-settings-module/settings-module/settings-module.module#SettingsModuleModule'
  },{
   path:'password-module',
   loadChildren:'./modules/flight-settings-module/password-module/password-module.module#PasswordModuleModule',
   canActivate: [AuthGuard]

  },

  {
    path: 'page-not-found',
    loadChildren: './modules/pagenot-found-module/pagenot-found-module.module#PagenotFoundModuleModule'
  },
  {
    path: 'myaccount/user-profile-form/myprofile/trips',
    loadChildren: './modules/trips-module/trips-module.module#TripsModuleModule',
    canActivate: [AuthGuard]

  },
  {
    path: 'support-module',
    loadChildren: './modules/support-module/support-module.module#SupportModuleModule'
  },
 
  {
    path: 'search-flights',
    loadChildren: './modules/flight-module/search-flight-module/search-flight-module.module#SearchFlightModuleModule'
  },
  {
    path: 'flightlist',
    loadChildren: './modules/flight-module/flightlist-module/flightlist-module.module#FlightlistModuleModule'
  },

  {
    path: 'register',
    loadChildren: './modules/auth-module/register-module/register-module.module#RegisterModuleModule'
  },

  {
    path: 'forgot-password',
    loadChildren: './modules/auth-module/forgot-password-module/forgot-password-module.module#ForgotPasswordModuleModule'
  },
  {
    path: ':countryCode/:language/:cheap-flights/:search/:OriginAirportCityName-:to-:DestinationAirportCityName/:originCity-:destinationCity/:tripType',
    component: SearchresultComponent,
  }, 
  {  path: ':countryCode/:language/:flight-search/:originCityy-:destinationCityy/:dateonward/:cabinclass/:paxinfo',
    component: SearchresultComponent,
  },


  {
    path: ':countryCode/:language/:cheap-flights/:search/:tripType',
    component: SearchresultComponent,
  }, 
  {
    path: ':countryCode/:language/:flight-review/:confirmflight/:flight-details/:tripType',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:1Adult/:1Child/:1Infant/:IN/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:1Adult/:IN/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:1Adult/:1Child/:IN/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:1Infant/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:BLR-DEL/:18-07-2020/:Economy/:1Adult/:IN/:multi',
    component:ConfirmFlightComponent
  }, 
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:BLR-DEL/:18-07-2020/:Economy/:1Adult/:1Child/:1Infant/:IN/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:1Infant/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:BLR-DEL/:18-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:IN/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:1Infant/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:BLR-DEL/:18-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:IN/:multi',
    component:ConfirmFlightComponent
  },
 
   {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:28-07-2020/:Economy/:BOM-BLR/:30-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:1Child/:1Infant/:UK/:multi',
    component:ConfirmFlightComponent
  },
  {
    path:':in/:en/:flight-review/:DEL-BOM/:14-07-2020/:Economy/:BOM-BLR/:16-07-2020/:Economy/:BLR-DEL/:18-07-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:BLR-DEL/:01-08-2020/:Economy/:1Adult/:IN/:multi',
    component:ConfirmFlightComponent
  },
  {
    path: 'app-settings',
    component: AppSettingsComponent,

  },
  {
    path: ':countryCode/:language/:cheap-flights/:search/:OriginAirportCityName-:to-:DestinationAirportCityName/:originCity-:destinationCity/:tripTypess/:combination',
    component:SimilarOptionComponent
  },
  {
    path: ':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonward/:cabinonward/:datereturn/:cabinreturn/:adultinfo/:career/:triptype',
    component:ConfirmFlightComponent
  },
  {
    path: ':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonward/:cabinonward/:datereturn/:cabinreturn/:adultinfo/:childinfo/:career/:triptype',
    component:ConfirmFlightComponent
  },
  {
    path: ':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonward/:cabinonward/:adultinfo/:childinfo/:career/:triptype',
    component:ConfirmFlightComponent
  },
  {
    path: ':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonward/:cabinonward/:adultinfo/:childinfo/:childinfo/:career/:triptype',
    component:ConfirmFlightComponent
  },
  {
    path: ':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonward/:cabinonward/:datereturn/:cabinreturn/:adultinfo/:childinfo/:infantinfo/:career/:triptype',
    component:ConfirmFlightComponent
  },
  {
    path:'confirm-flight',
    component:ConfirmFlightComponent
  },
  {
    path: ':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonwar/:FlightOnwardCabinClass/:adult/:FlightOnwardCarrier/:Oneway',

    component:ConfirmFlightComponent
  },
  {
      path:'baggage-details',
      component:BaggageDetailsComponent,
  },
  {
    path:'fare-rules',
    component:FareRulesComponent,
  },
  {
    path:'addgroup-traveller',
    component:AddGroupTravellerComponent,
  },
  {
    path:'editgroup-traveller',
    component:EditGroupTravellerComponent,
  },
  {
    path:'myaccount/user-profile-form/myprofile/preferances',
    component:FlightPreferancesComponent
  },

  {
    path:'traveller-details',
    component:TravellerDetailsComponent,
    
  },
  {

 path:'payment-methods',
  component:PaymentTypesComponent

},

 
  {
    path:'addTraveller-Details',
    component:AddTravellerDetailsComponent
  },
  {
    path:':countryCode/:language/:flight-review/:originCity-:destinationCity/:dateonward/:cabinonward/:datereturn/:cabinreturn/:adultinfo/:career/:payment-methods/:triptype/:extra',
    component:PaymentTypesComponent
  
  },

  {
    path:'card-details',
    component:CardPaymentComponent
  },
  {
    path:'bank-Details',
    component:BankDepositComponent
  },
  {
    path:'cod-collect-cash',
    component:CodCollectCashComponent
  },
  {
    path:'booking-confirmation',
    component:BookingConfirmationComponent
  },
  { 
    path : 'confirming-booking',
    component:ConfirmingBookingComponent

  },
  {
    path : 'trip-detail',
    component:TripDetailComponent
  },
  {
    path : 'fare-rule',
    component:FareRuleComponent
  },
  {
    path: 'myaccount/user-profile-form/myprofile/payment',
    component : PaymentOptionComponent
  },
  {
    path:'emailverifier',
    component: VerifyEmailComponent
  },
 
 
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes)
  //  RouterModule.forRoot(routes, { useHash:true })
   RouterModule.forRoot(routes, { onSameUrlNavigation:'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// preloadingStrategy: PreloadAllModules,
// , { useHash: true }