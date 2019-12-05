import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth.service";
import { Days, Grades, PASSWORD_STRING, MANAGEMENT_ROLES } from "src/constants";
import { DatabaseService } from "../database.service";
import { Observable, BehaviorSubject } from "rxjs";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  public mode;
  private oobCode;
  private email: BehaviorSubject<String> = new BehaviorSubject<String>("");
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params["mode"] && params["oobCode"]) {
        this.mode = params["mode"];
        this.oobCode = params["oobCode"];
        let a = await this.authService.auth.checkActionCode(this.oobCode);
        this.email.next(a.data.email);
      } else {
        this.mode = params["mode"];
        this.oobCode = null;
      }
    });
  }

  async handleSubmit(event) {
    await this.authService.handleUserFormSubmit(event, this.mode, this.oobCode);
    this.router.navigate(["/login"]);
  }
}
