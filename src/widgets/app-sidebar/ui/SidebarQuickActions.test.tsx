import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUIStore } from "@/entities/ui-state";
import { Tooltip } from "@/shared/ui";
import { SidebarQuickActions } from "./SidebarQuickActions";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("SidebarQuickActions", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useUIStore.setState({
      cheatSheetOpen: false,
      paletteOpen: false,
      statsModalOpen: false,
    });
  });

  it("renders the requested actions in order and spreads them across four columns", () => {
    const { container } = render(
      <Tooltip.Provider>
        <SidebarQuickActions section="react" currentTaskId="react-basics" />
      </Tooltip.Provider>
    );

    expect(
      screen.getAllByRole("button").map((button) => button.getAttribute("aria-label"))
    ).toEqual([
      "Статистика повторений",
      "Шпаргалка",
      "Поиск по задачам (Cmd+K)",
      "Открыть избранное",
    ]);
    expect(container.querySelector("[class*=quickActions]")).toBeInTheDocument();
  });

  it("opens the corresponding UI state from the sidebar", () => {
    render(
      <Tooltip.Provider>
        <SidebarQuickActions section="react" currentTaskId="react-basics" />
      </Tooltip.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Статистика повторений" }));
    fireEvent.click(screen.getByRole("button", { name: "Шпаргалка" }));
    fireEvent.click(screen.getByRole("button", { name: "Поиск по задачам (Cmd+K)" }));

    expect(useUIStore.getState().statsModalOpen).toBe(true);
    expect(useUIStore.getState().cheatSheetOpen).toBe(true);
    expect(useUIStore.getState().paletteOpen).toBe(true);
  });
});
