import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import { Tooltip } from "@/shared/ui";
import { SidebarFavorites } from "./SidebarFavorites";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("SidebarFavorites", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useFavoriteTaskStore.setState({ favoriteTaskIds: [] });
  });

  it("always renders as a square navigation button even when favorites are empty", () => {
    const { container } = render(
      <Tooltip.Provider>
        <SidebarFavorites section="react" currentTaskId="favorites" />
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Открыть избранное" });
    expect(button).toHaveClass(/squareButton/);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("aria-current", "page");
    expect(button.querySelector("svg")).toHaveClass(/favoriteIcon/);
    expect(button.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    expect(screen.queryByText("Избранное")).not.toBeInTheDocument();
    expect(container.querySelector('[data-toggle-btn="true"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-task-list-wrapper="true"]')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/react/favorites" });
  });

  it("does not render a label outside the favorites page", () => {
    render(
      <Tooltip.Provider>
        <SidebarFavorites section="react" currentTaskId="react-basics" />
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Открыть избранное" });
    expect(button).not.toHaveAttribute("aria-current");
    expect(button.querySelector("svg")).toHaveAttribute("fill", "none");
    expect(screen.queryByText("Избранное")).not.toBeInTheDocument();
  });
});
