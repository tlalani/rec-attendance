import { Injectable } from "@angular/core";
import { PersonDTO } from "src/constants";

@Injectable({
  providedIn: "root"
})
export class QrCodeService {
  public studentIndex: number = 0;
  public staffIndex: number = 0;

  constructor() {}

  getFolderAndIndex(person: PersonDTO) {
    if (person.Role === "Student") {
      return { folder: "student", index: ++this.studentIndex };
    } else {
      return { folder: "staff", index: ++this.staffIndex };
    }
  }

  reset() {
    this.studentIndex = 0;
    this.staffIndex = 0;
  }
}
