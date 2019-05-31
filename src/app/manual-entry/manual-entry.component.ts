import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Roles } from "../../constants";
@Component({
  selector: "app-manual-entry",
  templateUrl: "./manual-entry.component.html",
  styleUrls: ["./manual-entry.component.scss"]
})
export class ManualEntryComponent implements OnInit {
  public form: FormGroup;
  public roles = Roles;
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      role: fb.control("", Validators.required),
      date: fb.control("", Validators.required),
      time: fb.control("Set OnChange items", Validators.required),
      name: fb.control("", Validators.required)
    });
  }

  ngOnInit() {}
}
