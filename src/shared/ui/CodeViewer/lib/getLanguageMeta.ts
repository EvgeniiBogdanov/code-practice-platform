import { LANGUAGE_MAP, DEFAULT_LANGUAGE_META } from "../const/languages";
import { LanguageMeta } from "../types";

export const getLanguageMeta = (rawLanguage?: string): LanguageMeta => {
  const normalized = (rawLanguage || "notepad").trim().toLowerCase();

  if (LANGUAGE_MAP[normalized]) {
    return LANGUAGE_MAP[normalized];
  }

  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return {
    ...DEFAULT_LANGUAGE_META,
    name: capitalized || "Notepad",
  };
};
