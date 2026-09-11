import { Color, type Sprite } from "three";
import type { NumberSceneProps, ScenePalette, SceneTile } from "../model/number-scene";
import { disposeLabel, makeLabel, tileX } from "./scene-objects";

const setTransferOrigin = (
  tile: SceneTile,
  index: number,
  props: NumberSceneProps,
  previous?: NumberSceneProps
): void => {
  const move = props.transfer;
  if (props.reducedMotion || !move || !previous || move.from === move.to) return;
  if (index === move.to && props.values[index] === previous.values[move.from]) {
    tile.group.position.set(tileX(move.from, props.values.length), 0.5, 0);
  } else if (
    move.kind === "swap" &&
    index === move.from &&
    props.values[index] === previous.values[move.to]
  ) {
    tile.group.position.set(tileX(move.to, props.values.length), -0.3, 0);
  }
};

export const updateSceneTile = (
  tile: SceneTile,
  index: number,
  props: NumberSceneProps,
  palette: ScenePalette,
  previous?: NumberSceneProps
): Sprite => {
  const marker = props.markers.find((item) => item.index === index);
  const settled = props.settled?.includes(index);
  const focused = props.focus?.includes(index);
  const accent = marker ? palette[marker.tone] : settled ? palette.success : palette.primary;
  const dimmed = props.dimmed?.includes(index);
  tile.mesh.material.color
    .set(palette.surface)
    .lerp(new Color(accent), marker || focused ? 0.36 : settled ? 0.16 : 0);
  tile.mesh.material.transparent = true;
  tile.mesh.material.opacity = dimmed ? 0.32 : 1;
  disposeLabel(tile.label);
  const value = props.values[index];
  tile.label = makeLabel(
    value === " " ? "␣" : String(value),
    dimmed ? palette.muted : palette.text,
    palette.font,
    1.5,
    124
  );
  tile.label.position.set(0, 0, 0.25);
  tile.group.add(tile.label);
  tile.targetY = marker || focused ? 0.14 : 0;
  tile.targetX = tileX(index, props.values.length);
  setTransferOrigin(tile, index, props, previous);
  const indexLabel = makeLabel(String(index), palette.muted, palette.font, 1.1, 72);
  indexLabel.position.set(tile.targetX, -0.8, 0);
  return indexLabel;
};
