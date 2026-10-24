import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { computeAllSkillStats, getSkillById } from "@/entities/skill";
import { getRelatedSkills, getSkillGraphLayout } from "../../lib/skillGraphLayout";
import { getSkillVisual } from "../../lib/skillVisual";
import styles from "../SkillNode/SkillNode.module.css";
import graphStyles from "./SkillGraph.module.css";
import { SkillGraph } from "./SkillGraph";

const renderGraph = (selectedId: string | null, onDeselect = vi.fn()) => {
  const stats = computeAllSkillStats({
    statuses: {},
    reviews: {},
    excluded: new Set(),
    now: Date.now(),
  });
  return render(
    <SkillGraph
      section="javascript"
      stats={stats}
      selectedId={selectedId}
      filter="all"
      onSelect={vi.fn()}
      onDeselect={onDeselect}
    />
  );
};

const cardOf = (container: HTMLElement, skillId: string): HTMLElement => {
  const card = container.querySelector<HTMLElement>(`[data-skill-id="${skillId}"]`);
  if (!card) throw new Error(`no card for ${skillId}`);
  return card;
};

const emptySpaceOf = (container: HTMLElement): HTMLElement => {
  const scroller = container.querySelector<HTMLElement>(`.${graphStyles.scroller}`);
  if (!scroller) throw new Error("no graph scroller");
  return scroller;
};

describe("SkillGraph", () => {
  it("clears the open skill on a click in the empty space around the cards", () => {
    const onDeselect = vi.fn();
    const { container } = renderGraph("js.scope", onDeselect);

    fireEvent.click(emptySpaceOf(container));

    expect(onDeselect).toHaveBeenCalledTimes(1);
  });

  it("keeps the open skill when a click lands on a card", () => {
    const onDeselect = vi.fn();
    const { container } = renderGraph("js.scope", onDeselect);

    fireEvent.click(cardOf(container, "js.scope"));

    expect(onDeselect).not.toHaveBeenCalled();
  });

  it("ignores clicks on the empty space when no skill is open", () => {
    const onDeselect = vi.fn();
    const { container } = renderGraph(null, onDeselect);

    fireEvent.click(emptySpaceOf(container));

    expect(onDeselect).not.toHaveBeenCalled();
  });

  it("colours every edge with the group of the prerequisite it leads from", () => {
    const { container } = renderGraph(null);

    const { edges } = getSkillGraphLayout("javascript");
    const paths = container.querySelectorAll("path[stroke]");

    expect(paths).toHaveLength(edges.length);
    edges.forEach(({ from }, index) => {
      const skill = getSkillById(from);
      if (!skill) throw new Error(`unknown skill ${from}`);
      expect(paths[index]).toHaveAttribute("stroke", getSkillVisual(skill).color);
    });
  });

  it("fades every card outside the chain of the open skill", () => {
    const selectedId = "js.scope";
    const chain = getRelatedSkills(selectedId, getSkillGraphLayout("javascript").edges);
    expect(chain.size).toBeGreaterThan(1);

    const { container } = renderGraph(selectedId);

    const cards = [...container.querySelectorAll<HTMLElement>("[data-skill-id]")];
    expect(styles.muted).toBeTruthy();
    cards.forEach((card) => {
      const skillId = card.dataset.skillId ?? "";
      if (chain.has(skillId)) expect(card).not.toHaveClass(styles.muted);
      else expect(card).toHaveClass(styles.muted);
    });
  });

  it("keeps every card at full strength when no skill is open", () => {
    const { container } = renderGraph(null);

    container.querySelectorAll("[data-skill-id]").forEach((card) => {
      expect(card).not.toHaveClass(styles.muted);
    });
  });
});
