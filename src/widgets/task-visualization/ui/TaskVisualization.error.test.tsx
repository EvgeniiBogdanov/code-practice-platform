import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TaskVisualization } from "./TaskVisualization";

vi.mock("../lib/load-algorithm-lab", () => ({
  loadAlgorithmLab: () => Promise.reject(new Error("Module unavailable")),
}));

afterEach(() => vi.restoreAllMocks());

it("shows an actionable error when the lazy module cannot load", async () => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  render(<TaskVisualization taskId="algo35" solution="" isFullscreen={false} />);
  expect(screen.getByRole("status", { name: "Загрузка визуализации" })).toBeInTheDocument();
  expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось загрузить визуализацию");
  expect(screen.getByRole("button", { name: "Перезагрузить страницу" })).toBeEnabled();
});
