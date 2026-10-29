import { describe, expect, it, vi } from "vitest";
import type { TaskSourceFile } from "@/shared/lib/code-runners";
import { loadTaskSection } from "./taskCatalog";
import { getTaskFiles } from "./taskFiles";

describe("react curriculum data", () => {
  it("loads without running the starter code of tasks", async () => {
    // Starters are unfinished on purpose: the Redux Toolkit task ships a store with no reducers.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.resetModules();
    await import("../curriculum/react/data/tasksData");

    const messages = consoleError.mock.calls.map((args) => args.map(String).join(" "));
    consoleError.mockRestore();
    expect(messages.filter((message) => message.includes("valid reducer"))).toEqual([]);
  });

  it("keeps the starter and the reference of every task as source code", async () => {
    const tasks = await loadTaskSection("react");
    const hasCode = (files: TaskSourceFile[]): boolean =>
      files.some((file) => Boolean(file.code?.trim()));

    const withoutStarter = tasks.filter((task) => !hasCode(getTaskFiles(task, "candidate")));
    const withoutReference = tasks.filter(
      (task) => !hasCode(getTaskFiles(task, "solution")) && !task.solutions?.length
    );
    expect(withoutStarter.map((task) => task.id)).toEqual([]);
    expect(withoutReference.map((task) => task.id)).toEqual([]);
  });
});
