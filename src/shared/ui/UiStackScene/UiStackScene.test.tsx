import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createStackScene } from "./lib/create-stack-scene";
import { UiStackScene } from "./UiStackScene";
import type { UiStackSceneProps } from "./stack-scene";

vi.mock("./lib/create-stack-scene", () => ({ createStackScene: vi.fn() }));
const controller = { update: vi.fn(), reset: vi.fn(), dispose: vi.fn() };
const frames = new Map<number, FrameRequestCallback>();
const props: UiStackSceneProps = {
  stacks: [{ label: "stack", values: [1, 2] }],
  stepId: "s1",
  reducedMotion: false,
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
  vi.mocked(createStackScene).mockReturnValue(controller);
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
  const { rerender, unmount } = render(<UiStackScene {...props} />);
  expect(createStackScene).not.toHaveBeenCalled();
  const next = { ...props, stacks: [{ label: "stack", values: [1, 2, 3] }], reducedMotion: true };
  rerender(<UiStackScene {...next} />);
  await flush();
  expect(createStackScene).toHaveBeenCalledExactlyOnceWith(
    expect.any(HTMLElement),
    next,
    expect.any(Function)
  );
  rerender(<UiStackScene {...props} />);
  expect(controller.update).toHaveBeenLastCalledWith(props);
  expect(createStackScene).toHaveBeenCalledTimes(1);
  unmount();
  expect(controller.dispose).toHaveBeenCalledTimes(1);
});

it("keeps a textual stack description for screen readers", async () => {
  render(
    <UiStackScene
      stacks={[{ label: "stack", values: [1, 2] }]}
      action={{
        kind: "pop",
        before: [{ label: "stack", values: [1, 2, 3] }],
        items: [{ lane: 0, value: 3 }],
      }}
      stepId="pop-3"
      reducedMotion
    />
  );
  await flush();
  const described = screen.getByRole("img", { name: "POP: состояние стека" });
  expect(described).toHaveTextContent("stack: снизу вверх [1,2]");
  expect(described).toHaveTextContent("top: 2");
});

it("preserves the scheme after context loss and can retry the current frame", async () => {
  render(<UiStackScene {...props} />);
  await flush();
  act(() => vi.mocked(createStackScene).mock.calls[0][2]());
  expect(controller.dispose).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("status")).toHaveTextContent("3D недоступно");
  const scheme = screen.getByRole("img", { name: "Пустой или текущий стек" });
  expect(scheme).toHaveTextContent("top");
  expect(scheme).toHaveTextContent("2");
  fireEvent.click(screen.getByRole("button", { name: "Повторить 3D" }));
  await flush();
  expect(createStackScene).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("button", { name: "Повторить 3D" })).not.toBeInTheDocument();
});

it("falls back on initialization failure", async () => {
  vi.mocked(createStackScene).mockImplementationOnce(() => {
    throw new Error("No WebGL");
  });
  render(<UiStackScene {...props} />);
  await flush();
  expect(screen.getByRole("status")).toHaveTextContent("3D недоступно");
  expect(screen.getByRole("img")).toHaveTextContent("дно · 2 эл.");
});

it("supports zoom and reset shortcuts", async () => {
  const zoom = vi.fn();
  render(<UiStackScene {...props} zoom={1} onZoomChange={zoom} />);
  await flush();
  const view = screen.getByRole("group");
  fireEvent.keyDown(view, { key: "+" });
  expect(zoom).toHaveBeenLastCalledWith(1.25);
  fireEvent.keyDown(view, { key: "0" });
  expect(controller.reset).toHaveBeenCalledTimes(1);
  expect(zoom).toHaveBeenLastCalledWith(1);
});
