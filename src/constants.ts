const alpha = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
  ""
);
export const Grades = [
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade"
];
export const Roles = ["Student", "Teacher", "Management", "Intern"];
const offset = -13;

export function normalize(config) {
  var normalizer = config.apiKey;
  if (normalizer != null) {
    var normalizedText = "";
    var text = normalizer.split("");
    for (var i = 0; i < text.length; i++) {
      for (var j = 0; j < alpha.length; j++) {
        if (text[i] === alpha[j]) {
          var index = (j + offset) % alpha.length;
          if (index < 0) {
            index = alpha.length + index;
          }
          normalizedText += alpha[index];
        }
      }
    }
    config.apiKey = normalizedText;
    return config;
  }
  return null;
}
export const Statuses = {
  Present: "P",
  Absent: "A",
  Tardy: "T"
};

export function getGradeFromString(item: string) {
  if (!Number.isNaN(parseInt(item))) return parseInt(item.charAt(0)) - 1;
  else return Roles.indexOf(item) + Grades.length - 1;
}

export class Person {
  Role: string;
  Name: string;
  Time: string;
  Reason: string;
  Comments: string;
  Grade: string;
  Status: string;
  editing: boolean = false;
  editable: boolean = false;
  Date?: string;
  constructor(obj) {
    obj && Object.assign(this, obj).setStatus();
  }

  static makeP(obj) {
    let p = new Person(obj);
    return p;
  }

  public isPresent() {
    return this.Status === Statuses.Present ? true : false;
  }

  public isAbsent() {
    return this.Status === Statuses.Absent ? true : false;
  }

  public isEditable() {
    return this.editable;
  }

  public isBeingEdited() {
    return this.editing;
  }

  public hasComments() {
    if (this.Comments) {
      return true;
    } else {
      return false;
    }
  }

  public setStatus() {
    if (this.Time && this.Time !== "-1") {
      const timearr = this.Time.split(" ")[0].split(":");
      if (
        parseInt(timearr[0]) > 10 ||
        (parseInt(timearr[0]) == 10 && parseInt(timearr[1]) > 40)
      ) {
        this.Status = Statuses.Tardy;
      } else {
        this.Status = Statuses.Present;
      }
    } else {
      this.Status = Statuses.Absent;
    }
  }

  public toDTO() {
    return { Name: this.Name, Grade: this.Grade };
  }

  public updateString() {
    return (
      this.Name +
      ", " +
      this.Grade +
      ", " +
      this.Time +
      ", " +
      this.Reason +
      ", " +
      this.Comments +
      "\n"
    );
  }

  public toArray(order) {
    let a = [];
    order.forEach(item => {
      Object.entries(this).forEach(([key, val]) => {
        if (key == item) {
          a.push(val);
        }
      });
    });
    return a;
  }
}

export class PersonDTO {
  Name: string;
  Grade: string;
  constructor(obj) {
    obj && Object.assign(this, obj);
  }
}

export function getSchoolYearFromDate(date: Date) {
  let month = date.getMonth();
  let year = date.getFullYear();
  if (month >= 8) {
    let year1 = year + 1;
    return "" + year + "-" + year1;
  } else {
    let year1 = year - 1;
    return "" + year1 + "-" + year;
  }
}

export const ELEMENT_DATA = [
  [
    Person.makeP({
      Name: "Hydrogen",
      Grade: "1st Grade",
      Status: "P",
      Reason: "No Reason"
    }),
    Person.makeP({
      Name: "Helium",
      Grade: "2nd Grade",
      Status: "P",
      Reason: "Reasons Unknown"
    }),
    Person.makeP({
      Name: "Lithium",
      Grade: "3rd Grade",
      Status: "A",
      Reason: "Has a Reason"
    }),
    Person.makeP({
      Name: "Beryllium",
      Grade: "4th Grade",
      Status: "T",
      Reason: "Might Be A Reason"
    }),
    Person.makeP({
      Name: "Boron",
      Grade: "5th Grade",
      Status: "A",
      Reason: "What's a Reason?"
    }),
    Person.makeP({
      Name: "Carbon",
      Grade: "6th Grade",
      Status: "P",
      Reason: "Transportation"
    }),
    Person.makeP({
      Name: "Nitrogen",
      Grade: "1st Grade",
      Status: "T",
      Reason: "Traveling"
    }),
    Person.makeP({
      Name: "Oxygen",
      Grade: "2nd Grade",
      Status: "T",
      Reason: "Trying to find a Reason"
    }),
    Person.makeP({
      Name: "Fluorine",
      Grade: "3rd Grade",
      Status: "A",
      Reason: "Flying away from me?"
    }),
    Person.makeP({
      Name: "Neon",
      Grade: "4th Grade",
      Status: "P",
      Reason: "Never had a Reason!"
    })
  ]
];

export const ReasonsArray = [
  "Extracurricular Education",
  "Extracurricular Sports",
  "Health",
  "Personal",
  "Transportation",
  "Traveling",
  "Did Not Call",
  "No Response",
  "Bad Contact Number",
  "Other"
];

export function militaryTimeToAMPM(milTime) {
  if (milTime.split(" ").length < 2) {
    var time = milTime.split(":");
    if (time[0] > 12) {
      return (time[0] % 12) + ":" + time[1] + " " + "PM";
    } else {
      return milTime + " " + "AM";
    }
  }
  return milTime;
}
