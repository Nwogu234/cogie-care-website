/**
 * Tests for email service and PDF export functionality.
 */
import { describe, it, expect } from "vitest";
import { verifySmtp, sendApplicantConfirmation, sendAdminNotification } from "./emailService";
import { generateApplicationPdf } from "./generatePdf";
import type { ApplicationFormData } from "../shared/applicationTypes";

describe("SMTP Email Service", () => {
  it("should verify SMTP connection with IONOS", async () => {
    const result = await verifySmtp();
    expect(result).toBe(true);
  }, 15000);

  it("should have SMTP environment variables configured", () => {
    expect(process.env.SMTP_HOST).toBeTruthy();
    expect(process.env.SMTP_PORT).toBeTruthy();
    expect(process.env.SMTP_USER).toBeTruthy();
    expect(process.env.SMTP_PASS).toBeTruthy();
  });

  it("should have ADMIN_EMAIL configured", () => {
    expect(process.env.ADMIN_EMAIL).toBeTruthy();
  });

  it("sendApplicantConfirmation should return boolean", async () => {
    // We test with a non-existent email to avoid sending real emails in tests
    // The function should still return true/false without throwing
    const result = await sendApplicantConfirmation({
      applicantName: "Test User",
      applicantEmail: "test-vitest-no-reply@example.invalid",
      positionApplied: "Care Worker",
    });
    expect(typeof result).toBe("boolean");
  }, 15000);

  it("sendAdminNotification should return boolean", async () => {
    const result = await sendAdminNotification({
      applicantName: "Test User",
      applicantEmail: "test@example.com",
      positionApplied: "Care Worker",
      applicationId: 999,
      hasCv: false,
    });
    expect(typeof result).toBe("boolean");
  }, 15000);
});

describe("PDF Export", () => {
  const sampleFormData: ApplicationFormData = {
    positionApplied: "Care Worker",
    branchLocation: "North London",
    advertisementSource: "Website",
    title: "Mr",
    surname: "Smith",
    maidenSurname: "",
    forenames: "John",
    niNumber: "AB123456C",
    dateOfBirth: "1990-01-15",
    placeOfBirth: "London",
    currentAddress: "123 Test Street, London N9 8RP",
    previousAddresses: [],
    email: "john.smith@example.com",
    homeTel: "020 1234 5678",
    mobileTel: "07700 900123",
    validDrivingLicence: "yes",
    carForWork: "no",
    rightToWork: "yes",
    rightToWorkConditions: "",
    relatedToEmployee: "no",
    relatedToEmployeeDetails: "",
    otherWorkCommitments: "no",
    criminalConviction: "no",
    receivedCautions: "no",
    subjectOfProceedings: "no",
    secondaryEducation: "Test School",
    secondaryQualifications: "GCSEs",
    furtherEducation: "Test College",
    furtherQualifications: "NVQ Level 3",
    trainingCourses: [
      { course: "First Aid", dateObtained: "2023-01-01", expiryDate: "2026-01-01" },
    ],
    otherTraining: "Manual handling",
    professionalMemberships: "",
    currentEmployerName: "Care Co",
    currentEmployerStartDate: "2020-01-01",
    currentEmployerEndDate: "",
    currentEmployerAddress: "456 Care Road",
    currentEmployerPostcode: "N1 1AA",
    currentEmployerTel: "020 9876 5432",
    currentJobTitle: "Support Worker",
    currentSalary: "£25,000",
    currentDuties: "Providing care and support",
    employmentHistory: [],
    relevantExperience: "5 years in care sector",
    availability: {
      monFriDays: { mornings: true, afternoons: true, evenings: false, sleepOver: false, wakingNights: false },
      monFriNights: { mornings: false, afternoons: false, evenings: true, sleepOver: true, wakingNights: false },
      saturday: { mornings: true, afternoons: false, evenings: false, sleepOver: false, wakingNights: false },
      sunday: { mornings: false, afternoons: false, evenings: false, sleepOver: false, wakingNights: false },
    },
    geographicalAreas: "North London",
    workType: "Full-time",
    idealHours: "40",
    referees: [
      {
        name: "Jane",
        surname: "Doe",
        titlePosition: "Manager",
        organization: "Care Co",
        address: "456 Care Road",
        postCode: "N1 1AA",
        relationship: "Line Manager",
        email: "jane@careco.com",
        telephone: "020 1111 2222",
        contactPrior: "yes",
      },
      {
        name: "Bob",
        surname: "Jones",
        titlePosition: "Director",
        organization: "Health Ltd",
        address: "789 Health Ave",
        postCode: "N2 2BB",
        relationship: "Previous Manager",
        email: "bob@health.com",
        telephone: "020 3333 4444",
        contactPrior: "no",
      },
      { name: "", surname: "", titlePosition: "", organization: "", address: "", postCode: "", relationship: "", email: "", telephone: "", contactPrior: "" },
    ],
    declarationName: "John Smith",
    declarationDate: "2026-02-26",
    declarationAgreed: true,
  };

  it("should generate a valid PDF buffer from form data", async () => {
    const buffer = await generateApplicationPdf(sampleFormData);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);
    // PDF files start with %PDF
    const header = buffer.toString("utf-8", 0, 5);
    expect(header).toBe("%PDF-");
  });

  it("should include applicant name in PDF metadata", async () => {
    const buffer = await generateApplicationPdf(sampleFormData);
    const content = buffer.toString("utf-8");
    expect(content).toContain("John");
    expect(content).toContain("Smith");
  });

  it("should handle minimal form data without crashing", async () => {
    const minimalData: ApplicationFormData = {
      positionApplied: "Test",
      branchLocation: "",
      advertisementSource: "",
      title: "",
      surname: "Test",
      maidenSurname: "",
      forenames: "User",
      niNumber: "",
      dateOfBirth: "",
      placeOfBirth: "",
      currentAddress: "",
      previousAddresses: [],
      email: "test@test.com",
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
      trainingCourses: [],
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
      employmentHistory: [],
      relevantExperience: "",
      availability: {
        monFriDays: { mornings: false, afternoons: false, evenings: false, sleepOver: false, wakingNights: false },
        monFriNights: { mornings: false, afternoons: false, evenings: false, sleepOver: false, wakingNights: false },
        saturday: { mornings: false, afternoons: false, evenings: false, sleepOver: false, wakingNights: false },
        sunday: { mornings: false, afternoons: false, evenings: false, sleepOver: false, wakingNights: false },
      },
      geographicalAreas: "",
      workType: "",
      idealHours: "",
      referees: [],
      declarationName: "",
      declarationDate: "",
      declarationAgreed: false,
    };
    const buffer = await generateApplicationPdf(minimalData);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(500);
  });
});
