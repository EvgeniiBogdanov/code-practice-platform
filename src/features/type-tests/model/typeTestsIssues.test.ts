import { describe, expect, it } from "vitest";
import { buildIssueUrl } from "./typeTestsIssues";

describe("buildIssueUrl", () => {
  it("prefills the title and facts about the task, but never code", () => {
    const url = new URL(
      buildIssueUrl(
        { taskId: "typescript-7", testsHash: "abc12345", details: "Тест «x» не проходит" },
        "Решение верное, а тест — нет"
      )
    );
    expect(url.pathname).toBe("/EvgeniiBogdanov/code-practice-platform/issues/new");
    expect(url.searchParams.get("title")).toBe("[typescript-7] Решение верное, а тест — нет");
    const body = url.searchParams.get("body") ?? "";
    expect(body).toContain("Хеш тестов: abc12345");
    expect(body).toContain("Тест «x» не проходит");
    expect(body).toContain("вставьте сюда");
  });
});
