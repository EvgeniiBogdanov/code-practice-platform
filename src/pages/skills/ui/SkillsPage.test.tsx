import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useSkillMapPrefsStore } from "../model/skillMapPrefsStore";
import { SkillsPage } from "./SkillsPage";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
  Link: ({ children, ...props }: { children: React.ReactNode }) => <a {...props}>{children}</a>,
}));

const viewGroup = (): HTMLElement => screen.getByRole("group", { name: "Вид маршрута" });
const filterGroup = (): HTMLElement => screen.getByRole("group", { name: "Фильтр навыков" });

const cardOf = (container: HTMLElement, skillId: string): HTMLElement => {
  const card = container.querySelector<HTMLElement>(`[data-skill-id="${skillId}"]`);
  if (!card) throw new Error(`no card for ${skillId}`);
  return card;
};

describe("SkillsPage", () => {
  beforeEach(() => {
    navigate.mockClear();
    localStorage.clear();
    useSkillMapPrefsStore.setState({ filter: "all", view: null });
    useProgressStore.setState({ completedTasks: {} });
    useReviewStore.setState({ reviews: {}, excludedTaskIds: [] });
  });

  it("closes the open skill with Escape and keeps the chosen view", () => {
    render(<SkillsPage section="javascript" skill="js.this" view="list" />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/javascript/skills",
        search: { skill: undefined, view: "list" },
      })
    );
  });

  it("ignores Escape when no skill is open", () => {
    render(<SkillsPage section="javascript" view="list" />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(navigate).not.toHaveBeenCalled();
  });

  it("opens the view and the filter the user picked last", () => {
    useSkillMapPrefsStore.setState({ filter: "weak", view: "list" });

    render(<SkillsPage section="javascript" />);

    expect(within(viewGroup()).getByRole("button", { name: "Список" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(within(filterGroup()).getByRole("button", { name: "Слабые" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("opens a card on the first click", () => {
    const { container } = render(<SkillsPage section="javascript" />);

    fireEvent.click(cardOf(container, "js.scope"));

    expect(navigate).toHaveBeenCalledWith(
      expect.objectContaining({ search: { skill: "js.scope" } })
    );
  });

  it("closes the open card on a second click on it", () => {
    const { container } = render(<SkillsPage section="javascript" skill="js.scope" />);

    fireEvent.click(cardOf(container, "js.scope"));

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(
      expect.objectContaining({ search: { skill: undefined, view: undefined } })
    );
  });

  it("closes the open card on a click in the empty space around the cards", () => {
    const { container } = render(<SkillsPage section="javascript" skill="js.scope" />);

    // The row holding a card is empty space around it.
    fireEvent.click(cardOf(container, "js.scope").parentElement as HTMLElement);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(
      expect.objectContaining({ search: { skill: undefined, view: undefined } })
    );
  });

  it("remembers the filter and the view the user clicks", () => {
    render(<SkillsPage section="javascript" />);

    fireEvent.click(within(filterGroup()).getByRole("button", { name: "Не начаты" }));
    fireEvent.click(within(viewGroup()).getByRole("button", { name: "Список" }));

    expect(useSkillMapPrefsStore.getState()).toMatchObject({ filter: "new", view: "list" });
    const saved = JSON.parse(localStorage.getItem("playground_skill_map") ?? "{}");
    expect(saved.state).toEqual({ filter: "new", view: "list" });
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ search: { view: "list" } }));
  });
});
