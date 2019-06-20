import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.fireAuth.auth
      .signOut()
      .then(() => {
        this.router.navigate(["/login"]);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
