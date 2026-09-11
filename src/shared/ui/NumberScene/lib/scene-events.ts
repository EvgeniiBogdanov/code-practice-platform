import { TILE_PITCH } from "./scene-objects";
import {
  applyCameraTransform,
  getWorldUnitsPerPixel,
  type SceneAnimation,
  type SceneRuntime,
} from "./scene-runtime";

export const bindSceneEvents = (
  host: HTMLElement,
  runtime: SceneRuntime,
  animation: SceneAnimation,
  getCount: () => number,
  resize: () => void,
  update: () => void,
  unavailable: () => void,
  onInteraction?: (zoom: number, pan: { x: number; y: number }) => void
): (() => void) => {
  const { canvas } = runtime;

  const contextLost = (event: Event): void => {
    event.preventDefault();
    animation.stop();
    unavailable();
  };

  const visibility = (): void => {
    if (document.hidden) animation.stop();
    else animation.invalidate();
  };

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;

  const onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startPanX = runtime.pan.x;
    startPanY = runtime.pan.y;
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!isDragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;

    const count = getCount();
    const unitsPerPixel = getWorldUnitsPerPixel(host, runtime, count);
    const newPanX = startPanX - dx * unitsPerPixel;
    const newPanY = startPanY + dy * unitsPerPixel;

    const maxPanX = Math.max(2, ((count + 1) * TILE_PITCH) / 2 + 4);
    const maxPanY = Math.max(1.5, 3.5 / (runtime.zoom || 1));

    runtime.pan.x = Math.max(-maxPanX, Math.min(maxPanX, newPanX));
    runtime.pan.y = Math.max(-maxPanY, Math.min(maxPanY, newPanY));

    applyCameraTransform(runtime, host, count);
    animation.invalidate();
    onInteraction?.(runtime.zoom, runtime.pan);
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (!isDragging) return;
    isDragging = false;
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
  };

  const onWheel = (event: WheelEvent): void => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.max(0.5, Math.min(2.5, Math.round(runtime.zoom * factor * 100) / 100));
    if (newZoom === runtime.zoom) return;
    runtime.zoom = newZoom;
    applyCameraTransform(runtime, host, getCount());
    animation.invalidate();
    onInteraction?.(runtime.zoom, runtime.pan);
  };

  const onDblClick = (): void => {
    runtime.zoom = 1;
    runtime.pan = { x: 0, y: 0 };
    applyCameraTransform(runtime, host, getCount());
    animation.invalidate();
    onInteraction?.(1, runtime.pan);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(host);

  const themeObserver = new MutationObserver(update);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("dblclick", onDblClick);
  document.addEventListener("visibilitychange", visibility);

  return (): void => {
    observer.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", contextLost);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("dblclick", onDblClick);
  };
};
