import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-admin-user-list",
  templateUrl: "./admin-user-list.component.html",
  styleUrls: ["./admin-user-list.component.scss"]
})
export class AdminUserListComponent implements OnInit {
  public displayedColumns = ["id", "permissions"];
  public colNames = ["User", "Permissions"];
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    let dataSource = await this.authService.getAllUsers();
    console.log(dataSource);
  }
}
