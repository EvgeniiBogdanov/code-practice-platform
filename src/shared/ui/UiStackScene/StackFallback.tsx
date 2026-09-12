import { memo, useId, type JSX } from "react";
import { clsx } from "clsx";
import { StackFrame } from "./StackFrame";
import type { UiStackSceneProps } from "./stack-scene";
import styles from "./UiStackScene.module.css";

/** SVG scheme of the same frame, shown when WebGL is unavailable. */
export const StackFallback = memo(
  ({
    stacks,
    action,
    stepId,
    reducedMotion,
    zoom = 1,
    onZoomChange,
  }: UiStackSceneProps): JSX.Element => {
    const marker = useId().replace(/:/g, "");
    const count = Math.max(
      4,
      ...stacks.map((stack) => stack.values.length),
      ...(action?.before.map((stack) => stack.values.length) ?? [])
    );
    const floor = 118 + count * 34;
    const frameWidth = 58 + stacks.length * 208;
    const width = action ? frameWidth * 2 + 60 : frameWidth;
    const height = floor + 62;
    const scale = zoom * (stacks.length > 1 ? 0.8 : 1);
    const operation =
      action?.kind === "push" ? "PUSH" : action?.kind === "pop" ? "POP" : "TOP / GET MIN";
    const description = !action
      ? "Последним положили → первым достали. Добавляем и снимаем только сверху."
      : action.kind === "push"
        ? "Добавляем новый элемент поверх остальных. Он становится вершиной top."
        : action.kind === "pop"
          ? "Снимаем только верхний элемент. Следующий под ним становится top."
          : "Читаем вершину, не извлекая элемент. Содержимое стека не меняется.";
    return (
      <section
        className={clsx(styles.scene, reducedMotion && styles.still)}
        aria-label="Стек · push и pop"
      >
        <div className={styles.heading}>
          <strong>
            {action
              ? `${operation}${action.items.length === 1 ? `(${action.items[0].value})` : ""}`
              : "СТЕК · LIFO"}
          </strong>
          <span>{description}</span>
        </div>
        <div
          className={styles.viewport}
          tabIndex={0}
          role="group"
          aria-label="Сцена стека. Масштаб: +, −, 0. Прокрутка в обе стороны."
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
            }
          }}
        >
          <svg
            className={styles.diagram}
            width={width * scale}
            height={height * scale}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={action ? `${operation}: до и после операции` : "Пустой или текущий стек"}
          >
            <title>
              {action ? `${operation}: до и после операции` : "Текущее состояние стека"}
            </title>
            <desc>
              {stacks
                .map(
                  (stack) =>
                    `${stack.label}: снизу вверх ${JSON.stringify(stack.values)}; top: ${stack.values.at(-1) ?? "пусто"}`
                )
                .join(". ")}
            </desc>
            <defs>
              <marker id={marker} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path className={styles.arrowHead} d="M 0 0 L 6 3 L 0 6 Z" />
              </marker>
            </defs>
            {action ? (
              <>
                <text className={styles.frameLabel} x={frameWidth / 2} y="28" textAnchor="middle">
                  ДО ОПЕРАЦИИ
                </text>
                <StackFrame
                  stacks={action.before}
                  action={action}
                  after={false}
                  floor={floor}
                  stepId={stepId}
                  marker={marker}
                />
                <g className={styles.operationArrow}>
                  <path
                    d={`M ${frameWidth - 6} 180 H ${frameWidth + 38}`}
                    markerEnd={`url(#${marker})`}
                  />
                </g>
                <g transform={`translate(${frameWidth + 60},0)`}>
                  <text className={styles.frameLabel} x={frameWidth / 2} y="28" textAnchor="middle">
                    ПОСЛЕ ОПЕРАЦИИ
                  </text>
                  <StackFrame
                    stacks={stacks}
                    action={action}
                    after
                    floor={floor}
                    stepId={stepId}
                    marker={marker}
                  />
                </g>
              </>
            ) : (
              <>
                <text className={styles.frameLabel} x={frameWidth / 2} y="28" textAnchor="middle">
                  ТЕКУЩЕЕ СОСТОЯНИЕ
                </text>
                <StackFrame stacks={stacks} after floor={floor} stepId={stepId} marker={marker} />
              </>
            )}
          </svg>
        </div>
      </section>
    );
  }
);
