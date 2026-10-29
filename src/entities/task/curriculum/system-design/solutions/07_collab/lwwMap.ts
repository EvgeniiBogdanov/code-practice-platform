export interface LwwClock {
  counter: number;
  site: string;
}

export interface LwwOp<V> {
  key: string;
  value: V | null;
  clock: LwwClock;
}

export interface LwwMap<V> {
  set: (key: string, value: V) => LwwOp<V>;
  remove: (key: string) => LwwOp<V>;
  apply: (op: LwwOp<V>) => boolean;
  get: (key: string) => V | undefined;
  snapshot: () => Record<string, V>;
}

interface Entry<V> {
  value: V | null;
  clock: LwwClock;
}

/** Полный порядок на часах: одинаковый на всех копиях, поэтому победитель везде один. */
const isNewer = (a: LwwClock, b: LwwClock): boolean =>
  a.counter !== b.counter ? a.counter > b.counter : a.site > b.site;

export function createLwwMap<V>(site: string): LwwMap<V> {
  // Удалённый ключ остаётся записью со значением null: надгробие хранит часы удаления.
  const entries = new Map<string, Entry<V>>();
  let counter = 0;

  const write = (key: string, value: V | null): LwwOp<V> => {
    counter += 1;
    const op: LwwOp<V> = { key, value, clock: { counter, site } };
    entries.set(key, { value, clock: op.clock });
    return op;
  };

  const apply = (op: LwwOp<V>): boolean => {
    // Лэмпорт: следующая своя операция будет старше всего, что копия уже видела.
    counter = Math.max(counter, op.clock.counter);
    const current = entries.get(op.key);
    if (current && !isNewer(op.clock, current.clock)) return false;
    entries.set(op.key, { value: op.value, clock: op.clock });
    return true;
  };

  const snapshot = (): Record<string, V> => {
    const result: Record<string, V> = {};
    for (const [key, { value }] of entries) if (value !== null) result[key] = value;
    return result;
  };

  return {
    set: (key, value) => write(key, value),
    remove: (key) => write(key, null),
    apply,
    get: (key) => entries.get(key)?.value ?? undefined,
    snapshot,
  };
}
