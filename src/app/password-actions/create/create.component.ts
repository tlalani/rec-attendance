import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { Grades, Days } from "src/constants";
@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  public form: FormGroup;
  @Output() submit = new EventEmitter();
  @Input() email: Observable<any>;
  public classes = Object.keys(Grades);
  public days = Object.keys(Days);
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group(
      {
        email: ["", Validators.required],
        password: ["", Validators.required],
        passwordConfirm: ["", Validators.required],
        selectedCenter: ["", Validators.required],
        selectedClass: ["", Validators.required],
        selectedDay: ["", Validators.required],
        startTime: ["", Validators.required],
        endTime: ["", Validators.required]
      },
      { validator: this.checkPasswords }
    );
    this.form.get("email").disable();
    this.email.subscribe(email => {
      this.form.get("email").setValue(email);
    });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get("password").value;
    let confirmPass = group.get("passwordConfirm").value;
    return pass === confirmPass ? null : { notSame: true };
  }

  submitForm() {
    this.form.get("email").enable();
    this.submit.emit(this.form.value);
  }
}
