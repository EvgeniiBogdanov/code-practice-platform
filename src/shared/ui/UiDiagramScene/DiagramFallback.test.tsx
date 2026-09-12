import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { DiagramFallback as UiDiagramScene } from "./DiagramFallback";
import type { DiagramNode } from "./diagram-scene";
const nodes: readonly DiagramNode[] = [
  { id: "a", value: 1, column: 0, row: 0, state: "active" },
  { id: "b", value: 2, column: 1, row: 0 },
];
it("supports zoom shortcuts and exposes labels without a canvas", () => {
  const onZoomChange = vi.fn();
  render(
    <UiDiagramScene
      label="Цепочка"
      nodes={nodes}
      edges={[{ from: "a", to: "b", label: "next" }]}
      zoom={1}
      onZoomChange={onZoomChange}
    />
  );
  const scene = screen.getByRole("group");
  fireEvent.keyDown(scene, { key: "+" });
  expect(onZoomChange).toHaveBeenLastCalledWith(1.25);
  fireEvent.keyDown(scene, { key: "-" });
  expect(onZoomChange).toHaveBeenLastCalledWith(0.75);
  fireEvent.keyDown(scene, { key: "0" });
  expect(onZoomChange).toHaveBeenLastCalledWith(1);
  expect(screen.getByRole("img", { name: "Цепочка" })).toHaveTextContent("a → b");
});
it("keeps distinct marker IDs for independent scenes and stable node DOM across steps", () => {
  const { container, rerender } = render(
    <>
      <UiDiagramScene label="A" nodes={nodes} edges={[]} />
      <UiDiagramScene label="B" nodes={nodes} edges={[]} />
    </>
  );
  const ids = [...container.querySelectorAll("marker")].map((marker) => marker.id);
  expect(new Set(ids).size).toBe(2);
  const node = container.querySelector('[data-node-id="a"]');
  rerender(
    <>
      <UiDiagramScene
        label="A"
        nodes={nodes.map((node) => ({ ...node, state: "done" }))}
        edges={[]}
        reducedMotion
      />
      <UiDiagramScene label="B" nodes={nodes} edges={[]} />
    </>
  );
  expect(container.querySelector('[data-node-id="a"]')).toBe(node);
  expect(node).toHaveAttribute("data-state", "done");
  expect(container.querySelector("[style]")).toBeNull();
});
