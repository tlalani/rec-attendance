import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material";
import { AttendanceService } from "./attendance.service";
import {
  Person,
  PersonDTO,
  ReasonsArray,
  Grades,
  moveTeachersToBottom,
  getSchoolYearFromDate,
  Mgmt,
  pushToInnerList,
  Roles,
  getAppRole
} from "src/constants";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"]
})
export class AttendanceComponent implements OnInit {
  public result: any[] = [];
  public reasons = ReasonsArray;
  public currentDate: Date;
  public people = {
    student: <PersonDTO[][]>[],
    teacher: <PersonDTO[][]>[],
    management: <PersonDTO[][]>[],
    support: <PersonDTO[][]>[]
  };
  public loading: boolean = false;
  public grades = Grades;
  public schoolYear: string;
  public mgmtroles = Object.keys(Mgmt);
  constructor(
    private attendanceService: AttendanceService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    //   this.result = makeSampleData();
    // }, 2000);
    this.loading = true;
    let date = new Date();
    if (date.getDay() < 6) {
      let sub = date.getDay() + 1;
      date.setDate(date.getDate() - sub);
    } else if (date.getHours() < 10) {
      date.setDate(date.getDate() - 7);
    }
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

  public getPeopleQuery(schoolYear) {
    this.attendanceService.getPeopleFormatted(schoolYear).then(result => {
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
      .queryAttendanceForSpecificDayFormatted(this.currentDate)
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

  public saveEdits(student: Person) {
    const res = this.attendanceService.sendToDatabase(
      this.currentDate,
      student
    );
  }
}
