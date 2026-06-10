import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean as mysqlBoolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Job postings table.
 * Stores both the raw input text and the AI-formatted job post.
 */
export const jobPostings = mysqlTable("job_postings", {
  id: int("id").autoincrement().primaryKey(),
  /** URL-friendly slug for shareable links */
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  /** Job title */
  title: varchar("title", { length: 300 }).notNull(),
  /** Department or team */
  department: varchar("department", { length: 200 }),
  /** Location (e.g., "13 Woodland Road, N9 8RP") */
  location: varchar("location", { length: 300 }),
  /** Employment type: full-time, part-time, contract, etc. */
  employmentType: varchar("employmentType", { length: 100 }),
  /** Salary range or description */
  salary: varchar("salary", { length: 200 }),
  /** The raw natural text input by the admin */
  rawInput: text("rawInput"),
  /** AI-formatted job description (HTML) */
  description: text("description").notNull(),
  /** Short summary for listing cards */
  summary: text("summary"),
  /** Key responsibilities as JSON array of strings */
  responsibilities: json("responsibilities").$type<string[]>(),
  /** Requirements as JSON array of strings */
  requirements: json("requirements").$type<string[]>(),
  /** Benefits as JSON array of strings */
  benefits: json("benefits").$type<string[]>(),
  /** How to apply instructions */
  howToApply: text("howToApply"),
  /** Closing date for applications */
  closingDate: timestamp("closingDate"),
  /** Whether the posting is published and visible */
  isPublished: mysqlBoolean("isPublished").default(false).notNull(),
  /** Admin user who created this posting */
  createdById: int("createdById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

/**
 * Job applications table.
 * Stores submitted application form data and status.
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to the job posting (nullable for general applications) */
  jobPostingId: int("jobPostingId"),
  /** Applicant name */
  applicantName: varchar("applicantName", { length: 300 }).notNull(),
  /** Applicant email */
  applicantEmail: varchar("applicantEmail", { length: 320 }).notNull(),
  /** Position applied for */
  positionApplied: varchar("positionApplied", { length: 300 }),
  /** Phone number */
  phone: varchar("phone", { length: 50 }),
  /** Full form data as JSON */
  formData: json("formData").$type<Record<string, unknown>>().notNull(),
  /** Application status */
  status: mysqlEnum("status", ["new", "reviewing", "shortlisted", "interviewed", "offered", "rejected", "withdrawn"])
    .default("new")
    .notNull(),
  /** CV file URL stored in S3 */
  cvUrl: text("cvUrl"),
  /** CV original file name */
  cvFileName: varchar("cvFileName", { length: 500 }),
  /** Internal notes by admin */
  notes: text("notes"),
  /** Whether the email was sent successfully */
  emailSent: mysqlBoolean("emailSent").default(false).notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Admin invites table.
 * Stores invite tokens for inviting new admin members.
 */
export const adminInvites = mysqlTable("admin_invites", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique invite token */
  token: varchar("token", { length: 100 }).notNull().unique(),
  /** Email address the invite was sent to (optional, for tracking) */
  email: varchar("email", { length: 320 }),
  /** Name label for the invite */
  label: varchar("label", { length: 200 }),
  /** Admin user who created this invite */
  createdById: int("createdById").notNull(),
  /** Whether the invite has been used */
  used: mysqlBoolean("used").default(false).notNull(),
  /** User ID of the person who accepted the invite */
  usedById: int("usedById"),
  /** When the invite was used */
  usedAt: timestamp("usedAt"),
  /** Expiry date (invites expire after 7 days) */
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminInvite = typeof adminInvites.$inferSelect;
export type InsertAdminInvite = typeof adminInvites.$inferInsert;
