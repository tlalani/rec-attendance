import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { AttendanceComponent } from "../attendance/attendance.component";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";
import { ChartsComponent } from "../charts/charts.component";
import { TourService } from "ngx-tour-md-menu";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "../auth.service";
import { MatDialog } from '@angular/material';
import { RecOptionsDialogComponent } from '../rec-options-dialog/rec-options-dialog.component';
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  public options: GridsterConfig;
  public dashboard;
  public tabActive;
  public cookieValue: string;
  constructor(
    private authService: AuthService,
    public router: Router,
    private tourService: TourService,
    private cookieService: CookieService,
    private dialog: MatDialog,
  ) {}

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
        component: AttendanceComponent
      },
      {
        x: 3,
        y: 0,
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

  ngAfterViewInit() {
    if (this.cookieService.check("tourComplete") !== true) {
      this.tourService.initialize([
        {
          anchorId: "start_off",
          content:
            "Welcome to the attendance editing and analysis system. " +
            "Let's start by going through some of the tools.",
          title: "Welcome",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_attendance",
          content:
            "This is the attendance table. " +
            "You will find teachers below the students for every grade",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_tab",
          content: "You can switch between grades and roles with these tabs",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_name",
          content:
            "Student's names are color coded. BLACK means everything is okay, " +
            "RED means you need to edit something, and TEAL means that it was edited and is now okay.",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_edit",
          content:
            "Clicking here will allow you to edit things about a student's attendance. " +
            "Make sure to click finish in this exact spot when complete to submit the changes.",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_date",
          content: "You can click here to change the attendance date.",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_download",
          content:
            "You can click here to download the attendance data for the selected date.",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "chart_chart",
          content: "This chart shows the breakdown of attendance on a date.",
          title: "Chart",
          enableBackdrop: true
        },
        {
          anchorId: "chart_date",
          content: "You can change the date here",
          title: "Chart",
          enableBackdrop: true
        },
        {
          anchorId: "chart_role",
          content:
            "You can also change the role to see the breakdown of teachers, management etc.",
          title: "Chart",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code",
          content: "Up here you can go through all the qr codes.",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_file",
          content: "Upload your file here to get new qr_codes.",
          title: "QR Codes",
          enableBackdrop: true,
          route: "/createqr"
        },
        {
          anchorId: "qr_code_pic",
          content:
            "Use this picture to help you figure out how to create the file.",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_reset",
          content: "You can clear and reset everything with this button.",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_back",
          content: "And You can go back with this button",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "home_avatar",
          content:
            "Click here to access options with your account. Use this to logout when you are finished." +
            "You will also automatically be logged out when you close the tab, or browser.",
          title: "Avatar",
          enableBackdrop: true,
          route: "/home"
        },
        {
          anchorId: "end",
          content: "Thats all for now.",
          title: "Complete",
          enableBackdrop: false
        }
      ]);
      this.startTour();
      this.cookieService.set("tourComplete", "true");
    }
  }

  handleToolbarClick(event) {
    switch(event) {
      case "logout":
        this.authService.signOut().then(() => {
          this.router.navigate(["/login"]);
        })
        break;
      case "options": 
        this.dialog.open(RecOptionsDialogComponent, {data: {config: this.authService.getFullConfig()}}).afterClosed().toPromise().then(res => {
          this.authService.setOptions(res.currentConfig);
          this.ngOnInit();
        });
        break;
      case "qr":
        this.router.navigate(["/createqr"]);
        break;
    }
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

  startTour() {
    this.tourService.start();
  }
}
