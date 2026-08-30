import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ResizableSplitPane } from "./ResizableSplitPane";

describe("ResizableSplitPane", () => {
  it("renders left and right pane contents", () => {
    render(
      <ResizableSplitPane
        left={<div data-testid="left-content">Left</div>}
        right={<div data-testid="right-content">Right</div>}
      />
    );

    expect(screen.getByTestId("left-content")).toBeInTheDocument();
    expect(screen.getByTestId("right-content")).toBeInTheDocument();
  });

  it("renders separator with correct aria attributes", () => {
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={45}
        minLeftPercent={25}
        maxLeftPercent={75}
      />
    );

    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveAttribute("aria-valuenow", "45");
    expect(separator).toHaveAttribute("aria-valuemin", "25");
    expect(separator).toHaveAttribute("aria-valuemax", "75");
  });

  it("handles keyboard navigation (ArrowRight / ArrowLeft / Home / End)", () => {
    const onSplitRatioChange = vi.fn();
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={50}
        onSplitRatioChange={onSplitRatioChange}
        minLeftPercent={20}
        maxLeftPercent={80}
      />
    );

    const separator = screen.getByRole("separator");
    separator.focus();

    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(onSplitRatioChange).toHaveBeenLastCalledWith(52);

    fireEvent.keyDown(separator, { key: "ArrowLeft" });
    expect(onSplitRatioChange).toHaveBeenLastCalledWith(50);

    fireEvent.keyDown(separator, { key: "Home" });
    expect(onSplitRatioChange).toHaveBeenLastCalledWith(20);

    fireEvent.keyDown(separator, { key: "End" });
    expect(onSplitRatioChange).toHaveBeenLastCalledWith(80);
  });

  it("calls onReset on double-click", () => {
    const onReset = vi.fn();
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={35}
        onReset={onReset}
      />
    );

    const separator = screen.getByRole("separator");
    fireEvent.doubleClick(separator);

    expect(onReset).toHaveBeenCalled();
  });

  it("defaults to 70% split ratio when not specified", () => {
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-valuenow", "70");
  });
});
