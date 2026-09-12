import { CylinderGeometry, Color, Group, Mesh, MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { makeLabel } from "../../../lib/three-scene";
import type { NumberSceneProps, ScenePalette, SceneTile } from "../model/number-scene";
export { readScenePalette, makeLabel, disposeLabel } from "../../../lib/three-scene";

export const TILE_PITCH = 1.22;
export const tileX = (index: number, count: number): number =>
  (index - (count - 1) / 2) * TILE_PITCH;

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
