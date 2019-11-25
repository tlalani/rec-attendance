import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AttendanceService } from "./attendance/attendance.service";
import { first } from "rxjs/operators";
import { isObjEmptyOrUndefined, AngularFireReturnTypes } from "src/constants";
import * as firebase from "firebase";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private user: firebase.User;
  private config: any = {};
  private currentConfig: any = {};
  private CURRENT_CONFIG_KEY: string = "currentConfig";
  private _isUserAdmin;
  public dataSource;
  constructor(
    private afAuth: AngularFireAuth,
    private attendanceService: AttendanceService
  ) {}

  get auth(): firebase.auth.Auth {
    return this.afAuth.auth;
  }
  get currentUser(): firebase.User {
    return this.user;
  }

  get currentUserId(): any {
    return this.user.uid || null;
  }

  get isAdmin(): any {
    return this._isUserAdmin;
  }

  private get userId(): any {
    return this.afAuth.auth.currentUser.uid;
  }

  private async setUser() {
    this.user = await this.getLoggedInUser();
    return await this.attendanceService
      .get("/users/" + this.currentUserId + "/permissions/admin")
      .then(res => {
        this._isUserAdmin = res || false;
        return this.user;
      });
  }

  public requestRegister(config) {
    let queryString = "/register/" + uuid();
    this.attendanceService.set(queryString, config);
  }

  public getCurrentConfig() {
    if (this.currentConfig && !isObjEmptyOrUndefined(this.currentConfig)) {
      return this.currentConfig;
    } else if (this.getCurrentConfigFromStorage()) {
      this.currentConfig = this.getCurrentConfigFromStorage();
      return this.currentConfig;
    }
  }

  hasCurrentConfig() {
    return (
      this.currentConfig &&
      this.currentConfig.re_center &&
      this.currentConfig.re_class &&
      this.currentConfig.re_shift
    );
  }

  getCurrentConfigFromStorage() {
    let a = JSON.parse(sessionStorage.getItem(this.CURRENT_CONFIG_KEY));
    return a;
  }

  async getCenters() {
    return await this._getCenters();
  }

  async getClasses(center: string) {
    return await this._getClasses(center);
  }

  async getShifts(center: string, re_class: string) {
    return await this._getShifts(center, re_class);
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
          .then(() => {
            return this.setUser();
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

  async getLoggedInUser() {
    if (this.user) return this.user;
    return await this.afAuth.authState
      .pipe(first())
      .toPromise()
      .then(user => {
        return user;
      });
  }

  signOut() {
    this.user = null;
    this._isUserAdmin = null;
    return this.afAuth.auth.signOut();
  }

  private async _getCenters() {
    let centers = [];
    let queryString = "";
    if (this.isAdmin) queryString = "REC/";
    else queryString = "users/" + this.userId + "/permissions";

    let res = await this.attendanceService.get(queryString);
    if (res) {
      Object.keys(res).forEach(center => {
        centers.push(center);
      });
    }
    return centers;
  }

  private async _getClasses(center) {
    let classes = [];
    let queryString = "";
    if (this.isAdmin) {
      queryString = "REC/" + center;
    } else {
      queryString = "users/" + this.userId + "/permissions/" + center;
    }
    let res = await this.attendanceService.get(queryString);
    if (res) {
      Object.keys(res).forEach(re_class => {
        classes.push(re_class);
      });
    }
    return classes;
  }

  private async _getShifts(center, re_class) {
    let shifts = [];
    let queryString = "";
    if (this.isAdmin) {
      queryString = "REC/" + center + "/" + re_class;
    } else {
      queryString =
        "users/" + this.userId + "/permissions/" + center + "/" + re_class;
    }
    let res = await this.attendanceService.get(queryString);
    if (res) {
      Object.keys(res).forEach(shift => {
        shifts.push(res[shift]);
      });
    }
    return shifts;
  }

  public setOptions(currentConfig) {
    this.currentConfig = currentConfig;
    sessionStorage.setItem(
      this.CURRENT_CONFIG_KEY,
      JSON.stringify(this.currentConfig)
    );
  }

  async getAllUsers(type) {
    let result = [];
    if (this.isAdmin) {
      const queryString = "/register/";
      let a = await this.attendanceService.get(queryString, type);
      return a;
    }
  }
}
