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
  Statuses
} from "src/constants";
import { getSchoolYearFromDate } from "src/constants";
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  constructor(private db: AngularFireDatabase) {}

  public get(queryString) {
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public getPeople(schoolYear, config) {
    let cc = config;
    let shift = cc.shift.replace(", ", "/");
    const queryString =
      "REC/" +
      cc.center +
      "/" +
      cc.class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear;
    console.log(queryString);
    return this.db
      .object(queryString)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  public getPeopleFormatted(schoolYear, config) {
    let student: PersonDTO[][] = [];
    let teacher: PersonDTO[][] = [];
    let management: PersonDTO[][] = [];
    let support: PersonDTO[][] = [];
    return this.getPeople(schoolYear, config)
      .then(roles => {
        Object.entries(roles).forEach(([role, people]) => {
          console.log(role);
          if (role === Roles.Student || role === Roles.Teacher) {
            Object.entries(people).forEach(([gradeStr, peopleInGrade]) => {
              let grade = getGradeFromString(gradeStr);
              Object.entries(peopleInGrade).forEach(person => {
                if (role === Roles.Teacher) {
                  pushToInnerList(
                    teacher,
                    grade,
                    new PersonDTO({ Name: person[1], Grade: gradeStr })
                  );
                } else {
                  pushToInnerList(
                    student,
                    grade,
                    new PersonDTO({ Name: person[1], Grade: gradeStr })
                  );
                }
              });
            });
          } else {
            Object.entries(people).forEach(person => {
              if (role === Roles.Management) {
                pushToInnerList(
                  management,
                  0,
                  new PersonDTO({ Name: person[1], Grade: null })
                );
              } else {
                pushToInnerList(
                  support,
                  0,
                  new PersonDTO({ Name: person[1], Grade: null })
                );
              }
            });
          }
        });
        return { student, teacher, management, support };
      })
      .catch(error => {
        console.log(error);
        console.error("People doesn't exist.");
      });
  }

  public queryAttendanceForSpecificDay(date, config) {
    const schoolYear = getSchoolYearFromDate(date);
    let shift = config.shift.replace(", ", "/");
    const queryString =
      "REC/" +
      config.center +
      "/" +
      config.class +
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
    let management: Person[][] = [];
    let support: Person[][] = [];
    let student: Person[][] = [];
    let teacher: Person[][] = [];
    return this.queryAttendanceForSpecificDay(date, config)
      .then(items => {
        if (items) {
          Object.entries(items).forEach(([role, snapShot]) => {
            let r = getArray(snapShot, role);
            //console.log(role, r);
            switch (role) {
              case Roles.Student:
                r.forEach(classroom => {
                  student.push(Array.from(classroom));
                });
                break;
              case Roles.Teacher:
                r.forEach(classroom => {
                  teacher.push(Array.from(classroom));
                });
                break;
              case Roles.Management:
                management[0] = Array.from(r[0]);
                break;
              case Roles.Intern:
                support[0] = Array.from(r[0]);
            }
          });
          return { student, teacher, management, support };
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
    let shift = config.shift.replace(", ", "/");
    let queryString =
      "REC/" +
      config.center +
      "/" +
      config.class +
      "/Shifts/" +
      shift +
      "/Dates" +
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
}
