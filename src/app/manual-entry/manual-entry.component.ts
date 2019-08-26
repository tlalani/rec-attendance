import { Component, OnInit } from "@angular/core";
import {
  Roles,
  Person,
  Statuses,
  Grades,
  ReasonsArray,
  militaryTimeToAMPM
} from "../../constants";
import { ManualEntryService } from "./manual-entry.service";
import { MatDialog } from "@angular/material";
import { SubmitDialogComponent } from "../submit-dialog/submit-dialog.component";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-manual-entry",
  templateUrl: "./manual-entry.component.html",
  styleUrls: ["./manual-entry.component.scss"]
})
export class ManualEntryComponent implements OnInit {
  public roles = Object.keys(Roles);
  public statuses = Object.keys(Statuses);
  public person: Person = new Person({});
  public grades: string[] = Grades;
  public names: string[] = [];
  public reasons = ReasonsArray;
  constructor(
    private manualEntryService: ManualEntryService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      width: "750px",
      data: {
        person: this.person.toArray([
          "Role",
          "Date",
          "Grade",
          "Time",
          "Name",
          "Reason",
          "Comments"
        ])
      }
    });
  }

  changeGrade(entry) {
    this.manualEntryService
      .getStudentsOfGrade(entry.value)
      .then((item: string[]) => {
        this.names = item;
      });
  }

  checkTime(e) {
    this.person.Time = militaryTimeToAMPM(e.target.value);
    this.person.setStatus();
  }

  changeDate(e) {
    let date: Date = new Date(e.target.value);
    this.person.Date = formatDate(date, "MMM d, y", "en-US");
  }
}
