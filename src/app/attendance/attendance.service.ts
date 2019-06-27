import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs";
import { first, map, isEmpty } from "rxjs/operators";
import { Person } from "src/constants";
import { getSchoolYearFromDate } from "src/constants";
import { formatDate } from "@angular/common";
import { ReturnStatement } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  public result: Observable<any>;

  constructor(private db: AngularFireDatabase) {}

  public getPeople() {
    return this.db
      .object("People")
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public queryAttendanceForSpecificDay(date) {
    const schoolYear = getSchoolYearFromDate(date);
    const queryString =
      schoolYear + "/" + formatDate(date, "MMM d, y", "en-US");
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public sendToDatabase(date: Date, student: Person) {
    const schoolYear = getSchoolYearFromDate(date);
    const queryString =
      schoolYear +
      "/" +
      formatDate(date, "MMM d, y", "en-US") +
      "/Student/" +
      student.Grade +
      "/" +
      student.Name;
    let obj = {};
    if (student.Status) {
      obj["Status"] = student.Status;
    }
    if (student.Reason) {
      obj["Reason"] = student.Reason;
    }
    if (student.Time) {
      obj["Time"] = student.Time;
    }
    if (student.Comments) {
      obj["Comments"] = student.Comments;
    }
    this.db.object(queryString).set(obj);
  }
}
