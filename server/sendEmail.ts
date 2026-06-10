/**
 * Send the completed application form PDF via email to the recruitment team.
 * Uses Nodemailer with configurable SMTP settings.
 */
import nodemailer from "nodemailer";

interface SendApplicationEmailOptions {
  pdfBuffer: Buffer;
  applicantName: string;
  applicantEmail: string;
  positionApplied: string;
  recipientEmail: string;
}

export async function sendApplicationEmail(opts: SendApplicationEmailOptions): Promise<boolean> {
  const {
    pdfBuffer,
    applicantName,
    applicantEmail,
    positionApplied,
    recipientEmail,
  } = opts;

  // SMTP configuration from environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("[Email] SMTP not configured. Skipping email send.");
    console.log("[Email] Would have sent application from", applicantName, "to", recipientEmail);
    // Return true to not block the form submission — PDF is still generated
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const filename = `Application_${applicantName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;

  try {
    await transporter.sendMail({
      from: `"Cogie Care Services" <${smtpFrom}>`,
      to: recipientEmail,
      cc: applicantEmail, // Send a copy to the applicant
      subject: `Job Application: ${positionApplied} — ${applicantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1B2A4A; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Cogie Care Services</h1>
            <p style="color: #D4A853; margin: 5px 0 0; font-size: 12px; letter-spacing: 2px;">JOB APPLICATION</p>
          </div>
          <div style="padding: 30px; background-color: #f8f8f8;">
            <h2 style="color: #1B2A4A; margin-top: 0;">New Application Received</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;"><strong>Applicant:</strong></td>
                <td style="padding: 8px 0; color: #1B2A4A; font-size: 14px;">${applicantName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Position:</strong></td>
                <td style="padding: 8px 0; color: #1B2A4A; font-size: 14px;">${positionApplied}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #1B2A4A; font-size: 14px;">${applicantEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; color: #1B2A4A; font-size: 14px;">${new Date().toLocaleDateString("en-GB")}</td>
              </tr>
            </table>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              The completed application form is attached as a PDF document. Please review and process accordingly.
            </p>
          </div>
          <div style="padding: 15px; background-color: #1B2A4A; text-align: center;">
            <p style="color: #999; font-size: 11px; margin: 0;">Petrichor Healthcare Provisions Ltd — Confidential</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("[Email] Application sent successfully to", recipientEmail);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}
