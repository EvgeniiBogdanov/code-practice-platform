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
import type { UiDiagramSceneProps } from "../diagram-scene";
import { makeDiagramNode, nodePosition, type DiagramObject } from "./diagram-objects";
import { makeConnection, type DiagramConnection } from "./diagram-connections";

const BACKDROP_GRID_OFFSET = -0.42;

export interface DiagramController {
  update: (props: UiDiagramSceneProps) => void;
  reset: () => void;
  dispose: () => void;
}
export const createDiagramScene = (
  host: HTMLElement,
  initial: UiDiagramSceneProps,
  unavailable: () => void
): DiagramController => {
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
  const angle = new Vector3(4.8, 6.8, 14);
  camera.position.copy(angle);
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
  const floor = new Mesh(new PlaneGeometry(400, 100), new ShadowMaterial({ opacity: 0.24 }));
  floor.position.z = -0.4;
  floor.receiveShadow = true;
  scene.add(floor);
  const decorations = new Group();
  scene.add(decorations);
  let nodes = new Map<string, DiagramObject>();
  let connections: DiagramConnection[] = [];
  let current = initial;
  let rendered: UiDiagramSceneProps | undefined;
  let frame = 0,
    started = 0,
    previousTime = 0;
  let span = 7;
  let activeId: string | undefined;
  let center = new Vector3();
  const target = new Vector3();
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
    for (const node of nodes.values()) {
      node.group.position.lerp(node.target, amount);
      node.group.scale.lerp(new Vector3(1, 1, 1), amount);
    }
    const offset = target.clone().sub(controls.target).multiplyScalar(amount);
    controls.target.add(offset);
    camera.position.add(offset);
    drawing = true;
    controls.update();
    drawing = false;
    connections.forEach((connection) => {
      const { pulse, curve, from, to } = connection;
      const start = nodes.get(from),
        end = nodes.get(to);
      if (start && end) connection.update(start.group.position, end.group.position);
      if (!pulse) return;
      pulse.visible = !reduced() && progress < 1;
      pulse.position.copy(curve.getPoint(progress));
    });
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
  const update = (props: UiDiagramSceneProps, refreshPalette = false): void => {
    current = props;
    const unchanged =
      rendered?.nodes === props.nodes &&
      rendered?.edges === props.edges &&
      rendered?.compact === props.compact;
    rendered = props;
    if (unchanged && !refreshPalette) {
      resize();
      return;
    }
    const palette = readScenePalette(host);
    backdropGrid = ensureBackdropGrid(backdropGrid, palette, scene, refreshPalette);
    const previous = nodes;
    nodes = new Map();
    decorations.children.slice().forEach(disposeSceneObject);
    const positions = new Map(
      props.nodes.map((node) => [node.id, nodePosition(node, Boolean(props.compact))])
    );
    const xs = [...positions.values()].map((p) => p.x),
      ys = [...positions.values()].map((p) => p.y);
    const minX = Math.min(0, ...xs),
      maxX = Math.max(0, ...xs),
      minY = Math.min(0, ...ys),
      maxY = Math.max(0, ...ys);
    center = new Vector3((minX + maxX) / 2, (minY + maxY) / 2 - 0.3, 0);
    const aspect = (host.clientWidth || 640) / (host.clientHeight || 340);
    // Keep large decision trees legible. Follow the active branch instead of shrinking every node.
    span = Math.max(5.5, Math.min(11.5, Math.max(maxY - minY + 4, (maxX - minX + 4) / aspect)));
    const active = props.nodes.find((node) => node.state === "active");
    const activePoint = active && positions.get(active.id);
    if (!previous.size) target.copy(center);
    if (activePoint && (activeId !== active?.id || maxX - minX > span * aspect - 3)) {
      target.set(
        maxX - minX > span * aspect - 3 ? activePoint.x : center.x,
        maxY - minY > span - 3 ? activePoint.y : center.y,
        0
      );
    } else if (!active) target.copy(center);
    activeId = active?.id;
    props.nodes.forEach((node) => {
      const group = makeDiagramNode(node, palette, props.compact);
      const destination = positions.get(node.id)!;
      group.position.copy(previous.get(node.id)?.group.position ?? destination);
      if (!previous.has(node.id) && !reduced()) group.scale.setScalar(0.75);
      nodes.set(node.id, { group, target: destination });
      scene.add(group);
    });
    previous.forEach((node) => disposeSceneObject(node.group));
    connections = props.edges.flatMap((edge) => {
      const from = positions.get(edge.from),
        to = positions.get(edge.to);
      if (!from || !to) return [];
      const link = makeConnection(
        edge,
        from,
        to,
        edge.to === active?.id || edge.from === active?.id,
        palette
      );
      decorations.add(link.group);
      return [link];
    });
    key.position.copy(target).add(new Vector3(-4, 7, 10));
    key.target.position.copy(target);
    const shadow = key.shadow.camera;
    shadow.left = -15;
    shadow.right = 15;
    shadow.top = 15;
    shadow.bottom = -15;
    shadow.updateProjectionMatrix();
    resize();
  };
  const reset = (): void => {
    target.copy(center);
    controls.target.copy(center);
    camera.position.copy(center).add(angle);
    controls.update();
    current.onZoomChange?.(1);
    invalidate();
  };
  const interact = (): void => {
    if (drawing) return;
    target.copy(controls.target);
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
    controls.target.copy(target);
    camera.position.copy(target).add(angle);
    controls.update();
  } catch (error: unknown) {
    dispose();
    throw error;
  }
  return { update, reset, dispose };
};
