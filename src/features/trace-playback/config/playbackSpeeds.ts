export const PLAYBACK_SPEEDS: readonly number[] = [0.5, 1, 1.5, 2];
export const DEFAULT_PLAYBACK_SPEED = 1;
export const PLAYBACK_SPEED_STORAGE_KEY = "playground_visualizer_playback_speed";

export const getInitialPlaybackSpeed = (): number => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return DEFAULT_PLAYBACK_SPEED;
  }
  try {
    const raw = localStorage.getItem(PLAYBACK_SPEED_STORAGE_KEY);
    if (!raw) return DEFAULT_PLAYBACK_SPEED;
    const parsed = Number(raw);
    return PLAYBACK_SPEEDS.includes(parsed) ? parsed : DEFAULT_PLAYBACK_SPEED;
  } catch {
    return DEFAULT_PLAYBACK_SPEED;
  }
};

export const persistPlaybackSpeed = (speed: number): void => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  try {
    if (PLAYBACK_SPEEDS.includes(speed)) {
      localStorage.setItem(PLAYBACK_SPEED_STORAGE_KEY, String(speed));
    }
  } catch {
    // ignore storage quota / security errors
  }
};
