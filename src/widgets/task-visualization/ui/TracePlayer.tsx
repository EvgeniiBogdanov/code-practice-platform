import type { JSX } from "react";
import { useUIStore } from "@/entities/ui-state";
import {
  TraceControls,
  useTracePlayback,
  handlePlaybackKey,
  AlgorithmTraceScene,
  TraceExplanation,
} from "@/features/trace-playback";
import type { TracePlayerProps } from "../model/visualizer-props";
import { getActiveCodeLine } from "../lib/active-code-line";
import { TraceCodeViewer } from "./TraceCodeViewer";
import { TraceLayout } from "./TraceLayout";
import styles from "./AlgorithmLab.module.css";

export const TracePlayer = ({
  steps,
  code,
  definition,
  isActive,
  isFullscreen = false,
  toolbar,
  inputs,
}: TracePlayerProps): JSX.Element => {
  const playback = useTracePlayback(steps.length, isActive);
  const step = steps[playback.index];
  const zoom = useUIStore((state) => state.visualizerZoom);
  const setZoom = useUIStore((state) => state.setVisualizerZoom);
  return (
    <div
      className={styles.player}
      tabIndex={0}
      role="group"
      onKeyDown={(event) => handlePlaybackKey(event, playback, steps.length)}
      aria-label="Проигрыватель алгоритма. Пробел — воспроизведение, стрелки — шаги, Home и End — начало и конец."
    >
      <TraceLayout
        fullscreen={isFullscreen}
        visual={
          <>
            {toolbar}
            {inputs}
            <AlgorithmTraceScene
              step={step}
              reducedMotion={playback.reducedMotion}
              definition={definition}
              zoom={zoom}
              onZoomChange={setZoom}
            />
            <TraceControls playback={playback} length={steps.length} />
            <TraceExplanation step={step} playing={playback.playing} />
          </>
        }
        code={
          <TraceCodeViewer
            code={code}
            activeLine={getActiveCodeLine(code, step)}
            className={styles.codeInspector}
          />
        }
      />
    </div>
  );
};
