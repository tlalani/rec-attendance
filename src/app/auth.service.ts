import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AttendanceService } from "./attendance/attendance.service";
import { first } from "rxjs/operators";
import { isObjEmptyOrUndefined, USER_ROLES } from "src/constants";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private user: firebase.User;
  private currentConfig: any = {};
  private CURRENT_CONFIG_KEY: string = "currentConfig";
  private _userRole;
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
    return this._userRole === USER_ROLES.Admin;
  }

  private get userId(): any {
    return this.afAuth.auth.currentUser.uid;
  }

  private async setUser() {
    this.user = await this._getLoggedInUser();
    let res = await this.attendanceService.get(
      "/users/" + this.currentUserId + "/permissions/admin"
    );
    this._userRole = res ? USER_ROLES.Admin : USER_ROLES.User;
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

  public hasCurrentConfig() {
    return (
      (this.currentConfig &&
        this.currentConfig.re_center &&
        this.currentConfig.re_class &&
        this.currentConfig.re_shift) ||
      sessionStorage.getItem(this.CURRENT_CONFIG_KEY) !== null
    );
  }

  private getCurrentConfigFromStorage() {
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

  public removeCurrentStoredConfig() {
    sessionStorage.removeItem(this.CURRENT_CONFIG_KEY);
  }

  async signIn(email, password) {
    try {
      await this.afAuth.auth.setPersistence("session");
      let user = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      await this.setUser();
      return user;
    } catch (err) {
      console.log(err);
      alert("There was an error signing in");
    }
  }

  private async _getLoggedInUser() {
    if (this.user) return this.user;
    return await this.afAuth.authState
      .pipe(first())
      .toPromise()
      .then(user => {
        return user;
      });
  }

  public signOut() {
    this.user = null;
    this._userRole = null;
    this.removeCurrentStoredConfig();
    return this.afAuth.auth.signOut();
  }

  private async _getCenters() {
    let centers = [];
    let queryString = "";
    if (this.isAdmin) queryString = "REC/";
    else queryString = "users/" + this.userId + "/permissions";
    try {
      let res = await this.attendanceService.get(queryString);
      if (res) {
        Object.keys(res).forEach(center => centers.push(center));
      }
      return centers;
    } catch (err) {
      console.log("ERROR ON [getCenters]", err);
      return centers;
    }
  }

  private async _getClasses(center) {
    let classes = [];
    let queryString = "";
    if (this.isAdmin) {
      queryString = "REC/" + center;
    } else {
      queryString = "users/" + this.userId + "/permissions/" + center;
    }
    try {
      let res = await this.attendanceService.get(queryString);
      if (res) {
        Object.keys(res).forEach(re_class => classes.push(re_class));
      }
      return classes;
    } catch (err) {
      console.log("ERROR ON [getClasses]", err);
      return [];
    }
  }

  private async _getShifts(center, re_class) {
    let shifts = [];
    let queryString = "";
    if (this.isAdmin) {
      queryString = "REC2/" + center + "/" + re_class + "/Shifts";
    } else {
      queryString =
        "users/" + this.userId + "/permissions/" + center + "/" + re_class;
    }
    let res = await this.attendanceService.get(queryString);
    try {
      if (res) {
        Object.keys(res).forEach(shiftDay => {
          Object.keys(res[shiftDay]).forEach(shiftTime => {
            let shift = shiftDay + ", " + res[shiftDay][shiftTime];
            shifts.push(shift);
          });
        });
      }
      return shifts;
    } catch (err) {
      console.log("ERROR ON [getShifts]", err);
      return shifts;
    }
  }

  public setOptions(currentConfig) {
    this.currentConfig = currentConfig;
    sessionStorage.setItem(
      this.CURRENT_CONFIG_KEY,
      JSON.stringify(this.currentConfig)
    );
  }

  async getAllUsers(type) {
    if (this.isAdmin) {
      const queryString = "/register/";
      let a = await this.attendanceService.get(queryString, type);
      return a;
    }
  }
}
