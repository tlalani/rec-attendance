import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material";
import { AttendanceService } from "./attendance.service";
import {
  Person,
  PersonDTO,
  ReasonsArray,
  getGradeFromString,
  Grades,
  ELEMENT_DATA,
  getStudentArray,
  Roles,
  createSetArray
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
  public students: PersonDTO[][] = [[], [], [], [], [], []];
  public teachers: PersonDTO[][] = [[], [], [], [], [], []];
  public management: PersonDTO[][] = [[], []];
  public loading: boolean = false;
  public grades = Grades;
  constructor(
    private attendanceService: AttendanceService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loading = true;
    let date = new Date();
    if (date.getDay() < 6) {
      let sub = date.getDay() + 1;
      date.setDate(date.getDate() - sub);
    } else if (date.getHours() < 10) {
      date.setDate(date.getDate() - 7);
    }
    this.currentDate = date;
    this.getPeopleQuery();
    this.queryDailyAttendance();
  }

  public addEvent(event: MatDatepickerInputEvent<Date>) {
    this.loading = true;
    this.currentDate = event.value;
    this.queryDailyAttendance();
  }

  public getPeopleQuery() {
    this.attendanceService
      .getPeople()
      .then(roles => {
        Object.entries(roles).forEach(([role, people]) => {
          if (role === Roles.Student || role === Roles.Teacher) {
            Object.entries(people).forEach(([gradeStr, peopleInGrade]) => {
              let grade = getGradeFromString(gradeStr);
              Object.entries(peopleInGrade).forEach(person => {
                if (role === Roles.Teacher) {
                  this.teachers[grade].push(
                    new PersonDTO({ Name: person[1], Grade: gradeStr })
                  );
                } else {
                  this.students[grade].push(
                    new PersonDTO({ Name: person[1], Grade: gradeStr })
                  );
                }
              });
            });
          } else {
            Object.entries(people).forEach(person => {
              let index =
                Object.keys(Roles).indexOf(role) % this.management.length;
              this.management[index].push(
                new PersonDTO({ Name: person[1], Grade: null })
              );
            });
          }
        });
      })
      .catch(error => {
        console.error("People doesn't exist.");
      });
  }

  public queryDailyAttendance() {
    this.result = [];
    let result: Set<Person>[] = [];
    this.attendanceService
      .queryAttendanceForSpecificDay(this.currentDate)
      .then((items: Object) => {
        Object.entries(items).forEach(([role, snapShot]) => {
          if (role === Roles.Student) {
            let r = getStudentArray(snapShot);
            r.forEach(item => {
              result.push(item);
            });
          }
        });
        for (let i = 0; i < result.length; i++) {
          if (result[i].size > 0) {
            for (let personInGrade of this.students[i]) {
              let contains = false;
              result[i].forEach(personPresent => {
                if (personInGrade.equals(personPresent)) {
                  contains = true;
                }
              });
              if (!contains) {
                result[i].add(new Person(personInGrade));
              }
            }
          }
        }
        result.forEach(items => {
          let res = Array.from(items);
          res.map((item: Person) => {
            item.editable = !item.isPresent();
          });
          this.loading = false;
          this.result.push(res);
        });
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
        console.error(
          "This day",
          this.currentDate.toDateString(),
          "doesn't have any attendance."
        );
      });
  }

  public saveEdits(student: Person) {
    const res = this.attendanceService.sendToDatabase(
      this.currentDate,
      student
    );
  }
}
