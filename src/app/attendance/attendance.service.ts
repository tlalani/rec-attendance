import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { Person } from "src/constants";
import { getSchoolYearFromDate } from "src/constants";
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  public result: Observable<any>;

  constructor(private db: AngularFireDatabase) {}

  public getPeople() {
    return this.db
      .object("People/Student")
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public queryAttendanceForSpecificDay(date) {
    const schoolYear = getSchoolYearFromDate(date);
    const queryString =
      schoolYear + "/" + formatDate(date, "MMM d, y", "en-US") + "/Student";
    console.log(queryString);
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }
}
