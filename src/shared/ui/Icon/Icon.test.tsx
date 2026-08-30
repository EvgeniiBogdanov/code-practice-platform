import React, { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders icon passed via icon prop", () => {
    render(<Icon icon={<span data-testid="test-icon">icon</span>} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders icon passed via children", () => {
    render(
      <Icon>
        <span data-testid="test-children">child</span>
      </Icon>
    );
    expect(screen.getByTestId("test-children")).toBeInTheDocument();
  });

  it("applies default md size class and custom className", () => {
    const { container } = render(<Icon className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass(/size_md/);
    expect(container.firstChild).toHaveClass(/iconContainer/);
  });

  it("applies sm size class when specified", () => {
    const { container } = render(<Icon size="sm" />);
    expect(container.firstChild).toHaveClass(/size_sm/);
  });

  it("sets aria-hidden=true by default, but removes it when aria-label is provided", () => {
    const { container: container1 } = render(<Icon />);
    expect(container1.firstChild).toHaveAttribute("aria-hidden", "true");

    const { container: container2 } = render(<Icon aria-label="Search" />);
    expect(container2.firstChild).not.toHaveAttribute("aria-hidden");
    expect(container2.firstChild).toHaveAttribute("aria-label", "Search");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
