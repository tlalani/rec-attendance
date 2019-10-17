import { Component, OnInit, ViewChild } from "@angular/core";
import { AttendanceService } from "../attendance/attendance.service";
import { AuthService } from "../auth.service";
import { getSchoolYearFromDate, Grades, PersonDTO, Mgmt } from "src/constants";
import { MatTable } from "@angular/material";

@Component({
  selector: "app-edit-roster",
  templateUrl: "./edit-roster.component.html",
  styleUrls: ["./edit-roster.component.scss"]
})
export class EditRosterComponent implements OnInit {
  public schoolYear: string;
  public result: PersonDTO[][];
  public loading: boolean = false;
  @ViewChild(MatTable) table: MatTable<any>;
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.result = [];
    this.schoolYear = getSchoolYearFromDate(new Date());
    let currentConfig = this.authService.getCurrentConfig();
    this.loading = true;
    this.attendanceService
      .getPeopleFormatted(this.schoolYear, currentConfig)
      .then(res => {
        if (res) {
          res.student.forEach(list => {
            this.result.push(list);
          });
          for (let i = 0; i < res.teacher.length; i++) {
            res.teacher[i].forEach(person => {
              this.result[i].push(person);
            });
          }
          res.management.forEach(list => {
            this.result.push(list);
          });
          res.support.forEach(list => {
            this.result.push(list);
          });
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
  }

  getTabLabel(index: number) {
    if (index < Grades.length) {
      return Grades[index];
    } else {
      return Object.keys(Mgmt)[index % Object.keys(Mgmt).length];
    }
  }

  handleChanges(event) {
    console.log(event);
  }
}
