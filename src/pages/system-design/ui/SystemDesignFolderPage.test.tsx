import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { SystemDesignFolderPage } from "./SystemDesignFolderPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("@/entities/task/catalog", () => ({
  useTaskSection: () => ({
    tasks: [
      { id: "sd-1", title: "Debounce" },
      { id: "sd-2", title: "Кэш" },
    ],
  }),
}));

describe("SystemDesignFolderPage", () => {
  it("lists every article inside the theory folder", () => {
    render(<SystemDesignFolderPage folder="theory" />);

    expect(screen.getByRole("heading", { level: 1, name: "Теория" })).toBeInTheDocument();
    for (const topic of DESIGN_TOPICS) {
      expect(screen.getByRole("link", { name: new RegExp(topic.title) })).toHaveAttribute(
        "href",
        "/system-design/topics/$topicId"
      );
    }
  });

  it("lists the drills and offers to start with the first one", () => {
    render(<SystemDesignFolderPage folder="drills" />);

    expect(screen.getByRole("heading", { level: 1, name: "Дриллы" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Debounce/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Кэш/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Решать задачи/ })).toHaveAttribute(
      "href",
      "/system-design/$taskId"
    );
  });

  it("shows no drill list in the cases folder", () => {
    render(<SystemDesignFolderPage folder="cases" cases={[]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Кейсы" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Debounce/ })).not.toBeInTheDocument();
  });
});
