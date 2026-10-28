import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FinderSystemDesignHierarchy } from "./FinderSystemDesignHierarchy";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    params?: Record<string, string>;
    className?: string;
  }) => (
    <a
      href={Object.entries(params ?? {}).reduce(
        (href, [key, value]) => href.replace(`$${key}`, value),
        to
      )}
      className={className}
    >
      {children}
    </a>
  ),
}));
vi.mock("@/entities/task/catalog", () => ({
  useTaskSection: () => ({
    tasks: [{ id: "sd-query-cache", title: "Кэш запросов", difficulty: "easy" }],
  }),
}));
vi.mock("@/entities/design-case", () => ({
  DESIGN_CASES: [{ id: "chat", title: "Чат реального времени" }],
}));
vi.mock("@/entities/design-topic", () => ({
  DESIGN_TOPICS: [{ id: "rendering", title: "Рендеринг" }],
}));

const renderAt = (pathname: string, activeDropdown: "group" | "task" | null = null) =>
  render(
    <FinderSystemDesignHierarchy
      pathname={pathname}
      activeDropdown={activeDropdown}
      toggleDropdown={vi.fn()}
      closeAllDropdowns={vi.fn()}
    />
  );

describe("FinderSystemDesignHierarchy", () => {
  it("shows the folder and the open case", () => {
    renderAt("/system-design/cases/chat");

    expect(screen.getByRole("button", { name: /^Кейсы: выбрать папку/ })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Чат реального времени: выбрать страницу/ })
    ).toBeInTheDocument();
  });

  it("shows a drill inside the drills folder", () => {
    renderAt("/system-design/sd-query-cache");

    expect(screen.getByRole("button", { name: /^Дриллы: выбрать папку/ })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Кэш запросов: выбрать страницу/ })
    ).toBeInTheDocument();
  });

  it("shows only the folder on a folder page and «all folders» on the overview", () => {
    const { unmount } = renderAt("/system-design/topics");
    expect(screen.getByRole("button", { name: /^Теория: выбрать папку/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /выбрать страницу/ })).not.toBeInTheDocument();
    unmount();

    renderAt("/system-design");
    expect(screen.getByRole("button", { name: /^Все папки: выбрать папку/ })).toBeInTheDocument();
  });

  it("lists the three folders with links to their pages", () => {
    renderAt("/system-design/cases/chat", "group");

    expect(screen.getByRole("link", { name: /Теория/ })).toHaveAttribute(
      "href",
      "/system-design/topics"
    );
    expect(screen.getByRole("link", { name: /Кейсы/ })).toHaveAttribute(
      "href",
      "/system-design/cases"
    );
    expect(screen.getByRole("link", { name: /Дриллы/ })).toHaveAttribute(
      "href",
      "/system-design/drills"
    );
  });

  it("lists the pages of the current folder", () => {
    renderAt("/system-design/topics/rendering", "task");

    expect(screen.getByRole("link", { name: "Рендеринг" })).toHaveAttribute(
      "href",
      "/system-design/topics/rendering"
    );
  });
});
