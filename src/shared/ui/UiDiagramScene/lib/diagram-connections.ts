import {
  ConeGeometry,
  CubicBezierCurve3,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type Sprite,
} from "three";
import { makeLabel, type ScenePalette } from "../../../lib/three-scene";
import type { DiagramEdge } from "../diagram-scene";

export interface DiagramConnection {
  group: Group;
  curve: CubicBezierCurve3;
  pulse?: Mesh;
  from: string;
  to: string;
  update: (from: Vector3, to: Vector3) => void;
}
// Route returning links above the chain, including self-loops. Endpoints stay outside nodes.
export const connectionCurve = (from: Vector3, to: Vector3): CubicBezierCurve3 => {
  const a = from.clone(),
    b = to.clone();
  a.z += 0.05;
  b.z += 0.05;
  if (Math.abs(a.y - b.y) < 0.1) {
    if (b.x > a.x) {
      a.x += 0.72;
      b.x -= 0.83;
      return new CubicBezierCurve3(a, a.clone().lerp(b, 0.33), a.clone().lerp(b, 0.66), b);
    }
    a.set(a.x + 0.35, a.y + 0.6, a.z);
    b.set(b.x - 0.35, b.y + 0.7, b.z);
    return new CubicBezierCurve3(
      a,
      a.clone().add(new Vector3(0.7, 1.3, 0.5)),
      b.clone().add(new Vector3(-0.7, 1.3, 0.5)),
      b
    );
  }
  const direction = b.y < a.y ? -1 : 1;
  a.y += direction * 0.62;
  b.y -= direction * 0.78;
  const middle = (a.y + b.y) / 2;
  return new CubicBezierCurve3(a, new Vector3(a.x, middle, a.z), new Vector3(b.x, middle, b.z), b);
};
export const makeConnection = (
  edge: DiagramEdge,
  from: Vector3,
  to: Vector3,
  highlighted: boolean,
  palette: ScenePalette
): DiagramConnection => {
  const curve = connectionCurve(from, to);
  const group = new Group();
  const color = highlighted ? palette.primary : palette.border;
  const material = new MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.4,
    emissive: color,
    emissiveIntensity: highlighted ? 0.5 : 0,
  });
  const tube = new Mesh(
    new TubeGeometry(curve, 28, highlighted ? 0.032 : 0.023, 6, false),
    material
  );
  tube.castShadow = true;
  group.add(tube);
  const arrow = new Mesh(new ConeGeometry(0.105, 0.23, 12), material.clone());
  arrow.position.copy(curve.getPoint(1));
  arrow.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), curve.getTangent(1));
  group.add(arrow);
  let label: Sprite | undefined;
  if (edge.label) {
    label = makeLabel(
      edge.label,
      highlighted ? palette.primary : palette.muted,
      palette.font,
      1.5,
      110
    );
    label.position.copy(curve.getPoint(0.5)).add(new Vector3(0, 0.26, 0.1));
    group.add(label);
  }
  const pulse = highlighted
    ? new Mesh(
        new SphereGeometry(0.065, 12, 8),
        new MeshStandardMaterial({
          color: palette.primary,
          emissive: palette.primary,
          emissiveIntensity: 1.4,
        })
      )
    : undefined;
  if (pulse) group.add(pulse);
  const previousFrom = from.clone(),
    previousTo = to.clone();
  const update = (start: Vector3, end: Vector3): void => {
    if (start.equals(previousFrom) && end.equals(previousTo)) return;
    previousFrom.copy(start);
    previousTo.copy(end);
    curve.copy(connectionCurve(start, end));
    tube.geometry.dispose();
    tube.geometry = new TubeGeometry(curve, 28, highlighted ? 0.032 : 0.023, 6, false);
    arrow.position.copy(curve.getPoint(1));
    arrow.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), curve.getTangent(1));
    label?.position.copy(curve.getPoint(0.5)).add(new Vector3(0, 0.26, 0.1));
  };
  return { group, curve, pulse, from: edge.from, to: edge.to, update };
};
