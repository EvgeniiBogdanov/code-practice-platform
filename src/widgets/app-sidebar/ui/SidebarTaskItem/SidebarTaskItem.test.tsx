import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "@/shared/ui";
import { SidebarTaskItem } from "./SidebarTaskItem";
import styles from "./SidebarTaskItem.module.css";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    ...rest
  }: {
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }): React.JSX.Element => (
    <a className={className} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ),
}));

describe("SidebarTaskItem", () => {
  it("renders solved checkmark when task is solved and not excluded", () => {
    render(
      <Tooltip.Provider>
        <SidebarTaskItem
          id="task-1"
          to="/javascript/$taskId"
          params={{ taskId: "task-1" }}
          title="Тестовая задача"
          isActive={false}
          isSolved={true}
          isUnsolved={false}
          isDue={false}
          isExcluded={false}
        />
      </Tooltip.Provider>
    );

    expect(screen.getByLabelText("Решено")).toBeInTheDocument();
  });

  it("renders unsolved cross icon when task is unsolved and not excluded", () => {
    render(
      <Tooltip.Provider>
        <SidebarTaskItem
          id="task-1"
          to="/javascript/$taskId"
          params={{ taskId: "task-1" }}
          title="Тестовая задача"
          isActive={false}
          isSolved={false}
          isUnsolved={true}
          isDue={false}
          isExcluded={false}
        />
      </Tooltip.Provider>
    );

    expect(screen.getByLabelText("Не решено")).toBeInTheDocument();
  });

  it("does not render checkmark or cross icon when task is excluded", () => {
    const { rerender } = render(
      <Tooltip.Provider>
        <SidebarTaskItem
          id="task-1"
          to="/javascript/$taskId"
          params={{ taskId: "task-1" }}
          title="Тестовая задача"
          isActive={false}
          isSolved={true}
          isUnsolved={false}
          isDue={false}
          isExcluded={true}
        />
      </Tooltip.Provider>
    );

    expect(screen.queryByLabelText("Решено")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Не решено")).not.toBeInTheDocument();

    rerender(
      <Tooltip.Provider>
        <SidebarTaskItem
          id="task-1"
          to="/javascript/$taskId"
          params={{ taskId: "task-1" }}
          title="Тестовая задача"
          isActive={false}
          isSolved={false}
          isUnsolved={true}
          isDue={false}
          isExcluded={true}
        />
      </Tooltip.Provider>
    );

    expect(screen.queryByLabelText("Решено")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Не решено")).not.toBeInTheDocument();
  });

  it("applies ratingUnsolved class even when reviewRating is 'hard'", () => {
    render(
      <Tooltip.Provider>
        <SidebarTaskItem
          id="task-unsolved-hard"
          to="/javascript/$taskId"
          params={{ taskId: "task-unsolved-hard" }}
          title="Нерешённая задача"
          isActive={false}
          isSolved={false}
          isUnsolved={true}
          isDue={false}
          isExcluded={false}
          reviewRating="hard"
        />
      </Tooltip.Provider>
    );

    const titleEl = screen.getByText("Нерешённая задача");
    expect(titleEl).toHaveClass(styles.ratingUnsolved);
    expect(titleEl).not.toHaveClass(styles.ratingHard);
  });
});
