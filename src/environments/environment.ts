
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json

export const environment = {
  production: false,
  
//baseUrl: 'http://203.122.41.147:8080', // dev

  // baseUrl: 'https://35.188.218.37:7443', //UAT 1

       
  
      baseUrl: "http://203.122.41.148:8080", //SIT 2

  //baseUrl:' https://34.66.201.176:7443', //app1

  //  baseUrl:'https://35.193.75.34:7443', //app2

 googleApiKey:'889411308724-ab04cq5576vldod7rak68rvd0pc97mrh.apps.googleusercontent.com', // for local
 facebookloginKey:'315277782897961',
 trackingAnalytics:false

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
