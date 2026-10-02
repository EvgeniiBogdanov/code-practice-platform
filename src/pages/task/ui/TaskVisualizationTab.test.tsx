import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
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

const dialogMethods = ["close", "showModal"] as const;
const descriptors = dialogMethods.map((name) =>
  Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name)
);
beforeAll(() => {
  dialogMethods.forEach((name) => {
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: vi.fn(),
    });
  });
});
afterAll(() => {
  dialogMethods.forEach((name, index) => {
    const descriptor = descriptors[index];
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
  });
});

describe("task visualization lifecycle", () => {
  beforeEach(() => {
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

  it("keeps the canvas, current step and draft through fullscreen and collapse", async () => {
    render(<TaskVisualizationTab task={task} active />);
    const scene = await screen.findByTestId("number-scene");
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Массив" }), {
      target: { value: "[1, 0, 2]" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Развернуть на весь экран" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true"));
    expect(screen.getByTestId("number-scene")).toBe(scene);
    expect(screen.getByRole("slider")).toHaveValue("1");
    expect(screen.getByRole("textbox", { name: "Массив" })).toHaveValue("[1, 0, 2]");
    fireEvent.click(screen.getByRole("button", { name: /^Свернуть$/ }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("number-scene")).toBe(scene);
    expect(screen.getByRole("slider")).toHaveValue("1");
    expect(screen.getByRole("textbox", { name: "Массив" })).toHaveValue("[1, 0, 2]");
  });
});
