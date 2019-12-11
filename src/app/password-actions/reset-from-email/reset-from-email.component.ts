import { Component, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-reset-from-email",
  templateUrl: "./reset-from-email.component.html",
  styleUrls: ["./reset-from-email.component.scss"]
})
export class ResetFromEmailComponent implements OnInit {
  public form: FormGroup;
  @Output() submit = new EventEmitter();
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group(
      {
        password: ["", Validators.required],
        passwordConfirm: ["", Validators.required]
      },
      { validator: this.checkPasswords }
    );
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
