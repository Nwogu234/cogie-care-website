import { eq, desc, and, sql, gt, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobPostings, applications, adminInvites, type InsertJobPosting, type InsertApplication, type InsertAdminInvite } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ═══════════════════ JOB POSTINGS ═══════════════════

export async function createJobPosting(data: InsertJobPosting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(jobPostings).values(data);
  const result = await db.select().from(jobPostings).where(eq(jobPostings.slug, data.slug)).limit(1);
  return result[0];
}

export async function updateJobPosting(id: number, data: Partial<InsertJobPosting>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobPostings).set(data).where(eq(jobPostings.id, id));
  const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1);
  return result[0];
}

export async function deleteJobPosting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(jobPostings).where(eq(jobPostings.id, id));
}

export async function getJobPostingById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getJobPostingBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(jobPostings).where(eq(jobPostings.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function listPublishedJobPostings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(jobPostings)
    .where(eq(jobPostings.isPublished, true))
    .orderBy(desc(jobPostings.createdAt));
}

export async function listAllJobPostings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
}

// ═══════════════════ APPLICATIONS ═══════════════════

export async function createApplication(data: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(applications).values(data);
  return result;
}

export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  return result[0] ?? null;
}

export async function listApplications(filters?: { status?: string; jobPostingId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(applications.status, filters.status as any));
  }
  if (filters?.jobPostingId) {
    conditions.push(eq(applications.jobPostingId, filters.jobPostingId));
  }

  if (conditions.length > 0) {
    return db.select().from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.submittedAt));
  }

  return db.select().from(applications).orderBy(desc(applications.submittedAt));
}

export async function updateApplicationStatus(id: number, status: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Record<string, unknown> = { status };
  if (notes !== undefined) updateData.notes = notes;
  await db.update(applications).set(updateData).where(eq(applications.id, id));
  return getApplicationById(id);
}

export async function getApplicationStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const allApps = await db.select().from(applications);
  const stats = {
    total: allApps.length,
    new: allApps.filter(a => a.status === "new").length,
    reviewing: allApps.filter(a => a.status === "reviewing").length,
    shortlisted: allApps.filter(a => a.status === "shortlisted").length,
    interviewed: allApps.filter(a => a.status === "interviewed").length,
    offered: allApps.filter(a => a.status === "offered").length,
    rejected: allApps.filter(a => a.status === "rejected").length,
  };
  return stats;
}

// ═══════════════════ ADMIN INVITES ═══════════════════

export async function createAdminInvite(data: InsertAdminInvite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(adminInvites).values(data);
  const result = await db.select().from(adminInvites).where(eq(adminInvites.token, data.token)).limit(1);
  return result[0];
}

export async function getAdminInviteByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(adminInvites).where(eq(adminInvites.token, token)).limit(1);
  return result[0] ?? null;
}

export async function markInviteUsed(token: string, usedById: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(adminInvites).set({
    used: true,
    usedById,
    usedAt: new Date(),
  }).where(eq(adminInvites.token, token));
}

export async function listAdminInvites() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(adminInvites).orderBy(desc(adminInvites.createdAt));
}

export async function deleteAdminInvite(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(adminInvites).where(eq(adminInvites.id, id));
}

// ═══════════════════ ADMIN USERS ═══════════════════

export async function listAdminUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt));
}

export async function promoteUserToAdmin(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));
}

export async function demoteAdminToUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role: "user" }).where(eq(users.id, userId));
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0] ?? null;
}
