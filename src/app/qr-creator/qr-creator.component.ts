import { Component, OnInit } from "@angular/core";
import { Roles, PersonDTO, getSchoolYearFromDate } from "src/constants";

import { QrCodeService } from "./qr-code/qr-code.service";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-qr-creator",
  templateUrl: "./qr-creator.component.html",
  styleUrls: ["./qr-creator.component.scss"]
})
export class QrCreatorComponent implements OnInit {
  public fileToUpload: File;
  public result: PersonDTO[];
  public fileUploaded: boolean = false;
  public currentConfig: any;
  constructor(
    private qrCodeService: QrCodeService,
    private router: Router,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  isANumber(item) {
    return !Number.isNaN(parseInt(item));
  }

  async codesFromDB() {
    this.result = [];
    this.currentConfig = this.authService.getCurrentConfig();
    let schoolYear = getSchoolYearFromDate(new Date());
    let people: any = await this.databaseService.getFormattedRoster(
      schoolYear,
      this.currentConfig
    );
    Object.keys(people).forEach(role => {
      Object.keys(people[role]).forEach(key => {
        people[role][key].forEach(person => {
          this.result.push(new PersonDTO({ Name: person.Name, Role: role }));
        });
      });
      this.fileUploaded = true;
    });
  }

  handleFileInput(event) {
    this.qrCodeService.reset();
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
          } else if (Object.keys(Roles).includes(item)) {
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
      this.fileUploaded = true;
      event.target.value = null;
    };
    fileReader.readAsText(this.fileToUpload);
  }

  reset() {
    this.fileUploaded = false;
    this.fileToUpload = null;
    this.result = [];
    this.qrCodeService.reset();
  }

  back() {
    this.router.navigate(["/home"]);
  }

  goToManualQr() {
    this.router.navigate(["/manual-qr"]);
  }
}
