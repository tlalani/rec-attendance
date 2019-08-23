import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs";
import { first, map, isEmpty } from "rxjs/operators";
import {
  Person,
  Roles,
  getGradeFromString,
  PersonDTO,
  pushToInnerList,
  moveTeachersToBottom,
  Mgmt,
  getArray,
  Statuses
} from "src/constants";
import { getSchoolYearFromDate } from "src/constants";
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  constructor(private db: AngularFireDatabase) {}

  public getPeople(schoolYear) {
    const queryString = "People/" + schoolYear;
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public getPeopleFormatted(schoolYear) {
    let students: PersonDTO[][] = [];
    let teachers: PersonDTO[][] = [];
    let management: PersonDTO[][] = [];
    return this.getPeople(schoolYear)
      .then(roles => {
        Object.entries(roles).forEach(([role, people]) => {
          if (role === Roles.Student || role === Roles.Teacher) {
            Object.entries(people).forEach(([gradeStr, peopleInGrade]) => {
              let grade = getGradeFromString(gradeStr);
              Object.entries(peopleInGrade).forEach(person => {
                if (role === Roles.Teacher) {
                  pushToInnerList(
                    teachers,
                    grade,
                    new PersonDTO({ Name: person[1], Grade: gradeStr })
                  );
                } else {
                  pushToInnerList(
                    students,
                    grade,
                    new PersonDTO({ Name: person[1], Grade: gradeStr })
                  );
                }
              });
            });
          } else {
            Object.entries(people).forEach(person => {
              let index = Object.keys(Mgmt).indexOf(role);
              pushToInnerList(
                management,
                index,
                new PersonDTO({ Name: person[1], Grade: null })
              );
            });
          }
        });
        return { students, teachers, management };
      })
      .catch(error => {
        console.error("People doesn't exist.");
      });
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

  public queryAttendanceForSpecificDayFormatted(date: Date) {
    let management: Person[][] = [];
    let students: Person[][] = [];
    let teachers: Person[][] = [];
    return this.queryAttendanceForSpecificDay(date)
      .then((items: Object) => {
        Object.entries(items).forEach(([role, snapShot]) => {
          let r = getArray(snapShot, role);
          if (role === Roles.Student) {
            r.forEach(classroom => {
              students.push(Array.from(classroom));
            });
          } else if (role === Roles.Teacher) {
            r.forEach(classroom => {
              teachers.push(Array.from(classroom));
            });
          } else {
            r.forEach(mgmtRole => {
              management.push(Array.from(mgmtRole));
            });
          }
        });
        return { students, teachers, management };
      })
      .catch(error => {
        // //console.log(error);
        // this.loading = false;
        console.error(
          "This day",
          date.toDateString(),
          "doesn't have any attendance."
        );
      });
  }

  public sendToDatabase(date: Date, person: Person) {
    const schoolYear = getSchoolYearFromDate(date);
    let queryString = schoolYear + "/" + formatDate(date, "MMM d, y", "en-US");
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
    if (obj["Status"] === Statuses.Present && person.Reason) {
      if (person.Role === Roles.Management || person.Role === Roles.Teacher) {
        obj["Time"] = "10:10 AM";
      } else {
        obj["Time"] = "10:30 AM";
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
}
