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

describe("SuggestionsDropdown accessibility", () => {
  const items: CompletionItem[] = ["map", "filter"].map((label) => ({
    prefix: label,
    label,
    detail: "",
    insertText: label,
    kind: "method",
  }));

  it("is a listbox of options with the selected one marked", () => {
    render(
      <SuggestionsDropdown
        id="list"
        items={items}
        selectedIndex={1}
        position={{ top: 0, left: 0 }}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("listbox", { name: "Подсказки" })).toHaveAttribute("id", "list");
    const options = screen.getAllByRole("option");
    expect(options.map((option) => option.id)).toEqual(["list-option-0", "list-option-1"]);
    expect(options.map((option) => option.getAttribute("aria-selected"))).toEqual([
      "false",
      "true",
    ]);
  });
});

describe("SuggestionsDropdown presentation", () => {
  const items: CompletionItem[] = [
    {
      prefix: "map",
      label: "map",
      detail: "Array.prototype.map()",
      insertText: "map",
      kind: "method",
    },
    { prefix: "name", label: "name", detail: "", insertText: "name", kind: "property" },
    {
      prefix: "useState",
      label: "useState",
      detail: "Auto-import from 'react'",
      insertText: "useState",
      kind: "function",
      autoImport: { symbol: "useState", module: "react", isDefault: false },
    },
  ];
  const renderList = (selectedIndex: number): ReturnType<typeof render> =>
    render(
      <SuggestionsDropdown
        items={items}
        selectedIndex={selectedIndex}
        position={{ top: 0, left: 0 }}
        onSelect={vi.fn()}
      />
    );

  it("names the kind of each item and the module of an auto-import", () => {
    renderList(0);
    expect(screen.getByText("Метод")).toBeInTheDocument();
    expect(screen.getByText("Свойство")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("describes the selected item in the footer and falls back to its kind", () => {
    const { container, rerender } = renderList(0);
    const footer = (): string => container.querySelector("[class*='footer']")?.textContent ?? "";
    expect(footer()).toContain("Array.prototype.map()");

    rerender(
      <SuggestionsDropdown
        items={items}
        selectedIndex={1}
        position={{ top: 0, left: 0 }}
        onSelect={vi.fn()}
      />
    );
    expect(footer()).toContain("Свойство");
  });

  it("reminds of the navigation keys without adding them to the options", () => {
    renderList(0);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByText("Tab")).toBeInTheDocument();
  });
});
