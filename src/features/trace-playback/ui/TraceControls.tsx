import { PLAYBACK_SPEEDS } from "../config/playback-speeds";
import type { JSX } from "react";
import { UiRange, UiSelect } from "@/shared/ui";
import type { TraceControlsProps } from "../model/trace-controls";
import { TraceTransport } from "./TraceTransport";
import styles from "./TraceControls.module.css";

export const TraceControls = ({ playback, length }: TraceControlsProps): JSX.Element => (
  <div className={styles.controls}>
    <TraceTransport playback={playback} length={length} />
    <UiRange
      className={styles.timeline}
      min={0}
      max={length - 1}
      value={playback.index}
      onChange={(event) => playback.seek(Number(event.target.value))}
      aria-label="Шаг алгоритма"
      aria-valuetext={`Шаг ${playback.index + 1} из ${length}`}
    />
    <span className={styles.stepCount}>
      {playback.index + 1}
      <span className={styles.muted}> / {length}</span>
    </span>
    <UiSelect
      controlSize="sm"
      className={styles.speed}
      value={playback.speed}
      onChange={(event) => playback.setSpeed(Number(event.target.value))}
      aria-label="Скорость воспроизведения"
    >
      {PLAYBACK_SPEEDS.map((speed) => (
        <option key={speed} value={speed}>
          {speed}×
        </option>
      ))}
    </UiSelect>
  </div>
);
