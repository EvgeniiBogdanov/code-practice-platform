import { describe, expect, it } from "vitest";
import type { TraceStep } from "@/entities/algorithm-trace";
import { computePanelCapacities } from "./trace-panel-slots";

describe("computePanelCapacities", () => {
  it("returns empty array for undefined or empty steps", () => {
    expect(computePanelCapacities()).toEqual([]);
    expect(computePanelCapacities([])).toEqual([]);
  });

  it("calculates max entries and structural keys across steps", () => {
    const steps: TraceStep[] = [
      {
        id: "s0",
        line: "const prefix",
        title: "Init",
        explanation: "empty",
        values: [2, 7],
        pointers: [],
        panels: [
          {
            kind: "prefix",
            label: "Prefix",
            entries: [],
          },
        ],
      },
      {
        id: "s1",
        line: "prefix.push",
        title: "Step 1",
        explanation: "first",
        values: [2, 7],
        pointers: [],
        panels: [
          {
            kind: "prefix",
            label: "Prefix",
            entries: [{ key: "P[0]", value: "2" }],
          },
        ],
      },
      {
        id: "s2",
        line: "prefix.push",
        title: "Step 2",
        explanation: "second",
        values: [2, 7],
        pointers: [],
        panels: [
          {
            kind: "prefix",
            label: "Prefix",
            entries: [
              { key: "P[0]", value: "2" },
              { key: "P[1]", value: "9" },
            ],
          },
        ],
      },
    ];

    const capacities = computePanelCapacities(steps);
    expect(capacities).toHaveLength(1);
    expect(capacities[0].maxCount).toBe(2);
    expect(capacities[0].placeholders).toEqual([
      { key: "P[0]", value: "—" },
      { key: "P[1]", value: "—" },
    ]);
  });

  it("preserves upcoming keys in placeholders to prevent layout shift and reserve geometry", () => {
    const steps: TraceStep[] = [
      {
        id: "s0",
        line: "const map",
        title: "Init",
        explanation: "empty",
        values: [2, 7],
        pointers: [],
        panels: [
          {
            kind: "buckets",
            label: "Map",
            entries: [],
          },
        ],
      },
      {
        id: "s1",
        line: "map.set",
        title: "Set",
        explanation: "set",
        values: [2, 7],
        pointers: [],
        panels: [
          {
            kind: "buckets",
            label: "Map",
            entries: [{ key: "a", value: "1" }],
          },
        ],
      },
    ];

    const capacities = computePanelCapacities(steps);
    expect(capacities[0].maxCount).toBe(1);
    expect(capacities[0].placeholders).toEqual([{ key: "a", value: "—" }]);
  });

  it("falls back to em-dash when no keys are found across steps", () => {
    const steps: TraceStep[] = [
      {
        id: "s0",
        line: "init",
        title: "Init",
        explanation: "empty",
        values: [],
        pointers: [],
        panels: [
          {
            kind: "buckets",
            label: "Map",
            entries: [],
          },
        ],
      },
    ];

    const capacities = computePanelCapacities(steps);
    expect(capacities).toEqual([
      {
        maxCount: 0,
        placeholders: [],
      },
    ]);
  });
});
