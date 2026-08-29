import { LanguageMeta } from "../types";

export const LANGUAGE_MAP: Record<string, LanguageMeta> = {
  notepad: { name: "Notepad", color: "var(--icon-file, #94a3b8)", isNotepad: true },
  text: { name: "Notepad", color: "var(--icon-file, #94a3b8)", isNotepad: true },
  plaintext: { name: "Notepad", color: "var(--icon-file, #94a3b8)", isNotepad: true },
  txt: { name: "Notepad", color: "var(--icon-file, #94a3b8)", isNotepad: true },
  none: { name: "Notepad", color: "var(--icon-file, #94a3b8)", isNotepad: true },
  jsx: { name: "React JSX", color: "#f59e0b", isNotepad: false },
  react: { name: "React JSX", color: "#f59e0b", isNotepad: false },
  tsx: { name: "React TSX", color: "#3178c6", isNotepad: false },
  ts: { name: "TypeScript", color: "#3178c6", isNotepad: false },
  typescript: { name: "TypeScript", color: "#3178c6", isNotepad: false },
  html: { name: "HTML", color: "#e34c26", isNotepad: false },
  htm: { name: "HTML", color: "#e34c26", isNotepad: false },
  css: { name: "CSS", color: "#38bdf8", isNotepad: false },
  scss: { name: "SCSS", color: "#38bdf8", isNotepad: false },
  less: { name: "LESS", color: "#38bdf8", isNotepad: false },
  json: { name: "JSON", color: "#a855f7", isNotepad: false },
  sql: { name: "SQL", color: "#00bcd4", isNotepad: false },
  bash: { name: "Shell", color: "#10b981", isNotepad: false },
  sh: { name: "Shell", color: "#10b981", isNotepad: false },
  shell: { name: "Shell", color: "#10b981", isNotepad: false },
  js: { name: "JavaScript", color: "#f59e0b", isNotepad: false },
  javascript: { name: "JavaScript", color: "#f59e0b", isNotepad: false },
};

export const DEFAULT_LANGUAGE_META: LanguageMeta = {
  name: "Notepad",
  color: "var(--icon-file, #94a3b8)",
  isNotepad: false,
};
