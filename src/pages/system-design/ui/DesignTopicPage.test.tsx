import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DesignTopicPage } from "./DesignTopicPage";

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

const topic = {
  id: "radio",
  title: "Как вести дизайн-интервью",
  summary: "…",
  minutes: 6,
  group: "process",
} as const;

describe("DesignTopicPage", () => {
  it("shows the topic title once, above the article", () => {
    render(<DesignTopicPage topic={topic} article={"Первый абзац статьи.\n\n## Раздел"} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Как вести дизайн-интервью" })
    ).toBeInTheDocument();
    expect(screen.getByText("Первый абзац статьи.")).toBeInTheDocument();
  });

  it("shows the summary under the title", () => {
    render(
      <DesignTopicPage topic={{ ...topic, summary: "Пять этапов разговора" }} article="Текст" />
    );
    expect(screen.getByText("Пять этапов разговора")).toBeInTheDocument();
  });

  it("shows badges with the reading time, the group and the place in the theory", () => {
    render(<DesignTopicPage topic={topic} article="Текст" />);

    expect(screen.getByText("~6 мин чтения")).toBeInTheDocument();
    expect(screen.getByText("Процесс собеседования")).toBeInTheDocument();
    expect(screen.getByText(/^Статья 1 из \d+$/)).toBeInTheDocument();
  });

  it("leaves out the place badge for a topic that is not in the list", () => {
    render(<DesignTopicPage topic={{ ...topic, id: "unknown" }} article="Текст" />);
    expect(screen.queryByText(/^Статья \d+ из/)).not.toBeInTheDocument();
    expect(screen.getByText("~6 мин чтения")).toBeInTheDocument();
  });

  it("leads back to the theory folder, not to the section overview", () => {
    render(<DesignTopicPage topic={topic} article="Текст" />);

    expect(screen.getByRole("link", { name: "Теория" })).toHaveAttribute(
      "href",
      "/system-design/topics"
    );
  });
});
