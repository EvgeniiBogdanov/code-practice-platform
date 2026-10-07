import {
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { makeLabel, measureLabelWidth, type ScenePalette } from "../../../lib/three-scene";
import type { DiagramNode } from "../diagramScene";

// Подпись сбоку стартует за корпусом узла (или за кольцом, если узел активен) и должна
// закончиться до соседа справа вместе с его кольцом.
// Подпись под узлом (центр на -1.06, высота ~0.5) должна целиком влезать между рядами.
const COMPACT_ROW_PITCH = 2.3;
export const BODY_RADIUS = 0.62;
export const RING_RADIUS = 0.83;
export const CAPTION_GAP = 0.14;
const CAPTION_SIZES = [
  { width: 2.35, fontSize: 90 },
  { width: 2.35, fontSize: 76 },
  { width: 2.35, fontSize: 64 },
] as const;

export interface DiagramObject {
  group: Group;
  target: Vector3;
}
export const nodePosition = (node: DiagramNode, compact: boolean): Vector3 =>
  new Vector3(
    node.column * (compact ? 1.65 : 2.8),
    -node.row * (compact ? COMPACT_ROW_PITCH : 2.5),
    node.state === "active" ? 0.42 : 0
  );

export const nodeColor = (node: DiagramNode, palette: ScenePalette): string => {
  switch (node.state) {
    case "active":
      return palette.primary;
    case "frontier":
      return palette.secondary;
    case "done":
      return palette.success;
    case "rejected":
      return palette.anchor;
    default:
      return palette.surface;
  }
};
const nodeGeometry = (shape: DiagramNode["shape"], depth: number): BufferGeometry =>
  shape === "circle"
    ? new CylinderGeometry(0.58, 0.58, depth, 48).rotateX(Math.PI / 2)
    : shape === "diamond"
      ? new RoundedBoxGeometry(0.9, 0.9, depth, 3, 0.08).rotateZ(Math.PI / 4)
      : new RoundedBoxGeometry(1.28, 1.03, depth, 3, 0.12);

export const makeDiagramNode = (
  node: DiagramNode,
  palette: ScenePalette,
  compact = false,
  room = Infinity
): Group => {
  const group = new Group();
  const color = nodeColor(node, palette);
  const muted = node.state === "muted";
  const body = new Mesh(
    nodeGeometry(node.shape, 0.5),
    new MeshStandardMaterial({
      color: new Color(palette.surface).lerp(new Color(palette.text), 0.12),
      metalness: 0.15,
      roughness: 0.3,
    })
  );
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  // A machined rim and inset face make the thickness legible at every state.
  const rim = new Mesh(
    nodeGeometry(node.shape, 0.065),
    new MeshStandardMaterial({
      color,
      metalness: 0.45,
      roughness: 0.25,
      emissive: color,
      emissiveIntensity: node.state && !muted ? 0.22 : 0,
    })
  );
  rim.position.z = 0.26;
  group.add(rim);
  const face = new Mesh(
    nodeGeometry(node.shape, 0.08),
    new MeshStandardMaterial({
      color: new Color(palette.surface).lerp(new Color(color), node.state ? 0.32 : 0),
      metalness: 0.16,
      roughness: 0.4,
    })
  );
  face.scale.set(0.88, 0.88, 1);
  face.position.z = 0.3;
  group.add(face);
  const value = String(node.value === "" ? '""' : node.value === " " ? "␣" : node.value);
  const label = makeLabel(value, muted ? palette.muted : palette.text, palette.font, 1.6, 124);
  label.position.set(0, 0.02, 0.4);
  group.add(label);
  const captions = (node.caption ?? node.id).split(" · ");
  const lines =
    captions.length > 2 ? [captions.slice(0, -1).join(" · "), captions.at(-1)!] : captions;
  const beside = node.shape !== "box" && !compact;
  const sideStart = (node.state === "active" ? RING_RADIUS : BODY_RADIUS) + CAPTION_GAP;
  lines.forEach((text, i) => {
    const color_ = node.state && !muted ? color : palette.muted;
    // Подпись сбоку должна уместиться между кольцом активного узла и соседом справа.
    // Сначала пробуем обычный размер, затем уменьшенный; если и он не помещается — ставим под узел.
    const fit = beside
      ? CAPTION_SIZES.find(({ width, fontSize }) => {
          const textWidth = measureLabelWidth(text, palette.font, width, fontSize);
          return sideStart + textWidth <= room;
        })
      : undefined;
    // В компактной раскладке ряды стоят близко: подпись под узлом чуть меньше и ниже кольца активного узла.
    const size = fit ?? CAPTION_SIZES[compact ? 1 : 0];
    const caption = makeLabel(text, color_, palette.font, size.width, size.fontSize);
    const textWidth = measureLabelWidth(text, palette.font, size.width, size.fontSize);
    const below = !fit;
    caption.position.set(
      below ? 0 : sideStart + textWidth / 2,
      below ? (compact ? -1.06 : -1.08) - i * (compact ? 0.45 : 0.55) : 0.05 - i * 0.5,
      0.3
    );
    group.add(caption);
  });
  if (node.state === "active") {
    const ring = new Mesh(
      new TorusGeometry(0.83, 0.018, 8, 64),
      new MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.65,
        roughness: 0.3,
      })
    );
    ring.position.z = -0.15;
    group.add(ring);
  }
  return group;
};
