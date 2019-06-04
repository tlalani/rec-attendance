import { Component, OnInit } from "@angular/core";
import { ELEMENT_DATA, Roles, Grades, PersonDTO } from "src/constants";
import { isNumber } from "util";

@Component({
  selector: "app-qr-creator",
  templateUrl: "./qr-creator.component.html",
  styleUrls: ["./qr-creator.component.scss"]
})
export class QrCreatorComponent implements OnInit {
  public fileToUpload: File;
  public result: PersonDTO[];
  public fileUploaded: boolean = false;
  public studentIndex: number = -1;
  public staffIndex: number = -1;
  constructor() {}

  ngOnInit() {}

  isANumber(item) {
    return !Number.isNaN(parseInt(item));
  }
  handleFileInput(event) {
    this.fileUploaded = false;
    this.result = [];
    let currentRole = "";
    let currentGrade = 0;
    this.fileToUpload = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let x = fileReader.result.toString().split("\n");
      x.forEach((item: string) => {
        if (item.length > 0) {
          if (this.isANumber(item)) {
            currentGrade = parseInt(item) - 1;
          } else if (Roles.includes(item)) {
            currentRole = item;
            currentGrade = 0;
          } else {
            switch (currentRole) {
              case "Student":
              case "Teacher":
                this.result.push(
                  new PersonDTO({
                    Name: item,
                    Role: currentRole,
                    Grade: currentGrade
                  })
                );
                break;
              case "Management":
              case "Intern":
                this.result.push(
                  new PersonDTO({
                    Name: item,
                    Role: currentRole
                  })
                );
                break;
            }
          }
        }
      });
      console.log(this.result);
      this.fileUploaded = true;
    };
    fileReader.readAsText(this.fileToUpload);
  }

  getIndex(person: PersonDTO) {
    if (person.Role === "Student") return ++this.studentIndex;
    else return ++this.staffIndex;
  }
}
