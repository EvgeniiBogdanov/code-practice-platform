import { expect, it } from "vitest";
import { Vector3 } from "three";
import { connectionCurve } from "./diagram-connections";

it("keeps reversed links and self-loops outside the chain with finite tangents", () => {
  for (const target of [new Vector3(0, 0, 0), new Vector3(2.8, 0, 0)]) {
    const curve = connectionCurve(new Vector3(2.8, 0, 0), target);
    expect(curve.getPoint(0.5).y).toBeGreaterThan(1);
    expect(curve.getTangent(1).length()).toBeCloseTo(1);
    expect(curve.getPoint(0).distanceTo(curve.getPoint(1))).toBeGreaterThan(0.5);
  }
});
it("attaches forward and cross-row links outside the node faces in both directions", () => {
  for (const target of [
    new Vector3(2.8, 0, 0),
    new Vector3(2.8, -5, 0),
    new Vector3(2.8, 5, 0.42),
  ]) {
    const origin = new Vector3();
    const curve = connectionCurve(origin, target);
    expect(curve.getPoint(0).distanceTo(origin)).toBeGreaterThan(0.6);
    expect(curve.getPoint(1).distanceTo(target)).toBeGreaterThan(0.7);
    expect(curve.getTangent(1).length()).toBeCloseTo(1);
  }
});
