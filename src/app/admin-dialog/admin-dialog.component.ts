import { Component, OnInit } from "@angular/core";
import { FirebaseAuth } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { Days } from "src/constants";

@Component({
  selector: "app-admin-dialog",
  templateUrl: "./admin-dialog.component.html",
  styleUrls: ["./admin-dialog.component.scss"]
})
export class AdminDialogComponent implements OnInit {
  public emails;
  public currentEmail;
  public currentCenter;
  public currentClass;
  public startTime;
  public days = Days;
  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit() {}

  isEmail() {
    let a = this.currentEmail.split("@");
    return a.length === 2 && a[1].length > 0;
  }

  addUser() {
    this.emails.push(this.currentEmail);
    this.currentEmail = "";
  }

  submit() {
    this.afAuth.auth
      .createUserWithEmailAndPassword(this.currentEmail, "password")
      .then(res => {
        console.log(res);
        this.afAuth.auth.sendPasswordResetEmail(this.currentEmail);
      });
  }
}
