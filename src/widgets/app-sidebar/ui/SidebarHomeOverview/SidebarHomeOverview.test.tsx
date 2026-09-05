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
vi.mock("../../model", () => ({
  useSidebarHomeStats: () => ({
    completedJsTotal: 10,
    completedReactTotal: 5,
    completedAlgoTotal: 2,
    totalJs: 100,
    totalReact: 50,
    totalAlgo: 30,
    jsCompletionClass: "js-complete",
    reactCompletionClass: "react-complete",
    algoCompletionClass: "algo-complete",
  }),
}));

describe("SidebarHomeOverview", () => {
  it("renders all section navigation links and badges", () => {
    render(<SidebarHomeOverview activeSectionKey="home" isHomeActive={true} />);

    expect(screen.getByText("Обзор платформы")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Алгоритмы")).toBeInTheDocument();

    const homeLink = screen.getByTestId("link-/home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.className).toContain("homeItemActive");

    const jsLink = screen.getByTestId("link-/javascript");
    expect(jsLink).toBeInTheDocument();
    expect(screen.getByText("10/100")).toBeInTheDocument();

    const reactLink = screen.getByTestId("link-/react");
    expect(reactLink).toBeInTheDocument();
    expect(screen.getByText("5/50")).toBeInTheDocument();

    const algoLink = screen.getByTestId("link-/algorithms");
    expect(algoLink).toBeInTheDocument();
    expect(screen.getByText("2/30")).toBeInTheDocument();
  });

  it("does not apply homeItemActive when isHomeActive is false", () => {
    render(<SidebarHomeOverview activeSectionKey="javascript" isHomeActive={false} />);

    const homeLink = screen.getByTestId("link-/home");
    expect(homeLink.className).not.toContain("homeItemActive");
  });
});
