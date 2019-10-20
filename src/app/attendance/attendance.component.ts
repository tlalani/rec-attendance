import { Component, OnInit } from "@angular/core";
import { MatDatepickerInputEvent, MatDialog } from "@angular/material";
import { AttendanceService } from "./attendance.service";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import {
  Person,
  ReasonsArray,
  Grades,
  getSchoolYearFromDate,
  Mgmt,
  pushToInnerList,
  Roles,
  getDay,
  Days,
  isObjEmpty,
  PersonDTO
} from "src/constants";
import { formatDate } from "@angular/common";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"]
})
export class AttendanceComponent implements OnInit {
  public result: any[] = [];
  public reasons = ReasonsArray;
  public currentDate: Date;
  public people: any;
  public loading: boolean = false;
  public grades;
  public schoolYear: string;
  public roles = Object.keys(Roles);
  public centers: string[];
  public classes: string[];
  public shifts: string[];
  currentConfig: any = {};
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getCurrentConfig();
    this.grades = Grades[this.currentConfig.re_class];
    this.loading = true;
    let date = new Date();
    let dayOfREC = this.currentConfig.re_shift.split(", ")[0];
    date = getDay(date, Days[dayOfREC]);
    this.currentDate = date;
    this.schoolYear = getSchoolYearFromDate(date);
    this.getPeopleQuery(this.schoolYear);
    this.queryDailyAttendance();
  }

  public addEvent(event: MatDatepickerInputEvent<Date>) {
    this.loading = true;
    this.currentDate = event.value;
    this.queryDailyAttendance();
  }

  public getCurrentConfig() {
    this.currentConfig = this.authService.getCurrentConfig();
  }

  public getPeopleQuery(schoolYear) {
    this.attendanceService
      .getPeopleFormatted(schoolYear, this.currentConfig)
      .then(result => {
        if (result) {
          this.people = result;
        }
      });
  }

  public queryDailyAttendance() {
    //check to make sure you are checking the correct roster.
    //we have our roster of people based on every school year.
    if (getSchoolYearFromDate(this.currentDate) !== this.schoolYear) {
      this.schoolYear = getSchoolYearFromDate(this.currentDate);
      this.getPeopleQuery(this.schoolYear);
    }
    this.result = [];
    this.attendanceService
      .queryAttendanceForSpecificDayFormatted(
        this.currentDate,
        this.currentConfig
      )
      .then(totalResult => {
        if (totalResult) {
          Object.keys(this.people).forEach(role => {
            if (!isObjEmpty(totalResult[role])) {
              Object.keys(this.people[role]).forEach(key => {
                for (let personInGrade of this.people[role][key]) {
                  personInGrade.Role = role;
                  if (totalResult[role][key]) {
                    let contains = false;
                    totalResult[role][key].forEach(personPresent => {
                      if (personInGrade.equals(personPresent)) contains = true;
                    });
                    if (!contains) {
                      let p = new Person(personInGrade);
                      totalResult[role][key].push(p);
                    }
                  } else {
                    totalResult[role][key] = [];
                    this.people[role][key].forEach(person => {
                      let p = new Person(person);
                      p.editable = true;
                      p.editing = false;
                      totalResult[role][key].push(p);
                    });
                  }
                }
              });
            } else {
              Object.keys(this.people[role]).forEach(key => {
                this.people[role][key].forEach(person => {
                  let p = new Person(person);
                  p.editable = true;
                  p.editing = false;
                  totalResult[role][key].push(new Person(person));
                });
              });
            }
            Object.keys(totalResult[role]).forEach(key => {
              let res = totalResult[role][key];
              res.sort((a, b) => {
                if (a.Name > b.Name) {
                  return 1;
                } else {
                  return -1;
                }
              });
              res.forEach(item => {
                item.Role = role;
                if (this.grades.indexOf(key) !== -1) {
                  pushToInnerList(this.result, this.grades.indexOf(key), item);
                } else {
                  let i = this.roles.indexOf(role);
                  //-3 because Student, Teacher, and TA all should have grades
                  //+1 because Students are not one of the
                  //roles we want to display
                  pushToInnerList(
                    this.result,
                    this.grades.length + i - 1,
                    item
                  );
                }
              });
            });
          });
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
      });
  }

  public getTabLabel(index: number) {
    if (index < this.grades.length) {
      return this.grades[index];
    } else {
      let i = index - this.grades.length + 1;
      return this.roles[i];
    }
  }

  public downloadTodayAttendance() {
    let peopleDownload = [];
    if (this.result) {
      for (let i = 0; i < this.result.length; i++) {
        this.result[i].forEach(person => {
          peopleDownload.push({
            Role: person.Role,
            Grade: person.Grade || null,
            Name: person.Name,
            Status: person.Status
          });
        });
      }
      peopleDownload.sort((a, b) => {
        if (
          Object.keys(Roles).indexOf(a.Role) >
          Object.keys(Roles).indexOf(b.Role)
        )
          return 1;
        if (
          Object.keys(Roles).indexOf(a.Role) <
          Object.keys(Roles).indexOf(b.Role)
        )
          return -1;
        if (a.Grade > b.Grade) return 1;
        if (a.Grade < b.Grade) return -1;

        if (a.Status > b.Status) return -1;
        if (a.Status < b.Status) return 1;
      });
      let date = formatDate(this.currentDate, "MM-dd-yyyy", "en-US");
      let options = {
        nullToEmptyString: true,
        headers: ["Role", "Grade", "Name", "Status"]
      };
      let string = "attendance_" + date;
      new Angular5Csv(peopleDownload, string, options);
    }
  }

  public saveEdits(student: Person) {
    const res = this.attendanceService.sendToDatabase(
      this.currentDate,
      student,
      this.currentConfig
    );
  }
}
