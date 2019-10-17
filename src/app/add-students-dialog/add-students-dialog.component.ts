import { Component, OnInit } from "@angular/core";
import { Roles, Grades, Person, PersonDTO } from "src/constants";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-add-students-dialog",
  templateUrl: "./add-students-dialog.component.html",
  styleUrls: ["./add-students-dialog.component.scss"]
})
export class AddStudentsDialogComponent implements OnInit {
  public roles = Object.keys(Roles);
  public grades = Grades;
  public person: PersonDTO = new PersonDTO({});
  result: PersonDTO[] = [];
  constructor(public dialogRef: MatDialogRef<AddStudentsDialogComponent>) {}

  ngOnInit() {}

  hasGrade() {
    return (
      this.person.Role === Roles.Student || this.person.Role === Roles.Teacher
    );
  }

  isComplete() {
    return (
      this.person.Role &&
      ((this.hasGrade() && this.person.Grade) || !this.hasGrade()) &&
      this.person.Name &&
      this.person.Name.length > 0
    );
  }

  submit() {
    if (this.isComplete()) {
      this.result.push(this.person);
      this.person = new PersonDTO({});
    }
  }

  print(obj) {
    let s = "";
    Object.entries(obj).forEach(([key, val]) => {
      if (val) {
        s += key + ":" + val + "      ";
      }
    });
    return s;
  }

  deletePerson(i) {
    this.result.splice(i, 1);
  }

  closeDialog() {
    this.dialogRef.close({ result: this.result });
  }
}
