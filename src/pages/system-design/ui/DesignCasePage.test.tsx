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
    reference: "Эталон",
    rubric: ["Пункт"],
    drillIds: id === "architecture" ? ["sd-1"] : [],
    topicIds: [],
  })),
};

describe("DesignCasePage", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {} });
  });

  it("walks through the RADIO stages and ends with the production tab", () => {
    render(<DesignCasePage designCase={designCase} />);

    expect(screen.getByRole("heading", { name: "Автокомплит" })).toBeInTheDocument();
    expect(screen.getByText("Пройдено этапов: 0 из 5")).toBeInTheDocument();
    expect(screen.getByText("Задание requirements")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Архитектура" }));
    expect(screen.getByText("Задание architecture")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Debounce" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "В продакшене" }));
    expect(screen.getByText("Что будет под нагрузкой")).toBeInTheDocument();
  });

  it("counts a finished stage in the header", () => {
    useDesignCaseStore.setState({
      stages: { "autocomplete:requirements": { choices: {}, answer: "Ответ", rubric: [0] } },
    });
    render(<DesignCasePage designCase={designCase} />);

    expect(screen.getByText("Пройдено этапов: 1 из 5")).toBeInTheDocument();
  });
});
