import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { TaskVisualization } from "..";

vi.mock("@/shared/ui/NumberScene", () => ({
  NumberScene: () => <canvas data-testid="number-scene" />,
}));

const solution = "const moveZeroes = (nums) => {\n  let slow = 0;\n  return nums;\n};";

const dialogMethods = ["close", "showModal"] as const;
const dialogDescriptors = dialogMethods.map((name) =>
  Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name)
);
beforeAll(() => {
  for (const name of dialogMethods)
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: vi.fn(),
    });
});
afterAll(() => {
  dialogMethods.forEach((name, index) => {
    const descriptor = dialogDescriptors[index];
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
  });
});

describe("TaskVisualization public widget", () => {
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
  afterEach(() => vi.unstubAllGlobals());

  it("runs independent sessions without a router or task-page context", async () => {
    render(
      <>
        <TaskVisualization taskId="algo35" solution={solution} />
        <TaskVisualization taskId="algo2" solution="return true;" />
      </>
    );
    await screen.findAllByTestId("number-scene");
    const players = screen.getAllByRole("group", { name: /Проигрыватель алгоритма/ });
    fireEvent.click(within(players[0]).getByRole("button", { name: "Следующий шаг" }));
    expect(within(players[0]).getByRole("slider")).toHaveValue("1");
    expect(within(players[1]).getByRole("slider")).toHaveValue("0");
    fireEvent.change(within(players[0]).getByRole("textbox", { name: "Массив" }), {
      target: { value: "[0, 7]" },
    });
    expect(within(players[1]).getByRole("textbox", { name: "Строка" })).toHaveValue("A,b a");
  });

  it("keeps the scene and step when expanding and collapsing locally", async () => {
    render(<TaskVisualization taskId="algo35" solution={solution} />);
    const scene = await screen.findByTestId("number-scene");
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    fireEvent.click(screen.getByRole("button", { name: "Развернуть на весь экран" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByTestId("number-scene")).toBe(scene);
    expect(screen.getByRole("slider")).toHaveValue("1");
    fireEvent.click(screen.getByRole("button", { name: "Свернуть" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("number-scene")).toBe(scene);
    expect(screen.getByRole("slider")).toHaveValue("1");
  });

  it("lets the fullscreen page own navigation without opening another modal", async () => {
    const exit = vi.fn();
    render(
      <TaskVisualization
        taskId="algo35"
        solution={solution}
        isFullscreen
        onToggleFullscreen={exit}
      />
    );
    await screen.findByTestId("number-scene");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Свернуть" }));
    expect(exit).toHaveBeenCalledOnce();
  });

  it("shows an unsupported state and initializes the next supported task", async () => {
    const { rerender } = render(<TaskVisualization taskId="unknown" solution="" />);
    expect(
      await screen.findByText("Для этой задачи визуализация пока не добавлена.")
    ).toBeVisible();
    rerender(<TaskVisualization taskId="algo35" solution={solution} />);
    await screen.findByTestId("number-scene");
    expect(screen.getByRole("slider")).toHaveValue("0");
  });
});
