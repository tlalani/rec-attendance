import { Component, OnInit } from "@angular/core";
import { AttendanceService } from "../attendance/attendance.service";
import { AuthService } from "../auth.service";
import {
  getSchoolYearFromDate,
  Grades,
  PersonDTO,
  Mgmt,
  pushToInnerList,
  Roles
} from "src/constants";
import { MatDialog } from "@angular/material";
import { AddStudentsDialogComponent } from "../add-students-dialog/add-students-dialog.component";
import { SubmitDialogComponent } from "../submit-dialog/submit-dialog.component";

@Component({
  selector: "app-edit-roster",
  templateUrl: "./edit-roster.component.html",
  styleUrls: ["./edit-roster.component.scss"]
})
export class EditRosterComponent implements OnInit {
  public schoolYear: string;
  public result: PersonDTO[][];
  public loading: boolean = false;
  public selection: any[] = [];
  public currentConfig: any = {};
  public roles = Object.keys(Roles);
  public grades;
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.result = [];
    this.selection = [];
    this.schoolYear = getSchoolYearFromDate(new Date());
    this.currentConfig = this.authService.getCurrentConfig();
    this.loading = true;
    this.grades = Grades[this.currentConfig.re_class];
    let mgmt = Object.keys(Mgmt);
    this.attendanceService
      .getPeopleFormatted(this.schoolYear, this.currentConfig)
      .then(res => {
        if (res) {
          Object.keys(res).forEach(role => {
            Object.keys(res[role]).forEach(key => {
              let index;
              if ((index = this.grades.indexOf(key)) !== -1) {
                pushToInnerList(this.result, index, res[role][key]);
              } else {
                let index = this.roles.indexOf(role);
                if (index !== -1) {
                  index = this.grades.length + index - 1;
                  pushToInnerList(this.result, index, res[role][key]);
                }
              }
            });
          });
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
  }

  getTabLabel(index: number) {
    if (index < Grades[this.currentConfig.re_class].length) {
      return Grades[this.currentConfig.re_class][index];
    } else {
      return this.roles[index - this.grades.length + 1];
    }
  }

  handleChanges(event) {
    if (event.selected) {
      this.selection.push(event.selected);
    } else if (event.unselected) {
      let person = event.unselected;
      let index = this.selection.findIndex(person2 => {
        return (
          person.Name === person2.Name &&
          person.Role === person2.Role &&
          person.Grade === person2.Grade
        );
      });
      this.selection.splice(index, 1);
    }
  }

  openDialog(dialog: string) {
    switch (dialog) {
      case "add":
        this.dialog
          .open(AddStudentsDialogComponent, {
            data: { re_class: this.currentConfig.re_class }
          })
          .afterClosed()
          .toPromise()
          .then(res => {
            if (res && res.result) {
              res.result.forEach(person => {
                this.attendanceService.sendToRoster(
                  person,
                  this.schoolYear,
                  this.authService.getCurrentConfig()
                );
              });
              this.ngOnInit();
            }
          });
        break;
      case "delete":
        if (this.selection.length > 0) {
          this.dialog
            .open(SubmitDialogComponent, {
              width: "700px",
              data: {
                message: "Are you sure you would like to delete these people?",
                deleting: this.selection
              }
            })
            .afterClosed()
            .toPromise()
            .then(res => {
              if (res && res === 1) {
                this.selection.forEach(person => {
                  this.attendanceService.deleteFromRoster(
                    person,
                    this.schoolYear,
                    this.authService.getCurrentConfig()
                  );
                });
                this.ngOnInit();
              }
            });
        } else {
          alert("Please Select a person to delete");
        }
    }
  }
}
