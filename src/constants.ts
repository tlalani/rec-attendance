const alpha = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
  ""
);
const grades = [
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

export class Person {
  Name: string;
  Time: string;
  Reason: string;
  Comments: string;
  Grade: string;
  Status: string;
  editing: boolean = false;
  editable: boolean = false;
  constructor(obj) {
    obj && Object.assign(this, obj).setStatus();
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
        this.Reason = "-";
      }
    } else {
      this.Status = Statuses.Absent;
    }
  }

  public toDTO() {
    return { Name: this.Name, Grade: this.Grade };
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
  { name: "Hydrogen", grade: "1st Grade", status: "P", reason: "No Reason" },
  {
    name: "Helium",
    grade: "2nd Grade",
    status: "P",
    reason: "Reasons Unknown"
  },
  { name: "Lithium", grade: "3rd Grade", status: "A", reason: "Has a Reason" },
  {
    name: "Beryllium",
    grade: "4th Grade",
    status: "T",
    reason: "Might Be A Reason"
  },
  {
    name: "Boron",
    grade: "5th Grade",
    status: "A",
    reason: "What's a reason?"
  },
  { name: "Carbon", grade: "6th Grade", status: "P", reason: "Transportation" },
  { name: "Nitrogen", grade: "1st Grade", status: "T", reason: "Traveling" },
  {
    name: "Oxygen",
    grade: "2nd Grade",
    status: "T",
    reason: "Trying to find a reason"
  },
  {
    name: "Fluorine",
    grade: "3rd Grade",
    status: "A",
    reason: "Flying away from me?"
  },
  {
    name: "Neon",
    grade: "4th grade",
    status: "P",
    reason: "Never had a reason!"
  }
];

export const reasonsArray = [
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
