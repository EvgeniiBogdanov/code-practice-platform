import { describe, expect, it } from "vitest";
import { describeCompletionKind } from "./completionKind";

describe("describeCompletionKind", () => {
  it.each([
    ["method", "function", "purple", "Метод"],
    ["function", "function", "purple", "Функция"],
    ["const", "variable", "blue", "Константа"],
    ["property", "property", "cyan", "Свойство"],
    ["interface", "type", "amber", "Интерфейс"],
    ["keyword", "keyword", "pink", "Ключевое слово"],
    ["snippet", "snippet", "green", "Сниппет"],
    ["import", "module", "gray", "Импорт"],
  ])("%s", (kind, icon, tone, label) => {
    expect(describeCompletionKind(kind)).toEqual({ icon, tone, label });
  });

  it("falls back to a neutral symbol for unknown and missing kinds", () => {
    expect(describeCompletionKind("something-new")).toMatchObject({ icon: "symbol", tone: "gray" });
    expect(describeCompletionKind()).toMatchObject({ icon: "symbol" });
  });
});
