import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth.service";
import { Days, Grades, PASSWORD_STRING, MANAGEMENT_ROLES } from "src/constants";
import { AttendanceService } from "../attendance/attendance.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  public mode;
  private oobCode;
  private invalid: boolean = false;
  private email;
  private create_password;
  private create_selectedCenter;
  private create_selectedClass;
  private create_selectedDay;
  private create_startTime;
  private create_endTime;
  private create_confirm_password;
  private register_selectedRole;
  private register_selectedCenter;
  public logoLink = "assets/pictures/logo.png";
  private days = Object.keys(Days);
  private classes = Object.keys(Grades);
  private loading: boolean = false;
  private user_roles = MANAGEMENT_ROLES;
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
      } else {
        this.mode = params["mode"];
      }
    });
  }

  public isValid() {
    if (this.mode === "resetPassword") {
      if (this.create_password) {
        if (this.create_confirm_password && this.passwordMatches()) {
          this.invalid = false;
          return true;
        } else {
          this.invalid = true;
          return false;
        }
      }
    } else if (this.mode === "verifyEmail") {
      if (
        this.create_password &&
        this.create_startTime &&
        this.create_endTime &&
        this.create_selectedCenter &&
        this.create_selectedClass &&
        this.create_startTime < this.create_endTime
      ) {
        if (this.create_confirm_password && this.passwordMatches()) {
          this.invalid = false;
          return true;
        } else {
          this.invalid = true;
          return false;
        }
      }
    } else if (this.mode === "register") {
      if (this.register_selectedCenter && this.register_selectedRole)
        return true;
    } else if (this.mode === "reset") {
      if (this.email) {
        return true;
      }
    }
    return false;
  }

  passwordMatches() {
    return this.create_password === this.create_confirm_password;
  }

  async submit() {
    this.loading = true;
    let a: any = {};
    switch (this.mode) {
      case "verifyEmail":
        let response = await this.authService.auth.checkActionCode(
          this.oobCode
        );
        this.email = response.data.email;
        if (this.email) {
          await this.authService.auth.applyActionCode(this.oobCode);
          a = this.createRECOptionsObject();
          let result = await this.authService.auth.signInWithEmailAndPassword(
            this.email,
            PASSWORD_STRING
          );
          await result.user.updatePassword(this.create_password);
          await this.attendanceService.set(
            "/users/" + result.user.uid + "/permissions",
            a
          );
          this.loading = false;
          alert("Your password has been successfully set");
        }
        break;

      case "resetPassword":
        this.email = await this.authService.auth.verifyPasswordResetCode(
          this.oobCode
        );
        await this.authService.auth.confirmPasswordReset(
          this.oobCode,
          this.create_password
        );
        alert("Your Password has been successfully reset");
        break;

      case "register":
        a.re_center = this.register_selectedCenter;
        a.re_role = this.register_selectedRole;
        a.email = this.email;
        this.authService.requestRegister(a);
        alert(
          "Your request to register has been sent. You will be registered within the next 24 hours"
        );
        break;
      case "reset":
        this.authService.auth.sendPasswordResetEmail(this.email);
        alert("Your Password Reset Email has been sent");
        break;
      default:
        alert("There was an error, Please try again");
        break;
    }
    this.router.navigate(["/login"]);
  }

  createRECOptionsObject() {
    let a: any = {};
    a[this.create_selectedCenter] = {};
    a[this.create_selectedCenter][this.create_selectedClass] = [
      this.create_selectedDay +
        ", " +
        this.create_startTime.replace(" ", "_") +
        "-" +
        this.create_endTime.replace(" ", "_")
    ];
    return a;
  }
}
