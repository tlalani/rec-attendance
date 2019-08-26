import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Person } from "src/constants";

@Component({
  selector: "app-submit-dialog",
  templateUrl: "./submit-dialog.component.html",
  styleUrls: ["./submit-dialog.component.scss"]
})
export class SubmitDialogComponent {
  public displayedColumns: string[] = [
    "role",
    "date",
    "grade",
    "time",
    "name",
    "reason",
    "comments"
  ];
  public colNames: string[] = [
    "Role",
    "Date",
    "Grade",
    "Time",
    "Name",
    "Reason",
    "Comments"
  ];
  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public closeDialog() {
    this.dialogRef.close();
  }

  public sendData() {}
}
