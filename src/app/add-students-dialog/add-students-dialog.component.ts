import { Component, OnInit, Inject } from "@angular/core";
import { Roles, Grades, Person, PersonDTO, Mgmt } from "src/constants";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-add-students-dialog",
  templateUrl: "./add-students-dialog.component.html",
  styleUrls: ["./add-students-dialog.component.scss"]
})
export class AddStudentsDialogComponent implements OnInit {
  public roles = Object.keys(Roles);
  public mgmt = Object.keys(Mgmt);
  public grades;
  public person;
  public _dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(
    public dialogRef: MatDialogRef<AddStudentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.grades = Grades[data.re_class];
  }

  ngOnInit() {
    this.person = new PersonDTO({});
  }

  hasGrade() {
    return this.person.Role && this.mgmt.indexOf(this.person.Role) === -1;
  }

  canBeAdded() {
    return (
      this.person.Role &&
      ((this.hasGrade() && this.person.Grade) || !this.hasGrade()) &&
      this.person.Name &&
      this.person.Name.length > 0
    );
  }

  getChanges(event) {
    if (!event.target) {
      let result = this._dataSource.value;
      result.splice(event.remove, 1);
      this._dataSource.next(result);
    }
  }

  submit() {
    this._dataSource.next([...this._dataSource.value, this.person]);
    this.person = new PersonDTO({});
  }

  closeDialog(hasResult) {
    if (hasResult) {
      this.dialogRef.close({ result: this._dataSource.value });
    } else {
      this.dialogRef.close();
    }
  }
}
