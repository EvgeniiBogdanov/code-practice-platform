import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CandidateTab } from "./CandidateTab";
import { Task } from "@/entities/task";
import { broadcastSyncEvent } from "@/shared/lib/storage";

vi.mock("@/features/code-editor", () => ({
  CodeEditor: ({ code }: { code: string }) => <div data-testid="code-editor">{code}</div>,
}));

vi.mock("@/features/code-runner", () => ({
  JsConsole: () => <div data-testid="js-console" />,
  ReactLivePreview: () => <div data-testid="live-preview" />,
}));

vi.mock("../../model/use-fullscreen-navigation", () => ({
  useFullscreenNavigation: () => ({
    isFullscreenTransitioning: false,
    handleToggleFullscreen: vi.fn(),
    preloadFullscreen: vi.fn(),
  }),
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

    expect(screen.getByTestId("code-editor")).toHaveTextContent("function initialCode() {}");

    act(() => {
      broadcastSyncEvent("SOLUTIONS_CLEARED", { all: true });
    });

    expect(screen.getByTestId("code-editor")).toHaveTextContent("function initialCode() {}");
  });

  it("resets files when SOLUTIONS_CLEARED matches current task ID", async () => {
    render(<CandidateTab task={mockTask} />);

    act(() => {
      broadcastSyncEvent("SOLUTIONS_CLEARED", { taskIds: ["test-task-1"] });
    });

    expect(screen.getByTestId("code-editor")).toHaveTextContent("function initialCode() {}");
  });
});
