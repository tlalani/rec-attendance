import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AddStudentsDialogComponent } from "src/app/add-students-dialog/add-students-dialog.component";
import { MatDialog, MatCheckboxChange } from "@angular/material";
import { SubmitDialogComponent } from "src/app/submit-dialog/submit-dialog.component";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-roster-table",
  templateUrl: "./roster-table.component.html",
  styleUrls: ["./roster-table.component.scss"]
})
export class RosterTableComponent implements OnInit {
  @Input() dataSource;
  @Output() changes = new EventEmitter();
  public selection;
  public displayedColumns = ["select", "name"];
  constructor() {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<any>(
      allowMultiSelect,
      initialSelection
    );
  }

  ngOnInit() {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.changes.emit({ allUnselected: true });
    } else {
      this.dataSource.forEach(row => this.selection.select(row));
      this.changes.emit({ allSelected: this.dataSource });
    }
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  makeSelection($event, row) {
    if ($event.checked) {
      this.changes.emit({ selected: row });
    } else {
      this.changes.emit({ unselected: row });
    }
    this.selection.toggle(row);
  }
}
