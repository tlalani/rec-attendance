import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-qr-creator",
  templateUrl: "./qr-creator.component.html",
  styleUrls: ["./qr-creator.component.scss"]
})
export class QrCreatorComponent implements OnInit {
  public fileToUpload: File;
  constructor() {}

  ngOnInit() {}

  handleFileInput(event) {
    this.fileToUpload = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let x = fileReader.result.toString().split("\n");
      x.forEach((item: string) => {
        if (item.length > 0) {
          if (!Number.isNaN(parseInt(item))) {
            console.log("Grade", item);
          } else {
            console.log(item);
          }
        }
      });
    };
    fileReader.readAsText(this.fileToUpload);
  }
}
