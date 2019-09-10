import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public email: string = "";
  public password: string = "";
  public logoLink = "assets/pictures/logo.png";
  public type: string = "password";
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit() {}

  public onLoginClick() {
    this.signIn()
      .then(user => {
        if (user) {
          this.router.navigate(["/home"]);
        } else {
          alert("Could not sign you in");
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  public signIn() {
    return this.afAuth.auth
      .setPersistence("session")
      .then(() => {
        return this.afAuth.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  public getType() {
    return this.type;
  }

  public changeType() {
    if (this.type === "text") {
      this.type = "password";
    } else {
      this.type = "text";
    }
  }
}
