import { clsx } from "clsx";
import type { JSX } from "react";
import type { StackFrameProps } from "./stack-scene";
import styles from "./UiStackScene.module.css";

export const StackFrame = ({
  stacks,
  action,
  after,
  floor,
  stepId,
  marker,
}: StackFrameProps): JSX.Element => (
  <g>
    {stacks.map((stack, lane) => {
      const x = 54 + lane * 208;
      const item = action?.items.find((item) => item.lane === lane);
      const top = floor - stack.values.length * 34;
      return (
        <g key={lane} transform={`translate(${x},0)`}>
          <text className={styles.laneLabel} x="58" y="68" textAnchor="middle">
            {stack.label}
          </text>
          <path
            className={styles.container}
            d={`M 0 106 V ${floor + 6} Q 0 ${floor + 14} 8 ${floor + 14} H 108 Q 116 ${floor + 14} 116 ${floor + 6} V 106`}
          />
          {stack.values.map((value, index) => {
            const isTop = index === stack.values.length - 1;
            const entering = after && item && action?.kind === "push" && isTop;
            const removing = !after && item && action?.kind === "pop" && isTop;
            return (
              <g key={index} transform={`translate(6,${floor - (index + 1) * 34})`}>
                <g
                  key={entering ? stepId : "tile"}
                  className={clsx(
                    styles.tile,
                    isTop && styles.topTile,
                    removing && styles.removing,
                    entering && styles.entering
                  )}
                >
                  <rect width="104" height="29" rx="5" />
                  <text x="52" y="15" textAnchor="middle" dominantBaseline="central">
                    {value === "" ? '""' : value === " " ? "␣" : value}
                  </text>
                </g>
              </g>
            );
          })}
          {stack.values.length ? (
            <g className={styles.topMarker}>
              <path d={`M 159 ${top + 14} H 124`} markerEnd={`url(#${marker})`} />
              <text x="163" y={top + 18}>
                top
              </text>
            </g>
          ) : (
            <text className={styles.empty} x="58" y={floor - 30} textAnchor="middle">
              пусто
            </text>
          )}
          <text className={styles.bottomLabel} x="58" y={floor + 39} textAnchor="middle">
            дно · {stack.values.length} эл.
          </text>
          {after && item && action?.kind === "push" && (
            <path
              className={styles.pushArrow}
              d={`M 11 83 Q 58 72 58 ${top - 7}`}
              markerEnd={`url(#${marker})`}
            />
          )}
          {after && item && action?.kind === "pop" && (
            <g key={`out-${stepId}`}>
              <path
                className={styles.popArrow}
                d={`M 62 ${top - 7} Q 142 90 148 79`}
                markerEnd={`url(#${marker})`}
              />
              <g transform="translate(125,88)">
                <g className={clsx(styles.tile, styles.removing, styles.leaving)}>
                  <rect width="72" height="29" rx="5" />
                  <text x="36" y="15" textAnchor="middle" dominantBaseline="central">
                    {item.value}
                  </text>
                </g>
              </g>
              <text className={styles.removedLabel} x="161" y="137" textAnchor="middle">
                извлечён
              </text>
            </g>
          )}
          {after && item && action?.kind === "peek" && (
            <text className={styles.readLabel} x="58" y="91" textAnchor="middle">
              читаем {item.value}
            </text>
          )}
        </g>
      );
    })}
  </g>
);
