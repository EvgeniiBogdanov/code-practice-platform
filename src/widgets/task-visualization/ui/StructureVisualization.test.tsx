import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { getAlgorithmDefinition, parseAlgorithmInput } from "@/entities/algorithm-trace";
import { AlgorithmLab } from "./AlgorithmLab";

vi.mock("@/shared/ui/NumberScene", () => ({
  NumberScene: (): never => {
    throw new Error("Structured scenes must work without WebGL");
  },
}));
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  );
});
afterEach(() => vi.unstubAllGlobals());

const ids = [
  ...Array.from({ length: 17 }, (_, i) => `algo${i + 18}`),
  ...Array.from({ length: 5 }, (_, i) => `algo${i + 40}`),
];
it.each(ids)("supports %s in fullscreen, with seeking and no WebGL dependency", (id) => {
  const definition = getAlgorithmDefinition(id)!;
  const preset = definition.examples[0];
  const parsed = parseAlgorithmInput(definition, preset.input, preset.parameter ?? "");
  if (!parsed.ok) throw new Error(parsed.error);
  const steps = definition.build(parsed.input);
  render(<AlgorithmLab taskId={id} solution="return result;" isFullscreen />);
  expect(
    screen.getByRole("separator", { name: "Разделитель визуализации и кода" })
  ).toBeInTheDocument();
  const slider = screen.getByRole("slider", { name: "Шаг алгоритма" });
  fireEvent.change(slider, { target: { value: slider.getAttribute("max") } });
  expect(screen.getByRole("heading", { name: steps.at(-1)!.title })).toBeVisible();
  expect(screen.getByLabelText("Результат алгоритма")).toHaveTextContent(
    JSON.stringify(steps.at(-1)!.result)
  );
  const player = screen.getByRole("group", { name: /Проигрыватель алгоритма/ });
  fireEvent.keyDown(player, { key: "Home" });
  expect(slider).toHaveValue("0");
  fireEvent.keyDown(player, { key: "ArrowRight" });
  expect(slider).toHaveValue("1");
});

it("keeps the previous frame on malformed structured input and resets after valid apply", () => {
  render(<AlgorithmLab taskId="algo24" solution="return 0;" />);
  fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
  const input = screen.getByRole("textbox", { name: "Дерево JSON" });
  fireEvent.change(input, { target: { value: "[1,null,null,2]" } });
  fireEvent.click(screen.getByRole("button", { name: "Применить" }));
  expect(screen.getByRole("alert")).toHaveTextContent("родителя");
  expect(screen.getByRole("slider")).toHaveValue("1");
  fireEvent.change(input, { target: { value: "[1,null,2,3]" } });
  fireEvent.click(screen.getByRole("button", { name: "Применить" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("slider")).toHaveValue("0");
});

it("isolates two structural players and preserves steps on fullscreen changes", () => {
  const props = { solution: "return result;" };
  const { rerender } = render(
    <>
      <AlgorithmLab {...props} taskId="algo21" />
      <AlgorithmLab {...props} taskId="algo44" />
    </>
  );
  const players = screen.getAllByRole("group", { name: /Проигрыватель алгоритма/ });
  fireEvent.click(within(players[0]).getByRole("button", { name: "Следующий шаг" }));
  expect(within(players[0]).getByRole("slider")).toHaveValue("1");
  expect(within(players[1]).getByRole("slider")).toHaveValue("0");
  rerender(
    <>
      <AlgorithmLab {...props} taskId="algo21" isFullscreen />
      <AlgorithmLab {...props} taskId="algo44" />
    </>
  );
  expect(
    within(screen.getAllByRole("group", { name: /Проигрыватель алгоритма/ })[0]).getByRole("slider")
  ).toHaveValue("1");
});
