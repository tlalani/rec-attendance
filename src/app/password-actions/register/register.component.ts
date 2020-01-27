import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators, Form } from "@angular/forms";
import { MANAGEMENT_ROLES } from "src/constants";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean = false;
  public user_roles = MANAGEMENT_ROLES;
  @Output() submit = new EventEmitter();
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.form = this.builder.group({
      email: ["", [Validators.required, Validators.email]],
      selectedRole: ["", Validators.required],
      selectedCenter: ["", Validators.required]
    });
  }

  registerUser() {
    this.submit.emit(this.form.value);
    this.submitted = true;
    // alert(
    //   "Your request to register has been sent. You will be registered within the next 24 hours"
    // );
  }
}
