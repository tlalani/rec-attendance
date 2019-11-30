import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireReturnTypes, getSchoolYearFromDate } from "src/constants";
import { first } from "rxjs/operators";
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  public get(queryString, type?): Promise<any> {
    switch (type) {
      case AngularFireReturnTypes.Array:
        return this.db
          .list(queryString)
          .valueChanges()
          .pipe(first())
          .toPromise();
      //array
      case AngularFireReturnTypes.Object:
      default:
        return this.db
          .object(queryString)
          .valueChanges()
          .pipe(first())
          .toPromise();
    }
  }

  public set(queryString, object) {
    return this.db.object(queryString).set(object);
  }

  public remove(queryString) {
    return this.db.object(queryString).remove();
  }

  public getRoster(schoolYear, config) {
    let cc = config;
    let shift = cc.re_shift.replace(", ", "/");
    const queryString =
      "REC/" +
      cc.re_center +
      "/" +
      cc.re_class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear;
    return this.get(queryString);
  }

  public queryAttendanceForSpecificDay(date, config) {
    const schoolYear = getSchoolYearFromDate(date);
    let shift = config.re_shift.replace(", ", "/");
    const queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/Dates/" +
      schoolYear +
      "/" +
      formatDate(date, "MMM d, y", "en-US");
    return this.get(queryString);
  }

  public async deleteFromRoster(person, schoolYear, config) {
    let shift = config.re_shift.replace(", ", "/");
    let queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear +
      "/" +
      person.Role +
      "/";
    if (person.Grade) {
      queryString += person.Grade + "/";
    }
    let res = await this.get(queryString);
    let index = res.indexOf(person.Name);
    res.splice(index, 1);
    this.set(queryString, res);
  }

  public async sendToRoster(person, schoolYear, config) {
    let shift = config.re_shift.replace(", ", "/");
    let queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear +
      "/" +
      person.Role +
      "/";
    if (person.Grade) {
      queryString += person.Grade + "/";
    }
    let res = await this.get(queryString);
    if (res) {
      res.push(person.Name);
      this.set(queryString, res);
    } else {
      this.set(queryString, [person.Name]);
    }
  }
}
