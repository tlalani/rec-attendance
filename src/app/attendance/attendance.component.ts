import { Component, OnInit, Input } from "@angular/core";
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
  getAppRole,
  makePeopleObject,
  getDay,
  Days
} from "src/constants";
import { formatDate } from "@angular/common";
import { AuthService } from "../auth.service";
import { RecOptionsDialogComponent } from "../rec-options-dialog/rec-options-dialog.component";
import { first } from "rxjs/operators";
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
  public people = makePeopleObject();
  public loading: boolean = false;
  public grades = Grades;
  public schoolYear: string;
  public mgmtroles = Object.keys(Mgmt);
  public centers: string[];
  public classes: string[];
  public shifts: string[];
  currentConfig: any = {};
  constructor(
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // setTimeout(() => {
    //   this.loading = false;
    //   this.result = makeSampleData();
    // }, 2000);
    this.getCurrentConfig();
    this.loading = true;
    let date = new Date();
    let dayOfREC = this.currentConfig.shift.split(", ")[0];
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
          this.people.student = result.student;
          this.people.management = result.management;
          this.people.teacher = result.teacher;
          this.people.support = result.support;
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
          Object.keys(totalResult).forEach(role => {
            let result = totalResult[role];
            let roleFound = getAppRole(role);
            if (result.length > 0) {
              for (let i = 0; i < this.people[role].length; i++) {
                for (let personInGrade of this.people[role][i]) {
                  personInGrade.Role = roleFound;
                  if (result[i]) {
                    let contains = false;
                    result[i].forEach(personPresent => {
                      if (personInGrade.equals(personPresent)) contains = true;
                    });
                    if (!contains) {
                      pushToInnerList(result, i, new Person(personInGrade));
                    }
                  } else {
                    pushToInnerList(result, i, new Person(personInGrade));
                  }
                }
              }
            } else {
              for (let i = 0; i < this.people[role].length; i++) {
                this.people[role][i].forEach(person => {
                  person.Role = roleFound;
                  pushToInnerList(result, i, new Person(person));
                });
              }
            }
            for (let i = 0; i < result.length; i++) {
              let res = result[i];
              res.map((item: Person) => {
                item.editable = true;
                item.editing = false;
              });
              res.sort((a, b) => {
                if (a.Name > b.Name) {
                  return 1;
                } else {
                  return -1;
                }
              });
              if (res.length > 0) {
                if (
                  roleFound === Roles.Teacher ||
                  roleFound === Roles.Student
                ) {
                  res.forEach(item => {
                    pushToInnerList(this.result, i, item);
                  });
                } else {
                  this.result.push(res);
                }
              }
            }
          });
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
  }

  public getTabLabel(index: number) {
    if (index < this.grades.length) {
      return this.grades[index];
    } else {
      return this.mgmtroles[index % this.mgmtroles.length];
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
    // const res = this.attendanceService.sendToDatabase(
    //   this.currentDate,
    //   student
    // );
  }
}
