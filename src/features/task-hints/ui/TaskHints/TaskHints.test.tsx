import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ALGO_HINTS } from "@/entities/task/curriculum/algorithms/data/algoHints";
import { TaskHints } from "./TaskHints";

describe("TaskHints", () => {
  it("reveals the hints one level at a time", async () => {
    render(<TaskHints section="algorithms" taskId="algo1" />);

    const toggle = await screen.findByRole("button", { name: /Подсказки/ });
    expect(toggle).toHaveTextContent("0/3");
    fireEvent.click(toggle);

    expect(screen.queryByText("Идея")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Показать идею" }));
    expect(screen.getByText("Идея")).toBeInTheDocument();
    expect(toggle).toHaveTextContent("1/3");
    expect(screen.queryByText("Ловушки и граничные случаи")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Показать ловушки" }));
    expect(screen.getByText("Ловушки и граничные случаи")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Показать план решения/ }));
    expect(screen.getByText("План решения")).toBeInTheDocument();
    expect(toggle).toHaveTextContent("3/3");
    expect(screen.queryByRole("button", { name: /Показать/ })).not.toBeInTheDocument();
    expect(ALGO_HINTS.algo1).toHaveLength(3);
  });
});
