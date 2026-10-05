import type { TracePlayback } from "./useTracePlayback";

export interface TraceControlsProps {
  readonly playback: TracePlayback;
  readonly length: number;
}
