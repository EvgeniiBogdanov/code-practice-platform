import type { TracePlayback } from "./use-trace-playback";

export interface TraceControlsProps {
  readonly playback: TracePlayback;
  readonly length: number;
}
