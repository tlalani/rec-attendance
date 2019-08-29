import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Chart } from "chart.js";
import {
  Roles,
  getSchoolYearFromDate,
  Person,
  PersonDTO,
  Statuses
} from "src/constants";
import { AttendanceService } from "../attendance/attendance.service";
import { MatDatepickerInputEvent } from "@angular/material";

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
  public people = {
    student: <PersonDTO[][]>[],
    teacher: <PersonDTO[][]>[],
    management: <PersonDTO[][]>[],
    support: <PersonDTO[][]>[]
  };
  public currentData: any;
  public data = {
    datasets: [
      {
        //absent, tardy, present
        data: [],
        backgroundColor: ["#FF6384", "#FFCD56", "#36A2EB", "#1FCF85"]
      }
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Absent", "Tardy", "Present", "Excused"]
  };
  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.currentDate = new Date();
    this.schoolYear = getSchoolYearFromDate(this.currentDate);
    this.makeFullQuery();
    this.myChart = new Chart("doughnutChart", {
      type: "doughnut",
      data: this.data,
      options: {
        legend: {
          display: true,
          position: "right"
        }
      }
    });
  }

  public getPeopleFormatted() {
    return this.attendanceService
      .getPeopleFormatted(this.schoolYear)
      .then(result => {
        return result;
      });
  }

  public queryAttendanceFormatted(currentData = null) {
    if (currentData) {
      let currList = [];
      let role = "";
      if (this.selectedRole === Roles.Intern) role = "support";
      else role = this.selectedRole.toLowerCase();
      currList = this.addAbsentPeople(currentData[role], this.people[role]);
      return new Promise((resolve, reject) => {
        resolve(currList);
      });
    } else {
      return this.attendanceService
        .queryAttendanceForSpecificDayFormatted(this.currentDate)
        .then(res => {
          if (res) {
            this.currentData = res;
            let currList = [];
            let role = "";
            if (this.selectedRole === Roles.Intern) role = "support";
            else role = this.selectedRole.toLowerCase();
            currList = this.addAbsentPeople(res[role], this.people[role]);
            return currList;
          }
        });
    }
  }
  makeFullQuery() {
    this.getPeopleFormatted().then(result => {
      if (result) {
        this.people.student = result.student;
        this.people.teacher = result.teacher;
        this.people.management = result.management;
        this.people.support = result.support;
        this.queryAttendanceFormatted().then((result: Person[]) => {
          if (result) {
            let newData = [0, 0, 0];
            result.forEach(person => {
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
    this.queryAttendanceFormatted(this.currentData).then((result: Person[]) => {
      if (result) {
        let newData = [0, 0, 0, 0];
        result.forEach(person => {
          if (!person.Status) {
            person.setStatus();
          }
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
        this.data.datasets[0].data = newData;
        this.myChart.update();
      } else {
        this.data.datasets[0].data = [];
      }
    });
  }

  addAbsentPeople(currList, peopleList) {
    let currListCopy = [];
    for (let i = 0; i < currList.length; i++) {
      if (currList[i].length > 0) {
        for (let personInGrade of peopleList[i]) {
          let contains = false;
          currList[i].forEach(personPresent => {
            if (personInGrade.equals(personPresent)) {
              currListCopy.push(personPresent);
              contains = true;
            }
          });
          if (!contains) {
            currListCopy.push(new Person(personInGrade));
          }
        }
      }
    }
    return currListCopy;
  }
}
