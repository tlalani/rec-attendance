import { Component, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material";
import * as moment from "moment";
import { AttendanceService } from "./attendance.service";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";
import { Person, PersonDTO, reasonsArray } from "src/constants";
import { get } from "lodash";

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
    "comments"
  ];
  public reasons = reasonsArray;
  public dataSource: Person[];
  public currentDate: Date;
  public people: any[] = [];
  constructor(
    private attendanceService: AttendanceService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.currentDate = new Date();
    this.doQuery();
  }

  public addEvent(event: MatDatepickerInputEvent<Date>) {
    this.currentDate = event.value;
    this.doQuery();
  }

  public doQuery() {
    let result = [];
    let resultDTO = [];
    this.attendanceService.getPeople().then(items => {
      const peoplekeys = Object.keys(items);
      peoplekeys.forEach(grade => {
        for (let i = 0; i < items[grade].length; i++) {
          let name = items[grade][i];
          this.people.push(new PersonDTO({ Name: name, Grade: grade }));
        }
      });
      this.attendanceService
        .queryAttendanceForSpecificDay(this.currentDate)
        .then((items: any) => {
          const keys = Object.keys(items);
          keys.forEach(key => {
            const keys1 = Object.keys(items[key]);
            keys1.forEach(key1 => {
              let p = new Person(items[key][key1]);
              p.Name = key1;
              p.Grade = key;
              p.setStatus();
              result.push(p);
              resultDTO.push(new PersonDTO({ Name: p.Name, Grade: p.Grade }));
            });
          });
          for (let res of this.people) {
            let contains = false;
            for (let res1 of resultDTO) {
              if (res.Name === res1.Name && res.Grade === res1.Grade) {
                contains = true;
                break;
              }
            }
            if (!contains) {
              result.push(new Person(res));
            }
          }
          result.sort((a, b) => {
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
          this.dataSource = result;
        });
    });
  }
}
