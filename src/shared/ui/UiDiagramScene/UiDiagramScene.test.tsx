import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createDiagramScene } from "./lib/create-diagram-scene";
import { UiDiagramScene } from "./UiDiagramScene";
import type { UiDiagramSceneProps } from "./diagram-scene";

vi.mock("./lib/create-diagram-scene", () => ({ createDiagramScene: vi.fn() }));
const controller = { update: vi.fn(), reset: vi.fn(), dispose: vi.fn() };
const frames = new Map<number, FrameRequestCallback>();
const props: UiDiagramSceneProps = {
  label: "Дерево",
  nodes: [{ id: "a", value: 3, column: 0, row: 0 }],
  edges: [],
};
const flush = async (): Promise<void> => {
  await act(async () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(performance.now()));
    await vi.dynamicImportSettled();
  });
};
beforeEach(() => {
  let id = 0;
  frames.clear();
  vi.clearAllMocks();
  vi.mocked(createDiagramScene).mockReturnValue(controller);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback): number => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number): void => {
    frames.delete(id);
  });
});
afterEach(() => vi.unstubAllGlobals());

it("initializes lazily with the latest frame, updates without recreating WebGL and disposes", async () => {
  const { rerender, unmount } = render(<UiDiagramScene {...props} />);
  expect(createDiagramScene).not.toHaveBeenCalled();
  const next = { ...props, nodes: [{ ...props.nodes[0], value: 9 }], reducedMotion: true };
  rerender(<UiDiagramScene {...next} />);
  await flush();
  expect(createDiagramScene).toHaveBeenCalledExactlyOnceWith(
    expect.any(HTMLElement),
    next,
    expect.any(Function)
  );
  rerender(<UiDiagramScene {...props} />);
  expect(controller.update).toHaveBeenLastCalledWith(props);
  expect(createDiagramScene).toHaveBeenCalledTimes(1);
  unmount();
  expect(controller.dispose).toHaveBeenCalledTimes(1);
});

it("preserves the diagram after context loss and can retry the current frame", async () => {
  const { rerender } = render(<UiDiagramScene {...props} />);
  await flush();
  act(() => vi.mocked(createDiagramScene).mock.calls[0][2]());
  expect(controller.dispose).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("img", { name: "Дерево" }).tagName).toBe("svg");
  const next = { ...props, nodes: [{ ...props.nodes[0], value: 7 }] };
  rerender(<UiDiagramScene {...next} />);
  expect(screen.getByRole("img")).toHaveTextContent("7");
  fireEvent.click(screen.getByRole("button", { name: "Повторить 3D" }));
  await flush();
  expect(createDiagramScene).toHaveBeenLastCalledWith(
    expect.any(HTMLElement),
    next,
    expect.any(Function)
  );
  expect(screen.queryByRole("button", { name: "Повторить 3D" })).not.toBeInTheDocument();
});

it("falls back on initialization failure and does not load WebGL for an empty structure", async () => {
  vi.mocked(createDiagramScene).mockImplementationOnce(() => {
    throw new Error("No WebGL");
  });
  const { rerender } = render(<UiDiagramScene {...props} nodes={[]} />);
  await flush();
  expect(createDiagramScene).not.toHaveBeenCalled();
  rerender(<UiDiagramScene {...props} />);
  await flush();
  expect(screen.getByRole("status")).toHaveTextContent("3D недоступно");
  expect(screen.getByRole("img")).toHaveTextContent("3");
});

it("cancels deferred initialization and supports zoom/reset shortcuts", async () => {
  const first = render(<UiDiagramScene {...props} />);
  first.unmount();
  await flush();
  expect(createDiagramScene).not.toHaveBeenCalled();
  const zoom = vi.fn();
  render(<UiDiagramScene {...props} zoom={1} onZoomChange={zoom} />);
  await flush();
  const view = screen.getByRole("group");
  fireEvent.keyDown(view, { key: "+" });
  expect(zoom).toHaveBeenLastCalledWith(1.25);
  fireEvent.keyDown(view, { key: "0" });
  expect(controller.reset).toHaveBeenCalledTimes(1);
  expect(zoom).toHaveBeenLastCalledWith(1);
});
