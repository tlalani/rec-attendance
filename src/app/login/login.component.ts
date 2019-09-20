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
  public logoLink = "assets/pictures/logo.png";
  public type: string = Type.Password;
  public flipDiv: boolean = false;
  public config: any = {};
  public currentConfig: any = {};
  public centers = [];
  public classes = [];
  public shifts = [];
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  public onLoginClick() {
    this.authService.signIn(this.email, this.password).then(user => {
      if (user) {
        this.getOptions().then(res => {
          this.config = res.config;
          this.centers = Object.keys(this.config);
          this.flip();
        });
      } else {
        alert("Could not sign you in");
      }
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

  public getOptions() {
    return this.authService.getRECOptions();
  }

  public makeChange(type) {
    switch (type) {
      case 0:
        this.classes = Object.keys(this.config[this.currentConfig.center]);
        break;
      case 1:
        this.shifts = this.config[this.currentConfig.center][
          this.currentConfig.class
        ];
        break;
      case 2:
        console.log(this.currentConfig);
        this.authService.setOptions(this.currentConfig);
        break;
    }
  }

  goBack() {
    this.authService.signOut().then(() => {
      this.email = "";
      this.password = "";
      this.flip();
    });
  }

  goToApp() {
    this.router.navigate(["/home"]);
  }
}
