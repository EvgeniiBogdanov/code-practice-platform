import {
  CanvasTexture,
  CylinderGeometry,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { NumberSceneProps, ScenePalette, SceneTile } from "../model/number-scene";

export const TILE_PITCH = 1.22;
export const tileX = (index: number, count: number): number =>
  (index - (count - 1) / 2) * TILE_PITCH;

export const readScenePalette = (host: HTMLElement): ScenePalette => {
  const styles = getComputedStyle(host);
  const read = (name: string): string => styles.getPropertyValue(name).trim();
  return {
    surface: read("--trace-tile-surface"),
    text: read("--text-main"),
    muted: read("--text-dimmed"),
    border: read("--text-placeholder"),
    primary: read("--accent-blue"),
    secondary: read("--accent-purple"),
    anchor: read("--accent-orange"),
    success: read("--accent-green"),
    font: read("--font-mono"),
  };
};

export const makeLabel = (
  text: string,
  color: string,
  font: string,
  width = 1.1,
  fontSize = 56
): Sprite => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  context.font = `500 ${fontSize}px ${font}`;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 64, 496);
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  const sprite = new Sprite(new SpriteMaterial({ map, transparent: true, depthTest: false }));
  sprite.scale.set(width, width / 4, 1);
  sprite.renderOrder = 2;
  return sprite;
};

export const disposeLabel = (label: Sprite): void => {
  label.material.map?.dispose();
  label.material.dispose();
  label.removeFromParent();
};

export const makeTile = (
  index: number,
  count: number,
  palette: ScenePalette,
  shape: NumberSceneProps["shape"] = "box"
): SceneTile => {
  const group = new Group();
  const geometry =
    shape === "token"
      ? new CylinderGeometry(0.52, 0.52, 0.3, 32).rotateX(Math.PI / 2)
      : shape === "diamond"
        ? new CylinderGeometry(0.62, 0.62, 0.3, 4).rotateX(Math.PI / 2)
        : new RoundedBoxGeometry(1.02, 0.94, 0.35, 3, 0.07);
  const material = new MeshStandardMaterial({
    color: new Color(palette.surface),
    roughness: 0.38,
    metalness: 0.12,
  });
  const mesh = new Mesh(geometry, material);
  group.add(mesh);
  const label = makeLabel("", palette.text, palette.font);
  group.add(label);
  group.position.x = tileX(index, count);
  return { group, mesh, label, targetX: group.position.x, targetY: 0 };
};
