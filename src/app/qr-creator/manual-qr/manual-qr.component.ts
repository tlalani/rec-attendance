import { Component, OnInit } from "@angular/core";
import { PersonDTO, Roles, Grades } from "src/constants";
import { AuthService } from "src/app/auth.service";

@Component({
  selector: "app-manual-qr",
  templateUrl: "./manual-qr.component.html",
  styleUrls: ["./manual-qr.component.scss"]
})
export class ManualQrComponent implements OnInit {
  public result: PersonDTO[] = [];
  public roles = Object.keys(Roles);
  public grades;
  public person: PersonDTO = new PersonDTO({ Name: null });
  constructor(private authService: AuthService) {}

  ngOnInit() {
    let currentConfig = this.authService.getCurrentConfigFromStorage();
    this.grades = Grades[currentConfig.re_class];
  }

  isComplete() {
    return this.person.hasGrade()
      ? this.person.Name && this.person.Role && this.person.Grade
      : this.person.Role && this.person.Name;
  }

  submit() {
    this.result.push(this.person);
    this.person = new PersonDTO({ Name: null });
  }

  print() {
    window.print();
  }
}
