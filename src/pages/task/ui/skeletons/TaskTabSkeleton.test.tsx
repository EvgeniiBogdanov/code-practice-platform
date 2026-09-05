import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskTabSkeleton } from "./TaskTabSkeleton";

describe("TaskTabSkeleton", () => {
  it("renders candidate tab skeleton by default", () => {
    const { container } = render(<TaskTabSkeleton tab="candidate" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders solution tab skeleton for solution tab", () => {
    const { container } = render(<TaskTabSkeleton tab="solution" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders materials tab skeleton for materials tab", () => {
    const { container } = render(<TaskTabSkeleton tab="materials" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders questions tab skeleton for questions tab", () => {
    const { container } = render(<TaskTabSkeleton tab="questions" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders checklist tab skeleton for checklist tab", () => {
    const { container } = render(<TaskTabSkeleton tab="checklist" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders materials tab skeleton with real task title", () => {
    const mockTask = {
      id: "test-task-2",
      title: "Полифил Promise.all",
      section: "javascript" as const,
      category: "JavaScript",
    };
    const { getByText } = render(<TaskTabSkeleton tab="materials" task={mockTask} />);
    expect(getByText("Разбор решения: Полифил Promise.all")).toBeInTheDocument();
  });

  it("renders solution tab skeleton with real solution button title", () => {
    const mockTask = {
      id: "test-task-3",
      title: "Двусвязный список",
      section: "javascript" as const,
      category: "JavaScript",
      solutions: [
        { title: "Итеративное решение", code: "code..." },
        { title: "Рекурсивное решение", code: "code..." },
      ],
    };
    const { getByText } = render(<TaskTabSkeleton tab="solution" task={mockTask} />);
    expect(getByText("Итеративное решение")).toBeInTheDocument();
    expect(getByText("Рекурсивное решение")).toBeInTheDocument();
  });

  it("renders solution tab skeleton with recommendation note accordion when present", () => {
    const mockTask = {
      id: "test-task-4",
      title: "Двусвязный список",
      section: "javascript" as const,
      category: "JavaScript",
      recommendationNote: "Итеративный подход использует O(1) памяти",
      isRecommended: true,
    };
    const { getByText } = render(<TaskTabSkeleton tab="solution" task={mockTask} />);
    expect(getByText("Рекомендуемый подход:")).toBeInTheDocument();
  });
});

