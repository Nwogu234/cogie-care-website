/**
 * AI-powered CV/Resume parser.
 * Extracts structured data from uploaded CV files using LLM.
 */
import { invokeLLM } from "./_core/llm";
import type { ApplicationFormData } from "../shared/applicationTypes";

export interface ParsedCvData {
  // Personal details
  title?: string;
  forenames?: string;
  surname?: string;
  email?: string;
  homeTel?: string;
  mobileTel?: string;
  currentAddress?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  niNumber?: string;

  // Education
  secondaryEducation?: string;
  secondaryQualifications?: string;
  furtherEducation?: string;
  furtherQualifications?: string;

  // Employment
  currentEmployerName?: string;
  currentJobTitle?: string;
  currentDuties?: string;
  employmentHistory?: Array<{
    dateFrom: string;
    dateTo: string;
    jobTitle: string;
    employerNameAddress: string;
    reasonForLeaving: string;
  }>;

  // Training
  trainingCourses?: Array<{
    course: string;
    dateObtained: string;
    expiryDate: string;
  }>;
  professionalMemberships?: string;

  // Skills
  relevantExperience?: string;

  // Additional
  validDrivingLicence?: "yes" | "no";

  // References
  referees?: Array<{
    name: string;
    surname: string;
    titlePosition: string;
    organization: string;
    email: string;
    telephone: string;
  }>;
}

const CV_PARSE_PROMPT = `You are an expert HR assistant. Analyze the following CV/resume content and extract structured information.

Extract as much information as possible from the CV. For dates, use YYYY-MM-DD format where possible, or YYYY-MM if only month/year is available.

Return a JSON object with the following structure (only include fields that you can confidently extract from the CV):

{
  "title": "Mr/Mrs/Miss/Ms if determinable",
  "forenames": "first name(s)",
  "surname": "last name",
  "email": "email address",
  "homeTel": "home phone",
  "mobileTel": "mobile phone",
  "currentAddress": "full current address",
  "dateOfBirth": "YYYY-MM-DD",
  "placeOfBirth": "city/town",
  "niNumber": "national insurance number",
  "secondaryEducation": "secondary school name and dates",
  "secondaryQualifications": "GCSEs, O-levels etc",
  "furtherEducation": "university/college name and dates",
  "furtherQualifications": "degrees, diplomas, A-levels etc",
  "currentEmployerName": "current or most recent employer",
  "currentJobTitle": "current or most recent job title",
  "currentDuties": "description of current/recent duties",
  "employmentHistory": [
    {
      "dateFrom": "YYYY-MM-DD or YYYY-MM",
      "dateTo": "YYYY-MM-DD or YYYY-MM or Present",
      "jobTitle": "role title",
      "employerNameAddress": "company name and address",
      "reasonForLeaving": "reason if stated"
    }
  ],
  "trainingCourses": [
    {
      "course": "course name",
      "dateObtained": "YYYY-MM-DD or YYYY-MM",
      "expiryDate": ""
    }
  ],
  "professionalMemberships": "any professional body memberships",
  "relevantExperience": "summary of key skills and experience relevant to care/support work",
  "validDrivingLicence": "yes or no if mentioned",
  "referees": [
    {
      "name": "first name",
      "surname": "last name",
      "titlePosition": "their job title",
      "organization": "their organization",
      "email": "their email",
      "telephone": "their phone"
    }
  ]
}

IMPORTANT:
- Only include fields where you have reasonable confidence in the extracted data
- For employment history, list from most recent to oldest
- If the CV mentions care work, support work, or health sector experience, emphasize this in relevantExperience
- Do not fabricate or guess information that is not in the CV
- Return ONLY valid JSON, no markdown formatting`;

export async function parseCvWithAI(cvContent: string): Promise<ParsedCvData> {
  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: CV_PARSE_PROMPT },
        { role: "user", content: `Here is the CV/resume content to parse:\n\n${cvContent}` },
      ],
      response_format: { type: "json_object" },
    });

    const content = result.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      console.error("[CV Parser] No content in LLM response");
      return {};
    }

    // Clean the response - remove markdown code blocks if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleaned) as ParsedCvData;
    console.log("[CV Parser] Successfully parsed CV data:", Object.keys(parsed).length, "fields extracted");
    return parsed;
  } catch (error) {
    console.error("[CV Parser] Failed to parse CV:", error);
    return {};
  }
}

/**
 * Parse a CV file that's been uploaded to S3.
 * Downloads the file content and sends it to the AI parser.
 */
export async function parseCvFromUrl(fileUrl: string, mimeType: string): Promise<ParsedCvData> {
  try {
    // For PDF files, use the LLM's file_url capability
    if (mimeType === "application/pdf") {
      const result = await invokeLLM({
        messages: [
          { role: "system", content: CV_PARSE_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "file_url",
                file_url: {
                  url: fileUrl,
                  mime_type: "application/pdf",
                },
              },
              {
                type: "text",
                text: "Please parse this CV/resume and extract the structured information as described.",
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = result.choices[0]?.message?.content;
      if (!content || typeof content !== "string") {
        console.error("[CV Parser] No content in LLM response for PDF");
        return {};
      }

      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      return JSON.parse(cleaned) as ParsedCvData;
    }

    // For text-based files, download and parse as text
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download CV: ${response.status}`);
    }
    const text = await response.text();
    return parseCvWithAI(text);
  } catch (error) {
    console.error("[CV Parser] Failed to parse CV from URL:", error);
    return {};
  }
}
