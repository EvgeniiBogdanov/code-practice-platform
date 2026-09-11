import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { getAlgorithmDefinition, parseAlgorithmInput } from "@/entities/algorithm-trace";
import { AlgorithmLab } from "./AlgorithmLab";

vi.mock("@/shared/ui/NumberScene", () => ({
  NumberScene: ({ onUnavailable }: { readonly onUnavailable: () => void }) => (
    <button onClick={onUnavailable}>Lose WebGL</button>
  ),
}));
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  );
});
afterEach(() => vi.unstubAllGlobals());

it.each([
  "algo4",
  "algo5",
  "algo6",
  "algo7",
  "algo8",
  "algo9",
  "algo10",
  "algo11",
  "algo12",
  "algo13",
  "algo14",
  "algo15",
  "algo16",
  "algo17",
  "algo39",
])("preserves %s panels and seeking in fullscreen after losing WebGL", (id) => {
  render(<AlgorithmLab taskId={id} solution="return result;" isFullscreen />);
  expect(
    screen.getByRole("separator", { name: "Разделитель визуализации и кода" })
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Lose WebGL" }));
  const slider = screen.getByRole("slider", { name: "Шаг алгоритма" });
  fireEvent.change(slider, { target: { value: slider.getAttribute("max") } });
  const definition = getAlgorithmDefinition(id)!;
  const preset = definition.examples[0];
  const parsed = parseAlgorithmInput(definition, preset.input, preset.parameter ?? "");
  if (!parsed.ok) throw new Error(parsed.error);
  const last = definition.build(parsed.input).at(-1)!;
  expect(screen.getByRole("heading", { name: last.title })).toBeVisible();
  last.panels?.forEach((panel) =>
    expect(screen.getByRole("region", { name: panel.label })).toBeVisible()
  );
  expect(screen.getByRole("list", { name: "Массив по индексам" })).toBeVisible();
  fireEvent.keyDown(screen.getByRole("group", { name: /Проигрыватель алгоритма/ }), {
    key: "Home",
  });
  expect(slider).toHaveValue("0");
  fireEvent.click(screen.getByRole("button", { name: "Повторить 3D" }));
  expect(screen.getByRole("button", { name: "Lose WebGL" })).toBeVisible();
});

it("accepts a second string, preserves the last valid trace on error, and resets on apply", () => {
  render(<AlgorithmLab taskId="algo5" solution="return true;" />);
  fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
  fireEvent.change(screen.getByRole("textbox", { name: "t" }), {
    target: { value: "я" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Применить" }));
  expect(screen.getByRole("alert")).toHaveTextContent("ASCII");
  expect(screen.getByRole("slider")).toHaveValue("1");
  fireEvent.change(screen.getByRole("textbox", { name: "Строка s" }), { target: { value: "ab" } });
  fireEvent.change(screen.getByRole("textbox", { name: "t" }), {
    target: { value: "ba" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Применить" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("slider")).toHaveValue("0");
});
