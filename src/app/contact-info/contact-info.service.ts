import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { NUMBERS, EMAILS } from "src/constants";

@Injectable({
  providedIn: "root"
})
export class ContactInfoService {
  constructor(db: AngularFireDatabase) {}

  getNumbers() {
    return NUMBERS;
  }

  getEmails() {
    return EMAILS;
  }
}
