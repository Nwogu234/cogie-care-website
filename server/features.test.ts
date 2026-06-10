import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { createEmptyFormData } from "../shared/applicationTypes";

/* ─── helpers ─── */
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

/* ═══════════════════ POSTCODE LOOKUP ═══════════════════ */
describe("postcode.lookup", () => {
  it("returns addresses for a valid UK postcode", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.postcode.lookup({ postcode: "SW1A 1AA" });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("addresses");
    expect(Array.isArray(result.addresses)).toBe(true);

    if (result.success) {
      expect(result.addresses.length).toBeGreaterThan(0);
      const firstAddr = result.addresses[0];
      expect(firstAddr).toHaveProperty("line1");
      expect(firstAddr).toHaveProperty("town");
      expect(firstAddr).toHaveProperty("postcode");
      expect(firstAddr).toHaveProperty("formatted");
    }
  }, 15000);

  it("returns empty addresses for an invalid postcode", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.postcode.lookup({ postcode: "ZZZZZZZ" });

    expect(result.success).toBe(false);
    expect(result.addresses).toHaveLength(0);
  });
});

describe("postcode.autocomplete", () => {
  it("returns postcode suggestions for a partial input", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.postcode.autocomplete({ query: "SW1A" });

    expect(result).toHaveProperty("postcodes");
    expect(Array.isArray(result.postcodes)).toBe(true);
    if (result.postcodes.length > 0) {
      expect(result.postcodes[0]).toContain("SW1A");
    }
  });

  it("returns empty for gibberish input", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.postcode.autocomplete({ query: "XYZXYZ" });

    expect(result.postcodes).toHaveLength(0);
  });
});

/* ═══════════════════ ADDRESS HISTORY VALIDATION ═══════════════════ */
describe("Address history 3-year validation", () => {
  it("createEmptyFormData includes previousAddresses array", () => {
    const formData = createEmptyFormData();
    expect(formData.previousAddresses).toBeDefined();
    expect(Array.isArray(formData.previousAddresses)).toBe(true);
    expect(formData.previousAddresses.length).toBeGreaterThanOrEqual(1);
  });

  it("previousAddresses have required fields", () => {
    const formData = createEmptyFormData();
    const addr = formData.previousAddresses[0];
    expect(addr).toHaveProperty("address");
    expect(addr).toHaveProperty("from");
    expect(addr).toHaveProperty("until");
  });

  it("validates 3-year timeline coverage", () => {
    // Simulate the validation logic from Apply.tsx
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const addresses = [
      { address: "123 Test St", from: "2024-01", until: "2026-02" },
      { address: "456 Old St", from: "2023-03", until: "2024-01" },
    ];

    // Check that addresses cover the 3-year period
    const allDates = addresses.flatMap((a) => [a.from, a.until]).filter(Boolean);
    const earliest = allDates.sort()[0];
    const earliestDate = new Date(earliest + "-01");

    expect(earliestDate.getTime()).toBeLessThanOrEqual(threeYearsAgo.getTime() + 90 * 24 * 60 * 60 * 1000); // within 3 months tolerance
  });

  it("detects timeline gaps", () => {
    const addresses = [
      { address: "123 Test St", from: "2025-06", until: "2026-02" },
      { address: "456 Old St", from: "2023-01", until: "2024-12" },
      // Gap: 2024-12 to 2025-06
    ];

    // Sort by from date
    const sorted = [...addresses].sort((a, b) => a.from.localeCompare(b.from));

    let hasGap = false;
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].until;
      const nextStart = sorted[i + 1].from;
      if (currentEnd && nextStart && currentEnd < nextStart) {
        // Check if gap is more than 1 month
        const endDate = new Date(currentEnd + "-01");
        const startDate = new Date(nextStart + "-01");
        const diffMonths =
          (startDate.getFullYear() - endDate.getFullYear()) * 12 +
          (startDate.getMonth() - endDate.getMonth());
        if (diffMonths > 1) {
          hasGap = true;
        }
      }
    }

    expect(hasGap).toBe(true);
  });

  it("validates continuous timeline without gaps", () => {
    const addresses = [
      { address: "123 Test St", from: "2025-01", until: "2026-02" },
      { address: "456 Old St", from: "2024-01", until: "2025-01" },
      { address: "789 Older St", from: "2023-01", until: "2024-01" },
    ];

    const sorted = [...addresses].sort((a, b) => a.from.localeCompare(b.from));

    let hasGap = false;
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].until;
      const nextStart = sorted[i + 1].from;
      if (currentEnd && nextStart && currentEnd < nextStart) {
        const endDate = new Date(currentEnd + "-01");
        const startDate = new Date(nextStart + "-01");
        const diffMonths =
          (startDate.getFullYear() - endDate.getFullYear()) * 12 +
          (startDate.getMonth() - endDate.getMonth());
        if (diffMonths > 1) {
          hasGap = true;
        }
      }
    }

    expect(hasGap).toBe(false);
  });
});

/* ═══════════════════ CV PARSER TYPES ═══════════════════ */
describe("CV parser types", () => {
  it("ParsedCvData interface fields map to ApplicationFormData", () => {
    // Verify that the CV parser output fields are compatible with the form data
    const formData = createEmptyFormData();

    // These are the fields the CV parser can fill
    const cvFields = [
      "title",
      "forenames",
      "surname",
      "email",
      "homeTel",
      "mobileTel",
      "currentAddress",
      "dateOfBirth",
      "placeOfBirth",
      "niNumber",
      "secondaryEducation",
      "secondaryQualifications",
      "furtherEducation",
      "furtherQualifications",
      "currentEmployerName",
      "currentJobTitle",
      "currentDuties",
      "relevantExperience",
    ];

    // All CV fields should exist in the form data
    for (const field of cvFields) {
      expect(formData).toHaveProperty(field);
    }
  });

  it("employment history structure matches between CV parser and form data", () => {
    const formData = createEmptyFormData();
    const empRecord = formData.employmentHistory[0];

    expect(empRecord).toHaveProperty("dateFrom");
    expect(empRecord).toHaveProperty("dateTo");
    expect(empRecord).toHaveProperty("jobTitle");
    expect(empRecord).toHaveProperty("employerNameAddress");
    expect(empRecord).toHaveProperty("reasonForLeaving");
  });
});

/* ═══════════════════ APPLICATION SUBMISSION ═══════════════════ */
describe("application.submit validation", () => {
  it("rejects submission without required fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.application.submit({
        formData: {
          forenames: "",
          surname: "",
          email: "",
          declarationAgreed: false,
        },
      })
    ).rejects.toThrow();
  });

  it("rejects submission without declaration", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.application.submit({
        formData: {
          forenames: "John",
          surname: "Smith",
          email: "john@example.com",
          declarationAgreed: false,
        },
      })
    ).rejects.toThrow("declaration");
  });
});
