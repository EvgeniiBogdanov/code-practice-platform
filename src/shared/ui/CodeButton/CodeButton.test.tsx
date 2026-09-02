import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CodeButton } from "./CodeButton";

describe("CodeButton", () => {
  it("renders with default props and handles click", () => {
    const handleClick = vi.fn();
    render(<CodeButton onClick={handleClick}>Format</CodeButton>);

    const button = screen.getByRole("button", { name: /format/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon when provided", () => {
    render(<CodeButton icon={<span data-testid="icon">icon</span>}>Run</CodeButton>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("respects disabled attribute", () => {
    const handleClick = vi.fn();
    render(<CodeButton disabled onClick={handleClick}>Disabled</CodeButton>);

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies active state correctly", () => {
    render(<CodeButton isActive>Active Btn</CodeButton>);
    const button = screen.getByRole("button", { name: /active btn/i });
    expect(button.className).toContain("active");
  });
});
