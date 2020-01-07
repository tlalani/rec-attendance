import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.scss"]
})
export class ForgotComponent implements OnInit {
  public form: FormGroup;
  @Output() submit = new EventEmitter();
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    this.submit.emit(this.form.value);
  }
}
