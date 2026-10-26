export interface Throttled<A extends unknown[]> {
  call: (...args: A) => void;
  cancel: () => void;
}

export function createThrottle<A extends unknown[]>(
  fn: (...args: A) => void,
  intervalMs: number
): Throttled<A> {
  // Идёт ли окно: пока таймер активен, вызовы только запоминаются.
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: A | null = null;

  const openWindow = (): void => {
    timer = setTimeout(closeWindow, intervalMs);
  };

  const closeWindow = (): void => {
    timer = null;
    if (pendingArgs === null) return;
    const args = pendingArgs;
    pendingArgs = null;
    fn(...args);
    openWindow();
  };

  const call = (...args: A): void => {
    if (timer === null) {
      fn(...args);
      openWindow();
      return;
    }
    pendingArgs = args;
  };

  const cancel = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    pendingArgs = null;
  };

  return { call, cancel };
}
