import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Tabs, TabItem } from "./Tabs";

describe("Tabs", () => {
  const defaultItems: TabItem[] = [
    { id: "tab1", label: "Вкладка 1" },
    { id: "tab2", label: "Вкладка 2", badge: 5, badgeVariant: "yellow" },
    { id: "tab3", label: "Вкладка 3", badge: "NEW" },
  ];

  it("renders all tabs with correct labels", () => {
    render(<Tabs items={defaultItems} activeId="tab1" onChange={vi.fn()} />);
    expect(screen.getByText("Вкладка 1")).toBeInTheDocument();
    expect(screen.getByText("Вкладка 2")).toBeInTheDocument();
    expect(screen.getByText("Вкладка 3")).toBeInTheDocument();
  });

  it("renders NotificationBadge for numeric and string badges", () => {
    render(<Tabs items={defaultItems} activeId="tab1" onChange={vi.fn()} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("triggers onChange when a tab is clicked", () => {
    const handleChange = vi.fn();
    render(<Tabs items={defaultItems} activeId="tab1" onChange={handleChange} />);
    fireEvent.click(screen.getByText("Вкладка 2"));
    expect(handleChange).toHaveBeenCalledWith("tab2");
  });

  it("renders custom ReactElement badge directly", () => {
    const items: TabItem[] = [
      {
        id: "tab-custom",
        label: "Кастомная",
        badge: <span data-testid="custom-badge">Custom</span>,
      },
    ];
    render(<Tabs items={items} activeId="tab-custom" onChange={vi.fn()} />);
    expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
  });
});
