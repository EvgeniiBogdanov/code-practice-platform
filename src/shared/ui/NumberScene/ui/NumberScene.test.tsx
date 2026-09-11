import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createNumberScene } from "../lib/create-number-scene";
import { NumberScene } from "./NumberScene";

vi.mock("../lib/create-number-scene", () => ({ createNumberScene: vi.fn() }));

describe("number scene initialization", () => {
  const frames = new Map<number, FrameRequestCallback>();
  const controller = {
    update: vi.fn(),
    dispose: vi.fn(),
    setZoom: vi.fn(),
    setPan: vi.fn(),
    resetView: vi.fn(),
    getZoom: vi.fn(() => 1),
    getPan: vi.fn(() => ({ x: 0, y: 0 })),
  };
  const props = { values: [0, 1], markers: [], reducedMotion: false, onUnavailable: vi.fn() };
  const flushFrame = (): void => {
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach((callback) => callback(performance.now())));
  };
  const flushInit = (): void => {
    flushFrame();
    flushFrame();
  };
  beforeEach(() => {
    let nextId = 0;
    frames.clear();
    vi.clearAllMocks();
    vi.mocked(createNumberScene).mockReturnValue(controller);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback): number => {
      frames.set(++nextId, callback);
      return nextId;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number): void => {
      frames.delete(id);
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("lets the controls paint and initializes once with the latest props", () => {
    const { rerender, unmount } = render(<NumberScene {...props} />);
    flushFrame();
    expect(createNumberScene).not.toHaveBeenCalled();
    const updated = { ...props, values: [1, 0] };
    rerender(<NumberScene {...updated} />);
    flushInit();
    expect(createNumberScene).toHaveBeenCalledExactlyOnceWith(
      expect.any(HTMLElement),
      updated,
      expect.any(Function)
    );
    expect(controller.update).not.toHaveBeenCalled();
    rerender(<NumberScene {...props} />);
    expect(controller.update).toHaveBeenCalledExactlyOnceWith(props);
    unmount();
    expect(controller.dispose).toHaveBeenCalledTimes(1);
  });

  it("cancels initialization if the task is left before the next paint", () => {
    const { unmount } = render(<NumberScene {...props} />);
    flushFrame();
    unmount();
    flushInit();
    expect(createNumberScene).not.toHaveBeenCalled();
  });

  it("syncs zoom prop to controller", () => {
    const onZoomChange = vi.fn();
    const { rerender } = render(<NumberScene {...props} zoom={1} onZoomChange={onZoomChange} />);
    flushInit();

    expect(controller.setZoom).toHaveBeenCalledWith(1);

    rerender(<NumberScene {...props} zoom={1.5} onZoomChange={onZoomChange} />);
    expect(controller.setZoom).toHaveBeenCalledWith(1.5);
  });

  it("supports keyboard shortcuts +, -, 0 for zoom control", () => {
    const onZoomChange = vi.fn();
    const { rerender } = render(<NumberScene {...props} zoom={1} onZoomChange={onZoomChange} />);
    flushInit();

    const viewport = screen.getByRole("group", { name: /Числовая сцена/ });

    fireEvent.keyDown(viewport, { key: "+" });
    expect(controller.setZoom).toHaveBeenCalledWith(1.25);
    expect(onZoomChange).toHaveBeenCalledWith(1.25);

    rerender(<NumberScene {...props} zoom={1.25} onZoomChange={onZoomChange} />);

    fireEvent.keyDown(viewport, { key: "-" });
    expect(controller.setZoom).toHaveBeenCalledWith(1);
    expect(onZoomChange).toHaveBeenCalledWith(1);

    rerender(<NumberScene {...props} zoom={1} onZoomChange={onZoomChange} />);

    fireEvent.keyDown(viewport, { key: "0" });
    expect(controller.resetView).toHaveBeenCalled();
    expect(onZoomChange).toHaveBeenCalledWith(1);
  });

  it("syncs UI and calls onZoomChange when interaction callback is triggered by scene events", () => {
    const onZoomChange = vi.fn();
    render(<NumberScene {...props} zoom={1} onZoomChange={onZoomChange} />);
    flushInit();

    const viewport = screen.getByRole("group", { name: /Числовая сцена/ });
    expect(viewport.className).not.toMatch(/draggable/);

    const [, , onInteraction] = vi.mocked(createNumberScene).mock.calls[0] as [
      HTMLElement,
      typeof props,
      (zoom: number, pan: { x: number; y: number }) => void,
    ];

    act(() => {
      onInteraction(1.4, { x: 2, y: 0 });
    });

    expect(onZoomChange).toHaveBeenCalledWith(1.4);
    expect(viewport.className).toMatch(/draggable/);
  });
});
