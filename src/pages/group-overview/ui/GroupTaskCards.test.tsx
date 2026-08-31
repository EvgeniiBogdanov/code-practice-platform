import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Task } from "@/entities/task";
import { GroupTaskCards, GroupTaskCardSkeleton } from "./GroupTaskCards";

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Тестовая задача 1",
    desc: "Описание тестовой задачи 1",
    section: "javascript",
    group: "Функции",
    subgroup: "Замыкания",
    difficulty: "medium",
  },
  {
    id: "task-2",
    title: "Тестовая задача 2",
    desc: "Описание тестовой задачи 2",
    section: "javascript",
    group: "Функции",
    subgroup: "Замыкания",
    difficulty: "easy",
  },
];

describe("GroupTaskCards", () => {
  it("renders GroupTaskCardSkeleton when isLoading is true", () => {
    const { container } = render(
      <GroupTaskCards
        tasks={mockTasks}
        taskRoute="/javascript/$taskId"
        groupTitle="Функции"
        getTaskStatus={() => "unstarted"}
        getTaskGradientClass={() => ""}
        getTaskTooltipTitle={() => ""}
        formatLastSolved={() => null}
        formatNextReviewDate={() => null}
        isTaskDue={() => false}
        reviews={{}}
        isLoading={true}
      />
    );

    // Should render skeletons and not real task titles
    expect(screen.queryByText("Тестовая задача 1")).toBeNull();
    expect(screen.queryByText("Тестовая задача 2")).toBeNull();
    expect(container.querySelectorAll("[class*='skeleton']").length).toBeGreaterThan(0);
  });

  it("renders standalone GroupTaskCardSkeleton correctly", () => {
    const { container } = render(<GroupTaskCardSkeleton />);
    expect(container.querySelectorAll("[class*='skeleton']").length).toBeGreaterThan(0);
  });
});
