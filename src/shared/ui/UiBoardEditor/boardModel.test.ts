import { describe, expect, it } from "vitest";
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_WIDTH,
  createBoardEdge,
  createBoardNode,
  serializeBoard,
  toFlowEdges,
  toFlowNodes,
} from "./boardModel";
import type { BoardValue } from "./boardTypes";

const board: BoardValue = {
  nodes: [
    { id: "n1", x: 10, y: 20, width: 140, height: 56, text: "Клиент", align: "left" },
    { id: "n3", x: 200, y: 20, width: 220, height: 90, text: "API", align: "center" },
  ],
  edges: [
    {
      id: "e1",
      source: "n1",
      target: "n3",
      label: "HTTP",
      sourceHandle: "right",
      targetHandle: "left",
    },
  ],
};

describe("board model", () => {
  it("round-trips a board through the flow representation", () => {
    expect(serializeBoard(toFlowNodes(board.nodes), toFlowEdges(board.edges))).toEqual(board);
  });

  it("keeps the size the learner gave a card", () => {
    const [, resized] = serializeBoard(toFlowNodes(board.nodes), []).nodes;
    expect(resized).toMatchObject({ width: 220, height: 90 });
  });

  it("gives the default size to cards saved before they were resizable", () => {
    const [node] = toFlowNodes([{ id: "n1", x: 0, y: 0, text: "" }]);
    expect(node).toMatchObject({ width: DEFAULT_CARD_WIDTH, height: DEFAULT_CARD_HEIGHT });
  });

  it("keeps the text position chosen for a card", () => {
    const [, centered] = serializeBoard(toFlowNodes(board.nodes), []).nodes;
    expect(centered?.align).toBe("center");
  });

  it("aligns the text left for cards saved before the position was configurable", () => {
    const [node] = toFlowNodes([{ id: "n1", x: 0, y: 0, text: "" }]);
    expect(node?.data.align).toBe("left");
    expect(createBoardNode([], { x: 0, y: 0 }).data.align).toBe("left");
  });

  it("omits attachment points that were never set", () => {
    const edge = { id: "e1", source: "n1", target: "n3", label: "" };
    const [saved] = serializeBoard([], toFlowEdges([edge])).edges;
    expect(Object.keys(saved ?? {}).sort()).toEqual(["id", "label", "source", "target"]);
  });

  it("rounds positions to whole numbers", () => {
    const [node] = toFlowNodes([{ id: "n1", x: 10.6, y: 3.2, text: "" }]);
    if (!node) throw new Error("Expected one node");
    const [saved] = serializeBoard([{ ...node, position: { x: 10.6, y: 3.2 } }], []).nodes;
    expect(saved).toMatchObject({ x: 11, y: 3 });
  });

  it("gives a new card the next free id, never one already used", () => {
    expect(createBoardNode(board.nodes, { x: 0, y: 0 }).id).toBe("n4");
    expect(createBoardNode([], { x: 0, y: 0 }).id).toBe("n1");
  });

  it("lays new cards out on a grid from the origin so they do not stack", () => {
    const origin = { x: 100, y: 50 };
    const cards = (count: number) =>
      Array.from({ length: count }, (_, index) => ({ id: `n${index + 1}` }));
    expect(createBoardNode(cards(0), origin).position).toEqual({ x: 100, y: 50 });
    expect(createBoardNode(cards(2), origin).position).toEqual({ x: 580, y: 50 });
    expect(createBoardNode(cards(4), origin).position).toEqual({ x: 340, y: 140 });
  });

  it("creates new cards at the default size", () => {
    expect(createBoardNode([], { x: 0, y: 0 })).toMatchObject({
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
    });
  });

  it("creates an arrow with the next free id and keeps its attachment points", () => {
    const edge = createBoardEdge(toFlowEdges(board.edges), {
      source: "n3",
      target: "n1",
      sourceHandle: "left",
      targetHandle: "right",
    });
    expect(edge).toMatchObject({ id: "e2", source: "n3", target: "n1", data: { label: "" } });
  });

  it("draws arrows above the cards without saving that", () => {
    const [arrow] = toFlowEdges(board.edges);
    expect(arrow?.zIndex).toBeGreaterThan(0);
    expect(
      createBoardEdge([], { source: "n1", target: "n3", sourceHandle: null, targetHandle: null })
        ?.zIndex
    ).toBeGreaterThan(0);
    const [saved] = serializeBoard([], toFlowEdges(board.edges)).edges;
    expect(saved).not.toHaveProperty("zIndex");
  });

  it("rejects a self-loop and a pair that is already connected", () => {
    const existing = toFlowEdges(board.edges);
    const connect = (source: string, target: string) =>
      createBoardEdge(existing, { source, target, sourceHandle: null, targetHandle: null });
    expect(connect("n1", "n1")).toBeNull();
    expect(connect("n1", "n3")).toBeNull();
  });
});
