/**
 * Email service using Nodemailer with IONOS SMTP.
 * Sends applicant confirmation and admin notification emails.
 */
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.ionos.co.uk";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // TLS on port 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Verify SMTP connection is working.
 */
export async function verifySmtp(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (err) {
    console.error("[Email] SMTP verification failed:", err);
    return false;
  }
}

/**
 * Send applicant confirmation email after successful submission.
 */
export async function sendApplicantConfirmation({
  applicantName,
  applicantEmail,
  positionApplied,
}: {
  applicantName: string;
  applicantEmail: string;
  positionApplied: string;
}): Promise<boolean> {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("[Email] SMTP credentials not configured, skipping email");
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Cogie Care Services" <${SMTP_USER}>`,
      to: applicantEmail,
      subject: `Application Received — ${positionApplied}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1B2A4A; padding: 30px 40px; text-align: center; }
    .header h1 { color: #D4A853; font-size: 22px; margin: 0; }
    .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 5px 0 0; }
    .body { padding: 40px; }
    .body h2 { color: #1B2A4A; font-size: 20px; margin: 0 0 20px; }
    .body p { color: #4a5568; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .highlight { background: #faf7f2; border-left: 4px solid #D4A853; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .highlight strong { color: #1B2A4A; }
    .footer { background: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #718096; font-size: 12px; margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cogie Care Services</h1>
      <p>Application Confirmation</p>
    </div>
    <div class="body">
      <h2>Thank you for your application, ${applicantName}.</h2>
      <p>We have successfully received your application and it is now being reviewed by our team.</p>
      <div class="highlight">
        <strong>Position:</strong> ${positionApplied}<br>
        <strong>Submitted:</strong> ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </div>
      <p>Our recruitment team will review your application and be in touch if your profile matches our requirements. This process typically takes 5–10 working days.</p>
      <p>If you have any questions in the meantime, please do not hesitate to contact us at <a href="mailto:${ADMIN_EMAIL}" style="color: #D4A853;">${ADMIN_EMAIL}</a>.</p>
      <p style="margin-top: 24px;">Kind regards,<br><strong>Cogie Care Services Recruitment Team</strong></p>
    </div>
    <div class="footer">
      <p>Cogie Care Services<br>13 Woodland Road, London N9<br>This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });
    console.log(`[Email] Confirmation sent to ${applicantEmail}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send applicant confirmation:", err);
    return false;
  }
}

/**
 * Send admin notification email when a new application is received.
 */
export async function sendAdminNotification({
  applicantName,
  applicantEmail,
  positionApplied,
  applicationId,
  hasCv,
}: {
  applicantName: string;
  applicantEmail: string;
  positionApplied: string;
  applicationId: number;
  hasCv: boolean;
}): Promise<boolean> {
  if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
    console.warn("[Email] SMTP or admin email not configured, skipping notification");
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Cogie Care Services" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Application — ${applicantName} for ${positionApplied}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1B2A4A; padding: 24px 40px; }
    .header h1 { color: #D4A853; font-size: 18px; margin: 0; }
    .body { padding: 32px 40px; }
    .body h2 { color: #1B2A4A; font-size: 18px; margin: 0 0 16px; }
    .body p { color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0 0 12px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 10px 14px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { font-weight: 600; color: #1B2A4A; width: 140px; }
    td:last-child { color: #4a5568; }
    .badge { display: inline-block; background: #D4A853; color: #1B2A4A; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .footer { background: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #718096; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Application Received</h1>
    </div>
    <div class="body">
      <h2>A new job application has been submitted.</h2>
      <table>
        <tr><td>Applicant</td><td>${applicantName}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${applicantEmail}" style="color: #D4A853;">${applicantEmail}</a></td></tr>
        <tr><td>Position</td><td>${positionApplied}</td></tr>
        <tr><td>Submitted</td><td>${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td></tr>
        <tr><td>CV Attached</td><td>${hasCv ? '<span class="badge">Yes</span>' : "No"}</td></tr>
        <tr><td>Application ID</td><td>#${applicationId}</td></tr>
      </table>
      <p>Log in to the admin dashboard to review the full application details and update the status.</p>
    </div>
    <div class="footer">
      <p>Cogie Care Services — Automated Notification</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });
    console.log(`[Email] Admin notification sent to ${ADMIN_EMAIL} for application #${applicationId}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send admin notification:", err);
    return false;
  }
}
