// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'sofkoin',
    appId: '1:813803406176:web:8f8fa43ace779df756d405',
    storageBucket: 'sofkoin.appspot.com',
    apiKey: 'AIzaSyCIA4IcsHPdoHyRdWURg8xRi83-Par2fGY',
    authDomain: 'sofkoin.firebaseapp.com',
    messagingSenderId: '813803406176',
    measurementId: 'G-QMY0VSFQJ3',
  },
  production: false,
  alphaURl: 'http://localhost:8070',
  betaURl: 'http://localhost:8080',
  gammaURl: 'ws://localhost:8090/ws',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
