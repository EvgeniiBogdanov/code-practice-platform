import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskPageSkeleton } from "./TaskPageSkeleton";

describe("TaskPageSkeleton", () => {
  it("renders with accessible status role", () => {
    render(<TaskPageSkeleton />);
    expect(screen.getByRole("status", { name: "Загрузка страницы задачи" })).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(<TaskPageSkeleton className="custom-skeleton-class" />);
    expect(container.firstChild).toHaveClass("custom-skeleton-class");
  });

  it("renders tab skeleton corresponding to initialTab", () => {
    const { container } = render(<TaskPageSkeleton initialTab="materials" />);
    expect(container.querySelector('[class*="articlePage"]')).toBeInTheDocument();
  });

  it("renders real title and tab names when task is provided", () => {
    const mockTask = {
      id: "test-task-1",
      title: "Реализация функции debounce",
      section: "javascript" as const,
      category: "JavaScript",
      difficulty: "middle" as const,
      questions: [{ question: "Вопрос 1?", answer: "Ответ 1" }],
      checklist: ["Проверка таймаута", "Проверка контекста"],
    };

    render(<TaskPageSkeleton task={mockTask} initialTab="checklist" />);

    expect(screen.getByText("Реализация функции debounce")).toBeInTheDocument();
    expect(screen.getByText("📋 Самопроверка")).toBeInTheDocument();
    expect(screen.getByText("Проверка таймаута")).toBeInTheDocument();
    expect(screen.getByText("Проверка контекста")).toBeInTheDocument();
    expect(screen.getByText("Разбор и теория")).toBeInTheDocument();
    expect(screen.getByText("Решено")).toBeInTheDocument();
    expect(screen.getByText("Не решено")).toBeInTheDocument();
  });

  it("renders candidate tab with real editor shell", () => {
    render(<TaskPageSkeleton initialTab="candidate" />);

    // Real gutter line 1 is rendered
    expect(screen.getByText("1")).toBeInTheDocument();
    // Real status bar items
    expect(screen.getByText("Синтаксис корректен")).toBeInTheDocument();
    expect(screen.getByText("UTF-8")).toBeInTheDocument();
    expect(screen.getByText("Консоль")).toBeInTheDocument();
  });
});
