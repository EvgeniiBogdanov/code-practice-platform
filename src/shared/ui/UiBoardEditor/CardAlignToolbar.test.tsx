import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardAlignToolbar } from "./CardAlignToolbar";

describe("CardAlignToolbar", () => {
  it("offers left, centre and right and marks the current one", () => {
    render(<CardAlignToolbar value="center" onChange={vi.fn()} />);

    expect(screen.getByRole("group", { name: "Положение текста" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Текст слева" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Текст по центру" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Текст справа" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("reports the chosen position", () => {
    const onChange = vi.fn();
    render(<CardAlignToolbar value="left" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Текст справа" }));

    expect(onChange).toHaveBeenCalledWith("right");
  });
});
