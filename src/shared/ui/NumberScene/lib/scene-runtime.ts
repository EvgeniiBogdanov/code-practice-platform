import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
} from "three";
import type { NumberSceneProps } from "../model/number-scene";
import type { SceneContent } from "./scene-content";
import { TILE_PITCH } from "./scene-objects";

export interface SceneRuntime {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  canvas: HTMLCanvasElement;
  zoom: number;
  pan: { x: number; y: number };
}
export interface SceneAnimation {
  invalidate: () => void;
  stop: () => void;
}

export const createSceneRuntime = (host: HTMLElement): SceneRuntime => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", {
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  if (!context) throw new Error("WebGL2 is unavailable");
  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  const scene = new Scene();
  const camera = new OrthographicCamera(-6, 6, 2.4, -2.4, 0.1, 100);
  camera.position.set(0, 3.2, 12);
  camera.lookAt(0, 0, 0);
  scene.add(new AmbientLight(0xffffff, 2.1));
  const light = new DirectionalLight(0xffffff, 3.4);
  light.position.set(-3, 5, 8);
  scene.add(light);
  return { renderer, scene, camera, canvas, zoom: 1, pan: { x: 0, y: 0 } };
};

export const applyCameraTransform = (
  runtime: SceneRuntime,
  host: HTMLElement,
  count: number
): void => {
  const width = Math.max(host.clientWidth, count * 58 + 96);
  const height = host.clientHeight || 248;
  const pixelRatio = runtime.renderer.getPixelRatio();
  if (
    runtime.canvas.width !== Math.floor(width * pixelRatio) ||
    runtime.canvas.height !== Math.floor(height * pixelRatio)
  ) {
    runtime.renderer.setSize(width, height, false);
  }
  const worldWidth = Math.max(7, count * TILE_PITCH + 2, (width / height) * 3.8);
  const { camera, zoom, pan } = runtime;
  camera.zoom = zoom;
  camera.left = -worldWidth / 2;
  camera.right = worldWidth / 2;
  camera.top = (worldWidth * height) / width / 2;
  camera.bottom = -camera.top;
  camera.position.set(pan.x, 3.2 + pan.y, 12);
  camera.lookAt(pan.x, pan.y, 0);
  camera.updateProjectionMatrix();
};

export const resizeScene = (host: HTMLElement, runtime: SceneRuntime, count: number): void => {
  applyCameraTransform(runtime, host, count);
};

export const getWorldUnitsPerPixel = (
  host: HTMLElement,
  runtime: SceneRuntime,
  count: number
): number => {
  const width = Math.max(host.clientWidth, count * 58 + 96);
  const height = host.clientHeight || 248;
  const worldWidth = Math.max(7, count * TILE_PITCH + 2, (width / height) * 3.8);
  return worldWidth / (width * (runtime.zoom || 1));
};

export const createSceneAnimation = (
  runtime: SceneRuntime,
  content: SceneContent,
  current: () => NumberSceneProps
): SceneAnimation => {
  let frame = 0;
  let elapsed = 0;
  let started = 0;
  const renderFrame = (time: number): void => {
    if (document.hidden) {
      frame = 0;
      return;
    }
    const delta = Math.min((time - elapsed) / 1000 || 0.016, 0.05);
    elapsed = time;
    const reduced = current().reducedMotion;
    content.animate(reduced || time - started >= 650 ? 1 : 1 - Math.exp(-12 * delta));
    try {
      runtime.renderer.render(runtime.scene, runtime.camera);
    } catch {
      current().onUnavailable();
      return;
    }
    frame = !reduced && time - started < 650 ? requestAnimationFrame(renderFrame) : 0;
  };
  const invalidate = (): void => {
    cancelAnimationFrame(frame);
    started = performance.now();
    elapsed = started;
    frame = requestAnimationFrame(renderFrame);
  };
  return { invalidate, stop: (): void => cancelAnimationFrame(frame) };
};
