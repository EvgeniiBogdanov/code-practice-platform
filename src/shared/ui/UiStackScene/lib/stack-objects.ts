import {
  BoxGeometry,
  Color,
  ConeGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
  type Material,
  type Object3D,
  type Sprite,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { makeFaceLabel, makeFittedLabel, type ScenePalette } from "../../../lib/three-scene";
import type { StackSceneLane } from "../stack-scene";

const BLOCK_WIDTH = 1.7;
const BLOCK_HEIGHT = 0.72;
const BLOCK_DEPTH = 1.1;
export const BLOCK_PITCH = 0.84;
export const LANE_PITCH = 3.1;

export const blockY = (index: number): number => BLOCK_HEIGHT / 2 + index * BLOCK_PITCH;
export const laneX = (lane: number, count: number): number => (lane - (count - 1) / 2) * LANE_PITCH;
export const displayValue = (value: string | number): string =>
  value === "" ? '""' : value === " " ? "␣" : String(value);

export interface StackBlock {
  group: Group;
  ring: Mesh;
}

interface BlockOptions {
  /** The top of the stack reads as focused, like a lifted tile in NumberScene. */
  readonly emphasized?: boolean;
  /** Extracted blocks fade out, so their materials start transparent. */
  readonly ghost?: boolean;
}

export const makeStackBlock = (
  value: string,
  palette: ScenePalette,
  accent: string,
  options: BlockOptions = {}
): StackBlock => {
  const ghost = options.ghost === true;
  const group = new Group();
  const body = new Mesh(
    new RoundedBoxGeometry(BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH, 3, 0.09),
    new MeshStandardMaterial({
      color: new Color(palette.surface).lerp(new Color(accent), ghost ? 0.3 : 0.05),
      metalness: 0.15,
      roughness: 0.3,
      transparent: ghost,
    })
  );
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  // A machined rim and inset face keep the slab thickness legible, matching diagram nodes.
  const rim = new Mesh(
    new RoundedBoxGeometry(BLOCK_WIDTH - 0.16, BLOCK_HEIGHT - 0.18, 0.065, 3, 0.05),
    new MeshStandardMaterial({
      color: accent,
      metalness: 0.45,
      roughness: 0.25,
      emissive: accent,
      emissiveIntensity: ghost ? 0.4 : 0.22,
      transparent: ghost,
    })
  );
  rim.position.z = BLOCK_DEPTH / 2 + 0.005;
  group.add(rim);
  const face = new Mesh(
    new RoundedBoxGeometry(BLOCK_WIDTH - 0.3, BLOCK_HEIGHT - 0.3, 0.08, 3, 0.06),
    new MeshStandardMaterial({
      color: new Color(palette.surface).lerp(
        new Color(accent),
        ghost ? 0.5 : options.emphasized ? 0.32 : 0.1
      ),
      metalness: 0.16,
      roughness: 0.4,
      transparent: ghost,
    })
  );
  face.position.z = BLOCK_DEPTH / 2 + 0.04;
  group.add(face);
  // Painted onto the front face rather than a billboard sprite, so the value
  // tilts with the block; it keeps its glyph height and shrinks only when a
  // long string would overflow the face.
  const label = makeFaceLabel(
    value,
    ghost ? palette.anchor : palette.text,
    palette.font,
    0.38,
    64,
    BLOCK_WIDTH - 0.25
  );
  label.position.z = BLOCK_DEPTH / 2 + 0.1;
  group.add(label);
  const ring = new Mesh(
    new TorusGeometry(1.04, 0.022, 8, 64),
    new MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.65,
      roughness: 0.3,
      transparent: ghost,
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.visible = false;
  group.add(ring);
  return { group, ring };
};

export const setBlockFade = (group: Group, opacity: number): void => {
  group.traverse((child: Object3D) => {
    const material = (child as Mesh | Sprite).material as Material | undefined;
    if (material) material.opacity = opacity;
  });
};

export const makeStackContainer = (
  height: number,
  palette: ScenePalette,
  accent: string
): Group => {
  const group = new Group();
  const wall = 0.09;
  const innerWidth = 2.1;
  const depth = 1.5;
  const glass = new MeshStandardMaterial({
    color: new Color(palette.surface).lerp(new Color(accent), 0.4),
    transparent: true,
    opacity: 0.1,
    roughness: 0.2,
    metalness: 0.1,
    depthWrite: false,
    side: DoubleSide,
  });
  const edgeMaterial = new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.5 });
  const walls: [number, number, number, number, number, number][] = [
    [innerWidth + wall * 2, 0.14, depth + wall * 2, 0, -0.07, 0],
    [innerWidth + wall * 2, height, wall, 0, height / 2, -(depth / 2 + wall / 2)],
    [wall, height, depth + wall * 2, -(innerWidth / 2 + wall / 2), height / 2, 0],
    [wall, height, depth + wall * 2, innerWidth / 2 + wall / 2, height / 2, 0],
  ];
  walls.forEach(([sx, sy, sz, x, y, z]) => {
    const geometry = new BoxGeometry(sx, sy, sz);
    const pane = new Mesh(geometry, glass);
    pane.position.set(x, y, z);
    pane.receiveShadow = true;
    group.add(pane);
    const edges = new LineSegments(new EdgesGeometry(geometry), edgeMaterial);
    edges.position.copy(pane.position);
    group.add(edges);
  });
  return group;
};

export const makeTopPointer = (palette: ScenePalette, accent: string): Group => {
  const group = new Group();
  const cone = new Mesh(
    new ConeGeometry(0.09, 0.26, 3),
    new MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.55,
      metalness: 0.45,
      roughness: 0.25,
    })
  );
  cone.rotation.z = Math.PI;
  cone.position.y = 0.22;
  group.add(cone);
  const label = makeFittedLabel("top", accent, palette.font, 0.2, 48);
  label.position.set(0.62, 0.28, 0.3);
  group.add(label);
  return group;
};

export const makeLaneTitle = (text: string, palette: ScenePalette): Sprite =>
  makeFittedLabel(text, palette.text, palette.font, 0.3, 64, 3.3);

export const makeMutedLabel = (
  text: string,
  palette: ScenePalette,
  height: number,
  color: string = palette.muted
): Sprite => makeFittedLabel(text, color, palette.font, height, 48);

export const makeGhostBlock = (value: string, palette: ScenePalette): Group => {
  const block = makeStackBlock(value, palette, palette.anchor, { ghost: true });
  const caption = makeMutedLabel("извлечён", palette, 0.2, palette.anchor);
  caption.position.set(0.5, -0.66, 0.35);
  block.group.add(caption);
  return block.group;
};

export const stackContainerHeight = (deepest: number): number => deepest * BLOCK_PITCH + 1.6;

export const stackSpan = (laneCount: number, containerHeight: number, aspect: number): number =>
  Math.max(
    5.5,
    Math.min(11.5, Math.max(containerHeight + 3.1, (laneCount * LANE_PITCH + 2.6) / aspect))
  );

/** Containers, lane titles, foot/empty labels and top pointers. */
export const makeStackDecorations = (
  lanes: readonly StackSceneLane[],
  containerHeight: number,
  palette: ScenePalette
): Group => {
  const decorations = new Group();
  const laneCount = Math.max(1, lanes.length);
  lanes.forEach((lane, laneIndex) => {
    const x = laneX(laneIndex, laneCount);
    const accent = laneIndex === 0 ? palette.primary : palette.secondary;
    const container = makeStackContainer(containerHeight, palette, accent);
    container.position.set(x, 0, 0);
    decorations.add(container);
    const title = makeLaneTitle(lane.label, palette);
    title.position.set(x, containerHeight + 0.85, 0);
    decorations.add(title);
    const foot = makeMutedLabel(`дно · ${lane.values.length} эл.`, palette, 0.22);
    foot.position.set(x, -0.78, 0);
    decorations.add(foot);
    if (!lane.values.length) {
      const empty = makeMutedLabel("пусто", palette, 0.26);
      empty.position.set(x, containerHeight * 0.45, 0.2);
      decorations.add(empty);
      return;
    }
    const pointer = makeTopPointer(palette, accent);
    pointer.position.set(x, blockY(lane.values.length - 1) + 0.62, 0.3);
    decorations.add(pointer);
  });
  return decorations;
};
