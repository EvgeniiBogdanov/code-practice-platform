import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpenEditorPage } from "./OpenEditorPage";
import type { Task } from "@/entities/task";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockTask: Task = {
  id: "algo35",
  section: "algorithms",
  title: "Move zeroes",
  difficulty: "easy",
  desc: "Move all zeroes to the end",
  candidate: "function moveZeroes() {}",
  solution: "function moveZeroes(nums) { return nums; }",
};

vi.mock("@/entities/task/catalog", () => ({
  useTaskById: (taskId: string) => ({
    task: taskId === "algo35" ? mockTask : null,
    isLoading: false,
  }),
}));

vi.mock("@/widgets/task-visualization", () => ({
  TaskVisualization: ({
    taskId,
    isFullscreen,
    onToggleFullscreen,
  }: {
    taskId: string;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
  }) => (
    <div data-testid="mock-algorithm-lab" data-fullscreen={String(isFullscreen)}>
      <span>Task: {taskId}</span>
      <button onClick={onToggleFullscreen}>Exit Fullscreen</button>
    </div>
  ),
}));

describe("OpenEditorPage - visualization tab", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders TaskVisualization with isFullscreen=true when tab is visualization", () => {
    render(<OpenEditorPage taskId="algo35" section="algorithms" tab="visualization" />);

    const lab = screen.getByTestId("mock-algorithm-lab");
    expect(lab).toBeInTheDocument();
    expect(lab).toHaveAttribute("data-fullscreen", "true");
    expect(screen.getByText("Task: algo35")).toBeInTheDocument();
  });

  it("navigates back to /algorithms/$taskId?tab=visualization when exiting fullscreen", () => {
    render(<OpenEditorPage taskId="algo35" section="algorithms" tab="visualization" />);

    const exitBtn = screen.getByRole("button", { name: "Exit Fullscreen" });
    fireEvent.click(exitBtn);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/algorithms/$taskId",
      params: { taskId: "algo35" },
      search: { tab: "visualization" },
      resetScroll: false,
    });
  });

  it("navigates back to /algorithms/$taskId?tab=visualization on Escape key", () => {
    render(<OpenEditorPage taskId="algo35" section="algorithms" tab="visualization" />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/algorithms/$taskId",
      params: { taskId: "algo35" },
      search: { tab: "visualization" },
      resetScroll: false,
    });
  });
});
