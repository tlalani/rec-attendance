const alpha = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
  ""
);

export const DEFAULT_USER_IMAGE = "assets/pictures/no_picture.png";

export const Grades = [
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade"
];

export const Type = {
  Student: 1,
  Staff: 2,
  Both: 3
};

export const Roles = {
  Student: "Student",
  Teacher: "Teacher",
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

export const contactStatuses = {
  Working: "W",
  Innacurate: "I"
};

export function getGradeFromString(item: string) {
  if (!Number.isNaN(parseInt(item))) return parseInt(item.charAt(0)) - 1;
  else return Object.keys(Roles).indexOf(item) + Grades.length - 1;
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
    return this.Status === Statuses.Present;
  }

  public isAbsent() {
    return this.Status === Statuses.Absent;
  }

  public isExcused() {
    return this.Status === Statuses.Excused;
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
      this.Name.replace(/ /g, "") == other.Name.replace(/ /g, "") &&
      this.Grade.replace(/ /g, "") == other.Grade.replace(/ /g, "")
    );
  }
}

export function createSetArray(type: number) {
  let r = [];
  Object.values(Roles).forEach(role => {
    if (type === Type.Student || type === Type.Both) {
      if (role === Roles.Student) {
        Grades.forEach(() => r.push(new Set()));
      }
    }
    if (type === Type.Staff || type === Type.Both) {
      if (role !== Roles.Student || role !== Roles.Teacher) {
        r.push(new Set());
      }
    }
  });
  return r;
}

export function getStudentsArray(studentSnapshot, role) {
  //creates the set of people per grade
  let result: Set<Person>[] = createSetArray(Type.Student);
  //Firebase data
  Object.entries(studentSnapshot).forEach(([gradeStr, peopleInGrade]) => {
    let grade = getGradeFromString(gradeStr);
    if (peopleInGrade) {
      //for each person in the grade add them to their grade's list.
      Object.entries(peopleInGrade).forEach(person => {
        let name = person[0];
        let p = new Person(person[1]);
        p.Name = name;
        p.Grade = gradeStr;
        p.Role = role;
        p.setStatus();
        result[grade].add(p);
      });
    }
  });
  return result;
}

export function getStaffArray(staffSnapshot) {
  let result: Set<Person>[] = createSetArray(Type.Staff);
  Object.entries(staffSnapshot).forEach(person => {
    let name = person[0];
    let p = new Person(person[1]);
    p.Name = name;
    p.setStatus();
  });
}

export class PersonDTO {
  Name: string;
  Grade: string;
  Role?: string;
  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  public equals(other: Person | PersonDTO) {
    return (
      this.Name.replace(/ /g, "") == other.Name.replace(/ /g, "") &&
      this.Grade.replace(/ /g, "") == other.Grade.replace(/ /g, "")
    );
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

export const ELEMENT_DATA = [
  Person.makeP({
    Name: "Hydrogen",
    Grade: "1st Grade",
    Status: "P",
    Reason: "No Reason"
  }),
  Person.makeP({
    Name: "Helium",
    Grade: "1st Grade",
    Status: "P",
    Reason: "Reasons Unknown"
  }),
  Person.makeP({
    Name: "Lithium",
    Grade: "2nd Grade",
    Status: "A",
    Reason: "Has a Reason"
  }),
  Person.makeP({
    Name: "Beryllium",
    Grade: "2nd Grade",
    Status: "T",
    Reason: "Might Be A Reason"
  }),
  Person.makeP({
    Name: "Boron",
    Grade: "3rd Grade",
    Status: "A",
    Reason: "What's a Reason?"
  }),
  Person.makeP({
    Name: "Carbon",
    Grade: "3rd Grade",
    Status: "P",
    Reason: "Transportation"
  }),
  Person.makeP({
    Name: "Nitrogen",
    Grade: "5th Grade",
    Status: "T",
    Reason: "Traveling"
  }),
  Person.makeP({
    Name: "Oxygen",
    Grade: "5th Grade",
    Status: "T",
    Reason: "Trying to find a Reason"
  }),
  Person.makeP({
    Name: "Fluorine",
    Grade: "6th Grade",
    Status: "A",
    Reason: "Flying away from me?"
  }),
  Person.makeP({
    Name: "Neon",
    Grade: "6th Grade",
    Status: "P",
    Reason: "Never had a Reason!"
  })
];

export function makeSampleData() {
  let result: Person[][] = [[], [], [], [], [], []];
  ELEMENT_DATA.forEach((person: Person) => {
    let index = getGradeFromString(person.Grade);
    result[index].push(person);
  });
  return result;
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

export function moveTeachersToBottom(list: Person[]) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].Role === "Teacher") {
      list.push(list[i]);
      list.splice(i, 1);
    }
  }
  return list;
}
