/**
 * Express route for handling CV/resume file uploads.
 * Stores files in S3 and returns the URL.
 */
import { Router, Request, Response } from "express";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

const cvUploadRouter = Router();

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

cvUploadRouter.post("/api/cv/upload", async (req: Request, res: Response) => {
  try {
    const contentType = req.headers["content-type"] || "";

    // Handle base64 JSON upload
    if (contentType.includes("application/json")) {
      const { fileName, fileData, mimeType } = req.body;

      if (!fileName || !fileData || !mimeType) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: fileName, fileData, mimeType",
        });
        return;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(mimeType)) {
        res.status(400).json({
          success: false,
          error: "Invalid file type. Accepted formats: PDF, DOC, DOCX, TXT",
        });
        return;
      }

      // Validate extension
      const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        res.status(400).json({
          success: false,
          error: "Invalid file extension. Accepted: .pdf, .doc, .docx, .txt",
        });
        return;
      }

      // Decode base64
      const buffer = Buffer.from(fileData, "base64");

      // Validate size
      if (buffer.length > MAX_FILE_SIZE) {
        res.status(400).json({
          success: false,
          error: "File too large. Maximum size is 10MB.",
        });
        return;
      }

      // Upload to S3 with unique key
      const uniqueId = nanoid(12);
      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileKey = `cv-uploads/${uniqueId}-${safeFileName}`;

      const { url } = await storagePut(fileKey, buffer, mimeType);

      console.log("[CV Upload] File uploaded:", fileName, "→", fileKey);

      res.json({
        success: true,
        url,
        fileName,
        fileKey,
      });
      return;
    }

    res.status(400).json({
      success: false,
      error: "Unsupported content type. Send JSON with base64-encoded file data.",
    });
  } catch (error) {
    console.error("[CV Upload] Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload CV. Please try again.",
    });
  }
});

export { cvUploadRouter };
