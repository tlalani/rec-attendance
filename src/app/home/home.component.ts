import { Component, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { AttendanceComponent } from "../attendance/attendance.component";
import { AttendanceHomeComponent } from "../attendance-home/attendance-home.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public options: GridsterConfig;
  public dashboard;
  constructor() {}

  itemChange(item, itemComponent) {
    //console.info("itemChanged", item, itemComponent);
  }

  itemResize(item, itemComponent) {
    //console.log("itemResized", item, itemComponent);
  }

  ngOnInit() {
    this.dashboard = [
      {
        x: 0,
        y: 0,
        rows: 4,
        cols: 3,
        component: AttendanceHomeComponent
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
}
