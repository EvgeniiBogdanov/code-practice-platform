/**
 * Custom Assistant Name Storage Service
 */

import { dbGet, dbPut, dbDelete, STORES } from "./db";

export const DEFAULT_ASSISTANT_NAME = "Интервальный помощник";
export const META_ASSISTANT_NAME_KEY = "assistant_custom_name";
export const LOCAL_STORAGE_ASSISTANT_NAME_KEY = "code_practice_assistant_name";

export interface AssistantNameMetaRecord {
  key: string;
  value: string;
  updatedAt: number;
}

export function getAssistantNameFromLocalStorage(): string {
  if (typeof window === "undefined" || !window.localStorage) return DEFAULT_ASSISTANT_NAME;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_ASSISTANT_NAME_KEY);
    return raw?.trim() ? raw.trim() : DEFAULT_ASSISTANT_NAME;
  } catch {
    return DEFAULT_ASSISTANT_NAME;
  }
}

export function saveAssistantNameToLocalStorage(name: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const trimmed = name?.trim();
    if (!trimmed || trimmed === DEFAULT_ASSISTANT_NAME) {
      window.localStorage.removeItem(LOCAL_STORAGE_ASSISTANT_NAME_KEY);
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_ASSISTANT_NAME_KEY, trimmed);
    }
  } catch {
    // ignore
  }
}

export async function getAssistantNameFromDB(): Promise<string> {
  try {
    const record = await dbGet<AssistantNameMetaRecord>(STORES.META, META_ASSISTANT_NAME_KEY);
    if (record && typeof record.value === "string" && record.value.trim()) {
      const trimmed = record.value.trim();
      saveAssistantNameToLocalStorage(trimmed);
      return trimmed;
    }
  } catch (err) {
    console.error("[AssistantNameService] Error reading assistant name from IndexedDB:", err);
  }
  return getAssistantNameFromLocalStorage();
}

export async function saveAssistantNameToDB(name: string): Promise<void> {
  const trimmed = name?.trim() || DEFAULT_ASSISTANT_NAME;
  saveAssistantNameToLocalStorage(trimmed);
  try {
    if (trimmed === DEFAULT_ASSISTANT_NAME) {
      await dbDelete(STORES.META, META_ASSISTANT_NAME_KEY);
    } else {
      await dbPut(STORES.META, {
        key: META_ASSISTANT_NAME_KEY,
        value: trimmed,
        updatedAt: Date.now(),
      });
    }
  } catch (err) {
    console.error("[AssistantNameService] Error saving assistant name to IndexedDB:", err);
  }
}

export async function clearAssistantNameFromDB(): Promise<void> {
  saveAssistantNameToLocalStorage(DEFAULT_ASSISTANT_NAME);
  try {
    await dbDelete(STORES.META, META_ASSISTANT_NAME_KEY);
  } catch (err) {
    console.error("[AssistantNameService] Error clearing assistant name from IndexedDB:", err);
  }
}
