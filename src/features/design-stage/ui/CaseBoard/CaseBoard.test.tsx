import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDesignCaseStore, type ReferenceBoard } from "@/entities/design-case";
import { CaseBoard, type CaseBoardView } from "./CaseBoard";

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
  UiBoardViewer: ({
    label,
    value,
    highlightedIds = [],
  }: {
    label: string;
    value: { nodes: readonly unknown[] };
    highlightedIds?: readonly string[];
  }): React.JSX.Element => (
    <div role="img" aria-label={label}>
      cards: {value.nodes.length}, new: {highlightedIds.join(",")}
    </div>
  ),
}));

const REFERENCE: ReferenceBoard = {
  board: { nodes: [{ id: "api", x: 0, y: 0, text: "API" }], edges: [] },
  highlightedIds: ["api"],
};

const EDITOR = { name: "Редактор: Моя схема" };

const renderBoard = (
  caseId: string,
  view: CaseBoardView = "mine",
  onViewChange: (view: CaseBoardView) => void = vi.fn()
): ReturnType<typeof render> =>
  render(
    <CaseBoard
      caseId={caseId}
      view={view}
      onViewChange={onViewChange}
      reference={REFERENCE}
      referenceHint="Эталон к этапу «Архитектура»"
    />
  );

describe("CaseBoard", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {}, boards: {}, revisions: {} });
  });

  it("saves what is drawn under the case", () => {
    renderBoard("shop");
    expect(screen.getByRole("button", EDITOR)).toHaveTextContent("cards: 0");

    fireEvent.click(screen.getByRole("button", EDITOR));

    expect(screen.getByRole("button", EDITOR)).toHaveTextContent("cards: 1");
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

    renderBoard("chat");
    expect(screen.getByRole("button", EDITOR)).toHaveTextContent("cards: 0");
  });

  it("starts over after the case is reset", () => {
    useDesignCaseStore.getState().setBoard("shop", {
      nodes: [{ id: "n1", x: 0, y: 0, text: "A" }],
      edges: [],
    });
    renderBoard("shop");
    expect(screen.getByRole("button", EDITOR)).toHaveTextContent("cards: 1");

    act(() => useDesignCaseStore.getState().resetCase("shop"));

    expect(screen.getByRole("button", EDITOR)).toHaveTextContent("cards: 0");
  });

  it("drops a save made by the editor that a reset has replaced", () => {
    const { rerender } = renderBoard("shop");
    const oldEditor = screen.getByRole("button", EDITOR);

    act(() => useDesignCaseStore.getState().resetCase("shop"));
    rerender(
      <CaseBoard
        caseId="shop"
        view="mine"
        onViewChange={vi.fn()}
        reference={REFERENCE}
        referenceHint=""
      />
    );
    // The replaced editor flushes its last change as it closes: it must not bring the board back.
    fireEvent.click(oldEditor);

    expect(useDesignCaseStore.getState().boards["shop"]).toBeUndefined();
  });

  it("explains that one scheme grows through all the stages", () => {
    renderBoard("shop");
    expect(screen.getByText(/Одна схема на весь кейс/)).toBeInTheDocument();
  });

  it("switches between the learner's scheme and the reference", () => {
    const onViewChange = vi.fn();
    renderBoard("shop", "mine", onViewChange);
    expect(screen.queryByRole("img", { name: "Эталонная схема" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Эталон" }));

    expect(onViewChange).toHaveBeenCalledWith("reference");
  });

  it("shows the reference of the stage with what it adds, keeping the editor mounted", () => {
    renderBoard("shop", "reference");

    expect(screen.getByRole("img", { name: "Эталонная схема" })).toHaveTextContent(
      "cards: 1, new: api"
    );
    expect(screen.getByText("Эталон к этапу «Архитектура»")).toBeInTheDocument();
    // Hidden, not unmounted: the undo history of the learner's scheme survives a look at the reference.
    expect(screen.getByRole("button", { ...EDITOR, hidden: true })).not.toBeVisible();
  });
});
