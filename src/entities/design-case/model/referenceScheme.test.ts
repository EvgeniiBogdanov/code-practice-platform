import { describe, expect, it } from "vitest";
import { getReferenceBoard } from "./referenceScheme";
import type { DesignScheme } from "./types";

const scheme: DesignScheme = {
  nodes: [
    { id: "req", stage: "requirements", x: 0, y: 0, text: "Требования" },
    { id: "api", stage: "architecture", x: 0, y: 100, text: "API" },
    { id: "ui", stage: "architecture", x: 200, y: 100, text: "UI" },
    { id: "data", stage: "data-model", x: 0, y: 200, text: "Сущности" },
  ],
  edges: [
    { id: "ui->api", stage: "architecture", source: "ui", target: "api", label: "запрос" },
    { id: "api->data", stage: "data-model", source: "api", target: "data", label: "" },
  ],
};

describe("getReferenceBoard", () => {
  it("shows the layers up to the stage and highlights what the stage adds", () => {
    const { board, highlightedIds } = getReferenceBoard(scheme, "architecture");

    expect(board.nodes.map(({ id }) => id)).toEqual(["req", "api", "ui"]);
    expect(board.edges.map(({ id }) => id)).toEqual(["ui->api"]);
    expect(highlightedIds).toEqual(["api", "ui", "ui->api"]);
  });

  it("drops the stage marks, so the board is plain board JSON", () => {
    const { board } = getReferenceBoard(scheme, "requirements");

    expect(board.nodes).toEqual([{ id: "req", x: 0, y: 0, text: "Требования" }]);
    expect(board.edges).toEqual([]);
  });

  it("shows the whole scheme without highlights for «all»", () => {
    const { board, highlightedIds } = getReferenceBoard(scheme, "all");

    expect(board.nodes).toHaveLength(4);
    expect(board.edges).toHaveLength(2);
    expect(highlightedIds).toEqual([]);
  });
});
