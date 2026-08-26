import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpacedRepetitionTabBar } from "./SpacedRepetitionTabBar";

describe("SpacedRepetitionTabBar", () => {
  it("renders all tabs with correct counts", () => {
    const onSelectTab = vi.fn();
    render(
      <SpacedRepetitionTabBar
        activeTab="distribution"
        dueTasksCount={3}
        upcomingTasksCount={5}
        unsolvedTasksCount={12}
        onSelectTab={onSelectTab}
      />
    );

    expect(screen.getByText("Статистика")).toBeInTheDocument();
    expect(screen.getByText("Графики")).toBeInTheDocument();
    expect(screen.getByText("Повтор")).toBeInTheDocument();
    expect(screen.getByText("В очереди")).toBeInTheDocument();
    expect(screen.getByText("Нерешенные")).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("calls onSelectTab with 'unsolved' when clicking on Нерешенные tab", () => {
    const onSelectTab = vi.fn();
    render(
      <SpacedRepetitionTabBar
        activeTab="distribution"
        dueTasksCount={0}
        upcomingTasksCount={0}
        unsolvedTasksCount={7}
        onSelectTab={onSelectTab}
      />
    );

    const unsolvedBtn = screen.getByRole("tab", { name: /нерешенные/i });
    fireEvent.click(unsolvedBtn);

    expect(onSelectTab).toHaveBeenCalledWith("unsolved");
  });
});
