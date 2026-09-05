import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SidebarWorkspaceHeader } from "./SidebarWorkspaceHeader";

// Mock router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

// Mock catalog hook
vi.mock("@/entities/task/catalog", () => ({
  useTaskSection: () => ({ tasks: [] }),
}));

describe("SidebarWorkspaceHeader", () => {
  it("renders active section title and handles dropdown toggle", () => {
    const handleCloseSidebar = vi.fn();
    render(
      <SidebarWorkspaceHeader
        activeSectionKey="javascript"
        onCloseSidebar={handleCloseSidebar}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /переключить раздел платформы/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();

    // Dropdown initially closed
    expect(screen.queryByText("РАЗДЕЛЫ ПЛАТФОРМЫ")).not.toBeInTheDocument();

    // Open dropdown
    fireEvent.click(toggleBtn);
    expect(screen.getByText("РАЗДЕЛЫ ПЛАТФОРМЫ")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Алгоритмы")).toBeInTheDocument();
    expect(screen.getByText("Главная")).toBeInTheDocument();

    // Close on second click
    fireEvent.click(toggleBtn);
    expect(screen.queryByText("РАЗДЕЛЫ ПЛАТФОРМЫ")).not.toBeInTheDocument();
  });

  it("closes dropdown on Escape key", () => {
    render(
      <SidebarWorkspaceHeader
        activeSectionKey="react"
        onCloseSidebar={vi.fn()}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /переключить раздел платформы/i });
    fireEvent.click(toggleBtn);
    expect(screen.getByText("РАЗДЕЛЫ ПЛАТФОРМЫ")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("РАЗДЕЛЫ ПЛАТФОРМЫ")).not.toBeInTheDocument();
  });

  it("calls onCloseSidebar when sidebar collapse button is clicked", () => {
    const handleCloseSidebar = vi.fn();
    render(
      <SidebarWorkspaceHeader
        activeSectionKey="home"
        onCloseSidebar={handleCloseSidebar}
      />
    );

    const collapseBtn = screen.getByRole("button", { name: "Свернуть боковую панель" });
    expect(collapseBtn).toBeInTheDocument();
    fireEvent.click(collapseBtn);
    expect(handleCloseSidebar).toHaveBeenCalledTimes(1);
  });
});
