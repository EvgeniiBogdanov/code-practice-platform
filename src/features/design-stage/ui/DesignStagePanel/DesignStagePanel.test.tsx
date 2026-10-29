import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDesignCaseStore, type DesignStage } from "@/entities/design-case";
import { DesignStagePanel } from "./DesignStagePanel";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    className,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a href={to} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

const stage: DesignStage = {
  id: "requirements",
  prompt: "Опишите требования",
  forks: [
    {
      id: "render",
      question: "SSR или CSR?",
      options: [
        { id: "ssr", label: "SSR", explanation: "Быстрый первый экран", recommended: true },
        { id: "csr", label: "CSR", explanation: "Проще деплой" },
      ],
    },
  ],
  notes: "Эталон: берём SSR",
  rubric: ["Названы требования", "Названы ограничения"],
  drillIds: ["sd-1"],
  topicIds: ["radio"],
};

const renderPanel = (showReference = false): void => {
  render(
    <DesignStagePanel
      caseId="case"
      stage={stage}
      showReference={showReference}
      topics={[{ id: "radio", title: "RADIO" }]}
      drills={[{ id: "sd-1", title: "Debounce", solved: false }]}
    />
  );
};

describe("DesignStagePanel", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {} });
  });

  it("shows the trade-offs of every option only after a choice", () => {
    renderPanel();
    expect(screen.getByText("Развилка 1 из 1")).toBeInTheDocument();
    expect(screen.queryByText("Проще деплой")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "CSR" }));

    expect(screen.getByRole("radio", { name: "CSR" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "CSR" })).toHaveAccessibleDescription(
      "Ваш выбор Проще деплой"
    );
    expect(screen.getByRole("radio", { name: "SSR" })).toHaveAccessibleDescription(
      "Рекомендуем Быстрый первый экран"
    );
    expect(screen.getByText(/Рекомендуем другой вариант/)).toBeInTheDocument();
  });

  it("confirms a choice that matches the recommendation", () => {
    renderPanel();
    fireEvent.click(screen.getByRole("radio", { name: "SSR" }));

    expect(screen.getByText(/Совпадает с рекомендацией/)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "SSR" })).toHaveAccessibleDescription(
      "Рекомендуем Ваш выбор Быстрый первый экран"
    );
  });

  it("shows the notes of the reference only while the reference is open on the board", () => {
    renderPanel();
    expect(screen.queryByText("Эталон: берём SSR")).not.toBeInTheDocument();
  });

  it("shows the notes of the reference before anything is answered", () => {
    renderPanel(true);
    expect(screen.getByText("Пояснения к эталону")).toBeInTheDocument();
    expect(screen.getByText("Эталон: берём SSR")).toBeInTheDocument();
  });

  it("links the topics and drills of the stage", () => {
    renderPanel();
    expect(screen.getByRole("navigation", { name: "Подготовка к этапу" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RADIO — Теория" })).toHaveAttribute(
      "href",
      "/system-design/topics/$topicId"
    );
    expect(screen.getByRole("link", { name: "Debounce — Код-дрилл" })).toHaveAttribute(
      "href",
      "/system-design/$taskId"
    );
  });

  it("completes the stage once the fork is answered and the rubric is ticked", () => {
    renderPanel();
    expect(screen.queryByText("Этап пройден")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "SSR" }));
    expect(screen.getByText("0 из 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Названы требования" }));
    expect(screen.getByText("1 из 2")).toBeInTheDocument();
    expect(screen.queryByText("Этап пройден")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Названы ограничения" }));

    expect(screen.getByText("Этап пройден")).toBeInTheDocument();
    expect(useDesignCaseStore.getState().stages["case:requirements"]).toEqual({
      choices: { render: "ssr" },
      rubric: [0, 1],
    });
  });

  it("does not draw its own board: the scheme is shared by the whole case", () => {
    renderPanel();
    expect(screen.queryByRole("group", { name: /схема/i })).not.toBeInTheDocument();
  });
});
