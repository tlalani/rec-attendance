import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../auth.service";
import { AngularFireReturnTypes, PASSWORD_STRING } from "src/constants";

import { Observable, BehaviorSubject } from "rxjs";
import { MatTable } from "@angular/material";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-admin-user-list",
  templateUrl: "./admin-user-list.component.html",
  styleUrls: ["./admin-user-list.component.scss"]
})
export class AdminUserListComponent implements OnInit {
  private _dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public source = this._dataSource.asObservable();
  public data$ = this._dataSource.value;
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  async ngOnInit() {
    let r = [];
    let result: any = await this.authService.getAllUsers(
      AngularFireReturnTypes.Object
    );
    if (result) {
      Object.keys(result).forEach(key1 => {
        let uuid = key1;
        let obj = result[uuid];
        obj.uuid = uuid;
        r.push(obj);
      });
      this._dataSource.next(r);
    }
  }

  async getChanges(event) {
    if (event.accept) {
      try {
        let user = this._dataSource.value[event.accept.user];
        let res = await this.authService.auth.createUserWithEmailAndPassword(
          user.email,
          PASSWORD_STRING
        );
        await res.user.sendEmailVerification();
        let arr = this.data$;
        arr.splice(event.accept.user, 1);
        this._dataSource.next(arr);
        this.databaseService.set("/register/" + user.uuid, null);
      } catch (err) {
        alert("There was an error please try again");
      }
    } else {
      let user = event.deny;
      let list = this.data$;
      list.splice(event.deny.user, 1);
      this._dataSource.next(list);
      this.databaseService.remove("register/" + user.uuid);
    }
  }
}
