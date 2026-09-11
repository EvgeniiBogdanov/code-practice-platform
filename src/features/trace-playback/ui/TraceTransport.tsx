import type { JSX } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { CodeButton } from "@/shared/ui";
import type { TraceControlsProps } from "../model/trace-controls";
import styles from "./TraceControls.module.css";

export const TraceTransport = ({ playback, length }: TraceControlsProps): JSX.Element => {
  const toggleLabel = playback.playing
    ? "Пауза"
    : playback.index === length - 1
      ? "Повторить"
      : "Смотреть";
  return (
    <div className={styles.transport}>
      <CodeButton
        aria-label="В начало"
        title="В начало"
        icon={<RotateCcw size={14} />}
        onClick={() => playback.seek(0)}
        disabled={playback.index === 0 && !playback.playing}
      />
      <CodeButton
        aria-label="Предыдущий шаг"
        title="Предыдущий шаг (←)"
        icon={<SkipBack size={14} />}
        disabled={playback.index === 0}
        onClick={() => playback.seek(playback.index - 1)}
      />
      <CodeButton
        variant="primary"
        icon={
          playback.playing ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" />
          )
        }
        onClick={playback.toggle}
        aria-label={toggleLabel}
        title={`${toggleLabel} (Пробел)`}
      />
      <CodeButton
        aria-label="Следующий шаг"
        title="Следующий шаг (→)"
        icon={<SkipForward size={14} />}
        disabled={playback.index === length - 1}
        onClick={() => playback.seek(playback.index + 1)}
      />
    </div>
  );
};
