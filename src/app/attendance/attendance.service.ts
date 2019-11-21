import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { first } from "rxjs/operators";
import {
  Person,
  Roles,
  getGradeFromString,
  PersonDTO,
  pushToInnerList,
  getArray,
  Statuses,
  Grades,
  AngularFireReturnTypes
} from "src/constants";
import { getSchoolYearFromDate } from "src/constants";
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  constructor(private db: AngularFireDatabase) {}

  public get(queryString, type?) {
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

  public getPeople(schoolYear, config) {
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
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public getPeopleFormatted(schoolYear, config) {
    let result: any = {};
    return this.getPeople(schoolYear, config)
      .then(roles => {
        Object.entries(roles).forEach(([role, people]) => {
          let list: any = {};
          if (Grades[config.re_class].indexOf(Object.keys(people)[0]) !== -1) {
            Object.entries(people).forEach(([gradeStr, peopleInGrade]) => {
              list[gradeStr] = [];
              Object.entries(peopleInGrade).forEach(person => {
                list[gradeStr].push(
                  new PersonDTO({
                    Name: person[1],
                    Grade: gradeStr,
                    Role: role
                  })
                );
              });
            });
          } else {
            list.people = [];
            Object.entries(people).forEach(person => {
              list.people.push(
                new PersonDTO({ Name: person[1], Grade: null, Role: role })
              );
            });
          }
          result[role] = list;
        });
        return result;
      })
      .catch(error => {
        console.log(error);
        console.error("People doesn't exist.");
        return null;
      });
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
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public queryAttendanceForSpecificDayFormatted(date: Date, config) {
    let result: any = {};
    return this.queryAttendanceForSpecificDay(date, config)
      .then(items => {
        if (items) {
          Object.entries(items).forEach(([role, snapShot]) => {
            let peoplePresent = getArray(snapShot, role, config.re_class);
            result[role] = peoplePresent;
          });
          return result;
        }
      })
      .catch(error => {
        console.log(error);
        // this.loading = false;
        console.error(
          "This day",
          date.toDateString(),
          "doesn't have any attendance."
        );
      });
  }

  public sendToDatabase(date: Date, person: Person, config: any) {
    const schoolYear = getSchoolYearFromDate(date);
    let shift = config.re_shift.replace(", ", "/");
    let queryString =
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
    if (person.Role === Roles.Student) {
      queryString += "/Student/" + person.Grade + "/" + person.Name;
    } else if (person.Role === Roles.Teacher) {
      queryString += "/Teacher/";
      if (person.Grade) {
        queryString += person.Grade + "/" + person.Name;
      } else {
        queryString += "Substitute/" + person.Name;
      }
    } else if (person.Role === Roles.Management) {
      queryString += "/Management/" + person.Name;
    } else {
      queryString += "/Intern/" + person.Name;
    }
    let obj = {};
    if (person.Status) {
      obj["Status"] = person.Status;
    }
    if (obj["Status"] === Statuses.Present && (person.Reason || !person.Time)) {
      if (person.Role === Roles.Management || person.Role === Roles.Teacher) {
        obj["Time"] = "10:10 AM";
      } else {
        obj["Time"] = "10:30 AM";
      }
    } else if (obj["Status"] === Statuses.Tardy) {
      if (person.Role === Roles.Management || person.Role === Roles.Teacher) {
        obj["Time"] = "10:15 AM";
      } else {
        obj["Time"] = "10:41 AM";
      }
    } else if (person.Time) {
      obj["Time"] = person.Time;
    }
    if (person.Status !== Statuses.Present) {
      if (person.Reason) {
        obj["Reason"] = person.Reason;
      }
      if (person.Comments) {
        obj["Comments"] = person.Comments;
      }
    }

    this.db.object(queryString).set(obj);
  }

  sendToRoster(person, schoolYear, config) {
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
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise()
      .then((res: any[]) => {
        if (res) {
          res.push(person.Name);
          this.db.object(queryString).set(res);
        } else {
          this.db.object(queryString).set([person.Name]);
        }
      });
  }

  deleteFromRoster(person, schoolYear, config) {
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
    console.log("Person: ", person, "queryString: ", queryString);
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise()
      .then((res: any[]) => {
        let index = res.indexOf(person.Name);
        res.splice(index, 1);
        this.db.object(queryString).set(res);
      });
  }
}
