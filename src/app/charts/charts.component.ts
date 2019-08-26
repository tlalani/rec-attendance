import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
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
  public students: PersonDTO[][];
  public teachers: PersonDTO[][];
  public management: PersonDTO[][];
  public currentData: any;
  private canvas: ElementRef;
  @ViewChild("canvas") set content(content: ElementRef) {
    this.canvas = content;
  }
  public data = {
    datasets: [
      {
        //absent, tardy, present
        data: [],
        backgroundColor: ["#FF6384", "#FFCD56", "#36A2EB"]
      }
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Absent", "Tardy", "Present"]
  };
  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.currentDate = new Date();
    this.schoolYear = getSchoolYearFromDate(this.currentDate);
    this.makeFullQuery();
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
      if (this.selectedRole === Roles.Student) {
        //students
        let currStud = currentData.students;
        currList = this.addAbsentPeople(currStud, this.students);
      } else if (this.selectedRole === Roles.Teacher) {
        //teachers
        let currTeach = currentData.teachers;
        currList = this.addAbsentPeople(currTeach, this.teachers);
      } else if (this.selectedRole === Roles.Management) {
        //management
        let currManage = currentData.management;
        currList = this.addAbsentPeople(currManage, this.management);
      }
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

            if (this.selectedRole === Roles.Student) {
              //students
              let currStud = res.student;
              currList = this.addAbsentPeople(currStud, this.students);
            } else if (this.selectedRole === Roles.Teacher) {
              //teachers
              let currTeach = res.teacher;
              currList = this.addAbsentPeople(currTeach, this.teachers);
            } else if (this.selectedRole === Roles.Management) {
              //management
              let currManage = res.management;
              currList = this.addAbsentPeople(currManage, this.management);
            }

            return currList;
          }
        });
    }
  }

  makeFullQuery() {
    this.getPeopleFormatted().then(result => {
      if (result) {
        this.students = result.student;
        this.teachers = result.teacher;
        this.management = result.management;
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

  ngAfterViewInit() {
    this.myChart = new Chart(this.canvas.nativeElement.getContext("2d"), {
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

  changeDate(event: MatDatepickerInputEvent<Date>) {
    this.currentDate = event.value;
    this.schoolYear = getSchoolYearFromDate(this.currentDate);
    this.makeFullQuery();
  }

  onChange() {
    this.queryAttendanceFormatted(this.currentData).then((result: Person[]) => {
      if (result) {
        let newData = [0, 0, 0];
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
