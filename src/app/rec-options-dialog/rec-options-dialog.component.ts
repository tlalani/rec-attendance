import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-rec-options-dialog",
  templateUrl: "./rec-options-dialog.component.html",
  styleUrls: ["./rec-options-dialog.component.scss"]
})
export class RecOptionsDialogComponent implements OnInit {
  public currentConfig: any = {};
  public centers = [];
  public classes = [];
  public shifts = [];
  public config = {};

  constructor(
    public dialogRef: MatDialogRef<RecOptionsDialogComponent>,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    this.centers = await this.authService.getCenters();
  }

  public closeDialog() {
    this.dialogRef.close({ currentConfig: this.currentConfig });
  }

  public async onChange(type: number) {
    switch (type) {
      case 0:
        this.classes = await this.authService.getClasses(
          this.currentConfig.re_center
        );
        break;
      case 1:
        this.shifts = await this.authService.getShifts(
          this.currentConfig.re_center,
          this.currentConfig.re_class
        );
        break;
      case 2:
        this.closeDialog();
        break;
    }
  }
}
