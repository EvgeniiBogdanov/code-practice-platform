import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders correctly with role switch and unchecked state", () => {
    render(<Switch checked={false} onChange={vi.fn()} aria-label="Toggle setting" />);

    const switchInput = screen.getByRole("switch", { name: "Toggle setting" });
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).not.toBeChecked();
    expect(switchInput).toHaveAttribute("aria-checked", "false");
  });

  it("renders checked state correctly", () => {
    render(<Switch checked={true} onChange={vi.fn()} aria-label="Toggle setting" />);

    const switchInput = screen.getByRole("switch", { name: "Toggle setting" });
    expect(switchInput).toBeChecked();
    expect(switchInput).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with updated value when clicked", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} aria-label="Toggle setting" />);

    const switchInput = screen.getByRole("switch", { name: "Toggle setting" });
    fireEvent.click(switchInput);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("does not trigger onChange when disabled", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} disabled aria-label="Toggle setting" />);

    const switchInput = screen.getByRole("switch", { name: "Toggle setting" });
    expect(switchInput).toBeDisabled();

    fireEvent.click(switchInput);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders with a visible text label", () => {
    render(<Switch checked={false} onChange={vi.fn()} label="Убрать подсказки" />);

    expect(screen.getByText("Убрать подсказки")).toBeInTheDocument();
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeInTheDocument();
  });
});
