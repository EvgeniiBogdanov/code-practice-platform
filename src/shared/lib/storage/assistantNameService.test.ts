import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  DEFAULT_ASSISTANT_NAME,
  getAssistantNameFromLocalStorage,
  saveAssistantNameToLocalStorage,
  getAssistantNameFromDB,
  saveAssistantNameToDB,
  clearAssistantNameFromDB,
  LOCAL_STORAGE_ASSISTANT_NAME_KEY,
} from "./assistantNameService";
import * as dbModule from "./db";

describe("assistantNameService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("localStorage", () => {
    it("returns default name when nothing stored", () => {
      expect(getAssistantNameFromLocalStorage()).toBe(DEFAULT_ASSISTANT_NAME);
    });

    it("saves and retrieves custom assistant name", () => {
      saveAssistantNameToLocalStorage("Джарвис");
      expect(getAssistantNameFromLocalStorage()).toBe("Джарвис");
    });

    it("removes key from localStorage when setting default name or empty string", () => {
      saveAssistantNameToLocalStorage("Джарвис");
      saveAssistantNameToLocalStorage(DEFAULT_ASSISTANT_NAME);
      expect(localStorage.getItem(LOCAL_STORAGE_ASSISTANT_NAME_KEY)).toBeNull();

      saveAssistantNameToLocalStorage("Джарвис");
      saveAssistantNameToLocalStorage("   ");
      expect(localStorage.getItem(LOCAL_STORAGE_ASSISTANT_NAME_KEY)).toBeNull();
    });
  });

  describe("IndexedDB", () => {
    it("reads from db and updates localStorage cache", async () => {
      vi.spyOn(dbModule, "dbGet").mockResolvedValueOnce({
        key: "assistant_custom_name",
        value: "Пятница",
        updatedAt: Date.now(),
      });

      const name = await getAssistantNameFromDB();
      expect(name).toBe("Пятница");
      expect(getAssistantNameFromLocalStorage()).toBe("Пятница");
    });

    it("falls back to localStorage when dbGet returns null", async () => {
      vi.spyOn(dbModule, "dbGet").mockResolvedValueOnce(null);
      saveAssistantNameToLocalStorage("ЛокальныйБот");

      const name = await getAssistantNameFromDB();
      expect(name).toBe("ЛокальныйБот");
    });

    it("saves custom name to db and localStorage", async () => {
      const putSpy = vi.spyOn(dbModule, "dbPut").mockResolvedValueOnce("assistant_custom_name");

      await saveAssistantNameToDB("Робо-Кодер");
      expect(putSpy).toHaveBeenCalledWith(
        dbModule.STORES.META,
        expect.objectContaining({
          key: "assistant_custom_name",
          value: "Робо-Кодер",
        })
      );
      expect(getAssistantNameFromLocalStorage()).toBe("Робо-Кодер");
    });

    it("deletes custom name from db when saving default name", async () => {
      const deleteSpy = vi.spyOn(dbModule, "dbDelete").mockResolvedValueOnce(undefined);

      await saveAssistantNameToDB(DEFAULT_ASSISTANT_NAME);
      expect(deleteSpy).toHaveBeenCalledWith(dbModule.STORES.META, "assistant_custom_name");
      expect(getAssistantNameFromLocalStorage()).toBe(DEFAULT_ASSISTANT_NAME);
    });

    it("clears custom name from db and localStorage", async () => {
      const deleteSpy = vi.spyOn(dbModule, "dbDelete").mockResolvedValueOnce(undefined);
      saveAssistantNameToLocalStorage("Джарвис");

      await clearAssistantNameFromDB();
      expect(deleteSpy).toHaveBeenCalledWith(dbModule.STORES.META, "assistant_custom_name");
      expect(getAssistantNameFromLocalStorage()).toBe(DEFAULT_ASSISTANT_NAME);
    });
  });
});
