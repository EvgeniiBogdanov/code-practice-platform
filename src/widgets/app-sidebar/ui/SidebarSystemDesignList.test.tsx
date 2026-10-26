import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "@/shared/ui";
import { SidebarSystemDesignList } from "./SidebarSystemDesignList";

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
  useNavigate: () => vi.fn(),
}));
vi.mock("../model", () => ({
  useSidebarSystemDesignList: () => ({
    decodedCurrentId: "",
    pathname: "/system-design/topics",
    drills: [],
    completedTasks: {},
    reviews: {},
    completedTotal: 0,
    totalCount: 9,
    isGroupOpen: () => false,
    toggleGroup: vi.fn(),
  }),
}));

const renderList = (): void => {
  render(
    <Tooltip.Provider>
      <SidebarSystemDesignList />
    </Tooltip.Provider>
  );
};

describe("SidebarSystemDesignList", () => {
  it("shows the progress of the drills and the folders of theory and cases", () => {
    renderList();

    expect(screen.getByText("0/9")).toBeInTheDocument();
    expect(screen.getByText("Теория")).toBeInTheDocument();
    expect(screen.getByText("Кейсы")).toBeInTheDocument();
  });

  it("has no quick-action buttons: statistics, cheat sheet and search are not needed here", () => {
    renderList();

    expect(screen.queryByLabelText("Быстрые действия")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Статистика повторений" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Шпаргалка" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Поиск по задачам (Cmd+K)" })
    ).not.toBeInTheDocument();
  });
});
