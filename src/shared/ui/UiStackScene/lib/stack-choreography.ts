import { Group, Vector3 } from "three";
import { disposeSceneObject, type ScenePalette } from "../../../lib/three-scene";
import type { UiStackSceneProps } from "../stack-scene";
import {
  blockY,
  displayValue,
  laneX,
  makeGhostBlock,
  makeStackBlock,
  type StackBlock,
} from "./stack-objects";

const GHOST_EXIT = new Vector3(1.7, 0.55, 0.75);
const GHOST_BASE_Z = 0.15;
const PUSH_DROP = 1.15;
const PEEK_LIFT = 0.14;

export interface PlacedBlock {
  block: StackBlock;
  target: Vector3;
}
export interface GhostBlock {
  group: Group;
  target: Vector3;
}
export interface StackFrameState {
  blocks: Map<string, PlacedBlock>;
  ghosts: GhostBlock[];
}

const occurrenceKey = (lane: number, value: string, seen: Map<string, number>): string => {
  const occ = seen.get(value) ?? 0;
  seen.set(value, occ + 1);
  return `${lane}:${value}#${occ}`;
};

/**
 * Rebuilds the frame from the step snapshot. Blocks whose value already existed
 * in the previous frame keep their position, so the ease renders the recorded
 * "before → after" transition; everything else spawns or fades per operation.
 */
export const syncStackFrame = (
  props: UiStackSceneProps,
  previous: StackFrameState,
  palette: ScenePalette,
  containerHeight: number,
  reducedMotion: boolean,
  parent: Group
): StackFrameState => {
  const lanes = props.stacks;
  const laneCount = Math.max(1, lanes.length);
  const peekLane = props.action?.kind === "peek" ? props.action.items[0]?.lane : undefined;
  const blocks = new Map<string, PlacedBlock>();
  lanes.forEach((lane, laneIndex) => {
    const x = laneX(laneIndex, laneCount);
    const accent = laneIndex === 0 ? palette.primary : palette.secondary;
    const seen = new Map<string, number>();
    lane.values.forEach((value, index) => {
      const display = displayValue(value);
      const key = occurrenceKey(laneIndex, display, seen);
      const emphasized = index === lane.values.length - 1;
      const target = new Vector3(
        x,
        blockY(index) + (peekLane === laneIndex && emphasized ? PEEK_LIFT : 0),
        0
      );
      const known = previous.blocks.get(key);
      const block = makeStackBlock(display, palette, accent, { emphasized });
      block.ring.visible = peekLane === laneIndex && emphasized;
      if (known) {
        block.group.position.copy(known.block.group.position);
      } else {
        const pushed =
          props.action?.kind === "push" &&
          emphasized &&
          props.action.items.some((item) => item.lane === laneIndex);
        if (pushed && !reducedMotion) block.group.position.set(x, containerHeight + PUSH_DROP, 0);
        else block.group.position.copy(target);
        if (!reducedMotion) block.group.scale.setScalar(pushed ? 0.85 : 0.75);
      }
      blocks.set(key, { block, target });
      parent.add(block.group);
    });
  });
  const ghosts: GhostBlock[] = [];
  const action = props.action;
  if (action?.kind === "pop") {
    action.items.forEach((item) => {
      const before = action.before[item.lane];
      const removed = before?.values.at(-1);
      if (!before || removed === undefined) return;
      const base = new Vector3(
        laneX(item.lane, laneCount),
        blockY(before.values.length - 1),
        GHOST_BASE_Z
      );
      const target = GHOST_EXIT.clone().add(base);
      const group = makeGhostBlock(displayValue(removed), palette);
      group.position.copy(reducedMotion ? target : base);
      ghosts.push({ group, target });
      parent.add(group);
    });
  }
  previous.ghosts.forEach(({ group }) => disposeSceneObject(group));
  previous.blocks.forEach(({ block }) => disposeSceneObject(block.group));
  return { blocks, ghosts };
};
