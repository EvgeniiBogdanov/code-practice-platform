import { describe, it, expect } from "vitest";
import {
  sanitizeAssistantName,
  ASSISTANT_NAME_INPUT_PATTERN,
} from "./sanitize-assistant-name";

describe("sanitizeAssistantName", () => {
  it("allows valid Cyrillic and Latin names", () => {
    expect(sanitizeAssistantName("Джарвис")).toBe("Джарвис");
    expect(sanitizeAssistantName("Jarvis 2.0")).toBe("Jarvis 2.0");
    expect(sanitizeAssistantName("Робо-Кодер")).toBe("Робо-Кодер");
    expect(sanitizeAssistantName("Bot_1")).toBe("Bot_1");
  });

  it("strips HTML tags, scripts and angle brackets", () => {
    expect(sanitizeAssistantName("<script>alert(1)</script>")).toBe("alert1");
    expect(sanitizeAssistantName("<img src=x onerror=alert(1)>")).toBe("");
    expect(sanitizeAssistantName("<b>Привет</b>")).toBe("Привет");
  });

  it("strips quotes, backslashes, semicolons and special characters", () => {
    expect(sanitizeAssistantName(`"Hello" 'World' \`test\``)).toBe("Hello World test");
    expect(sanitizeAssistantName("user\\name; DROP TABLE")).toBe("username DROP TABLE");
    expect(sanitizeAssistantName("name@#$%^&*()")).toBe("name");
  });

  it("removes control characters and zero-width characters", () => {
    expect(sanitizeAssistantName("\u0000\u001F\u200B\uFEFFБот")).toBe("Бот");
  });

  it("removes leading spaces and collapses consecutive spaces", () => {
    expect(sanitizeAssistantName("   Джарвис")).toBe("Джарвис");
    expect(sanitizeAssistantName("Мой    Любимый    Бот")).toBe("Мой Любимый Бот");
  });

  it("enforces maximum length", () => {
    const longName = "A".repeat(50);
    expect(sanitizeAssistantName(longName, 30)).toHaveLength(30);
  });

  it("handles empty strings", () => {
    expect(sanitizeAssistantName("")).toBe("");
  });
});

describe("ASSISTANT_NAME_INPUT_PATTERN", () => {
  const regex = new RegExp(ASSISTANT_NAME_INPUT_PATTERN);

  it("matches valid names", () => {
    expect(regex.test("Джарвис")).toBe(true);
    expect(regex.test("Мой Бот")).toBe(true);
    expect(regex.test("Jarvis-2.0")).toBe(true);
    expect(regex.test("Bot_1")).toBe(true);
  });

  it("rejects dangerous or invalid names", () => {
    expect(regex.test("<script>")).toBe(false);
    expect(regex.test("alert('xss')")).toBe(false);
    expect(regex.test("Name;")).toBe(false);
    expect(regex.test("Name ")).toBe(false);
  });
});
