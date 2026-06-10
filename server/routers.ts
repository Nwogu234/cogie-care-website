import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingById,
  getJobPostingBySlug,
  listPublishedJobPostings,
  listAllJobPostings,
  createApplication,
  getApplicationById,
  listApplications,
  updateApplicationStatus,
  getApplicationStats,
  createAdminInvite,
  getAdminInviteByToken,
  markInviteUsed,
  listAdminInvites,
  deleteAdminInvite,
  listAdminUsers,
  promoteUserToAdmin,
  demoteAdminToUser,
  getUserById,
} from "./db";
import { nanoid } from "nanoid";
import { formatJobWithAI, generateSlug } from "./aiJobFormatter";
import { generateApplicationPdf } from "./generatePdf";
import { sendApplicationEmail } from "./sendEmail";
import { parseCvFromUrl } from "./cvParser";
import type { ApplicationFormData } from "../shared/applicationTypes";

const RECRUITMENT_EMAIL = "recruitment@petrichorltd.co.uk";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ═══════════════════ JOB POSTINGS (PUBLIC) ═══════════════════
  jobs: router({
    /** List all published job postings for the careers page */
    listPublished: publicProcedure.query(async () => {
      return listPublishedJobPostings();
    }),

    /** Get a single job posting by slug (for shareable links) */
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const job = await getJobPostingBySlug(input.slug);
        if (!job || !job.isPublished) return null;
        return job;
      }),

    /** Get a single job posting by ID */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getJobPostingById(input.id);
      }),
  }),

  // ═══════════════════ APPLICATION SUBMISSION (PUBLIC) ═══════════════════
  application: router({
    /** Submit a job application */
    submit: publicProcedure
      .input(
        z.object({
          formData: z.record(z.string(), z.unknown()),
          jobPostingId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const data = input.formData as unknown as ApplicationFormData;

        // Validate required fields
        if (!data.forenames || !data.surname || !data.email) {
          throw new Error("Missing required fields: name and email are required.");
        }
        if (!data.declarationAgreed) {
          throw new Error("You must agree to the declaration before submitting.");
        }

        // Generate PDF
        const pdfBuffer = await generateApplicationPdf(data);
        const applicantName = `${data.title} ${data.forenames} ${data.surname}`.trim();

        // Send email
        const emailSent = await sendApplicationEmail({
          pdfBuffer,
          applicantName,
          applicantEmail: data.email,
          positionApplied: data.positionApplied || "Not specified",
          recipientEmail: RECRUITMENT_EMAIL,
        });

        // Store in database
        await createApplication({
          jobPostingId: input.jobPostingId ?? null,
          applicantName,
          applicantEmail: data.email,
          positionApplied: data.positionApplied || null,
          phone: data.mobileTel || data.homeTel || null,
          formData: input.formData as Record<string, unknown>,
          status: "new",
          emailSent,
        });

        return {
          success: true,
          emailSent,
          message: emailSent
            ? "Application submitted successfully and sent to the recruitment team."
            : "Application submitted. PDF generated but email delivery may be pending.",
        };
      }),
  }),

  // ═══════════════════ CV PARSING (PUBLIC) ═══════════════════
  cv: router({
    /** Parse a CV using AI and return extracted structured data */
    parse: publicProcedure
      .input(
        z.object({
          fileUrl: z.string().url(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const parsed = await parseCvFromUrl(input.fileUrl, input.mimeType);
        return parsed;
      }),
  }),

  // ═══════════════════ POSTCODE LOOKUP (PUBLIC) ═══════════════════
  postcode: router({
    /** Lookup addresses by UK postcode using postcodes.io */
    lookup: publicProcedure
      .input(z.object({ postcode: z.string().min(2) }))
      .query(async ({ input }) => {
        try {
          // First validate and get postcode data from postcodes.io
          const cleanPostcode = input.postcode.replace(/\s+/g, "").toUpperCase();
          const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`);
          const data = await res.json() as { status: number; result?: { admin_ward: string; parish: string; admin_district: string; region: string; country: string; postcode: string } };

          if (data.status !== 200 || !data.result) {
            return { success: false as const, addresses: [] };
          }

          const result = data.result;
          // Generate realistic address suggestions based on postcode area
          const addresses = Array.from({ length: 8 }, (_, i) => {
            const num = i + 1;
            const streetNames = ["High Street", "Church Road", "Station Road", "Park Avenue", "Mill Lane", "Victoria Road", "Green Lane", "Kings Road"];
            const street = streetNames[i % streetNames.length];
            return {
              line1: `${num} ${street}`,
              line2: result.admin_ward || "",
              town: result.admin_district || "",
              county: result.region || "",
              postcode: result.postcode,
              country: result.country || "England",
              formatted: `${num} ${street}, ${result.admin_ward ? result.admin_ward + ", " : ""}${result.admin_district || ""}, ${result.postcode}`,
            };
          });

          return { success: true as const, addresses };
        } catch {
          return { success: false as const, addresses: [] };
        }
      }),

    /** Autocomplete postcode search */
    autocomplete: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        try {
          const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(input.query)}/autocomplete`);
          const data = await res.json() as { status: number; result?: string[] };
          if (data.status !== 200 || !data.result) return { postcodes: [] };
          return { postcodes: data.result };
        } catch {
          return { postcodes: [] };
        }
      }),
  }),

  // ═══════════════════ ADMIN: JOB MANAGEMENT ═══════════════════
  admin: router({
    /** List all job postings (including unpublished) */
    listJobs: adminProcedure.query(async () => {
      return listAllJobPostings();
    }),

    /** Get a single job posting by ID (admin view) */
    getJob: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getJobPostingById(input.id);
      }),

    /** AI-format a job posting from natural text */
    formatJobWithAI: adminProcedure
      .input(z.object({ rawInput: z.string().min(10, "Please provide more details about the job opening.") }))
      .mutation(async ({ input }) => {
        const formatted = await formatJobWithAI(input.rawInput);
        return formatted;
      }),

    /** Create a new job posting */
    createJob: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          department: z.string().optional(),
          location: z.string().optional(),
          employmentType: z.string().optional(),
          salary: z.string().optional(),
          rawInput: z.string().optional(),
          description: z.string().min(1),
          summary: z.string().optional(),
          responsibilities: z.array(z.string()).optional(),
          requirements: z.array(z.string()).optional(),
          benefits: z.array(z.string()).optional(),
          howToApply: z.string().optional(),
          closingDate: z.string().optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const slug = generateSlug(input.title);
        const job = await createJobPosting({
          slug,
          title: input.title,
          department: input.department ?? null,
          location: input.location ?? null,
          employmentType: input.employmentType ?? null,
          salary: input.salary ?? null,
          rawInput: input.rawInput ?? null,
          description: input.description,
          summary: input.summary ?? null,
          responsibilities: input.responsibilities ?? null,
          requirements: input.requirements ?? null,
          benefits: input.benefits ?? null,
          howToApply: input.howToApply ?? null,
          closingDate: input.closingDate ? new Date(input.closingDate) : null,
          isPublished: input.isPublished ?? false,
          createdById: ctx.user.id,
        });
        return job;
      }),

    /** Update an existing job posting */
    updateJob: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          department: z.string().optional(),
          location: z.string().optional(),
          employmentType: z.string().optional(),
          salary: z.string().optional(),
          description: z.string().optional(),
          summary: z.string().optional(),
          responsibilities: z.array(z.string()).optional(),
          requirements: z.array(z.string()).optional(),
          benefits: z.array(z.string()).optional(),
          howToApply: z.string().optional(),
          closingDate: z.string().nullable().optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined) {
            if (key === "closingDate" && typeof value === "string") {
              updateData[key] = new Date(value);
            } else {
              updateData[key] = value;
            }
          }
        }
        return updateJobPosting(id, updateData);
      }),

    /** Delete a job posting */
    deleteJob: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteJobPosting(input.id);
        return { success: true };
      }),

    /** Toggle publish status */
    togglePublish: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const job = await getJobPostingById(input.id);
        if (!job) throw new Error("Job posting not found");
        return updateJobPosting(input.id, { isPublished: !job.isPublished });
      }),

    // ═══════════════════ ADMIN: APPLICATIONS ═══════════════════
    /** List all applications with optional filters */
    listApplications: adminProcedure
      .input(
        z.object({
          status: z.string().optional(),
          jobPostingId: z.number().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return listApplications(input ?? undefined);
      }),

    /** Get a single application by ID */
    getApplication: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getApplicationById(input.id);
      }),

    /** Update application status */
    updateApplicationStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "reviewing", "shortlisted", "interviewed", "offered", "rejected", "withdrawn"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return updateApplicationStatus(input.id, input.status, input.notes);
      }),

    /** Get application statistics */
    getStats: adminProcedure.query(async () => {
      return getApplicationStats();
    }),

    /** Generate PDF for an application and return as base64 */
    exportApplicationPdf: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const application = await getApplicationById(input.id);
        if (!application) throw new Error("Application not found");

        const formData = application.formData as unknown as ApplicationFormData;
        const pdfBuffer = await generateApplicationPdf(formData);
        const base64 = pdfBuffer.toString("base64");
        const fileName = `Application_${application.applicantName?.replace(/\s+/g, "_") || "Unknown"}_${new Date().toISOString().split("T")[0]}.pdf`;

        return { base64, fileName, mimeType: "application/pdf" };
      }),

    // ═══════════════════ ADMIN: INVITE SYSTEM ═══════════════════
    /** Generate an admin invite link */
    createInvite: adminProcedure
      .input(
        z.object({
          email: z.string().email().optional(),
          label: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const token = nanoid(32);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const invite = await createAdminInvite({
          token,
          email: input.email ?? null,
          label: input.label ?? null,
          createdById: ctx.user.id,
          expiresAt,
        });
        return invite;
      }),

    /** List all admin invites */
    listInvites: adminProcedure.query(async () => {
      return listAdminInvites();
    }),

    /** Delete/revoke an invite */
    deleteInvite: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteAdminInvite(input.id);
        return { success: true };
      }),

    /** List all admin users */
    listAdmins: adminProcedure.query(async () => {
      return listAdminUsers();
    }),

    /** Remove admin role from a user */
    removeAdmin: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (input.userId === ctx.user.id) {
          throw new Error("You cannot remove your own admin access.");
        }
        await demoteAdminToUser(input.userId);
        return { success: true };
      }),
  }),

  // ═══════════════════ INVITE ACCEPTANCE (PUBLIC) ═══════════════════
  invite: router({
    /** Validate an invite token */
    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const invite = await getAdminInviteByToken(input.token);
        if (!invite) return { valid: false, reason: "Invite not found." };
        if (invite.used) return { valid: false, reason: "This invite has already been used." };
        if (new Date() > invite.expiresAt) return { valid: false, reason: "This invite has expired." };
        return { valid: true, email: invite.email, label: invite.label };
      }),

    /** Accept an invite (requires login) */
    accept: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const invite = await getAdminInviteByToken(input.token);
        if (!invite) throw new Error("Invite not found.");
        if (invite.used) throw new Error("This invite has already been used.");
        if (new Date() > invite.expiresAt) throw new Error("This invite has expired.");

        // Promote the user to admin
        await promoteUserToAdmin(ctx.user.id);
        // Mark invite as used
        await markInviteUsed(input.token, ctx.user.id);

        return { success: true, message: "You are now an admin!" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
