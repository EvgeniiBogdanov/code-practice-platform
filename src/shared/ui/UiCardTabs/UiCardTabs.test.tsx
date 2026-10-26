import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getCardTabId } from "./cardTabId";
import { UiCardTabs, type CardTabItem } from "./UiCardTabs";

const items: CardTabItem[] = [
  { id: "one", label: "Первая", icon: <svg data-testid="icon-one" />, accent: "green" },
  { id: "two", label: "Вторая", icon: <svg data-testid="icon-two" />, accent: "blue" },
];

const renderTabs = (onChange = vi.fn()): void => {
  render(
    <UiCardTabs items={items} activeId="two" onChange={onChange} ariaLabel="Разделы" panelId="p" />
  );
};

describe("UiCardTabs", () => {
  it("marks the active tab and wires every tab to the panel", () => {
    renderTabs();

    expect(screen.getByRole("tablist", { name: "Разделы" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Вторая" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Первая" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Первая" })).toHaveAttribute("aria-controls", "p");
    expect(screen.getByRole("tab", { name: "Первая" })).toHaveAttribute(
      "id",
      getCardTabId("p", "one")
    );
  });

  it("shows the icon of every tab", () => {
    renderTabs();
    expect(screen.getByTestId("icon-one")).toBeInTheDocument();
    expect(screen.getByTestId("icon-two")).toBeInTheDocument();
  });

  it("reports the chosen tab", () => {
    const onChange = vi.fn();
    renderTabs(onChange);

    fireEvent.click(screen.getByRole("tab", { name: "Первая" }));

    expect(onChange).toHaveBeenCalledWith("one");
  });
});
