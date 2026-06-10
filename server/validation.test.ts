/**
 * Tests for application form validation logic.
 * These test the validation rules that are applied client-side.
 */
import { describe, it, expect } from "vitest";
import { createEmptyFormData } from "../shared/applicationTypes";

// Re-implement the validation functions here for testing
// (they live in the client but the logic is pure functions)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-()]{7,20}$/.test(phone);
}

function isValidNI(ni: string): boolean {
  if (!ni) return true;
  return /^[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]$/i.test(ni.trim());
}

type Errors = Record<string, string>;

function validateStep1(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.positionApplied.trim()) e.positionApplied = "Enter the position you are applying for";
  return e;
}

function validateStep2(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.title) e.title = "Select a title";
  if (!fd.surname.trim()) e.surname = "Enter your surname";
  if (!fd.forenames.trim()) e.forenames = "Enter your forename(s)";
  if (!fd.dateOfBirth) e.dateOfBirth = "Enter your date of birth";
  if (!fd.currentAddress.trim()) e.currentAddress = "Enter your current address";
  if (!fd.email.trim()) {
    e.email = "Enter your email address";
  } else if (!isValidEmail(fd.email)) {
    e.email = "Enter a valid email address";
  }
  if (!fd.mobileTel.trim()) {
    e.mobileTel = "Enter your mobile telephone number";
  } else if (!isValidPhone(fd.mobileTel)) {
    e.mobileTel = "Enter a valid mobile telephone number";
  }
  if (fd.homeTel && !isValidPhone(fd.homeTel)) {
    e.homeTel = "Enter a valid home telephone number";
  }
  if (fd.niNumber && !isValidNI(fd.niNumber)) {
    e.niNumber = "Enter a valid National Insurance number (e.g. QQ 12 34 56 C)";
  }
  return e;
}

function validateStep3(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.validDrivingLicence) e.validDrivingLicence = "Select whether you have a valid UK driving licence";
  if (!fd.carForWork) e.carForWork = "Select whether you have a car for work";
  if (!fd.rightToWork) e.rightToWork = "Select whether you have the right to work in the UK";
  return e;
}

function validateStep4(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.criminalConviction) e.criminalConviction = "Select whether you have any criminal convictions";
  if (!fd.receivedCautions) e.receivedCautions = "Select whether you have received any cautions";
  if (!fd.subjectOfProceedings) e.subjectOfProceedings = "Select whether you are subject to any proceedings";
  return e;
}

function validateStep7(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.currentEmployerName.trim()) e.currentEmployerName = "Enter your current or most recent employer's name";
  return e;
}

function validateStep8(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.relevantExperience.trim()) e.relevantExperience = "Please describe your relevant experience";
  return e;
}

function validateStep10(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  fd.referees.forEach((ref, i) => {
    if (!ref.name.trim()) e[`referee${i}Name`] = "Enter referee's first name";
    if (!ref.surname.trim()) e[`referee${i}Surname`] = "Enter referee's surname";
    if (!ref.email.trim()) {
      e[`referee${i}Email`] = "Enter referee's email address";
    } else if (!isValidEmail(ref.email)) {
      e[`referee${i}Email`] = "Enter a valid email address";
    }
  });
  return e;
}

function validateStep11(fd: ReturnType<typeof createEmptyFormData>): Errors {
  const e: Errors = {};
  if (!fd.declarationAgreed) e.declarationAgreed = "You must agree to the declaration";
  if (!fd.declarationName.trim()) e.declarationName = "Enter your full name as your digital signature";
  if (!fd.declarationDate) e.declarationDate = "Enter today's date";
  return e;
}

describe("Email validation", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    expect(isValidEmail("a@b.c")).toBe(true);
  });
  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
  });
});

describe("Phone validation", () => {
  it("accepts valid phone numbers", () => {
    expect(isValidPhone("07700900000")).toBe(true);
    expect(isValidPhone("+44 7700 900000")).toBe(true);
    expect(isValidPhone("020 7946 0958")).toBe(true);
  });
  it("rejects invalid phone numbers", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("abc")).toBe(false);
    expect(isValidPhone("12")).toBe(false);
  });
});

describe("NI number validation", () => {
  it("accepts valid NI numbers", () => {
    expect(isValidNI("QQ123456C")).toBe(true);
    expect(isValidNI("QQ 12 34 56 C")).toBe(true);
    expect(isValidNI("AB123456D")).toBe(true);
  });
  it("accepts empty NI (optional)", () => {
    expect(isValidNI("")).toBe(true);
  });
  it("rejects invalid NI numbers", () => {
    expect(isValidNI("12345")).toBe(false);
    expect(isValidNI("ABCDEFGH")).toBe(false);
    expect(isValidNI("QQ123456E")).toBe(false);
  });
});

describe("Step 1 validation (Position Details)", () => {
  it("requires position applied for", () => {
    const fd = createEmptyFormData();
    const errors = validateStep1(fd);
    expect(errors.positionApplied).toBeDefined();
  });
  it("passes when position is provided", () => {
    const fd = createEmptyFormData();
    fd.positionApplied = "Care Worker";
    const errors = validateStep1(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Step 2 validation (Personal Details)", () => {
  it("requires all mandatory personal fields", () => {
    const fd = createEmptyFormData();
    const errors = validateStep2(fd);
    expect(errors.title).toBeDefined();
    expect(errors.surname).toBeDefined();
    expect(errors.forenames).toBeDefined();
    expect(errors.dateOfBirth).toBeDefined();
    expect(errors.currentAddress).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.mobileTel).toBeDefined();
  });
  it("passes when all required fields are filled", () => {
    const fd = createEmptyFormData();
    fd.title = "Mr";
    fd.surname = "Smith";
    fd.forenames = "John";
    fd.dateOfBirth = "1990-01-01";
    fd.currentAddress = "123 Test Street, London, N1 1AA";
    fd.email = "john@example.com";
    fd.mobileTel = "07700900000";
    const errors = validateStep2(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
  it("validates email format", () => {
    const fd = createEmptyFormData();
    fd.title = "Mr";
    fd.surname = "Smith";
    fd.forenames = "John";
    fd.dateOfBirth = "1990-01-01";
    fd.currentAddress = "123 Test Street";
    fd.email = "not-an-email";
    fd.mobileTel = "07700900000";
    const errors = validateStep2(fd);
    expect(errors.email).toContain("valid email");
  });
  it("validates NI number format when provided", () => {
    const fd = createEmptyFormData();
    fd.title = "Mr";
    fd.surname = "Smith";
    fd.forenames = "John";
    fd.dateOfBirth = "1990-01-01";
    fd.currentAddress = "123 Test Street";
    fd.email = "john@example.com";
    fd.mobileTel = "07700900000";
    fd.niNumber = "INVALID";
    const errors = validateStep2(fd);
    expect(errors.niNumber).toBeDefined();
  });
});

describe("Step 3 validation (Additional Information)", () => {
  it("requires all yes/no questions", () => {
    const fd = createEmptyFormData();
    const errors = validateStep3(fd);
    expect(errors.validDrivingLicence).toBeDefined();
    expect(errors.carForWork).toBeDefined();
    expect(errors.rightToWork).toBeDefined();
  });
  it("passes when all questions answered", () => {
    const fd = createEmptyFormData();
    fd.validDrivingLicence = "yes";
    fd.carForWork = "no";
    fd.rightToWork = "yes";
    const errors = validateStep3(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Step 4 validation (Criminal Record)", () => {
  it("requires all criminal record questions", () => {
    const fd = createEmptyFormData();
    const errors = validateStep4(fd);
    expect(errors.criminalConviction).toBeDefined();
    expect(errors.receivedCautions).toBeDefined();
    expect(errors.subjectOfProceedings).toBeDefined();
  });
  it("passes when all questions answered", () => {
    const fd = createEmptyFormData();
    fd.criminalConviction = "no";
    fd.receivedCautions = "no";
    fd.subjectOfProceedings = "no";
    const errors = validateStep4(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Step 7 validation (Employment History)", () => {
  it("requires current employer name", () => {
    const fd = createEmptyFormData();
    const errors = validateStep7(fd);
    expect(errors.currentEmployerName).toBeDefined();
  });
  it("passes when employer name provided", () => {
    const fd = createEmptyFormData();
    fd.currentEmployerName = "Cogie Care Services";
    const errors = validateStep7(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Step 8 validation (Relevant Experience)", () => {
  it("requires relevant experience", () => {
    const fd = createEmptyFormData();
    const errors = validateStep8(fd);
    expect(errors.relevantExperience).toBeDefined();
  });
  it("passes when experience provided", () => {
    const fd = createEmptyFormData();
    fd.relevantExperience = "5 years of care work experience";
    const errors = validateStep8(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Step 10 validation (References)", () => {
  it("requires all three referees to have name, surname, and email", () => {
    const fd = createEmptyFormData();
    const errors = validateStep10(fd);
    expect(errors["referee0Name"]).toBeDefined();
    expect(errors["referee0Surname"]).toBeDefined();
    expect(errors["referee0Email"]).toBeDefined();
    expect(errors["referee1Name"]).toBeDefined();
    expect(errors["referee1Surname"]).toBeDefined();
    expect(errors["referee1Email"]).toBeDefined();
    expect(errors["referee2Name"]).toBeDefined();
    expect(errors["referee2Surname"]).toBeDefined();
    expect(errors["referee2Email"]).toBeDefined();
  });
  it("validates referee email format", () => {
    const fd = createEmptyFormData();
    fd.referees[0].name = "Jane";
    fd.referees[0].surname = "Doe";
    fd.referees[0].email = "not-valid";
    const errors = validateStep10(fd);
    expect(errors["referee0Email"]).toContain("valid email");
    expect(errors["referee0Name"]).toBeUndefined();
    expect(errors["referee0Surname"]).toBeUndefined();
  });
  it("passes when all referees have required fields", () => {
    const fd = createEmptyFormData();
    for (let i = 0; i < 3; i++) {
      fd.referees[i].name = `Referee${i}`;
      fd.referees[i].surname = `Surname${i}`;
      fd.referees[i].email = `ref${i}@example.com`;
    }
    const errors = validateStep10(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("Step 11 validation (Declaration)", () => {
  it("requires declaration agreement, name, and date", () => {
    const fd = createEmptyFormData();
    const errors = validateStep11(fd);
    expect(errors.declarationAgreed).toBeDefined();
    expect(errors.declarationName).toBeDefined();
    expect(errors.declarationDate).toBeDefined();
  });
  it("passes when all declaration fields completed", () => {
    const fd = createEmptyFormData();
    fd.declarationAgreed = true;
    fd.declarationName = "John Smith";
    fd.declarationDate = "2026-02-26";
    const errors = validateStep11(fd);
    expect(Object.keys(errors).length).toBe(0);
  });
});
