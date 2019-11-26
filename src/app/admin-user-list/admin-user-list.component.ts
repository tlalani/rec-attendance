import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../auth.service";
import { AngularFireReturnTypes, PASSWORD_STRING } from "src/constants";

import { AttendanceService } from "../attendance/attendance.service";
import { Observable, BehaviorSubject } from "rxjs";
import { MatTable } from "@angular/material";

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
    private attendanceService: AttendanceService
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

  getChanges(event) {
    if (event.accept) {
      let user = this._dataSource.value[event.accept.user];
      this.authService.auth
        .createUserWithEmailAndPassword(user.email, PASSWORD_STRING)
        .then(res => {
          res.user
            .sendEmailVerification()
            .then(() => {
              let arr = this.data$;
              arr.splice(event.accept.user, 1);
              this._dataSource.next(arr);
              this.attendanceService.set("/register/" + user.uuid, null);
            })
            .catch(err => {
              alert("There was an error, Please try again");
            });
        })
        .catch(err => {
          alert("There was an error, Please try again.");
        });
    } else {
      let user = event.deny;
      // let index = this.dataSource.findIndex(item => {
      //   return item.email === user.email;
      // });
      // this.dataSource.splice(index, 1);
      this.attendanceService.remove(
        "register/" +
          user.re_center +
          "/" +
          user.re_class +
          "/" +
          user.re_shift +
          "/" +
          user.uuid
      );
    }
  }
}
