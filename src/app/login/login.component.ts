import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "../auth.service";
import { Type } from "src/constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public email: string = "";
  public password: string = "";
  public type: string = Type.Password;
  public flipDiv: boolean = false;
  public currentConfig: any = {};
  public centers = [];
  public classes = [];
  public shifts = [];
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  public async onLoginClick() {
    await this.authService.signIn(this.email, this.password);
    this.centers = await this.authService.getCenters();
    this.flip();
  }

  public goToRegister() {
    this.router.navigate(["/reset"], { queryParams: { mode: "register" } });
  }

  public goToReset() {
    this.router.navigate(["/reset"], {
      queryParams: { mode: "forgotPassword" }
    });
  }

  public getType() {
    return this.type;
  }

  public flip() {
    this.flipDiv = !this.flipDiv;
  }

  public changeType() {
    if (this.type === Type.Text) {
      this.type = Type.Password;
    } else {
      this.type = Type.Text;
    }
  }

  public async makeChange(type) {
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
        this.authService.setOptions(this.currentConfig);
        break;
    }
  }

  goBack() {
    this.authService.signOut().then(() => {
      this.email = "";
      this.password = "";
      this.currentConfig = {};
      this.flip();
    });
  }

  goToApp() {
    this.router.navigate(["/home"]);
  }
}
