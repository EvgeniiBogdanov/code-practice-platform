import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskListWrapper } from "./TaskListWrapper";

describe("TaskListWrapper", () => {
  it("does not mount collapsed task content", () => {
    render(
      <TaskListWrapper expanded={false}>
        <span>Скрытая задача</span>
      </TaskListWrapper>
    );

    expect(screen.queryByText("Скрытая задача")).not.toBeInTheDocument();
  });

  it("mounts task content when expanded", () => {
    render(
      <TaskListWrapper expanded={true}>
        <span>Открытая задача</span>
      </TaskListWrapper>
    );

    expect(screen.getByText("Открытая задача")).toBeInTheDocument();
  });
});
