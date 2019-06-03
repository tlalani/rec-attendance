import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ManualEntryService {
  constructor(private db: AngularFireDatabase) {}

  public getStudentsOfGrade(input) {
    return this.db
      .list("People/Student/" + input)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }
}
