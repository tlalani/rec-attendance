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
  public selection = [];
  public displayedColumns = ["select", "name"];
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openDialog() {
    this.dialog
      .open(AddStudentsDialogComponent)
      .afterClosed()
      .toPromise()
      .then(res => {
        this.changes.emit({ add: res.result });
      });
  }

  confirm() {
    this.dialog
      .open(SubmitDialogComponent, {
        width: "500px",
        data: {
          message:
            "Are you sure you want to delete the selected people from your roster?"
        }
      })
      .afterClosed()
      .toPromise()
      .then(res => {
        if (res) this.changes.emit({ delete: this.selection });
      });
  }

  handleCheck(event: MatCheckboxChange, row) {
    if (event.checked) {
      this.selection.push(row);
    } else {
      let index = this.selection.indexOf(row);
      this.selection.splice(index, 1);
    }
  }
}
