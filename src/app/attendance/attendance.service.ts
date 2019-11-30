import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { first } from "rxjs/operators";
import {
  Person,
  Roles,
  PersonDTO,
  getArray,
  Statuses,
  Grades,
  AngularFireReturnTypes
} from "src/constants";
import { getSchoolYearFromDate } from "src/constants";
import { formatDate } from "@angular/common";
import { DatabaseService } from "../database.service";

@Injectable({
  providedIn: "root"
})
export class AttendanceService {
  constructor(private database: DatabaseService) {}

  public async getFormattedRoster(schoolYear, config) {
    let result: any = {};
    try {
      let roles = await this.database.getRoster(schoolYear, config);
      Object.entries(roles).forEach(([role, people]) => {
        let list: any = {};
        if (Grades[config.re_class].indexOf(Object.keys(people)[0]) !== -1) {
          Object.entries(people).forEach(([gradeStr, peopleInGrade]) => {
            list[gradeStr] = [];
            Object.entries(peopleInGrade).forEach(person =>
              list[gradeStr].push(
                new PersonDTO({ Name: person[1], Grade: gradeStr, Role: role })
              )
            );
          });
        } else {
          list.people = [];
          Object.entries(people).forEach(person =>
            list.people.push(
              new PersonDTO({ Name: person[1], Grade: null, Role: role })
            )
          );
        }
        result[role] = list;
      });
      return result;
    } catch (err) {
      console.log("ERROR ON [getPeopleFormatted]", err);
      return result;
    }
  }

  public async queryAttendanceForSpecificDayFormatted(date: Date, config) {
    let result: any = {};
    try {
      let items = await this.database.queryAttendanceForSpecificDay(
        date,
        config
      );
      if (items) {
        Object.entries(items).forEach(([role, snapShot]) => {
          let peoplePresent = getArray(snapShot, role, config.re_class);
          result[role] = peoplePresent;
        });
        return result;
      }
    } catch (err) {
      console.log("ERROR ON [queryAttendanceForSpecificDayFormatted],", err);
      return result;
    }
  }

  public shiftStartTime(shift, withDay?: boolean) {
    if (withDay) {
      let shiftStart = shift.split("/")[1].split("-")[0];
      return shiftStart;
    }
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
    queryString += "/" + Roles[person.Role];
    if (person.Grade) queryString += "/" + person.Grade;
    queryString += "/" + person.Name;
    let obj = {};
    obj["Status"] = person.Status;
    if (person.Time) obj["Time"] = person.Time;
    if (obj["Status"] === Statuses.Present && (person.Reason || !person.Time))
      obj["Time"] = this.shiftStartTime(shift, true);
    else if (obj["Status"] === Statuses.Tardy) {
      obj["Time"] = this.shiftStartTime(shift, true);
    }
    if (person.Status !== Statuses.Present) {
      obj["Reason"] = person.Reason;
      if (person.Comments) {
        obj["Comments"] = person.Comments;
      }
    }
    this.database.set(queryString, obj);
  }
}
