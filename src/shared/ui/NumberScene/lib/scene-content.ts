import {
  BoxGeometry,
  ConeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Sprite,
  type Object3D,
} from "three";
import type {
  NumberSceneMarker,
  NumberSceneProps,
  ScenePalette,
  SceneTile,
} from "../model/number-scene";
import { makeLabel, makeTile, readScenePalette, tileX, TILE_PITCH } from "./scene-objects";
import { updateSceneTile } from "./update-scene-tile";

export interface SceneContent {
  update: (props: NumberSceneProps) => void;
  animate: (amount: number) => void;
  dispose: () => void;
}
interface MarkerAnimation {
  group: Group;
  targetX: number;
}

export const disposeSceneObject = (object: Object3D): void => {
  object.traverse((child) => {
    if (child instanceof Sprite) {
      child.material.map?.dispose();
      child.material.dispose();
    } else if (child instanceof Mesh) {
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    }
  });
  object.removeFromParent();
  object.clear();
};

const makeMarker = (
  marker: NumberSceneMarker,
  count: number,
  palette: ScenePalette,
  start?: number
): MarkerAnimation => {
  const x = tileX(Math.max(-0.55, Math.min(count - 0.45, marker.index)), count);
  const below = marker.tone === "secondary";
  const outside = marker.index < 0 || marker.index >= count;
  const label = makeLabel(
    `${marker.label} · ${marker.index}${outside ? " ∅" : ""}`,
    palette[marker.tone],
    palette.font,
    2.2
  );
  const group = new Group();
  group.name = marker.label;
  group.position.x = start ?? x;
  label.position.set(0, below ? -1.35 : 1.4, 0);
  group.add(label);
  const arrow = new Mesh(
    new ConeGeometry(0.075, 0.16, 3),
    new MeshBasicMaterial({ color: palette[marker.tone] })
  );
  arrow.position.set(0, below ? -1.03 : 0.97, 0);
  arrow.rotation.z = below ? 0 : Math.PI;
  group.add(arrow);
  return { group, targetX: x };
};

export const createSceneContent = (scene: Scene, host: HTMLElement): SceneContent => {
  let tiles: SceneTile[] = [];
  let markers: MarkerAnimation[] = [];
  const decorations = new Group();
  scene.add(decorations);
  const band = new Mesh(
    new BoxGeometry(1, 1.35, 0.08),
    new MeshBasicMaterial({ transparent: true, opacity: 0.18, depthWrite: false })
  );
  band.position.z = -0.3;
  band.visible = false;
  scene.add(band);
  let bandX = 0;
  let bandWidth = 1;
  let previous: NumberSceneProps | undefined;
  const update = (props: NumberSceneProps): void => {
    const palette = readScenePalette(host);
    const positions = new Map(markers.map(({ group }) => [group.name, group.position.x]));
    decorations.children.slice().forEach(disposeSceneObject);
    if (tiles.length !== props.values.length || previous?.shape !== props.shape) {
      tiles.forEach(({ group }) => disposeSceneObject(group));
      tiles = props.values.map((_, index) =>
        makeTile(index, props.values.length, palette, props.shape)
      );
      tiles.forEach(({ group }) => scene.add(group));
    }
    tiles.forEach((tile, index) =>
      decorations.add(updateSceneTile(tile, index, props, palette, previous))
    );
    markers = props.markers.map((marker) =>
      makeMarker(
        marker,
        tiles.length,
        palette,
        props.reducedMotion ? undefined : positions.get(marker.label)
      )
    );
    markers.forEach(({ group }) => decorations.add(group));
    const start = Math.max(0, props.band?.start ?? 0);
    const end = Math.min(props.values.length - 1, props.band?.end ?? -1);
    const wasVisible = band.visible;
    band.visible = Boolean(props.band) && start <= end;
    if (band.visible && props.band) {
      bandX = tileX((start + end) / 2, props.values.length);
      bandWidth = (end - start + 1) * TILE_PITCH;
      band.material.color.set(palette[props.band.tone]);
      if (props.reducedMotion || !wasVisible) {
        band.position.x = bandX;
        band.scale.x = bandWidth;
      }
    }
    previous = props;
  };
  const animate = (amount: number): void => {
    band.position.x += (bandX - band.position.x) * amount;
    band.scale.x += (bandWidth - band.scale.x) * amount;
    tiles.forEach((tile) => {
      tile.group.position.x += (tile.targetX - tile.group.position.x) * amount;
      tile.group.position.y += (tile.targetY - tile.group.position.y) * amount;
    });
    markers.forEach(({ group, targetX }) => {
      group.position.x += (targetX - group.position.x) * amount;
    });
  };
  const dispose = (): void => {
    tiles.forEach(({ group }) => disposeSceneObject(group));
    disposeSceneObject(decorations);
    disposeSceneObject(band);
    tiles = [];
    markers = [];
  };
  return { update, animate, dispose };
};
