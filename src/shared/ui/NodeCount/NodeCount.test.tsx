import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NodeCount } from "./NodeCount";

describe("NodeCount", () => {
  it("renders completed/total count properly", () => {
    render(<NodeCount completed={3} total={10} />);
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("applies completed class when all tasks are completed", () => {
    const { container } = render(<NodeCount completed={5} total={5} />);
    expect(container.firstChild).toHaveClass(/completed/);
  });

  it("applies completed class when isCompleted prop is true", () => {
    const { container } = render(<NodeCount completed={2} total={5} isCompleted />);
    expect(container.firstChild).toHaveClass(/completed/);
  });

  it("supports custom completedClass and custom className", () => {
    const { container } = render(
      <NodeCount completed={2} total={5} completedClass="completedYellow" className="custom-test" />
    );
    expect(container.firstChild).toHaveClass("custom-test");
    expect(container.firstChild).toHaveClass(/completedYellow/);
  });
});
