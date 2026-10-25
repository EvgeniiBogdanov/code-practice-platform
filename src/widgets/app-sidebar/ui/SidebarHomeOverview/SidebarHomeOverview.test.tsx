import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SidebarHomeOverview } from "./SidebarHomeOverview";

// Mock router Link
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
    <a href={to} className={className} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
}));

// Mock sidebar stats hook
vi.mock("../../model/useSidebarHomeStats", () => ({
  useSidebarHomeStats: () => ({
    completedTsTotal: 1,
    completedJsTotal: 10,
    completedReactTotal: 5,
    completedAlgoTotal: 2,
    completedAllTotal: 18,
    totalAll: 200,
  }),
}));

describe("SidebarHomeOverview", () => {
  it("shows the overall progress and only the platform overview link", () => {
    render(<SidebarHomeOverview activeSectionKey="home" isHomeActive={true} />);

    expect(screen.getByText("18/200")).toBeInTheDocument();
    const homeLink = screen.getByTestId("link-/home");
    expect(homeLink).toHaveTextContent("Обзор платформы");
    expect(homeLink.className).toContain("homeItemActive");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("does not apply homeItemActive when isHomeActive is false", () => {
    render(<SidebarHomeOverview activeSectionKey="javascript" isHomeActive={false} />);

    const homeLink = screen.getByTestId("link-/home");
    expect(homeLink.className).not.toContain("homeItemActive");
  });
});
