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
  Mgmt
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
  public students: PersonDTO[][];
  public teachers: PersonDTO[][];
  public management: PersonDTO[][];
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
        this.management = result.management;
        this.students = result.students;
        this.teachers = result.teachers;
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
          //students
          let result = totalResult.students;
          for (let i = 0; i < result.length; i++) {
            if (result[i].length > 0) {
              for (let personInGrade of this.students[i]) {
                let contains = false;
                result[i].forEach(personPresent => {
                  if (personInGrade.equals(personPresent)) {
                    contains = true;
                  }
                });
                if (!contains) {
                  result[i].push(new Person(personInGrade));
                }
              }
            }
          }
          result.forEach(items => {
            let res = Array.from(items);
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
            this.result.push(res);
          });
          //teachers
          let result1 = totalResult.teachers;
          for (let i = 0; i < result1.length; i++) {
            if (result1[i].length > 0) {
              for (let personInGrade of this.teachers[i]) {
                let contains = false;
                result1[i].forEach(personPresent => {
                  if (personInGrade.equals(personPresent)) {
                    contains = true;
                  }
                });
                if (!contains) {
                  result1[i].push(new Person(personInGrade));
                }
              }
            }
          }
          for (let i = 0; i < result1.length; i++) {
            let res = result1[i];
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
              res.forEach(item => {
                this.result[i].push(item);
              });
            }
          }
          //management
          let result2 = totalResult.management;
          console.log(result2);
          for (let i = 0; i < result2.length; i++) {
            if (result2[i].length > 0) {
              for (let personInGrade of this.management[i]) {
                let contains = false;
                result2[i].forEach(personPresent => {
                  if (personInGrade.equals(personPresent)) {
                    contains = true;
                  }
                });
                if (!contains) {
                  result2[i].push(new Person(personInGrade));
                }
              }
            }
          }
          result2.forEach(items => {
            let res = Array.from(items);
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
            this.result.push(res);
            this.loading = false;
            console.log(this.result.length, this.grades.length);
          });
        } else {
          this.loading = false;
        }
        //   if (totalResult) {
        //     let result = totalResult.studentsAndTeachers;
        //     for (let i = 0; i < result.length; i++) {
        //       if (result[i].size > 0) {
        //         for (let personInGrade of this.students[i]) {
        //           let contains = false;
        //           result[i].forEach(personPresent => {
        //             if (personInGrade.equals(personPresent)) {
        //               contains = true;
        //             }
        //           });
        //           if (!contains) {
        //             result[i].add(new Person(personInGrade));
        //           }
        //         }
        //       }
        //     }
        //     result.forEach(items => {
        //       let res = Array.from(items);
        //       res.map((item: Person) => {
        //         item.editable = true;
        //         item.editing = false;
        //       });
        //       res.sort((a, b) => {
        //         if (a.Name > b.Name) {
        //           return 1;
        //         } else {
        //           return -1;
        //         }
        //       });
        //       res = moveTeachersToBottom(res);
        //       this.result.push(res);
        //     });
        //     let result1 = totalResult.management;
        //     for (let i = 0; i < result1.length; i++) {
        //       if (result1[i].size > 0) {
        //         for (let person of this.management[i]) {
        //           let contains = false;
        //           result1[i].forEach(personPresent => {
        //             if (person.equals(personPresent)) {
        //               contains = true;
        //             }
        //           });
        //           if (!contains) {
        //             result1[i].add(new Person(person));
        //           }
        //         }
        //       }
        //     }
        //     result1.forEach(items => {
        //       let res = Array.from(items);
        //       res.map((item: Person) => {
        //         item.editable = true;
        //         item.editing = false;
        //       });
        //       // res.sort((a, b) => {
        //       //   if (a.Name > b.Name) {
        //       //     return 1;
        //       //   } else {
        //       //     return -1;
        //       //   }
        //       // });
        //       this.result.push(res);
        //       this.loading = false;
        //       console.log(this.result);
        //     });
        //   } else {
        //     this.loading = false;
        //   }
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
    console.log(student);
    const res = this.attendanceService.sendToDatabase(
      this.currentDate,
      student
    );
  }
}
