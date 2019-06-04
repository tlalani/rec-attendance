import { Component, OnInit, Input } from "@angular/core";
import { Person, PersonDTO } from "src/constants";
import { QrCodeService } from "./qr-code.service";

@Component({
  selector: "app-qr-code",
  templateUrl: "./qr-code.component.html",
  styleUrls: ["./qr-code.component.scss"]
})
export class QrCodeComponent implements OnInit {
  @Input() person: PersonDTO;
  @Input() lastIndex: number;
  public displayString: string;
  public qrlink: string;
  public piclink: string;
  constructor(private qrCodeService: QrCodeService) {}

  ngOnInit() {
    this.displayString = this.person.Role + ":" + this.person.Name;
    const { folder, index } = this.qrCodeService.getFolderAndIndex(this.person);
    this.piclink = "assets/pictures/" + folder + "/" + index + ".jpg";

    this.qrlink =
      "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=" +
      this.displayString;

    if (
      this.qrCodeService.staffIndex + this.qrCodeService.studentIndex >=
      this.lastIndex
    ) {
      this.qrCodeService.reset();
    }
  }
}
