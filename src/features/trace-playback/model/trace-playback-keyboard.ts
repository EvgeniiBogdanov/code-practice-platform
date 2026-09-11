import type { KeyboardEvent } from "react";
import type { TracePlayback } from "./use-trace-playback";

export const handlePlaybackKey = (
  event: KeyboardEvent<HTMLDivElement>,
  playback: TracePlayback,
  length: number
): void => {
  if (event.target !== event.currentTarget) return;
  if (!["ArrowLeft", "ArrowRight", " ", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === " ") playback.toggle();
  else
    playback.seek(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? length - 1
          : playback.index + (event.key === "ArrowRight" ? 1 : -1)
    );
};
