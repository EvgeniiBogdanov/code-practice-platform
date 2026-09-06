/**
 * Regular expressions for assistant name validation and sanitization.
 */

// Matches complete HTML tags like <script>, <b>, <img ...>, etc.
export const HTML_TAGS_REGEX = /<[^>]*>/g;

// Matches control characters, null bytes, format characters and zero-width characters
export const CONTROL_CHARS_REGEX = /[\p{Cc}\p{Cf}]/gu;

// Matches any characters that are NOT Unicode letters, numbers, whitespace, hyphens, underscores, or dots
export const DANGEROUS_OR_INVALID_CHARS_REGEX = /[^\p{L}\p{N}\s\-_.]/gu;

// Matches leading whitespace
export const LEADING_SPACES_REGEX = /^\s+/;

// Matches two or more consecutive whitespace characters
export const CONSECUTIVE_SPACES_REGEX = /\s{2,}/g;

export const ASSISTANT_NAME_INPUT_PATTERN =
  "^[A-Za-zА-Яа-яЁё0-9\\-_.]+(?: [A-Za-zА-Яа-яЁё0-9\\-_.]+)*$";

/**
 * Sanitizes the assistant name input:
 * 1. Strips complete HTML tags (<script>, <b>, etc.).
 * 2. Strips dangerous and control characters (quotes, slashes, zero-width chars, brackets).
 * 3. Allows only letters, numbers, spaces, hyphens, underscores, and dots.
 * 4. Removes leading spaces.
 * 5. Collapses multiple consecutive spaces into a single space.
 * 6. Truncates to maxLength.
 */
export const sanitizeAssistantName = (value: string, maxLength: number = 30): string => {
  return value
    .replace(HTML_TAGS_REGEX, "")
    .replace(CONTROL_CHARS_REGEX, "")
    .replace(DANGEROUS_OR_INVALID_CHARS_REGEX, "")
    .replace(LEADING_SPACES_REGEX, "")
    .replace(CONSECUTIVE_SPACES_REGEX, " ")
    .slice(0, maxLength);
};
