import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material";
import { AttendanceService } from "./attendance.service";
import {
  Person,
  PersonDTO,
  ReasonsArray,
  getGradeFromString,
  Grades,
  ELEMENT_DATA
} from "src/constants";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"]
})
export class AttendanceComponent implements OnInit {
  public result: any[] = [];
  public reasons = ReasonsArray;
  public currentDate: Date;
  public people: PersonDTO[][] = [[], [], [], [], [], [], [], [], []];
  public loading: boolean = false;
  public grades = Grades;
  constructor(private attendanceService: AttendanceService) {}

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
      .then(items => {
        Object.entries(items).forEach(([gradeStr, peopleInGrade]) => {
          let grade = getGradeFromString(gradeStr);
          Object.entries(peopleInGrade).forEach(person => {
            this.people[grade].push(
              new PersonDTO({ Name: person[1], Grade: gradeStr })
            );
          });
        });
      })
      .catch(error => {
        console.error("People doesn't exist.");
      });
  }

  public queryDailyAttendance() {
    this.result = [];
    let result: Set<Person>[] = [
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set()
    ];
    let resultDTO: PersonDTO[][] = [[], [], [], [], [], []];
    this.attendanceService
      .queryAttendanceForSpecificDay(this.currentDate)
      .then((items: Object) => {
        Object.entries(items).forEach(([gradeStr, peopleInGrade]) => {
          let grade = getGradeFromString(gradeStr);
          if (peopleInGrade) {
            Object.entries(peopleInGrade).forEach(person => {
              let name = person[0];
              let p = new Person(person[1]);
              p.Name = name;
              p.Grade = gradeStr;
              p.setStatus();
              result[grade].add(p);
              resultDTO[grade].push(new PersonDTO(p.toDTO()));
            });
          }
        });
        for (let grade = 0; grade < this.people.length; grade++) {
          if (this.people[grade].length > 0) {
            for (let res of this.people[grade]) {
              let contains = false;
              for (let res1 of resultDTO[grade]) {
                if (
                  res.Name.replace(/ /g, "") == res1.Name.replace(/ /g, "") &&
                  res.Grade.replace(/ /g, "") == res1.Grade.replace(/ /g, "")
                ) {
                  contains = true;
                  break;
                }
              }
              if (!contains) {
                result[grade].add(new Person(res));
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
        this.loading = false;
        console.error(
          "This day",
          this.currentDate.toDateString(),
          "doesn't have any attendance."
        );
      });
  }

  public saveEdits(student: Person) {
    console.log(student);
    const res = this.attendanceService.sendToDatabase(
      this.currentDate,
      student
    );
  }
}
