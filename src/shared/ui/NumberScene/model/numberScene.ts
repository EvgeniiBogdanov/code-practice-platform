export type { ScenePalette } from "../../../lib/three-scene";
import type { Group, Mesh, MeshStandardMaterial, Sprite } from "three";

export interface NumberSceneMarker {
  readonly label: string;
  readonly index: number;
  readonly tone: "primary" | "secondary" | "anchor";
}

export interface NumberSceneProps {
  readonly shape?: "box" | "token" | "diamond";
  readonly band?: {
    readonly start: number;
    readonly end: number;
    readonly tone: "primary" | "secondary" | "anchor";
  };
  readonly values: readonly (number | string)[];
  readonly markers: readonly NumberSceneMarker[];
  readonly focus?: readonly number[];
  readonly settled?: readonly number[];
  readonly dimmed?: readonly number[];
  readonly transfer?: {
    readonly from: number;
    readonly to: number;
    readonly kind: "copy" | "swap";
  };
  readonly reducedMotion: boolean;
  readonly onUnavailable: () => void;
  readonly zoom?: number;
  readonly initialZoom?: number;
  readonly onZoomChange?: (zoom: number) => void;
}

export interface SceneTile {
  readonly group: Group;
  readonly mesh: Mesh<import("three").BufferGeometry, MeshStandardMaterial>;
  label: Sprite;
  targetX: number;
  targetY: number;
}

export interface NumberSceneController {
  update: (props: NumberSceneProps) => void;
  dispose: () => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  getZoom: () => number;
  getPan: () => { x: number; y: number };
}
