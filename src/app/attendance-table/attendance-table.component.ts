import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ELEMENT_DATA, ReasonsArray, Person, Statuses } from "src/constants";
import { DataSource } from "@angular/cdk/table";
import { MatDialog } from "@angular/material";
import { ContactDialogComponent } from "../contact-dialog/contact-dialog.component";

@Component({
  selector: "app-attendance-table",
  templateUrl: "./attendance-table.component.html",
  styleUrls: ["./attendance-table.component.scss"]
})
export class AttendanceTableComponent implements OnInit {
  @Input() dataSource;
  @Output() changes = new EventEmitter<Person>();
  public displayedColumns: string[] = [
    "name",
    "grade",
    "status",
    "reason",
    "comments",
    "edit"
  ];
  public reasons = ReasonsArray;
  public statuses = Object.values(Statuses);
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  public startEditing(student) {
    student.editing = true;
  }

  public saveEdits(student) {
    if (student.changes) {
      this.changes.emit(student);
    }
    student.editing = false;
  }

  public makeChange(student) {
    student.changes = true;
  }

  public openDialog(person) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: "500px",
      data: {
        person: person
      }
    });
  }
}
