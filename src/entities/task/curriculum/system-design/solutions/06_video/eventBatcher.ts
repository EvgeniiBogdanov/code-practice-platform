export interface EventBatcherOptions<E> {
  send: (batch: E[]) => Promise<void>;
  maxBatch: number;
  flushMs: number;
  maxQueue: number;
}

export interface EventBatcher<E> {
  track: (event: E) => void;
  flush: () => Promise<void>;
}

export function createEventBatcher<E>({
  send,
  maxBatch,
  flushMs,
  maxQueue,
}: EventBatcherOptions<E>): EventBatcher<E> {
  const queue: E[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inflight: Promise<void> | null = null;
  // Пока отправка идёт, flush просит её забрать и неполные пачки.
  let sendAll = false;

  const trim = (): void => {
    if (queue.length > maxQueue) queue.splice(0, queue.length - maxQueue);
  };

  const clearTimer = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };

  const schedule = (): void => {
    if (timer === null && queue.length > 0) timer = setTimeout(() => void run(true), flushMs);
  };

  const drain = async (): Promise<void> => {
    while (queue.length >= maxBatch || (sendAll && queue.length > 0)) {
      const batch = queue.splice(0, maxBatch);
      try {
        await send(batch);
      } catch {
        // Пачка возвращается в начало: порядок событий не нарушается.
        queue.unshift(...batch);
        trim();
        break;
      }
    }
    sendAll = false;
    if (queue.length === 0) clearTimer();
    schedule();
  };

  const run = (all: boolean): Promise<void> => {
    if (all) {
      sendAll = true;
      clearTimer();
    }
    if (!inflight) {
      inflight = drain().finally(() => {
        inflight = null;
      });
    }
    return inflight;
  };

  const track = (event: E): void => {
    queue.push(event);
    trim();
    if (queue.length >= maxBatch) void run(false);
    else schedule();
  };

  return { track, flush: () => run(true) };
}
