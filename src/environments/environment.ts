// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBHfOgO7deLVgQNaLd-Om2YMBXGkNooVMc",
    authDomain: "attendance-rec.firebaseapp.com",
    databaseURL: "https://attendance-rec.firebaseio.com",
    projectId: "attendance-rec",
    storageBucket: "attendance-rec.appspot.com",
    messagingSenderId: "69537583971"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
