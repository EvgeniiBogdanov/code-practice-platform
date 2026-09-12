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

  it("calls onReset and resets ratio on double-click", () => {
    const onReset = vi.fn();
    const onSplitRatioChange = vi.fn();
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={35}
        onReset={onReset}
        onSplitRatioChange={onSplitRatioChange}
      />
    );

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-valuenow", "35");

    fireEvent.doubleClick(separator);

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSplitRatioChange).toHaveBeenCalledWith(70);
    expect(separator).toHaveAttribute("aria-valuenow", "70");
  });

  it("resets to custom defaultRatio when provided", () => {
    const onReset = vi.fn();
    const onSplitRatioChange = vi.fn();
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={30}
        defaultRatio={50}
        onReset={onReset}
        onSplitRatioChange={onSplitRatioChange}
      />
    );

    const separator = screen.getByRole("separator");
    fireEvent.doubleClick(separator);

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSplitRatioChange).toHaveBeenCalledWith(50);
    expect(separator).toHaveAttribute("aria-valuenow", "50");
  });

  it("ignores micro-movements below drag threshold during pointer interactions", () => {
    const onSplitRatioChange = vi.fn();
    const { container } = render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={70}
        onSplitRatioChange={onSplitRatioChange}
      />
    );

    const splitContainer = container.firstElementChild as HTMLElement;
    const separator = screen.getByRole("separator");

    // Mock getBoundingClientRect
    vi.spyOn(splitContainer, "getBoundingClientRect").mockReturnValue({
      width: 1000,
      height: 600,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Pointer down at 700px
    fireEvent.pointerDown(separator, { clientX: 700, pointerId: 1 });

    // Micro-movement by 1px (less than DRAG_THRESHOLD=3)
    fireEvent.pointerMove(separator, { clientX: 701, pointerId: 1 });
    expect(onSplitRatioChange).not.toHaveBeenCalled();

    // Micro-movement by 2px to the left
    fireEvent.pointerMove(separator, { clientX: 698, pointerId: 1 });
    expect(onSplitRatioChange).not.toHaveBeenCalled();

    // Release pointer without dragging
    fireEvent.pointerUp(separator, { clientX: 698, pointerId: 1 });
    expect(onSplitRatioChange).not.toHaveBeenCalled();
    expect(separator).toHaveAttribute("aria-valuenow", "70");
  });

  it("drags smoothly based on delta when movement exceeds drag threshold", () => {
    const onSplitRatioChange = vi.fn();
    const { container } = render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={70}
        onSplitRatioChange={onSplitRatioChange}
      />
    );

    const splitContainer = container.firstElementChild as HTMLElement;
    const separator = screen.getByRole("separator");

    vi.spyOn(splitContainer, "getBoundingClientRect").mockReturnValue({
      width: 1000,
      height: 600,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Grab at 715px (e.g. resizer offset from container edge)
    fireEvent.pointerDown(separator, { clientX: 715, pointerId: 1 });

    // Move by +50px (from 715 to 765) -> delta is +50px (+5% of 1000px)
    fireEvent.pointerMove(separator, { clientX: 765, pointerId: 1 });

    // Ratio should be startRatio(70) + 5% = 75%
    expect(onSplitRatioChange).toHaveBeenCalledWith(75);
    expect(separator).toHaveAttribute("aria-valuenow", "75");

    fireEvent.pointerUp(separator, { clientX: 765, pointerId: 1 });
  });

  it("detects double-click reset via consecutive pointerup events without dragging", () => {
    const onReset = vi.fn();
    const onSplitRatioChange = vi.fn();
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={40}
        onReset={onReset}
        onSplitRatioChange={onSplitRatioChange}
      />
    );

    const separator = screen.getByRole("separator");

    // Click 1
    fireEvent.pointerDown(separator, { clientX: 400, pointerId: 1 });
    fireEvent.pointerUp(separator, { clientX: 401, pointerId: 1 });

    expect(onReset).not.toHaveBeenCalled();

    // Click 2 (within 200ms)
    fireEvent.pointerDown(separator, { clientX: 401, pointerId: 1 });
    fireEvent.pointerUp(separator, { clientX: 400, pointerId: 1 });

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSplitRatioChange).toHaveBeenCalledWith(70);
    expect(separator).toHaveAttribute("aria-valuenow", "70");
  });

  it("resets ratio on Enter or Space key press", () => {
    const onReset = vi.fn();
    const onSplitRatioChange = vi.fn();
    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        splitRatio={45}
        onReset={onReset}
        onSplitRatioChange={onSplitRatioChange}
      />
    );

    const separator = screen.getByRole("separator");
    separator.focus();

    fireEvent.keyDown(separator, { key: "Enter" });
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSplitRatioChange).toHaveBeenCalledWith(70);
    expect(separator).toHaveAttribute("aria-valuenow", "70");
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

  it("renders both panes without separator when layout='stack'", () => {
    render(
      <ResizableSplitPane
        layout="stack"
        left={<div data-testid="left-stacked">Left Stacked</div>}
        right={<div data-testid="right-stacked">Right Stacked</div>}
      />
    );

    expect(screen.getByTestId("left-stacked")).toBeInTheDocument();
    expect(screen.getByTestId("right-stacked")).toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});
