import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-add-students-dialog-table",
  templateUrl: "./add-students-dialog-table.component.html",
  styleUrls: ["./add-students-dialog-table.component.scss"]
})
export class AddStudentsDialogTableComponent implements OnInit {
  public displayedColumns = ["role", "name", "grade", "remove"];
  public colNames = ["Role", "Name", "Grade", "Remove"];
  @Input() source: BehaviorSubject<any[]>;
  @Output() changes = new EventEmitter();
  public dataSource;
  constructor() {}

  ngOnInit() {
    this.source.subscribe(list => {
      this.dataSource = [...list];
    });
  }

  removePerson(person) {
    this.changes.emit({ remove: person });
  }
}
