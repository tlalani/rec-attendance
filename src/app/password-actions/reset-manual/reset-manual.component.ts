import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth.service";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-reset-manual",
  templateUrl: "./reset-manual.component.html",
  styleUrls: ["./reset-manual.component.scss"]
})
export class ResetManualComponent implements OnInit {
  public form: FormGroup;
  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ResetManualComponent>
  ) {}

  ngOnInit() {
    this.form = this.builder.group(
      {
        passwordOld: ["", [Validators.required]],
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

  async submitForm() {
    try {
      let user = await this.authService.auth.signInWithEmailAndPassword(
        this.authService.currentUser.email,
        this.form.value.passwordOld
      );
      if (user) {
        await this.authService.auth.currentUser.updatePassword(
          this.form.get("password").value
        );
        alert("Password Changed Successfully");
        this.closeDialog();
      }
    } catch (err) {
      console.log(err);
      alert("There was an error");
      this.closeDialog();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
