import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  @Output() itemClicked = new EventEmitter();
  @Input() authState;
  constructor() {}

  ngOnInit() {}

  logout() {
    this.itemClicked.emit("logout");
  }

  async changeOptions() {
    this.itemClicked.emit("options");
  }

  toQr() {
    this.itemClicked.emit("qr");
  }

  addUsers() {
    this.itemClicked.emit("add-user");
  }
}
