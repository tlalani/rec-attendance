const alpha = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
  ""
);

export const DEFAULT_USER_IMAGE = "assets/pictures/no_picture.png";

export interface Config {
  center: string;
  classes: string[];
}

export const AngularFireReturnTypes = {
  Array: "0",
  Object: "1"
};

export const Days = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

export const Grades = {
  PrePrimary: ["PK", "KG"],
  Primary: [
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade"
  ],
  Secondary: [
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade"
  ]
};

export const USER_ROLES = {
  Admin: "admin",
  User: "user"
};

export const MANAGEMENT_ROLES = [
  "Principal",
  "HOI",
  "HOO",
  "HOSS",
  "HOPI",
  "HDMAR",
  "REC Management Team"
];

export const PASSWORD_STRING = "password";

export const Type = {
  Text: "text",
  Password: "password"
};

export const Roles = {
  Student: "Student",
  Teacher: "Teacher",
  TA: "TA",
  Management: "Management",
  Intern: "Intern",
  Substitute: "Substitute"
};

export const Mgmt = {
  Management: "Management",
  Intern: "Intern"
};

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
  Tardy: "T",
  Excused: "E"
};

export const longStatuses = {
  Present: "Present",
  Absent: "Absent",
  Tardy: "Tardy",
  Excused: "Excused"
};

export const contactStatuses = {
  Working: "W",
  Innacurate: "I"
};

export function getGradeFromString(item: string, re_class) {
  if (!Number.isNaN(parseInt(item))) return parseInt(item.charAt(0)) - 1;
  else return Object.keys(Roles).indexOf(item) + Grades[re_class].length - 1;
}

export class Person {
  Role: string;
  Name: string;
  Time: string;
  Reason: string;
  Comments: string;
  Grade: string;
  Status: string;
  editing?: boolean = false;
  editable?: boolean = false;
  Date?: string;
  constructor(obj) {
    obj && Object.assign(this, obj).setStatus();
  }

  static makeP(obj) {
    let p = new Person(obj);
    return p;
  }

  public isPresent() {
    return this.Status && this.Status === Statuses.Present;
  }

  public isAbsent() {
    return this.Status && this.Status === Statuses.Absent;
  }

  public isExcused() {
    return this.Status && this.Status === Statuses.Excused;
  }

  public isTardy() {
    return this.Status && this.Status === Statuses.Tardy;
  }

  public isTeacher() {
    return this.Role === Roles.Teacher;
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
    if (!this.Status) {
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
    } else {
      if (Object.keys(longStatuses).indexOf(this.Status) !== -1) {
        this.Status = Statuses[this.Status];
      }
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

  public hasGrade() {
    return this.Role === Roles.Student || this.Role === Roles.Teacher;
  }

  public firstAndLastName() {
    let fullName = this.Name.split(" ");
    return fullName[0] + " " + fullName[fullName.length - 1];
  }

  public equals(other: Person | PersonDTO) {
    return (
      this.Name.replace(/ /g, "") === other.Name.replace(/ /g, "") &&
      this.Grade.replace(/ /g, "") === other.Grade.replace(/ /g, "")
    );
  }
}

export function getArray(snapshot, role, re_class) {
  let result: any = {};
  if (Grades[re_class].indexOf(Object.keys(snapshot)[0]) !== -1) {
    Object.entries(snapshot).forEach(([gradeStr, peopleInGrade]) => {
      if (peopleInGrade) {
        //for each person in the grade add them to their grade's list.
        result[gradeStr] = [];
        Object.entries(peopleInGrade).forEach(([personName, person]) => {
          let a = new Person(person);
          a.Name = personName;
          result[gradeStr].push(a);
        });
      }
    });
  } else {
    result.people = [];
    Object.entries(snapshot).forEach(([personName, person]) => {
      let p = new Person(person);
      p.Name = personName;
      result.people.push(p);
    });
  }
  return result;
}

export class PersonDTO {
  Name: string;
  Grade: string;
  Role?: string;
  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  public equals(other: Person | PersonDTO) {
    if (this.Role === other.Role && this.Role === "Student") {
      return (
        this.Name.replace(/ /g, "") == other.Name.replace(/ /g, "") &&
        this.Grade.replace(/ /g, "") == other.Grade.replace(/ /g, "")
      );
    } else {
      return this.Name.replace(/ /g, "") == other.Name.replace(/ /g, "");
    }
  }

  public hasGrade() {
    return this.Role === Roles.Student || this.Role === Roles.Teacher;
  }
}

export class Phone {
  label: string;
  number: string;
  contactStatus: string;
  type: string = "Phone";
  constructor(obj) {
    obj && Object.assign(this, obj);
  }
  public isAccurate() {
    return this.contactStatus == contactStatuses.Working;
  }
  public changeStatus() {
    if (this.contactStatus == "W") {
      this.contactStatus = contactStatuses.Innacurate;
    } else {
      this.contactStatus = contactStatuses.Working;
    }
  }
  static makeP(obj) {
    let p = new Phone(obj);
    return p;
  }
}
export class Email {
  label: string;
  email: string;
  contactStatus: string;
  type: string = "Email";
  constructor(obj) {
    obj && Object.assign(this, obj);
  }
  public isAccurate() {
    return this.contactStatus === contactStatuses.Working;
  }
  static makeE(obj) {
    return new Email(obj);
  }
  public changeStatus() {
    if (this.contactStatus == "W") {
      this.contactStatus = contactStatuses.Innacurate;
    } else {
      this.contactStatus = contactStatuses.Working;
    }
  }
}

export function getSchoolYearFromDate(date: Date) {
  let month = date.getMonth();
  let year = date.getFullYear();
  if (month >= 7) {
    let year1 = year + 1;
    return "" + year + "-" + year1;
  } else {
    let year1 = year - 1;
    return "" + year1 + "-" + year;
  }
}

export const NUMBERS: Phone[] = [
  Phone.makeP({
    label: "Mother Cell",
    number: "847-668-2345",
    contactStatus: contactStatuses.Working
  }),
  Phone.makeP({
    label: "Father Cell",
    number: "224-425-3922",
    contactStatus: contactStatuses.Working
  }),
  Phone.makeP({
    label: "Home Phone",
    number: "324-543-1382",
    contactStatus: contactStatuses.Working
  }),
  Phone.makeP({
    label: "Cell Phone",
    number: "312-422-2480",
    contactStatus: contactStatuses.Working
  })
];

export const EMAILS: Email[] = [
  Email.makeE({
    label: "Father Email",
    email: "asdfo@gmail.com",
    contactStatus: contactStatuses.Working
  }),
  Email.makeE({
    label: "Mother Email",
    email: "junaid@gmail.com",
    contactStatus: contactStatuses.Working
  })
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

export function compareNames(personA, personB) {
  if (
    personA.Name.split(" ")[0].toLowerCase() >
    personB.Name.split(" ")[0].toLowerCase()
  ) {
    return 1;
  } else if (
    personB.Name.split(" ")[0].toLowerCase() <
    personA.Name.split(" ")[0].toLowerCase()
  ) {
    return -1;
  } else {
    return 0;
  }
}

export function pushToInnerList(list: any[][], index: number, item: any) {
  if (!list[index]) {
    while (!list[index]) {
      list.push([]);
    }
  }
  if (Array.isArray(item)) item.forEach(listItem => list[index].push(listItem));
  else list[index].push(item);
}

export function getAppRole(role: string) {
  role = role.toLowerCase();
  let roles = Object.keys(Roles);
  let role1 = roles.map(item => item.toLowerCase());
  for (let i = 0; i < role1.length; i++) {
    if (role === "support") {
      return Roles.Intern;
    }
    if (role1[i] === role) {
      return roles[i];
    }
  }
}

export function getDay(date, dayOfWeek) {
  let dateCopy = new Date(date);
  if (date.getDay() < dayOfWeek) {
    let sub = date.getDay() + 1;
    dateCopy.setDate(date.getDate() - sub);
  } else if (date.getHours() < 10) {
    dateCopy.setDate(date.getDate() - 7);
  }
  return dateCopy;
}

export function makePeopleObject() {
  return {
    student: <PersonDTO[][]>[],
    teacher: <PersonDTO[][]>[],
    management: <PersonDTO[][]>[],
    support: <PersonDTO[][]>[]
  };
}

export function shiftStartTime(shift, withDay?: boolean) {
  if (withDay) {
    let shiftStart = shift.split("/")[1].split("-")[0];
    return shiftStart;
  }
}

export function isObjEmptyOrUndefined(obj) {
  return !obj || Object.keys(obj).length < 1;
}

/** 
returns the year previous to the entered school year.

lastYear("2019-2020") returns "2018-2019"
*/
export function lastYear(schoolYear: String) {
  let year = Number(schoolYear.split("-")[0]);
  let prevYear = year - 1;
  return prevYear + "-" + year;
}

/** 
returns the year after the entered school year.

nextYear("2019-2020") returns "2020-2021"
*/
export function nextYear(schoolYear: String) {
  let year = Number(schoolYear.split("-")[1]);
  let nextYear = year + 1;
  return year + "-" + nextYear;
}
