import { Component, OnInit, Input } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";
import { RecOptionsDialogComponent } from "../rec-options-dialog/rec-options-dialog.component";
import { MatDialog } from "@angular/material";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  public data: any = {};
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  }

  async changeOptions() {
    await this.authService.getRECOptions().then(result => {
      this.data.config = result.config;
    });
    const dialogRef = this.dialog.open(RecOptionsDialogComponent, {
      width: "500px",
      data: this.data
    });
  }

  toQr() {
    this.router.navigate(["/createqr"]);
  }
}
