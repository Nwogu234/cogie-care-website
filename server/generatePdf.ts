/**
 * Generate a PDF document from the completed application form data.
 * Uses PDFKit to create a professional-looking document matching the original form layout.
 */
import PDFDocument from "pdfkit";
import type { ApplicationFormData } from "../shared/applicationTypes";

export function generateApplicationPdf(data: ApplicationFormData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: `Job Application - ${data.forenames} ${data.surname}`,
        Author: "Cogie Care Services",
        Subject: "Job Application Form",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const navy = "#1B2A4A";
    const gold = "#D4A853";
    const gray = "#666666";
    const pageWidth = doc.page.width - 100; // margins

    // Helper functions
    const sectionTitle = (title: string) => {
      doc.moveDown(0.5);
      doc
        .rect(50, doc.y, pageWidth, 28)
        .fill(navy);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("white")
        .text(title, 60, doc.y - 22, { width: pageWidth - 20 });
      doc.fillColor(navy);
      doc.moveDown(0.5);
    };

    const fieldRow = (label: string, value: string) => {
      const startY = doc.y;
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(gray)
        .text(label, 55, startY, { width: 160 });
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(navy)
        .text(value || "—", 220, startY, { width: pageWidth - 175 });
      doc.y = Math.max(doc.y, startY + 16);
      doc.moveDown(0.2);
    };

    const checkPage = (needed: number = 80) => {
      if (doc.y + needed > doc.page.height - 60) {
        doc.addPage();
      }
    };

    // ═══════════════════ HEADER ═══════════════════
    doc
      .rect(0, 0, doc.page.width, 80)
      .fill(navy);
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("white")
      .text("COGIE CARE SERVICES", 50, 20, { width: pageWidth });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(gold)
      .text("JOB APPLICATION FORM", 50, 48, { width: pageWidth });
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("white")
      .text("Petrichor Healthcare Provisions Ltd", 50, 62, { width: pageWidth });

    doc.y = 100;

    // ═══════════════════ SECTION 1: POSITION DETAILS ═══════════════════
    sectionTitle("1. POSITION DETAILS");
    fieldRow("Position Applied For", data.positionApplied);
    fieldRow("Branch / Location", data.branchLocation);
    fieldRow("Advertisement Source", data.advertisementSource);

    // ═══════════════════ SECTION 2: PERSONAL DETAILS ═══════════════════
    checkPage(200);
    sectionTitle("2. PERSONAL DETAILS");
    fieldRow("Title", data.title);
    fieldRow("Surname", data.surname);
    fieldRow("Maiden / Previous Surnames", data.maidenSurname);
    fieldRow("Forenames", data.forenames);
    fieldRow("NI Number", data.niNumber);
    fieldRow("Date of Birth", data.dateOfBirth);
    fieldRow("Place of Birth", data.placeOfBirth);
    fieldRow("Current Address", data.currentAddress);
    if (data.previousAddresses.some((a) => a.address)) {
      data.previousAddresses.forEach((addr, i) => {
        if (addr.address) {
          checkPage(40);
          fieldRow(`Previous Address ${i + 1}`, `${addr.address} (${addr.from} to ${addr.until})`);
        }
      });
    }
    fieldRow("Email", data.email);
    fieldRow("Home Telephone", data.homeTel);
    fieldRow("Mobile Telephone", data.mobileTel);

    // ═══════════════════ SECTION 3: ADDITIONAL INFORMATION ═══════════════════
    checkPage(150);
    sectionTitle("3. ADDITIONAL INFORMATION");
    fieldRow("Valid Driving Licence", data.validDrivingLicence === "yes" ? "Yes" : data.validDrivingLicence === "no" ? "No" : "—");
    fieldRow("Car for Work", data.carForWork === "yes" ? "Yes" : data.carForWork === "no" ? "No" : "—");
    fieldRow("Right to Work in UK", data.rightToWork === "yes" ? "Yes" : data.rightToWork === "no" ? "No" : "—");
    if (data.rightToWorkConditions) {
      fieldRow("Conditions", data.rightToWorkConditions);
    }
    fieldRow("Related to Employee", data.relatedToEmployee === "yes" ? "Yes" : data.relatedToEmployee === "no" ? "No" : "—");
    if (data.relatedToEmployeeDetails) {
      fieldRow("Details", data.relatedToEmployeeDetails);
    }
    fieldRow("Other Work Commitments", data.otherWorkCommitments === "yes" ? "Yes" : data.otherWorkCommitments === "no" ? "No" : "—");

    // ═══════════════════ SECTION 4: CRIMINAL RECORD ═══════════════════
    checkPage(120);
    sectionTitle("4. CRIMINAL RECORD DECLARATION");
    fieldRow("Criminal Conviction", data.criminalConviction === "yes" ? "Yes" : data.criminalConviction === "no" ? "No" : "—");
    fieldRow("Cautions / Reprimands", data.receivedCautions === "yes" ? "Yes" : data.receivedCautions === "no" ? "No" : "—");
    fieldRow("Subject of Proceedings", data.subjectOfProceedings === "yes" ? "Yes" : data.subjectOfProceedings === "no" ? "No" : "—");

    // ═══════════════════ SECTION 5: EDUCATION ═══════════════════
    checkPage(150);
    sectionTitle("5. EDUCATION & QUALIFICATIONS");
    fieldRow("Secondary Education", data.secondaryEducation);
    fieldRow("Secondary Qualifications", data.secondaryQualifications);
    fieldRow("Further Education", data.furtherEducation);
    fieldRow("Further Qualifications", data.furtherQualifications);

    // ═══════════════════ SECTION 6: TRAINING ═══════════════════
    checkPage(100);
    sectionTitle("6. TRAINING & CERTIFICATIONS");
    const completedCourses = data.trainingCourses.filter((tc) => tc.dateObtained);
    if (completedCourses.length > 0) {
      // Table header
      doc.font("Helvetica-Bold").fontSize(8).fillColor(gray);
      const tableY = doc.y;
      doc.text("Course", 55, tableY, { width: 200 });
      doc.text("Date Obtained", 260, tableY, { width: 100 });
      doc.text("Expiry Date", 370, tableY, { width: 100 });
      doc.moveDown(0.3);
      doc.moveTo(55, doc.y).lineTo(50 + pageWidth, doc.y).strokeColor(gray).lineWidth(0.5).stroke();
      doc.moveDown(0.3);

      completedCourses.forEach((tc) => {
        checkPage(20);
        const rowY = doc.y;
        doc.font("Helvetica").fontSize(9).fillColor(navy);
        doc.text(tc.course, 55, rowY, { width: 200 });
        doc.text(tc.dateObtained, 260, rowY, { width: 100 });
        doc.text(tc.expiryDate || "—", 370, rowY, { width: 100 });
        doc.moveDown(0.3);
      });
    } else {
      doc.font("Helvetica").fontSize(9).fillColor(gray).text("No training courses recorded.", 55);
      doc.moveDown(0.3);
    }
    if (data.otherTraining) {
      checkPage(40);
      fieldRow("Other Training", data.otherTraining);
    }
    if (data.professionalMemberships) {
      checkPage(40);
      fieldRow("Professional Memberships", data.professionalMemberships);
    }

    // ═══════════════════ SECTION 7: EMPLOYMENT ═══════════════════
    checkPage(200);
    sectionTitle("7. EMPLOYMENT HISTORY");
    doc.font("Helvetica-Bold").fontSize(10).fillColor(navy).text("Current / Most Recent Employment", 55);
    doc.moveDown(0.3);
    fieldRow("Employer", data.currentEmployerName);
    fieldRow("Start Date", data.currentEmployerStartDate);
    fieldRow("End Date", data.currentEmployerEndDate || "Present");
    fieldRow("Address", data.currentEmployerAddress);
    fieldRow("Postcode", data.currentEmployerPostcode);
    fieldRow("Telephone", data.currentEmployerTel);
    fieldRow("Job Title", data.currentJobTitle);
    fieldRow("Salary", data.currentSalary);
    fieldRow("Duties", data.currentDuties);

    if (data.employmentHistory.some((e) => e.jobTitle)) {
      checkPage(60);
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").fontSize(10).fillColor(navy).text("Previous Employment", 55);
      doc.moveDown(0.3);
      data.employmentHistory.forEach((emp, i) => {
        if (emp.jobTitle) {
          checkPage(80);
          doc.font("Helvetica-Bold").fontSize(9).fillColor(navy).text(`Employment ${i + 1}`, 55);
          doc.moveDown(0.2);
          fieldRow("Period", `${emp.dateFrom} to ${emp.dateTo}`);
          fieldRow("Job Title", emp.jobTitle);
          fieldRow("Employer", emp.employerNameAddress);
          fieldRow("Reason for Leaving", emp.reasonForLeaving);
          doc.moveDown(0.3);
        }
      });
    }

    // ═══════════════════ SECTION 8: RELEVANT EXPERIENCE ═══════════════════
    checkPage(100);
    sectionTitle("8. RELEVANT EXPERIENCE");
    doc.font("Helvetica").fontSize(9).fillColor(navy).text(data.relevantExperience || "—", 55, doc.y, { width: pageWidth - 10 });
    doc.moveDown(0.5);

    // ═══════════════════ SECTION 9: AVAILABILITY ═══════════════════
    checkPage(120);
    sectionTitle("9. AVAILABILITY");
    const periods = [
      { key: "monFriDays" as const, label: "Mon-Fri (Days)" },
      { key: "monFriNights" as const, label: "Mon-Fri (Nights)" },
      { key: "saturday" as const, label: "Saturday" },
      { key: "sunday" as const, label: "Sunday" },
    ];
    const slots = ["mornings", "afternoons", "evenings", "sleepOver", "wakingNights"] as const;
    const slotLabels = ["Morn", "Aft", "Eve", "Sleep", "Wake"];

    // Table header
    doc.font("Helvetica-Bold").fontSize(7).fillColor(gray);
    let tY = doc.y;
    doc.text("Period", 55, tY, { width: 100 });
    slotLabels.forEach((s, i) => {
      doc.text(s, 170 + i * 65, tY, { width: 60, align: "center" });
    });
    doc.moveDown(0.3);
    doc.moveTo(55, doc.y).lineTo(50 + pageWidth, doc.y).strokeColor(gray).lineWidth(0.5).stroke();
    doc.moveDown(0.3);

    periods.forEach((p) => {
      const rowY = doc.y;
      doc.font("Helvetica").fontSize(8).fillColor(navy).text(p.label, 55, rowY, { width: 100 });
      slots.forEach((s, i) => {
        const val = data.availability[p.key][s];
        doc.text(val ? "✓" : "—", 170 + i * 65, rowY, { width: 60, align: "center" });
      });
      doc.moveDown(0.4);
    });

    if (data.geographicalAreas) fieldRow("Geographical Areas", data.geographicalAreas);
    if (data.workType) fieldRow("Work Type", data.workType);
    if (data.idealHours) fieldRow("Ideal Hours/Week", data.idealHours);

    // ═══════════════════ SECTION 10: REFERENCES ═══════════════════
    checkPage(200);
    sectionTitle("10. REFERENCES");
    data.referees.forEach((ref, i) => {
      if (ref.name || ref.surname) {
        checkPage(100);
        doc.font("Helvetica-Bold").fontSize(9).fillColor(navy).text(`Referee ${i + 1}`, 55);
        doc.moveDown(0.2);
        fieldRow("Name", `${ref.name} ${ref.surname}`);
        fieldRow("Title / Position", ref.titlePosition);
        fieldRow("Organisation", ref.organization);
        fieldRow("Address", ref.address);
        fieldRow("Post Code", ref.postCode);
        fieldRow("Relationship", ref.relationship);
        fieldRow("Email", ref.email);
        fieldRow("Telephone", ref.telephone);
        fieldRow("Contact Prior", ref.contactPrior === "yes" ? "Yes" : ref.contactPrior === "no" ? "No" : "—");
        doc.moveDown(0.3);
      }
    });

    // ═══════════════════ SECTION 11: DECLARATION ═══════════════════
    checkPage(120);
    sectionTitle("11. APPLICANT DECLARATION");
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(gray)
      .text(
        "I declare that the information in this form is true and complete. I agree that any deliberate omissions, falsification or misinterpretation will be grounds for rejecting this application or subsequent dismissal.",
        55,
        doc.y,
        { width: pageWidth - 10 }
      );
    doc.moveDown(0.5);
    fieldRow("Signed", data.declarationName);
    fieldRow("Date", data.declarationDate);
    fieldRow("Declaration Agreed", data.declarationAgreed ? "Yes" : "No");

    // ═══════════════════ FOOTER ═══════════════════
    doc.moveDown(1);
    doc
      .moveTo(50, doc.y)
      .lineTo(50 + pageWidth, doc.y)
      .strokeColor(gold)
      .lineWidth(2)
      .stroke();
    doc.moveDown(0.5);
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(gray)
      .text(
        `Generated on ${new Date().toLocaleDateString("en-GB")} — Petrichor Healthcare Provisions Ltd — Confidential`,
        55,
        doc.y,
        { width: pageWidth - 10, align: "center" }
      );

    doc.end();
  });
}
