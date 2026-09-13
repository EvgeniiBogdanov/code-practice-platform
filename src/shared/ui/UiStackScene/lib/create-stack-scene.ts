import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  OrthographicCamera,
  PCFSoftShadowMap,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  Vector3,
  WebGLRenderer,
  type GridHelper,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  disposeSceneObject,
  ensureBackdropGrid,
  readScenePalette,
  syncBackdropGrid,
} from "../../../lib/three-scene";
import type { UiStackSceneProps } from "../stack-scene";
import {
  makeStackDecorations,
  setBlockFade,
  stackContainerHeight,
  stackSpan,
} from "./stack-objects";
import { syncStackFrame, type StackFrameState } from "./stack-choreography";

export interface StackController {
  update: (props: UiStackSceneProps) => void;
  reset: () => void;
  dispose: () => void;
}

const ANGLE = new Vector3(4.6, 6.4, 14);
const IDENTITY = new Vector3(1, 1, 1);
const BACKDROP_GRID_OFFSET = -1.35;

export const createStackScene = (
  host: HTMLElement,
  initial: UiStackSceneProps,
  unavailable: () => void
): StackController => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!context) throw new Error("WebGL2 is unavailable");
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  const scene = new Scene();
  const camera = new OrthographicCamera(-8, 8, 5, -5, 0.1, 200);
  camera.position.copy(ANGLE);
  const controls = new OrbitControls(camera, canvas);
  // OrbitControls supplies interaction; sizing and touch behavior belong to the CSS module.
  canvas.removeAttribute("style");
  controls.enableZoom = false;
  controls.rotateSpeed = 0.55;
  controls.enablePan = true;
  controls.minAzimuthAngle = -Math.PI / 4;
  controls.maxAzimuthAngle = Math.PI / 4;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI * 0.58;
  const ambient = new AmbientLight(0xffffff, 1.9);
  const key = new DirectionalLight(0xffffff, 3.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.normalBias = 0.035;
  const fill = new DirectionalLight(0xffffff, 1.5);
  fill.position.set(6, -3, 5);
  scene.add(ambient, key, key.target, fill);
  const backdrop = new Mesh(new PlaneGeometry(400, 100), new ShadowMaterial({ opacity: 0.24 }));
  backdrop.position.z = -0.85;
  backdrop.receiveShadow = true;
  scene.add(backdrop);
  const blocksGroup = new Group();
  const decorations = new Group();
  scene.add(blocksGroup, decorations);
  let frameState: StackFrameState = { blocks: new Map(), ghosts: [] };
  let current = initial;
  let rendered: UiStackSceneProps | undefined;
  let frame = 0,
    started = 0,
    previousTime = 0;
  let span = 7;
  let containerHeight = 4;
  const center = new Vector3();
  const lookAt = new Vector3();
  let disposed = false;
  let drawing = false;
  let backdropGrid: GridHelper | undefined;
  const reduced = (): boolean =>
    Boolean(
      current.reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
  const draw = (time: number): void => {
    frame = 0;
    if (disposed || document.hidden || !host.getClientRects().length) return;
    const progress = Math.min(1, (time - started) / 650);
    const amount =
      reduced() || progress === 1
        ? 1
        : 1 - Math.exp(-14 * Math.min((time - previousTime) / 1000, 0.05));
    previousTime = time;
    frameState.blocks.forEach(({ block, target }) => {
      block.group.position.lerp(target, amount);
      block.group.scale.lerp(IDENTITY, amount);
    });
    frameState.ghosts.forEach(({ group, target }) => {
      group.position.lerp(target, amount);
      setBlockFade(group, reduced() ? 1 : 1 - progress);
    });
    if (!reduced() && progress >= 1 && frameState.ghosts.length) {
      frameState.ghosts.forEach(({ group }) => disposeSceneObject(group));
      frameState = { ...frameState, ghosts: [] };
    }
    const drift = lookAt.clone().sub(controls.target).multiplyScalar(amount);
    controls.target.add(drift);
    camera.position.add(drift);
    drawing = true;
    controls.update();
    drawing = false;
    if (backdropGrid) syncBackdropGrid(backdropGrid, controls.target, BACKDROP_GRID_OFFSET);
    try {
      renderer.render(scene, camera);
    } catch {
      unavailable();
      return;
    }
    if (!reduced() && progress < 1) frame = requestAnimationFrame(draw);
  };
  const invalidate = (): void => {
    if (disposed) return;
    cancelAnimationFrame(frame);
    started = previousTime = performance.now();
    frame = requestAnimationFrame(draw);
  };
  const resize = (): void => {
    if (!host.getClientRects().length) {
      cancelAnimationFrame(frame);
      return;
    }
    const width = host.clientWidth || 640,
      height = host.clientHeight || 340;
    const aspect = width / height;
    renderer.setSize(width, height, false);
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.zoom = current.zoom ?? 1;
    camera.updateProjectionMatrix();
    invalidate();
  };
  const update = (props: UiStackSceneProps, refreshPalette = false): void => {
    current = props;
    const unchanged = rendered?.stacks === props.stacks && rendered?.action === props.action;
    rendered = props;
    if (unchanged && !refreshPalette) {
      resize();
      return;
    }
    const palette = readScenePalette(host);
    backdropGrid = ensureBackdropGrid(backdropGrid, palette, scene, refreshPalette);
    const lanes = props.stacks;
    const laneCount = Math.max(1, lanes.length);
    const deepest = Math.max(
      1,
      ...lanes.map((lane) => lane.values.length),
      ...(props.action?.before.map((lane) => lane.values.length) ?? [])
    );
    containerHeight = stackContainerHeight(deepest);
    center.set(0, containerHeight / 2 - 0.35, 0);
    decorations.children.slice().forEach(disposeSceneObject);
    decorations.add(makeStackDecorations(lanes, containerHeight, palette));
    frameState = syncStackFrame(
      props,
      frameState,
      palette,
      containerHeight,
      reduced(),
      blocksGroup
    );
    lookAt.copy(center);
    const aspect = (host.clientWidth || 640) / (host.clientHeight || 340);
    span = stackSpan(laneCount, containerHeight, aspect);
    key.position.copy(center).add(new Vector3(-4, 7, 10));
    key.target.position.copy(center);
    const shadow = key.shadow.camera;
    shadow.left = -15;
    shadow.right = 15;
    shadow.top = 15;
    shadow.bottom = -15;
    shadow.updateProjectionMatrix();
    resize();
  };
  const reset = (): void => {
    lookAt.copy(center);
    controls.target.copy(center);
    camera.position.copy(center).add(ANGLE);
    controls.update();
    current.onZoomChange?.(1);
    invalidate();
  };
  const interact = (): void => {
    if (drawing) return;
    lookAt.copy(controls.target);
    invalidate();
  };
  const lost = (event: Event): void => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    unavailable();
  };
  const visibility = (): void => {
    if (document.hidden) cancelAnimationFrame(frame);
    else invalidate();
  };
  const wheel = (event: WheelEvent): void => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    current.onZoomChange?.(
      Math.max(0.5, Math.min(2.5, (current.zoom ?? 1) * (event.deltaY < 0 ? 1.08 : 0.92)))
    );
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const themeObserver = new MutationObserver(() => update(current, true));
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  controls.addEventListener("change", interact);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("dblclick", reset);
  canvas.addEventListener("wheel", wheel, { passive: false });
  document.addEventListener("visibilitychange", visibility);
  const dispose = (): void => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    themeObserver.disconnect();
    controls.removeEventListener("change", interact);
    controls.dispose();
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("dblclick", reset);
    canvas.removeEventListener("wheel", wheel);
    document.removeEventListener("visibilitychange", visibility);
    disposeSceneObject(scene);
    key.shadow.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
  try {
    update(initial);
    controls.target.copy(center);
    camera.position.copy(center).add(ANGLE);
    controls.update();
  } catch (error: unknown) {
    dispose();
    throw error;
  }
  return { update, reset, dispose };
};
