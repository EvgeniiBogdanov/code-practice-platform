import { memo, useEffect, useRef, useState, type JSX } from "react";
import { clsx } from "clsx";
import { Button } from "../Button";
import type { UiStackSceneProps } from "./stack-scene";
import type { StackController } from "./lib/create-stack-scene";
import { StackFallback } from "./StackFallback";
import styles from "./UiStackScene.module.css";

const sceneText = (props: UiStackSceneProps): string =>
  props.stacks
    .map(
      (stack) =>
        `${stack.label}: снизу вверх ${JSON.stringify(stack.values)}; top: ${stack.values.at(-1) ?? "пусто"}`
    )
    .join(". ");

export const UiStackScene = memo((props: UiStackSceneProps): JSX.Element => {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<StackController | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [attempt, setAttempt] = useState(0);
  const failed = status === "unavailable";
  useEffect(() => {
    if (failed) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void import("./lib/create-stack-scene")
        .then(({ createStackScene }) => {
          if (cancelled || !host.current) return;
          controller.current = createStackScene(host.current, latest.current, () => {
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
  }, [failed, attempt]);
  useEffect(() => {
    try {
      controller.current?.update(props);
    } catch {
      setStatus("unavailable");
    }
  }, [props]);

  const { action, stacks } = props;
  const operation =
    action?.kind === "push" ? "PUSH" : action?.kind === "pop" ? "POP" : "TOP / GET MIN";

  if (failed)
    return (
      <>
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
        <StackFallback {...props} />
      </>
    );
  return (
    <section className={styles.stage} aria-label="Стек · push и pop">
      <div
        ref={host}
        className={clsx(styles.webgl, status === "loading" && styles.loading)}
        tabIndex={0}
        role="group"
        aria-label="Сцена стека. 3D: перетаскивание — поворот, правая кнопка — сдвиг. Масштаб: +, −, 0."
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
        <div
          className={styles.srOnly}
          role="img"
          aria-label={action ? `${operation}: состояние стека` : "Текущее состояние стека"}
        >
          {sceneText(props)}
        </div>
      </div>
      <div className={styles.sceneFooter}>
        <span className={styles.gestureHint}>
          Потяните — поворот · ПКМ / 2 пальца — сдвиг · 0 — сброс
        </span>
        <div className={styles.legend} aria-label="Легенда сцены стека">
          <span className={styles.legendTop}>вершина</span>
          <span className={styles.legendOut}>извлечён</span>
          {stacks.length > 1 && <span className={styles.legendMin}>{stacks[1].label}</span>}
        </div>
      </div>
    </section>
  );
});
