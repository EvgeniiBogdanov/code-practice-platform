import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KeepAlivePane } from "./KeepAlivePane";

describe("KeepAlivePane", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const getPane = (): HTMLElement => screen.getByText("содержимое");

  it("keeps its content mounted while inactive", () => {
    render(<KeepAlivePane isActive={false}>содержимое</KeepAlivePane>);

    expect(screen.getByText("содержимое")).toBeInTheDocument();
  });

  it("switches transitions off for two frames after it is shown again", () => {
    const { rerender } = render(<KeepAlivePane isActive={false}>содержимое</KeepAlivePane>);
    expect(getPane()).not.toHaveAttribute("data-revealing");

    rerender(<KeepAlivePane isActive>содержимое</KeepAlivePane>);
    expect(getPane()).toHaveAttribute("data-revealing");

    vi.advanceTimersToNextFrame();
    expect(getPane()).toHaveAttribute("data-revealing");

    vi.advanceTimersToNextFrame();
    expect(getPane()).not.toHaveAttribute("data-revealing");
  });

  it("does not hold transitions back on first render or while it stays active", () => {
    const { rerender } = render(<KeepAlivePane isActive>содержимое</KeepAlivePane>);
    expect(getPane()).not.toHaveAttribute("data-revealing");

    rerender(<KeepAlivePane isActive>другое</KeepAlivePane>);
    expect(screen.getByText("другое")).not.toHaveAttribute("data-revealing");
  });
});
