/**
 * Express route for handling application form submissions.
 * Generates a PDF and sends it via email.
 */
import { Router, Request, Response } from "express";
import { generateApplicationPdf } from "./generatePdf";
import { sendApplicationEmail } from "./sendEmail";
import { sendApplicantConfirmation, sendAdminNotification } from "./emailService";
import { createApplication } from "./db";
import type { ApplicationFormData } from "../shared/applicationTypes";

const RECRUITMENT_EMAIL = process.env.ADMIN_EMAIL || "services@cogie.uk";

const applicationRouter = Router();

applicationRouter.post("/api/application/submit", async (req: Request, res: Response) => {
  try {
    const formData: ApplicationFormData = req.body;

    // Basic validation
    if (!formData.forenames || !formData.surname || !formData.email) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: name and email are required.",
      });
      return;
    }

    if (!formData.declarationAgreed) {
      res.status(400).json({
        success: false,
        error: "You must agree to the declaration before submitting.",
      });
      return;
    }

    // Generate PDF
    console.log("[Application] Generating PDF for", formData.forenames, formData.surname);
    const pdfBuffer = await generateApplicationPdf(formData);
    console.log("[Application] PDF generated, size:", pdfBuffer.length, "bytes");

    // Send email
    const applicantName = `${formData.title} ${formData.forenames} ${formData.surname}`.trim();
    const emailSent = await sendApplicationEmail({
      pdfBuffer,
      applicantName,
      applicantEmail: formData.email,
      positionApplied: formData.positionApplied || "Not specified",
      recipientEmail: RECRUITMENT_EMAIL,
    });

    // Store application in database
    const cvUrl = (req.body as any).cvUrl || null;
    const cvFileName = (req.body as any).cvFileName || null;
    let applicationId = 0;
    try {
      const result = await createApplication({
        applicantName,
        applicantEmail: formData.email,
        positionApplied: formData.positionApplied || null,
        phone: formData.mobileTel || formData.homeTel || null,
        formData: formData as unknown as Record<string, unknown>,
        cvUrl,
        cvFileName,
        emailSent,
        status: "new",
      });
      applicationId = Number((result as any)?.[0]?.insertId || 0);
      console.log("[Application] Stored in database, ID:", applicationId);
    } catch (dbErr) {
      console.error("[Application] Failed to store in database:", dbErr);
    }

    // Send applicant confirmation email (non-blocking)
    sendApplicantConfirmation({
      applicantName,
      applicantEmail: formData.email,
      positionApplied: formData.positionApplied || "Not specified",
    }).catch((err) => console.error("[Email] Confirmation email error:", err));

    // Send admin notification email (non-blocking)
    sendAdminNotification({
      applicantName,
      applicantEmail: formData.email,
      positionApplied: formData.positionApplied || "Not specified",
      applicationId,
      hasCv: !!cvUrl,
    }).catch((err) => console.error("[Email] Admin notification error:", err));

    res.json({
      success: true,
      emailSent,
      message: "Application submitted successfully. You will receive a confirmation email shortly.",
    });
  } catch (error) {
    console.error("[Application] Submission error:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing your application. Please try again.",
    });
  }
});

export { applicationRouter };
