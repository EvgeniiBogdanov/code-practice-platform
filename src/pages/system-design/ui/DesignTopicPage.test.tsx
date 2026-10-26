import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { DesignTopicPage } from "./DesignTopicPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    state,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    params?: Record<string, string>;
    state?: Record<string, unknown>;
    className?: string;
  }) => (
    <a
      href={to}
      data-params={JSON.stringify(params ?? {})}
      data-state={JSON.stringify(state ?? null)}
      className={className}
    >
      {children}
    </a>
  ),
}));

const [first, second, third] = DESIGN_TOPICS;
const last = DESIGN_TOPICS[DESIGN_TOPICS.length - 1];
if (!first || !second || !third || !last) throw new Error("The theory needs at least three topics");

const topic = { ...first, title: "Как вести дизайн-интервью", minutes: 6 };

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

  describe("coming from the folder page or the sidebar", () => {
    it("leads back to the theory folder, not to the section overview", () => {
      render(<DesignTopicPage topic={second} article="Текст" />);

      expect(screen.getByRole("link", { name: "Теория" })).toHaveAttribute(
        "href",
        "/system-design/topics"
      );
      expect(screen.queryByText(/^Предыдущая статья/)).not.toBeInTheDocument();
    });
  });

  describe("coming with «Следующая статья»", () => {
    it("leads back to the previous article instead of the folder", () => {
      render(<DesignTopicPage topic={second} article="Текст" isReadingInOrder />);

      const back = screen.getByRole("link", { name: `Предыдущая статья: ${first.title}` });
      expect(back).toHaveAttribute("data-params", JSON.stringify({ topicId: first.id }));
      expect(back).toHaveAttribute("data-state", JSON.stringify({ readingInOrder: true }));
      expect(screen.queryByRole("link", { name: "Теория" })).not.toBeInTheDocument();
    });

    it("still leads back to the folder from the first article, which has no previous one", () => {
      render(<DesignTopicPage topic={first} article="Текст" isReadingInOrder />);

      expect(screen.getByRole("link", { name: "Теория" })).toHaveAttribute(
        "href",
        "/system-design/topics"
      );
    });
  });

  describe("the next article", () => {
    it("is offered at the top and under the text, and keeps the reading in order", () => {
      render(<DesignTopicPage topic={second} article="Текст" />);

      const top = screen.getByRole("link", { name: `Следующая статья: ${third.title}` });
      expect(top).toHaveAttribute("data-params", JSON.stringify({ topicId: third.id }));
      expect(top).toHaveAttribute("data-state", JSON.stringify({ readingInOrder: true }));

      const bottom = screen.getByRole("link", { name: `Следующая статья ${third.title}` });
      expect(bottom).toHaveAttribute("data-params", JSON.stringify({ topicId: third.id }));
      expect(bottom).toHaveAttribute("data-state", JSON.stringify({ readingInOrder: true }));
    });

    it("is not offered after the last article", () => {
      render(<DesignTopicPage topic={last} article="Текст" />);

      expect(screen.queryByText(/Следующая статья/)).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Теория" })).toBeInTheDocument();
    });
  });
});
