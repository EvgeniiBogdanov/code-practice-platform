import { memo, useEffect, useId, useRef, useState, type JSX } from "react";
import { clsx } from "clsx";
import { diagramPoint, diagramEdgePath, type UiDiagramSceneProps } from "./diagram-scene";
import styles from "./UiDiagramScene.module.css";

export const DiagramFallback = memo(
  ({
    label,
    stateLabels,
    nodes,
    edges,
    compact = false,
    reducedMotion = false,
    zoom = 1,
    onZoomChange,
  }: UiDiagramSceneProps): JSX.Element => {
    const marker = useId().replace(/:/g, "");
    const host = useRef<HTMLDivElement>(null);
    const current = useRef<SVGGElement>(null);
    const [viewportHeight, setViewportHeight] = useState(248);
    useEffect(() => {
      const element = host.current;
      if (!element || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => setViewportHeight(element.clientHeight));
      observer.observe(element);
      return (): void => observer.disconnect();
    }, []);
    const active = nodes.find((node) => node.state === "active");
    const points = new Map(nodes.map((node) => [node.id, diagramPoint(node, compact)]));
    const width = Math.max(300, ...[...points.values()].map(({ x }) => x + 90));
    const height = Math.max(210, ...[...points.values()].map(({ y }) => y + 82));
    const scale = zoom * Math.max(0.65, Math.min(1, viewportHeight / height));
    useEffect(() => {
      const viewport = host.current,
        node = current.current;
      if (!viewport || !node) return;
      const bounds = node.getBoundingClientRect(),
        visible = viewport.getBoundingClientRect();
      if (bounds.left < visible.left || bounds.right > visible.right)
        viewport.scrollLeft += bounds.left - visible.left - visible.width / 2 + bounds.width / 2;
      if (bounds.top < visible.top || bounds.bottom > visible.bottom)
        viewport.scrollTop += bounds.top - visible.top - visible.height / 2 + bounds.height / 2;
    }, [active?.id, active?.column, active?.row, scale]);
    return (
      <div>
        <div className={styles.heading}>{label}</div>
        <div
          ref={host}
          className={clsx(styles.viewport, reducedMotion && styles.still)}
          tabIndex={0}
          role="group"
          aria-label={`${label}. Масштаб: +, −, 0. Прокрутка в обе стороны.`}
          onKeyDown={(event) => {
            const delta =
              event.key === "+" || event.key === "="
                ? 0.25
                : event.key === "-" || event.key === "_"
                  ? -0.25
                  : 0;
            if (delta || event.key === "0") {
              event.preventDefault();
              onZoomChange?.(event.key === "0" ? 1 : Math.max(0.5, Math.min(2.5, zoom + delta)));
              if (event.key === "0" && host.current) {
                host.current.scrollLeft = 0;
                host.current.scrollTop = 0;
              }
            }
          }}
        >
          {nodes.length ? (
            <svg
              className={styles.diagram}
              width={width * scale}
              height={height * scale}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={label}
            >
              <title>{label}</title>
              <desc>
                {nodes
                  .map(
                    (node) =>
                      `${node.id}: ${node.value}, ${node.caption ?? ""}, ${node.state ?? ""}`
                  )
                  .join("; ")}
                . Связи: {edges.map((edge) => `${edge.from} → ${edge.to}`).join("; ")}
              </desc>
              <defs>
                <marker
                  id={marker}
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path className={styles.arrow} d="M 0 0 L 8 4 L 0 8 Z" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const from = points.get(edge.from),
                  to = points.get(edge.to);
                if (!from || !to) return null;
                return (
                  <g
                    key={`${edge.from}-${edge.to}`}
                    className={clsx(
                      styles.edge,
                      (edge.to === active?.id || edge.from === active?.id) && styles.activeEdge
                    )}
                  >
                    <path d={diagramEdgePath(from, to)} markerEnd={`url(#${marker})`} />
                    {edge.label && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={from.y === to.y ? from.y - 10 : (from.y + to.y) / 2}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {nodes.map((node) => {
                const point = points.get(node.id)!;
                return (
                  <g
                    key={node.id}
                    ref={node.id === active?.id ? current : undefined}
                    transform={`translate(${point.x},${point.y})`}
                    className={clsx(styles.node, node.state && styles[node.state])}
                    data-node-id={node.id}
                    data-state={node.state}
                  >
                    <title>{`${node.caption ?? node.id}: ${node.value}`}</title>
                    {node.shape === "circle" ? (
                      <circle className={styles.shape} r="29" />
                    ) : node.shape === "diamond" ? (
                      <path className={styles.shape} d="M 0 -32 L 38 0 L 0 32 L -38 0 Z" />
                    ) : (
                      <rect
                        className={styles.shape}
                        x="-36"
                        y="-26"
                        width="72"
                        height="52"
                        rx="10"
                      />
                    )}
                    <text className={styles.value} textAnchor="middle" dominantBaseline="central">
                      {node.value === "" ? '""' : node.value === " " ? "␣" : node.value}
                    </text>
                    <text className={styles.caption} y="49" textAnchor="middle">
                      {node.caption}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className={styles.empty}>∅ Структура пуста</div>
          )}
        </div>
        <div className={styles.legend} aria-label="Легенда состояния узлов">
          <span className={styles.active}>● {stateLabels?.active ?? "Текущий"}</span>
          <span className={styles.frontier}>● {stateLabels?.frontier ?? "Ожидает"}</span>
          <span className={styles.done}>● {stateLabels?.done ?? "Обработан"}</span>
          <span className={styles.rejected}>● {stateLabels?.rejected ?? "Отсечён"}</span>
        </div>
      </div>
    );
  }
);
