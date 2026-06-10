import { describe, expect, it, vi } from "vitest";
import { generateSlug } from "./aiJobFormatter";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ═══════════════════ SLUG GENERATION ═══════════════════
describe("generateSlug", () => {
  it("converts a title to a lowercase hyphenated slug with random suffix", () => {
    const slug = generateSlug("Support Worker");
    expect(slug).toMatch(/^support-worker-[a-z0-9]{6}$/);
  });

  it("removes special characters", () => {
    const slug = generateSlug("Night Shift Worker (Weekends)");
    expect(slug).toMatch(/^night-shift-worker-weekends-[a-z0-9]{6}$/);
  });

  it("handles multiple spaces and hyphens", () => {
    const slug = generateSlug("Senior   Support  Worker");
    expect(slug).toMatch(/^senior-support-worker-[a-z0-9]{6}$/);
  });

  it("generates unique slugs for the same title", () => {
    const slug1 = generateSlug("Care Worker");
    const slug2 = generateSlug("Care Worker");
    expect(slug1).not.toBe(slug2);
  });

  it("handles empty-ish titles gracefully", () => {
    const slug = generateSlug("   ");
    // Should still produce a slug with the random suffix (may have leading hyphens)
    expect(slug).toMatch(/^-*[a-z0-9]{6}$/);
  });
});

// ═══════════════════ PUBLIC JOBS ROUTER ═══════════════════
describe("jobs.listPublished", () => {
  function createPublicContext(): TrpcContext {
    return {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
  }

  it("returns an array (may be empty if no published jobs)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.jobs.listPublished();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("jobs.getBySlug", () => {
  function createPublicContext(): TrpcContext {
    return {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
  }

  it("returns null for a non-existent slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.jobs.getBySlug({ slug: "non-existent-job-xyz" });
    expect(result).toBeNull();
  });
});

// ═══════════════════ ADMIN ROUTE PROTECTION ═══════════════════
describe("admin route protection", () => {
  it("rejects unauthenticated access to admin.listJobs", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.listJobs()).rejects.toThrow();
  });

  it("rejects non-admin users from admin.listJobs", async () => {
    const ctx: TrpcContext = {
      user: {
        id: 2,
        openId: "regular-user",
        email: "user@example.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.listJobs()).rejects.toThrow();
  });

  it("rejects unauthenticated access to admin.getStats", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.getStats()).rejects.toThrow();
  });
});
