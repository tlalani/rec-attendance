import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth.service";
import { Days, Grades, PASSWORD_STRING, MANAGEMENT_ROLES } from "src/constants";
import { DatabaseService } from "../database.service";
import { Observable, BehaviorSubject } from "rxjs";

@Component({
  selector: "app-password-actions",
  templateUrl: "./password-actions.component.html",
  styleUrls: ["./password-actions.component.scss"]
})
export class PasswordActionsComponent implements OnInit {
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
      } else if (params["mode"]) {
        this.mode = params["mode"];
        this.oobCode = null;
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  async handleSubmit(event) {
    if (event.email) {
      await this.authService.handleUserFormSubmit(
        event,
        this.mode,
        this.oobCode
      );
    }
    if (this.mode !== "forgotPassword" && this.mode !== "register")
      this.router.navigate(["/login"]);
  }
}
