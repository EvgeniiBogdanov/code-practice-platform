import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDesignCaseStore, type DesignCase, type RadioStageId } from "@/entities/design-case";
import { DesignCasePage } from "./DesignCasePage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("@/entities/task/catalog", () => ({
  useTaskSection: () => ({ tasks: [{ id: "sd-1", title: "Debounce" }] }),
}));
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
    value: { nodes: readonly { id: string }[] };
    highlightedIds?: readonly string[];
  }): React.JSX.Element => (
    <div role="img" aria-label={label}>
      shown: {value.nodes.map(({ id }) => id).join(",")}; new: {highlightedIds.join(",")}
    </div>
  ),
}));

const stageIds: RadioStageId[] = [
  "requirements",
  "architecture",
  "data-model",
  "interface",
  "optimizations",
];

const designCase: DesignCase = {
  id: "autocomplete",
  title: "Автокомплит",
  difficulty: "medium",
  summary: "Поиск с подсказками",
  production: "Что будет под нагрузкой",
  stages: stageIds.map((id) => ({
    id,
    prompt: `Задание ${id}`,
    forks: [],
    notes: `Пояснения ${id}`,
    rubric: ["Пункт"],
    drillIds: id === "architecture" ? ["sd-1"] : [],
    topicIds: [],
  })),
  scheme: {
    nodes: [
      { id: "req", stage: "requirements", x: 0, y: 0, text: "Требования" },
      { id: "api", stage: "architecture", x: 0, y: 100, text: "API" },
      { id: "cache", stage: "optimizations", x: 200, y: 100, text: "Кэш" },
    ],
    edges: [],
  },
};

describe("DesignCasePage", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {}, boards: {}, revisions: {} });
  });

  it("walks through the RADIO stages and ends with the production tab", () => {
    render(<DesignCasePage designCase={designCase} />);

    expect(screen.getByRole("heading", { name: /^Автокомплит/ })).toBeInTheDocument();
    expect(screen.getByText("Пройдено этапов: 0 из 5")).toBeInTheDocument();
    expect(screen.getByText("Задание requirements")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Архитектура" }));
    expect(screen.getByText("Задание architecture")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Debounce/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "В продакшене" }));
    expect(screen.getByText("Что будет под нагрузкой")).toBeInTheDocument();
  });

  it("keeps one scheme on the page while the stage tabs change", () => {
    render(<DesignCasePage designCase={designCase} />);
    const board = screen.getByRole("button", { name: "Редактор: Моя схема" });
    expect(board).toHaveTextContent("cards: 0");

    fireEvent.click(board);
    expect(board).toHaveTextContent("cards: 1");

    fireEvent.click(screen.getByRole("tab", { name: "Архитектура" }));
    fireEvent.click(screen.getByRole("tab", { name: "В продакшене" }));

    expect(screen.getAllByRole("button", { name: "Редактор: Моя схема" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Редактор: Моя схема" })).toBe(board);
    expect(board).toHaveTextContent("cards: 1");
  });

  it("keeps the reset button off until there is something to reset", () => {
    render(<DesignCasePage designCase={designCase} />);
    expect(screen.getByRole("button", { name: "Сбросить кейс" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Редактор: Моя схема" }));

    expect(screen.getByRole("button", { name: "Сбросить кейс" })).toBeEnabled();
  });

  it("asks first, then clears the whole case and goes back to the first stage", () => {
    useDesignCaseStore.setState({
      stages: {
        "autocomplete:architecture": { choices: { fork: "a" }, rubric: [0] },
        "other:requirements": { choices: { fork: "b" }, rubric: [] },
      },
      boards: { autocomplete: { nodes: [{ id: "n1", x: 0, y: 0, text: "API" }], edges: [] } },
    });
    render(<DesignCasePage designCase={designCase} />);
    // A passed stage shows a tick, so its tab is named "Пройден Архитектура".
    fireEvent.click(screen.getByRole("tab", { name: /Архитектура/ }));

    fireEvent.click(screen.getByRole("button", { name: "Сбросить кейс" }));
    expect(screen.getByText("Сбросить кейс?")).toBeInTheDocument();
    expect(useDesignCaseStore.getState().boards["autocomplete"]).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Сбросить" }));

    const state = useDesignCaseStore.getState();
    expect(state.stages["autocomplete:architecture"]).toBeUndefined();
    expect(state.boards["autocomplete"]).toBeUndefined();
    expect(state.stages["other:requirements"]).toEqual({ choices: { fork: "b" }, rubric: [] });
    expect(screen.getByRole("tab", { name: "Требования" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("button", { name: "Редактор: Моя схема" })).toHaveTextContent(
      "cards: 0"
    );
    expect(screen.getByRole("button", { name: "Сбросить кейс" })).toBeDisabled();
  });

  it("leaves everything as it was when the reset is cancelled", () => {
    useDesignCaseStore.setState({
      stages: { "autocomplete:requirements": { choices: { fork: "a" }, rubric: [] } },
    });
    render(<DesignCasePage designCase={designCase} />);

    fireEvent.click(screen.getByRole("button", { name: "Сбросить кейс" }));
    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));

    expect(useDesignCaseStore.getState().stages["autocomplete:requirements"]).toEqual({
      choices: { fork: "a" },
      rubric: [],
    });
  });

  it("counts a finished stage in the header", () => {
    useDesignCaseStore.setState({
      stages: { "autocomplete:requirements": { choices: {}, rubric: [0] } },
    });
    render(<DesignCasePage designCase={designCase} />);

    expect(screen.getByText("Пройдено этапов: 1 из 5")).toBeInTheDocument();
  });

  it("opens the reference of the open stage on the board, with its notes next to the stage", () => {
    render(<DesignCasePage designCase={designCase} />);
    fireEvent.click(screen.getByRole("tab", { name: "Архитектура" }));
    expect(screen.queryByText("Пояснения architecture")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Эталон" }));

    expect(screen.getByRole("img", { name: "Эталонная схема" })).toHaveTextContent(
      "shown: req,api; new: api"
    );
    expect(screen.getByText("Пояснения architecture")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "В продакшене" }));
    expect(screen.getByRole("img", { name: "Эталонная схема" })).toHaveTextContent(
      "shown: req,api,cache; new:"
    );
  });
});
