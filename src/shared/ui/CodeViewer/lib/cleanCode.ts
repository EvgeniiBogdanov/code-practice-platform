/**
 * Normalizes line endings, strips only leading and trailing empty lines,
 * and preserves proper indentation for line 1 and subsequent lines.
 */
export const cleanCode = (rawCode?: string): string => {
  if (!rawCode || typeof rawCode !== "string") {
    return "";
  }

  let normalized = rawCode.replace(/\r\n/g, "\n");

  // Remove leading empty or whitespace-only lines, ensuring line 1 starts immediately
  normalized = normalized.replace(/^([ \t]*\n)+/, "");

  // Remove trailing whitespace and empty lines at the end of the block
  normalized = normalized.replace(/\s+$/, "");

  return normalized;
};
