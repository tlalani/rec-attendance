import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AttendanceService } from "./attendance/attendance.service";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private user: firebase.User;
  private config: any = {};
  private currentConfig: any = {};
  private STORAGE_KEY: string = "currentConfig";
  constructor(
    private afAuth: AngularFireAuth,
    private attendanceService: AttendanceService
  ) {}

  public getCurrentConfig() {
    if (this.currentConfig) {
      return this.currentConfig;
    } else if (sessionStorage.getItem("config")) {
      return (this.currentConfig = sessionStorage.getItem("config"));
    }
    // } else {
    //   // await this.getRECOptions().then(config => {
    //   //   return (this.currentConfig = config);
    //   // });
    // }
  }

  hasCurrentConfig() {
    return (
      this.currentConfig &&
      this.currentConfig.center &&
      this.currentConfig.class &&
      this.currentConfig.shift
    );
  }

  getConfigFromStorage() {
    let a = sessionStorage.getItem(this.STORAGE_KEY);
    return a;
  }

  getUser() {
    return this.user || this.afAuth.auth.currentUser;
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

  removeStoredConfig() {
    sessionStorage.removeItem(this.STORAGE_KEY);
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
    this._getShifts();
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
          });
        });
      }
    });
  }

  public setOptions(currentConfig) {
    this.currentConfig = currentConfig;
    sessionStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.currentConfig)
    );
  }

  private _getShifts() {
    Object.keys(this.config).forEach(center => {
      Object.keys(this.config[center]).forEach(re_class => {
        const queryString = "REC/" + center + "/" + re_class + "/Shifts";
        this.attendanceService.get(queryString).then(result => {
          if (result) {
            Object.keys(result).forEach(day => {
              Object.keys(result[day]).forEach(shift => {
                this.config[center][re_class].push(day + ", " + shift);
              });
            });
          }
        });
      });
    });
  }
}
