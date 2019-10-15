import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AttendanceService } from "./attendance/attendance.service";
import { first, isEmpty } from "rxjs/operators";
import { isObjEmpty } from 'src/constants';
import  * as firebase from 'firebase';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private user: firebase.User;
  private config: any = {};
  private currentConfig: any = {};
  private CURRENT_CONFIG_KEY: string = "currentConfig";
  private CONFIG_KEY: string = "config";
  constructor(
    private afAuth: AngularFireAuth,
    private attendanceService: AttendanceService
  ) {}

  public getCurrentConfig() {
    if (this.currentConfig && !isObjEmpty(this.currentConfig)) {
      return this.currentConfig;
    } else if (this.getCurrentConfigFromStorage()) {
      this.currentConfig = this.getCurrentConfigFromStorage();
      return this.currentConfig;
    }
    // } else {
    //   // await this.getRECOptions().then(config => {
    //   //   return (this.currentConfig = config);
    //   // });
    // }
  }

  public getFullConfig() {
    if(!this.config || isObjEmpty(this.config)) {
      this.config = JSON.parse(sessionStorage.getItem(this.CONFIG_KEY));
    }
    return this.config;
  }

  hasCurrentConfig() {
    return (
      this.currentConfig &&
      this.currentConfig.center &&
      this.currentConfig.class &&
      this.currentConfig.shift
    );
  }

  getCurrentConfigFromStorage() {
    let a = JSON.parse(sessionStorage.getItem(this.CURRENT_CONFIG_KEY));
    return a;
  }

  getCenters() {
    return Object.keys(this.config);
  }

  getClasses(center: string) {
    return Object.keys(this.config[center]);
  }

  getShifts(center: string, re_class: string) {
    return this.config[center][re_class];
  }

  removeCurrentStoredConfig() {
    sessionStorage.removeItem(this.CURRENT_CONFIG_KEY);
  }

  signIn(email, password) {
    return this.afAuth.auth
      .setPersistence("session")
      .then(() => {
        return this.afAuth.auth
          .signInWithEmailAndPassword(email, password)
          .then(user => {
            this.user = user.user;
            return user;
          })
          .catch(error => {
            console.log(error);
            return null;
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  isLoggedIn() {
    return this.afAuth.authState
      .pipe(first())
      .toPromise()
      .then(user => {
        this.user = user;
        return user;
      });
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  async getRECOptions() {
    await this._getCenters();
    return { config: this.config };
  }

  private _getCenters() {
    const queryString =
      "users/" + this.afAuth.auth.currentUser.uid + "/permissions";
    return this.attendanceService.get(queryString).then(result => {
      if (result) {
        Object.keys(result).forEach(center => {
          this.config[center] = {};
          Object.keys(result[center]).forEach(re_class => {
            this.config[center][re_class] = [];
            Object.values(result[center][re_class]).forEach(re_shift => {
              console.log(re_shift);
              this.config[center][re_class].push(re_shift);
            });
          });
        });
      }
    });
  }

  public setAllOptions(config) {
    this.config =  config;
    sessionStorage.setItem(this.CONFIG_KEY, JSON.stringify(config))
  }

  public setOptions(currentConfig) {
    this.currentConfig = currentConfig;
    sessionStorage.setItem(
      this.CURRENT_CONFIG_KEY,
      JSON.stringify(this.currentConfig)
    );
  }
}
