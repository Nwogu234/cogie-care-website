/** Shared types for the job application form */

export interface PreviousAddress {
  address: string;
  from: string;
  until: string;
}

export interface TrainingCourse {
  course: string;
  dateObtained: string;
  expiryDate: string;
}

export interface EmploymentRecord {
  dateFrom: string;
  dateTo: string;
  jobTitle: string;
  employerNameAddress: string;
  reasonForLeaving: string;
}

export interface Referee {
  name: string;
  surname: string;
  titlePosition: string;
  organization: string;
  address: string;
  postCode: string;
  relationship: string;
  email: string;
  telephone: string;
  contactPrior: "yes" | "no" | "";
}

export interface AvailabilityRow {
  mornings: boolean;
  afternoons: boolean;
  evenings: boolean;
  sleepOver: boolean;
  wakingNights: boolean;
}

export interface ApplicationFormData {
  // Step 1: Position Details
  positionApplied: string;
  branchLocation: string;
  advertisementSource: string;

  // Step 2: Personal Details
  title: string;
  surname: string;
  maidenSurname: string;
  forenames: string;
  niNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  currentAddress: string;
  previousAddresses: PreviousAddress[];
  email: string;
  homeTel: string;
  mobileTel: string;

  // Step 3: Additional Information
  validDrivingLicence: "yes" | "no" | "";
  carForWork: "yes" | "no" | "";
  rightToWork: "yes" | "no" | "";
  rightToWorkConditions: string;
  relatedToEmployee: "yes" | "no" | "";
  relatedToEmployeeDetails: string;
  otherWorkCommitments: "yes" | "no" | "";

  // Step 4: Criminal Record Declaration
  criminalConviction: "yes" | "no" | "";
  receivedCautions: "yes" | "no" | "";
  subjectOfProceedings: "yes" | "no" | "";

  // Step 5: Education & Qualifications
  secondaryEducation: string;
  secondaryQualifications: string;
  furtherEducation: string;
  furtherQualifications: string;

  // Step 6: Training & Certifications
  trainingCourses: TrainingCourse[];
  otherTraining: string;
  professionalMemberships: string;

  // Step 7: Employment History
  currentEmployerName: string;
  currentEmployerStartDate: string;
  currentEmployerEndDate: string;
  currentEmployerAddress: string;
  currentEmployerPostcode: string;
  currentEmployerTel: string;
  currentJobTitle: string;
  currentSalary: string;
  currentDuties: string;
  employmentHistory: EmploymentRecord[];

  // Step 8: Relevant Experience
  relevantExperience: string;

  // Step 9: Availability
  availability: {
    monFriDays: AvailabilityRow;
    monFriNights: AvailabilityRow;
    saturday: AvailabilityRow;
    sunday: AvailabilityRow;
  };
  geographicalAreas: string;
  workType: string;
  idealHours: string;

  // Step 10: References
  referees: [Referee, Referee, Referee];

  // Step 11: Declaration
  declarationAgreed: boolean;
  declarationName: string;
  declarationDate: string;
}

export const PREDEFINED_COURSES = [
  "Moving and Handling",
  "Food Hygiene",
  "Fire Awareness (Practical)",
  "First Aid",
  "Infectious Disease Control",
  "Medication Administration",
  "Health and Safety",
  "Mental Capacity Act 2005",
  "SOVA SOCA Level 3",
  "Information Governance",
  "Communication",
  "Lone Worker",
  "Complaints Handling",
  "COSHH",
  "Dementia",
];

export function createEmptyFormData(): ApplicationFormData {
  const emptyAvailRow = (): AvailabilityRow => ({
    mornings: false,
    afternoons: false,
    evenings: false,
    sleepOver: false,
    wakingNights: false,
  });

  const emptyReferee = (): Referee => ({
    name: "",
    surname: "",
    titlePosition: "",
    organization: "",
    address: "",
    postCode: "",
    relationship: "",
    email: "",
    telephone: "",
    contactPrior: "",
  });

  return {
    positionApplied: "",
    branchLocation: "",
    advertisementSource: "",
    title: "",
    surname: "",
    maidenSurname: "",
    forenames: "",
    niNumber: "",
    dateOfBirth: "",
    placeOfBirth: "",
    currentAddress: "",
    previousAddresses: [{ address: "", from: "", until: "" }],
    email: "",
    homeTel: "",
    mobileTel: "",
    validDrivingLicence: "",
    carForWork: "",
    rightToWork: "",
    rightToWorkConditions: "",
    relatedToEmployee: "",
    relatedToEmployeeDetails: "",
    otherWorkCommitments: "",
    criminalConviction: "",
    receivedCautions: "",
    subjectOfProceedings: "",
    secondaryEducation: "",
    secondaryQualifications: "",
    furtherEducation: "",
    furtherQualifications: "",
    trainingCourses: PREDEFINED_COURSES.map((c) => ({
      course: c,
      dateObtained: "",
      expiryDate: "",
    })),
    otherTraining: "",
    professionalMemberships: "",
    currentEmployerName: "",
    currentEmployerStartDate: "",
    currentEmployerEndDate: "",
    currentEmployerAddress: "",
    currentEmployerPostcode: "",
    currentEmployerTel: "",
    currentJobTitle: "",
    currentSalary: "",
    currentDuties: "",
    employmentHistory: [
      { dateFrom: "", dateTo: "", jobTitle: "", employerNameAddress: "", reasonForLeaving: "" },
    ],
    relevantExperience: "",
    availability: {
      monFriDays: emptyAvailRow(),
      monFriNights: emptyAvailRow(),
      saturday: emptyAvailRow(),
      sunday: emptyAvailRow(),
    },
    geographicalAreas: "",
    workType: "",
    idealHours: "",
    referees: [emptyReferee(), emptyReferee(), emptyReferee()],
    declarationAgreed: false,
    declarationName: "",
    declarationDate: "",
  };
}
