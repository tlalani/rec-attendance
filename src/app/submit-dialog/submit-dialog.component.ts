import { Component, Inject, Output, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Person, PersonDTO } from "src/constants";

@Component({
  selector: "app-submit-dialog",
  templateUrl: "./submit-dialog.component.html",
  styleUrls: ["./submit-dialog.component.scss"]
})
export class SubmitDialogComponent {
  public message;
  public toDelete: PersonDTO[];
  public displayedColumns = ["role", "name", "grade"];
  public colNames = ["Role", "Name", "Grade"];
  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = this.data.message;
    this.toDelete = this.data.deleting;
  }

  public closeDialog(i: number) {
    this.dialogRef.close(i);
  }

  public sendData() {}
}
