import { Component, OnInit, Input } from "@angular/core";
import { Person, Phone, Email } from "src/constants";
import { ContactInfoService } from "./contact-info.service";

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"]
})
export class ContactInfoComponent implements OnInit {
  @Input() person: Person;
  public numbers: any;
  public emails: any;
  constructor(private contactInfoService: ContactInfoService) {}

  ngOnInit() {
    this.numbers = this.contactInfoService.getNumbers();
    this.emails = this.contactInfoService.getEmails();
  }

  getStatus(item: Phone | Email) {
    if (item.isAccurate()) {
      return "primary";
    } else {
      return "warn";
    }
  }

  getName(item: Phone | Email) {
    if (item.isAccurate()) {
      return "check";
    } else {
      return "block";
    }
  }
  changeAccuracy(item: Phone | Email) {
    item.changeStatus();
  }

  getTooltipText(item: Phone | Email) {
    if (item.isAccurate()) {
      return "This is a working " + item.type;
    } else {
      return "This is not a working " + item.type;
    }
  }
}
