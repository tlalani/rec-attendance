import { Component, OnInit, Input } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatCheckboxChange } from "@angular/material";

@Component({
  selector: "app-generic-table",
  templateUrl: "./generic-table.component.html",
  styleUrls: ["./generic-table.component.scss"]
})
export class GenericTableComponent implements OnInit {
  @Input() dataSource;
  @Input() displayedColumns;
  @Input() colNames;
  public selection = [];

  constructor() {}

  ngOnInit() {}

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  handleCheck(event: MatCheckboxChange, row) {
    if (event.checked) {
      this.selection.push(row);
    } else {
      let index = this.selection.indexOf(row);
      this.selection.splice(index, 1);
    }
  }
}
