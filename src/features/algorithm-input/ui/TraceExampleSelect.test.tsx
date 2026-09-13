import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AlgorithmDefinition } from "@/entities/algorithm-trace";
import { TraceExampleSelect } from "./TraceExampleSelect";

const mockDefinition: AlgorithmDefinition = {
  pattern: "Two Pointers",
  invariant: "Invariant description",
  complexity: "O(n)",
  inputKind: "array",
  build: () => [],
  examples: [
    {
      id: "task1",
      label: "Пример 1: [1, 2, 3]",
      input: "1, 2, 3",
      isTask: true,
    },
    {
      id: "task2",
      label: "Пример 2: [4, 5, 6]",
      input: "4, 5, 6",
      isTask: true,
    },
    {
      id: "extra1",
      label: "Пустой массив",
      input: "[]",
    },
  ],
};

describe("TraceExampleSelect", () => {
  it("renders optgroups for task examples and additional examples", () => {
    const onExample = vi.fn();
    render(
      <TraceExampleSelect definition={mockDefinition} exampleId="task1" onExample={onExample} />
    );

    const select = screen.getByRole("combobox", { name: "Пример" });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("task1");

    const taskGroup = screen.getByRole("group", { name: "Примеры из задачи" });
    expect(taskGroup).toBeInTheDocument();
    expect(taskGroup.querySelectorAll("option")).toHaveLength(2);

    const extraGroup = screen.getByRole("group", { name: "Дополнительные примеры" });
    expect(extraGroup).toBeInTheDocument();
    expect(extraGroup.querySelectorAll("option")).toHaveLength(1);
  });

  it("calls onExample when user selects a different option", () => {
    const onExample = vi.fn();
    render(
      <TraceExampleSelect definition={mockDefinition} exampleId="task1" onExample={onExample} />
    );

    const select = screen.getByRole("combobox", { name: "Пример" });
    fireEvent.change(select, { target: { value: "task2" } });

    expect(onExample).toHaveBeenCalledWith("task2");
  });

  it("shows custom example option when exampleId is custom", () => {
    const onExample = vi.fn();
    render(
      <TraceExampleSelect definition={mockDefinition} exampleId="custom" onExample={onExample} />
    );

    const customOption = screen.getByRole("option", { name: "Свой пример" });
    expect(customOption).toBeInTheDocument();
    expect(customOption).toHaveValue("custom");
  });
});
