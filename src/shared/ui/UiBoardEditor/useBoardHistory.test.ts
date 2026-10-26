import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_WIDTH,
  type CardFlowNode,
  type LabeledFlowEdge,
} from "./boardModel";
import type { BoardValue } from "./boardTypes";
import { COMMIT_DELAY_MS } from "./useBoardCommit";
import { useBoardHistory } from "./useBoardHistory";

const card = (text: string): CardFlowNode => ({
  id: "n1",
  type: "card",
  position: { x: 0, y: 0 },
  data: { text, align: "left" },
});

const board = (text: string) => ({
  nodes: [
    {
      id: "n1",
      x: 0,
      y: 0,
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
      text,
      align: "left",
    },
  ],
  edges: [],
});

/** The editor keeps its edges in state, so the array is the same on every render. */
const NO_EDGES: readonly LabeledFlowEdge[] = [];

const setup = () => {
  const apply = vi.fn();
  const hook = renderHook(({ nodes }) => useBoardHistory(nodes, NO_EDGES, apply), {
    initialProps: { nodes: [card("a")] },
  });
  const edit = (text: string): void => hook.rerender({ nodes: [card(text)] });
  // Like the editor: putting a board back replaces the nodes with the restored ones.
  apply.mockImplementation((value: BoardValue) => edit(value.nodes[0]?.text ?? ""));
  const pause = (): void => {
    act(() => {
      vi.advanceTimersByTime(COMMIT_DELAY_MS);
    });
  };
  return { apply, hook, edit, pause };
};

describe("useBoardHistory", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with nothing to undo or redo", () => {
    const { hook } = setup();
    expect(hook.result.current).toMatchObject({ canUndo: false, canRedo: false });
  });

  it("records a burst of edits as one step", () => {
    const { apply, hook, edit, pause } = setup();
    edit("ab");
    edit("abc");
    pause();
    expect(hook.result.current.canUndo).toBe(true);

    act(() => hook.result.current.undo());
    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith(board("a"));
    expect(hook.result.current.canUndo).toBe(false);
  });

  it("redoes what was undone", () => {
    const { apply, hook, edit, pause } = setup();
    edit("abc");
    pause();
    act(() => hook.result.current.undo());
    expect(hook.result.current.canRedo).toBe(true);

    act(() => hook.result.current.redo());
    expect(apply).toHaveBeenLastCalledWith(board("abc"));
    expect(hook.result.current).toMatchObject({ canUndo: true, canRedo: false });
  });

  it("drops the redo line when a new edit follows an undo", () => {
    const { hook, edit, pause } = setup();
    edit("abc");
    pause();
    act(() => hook.result.current.undo());
    edit("other");
    pause();
    expect(hook.result.current.canRedo).toBe(false);
  });

  it("turns an edit that has not settled yet into its own step when undoing", () => {
    const { apply, hook, edit } = setup();
    edit("ab");
    act(() => hook.result.current.undo());
    expect(apply).toHaveBeenCalledWith(board("a"));
    expect(hook.result.current.canRedo).toBe(true);
  });

  it("ignores changes that leave the board the same", () => {
    const { hook, edit, pause } = setup();
    edit("a");
    pause();
    expect(hook.result.current.canUndo).toBe(false);
  });
});
