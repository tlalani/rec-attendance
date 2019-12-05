import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-reset-forgot",
  templateUrl: "./reset-forgot.component.html",
  styleUrls: ["./reset-forgot.component.scss"]
})
export class ResetForgotComponent implements OnInit {
  public form: FormGroup;
  @Input() mode: string;
  @Output() submit = new EventEmitter();
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    if (this.mode === "forgotPassword") {
      this.form = this.builder.group({
        email: ["", [Validators.required, Validators.email]]
      });
    } else if (this.mode === "resetPasswordManual") {
      this.form = this.builder.group(
        {
          passwordOld: ["", [Validators.required]],
          password: ["", Validators.required],
          passwordConfirm: ["", Validators.required]
        },
        { validator: this.checkPasswords }
      );
    }
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get("password").value;
    let confirmPass = group.get("passwordConfirm").value;
    return pass === confirmPass ? null : { notSame: true };
  }

  submitForm() {
    this.submit.emit(this.form.value);
  }
}
