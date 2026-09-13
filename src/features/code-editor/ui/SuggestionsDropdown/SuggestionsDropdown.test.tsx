import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SuggestionsDropdown } from "./SuggestionsDropdown";
import { CompletionItem } from "@/shared/lib/code-editor";

describe("SuggestionsDropdown", () => {
  const mockItems: CompletionItem[] = [
    {
      prefix: "map",
      label: "map",
      detail: "Array.prototype.map()",
      insertText: "map()",
      kind: "method",
    },
    {
      prefix: "filter",
      label: "filter",
      detail: "Array.prototype.filter()",
      insertText: "filter()",
      kind: "method",
    },
    {
      prefix: "reduce",
      label: "reduce",
      detail: "Array.prototype.reduce()",
      insertText: "reduce()",
      kind: "method",
    },
  ];

  it("renders completion items correctly", () => {
    render(
      <SuggestionsDropdown
        items={mockItems}
        selectedIndex={0}
        position={{ top: 50, left: 100 }}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("map")).toBeInTheDocument();
    expect(screen.getByText("filter")).toBeInTheDocument();
    expect(screen.getByText("reduce")).toBeInTheDocument();
  });

  it("calls onSelect with clicked item on mouse down", () => {
    const onSelect = vi.fn();
    render(
      <SuggestionsDropdown
        items={mockItems}
        selectedIndex={0}
        position={{ top: 50, left: 100 }}
        onSelect={onSelect}
      />
    );

    const reduceItem = screen.getByText("reduce");
    fireEvent.mouseDown(reduceItem);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockItems[2]);
  });

  it("calls onHover with index on mouse enter", () => {
    const onHover = vi.fn();
    render(
      <SuggestionsDropdown
        items={mockItems}
        selectedIndex={0}
        position={{ top: 50, left: 100 }}
        onSelect={vi.fn()}
        onHover={onHover}
      />
    );

    const filterItem = screen.getByText("filter");
    fireEvent.mouseEnter(filterItem);

    expect(onHover).toHaveBeenCalledWith(1);
  });

  it("applies placement='top' styles and transform to position above text", () => {
    const { container } = render(
      <SuggestionsDropdown
        items={mockItems}
        selectedIndex={0}
        position={{ top: 200, left: 50, placement: "top", maxHeight: 180 }}
        onSelect={vi.fn()}
      />
    );

    const dropdown = container.firstElementChild as HTMLElement;
    expect(dropdown).toHaveAttribute("data-placement", "top");
    expect(dropdown.style.top).toBe("200px");
    expect(dropdown.style.left).toBe("50px");
    expect(dropdown.style.transform).toBe("translateY(-100%)");
    expect(dropdown.style.maxHeight).toBe("180px");
  });

  it("applies placement='bottom' styles and resets transform to position below text", () => {
    const { container } = render(
      <SuggestionsDropdown
        items={mockItems}
        selectedIndex={0}
        position={{ top: 60, left: 30, placement: "bottom", maxHeight: 220 }}
        onSelect={vi.fn()}
      />
    );

    const dropdown = container.firstElementChild as HTMLElement;
    expect(dropdown).toHaveAttribute("data-placement", "bottom");
    expect(dropdown.style.top).toBe("60px");
    expect(dropdown.style.left).toBe("30px");
    expect(dropdown.style.transform).toBe("none");
    expect(dropdown.style.maxHeight).toBe("220px");
  });
});
