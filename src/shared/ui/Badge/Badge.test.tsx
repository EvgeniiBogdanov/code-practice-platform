import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("renders 0 inside label correctly", () => {
    const { container } = render(<Badge>{0}</Badge>);
    const label = container.querySelector('[class*="label"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("0");
  });

  it("applies variant and size classes", () => {
    const { container } = render(
      <Badge variant="gray" size="sm">
        10
      </Badge>
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/variant-gray/);
    expect(badge.className).toMatch(/size-sm/);
  });

  it("respects uppercase prop", () => {
    const { container: upperContainer } = render(<Badge uppercase>upper</Badge>);
    expect((upperContainer.firstChild as HTMLElement).className).toMatch(/uppercase/);

    const { container: normalContainer } = render(
      <Badge uppercase={false}>normal</Badge>
    );
    expect((normalContainer.firstChild as HTMLElement).className).not.toMatch(/uppercase/);
  });
});
