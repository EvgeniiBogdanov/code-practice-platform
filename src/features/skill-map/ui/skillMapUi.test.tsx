import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { Tooltip } from "@/shared/ui";
import { useSkillStats } from "../model/useSkillStats";
import { SkillDetailPanel } from "./SkillDetailPanel";
import { SkillGraph } from "./SkillGraph";
import { TaskSkillChip } from "./TaskSkillChip";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    search,
    className,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    search?: Record<string, string>;
    className?: string;
  }) => (
    <a
      href={search ? `${to}?${new URLSearchParams(search).toString()}` : to}
      className={className}
      {...props}
    >
      {children}
    </a>
  ),
}));

const StatsProbe = ({
  children,
}: {
  children: (stats: ReturnType<typeof useSkillStats>) => React.ReactNode;
}): React.JSX.Element => <>{children(useSkillStats())}</>;

describe("skill map UI", () => {
  beforeEach(() => {
    // js150 and js151 belong to «this и контекст»: two unsolved tasks make it weak.
    useProgressStore.setState({ completedTasks: { js150: "unsolved", js151: "unsolved" } });
    useReviewStore.setState({ reviews: {}, excludedTaskIds: [] });
  });

  it("names every node with its mastery and state", () => {
    render(
      <StatsProbe>
        {(stats) => (
          <SkillGraph
            section="javascript"
            stats={stats}
            selectedId={null}
            filter="all"
            onSelect={vi.fn()}
            onDeselect={vi.fn()}
          />
        )}
      </StatsProbe>
    );

    expect(
      screen.getByRole("button", { name: /^this и контекст: \d+%, слабое место$/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Область видимости: 0%, не начат" })
    ).toBeInTheDocument();
  });

  it("dims the skills the filter leaves out and moves focus along the route with arrows", () => {
    const onSelect = vi.fn();
    render(
      <StatsProbe>
        {(stats) => (
          <SkillGraph
            section="javascript"
            stats={stats}
            selectedId={null}
            filter="weak"
            onSelect={onSelect}
            onDeselect={vi.fn()}
          />
        )}
      </StatsProbe>
    );

    const weak = screen.getByRole("button", { name: /^this и контекст/ });
    const scope = screen.getByRole("button", { name: /^Область видимости/ });
    expect(weak.className).not.toMatch(/dimmed/);
    expect(scope.className).toMatch(/dimmed/);

    scope.focus();
    fireEvent.keyDown(scope, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /^Замыкания/ }));
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowUp" });
    expect(document.activeElement).toBe(scope);

    fireEvent.click(weak);
    expect(onSelect).toHaveBeenCalledWith("js.this");
  });

  it("explains the mastery and opens the next task to practise", () => {
    const onSelectSkill = vi.fn();
    render(
      <StatsProbe>
        {(stats) => (
          <SkillDetailPanel skillId="js.this" stats={stats} onSelectSkill={onSelectSkill} />
        )}
      </StatsProbe>
    );

    const panel = screen.getByRole("region", { name: "this и контекст" });
    expect(within(panel).getByText("Слабое место")).toBeInTheDocument();
    expect(within(panel).getByText("2 задачи отмечены «не решено»")).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /^Практиковать:/ })).toHaveAttribute(
      "href",
      "/javascript/js150"
    );

    fireEvent.click(within(panel).getByRole("button", { name: /Замыкания · 0%/ }));
    expect(onSelectSkill).toHaveBeenCalledWith("js.closures");
  });

  it("shows the task's skill with its mastery and links it to the map", () => {
    render(
      <Tooltip.Provider>
        <TaskSkillChip taskId="js150" />
      </Tooltip.Provider>
    );

    const chip = screen.getByRole("link", { name: /^Навык «this и контекст», \d+%, слабое место/ });
    expect(chip).toHaveAttribute("href", "/javascript/skills?skill=js.this");
    expect(chip).toHaveTextContent(/^Прогресс навыка · \d+%$/);
  });

  it("renders nothing for a task outside the skill index", () => {
    const { container } = render(<TaskSkillChip taskId="no-such-task" />);
    expect(container).toBeEmptyDOMElement();
  });
});
