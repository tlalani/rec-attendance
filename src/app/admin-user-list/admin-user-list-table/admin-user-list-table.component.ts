import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { MatTable } from "@angular/material";

@Component({
  selector: "app-admin-user-list-table",
  templateUrl: "./admin-user-list-table.component.html",
  styleUrls: ["./admin-user-list-table.component.scss"]
})
export class AdminUserListTableComponent implements OnInit {
  public displayedColumns = ["role", "center", "email", "accept/deny"];
  public colNames = ["Role", "Center", "Email", "Accept/Deny"];
  @Input() source: BehaviorSubject<String>;
  @Output() changes = new EventEmitter();
  public dataSource;
  constructor() {}

  ngOnInit() {
    this.source.subscribe(list => {
      console.log("Datasource Received: ", list);
      console.log("Current DataSource: ", this.dataSource);
      this.dataSource = list;
      console.log("New DataSource: ", this.dataSource);
    });
  }

  acceptPerson(index) {
    console.log("Accept Emitted:", index);
    this.changes.emit({ accept: { user: index } });
  }

  denyPerson(index) {
    this.changes.emit({ deny: { user: index } });
  }
}
