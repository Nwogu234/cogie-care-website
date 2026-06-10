/**
 * AI-powered job post formatter.
 * Takes natural language input about a job opening and formats it
 * into a professional Indeed-style job posting.
 */
import { invokeLLM } from "./_core/llm";

export interface FormattedJobPost {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salary: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  howToApply: string;
}

export async function formatJobWithAI(rawInput: string): Promise<FormattedJobPost> {
  const systemPrompt = `You are a professional HR content writer for Cogie Care Services, a supported accommodation provider based in North London (Petrichor Healthcare Provisions Ltd). Your job is to take informal, natural language descriptions of job openings and format them into professional, compelling job postings similar to those found on Indeed or Reed.

Key guidelines:
- Write in a professional but warm tone that reflects the caring nature of the organisation
- Structure the content clearly with distinct sections
- Make the role sound appealing while being honest about requirements
- Include relevant care sector terminology where appropriate
- If the user doesn't mention a location, default to "13 Woodland Road, London N9 8RP"
- If employment type isn't specified, default to "Full-time"
- Always include a line about DBS checks being required for care roles
- Mention that the role involves working with vulnerable adults
- Be specific about responsibilities and requirements based on the input
- Generate a compelling 1-2 sentence summary for listing cards

Return your response as a valid JSON object with these exact fields:
{
  "title": "Job title",
  "department": "Department name",
  "location": "Full address",
  "employmentType": "Full-time / Part-time / Contract / etc.",
  "salary": "Salary range or description",
  "summary": "1-2 sentence compelling summary for listing cards",
  "description": "Full HTML-formatted job description with proper paragraphs. Use <p>, <strong>, <ul>, <li> tags for formatting. This should be the main body text introducing the role and the company.",
  "responsibilities": ["Array of key responsibilities as strings"],
  "requirements": ["Array of requirements/qualifications as strings"],
  "benefits": ["Array of benefits offered"],
  "howToApply": "Instructions on how to apply"
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: rawInput },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "job_posting",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Job title" },
            department: { type: "string", description: "Department name" },
            location: { type: "string", description: "Full address" },
            employmentType: { type: "string", description: "Employment type" },
            salary: { type: "string", description: "Salary range" },
            summary: { type: "string", description: "1-2 sentence summary" },
            description: { type: "string", description: "HTML formatted description" },
            responsibilities: {
              type: "array",
              items: { type: "string" },
              description: "Key responsibilities",
            },
            requirements: {
              type: "array",
              items: { type: "string" },
              description: "Requirements and qualifications",
            },
            benefits: {
              type: "array",
              items: { type: "string" },
              description: "Benefits offered",
            },
            howToApply: { type: "string", description: "How to apply instructions" },
          },
          required: [
            "title",
            "department",
            "location",
            "employmentType",
            "salary",
            "summary",
            "description",
            "responsibilities",
            "requirements",
            "benefits",
            "howToApply",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("AI did not return valid content");
  }

  const parsed = JSON.parse(content) as FormattedJobPost;

  // Validate essential fields
  if (!parsed.title || !parsed.description) {
    throw new Error("AI response missing required fields (title or description)");
  }

  return parsed;
}

/**
 * Generate a URL-friendly slug from a job title.
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  // Add a short random suffix to ensure uniqueness
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}
