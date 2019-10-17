import { Component, Inject, Output, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Person } from "src/constants";

@Component({
  selector: "app-submit-dialog",
  templateUrl: "./submit-dialog.component.html",
  styleUrls: ["./submit-dialog.component.scss"]
})
export class SubmitDialogComponent {
  @Output() response;
  @Input() message;
  constructor(
    public dialogRef: MatDialogRef<SubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public closeDialog(i: number) {
    this.dialogRef.close(i);
  }

  public sendData() {}
}
