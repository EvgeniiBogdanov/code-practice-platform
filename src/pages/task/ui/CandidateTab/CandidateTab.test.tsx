import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CandidateTab } from "./CandidateTab";
import { Task } from "@/entities/task";
import { broadcastSyncEvent } from "@/shared/lib/storage";

vi.mock("@/features/code-editor", () => ({
  CodeEditor: ({ code, bottomConsole }: { code: string; bottomConsole?: React.ReactNode }) => (
    <div data-testid="code-editor">
      {code}
      {bottomConsole}
    </div>
  ),
}));

vi.mock("@/features/code-runner", () => ({
  JsConsole: () => <div data-testid="js-console" />,
  ReactLivePreview: () => <div data-testid="live-preview" />,
}));

const mockTask: Task = {
  id: "test-task-1",
  section: "javascript",
  title: "Test Task",
  difficulty: "easy",
  desc: "Test description",
  candidate: "function initialCode() {}",
  solution: "function solution() {}",
};

describe("CandidateTab - SOLUTIONS_CLEARED Sync Event", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resets files to initial template code when SOLUTIONS_CLEARED is broadcast with all: true", async () => {
    render(<CandidateTab task={mockTask} />);

    expect(await screen.findByTestId("code-editor")).toHaveTextContent("function initialCode() {}");

    act(() => {
      broadcastSyncEvent("SOLUTIONS_CLEARED", { all: true });
    });

    expect(screen.getByTestId("code-editor")).toHaveTextContent("function initialCode() {}");
  });

  it("resets files when SOLUTIONS_CLEARED matches current task ID", async () => {
    render(<CandidateTab task={mockTask} />);
    await screen.findByTestId("code-editor");

    act(() => {
      broadcastSyncEvent("SOLUTIONS_CLEARED", { taskIds: ["test-task-1"] });
    });

    expect(screen.getByTestId("code-editor")).toHaveTextContent("function initialCode() {}");
  });
});

describe("CandidateTab - test panels", () => {
  const drillTask: Task = {
    ...mockTask,
    id: "drill-task-1",
    rawTests: 'test("works", () => {});',
  };

  it("shows the drill tests panel instead of the console for a task with runtime tests", async () => {
    render(<CandidateTab task={drillTask} />);
    expect(await screen.findByRole("region", { name: "Проверка решения" })).toBeInTheDocument();
    expect(screen.queryByTestId("js-console")).not.toBeInTheDocument();
  });

  it("keeps the console for a task without tests", async () => {
    render(<CandidateTab task={mockTask} />);
    expect(await screen.findByTestId("js-console")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Проверка решения" })).not.toBeInTheDocument();
  });

  it("does not treat TypeScript type tests as drill tests", async () => {
    render(<CandidateTab task={{ ...drillTask, id: "ts-1", section: "typescript" }} />);
    await screen.findByTestId("code-editor");
    expect(screen.queryByText(/Решение должно\s+экспортировать/)).not.toBeInTheDocument();
  });
});
