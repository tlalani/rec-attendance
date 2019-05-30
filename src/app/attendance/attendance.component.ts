import { Component, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material";
import { AttendanceService } from "./attendance.service";
import { Person, PersonDTO, reasonsArray } from "src/constants";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"]
})
export class AttendanceComponent implements OnInit {
  public displayedColumns: string[] = [
    "name",
    "grade",
    "status",
    "reason",
    "comments",
    "edit"
  ];
  public result: any[];
  public reasons = reasonsArray;
  public dataSource: Person[] = [];
  public currentDate: Date;
  public people: PersonDTO[] = [];
  public loading: boolean = false;
  public changesMade: boolean = false;
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
        Object.entries(items).forEach(grades => {
          let grade = grades[0];
          Object.entries(grades[1]).forEach(person => {
            this.people.push(new PersonDTO({ Name: person[1], Grade: grade }));
          });
        });
      })
      .catch(error => {
        console.error("People doesn't exist.");
      });
  }

  public queryDailyAttendance() {
    this.dataSource = [];
    let result: Set<Person> = new Set();
    let resultDTO: PersonDTO[] = [];
    this.attendanceService
      .queryAttendanceForSpecificDay(this.currentDate)
      .then((items: Object) => {
        Object.entries(items).forEach(grades => {
          let grade = grades[0];
          if (grades.length > 1) {
            Object.entries(grades[1]).forEach(person => {
              let name = person[0];
              let p = new Person(person[1]);
              p.Name = name;
              p.Grade = grade;
              p.setStatus();
              result.add(p);
              resultDTO.push(new PersonDTO(p.toDTO()));
            });
          }
        });
        for (let res of this.people) {
          let contains = false;
          for (let res1 of resultDTO) {
            if (
              res.Name.replace(/ /g, "") == res1.Name.replace(/ /g, "") &&
              res.Grade.replace(/ /g, "") == res1.Grade.replace(/ /g, "")
            ) {
              contains = true;
              break;
            }
          }
          if (!contains) {
            result.add(new Person(res));
          }
        }
        let res = Array.from(result);
        res.sort((a, b) => {
          if (a.Grade < b.Grade) {
            return -1;
          }
          if (a.Grade > b.Grade) {
            return 1;
          }
          if (a.Name < b.Name) {
            return -1;
          }
          if (a.Name > b.Name) {
            return 1;
          }
        });
        res.map((item: Person) => {
          item.editable = !item.isPresent();
        });
        this.loading = false;
        this.dataSource = res;
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

  public makeChange() {
    this.changesMade = true;
  }

  public startEditing(student: Person) {
    student.editing = true;
  }

  public saveEdits(student: Person) {
    const res = this.attendanceService.sendToDatabase(
      this.currentDate,
      student,
      this.changesMade
    );
    this.changesMade = false;
    student.editing = false;
  }
}
