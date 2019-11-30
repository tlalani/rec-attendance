import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Chart } from "chart.js";
import {
  Roles,
  getSchoolYearFromDate,
  Person,
  Statuses,
  Days,
  getDay
} from "src/constants";
import { MatDatepickerInputEvent } from "@angular/material";
import { AuthService } from "../auth.service";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.scss"]
})
export class ChartsComponent implements OnInit, AfterViewInit {
  public myChart: Chart;
  public roles = Object.keys(Roles);
  public selectedRole: string = "Student";
  public currentDate: Date;
  public schoolYear: string;
  public people: any = {};
  public currentData: any;
  public data = {
    datasets: [
      {
        //absent, tardy, present
        data: [],
        backgroundColor: [
          "rgba(255,99,132, 0.7)",
          "rgba(255,205,86, 0.7)",
          "rgba(54,162,235, 0.7)",
          "rgba(31,207,133, 0.7)"
        ],
        borderColor: [
          "rgba(255,99,132, 1)",
          "rgba(255,205,86, 1)",
          "rgba(54,162,235, 1)",
          "rgba(31,207,133, 1)"
        ]
      }
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Absent", "Tardy", "Present", "Excused"]
  };
  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentDate = getDay(new Date(), Days.Saturday);
    this.schoolYear = getSchoolYearFromDate(this.currentDate);
    this.makeFullQuery();
    this.myChart = new Chart("doughnutChart", {
      type: "doughnut",
      data: this.data,
      options: {
        legend: {
          display: true,
          position: "right"
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function(tooltipItem, data) {
              var dataset = data["datasets"][0];
              var percent = Math.round(
                (dataset["data"][tooltipItem["index"]] /
                  dataset["_meta"][0]["total"]) *
                  100
              );
              return (
                data["datasets"][0]["data"][tooltipItem["index"]] +
                " (" +
                percent +
                "%)"
              );
            }
          }
        }
      }
    });
  }

  public getPeopleFormatted() {
    return this.databaseService
      .getRoster(this.schoolYear, this.authService.getCurrentConfig())
      .then(result => {
        return result;
      });
  }

  async queryAttendanceFormatted(currentData?) {
    if (currentData) {
      let currList = {};
      currList = this.addAbsentPeople(
        currentData[this.selectedRole],
        this.people[this.selectedRole]
      );
      return currList;
    } else {
      return await this.databaseService
        .queryAttendanceForSpecificDay(
          this.currentDate,
          this.authService.getCurrentConfig()
        )
        .then(res => {
          if (res) {
            this.currentData = res;
            let currList = {};
            let role = this.selectedRole;
            currList = this.addAbsentPeople(res[role], this.people[role]);
            return currList;
          }
        });
    }
  }
  makeFullQuery() {
    this.getPeopleFormatted().then(res => {
      if (res) {
        this.people = res;
        this.queryAttendanceFormatted().then((result: any) => {
          if (result) {
            let newData = [0, 0, 0, 0];
            Object.keys(result).forEach(key => {
              result[key].forEach(person => {
                if (person.Status === Statuses.Absent) {
                  newData[0] += 1;
                } else if (person.Status === Statuses.Tardy) {
                  newData[1] += 1;
                } else if (person.Status === Statuses.Present) {
                  newData[2] += 1;
                } else if (person.Status === Statuses.Excused) {
                  newData[3] += 1;
                }
              });
            });
            this.data.datasets[0].data = newData;
            this.myChart.update();
          } else {
            this.data.datasets[0].data = [];
            console.error("No People Found On Selected Date");
          }
        });
      } else {
        console.error("No People Found");
      }
    });
  }

  ngAfterViewInit() {}

  changeDate(event: MatDatepickerInputEvent<Date>) {
    this.currentDate = event.value;
    this.schoolYear = getSchoolYearFromDate(this.currentDate);
    this.makeFullQuery();
  }

  onChange() {
    this.queryAttendanceFormatted().then((result: any) => {
      if (result) {
        let newData = [0, 0, 0, 0];
        Object.keys(result).forEach(key => {
          result[key].forEach(person => {
            if (person.Status === Statuses.Absent) {
              newData[0] += 1;
            } else if (person.Status === Statuses.Tardy) {
              newData[1] += 1;
            } else if (person.Status === Statuses.Present) {
              newData[2] += 1;
            } else if (person.Status === Statuses.Excused) {
              newData[3] += 1;
            }
          });
        });
        this.data.datasets[0].data = newData;
        this.myChart.update();
      } else {
        this.data.datasets[0].data = [];
        console.error("No People Found On Selected Date");
      }
    });
  }

  addAbsentPeople(currObj, peopleObj) {
    let currObjCopy = {};
    Object.keys(peopleObj).forEach(key => {
      if (currObj[key].length > 0) {
        currObjCopy[key] = [];
        let contains = false;
        for (let personInGrade of peopleObj[key]) {
          currObj[key].forEach(personPresent => {
            if (personInGrade.equals(personPresent)) {
              currObjCopy[key].push(personPresent);
              contains = true;
            }
          });
          if (!contains) {
            currObjCopy[key].push(new Person(personInGrade));
          }
        }
      }
    });
    return currObjCopy;
  }
}
