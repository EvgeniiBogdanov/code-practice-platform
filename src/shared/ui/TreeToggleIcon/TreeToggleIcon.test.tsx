import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TreeToggleIcon } from "./TreeToggleIcon";

describe("TreeToggleIcon", () => {
  it("renders correctly with default and expanded states", () => {
    const { rerender } = render(
      <TreeToggleIcon
        icon={<span data-testid="test-icon">icon</span>}
        expanded={false}
        onToggle={vi.fn()}
      />
    );

    const toggleBtn = screen.getByRole("presentation");
    expect(toggleBtn).toHaveAttribute("data-expanded", "false");
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();

    rerender(
      <TreeToggleIcon
        icon={<span data-testid="test-icon">icon</span>}
        expanded={true}
        onToggle={vi.fn()}
      />
    );

    expect(toggleBtn).toHaveAttribute("data-expanded", "true");
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("calls e.preventDefault(), e.stopPropagation(), and onToggle on click", () => {
    const handleToggle = vi.fn();
    render(<TreeToggleIcon icon={<span>📁</span>} expanded={false} onToggle={handleToggle} />);

    const toggleBtn = screen.getByRole("presentation");
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");
    const stopPropagationSpy = vi.spyOn(clickEvent, "stopPropagation");

    toggleBtn.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("prevents default navigation when nested inside an anchor tag", () => {
    const handleToggle = vi.fn();
    const handleAnchorClick = vi.fn();

    render(
      <a href="/javascript/group-closure" onClick={handleAnchorClick}>
        <TreeToggleIcon icon={<span>📁</span>} expanded={false} onToggle={handleToggle} />
        <span>Замыкания</span>
      </a>
    );

    const toggleBtn = screen.getByRole("presentation");
    fireEvent.click(toggleBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    // Because stopPropagation was called, the anchor's onClick is not called
    expect(handleAnchorClick).not.toHaveBeenCalled();
  });

  it("handles Enter and Space keydown events", () => {
    const handleToggle = vi.fn();
    render(<TreeToggleIcon icon={<span>📁</span>} expanded={false} onToggle={handleToggle} />);

    const toggleBtn = screen.getByRole("presentation");

    fireEvent.keyDown(toggleBtn, { key: "Enter" });
    expect(handleToggle).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(toggleBtn, { key: " " });
    expect(handleToggle).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(toggleBtn, { key: "Tab" });
    expect(handleToggle).toHaveBeenCalledTimes(2);
  });
});
