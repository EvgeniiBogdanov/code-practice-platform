import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiGrid } from "./KpiGrid";

describe("KpiGrid", () => {
  it("renders standard metrics without excluded count", () => {
    render(<KpiGrid total={320} solved={100} percent={31} remaining={220} />);

    expect(screen.getByText("Всего задач")).toBeInTheDocument();
    expect(screen.getByText("320")).toBeInTheDocument();
    expect(screen.queryByText(/\(-/)).not.toBeInTheDocument();
  });

  it("renders excluded tasks count in parentheses next to total", () => {
    render(
      <KpiGrid total={318} solved={100} percent={31} remaining={218} excludedCount={2} />
    );

    expect(screen.getByText("Всего задач")).toBeInTheDocument();
    expect(screen.getByText("318")).toBeInTheDocument();
    expect(screen.getByText("(-2)")).toBeInTheDocument();
  });
});
