import React, { useRef, useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useSidebarKeyboardNav } from "./use-sidebar-keyboard-nav";

const TestSidebarTree = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useSidebarKeyboardNav(containerRef);

  const [g1Open, setG1Open] = useState(false);
  const [g2Open, setG2Open] = useState(true);

  return (
    <div ref={containerRef} role="tree" data-testid="tree-root">
      <div className="treeGroupBlock">
        <a href="#group1" className="treeNodeHeader" data-tree-node="true" data-testid="node-g1">
          <div
            className="toggleWrapper"
            data-toggle-btn="true"
            data-expanded={g1Open ? "true" : "false"}
            onClick={() => setG1Open(!g1Open)}
            data-testid="toggle-g1"
          >
            <span className={g1Open ? "iconChevron expanded" : "iconChevron"} />
          </div>
          Группа 1
        </a>
        <div
          data-task-list-wrapper="true"
          data-expanded={g1Open ? "true" : "false"}
          className={g1Open ? "taskListWrapper expanded" : "taskListWrapper collapsed"}
        >
          <a href="#task1" className="treeNodeHeader" data-tree-node="true" data-testid="node-t1">
            Задача 1
          </a>
          <a href="#task2" className="treeNodeHeader" data-tree-node="true" data-testid="node-t2">
            Задача 2
          </a>
        </div>
      </div>
      <div className="treeGroupBlock">
        <a href="#group2" className="treeNodeHeader" data-tree-node="true" data-testid="node-g2">
          <div
            className="toggleWrapper"
            data-toggle-btn="true"
            data-expanded={g2Open ? "true" : "false"}
            onClick={() => setG2Open(!g2Open)}
            data-testid="toggle-g2"
          >
            <span className={g2Open ? "iconChevron expanded" : "iconChevron"} />
          </div>
          Группа 2
        </a>
        <div
          data-task-list-wrapper="true"
          data-expanded={g2Open ? "true" : "false"}
          className={g2Open ? "taskListWrapper expanded" : "taskListWrapper collapsed"}
        >
          <a href="#task3" className="treeNodeHeader" data-tree-node="true" data-testid="node-t3">
            Задача 3
          </a>
        </div>
      </div>
    </div>
  );
};

describe("useSidebarKeyboardNav", () => {
  it("navigates down and up with ArrowDown and ArrowUp", () => {
    render(<TestSidebarTree />);
    const nodeG1 = screen.getByTestId("node-g1");
    const nodeG2 = screen.getByTestId("node-g2");
    const nodeT3 = screen.getByTestId("node-t3");

    nodeG1.focus();
    expect(document.activeElement).toBe(nodeG1);

    // Group 1 is closed, so ArrowDown jumps to Group 2
    fireEvent.keyDown(nodeG1, { key: "ArrowDown" });
    expect(document.activeElement).toBe(nodeG2);

    // Group 2 is open, so ArrowDown moves into Task 3
    fireEvent.keyDown(nodeG2, { key: "ArrowDown" });
    expect(document.activeElement).toBe(nodeT3);

    fireEvent.keyDown(nodeT3, { key: "ArrowUp" });
    expect(document.activeElement).toBe(nodeG2);
  });

  it("expands folder on first ArrowRight and moves to child on second ArrowRight", () => {
    render(<TestSidebarTree />);
    const nodeG1 = screen.getByTestId("node-g1");
    const toggleG1 = screen.getByTestId("toggle-g1");

    nodeG1.focus();
    expect(toggleG1).toHaveAttribute("data-expanded", "false");

    // First ArrowRight -> expands Group 1
    fireEvent.keyDown(nodeG1, { key: "ArrowRight" });
    expect(toggleG1).toHaveAttribute("data-expanded", "true");

    // Second ArrowRight -> moves focus to first child (Task 1)
    const nodeT1 = screen.getByTestId("node-t1");
    fireEvent.keyDown(nodeG1, { key: "ArrowRight" });
    expect(document.activeElement).toBe(nodeT1);
  });

  it("collapses open folder with ArrowLeft and navigates to parent from child", () => {
    render(<TestSidebarTree />);
    const nodeG2 = screen.getByTestId("node-g2");
    const nodeT3 = screen.getByTestId("node-t3");
    const toggleG2 = screen.getByTestId("toggle-g2");

    // Start on child Task 3 -> ArrowLeft moves to parent Group 2
    nodeT3.focus();
    fireEvent.keyDown(nodeT3, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(nodeG2);
    expect(toggleG2).toHaveAttribute("data-expanded", "true");

    // Press ArrowLeft on open Group 2 -> collapses Group 2
    fireEvent.keyDown(nodeG2, { key: "ArrowLeft" });
    expect(toggleG2).toHaveAttribute("data-expanded", "false");
  });

  it("jumps to start and end with Home and End keys", () => {
    render(<TestSidebarTree />);
    const nodeG1 = screen.getByTestId("node-g1");
    const nodeT3 = screen.getByTestId("node-t3");

    nodeG1.focus();
    fireEvent.keyDown(nodeG1, { key: "End" });
    expect(document.activeElement).toBe(nodeT3);

    fireEvent.keyDown(nodeT3, { key: "Home" });
    expect(document.activeElement).toBe(nodeG1);
  });
});
