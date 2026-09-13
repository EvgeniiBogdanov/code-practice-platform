import { GridHelper, Vector3, type Scene } from "three";
import { disposeSceneObject, type ScenePalette } from "./scene-assets";

const CELL = 1.25;
// At minimum zoom (0.5) an ultrawide fullscreen viewport spans ~100 world units;
// a 400-unit wall centered on the orbit target always covers it with margin.
const SIZE = 400;

/**
 * Created once per scene and only rebuilt on a palette (theme) change,
 * because GridHelper bakes its colors into the geometry's vertex data.
 */
export const ensureBackdropGrid = (
  grid: GridHelper | undefined,
  palette: ScenePalette,
  scene: Scene,
  recreate: boolean
): GridHelper => {
  if (grid && recreate) {
    disposeSceneObject(grid);
    grid = undefined;
  }
  if (!grid) {
    grid = new GridHelper(SIZE, SIZE / CELL, palette.border, palette.border);
    grid.rotation.x = Math.PI / 2;
    // Paint before every transparent object: the shadow-catcher plane sorts by
    // object origin and can otherwise draw first, hiding the lines in depth.
    grid.renderOrder = -1;
    grid.material.transparent = true;
    grid.material.opacity = 0.12;
    scene.add(grid);
  }
  return grid;
};

/**
 * Follows the orbit target on all axes: x/y keep the wall under the viewport
 * during pans, and the z offset rides along so the camera can never cross the
 * wall plane and end up staring at empty space.
 */
export const syncBackdropGrid = (grid: GridHelper, target: Vector3, zOffset: number): void => {
  grid.position.set(target.x, target.y, target.z + zOffset);
};
