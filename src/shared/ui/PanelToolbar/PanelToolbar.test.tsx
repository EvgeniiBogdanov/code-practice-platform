import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PanelToolbar } from "./PanelToolbar";

describe("PanelToolbar", () => {
  it("renders left, right and children content", () => {
    render(
      <PanelToolbar
        left={<span data-testid="left-content">Left</span>}
        right={<span data-testid="right-content">Right</span>}
      >
        <span data-testid="center-content">Center</span>
      </PanelToolbar>
    );

    expect(screen.getByTestId("left-content")).toHaveTextContent("Left");
    expect(screen.getByTestId("right-content")).toHaveTextContent("Right");
    expect(screen.getByTestId("center-content")).toHaveTextContent("Center");
  });

  it("applies custom className", () => {
    const { container } = render(<PanelToolbar className="custom-toolbar" />);
    expect(container.firstElementChild).toHaveClass("custom-toolbar");
  });
});
