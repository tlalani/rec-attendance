import { Component, OnInit } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { AttendanceComponent } from "../attendance/attendance.component";
import { ManualEntryComponent } from "../manual-entry/manual-entry.component";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";
import { ChartsComponent } from "../charts/charts.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public options: GridsterConfig;
  public dashboard;
  public tabActive;
  constructor(private afAuth: AngularFireAuth, public router: Router) {}

  itemChange(item, itemComponent) {
    //console.info("itemChanged", item, itemComponent);
  }

  itemResize(item, itemComponent) {
    //console.log("itemResized", item, itemComponent);
  }

  ngOnInit() {
    if (!this.afAuth.user) {
      this.router.navigate(["/login"]);
    }
    this.dashboard = [
      {
        x: 0,
        y: 0,
        rows: 4,
        cols: 3,
        component: AttendanceComponent
      },
      {
        x: 3,
        y: 0,
        rows: 2,
        cols: 2,
        component: ManualEntryComponent
      },
      {
        x: 3,
        y: 2,
        rows: 2,
        cols: 2,
        component: ChartsComponent
      }
    ];

    this.options = {
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.itemResize,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false
      }
    };
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }
  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
  addItem() {
    this.dashboard.push({ x: 0, y: 0, rows: 0, cols: 0 });
  }

  performLogOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["login"]);
    });
  }
}
