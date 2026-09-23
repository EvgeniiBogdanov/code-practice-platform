import type { TraceStructure } from "./algorithm-trace";

export type GridMode = "islands" | "oranges" | "flood";

interface GridSceneInput {
  readonly grid: readonly (readonly number[])[];
  readonly mode: GridMode;
  readonly active: number;
  readonly queue: readonly number[];
  readonly head: number;
  readonly done: ReadonlySet<number>;
}

export const createGridScene = ({
  grid,
  mode,
  active,
  queue,
  head,
  done,
}: GridSceneInput): TraceStructure => {
  const width = grid[0]?.length ?? 0;
  const frontier = new Set(queue.slice(head));
  return {
    kind: "grid",
    label:
      mode === "islands"
        ? "Карта островов · 0 вода · 1 суша"
        : mode === "oranges"
          ? "Апельсины · 0 пусто · 1 свежий · 2 гнилой"
          : "Flood Fill · связная область одного цвета",
    nodes: grid.flatMap((row, r) =>
      row.map((value, c) => {
        const id = r * width + c;
        return {
          id: String(id),
          value,
          row: r,
          column: c,
          caption: `${r},${c}`,
          shape: mode === "oranges" && value !== 0 ? ("circle" as const) : ("box" as const),
          state:
            active === id
              ? ("active" as const)
              : frontier.has(id)
                ? ("frontier" as const)
                : done.has(id)
                  ? ("done" as const)
                  : mode !== "flood" && value === 0
                    ? ("muted" as const)
                    : mode === "oranges" && value === 2
                      ? ("rejected" as const)
                      : undefined,
        };
      })
    ),
    edges: [],
  };
};
