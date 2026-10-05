export interface DiagramNode {
  readonly id: string;
  readonly value: string | number;
  readonly column: number;
  readonly row: number;
  readonly caption?: string;
  readonly shape?: "circle" | "box" | "diamond";
  readonly state?: "active" | "frontier" | "done" | "rejected" | "muted";
}
export interface DiagramEdge {
  readonly from: string;
  readonly to: string;
  readonly label?: string;
}
export interface UiDiagramSceneProps {
  readonly label: string;
  readonly stateLabels?: Partial<Record<NonNullable<DiagramNode["state"]>, string>>;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  readonly compact?: boolean;
  readonly reducedMotion?: boolean;
  readonly zoom?: number;
  readonly onZoomChange?: (zoom: number) => void;
}

// SVG user-space coordinates are geometry, independent of CSS layout tokens.
export const diagramPoint = (node: DiagramNode, compact: boolean): { x: number; y: number } => ({
  x: 90 + node.column * (compact ? 86 : 142),
  y: 72 + node.row * 104,
});
export const diagramEdgePath = (
  from: { x: number; y: number },
  to: { x: number; y: number }
): string => {
  if (from.y === to.y) {
    if (to.x > from.x) return `M ${from.x + 34} ${from.y} L ${to.x - 40} ${to.y}`;
    return `M ${from.x} ${from.y - 28} C ${from.x + 60} ${from.y - 76}, ${to.x - 60} ${to.y - 76}, ${to.x} ${to.y - 34}`;
  }
  return `M ${from.x} ${from.y + 30} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${(from.y + to.y) / 2}, ${to.x} ${to.y - 35}`;
};
