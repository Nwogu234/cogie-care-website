import { describe, expect, it } from "vitest";
import { generateApplicationPdf } from "./generatePdf";
import { createEmptyFormData } from "../shared/applicationTypes";

describe("generateApplicationPdf", () => {
  it("generates a PDF buffer from valid form data", async () => {
    const formData = createEmptyFormData();
    formData.positionApplied = "Care Worker";
    formData.branchLocation = "13 Woodland Road, N9 8RP";
    formData.title = "Mr";
    formData.forenames = "John";
    formData.surname = "Smith";
    formData.email = "john.smith@example.com";
    formData.mobileTel = "07700900000";
    formData.dateOfBirth = "1990-01-15";
    formData.currentAddress = "123 Test Street, London, N1 1AA";
    formData.declarationAgreed = true;
    formData.declarationName = "John Smith";
    formData.declarationDate = "2026-02-26";

    const pdfBuffer = await generateApplicationPdf(formData);

    // Should return a Buffer
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    // Should have content (PDF files are at least a few KB)
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    // Should start with PDF magic bytes
    expect(pdfBuffer.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("generates a PDF even with minimal data", async () => {
    const formData = createEmptyFormData();
    formData.forenames = "Jane";
    formData.surname = "Doe";
    formData.email = "jane@example.com";

    const pdfBuffer = await generateApplicationPdf(formData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("includes training courses with dates in the PDF", async () => {
    const formData = createEmptyFormData();
    formData.forenames = "Test";
    formData.surname = "User";
    formData.email = "test@example.com";
    formData.trainingCourses[0].dateObtained = "2024-01-15";
    formData.trainingCourses[0].expiryDate = "2027-01-15";

    const pdfBuffer = await generateApplicationPdf(formData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
  });

  it("handles employment history entries", async () => {
    const formData = createEmptyFormData();
    formData.forenames = "Test";
    formData.surname = "Worker";
    formData.email = "worker@example.com";
    formData.currentEmployerName = "ABC Care Ltd";
    formData.currentJobTitle = "Senior Care Worker";
    formData.currentEmployerStartDate = "2020-03-01";
    formData.employmentHistory = [
      {
        dateFrom: "2018-01-01",
        dateTo: "2020-02-28",
        jobTitle: "Care Assistant",
        employerNameAddress: "XYZ Care, London",
        reasonForLeaving: "Career progression",
      },
    ];

    const pdfBuffer = await generateApplicationPdf(formData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
  });
});

describe("createEmptyFormData", () => {
  it("creates a form data object with all required fields", () => {
    const formData = createEmptyFormData();

    expect(formData.positionApplied).toBe("");
    expect(formData.surname).toBe("");
    expect(formData.forenames).toBe("");
    expect(formData.email).toBe("");
    expect(formData.declarationAgreed).toBe(false);
    expect(formData.previousAddresses).toHaveLength(1);
    expect(formData.employmentHistory).toHaveLength(1);
    expect(formData.referees).toHaveLength(3);
    expect(formData.trainingCourses.length).toBeGreaterThan(0);
  });

  it("creates empty availability with all false values", () => {
    const formData = createEmptyFormData();

    expect(formData.availability.monFriDays.mornings).toBe(false);
    expect(formData.availability.monFriDays.afternoons).toBe(false);
    expect(formData.availability.saturday.evenings).toBe(false);
    expect(formData.availability.sunday.wakingNights).toBe(false);
  });

  it("creates three empty referees", () => {
    const formData = createEmptyFormData();

    expect(formData.referees).toHaveLength(3);
    formData.referees.forEach((ref) => {
      expect(ref.name).toBe("");
      expect(ref.surname).toBe("");
      expect(ref.email).toBe("");
      expect(ref.contactPrior).toBe("");
    });
  });
});
