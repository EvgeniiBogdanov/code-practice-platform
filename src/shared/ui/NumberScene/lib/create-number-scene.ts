import type { NumberSceneController, NumberSceneProps } from "../model/number-scene";
import { createSceneContent } from "./scene-content";
import { bindSceneEvents } from "./scene-events";
import {
  applyCameraTransform,
  createSceneAnimation,
  createSceneRuntime,
  resizeScene,
} from "./scene-runtime";

export const createNumberScene = (
  host: HTMLElement,
  initial: NumberSceneProps,
  onInteraction?: (zoom: number, pan: { x: number; y: number }) => void
): NumberSceneController => {
  const runtime = createSceneRuntime(host);
  if (typeof initial.zoom === "number") {
    runtime.zoom = initial.zoom;
  } else if (initial.initialZoom) {
    runtime.zoom = initial.initialZoom;
  }
  const content = createSceneContent(runtime.scene, host);
  let current = initial;
  const animation = createSceneAnimation(runtime, content, () => current);
  const resize = (): void => {
    if (!host.getClientRects().length) {
      animation.stop();
      return;
    }
    resizeScene(host, runtime, current.values.length);
    animation.invalidate();
  };
  const update = (props: NumberSceneProps): void => {
    current = props;
    content.update(props);
    resize();
  };
  const unbind = bindSceneEvents(
    host,
    runtime,
    animation,
    () => current.values.length,
    resize,
    () => update(current),
    () => current.onUnavailable(),
    (zoom, pan) => {
      current.onZoomChange?.(zoom);
      onInteraction?.(zoom, pan);
    }
  );
  const setZoom = (zoom: number): void => {
    runtime.zoom = Math.max(0.5, Math.min(2.5, zoom));
    applyCameraTransform(runtime, host, current.values.length);
    animation.invalidate();
    current.onZoomChange?.(runtime.zoom);
  };
  const setPan = (x: number, y: number): void => {
    runtime.pan = { x, y };
    applyCameraTransform(runtime, host, current.values.length);
    animation.invalidate();
  };
  const resetView = (): void => {
    runtime.zoom = 1;
    runtime.pan = { x: 0, y: 0 };
    applyCameraTransform(runtime, host, current.values.length);
    animation.invalidate();
    current.onZoomChange?.(1);
  };
  const getZoom = (): number => runtime.zoom;
  const getPan = (): { x: number; y: number } => ({ ...runtime.pan });
  const dispose = (): void => {
    animation.stop();
    unbind();
    content.dispose();
    runtime.renderer.dispose();
    runtime.renderer.forceContextLoss();
    runtime.canvas.remove();
  };
  try {
    update(initial);
  } catch (error: unknown) {
    dispose();
    throw error;
  }
  return { update, dispose, setZoom, setPan, resetView, getZoom, getPan };
};
