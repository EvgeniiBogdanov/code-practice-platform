import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "@/entities/task";
import { TaskVisualizationTab } from "./TaskVisualizationTab";

vi.mock("@/shared/ui/NumberScene", () => ({
  NumberScene: () => <canvas data-testid="number-scene" />,
}));

const task = {
  id: "algo35",
  section: "algorithms",
  title: "Move zeroes",
  solution: "const moveZeroes = (nums) => {\n  let slow = 0;\n  return nums;\n};",
} satisfies Task;

const mockHandleToggleFullscreen = vi.fn();

vi.mock("../model/use-fullscreen-navigation", () => ({
  useFullscreenNavigation: () => ({
    isFullscreenTransitioning: false,
    handleToggleFullscreen: mockHandleToggleFullscreen,
    preloadFullscreen: vi.fn(),
  }),
}));

describe("task visualization lifecycle", () => {
  beforeEach(() => {
    mockHandleToggleFullscreen.mockClear();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads on first activation and preserves the scene, draft and step across tabs", async () => {
    const { rerender } = render(<TaskVisualizationTab task={task} active={false} />);
    expect(screen.queryByTestId("number-scene")).not.toBeInTheDocument();
    rerender(<TaskVisualizationTab task={task} active />);
    const scene = await screen.findByTestId("number-scene");
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Массив" }), {
      target: { value: "[1, 0, 2]" },
    });
    rerender(<TaskVisualizationTab task={task} active={false} />);
    expect(scene).not.toBeVisible();
    rerender(<TaskVisualizationTab task={task} active />);
    expect(screen.getByTestId("number-scene")).toBe(scene);
    expect(screen.getByRole("slider")).toHaveValue("1");
    expect(screen.getByRole("textbox", { name: "Массив" })).toHaveValue("[1, 0, 2]");
  });

  it("calls handleToggleFullscreen when clicking expand button", async () => {
    render(<TaskVisualizationTab task={task} active />);
    await screen.findByTestId("number-scene");
    const expandBtn = screen.getByRole("button", { name: "Развернуть на весь экран" });
    fireEvent.click(expandBtn);
    expect(mockHandleToggleFullscreen).toHaveBeenCalledTimes(1);
  });
});
