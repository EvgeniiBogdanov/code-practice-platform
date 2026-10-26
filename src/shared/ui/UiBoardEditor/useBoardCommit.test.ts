import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_CARD_HEIGHT, DEFAULT_CARD_WIDTH, type CardFlowNode } from "./boardModel";
import { useBoardCommit } from "./useBoardCommit";

const card = (text: string): CardFlowNode => ({
  id: "n1",
  type: "card",
  position: { x: 0, y: 0 },
  data: { text, align: "left" },
});

const saved = (text: string) => ({
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

describe("useBoardCommit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not report the board it was opened with", () => {
    const onChange = vi.fn();
    renderHook(() => useBoardCommit([card("a")], [], onChange));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports a burst of edits once, after a pause", () => {
    const onChange = vi.fn();
    const { rerender } = renderHook(({ nodes }) => useBoardCommit(nodes, [], onChange), {
      initialProps: { nodes: [card("a")] },
    });
    rerender({ nodes: [card("ab")] });
    rerender({ nodes: [card("abc")] });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(saved("abc"));
  });

  it("does not report a change that leaves the saved board the same", () => {
    const onChange = vi.fn();
    const { rerender } = renderHook(({ nodes }) => useBoardCommit(nodes, [], onChange), {
      initialProps: { nodes: [card("a")] },
    });
    rerender({ nodes: [card("a")] });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("flushes a pending edit when the editor closes", () => {
    const onChange = vi.fn();
    const { rerender, unmount } = renderHook(({ nodes }) => useBoardCommit(nodes, [], onChange), {
      initialProps: { nodes: [card("a")] },
    });
    rerender({ nodes: [card("typed")] });
    unmount();
    expect(onChange).toHaveBeenCalledWith(saved("typed"));
  });
});
