/**
 * Language Detector & Capability Resolver
 */

import { LanguageId, LanguageCapabilities } from "./languageTypes";
import { LANGUAGES, LANGUAGE_BY_EXTENSION } from "./languageRegistry";

export function getLanguageId(filepath = "main.jsx"): LanguageId {
  // An editor without a file yet keeps JavaScript features.
  if (!filepath || typeof filepath !== "string") return "javascript";
  const extension = filepath.toLowerCase().trim().split(".").pop() ?? "";
  return LANGUAGE_BY_EXTENSION.get(extension) ?? "plaintext";
}

export function getLanguageCapabilities(languageId: LanguageId): LanguageCapabilities {
  return { languageId, ...(LANGUAGES[languageId] ?? LANGUAGES.plaintext).capabilities };
}
