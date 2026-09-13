import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HomePage } from "./HomePage";

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

vi.mock("@/shared/lib/hooks", () => ({
  useParentSize: () => [{ current: null }, { width: 700, height: 112 }],
}));

vi.mock("@nivo/calendar", () => ({
  TimeRange: ({ data, from, to }: { data: unknown[]; from: string; to: string }) => (
    <div data-testid="nivo-time-range" data-from={from} data-to={to} data-count={data.length} />
  ),
}));

vi.mock("../model/use-home-stats", () => ({
  useHomeStats: () => ({
    grandTotal: 100,
    grandSolved: 25,
    grandPct: 25,
    grandRemaining: 75,
    grandExcluded: 0,
    reactTotal: 40,
    reactSolved: 10,
    reactPct: 25,
    jsTotal: 40,
    jsSolved: 10,
    jsPct: 25,
    algoTotal: 20,
    algoSolved: 5,
    algoPct: 25,
  }),
}));

const mockUseSpacedRepetitionData = vi.fn(() => ({
  reviewActivityByDate: {
    "2026-09-01": 2,
    "2026-09-02": 5,
  },
  isLoading: false,
}));

vi.mock("@/features/spaced-repetition", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/spaced-repetition")>();
  return {
    ...actual,
    useSpacedRepetitionData: () => mockUseSpacedRepetitionData(),
  };
});

describe("HomePage", () => {
  it("renders KPI summary, spaced repetition activity chart and practice sections in correct hierarchy", () => {
    render(<HomePage />);

    // Header
    expect(
      screen.getByRole("heading", { level: 1, name: "Code Practice Platform" })
    ).toBeInTheDocument();

    // Stats zone common header
    expect(
      screen.getByRole("heading", { level: 2, name: "Общая статистика по разделам" })
    ).toBeInTheDocument();

    // KPI Summary
    expect(screen.getByText("Всего задач")).toBeInTheDocument();
    expect(screen.getByText("Решено задач")).toBeInTheDocument();
    expect(screen.getByText("Общий прогресс")).toBeInTheDocument();

    // SpacedRepetitionActivityChart under HomeKpiSummary
    expect(
      screen.getByRole("heading", { level: 3, name: "Активность решений" })
    ).toBeInTheDocument();
    const chart = screen.getByTestId("nivo-time-range");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-count", "2");

    // Practice Sections
    expect(screen.getByRole("heading", { level: 2, name: "Разделы практики" })).toBeInTheDocument();

    // Features Grid
    expect(
      screen.getByRole("heading", { level: 2, name: "Возможности платформы" })
    ).toBeInTheDocument();
  });

  it("renders activity chart skeleton while data is loading asynchronously", () => {
    mockUseSpacedRepetitionData.mockReturnValueOnce({
      reviewActivityByDate: {},
      isLoading: true,
    } as unknown as ReturnType<typeof mockUseSpacedRepetitionData>);

    render(<HomePage />);

    expect(screen.getByRole("status", { name: "Загрузка активности решений" })).toBeInTheDocument();
    expect(screen.queryByTestId("nivo-time-range")).not.toBeInTheDocument();
  });
});
