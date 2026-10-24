import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SkillsToolbar } from "./SkillsToolbar";

const renderToolbar = (overrides: Partial<Parameters<typeof SkillsToolbar>[0]> = {}) => {
  const props = {
    filter: "all" as const,
    onFilterChange: vi.fn(),
    view: "graph" as const,
    onViewChange: vi.fn(),
    ...overrides,
  };
  render(<SkillsToolbar {...props} />);
  return props;
};

describe("SkillsToolbar", () => {
  it("marks the chosen filter and view as pressed", () => {
    renderToolbar({ filter: "weak", view: "list" });

    const filters = screen.getByRole("group", { name: "Фильтр навыков" });
    expect(within(filters).getByRole("button", { name: "Слабые" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(within(filters).getByRole("button", { name: "Все" })).not.toHaveAttribute(
      "aria-pressed"
    );
    const views = screen.getByRole("group", { name: "Вид маршрута" });
    expect(within(views).getByRole("button", { name: "Список" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("reports the filter and the view the user picks", () => {
    const props = renderToolbar();

    fireEvent.click(screen.getByRole("button", { name: "Угасают" }));
    fireEvent.click(screen.getByRole("button", { name: "Список" }));

    expect(props.onFilterChange).toHaveBeenCalledWith("fading");
    expect(props.onViewChange).toHaveBeenCalledWith("list");
  });
});
