import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SegmentedProgress } from "./SegmentedProgress";

describe("SegmentedProgress", () => {
  it("renders a segment per step and reports the finished ones", () => {
    render(<SegmentedProgress label="Пройдено" segments={["success", "danger", "neutral"]} />);
    const bar = screen.getByRole("progressbar", { name: "Пройдено" });
    expect(bar.children).toHaveLength(3);
    expect(bar).toHaveAttribute("aria-valuemax", "3");
    expect(bar).toHaveAttribute("aria-valuenow", "1");
  });

  it("reports an explicit value when the segments draw a scale", () => {
    render(
      <SegmentedProgress
        label="Освоение"
        segments={["warning", "warning", "neutral", "neutral", "neutral"]}
        value={{ now: 42, max: 100 }}
      />
    );
    const bar = screen.getByRole("progressbar", { name: "Освоение" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });
});
