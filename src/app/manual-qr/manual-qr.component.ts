import { Component, OnInit } from "@angular/core";
import { PersonDTO, Roles, Grades } from "src/constants";

@Component({
  selector: "app-manual-qr",
  templateUrl: "./manual-qr.component.html",
  styleUrls: ["./manual-qr.component.scss"]
})
export class ManualQrComponent implements OnInit {
  public result: PersonDTO[] = [];
  public roles = Object.keys(Roles);
  public grades = Grades;
  public person: PersonDTO = new PersonDTO({ Name: null });
  constructor() {}

  ngOnInit() {}

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
