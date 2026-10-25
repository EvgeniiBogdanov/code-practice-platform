/** Deterministic virtual clock for drill tests: replaces setTimeout/setInterval/Date.now. */

/** Fixed start so `Date.now()` is never 0 (a falsy timestamp hides bugs). */
export const CLOCK_START_MS = 1_700_000_000_000;

/** Microtask hops after each batch of timers: enough for chains of `await`s in the solution. */
const MICROTASK_FLUSH_DEPTH = 25;
/** A runaway `setInterval` would never let `runAll` finish. */
const MAX_FIRED_TIMERS = 10_000;

interface ScheduledTimer {
  id: number;
  at: number;
  seq: number;
  callback: () => void;
  /** Present for `setInterval`. */
  intervalMs: number | null;
}

export interface DrillClock {
  now: () => number;
  /** Moves time forward, firing due timers in order. Await it: promise callbacks run in between. */
  tick: (ms: number) => Promise<void>;
  /** Fires timers until none are left. Throws if timers keep rescheduling themselves. */
  runAll: () => Promise<void>;
  /** Number of timers waiting to fire. */
  pendingCount: () => number;
  reset: () => void;
  setTimeout: (callback: unknown, delay?: number, ...args: unknown[]) => number;
  clearTimeout: (id: unknown) => void;
  setInterval: (callback: unknown, delay?: number, ...args: unknown[]) => number;
  clearInterval: (id: unknown) => void;
}

export const flushMicrotasks = async (): Promise<void> => {
  for (let i = 0; i < MICROTASK_FLUSH_DEPTH; i++) await Promise.resolve();
};

export const createDrillClock = (): DrillClock => {
  let now = CLOCK_START_MS;
  let nextId = 1;
  let seq = 0;
  const timers = new Map<number, ScheduledTimer>();

  const schedule = (
    callback: unknown,
    delay: number | undefined,
    args: unknown[],
    isInterval: boolean
  ): number => {
    const id = nextId++;
    const ms = Math.max(0, Number(delay) || 0);
    timers.set(id, {
      id,
      at: now + ms,
      seq: seq++,
      intervalMs: isInterval ? Math.max(1, ms) : null,
      callback: () => {
        if (typeof callback === "function") callback(...args);
      },
    });
    return id;
  };

  const cancel = (id: unknown): void => {
    if (typeof id === "number") timers.delete(id);
  };

  const nextDue = (limit: number): ScheduledTimer | null => {
    let best: ScheduledTimer | null = null;
    for (const timer of timers.values()) {
      if (timer.at > limit) continue;
      if (!best || timer.at < best.at || (timer.at === best.at && timer.seq < best.seq)) {
        best = timer;
      }
    }
    return best;
  };

  let fired = 0;
  const fireNext = (limit: number): boolean => {
    const timer = nextDue(limit);
    if (!timer) return false;
    if (++fired > MAX_FIRED_TIMERS) {
      throw new Error(`Сработало более ${MAX_FIRED_TIMERS} таймеров: возможно, таймер бесконечен.`);
    }
    now = timer.at;
    if (timer.intervalMs === null) {
      timers.delete(timer.id);
    } else {
      timer.at += timer.intervalMs;
      timer.seq = seq++;
    }
    timer.callback();
    return true;
  };

  /** Due timers run synchronously first, so an un-awaited `tick` still fires simple callbacks. */
  const advance = async (limit: number): Promise<void> => {
    fired = 0;
    do {
      let hasFired = true;
      while (hasFired) hasFired = fireNext(limit);
      await flushMicrotasks();
    } while (nextDue(limit));
  };

  return {
    now: () => now,
    tick: async (ms) => {
      const target = now + Math.max(0, Number(ms) || 0);
      await advance(target);
      now = target;
    },
    runAll: () => advance(Number.POSITIVE_INFINITY),
    pendingCount: () => timers.size,
    reset: () => {
      timers.clear();
      now = CLOCK_START_MS;
    },
    setTimeout: (callback, delay, ...args) => schedule(callback, delay, args, false),
    clearTimeout: cancel,
    setInterval: (callback, delay, ...args) => schedule(callback, delay, args, true),
    clearInterval: cancel,
  };
};

export type ClockDateConstructor = Pick<DateConstructor, "now" | "parse" | "UTC"> &
  (new (...args: unknown[]) => Date);

/** `Date` bound to the clock: `new Date()` and `Date.now()` read virtual time. */
export const createClockDate = (clock: Pick<DrillClock, "now">): ClockDateConstructor => {
  class ClockDate extends Date {
    constructor(...args: unknown[]) {
      if (args.length === 0) super(clock.now());
      else super(...(args as ConstructorParameters<DateConstructor>));
    }

    static now(): number {
      return clock.now();
    }
  }
  return ClockDate;
};
