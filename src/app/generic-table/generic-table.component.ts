import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-generic-table",
  templateUrl: "./generic-table.component.html",
  styleUrls: ["./generic-table.component.scss"]
})
export class GenericTableComponent implements OnInit {
  @Input() dataSource;
  @Input() displayedColumns;
  @Input() colNames;
  constructor() {}

  ngOnInit() {
    console.log(this.dataSource);
  }
}
