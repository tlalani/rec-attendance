import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth.service";
import { takeUntil } from "rxjs/operators";
import { Days, Grades } from "src/constants";
import { AttendanceService } from "../attendance/attendance.service";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  private mode;
  private oobCode;
  private email;
  private password;
  private logoLink = "assets/pictures/logo.png";
  private days = Object.keys(Days);
  private classes = Object.keys(Grades);
  private selectedCenter;
  private selectedClass;
  private selectedDay;
  private startTime;
  private endTime;
  private loading: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["mode"] && params["oobCode"]) {
        this.mode = params["mode"];
        this.oobCode = params["oobCode"];
        switch (this.mode) {
          case "resetPassword":
            this.authService.auth
              .verifyPasswordResetCode(this.oobCode)
              .then(res => {
                this.email = res;
              })
              .catch(err => {
                alert("Your Email is incorrect, Please try again");
              });
        }
      } else {
        this.mode = "register";
        //this.router.navigate(["/login"]);
      }
    });
  }

  public isValid() {
    if (this.mode !== "register") {
      if (
        this.email &&
        this.password &&
        this.startTime &&
        this.endTime &&
        this.selectedCenter &&
        this.selectedClass &&
        this.startTime < this.endTime
      ) {
        return true;
      }
    } else {
      if (
        this.email &&
        this.startTime &&
        this.endTime &&
        this.selectedCenter &&
        this.selectedClass &&
        this.startTime < this.endTime
      ) {
        return true;
      }
    }
    return false;
  }

  submit() {
    this.loading = true;
    let a: any = {};
    if (this.mode !== "register") {
      a[this.selectedCenter] = {};
      a[this.selectedCenter][this.selectedClass] = [
        this.selectedDay +
          ", " +
          this.startTime.replace(" ", "_") +
          "-" +
          this.endTime.replace(" ", "_")
      ];
      console.log(a);
      this.authService.auth
        .confirmPasswordReset(this.oobCode, this.password)
        .then(() => {
          this.authService.signIn(this.email, this.password).then(user => {
            console.log(this.startTime, this.endTime);

            this.attendanceService
              .set("/users/" + user.uid + "/permissions", a)
              .then(() => {
                this.loading = false;
                alert("Your password has been successfully reset");
                this.router.navigate(["/login"]);
              });
          });
        });
    } else {
      a.re_center = this.selectedCenter;
      a.re_class = this.selectedClass;
      a.re_shift =
        this.selectedDay +
        ", " +
        this.startTime.replace(" ", "_") +
        "-" +
        this.endTime.replace(" ", "_");
      a.email = this.email;
      this.authService.requestRegister(a);
      alert(
        "Your request to register has been sent. You will be registered within the next 24 hours"
      );
      this.router.navigate(["/login"]);
    }
  }
}
