import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AddStudentsDialogComponent } from "src/app/add-students-dialog/add-students-dialog.component";
import { MatDialog, MatCheckboxChange } from "@angular/material";
import { SubmitDialogComponent } from "src/app/submit-dialog/submit-dialog.component";

@Component({
  selector: "app-roster-table",
  templateUrl: "./roster-table.component.html",
  styleUrls: ["./roster-table.component.scss"]
})
export class RosterTableComponent implements OnInit {
  @Input() dataSource;
  @Output() changes = new EventEmitter();
  public displayedColumns = ["select", "name"];
  constructor() {}

  ngOnInit() {}

  handleCheck(event: MatCheckboxChange, row) {
    if (event.checked) {
      this.changes.emit({ selected: row });
    } else {
      this.changes.emit({ unselected: row });
    }
  }
}
