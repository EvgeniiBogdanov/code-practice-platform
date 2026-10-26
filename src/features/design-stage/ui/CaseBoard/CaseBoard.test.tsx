import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDesignCaseStore } from "@/entities/design-case";
import { CaseBoard } from "./CaseBoard";

vi.mock("@/shared/ui/UiBoardEditor", () => ({
  UiBoardEditor: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: { nodes: readonly unknown[] };
    onChange: (board: {
      nodes: { id: string; x: number; y: number; text: string }[];
      edges: [];
    }) => void;
  }): React.JSX.Element => (
    <button
      type="button"
      aria-label={`Редактор: ${label}`}
      onClick={() => onChange({ nodes: [{ id: "n1", x: 1, y: 2, text: "API" }], edges: [] })}
    >
      cards: {value.nodes.length}
    </button>
  ),
}));

describe("CaseBoard", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {}, boards: {}, revisions: {} });
  });

  it("saves what is drawn under the case", () => {
    render(<CaseBoard caseId="shop" />);
    expect(screen.getByRole("button", { name: "Редактор: Схема решения" })).toHaveTextContent(
      "cards: 0"
    );

    fireEvent.click(screen.getByRole("button", { name: "Редактор: Схема решения" }));

    expect(screen.getByRole("button", { name: "Редактор: Схема решения" })).toHaveTextContent(
      "cards: 1"
    );
    expect(useDesignCaseStore.getState().boards["shop"]).toEqual({
      nodes: [{ id: "n1", x: 1, y: 2, text: "API" }],
      edges: [],
    });
  });

  it("shows the board saved earlier for this case only", () => {
    useDesignCaseStore.getState().setBoard("shop", {
      nodes: [
        { id: "n1", x: 0, y: 0, text: "A" },
        { id: "n2", x: 9, y: 9, text: "B" },
      ],
      edges: [],
    });

    render(<CaseBoard caseId="chat" />);
    expect(screen.getByRole("button", { name: "Редактор: Схема решения" })).toHaveTextContent(
      "cards: 0"
    );
  });

  it("starts over after the case is reset", () => {
    useDesignCaseStore.getState().setBoard("shop", {
      nodes: [{ id: "n1", x: 0, y: 0, text: "A" }],
      edges: [],
    });
    render(<CaseBoard caseId="shop" />);
    expect(screen.getByRole("button", { name: "Редактор: Схема решения" })).toHaveTextContent(
      "cards: 1"
    );

    act(() => useDesignCaseStore.getState().resetCase("shop"));

    expect(screen.getByRole("button", { name: "Редактор: Схема решения" })).toHaveTextContent(
      "cards: 0"
    );
  });

  it("drops a save made by the editor that a reset has replaced", () => {
    const { rerender } = render(<CaseBoard caseId="shop" />);
    const oldEditor = screen.getByRole("button", { name: "Редактор: Схема решения" });

    act(() => useDesignCaseStore.getState().resetCase("shop"));
    rerender(<CaseBoard caseId="shop" />);
    // The replaced editor flushes its last change as it closes: it must not bring the board back.
    fireEvent.click(oldEditor);

    expect(useDesignCaseStore.getState().boards["shop"]).toBeUndefined();
  });

  it("explains that one scheme grows through all the stages", () => {
    render(<CaseBoard caseId="shop" />);
    expect(screen.getByText(/Одна схема на весь кейс/)).toBeInTheDocument();
  });
});
