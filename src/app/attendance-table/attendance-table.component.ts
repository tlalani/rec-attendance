import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ELEMENT_DATA, ReasonsArray, Person } from "src/constants";
import { DataSource } from "@angular/cdk/table";

@Component({
  selector: "app-attendance-table",
  templateUrl: "./attendance-table.component.html",
  styleUrls: ["./attendance-table.component.scss"]
})
export class AttendanceTableComponent implements OnInit {
  @Input() dataSource;
  @Input() edits;
  @Output() changed = new EventEmitter<Person>();
  public displayedColumns: string[] = [
    "name",
    "grade",
    "status",
    "reason",
    "comments"
  ];
  public reasons = ReasonsArray;
  constructor() {}

  ngOnInit() {
    if (this.edits) {
      this.displayedColumns.push("edit");
    }
  }

  public startEditing(student) {
    student.editing = true;
  }

  public saveEdits(student) {
    if (student.changes) {
      this.changed.emit(student);
    }
    student.editing = false;
  }

  public makeChange(student) {
    student.changes = true;
  }
}
