import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TelegramIcon } from "./TelegramIcon";

describe("TelegramIcon", () => {
  it("renders SVG with default props", () => {
    const { container } = render(<TelegramIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom size and className", () => {
    const { container } = render(<TelegramIcon size={20} className="custom-telegram" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
    expect(svg).toHaveClass("custom-telegram");
  });

  it("sets accessible aria-label when provided", () => {
    const { getByLabelText } = render(<TelegramIcon aria-label="Telegram" />);
    const svg = getByLabelText("Telegram");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("renders telegram paper plane path", () => {
    const { container } = render(<TelegramIcon color="#229ed9" />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("fill", "currentColor");
  });
});
