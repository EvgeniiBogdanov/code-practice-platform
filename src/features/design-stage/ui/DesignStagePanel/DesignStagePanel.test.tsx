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
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
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
    expect(screen.queryByText("Проще деплой")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "CSR" }));

    expect(screen.getByRole("radio", { name: "CSR" })).toBeChecked();
    expect(screen.getByText("Быстрый первый экран")).toBeInTheDocument();
    expect(screen.getByText("Проще деплой")).toBeInTheDocument();
    expect(screen.getByText("SSR — рекомендуемый вариант")).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "RADIO" })).toHaveAttribute(
      "href",
      "/system-design/topics/$topicId"
    );
    expect(screen.getByRole("link", { name: "Debounce" })).toHaveAttribute(
      "href",
      "/system-design/$taskId"
    );
  });

  it("completes the stage once the fork is answered and the rubric is ticked", () => {
    renderPanel();
    expect(screen.queryByText("Этап пройден")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "SSR" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Названы требования" }));
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
