import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Days, getSchoolYearFromDate, lastYear, nextYear } from "src/constants";

@Component({
  selector: "app-add-shift-dialog",
  templateUrl: "./add-shift-dialog.component.html",
  styleUrls: ["./add-shift-dialog.component.scss"]
})
export class AddShiftDialogComponent implements OnInit {
  public config;
  public shift: any = {};
  public days = Object.keys(Days);
  public years: String[];
  constructor(
    public dialogRef: MatDialogRef<AddShiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.config = this.data.config;
    this.config.re_shift = null;
    let schoolYear = getSchoolYearFromDate(new Date());
    this.years = [lastYear(schoolYear), schoolYear, nextYear(schoolYear)];
  }

  changeDay(event) {
    this.shift.day = event.value;
  }

  changeYear(event) {
    this.shift.schoolYear = event.value;
  }

  closeDialog() {
    this.config.re_shift = this.shift;
    this.dialogRef.close(this.config);
  }
}
