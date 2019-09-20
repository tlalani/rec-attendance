import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-rec-options-dialog",
  templateUrl: "./rec-options-dialog.component.html",
  styleUrls: ["./rec-options-dialog.component.scss"]
})
export class RecOptionsDialogComponent {
  public currentConfig: any = {};
  public centers = [];
  public classes = [];
  public shifts = [];
  public config = {};

  constructor(
    public dialogRef: MatDialogRef<RecOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.config = this.data.config;
    this.centers = Object.keys(this.data.config);
  }

  public closeDialog() {
    this.dialogRef.close({ currentConfig: this.currentConfig });
  }

  public onChange(type: number) {
    switch (type) {
      case 0:
        this.classes = Object.keys(this.config[this.currentConfig.center]);
        break;
      case 1:
        this.shifts = this.config[this.currentConfig.center][
          this.currentConfig.class
        ];
        break;
      case 2:
        this.closeDialog();
        break;
    }
  }
}
