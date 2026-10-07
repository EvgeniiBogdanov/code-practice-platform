import type { TraceNodeState, TraceStructure } from "./algorithmTrace";

export type GraphEdge = readonly [number, number];

export interface GraphLayout {
  readonly ids: readonly number[];
  readonly position: ReadonlyMap<number, { column: number; row: number }>;
}

// Слои — самый длинный путь от источника. Узлы цикла не получают слой и уходят в нижний ряд.
export const layeredLayout = (ids: readonly number[], pairs: readonly GraphEdge[]): GraphLayout => {
  const indegree = new Map(ids.map((id) => [id, 0]));
  pairs.forEach(([, to]) => indegree.set(to, (indegree.get(to) ?? 0) + 1));
  const layer = new Map<number, number>();
  const queue = ids.filter((id) => indegree.get(id) === 0);
  queue.forEach((id) => layer.set(id, 0));
  for (let head = 0; head < queue.length; head++) {
    const id = queue[head];
    pairs
      .filter(([from]) => from === id)
      .forEach(([, to]) => {
        layer.set(to, Math.max(layer.get(to) ?? 0, (layer.get(id) ?? 0) + 1));
        indegree.set(to, (indegree.get(to) ?? 0) - 1);
        if (indegree.get(to) === 0) queue.push(to);
      });
  }
  const last = Math.max(-1, ...layer.values());
  const cyclic = ids.filter((id) => !layer.has(id));
  cyclic.forEach((id) => layer.set(id, last + 1));
  const rows = new Map<number, number[]>();
  ids.forEach((id) => rows.set(layer.get(id)!, [...(rows.get(layer.get(id)!) ?? []), id]));
  const widest = Math.max(...[...rows.values()].map((row) => row.length));
  const position = new Map<number, { column: number; row: number }>();
  rows.forEach((row, index) =>
    row.forEach((id, order) =>
      position.set(id, { column: order + (widest - row.length) / 2, row: index })
    )
  );
  return { ids, position };
};

export interface GraphView {
  readonly layout: GraphLayout;
  readonly edges: readonly GraphEdge[];
  readonly state: (id: number) => TraceNodeState | undefined;
  readonly caption: (id: number) => string;
}

export const graphScene = (label: string, view: GraphView): TraceStructure => ({
  kind: "graph",
  label,
  // compact ставит подпись под узлом: длинная подпись сбоку налезает на диск
  compact: true,
  nodes: view.layout.ids.map((id) => ({
    id: `c${id}`,
    value: id,
    column: view.layout.position.get(id)!.column,
    row: view.layout.position.get(id)!.row,
    caption: view.caption(id),
    shape: "circle",
    state: view.state(id),
  })),
  edges: view.edges.map(([from, to]) => ({ from: `c${from}`, to: `c${to}` })),
});
