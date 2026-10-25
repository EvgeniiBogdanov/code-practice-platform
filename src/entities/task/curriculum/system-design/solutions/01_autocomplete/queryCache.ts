export interface QueryCacheOptions {
  maxSize: number;
  ttlMs: number;
}

export interface QueryCache<V> {
  get: (key: string) => V | undefined;
  set: (key: string, value: V) => void;
  size: () => number;
}

interface Entry<V> {
  value: V;
  expiresAt: number;
}

export function createQueryCache<V>({ maxSize, ttlMs }: QueryCacheOptions): QueryCache<V> {
  // Map помнит порядок вставки: первая запись — самая давно использованная.
  const entries = new Map<string, Entry<V>>();

  const isExpired = (entry: Entry<V>): boolean => entry.expiresAt <= Date.now();

  const get = (key: string): V | undefined => {
    const entry = entries.get(key);
    if (!entry) return undefined;
    if (isExpired(entry)) {
      entries.delete(key);
      return undefined;
    }
    entries.delete(key);
    entries.set(key, entry);
    return entry.value;
  };

  const set = (key: string, value: V): void => {
    entries.delete(key);
    entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    while (entries.size > maxSize) {
      const oldest = entries.keys().next().value;
      if (oldest === undefined) break;
      entries.delete(oldest);
    }
  };

  const size = (): number => {
    for (const [key, entry] of entries) {
      if (isExpired(entry)) entries.delete(key);
    }
    return entries.size;
  };

  return { get, set, size };
}
