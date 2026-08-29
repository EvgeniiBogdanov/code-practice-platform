import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DB_NAME,
  DB_VERSION,
  STORES,
  isIndexedDBAvailable,
  requestPersistentStorage,
  getStorageEstimate,
} from "./db";

describe("IndexedDB Service (db.ts)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exports correct database name and schema version", () => {
    expect(DB_NAME).toBe("code_practice_platform_db");
    expect(DB_VERSION).toBe(4);
    expect(STORES).toEqual({
      SOLUTIONS: "solutions",
      PROGRESS: "progress",
      CHECKLIST: "checklist",
      META: "meta",
      REVIEWS: "reviews",
    });
  });

  it("checks IndexedDB availability gracefully", () => {
    const isAvail = isIndexedDBAvailable();
    expect(typeof isAvail).toBe("boolean");
  });

  it("handles requestPersistentStorage when navigator.storage is unavailable", async () => {
    const result = await requestPersistentStorage();
    expect(typeof result).toBe("boolean");
  });

  it("returns default storage estimate if API is not supported", async () => {
    const estimate = await getStorageEstimate();
    expect(estimate).toHaveProperty("usageMB");
    expect(estimate).toHaveProperty("quotaMB");
    expect(estimate).toHaveProperty("percentUsed");
  });
});
