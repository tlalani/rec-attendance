import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { auth } from "firebase";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public email: string = "";
  public password: string = "";
  public logoLink = "assets/pictures/logo.png";
  constructor(private router: Router, private auth: AngularFireAuth) {}

  ngOnInit() {}

  public onLoginClick() {
    this.auth.auth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        if (user) {
          this.router.navigate(["/home"]);
        } else {
          console.log("ERROR");
          this.router.navigate(["/home"]);
        }
      })
      .catch(error => {
        this.router.navigate(["/home"]);
        //alert("Login Unsuccessful, Please try again.");
      });
  }
}
