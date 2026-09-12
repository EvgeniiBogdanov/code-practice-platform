import { memo, useEffect, useRef, useState, type JSX } from "react";
import { clsx } from "clsx";
import { Button } from "../Button";
import type { UiDiagramSceneProps } from "./diagram-scene";
import type { DiagramController } from "./lib/create-diagram-scene";
import { DiagramFallback } from "./DiagramFallback";
import styles from "./UiDiagramScene.module.css";

export const UiDiagramScene = memo((props: UiDiagramSceneProps): JSX.Element => {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<DiagramController | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [attempt, setAttempt] = useState(0);
  const empty = props.nodes.length === 0;
  const failed = status === "unavailable";
  useEffect(() => {
    if (empty || failed) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void import("./lib/create-diagram-scene")
        .then(({ createDiagramScene }) => {
          if (cancelled || !host.current) return;
          controller.current = createDiagramScene(host.current, latest.current, () => {
            if (!cancelled) setStatus("unavailable");
          });
          setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("unavailable");
        });
    });
    return (): void => {
      cancelled = true;
      cancelAnimationFrame(frame);
      controller.current?.dispose();
      controller.current = null;
    };
  }, [empty, failed, attempt]);
  useEffect(() => {
    try {
      controller.current?.update(props);
    } catch {
      setStatus("unavailable");
    }
  }, [props]);

  if (failed || empty)
    return (
      <>
        {failed && (
          <div className={styles.recovery} role="status">
            <span>3D недоступно. Показана схема.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatus("loading");
                setAttempt((value) => value + 1);
              }}
            >
              Повторить 3D
            </Button>
          </div>
        )}
        <DiagramFallback {...props} />
      </>
    );
  return (
    <div className={styles.stage}>
      <div className={styles.heading}>
        <span>{props.label}</span>
        <span className={styles.dimension}>3D</span>
      </div>
      <div
        ref={host}
        className={clsx(styles.webgl, status === "loading" && styles.loading)}
        tabIndex={0}
        role="group"
        aria-label={`${props.label}. 3D: перетаскивание — поворот, правая кнопка — сдвиг. Масштаб: +, −, 0.`}
        onKeyDown={(event) => {
          const delta =
            event.key === "+" || event.key === "="
              ? 0.25
              : event.key === "-" || event.key === "_"
                ? -0.25
                : 0;
          if (delta || event.key === "0") {
            event.preventDefault();
            if (event.key === "0") controller.current?.reset();
            props.onZoomChange?.(
              event.key === "0" ? 1 : Math.max(0.5, Math.min(2.5, (props.zoom ?? 1) + delta))
            );
          }
        }}
      >
        {status === "loading" && (
          <span className={styles.loadingText} role="status">
            Подготовка 3D-сцены…
          </span>
        )}
        <div className={styles.srOnly} role="img" aria-label={props.label}>
          {props.nodes
            .map((node) => `${node.id}: ${node.value}, ${node.caption ?? ""}, ${node.state ?? ""}`)
            .join("; ")}
          . Связи: {props.edges.map((edge) => `${edge.from} → ${edge.to}`).join("; ")}
        </div>
      </div>
      <div className={styles.sceneFooter}>
        <span className={styles.gestureHint}>
          Потяните — поворот · ПКМ / 2 пальца — сдвиг · 0 — сброс
        </span>
        <div className={styles.legend} aria-label="Легенда состояния узлов">
          <span className={styles.active}>● {props.stateLabels?.active ?? "Текущий"}</span>
          <span className={styles.frontier}>● {props.stateLabels?.frontier ?? "Ожидает"}</span>
          <span className={styles.done}>● {props.stateLabels?.done ?? "Обработан"}</span>
          <span className={styles.rejected}>● {props.stateLabels?.rejected ?? "Отсечён"}</span>
        </div>
      </div>
    </div>
  );
});
