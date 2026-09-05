import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaBadge, MetaRow } from "./MetaBadge";

describe("MetaBadge", () => {
  it("renders children text correctly", () => {
    render(<MetaBadge>JavaScript</MetaBadge>);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("renders 0 correctly inside text span", () => {
    const { container } = render(<MetaBadge>{0}</MetaBadge>);
    const textSpan = container.querySelector('[class*="text"]');
    expect(textSpan).toBeInTheDocument();
    expect(textSpan).toHaveTextContent("0");
  });

  it("renders icon properly alongside text", () => {
    const { container } = render(
      <MetaBadge icon={<svg data-testid="meta-icon" />}>With Icon</MetaBadge>
    );
    expect(screen.getByTestId("meta-icon")).toBeInTheDocument();
    expect(screen.getByText("With Icon")).toBeInTheDocument();
    const iconSpan = container.querySelector('[class*="icon"]');
    expect(iconSpan).toBeInTheDocument();
  });

  it("applies variant classes accurately", () => {
    const { container } = render(<MetaBadge variant="blue">Blue Tag</MetaBadge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/variant-blue/);
  });

  it("falls back to variant-default when given unknown variant", () => {
    // @ts-expect-error testing runtime fallback
    const { container } = render(<MetaBadge variant="non-existent">Fallback</MetaBadge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/variant-default/);
  });

  it("forwards ref to the underlying element", () => {
    let spanRef: HTMLSpanElement | null = null;
    render(
      <MetaBadge
        ref={(el) => {
          spanRef = el;
        }}
      >
        Ref MetaBadge
      </MetaBadge>
    );
    expect(spanRef).toBeInstanceOf(HTMLSpanElement);
  });
});

describe("MetaRow", () => {
  it("renders multiple MetaBadges inside a row", () => {
    render(
      <MetaRow>
        <MetaBadge>Tag 1</MetaBadge>
        <MetaBadge>Tag 2</MetaBadge>
      </MetaRow>
    );
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
  });

  it("forwards ref to div element", () => {
    let divRef: HTMLDivElement | null = null;
    render(
      <MetaRow
        ref={(el) => {
          divRef = el;
        }}
      >
        <span>Content</span>
      </MetaRow>
    );
    expect(divRef).toBeInstanceOf(HTMLDivElement);
  });
});
